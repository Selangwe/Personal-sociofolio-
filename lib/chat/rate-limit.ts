import 'server-only';

import { createHash } from 'node:crypto';
import { getAdminClient } from '@/lib/supabase/admin';
import {
  CHAT_IP_DAILY_CAP,
  CHAT_IP_HOURLY_CAP,
  CHAT_IP_SALT,
  CHAT_MONTHLY_CAP,
} from '@/lib/chat/config';

/**
 * Spend control for a public endpoint that costs money per message.
 *
 * Two layers, because neither is sufficient alone:
 *
 * 1. A warm-instance memo. Free, instant, and honestly limited — it lives in one
 *    lambda instance's memory, resets on cold start, and Vercel will happily run
 *    several instances, so a determined attacker gets a multiple of the limit.
 *    It exists because it stops the same client hammering the same warm function,
 *    which is most accidental abuse, at zero cost.
 *
 * 2. A Supabase-backed durable counter. This is the real ceiling. Supabase is
 *    already provisioned with a service-role client and an RLS pattern, so it
 *    adds no new infrastructure, no new dashboard, and no new secret — which is
 *    why it beats Upstash or Vercel KV for a site doing single-digit
 *    conversations a day.
 *
 * Neither replaces setting a spend limit in the Anthropic Console. Everything
 * here is code we wrote; that one is enforced by the vendor.
 */

/** Hash the address so the table is a rate-limit ledger, not a visitor log. */
export function hashIp(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for');
  const ip =
    forwarded?.split(',')[0]?.trim() ||
    request.headers.get('x-real-ip') ||
    'unknown';

  return createHash('sha256').update(`${ip}:${CHAT_IP_SALT}`).digest('hex');
}

// ---------------------------------------------------------------------------
// Layer 1 — warm-instance memo
// ---------------------------------------------------------------------------

const BURST_WINDOW_MS = 60_000;
const BURST_MAX = 5;
const recent = new Map<string, number[]>();

export function passesBurstLimit(ipHash: string): boolean {
  const now = Date.now();
  const hits = (recent.get(ipHash) ?? []).filter(
    (at) => now - at < BURST_WINDOW_MS,
  );

  if (hits.length >= BURST_MAX) {
    recent.set(ipHash, hits);
    return false;
  }

  hits.push(now);
  recent.set(ipHash, hits);

  // Keep the map from growing without bound on a long-lived instance.
  // `forEach` rather than `for…of`: this project targets es5, where iterating a
  // Map directly needs --downlevelIteration.
  if (recent.size > 5000) {
    const stale: string[] = [];
    recent.forEach((times, key) => {
      if (times.every((at: number) => now - at >= BURST_WINDOW_MS)) stale.push(key);
    });
    stale.forEach((key) => recent.delete(key));
  }

  return true;
}

// ---------------------------------------------------------------------------
// Layer 2 — durable counter
// ---------------------------------------------------------------------------

export type AdmissionReason = 'ip-hour' | 'ip-day' | 'global' | 'burst';

export type Admission =
  | { allowed: true; eventId: string | null }
  | { allowed: false; reason: AdmissionReason };

/**
 * Checks the per-IP and global caps and records the attempt, in one round trip.
 *
 * Fails **open** on a database error: a Supabase outage should degrade to an
 * unmetered assistant rather than a broken one, because the caps in the
 * Anthropic Console are the backstop either way. Fails **closed** on the global
 * cap, which is the whole point of having one.
 */
export async function admit(ipHash: string): Promise<Admission> {
  const supabase = getAdminClient();

  if (!supabase) {
    // Not configured — the route will refuse for its own reasons.
    return { allowed: true, eventId: null };
  }

  const { data, error } = await supabase
    .rpc('chat_admit', {
      p_ip_hash: ipHash,
      p_hour_cap: CHAT_IP_HOURLY_CAP,
      p_day_cap: CHAT_IP_DAILY_CAP,
      p_month_cap: CHAT_MONTHLY_CAP,
    })
    .single<{ allowed: boolean; reason: AdmissionReason | null; event_id: string | null }>();

  if (error) {
    console.error('chat_admit failed, allowing request:', error.message);
    return { allowed: true, eventId: null };
  }

  if (!data?.allowed) {
    return { allowed: false, reason: data?.reason ?? 'global' };
  }

  return { allowed: true, eventId: data.event_id };
}

/**
 * Writes real token usage back onto the admission row.
 *
 * This is the only honest way to know in production whether prompt caching is
 * working: `cache_read` should be large and `input_tokens` small on every turn
 * after the first.
 */
export async function recordUsage(
  eventId: string | null,
  usage: {
    input_tokens: number;
    output_tokens: number;
    cache_read_input_tokens?: number | null;
  },
): Promise<void> {
  if (!eventId) return;

  const supabase = getAdminClient();
  if (!supabase) return;

  const { error } = await supabase
    .from('chat_events')
    .update({
      input_tokens: usage.input_tokens,
      output_tokens: usage.output_tokens,
      cache_read: usage.cache_read_input_tokens ?? 0,
    })
    .eq('id', eventId);

  if (error) console.error('chat usage update failed:', error.message);
}
