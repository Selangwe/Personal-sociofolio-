import 'server-only';

import { getAdminClient } from '@/lib/supabase/admin';

/**
 * The one place that knows the shape of the `leads` table.
 *
 * Both `app/api/lead/route.ts` (public forms) and `app/api/chat/route.ts`
 * (qualified chat leads) write through this function. The chat route calls it
 * directly rather than HTTP-POSTing to `/api/lead`: an internal function-to-
 * function hop would double the latency and the invocation count, and would need
 * an absolute origin URL that differs between localhost, preview, and production
 * — exactly the host-coupling `lib/lead-capture.ts` exists to avoid.
 */

/**
 * Lead sources, server-side.
 *
 * **`'chat'` is intentionally absent from the public endpoint's schema.**
 * `app/api/lead/route.ts` is unauthenticated; if it accepted `form: 'chat'`,
 * anyone could forge pre-qualified leads with a one-line curl and poison the
 * most trusted signal in the admin table. Only this module — reachable solely
 * from the chat route, after the model has actually called the qualification
 * tool — can write one.
 *
 * Kept in sync by hand with: the CHECK constraint in `supabase/schema.sql` and
 * `supabase/schema.ready.sql`, the Zod enum in `app/api/lead/route.ts` (three
 * values), `LeadFormName` in `lib/lead-capture.ts` (three values), and the
 * `Lead['form']` union plus `FORM_LABELS` in `components/admin/lead-list.tsx`
 * (four values).
 */
export type LeadForm = 'contact' | 'newsletter' | 'resource-download' | 'chat';

export interface LeadInsert {
  form: LeadForm;
  email: string;
  name?: string;
  subject?: string;
  message?: string;
  resource?: string;
  /** Chat leads only: which of the nine services the visitor's need mapped to. */
  service?: string;
  /** Chat leads only: how soon they intend to start. */
  timeline?: string;
}

export type LeadResult =
  | { ok: true }
  | { ok: false; reason: 'unconfigured' | 'insert-failed' };

export async function insertLead(lead: LeadInsert): Promise<LeadResult> {
  const supabase = getAdminClient();

  if (!supabase) {
    console.error('Lead dropped: Supabase env vars are not configured.');
    return { ok: false, reason: 'unconfigured' };
  }

  const { error } = await supabase.from('leads').insert(lead);

  if (error) {
    // Log the real reason; never echo database internals to a caller.
    console.error('Lead insert failed:', error.message);
    return { ok: false, reason: 'insert-failed' };
  }

  return { ok: true };
}
