import 'server-only';

import { createClient, type SupabaseClient } from '@supabase/supabase-js';

/**
 * Service-role Supabase client. **Server-only.**
 *
 * The service role key bypasses every row-level security policy, so this module
 * must never reach the browser — hence the `server-only` import above, which
 * turns an accidental client import into a build error rather than a leak.
 *
 * Used solely by `app/api/lead/route.ts` to insert into `leads`, a table that
 * deliberately grants no insert policy to anonymous visitors.
 */
export function getAdminClient(): SupabaseClient | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceKey) return null;

  return createClient(url, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
