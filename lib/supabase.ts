import { createClient, type SupabaseClient } from '@supabase/supabase-js';

/**
 * Supabase client for post likes and comments.
 *
 * Reads its config from public env vars so it works in the browser:
 *   NEXT_PUBLIC_SUPABASE_URL
 *   NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY   (new-style key, preferred)
 *   NEXT_PUBLIC_SUPABASE_ANON_KEY          (legacy key, still accepted)
 *
 * Both key types are meant to be exposed in the browser; access is governed by
 * the Row Level Security policies in supabase/schema.sql.
 *
 * If nothing is set, `supabase` is `null` and the UI falls back to a local-only
 * experience (the site still builds and runs). See README.md for setup steps.
 */
const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const publicKey =
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = Boolean(url && publicKey);

export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(url as string, publicKey as string)
  : null;
