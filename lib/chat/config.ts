import { profile } from '@/lib/data';

/**
 * Every tunable for the chat assistant, in one place.
 *
 * The caps below are the actual spend control. Treat changing them as a budget
 * decision, not a config tweak.
 */

/**
 * Model id. One constant so switching tiers is a one-line change.
 *
 * `claude-sonnet-4-5` is the alias for `claude-sonnet-4-5-20250929`. Use the
 * alias, not the dated form.
 *
 * ## Two API constraints this model imposes — do not "restore" either
 *
 * 1. **No `output_config.effort`.** The effort ladder is not supported on
 *    Sonnet 4.5 and sending it returns a 400. The request in
 *    `app/api/chat/route.ts` deliberately omits it.
 * 2. **No adaptive thinking.** This model predates it; thinking here would mean
 *    `{ type: 'enabled', budget_tokens: N }`. We omit `thinking` entirely, which
 *    is the right call for a chat widget regardless — a bubble that pauses
 *    several seconds before its first word reads as broken.
 *
 * Sonnet 4.5 is a legacy model (still active). If you ever move to a current
 * one — `claude-sonnet-5`, `claude-opus-5` — both constraints above lift, and
 * adding `output_config: { effort: 'low' }` back is worth doing at that point.
 */
export const CHAT_MODEL = 'claude-sonnet-4-5';

/**
 * Deliberately small. This widget's job is a 2-4 sentence answer and one
 * question. A 64k-token reply in a chat bubble is not a feature, it's an
 * incident.
 */
export const CHAT_MAX_TOKENS = 1024;

/** Hard ceilings on request shape. Enforced server-side, not just in the UI. */
export const CHAT_MAX_MESSAGES = 24; // 12 visitor turns
export const CHAT_MAX_CHARS_PER_MESSAGE = 2000;
export const CHAT_MAX_TOTAL_CHARS = 12000;

/** Rate limits. Env-overridable so they can be tuned without a deploy. */
const int = (value: string | undefined, fallback: number) => {
  const parsed = Number.parseInt(value ?? '', 10);
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : fallback;
};

export const CHAT_IP_HOURLY_CAP = int(process.env.CHAT_IP_HOURLY_CAP, 8);
export const CHAT_IP_DAILY_CAP = int(process.env.CHAT_IP_DAILY_CAP, 30);

/**
 * The stop-loss. When this trips the widget degrades to pointing at the contact
 * form and the booking link — it stops calling the API rather than disappearing.
 *
 * Sized against ~$20/month on the model above with the knowledge base cached.
 * Raise it deliberately before promoting the site.
 */
export const CHAT_MONTHLY_CAP = int(process.env.CHAT_MONTHLY_CAP, 1500);

/**
 * Salt for hashing visitor IPs before they touch the database.
 *
 * We store `sha256(ip + salt)`, never the address itself, so the rate-limit
 * table isn't a log of who visited. Falls back to a constant in development;
 * set a real value in production or the hashes are guessable.
 */
export const CHAT_IP_SALT = process.env.CHAT_IP_SALT || 'dev-only-unsalted';

/**
 * The booking link.
 *
 * Lives here — NOT in the system prompt and NOT in the knowledge base. The
 * model never sees it. The route substitutes it into the `capture_lead` tool
 * result, so the only path to a visitor receiving this URL runs through a
 * successful qualification and a written lead row.
 *
 * The link is on the public page anyway; the point is that the gate is enforced
 * in code rather than by asking the model nicely.
 */
export const BOOKING_URL = profile.calendly;
