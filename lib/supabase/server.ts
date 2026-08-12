import { createClient, type SupabaseClient } from '@supabase/supabase-js';

/**
 * Read-only Supabase client for server rendering the public feed.
 *
 * Uses the anon key with no session attached, so it can only ever see what an
 * anonymous visitor can see — published posts. Returns `null` when the project
 * has no Supabase credentials, which is what lets `lib/posts.ts` fall back to
 * the static content instead of failing the render.
 */
export function getServerClient(): SupabaseClient | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) return null;

  return createClient(url, anonKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
