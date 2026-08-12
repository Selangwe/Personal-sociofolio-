'use client';

import { createClient, type SupabaseClient } from '@supabase/supabase-js';

/**
 * Browser Supabase client, used by the admin dashboard.
 *
 * Carries the anon key, which is public by design — it ships in the JS bundle.
 * Nothing here grants permission: every read and write is gated by the
 * row-level security policies in `supabase/schema.sql`, which pin writes to a
 * single user id. A signed-out visitor holding this key can read published
 * posts and nothing else.
 */

let cached: SupabaseClient | null | undefined;

export function getBrowserClient(): SupabaseClient | null {
  if (cached !== undefined) return cached;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // A single client instance keeps one auth session across the dashboard.
  cached = url && anonKey ? createClient(url, anonKey) : null;
  return cached;
}

/** True when the site has been pointed at a Supabase project. */
export function isSupabaseConfigured(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  );
}
