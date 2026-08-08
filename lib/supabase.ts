import { createClient, type SupabaseClient } from '@supabase/supabase-js';

/**
 * Supabase client for post likes and comments.
 *
 * Reads its config from public env vars so it works in the browser:
 *   NEXT_PUBLIC_SUPABASE_URL
 *   NEXT_PUBLIC_SUPABASE_ANON_KEY
 *
 * If those are not set, `supabase` is `null` and the UI falls back to a
 * local-only experience (the site still builds and runs). See supabase/schema.sql
 * for the tables and policies this expects, and README.md for setup steps.
 */
const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = Boolean(url && anonKey);

export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(url as string, anonKey as string)
  : null;
