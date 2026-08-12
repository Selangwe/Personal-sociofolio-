/**
 * Single entry point for every lead the site captures.
 *
 * Posts to `/api/lead`, which writes to Supabase server-side. This replaced
 * Netlify Forms when the site moved to Vercel: the old path POSTed to
 * `public/__forms.html` and only worked because Netlify's edge intercepted it.
 * On any other host that is a static file, so every submission failed — and the
 * resource-download caller swallows errors, so those leads vanished silently.
 *
 * The current path depends on nothing host-specific.
 *
 * To move capture to GoHighLevel (or anywhere else) later, change only
 * `submitLead` below. No component imports anything but this function.
 */

export type LeadFormName = 'contact' | 'newsletter' | 'resource-download';

export type LeadPayload = Record<string, string>;

export async function submitLead(
  formName: LeadFormName,
  payload: LeadPayload,
): Promise<void> {
  const res = await fetch('/api/lead', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    // `botField` is the honeypot. Components leave it empty; bots that fill
    // every field they find get silently discarded server-side.
    body: JSON.stringify({ form: formName, botField: '', ...payload }),
  });

  if (!res.ok) {
    throw new Error(`Submission failed (${res.status})`);
  }
}
