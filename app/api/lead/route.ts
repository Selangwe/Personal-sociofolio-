import { NextResponse } from 'next/server';
import { z } from 'zod';
import { insertLead } from '@/lib/leads';

/**
 * Receives every lead the site's forms capture.
 *
 * Writes run server-side with the service role key because `leads` grants no
 * insert policy to anonymous visitors — an anon-writable table is an open spam
 * endpoint with nowhere to validate. Doing it here also keeps the table shape
 * off the client and gives a home for email notifications later.
 *
 * The insert itself lives in `lib/leads.ts`, shared with the chat route.
 *
 * Note the enum below has three values, not four. `'chat'` exists in `LeadForm`
 * but is deliberately unreachable from this unauthenticated endpoint — otherwise
 * anyone could forge a pre-qualified lead with a one-line curl.
 */

// Touches a database on every call; must never be prerendered or cached.
export const dynamic = 'force-dynamic';

const schema = z.object({
  form: z.enum(['contact', 'newsletter', 'resource-download']),
  email: z.string().email().max(320),
  name: z.string().max(200).optional(),
  subject: z.string().max(300).optional(),
  message: z.string().max(5000).optional(),
  resource: z.string().max(300).optional(),
  // Honeypot: real people never see this field, so anything in it is a bot.
  botField: z.string().max(0).optional(),
});

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request.' }, { status: 400 });
  }

  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid submission.' }, { status: 400 });
  }

  const { botField, ...lead } = parsed.data;

  // Silently accept bot submissions — an error just tells them to retry.
  if (botField) return new NextResponse(null, { status: 204 });

  const result = await insertLead(lead);

  if (!result.ok) {
    // `insertLead` already logged the real reason; never echo database
    // internals to the client.
    return result.reason === 'unconfigured'
      ? NextResponse.json(
          { error: 'Lead capture is not configured.' },
          { status: 503 },
        )
      : NextResponse.json(
          { error: 'Could not save submission.' },
          { status: 500 },
        );
  }

  return new NextResponse(null, { status: 204 });
}
