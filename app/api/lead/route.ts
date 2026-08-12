import { NextResponse } from 'next/server';
import { z } from 'zod';
import { getAdminClient } from '@/lib/supabase/admin';

/**
 * Receives every lead the site captures.
 *
 * Writes run server-side with the service role key because `leads` grants no
 * insert policy to anonymous visitors — an anon-writable table is an open spam
 * endpoint with nowhere to validate. Doing it here also keeps the table shape
 * off the client and gives a home for email notifications later.
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

  const supabase = getAdminClient();
  if (!supabase) {
    console.error('Lead dropped: Supabase env vars are not configured.');
    return NextResponse.json(
      { error: 'Lead capture is not configured.' },
      { status: 503 },
    );
  }

  const { error } = await supabase.from('leads').insert(lead);

  if (error) {
    // Log the real reason, but never echo database internals to the client.
    console.error('Lead insert failed:', error.message);
    return NextResponse.json({ error: 'Could not save submission.' }, { status: 500 });
  }

  return new NextResponse(null, { status: 204 });
}
