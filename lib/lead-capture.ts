/**
 * Single entry point for every lead the site captures.
 *
 * Currently posts to Netlify Forms. Because the App Router renders these forms
 * client-side, Netlify's build-time form detection cannot see them — the form
 * names are declared statically in `public/__forms.html` and we POST there.
 * See: https://docs.netlify.com/manage/forms/setup/
 *
 * To move capture to GoHighLevel (or anywhere else) later, change only
 * `submitLead` below. No component imports anything but this function.
 */

export type LeadFormName = 'contact' | 'newsletter' | 'resource-download';

export type LeadPayload = Record<string, string>;

/** Netlify expects form data url-encoded, with the form name as a field. */
function encode(data: LeadPayload): string {
  return Object.keys(data)
    .map((k) => `${encodeURIComponent(k)}=${encodeURIComponent(data[k])}`)
    .join('&');
}

export async function submitLead(
  formName: LeadFormName,
  payload: LeadPayload,
): Promise<void> {
  const res = await fetch('/__forms.html', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: encode({ 'form-name': formName, ...payload }),
  });

  if (!res.ok) {
    throw new Error(`Submission failed (${res.status})`);
  }
}
