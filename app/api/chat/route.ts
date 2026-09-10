import Anthropic from '@anthropic-ai/sdk';
import { NextResponse } from 'next/server';

import { BOOKING_URL, CHAT_MAX_TOKENS, CHAT_MODEL } from '@/lib/chat/config';
import { chatRequestSchema, validateConversation, type ChatEvent } from '@/lib/chat/schema';
import { SYSTEM_PROMPT } from '@/lib/chat/system-prompt';
import { CAPTURE_LEAD_TOOL, leadToolSchema } from '@/lib/chat/tools';
import { admit, hashIp, passesBurstLimit, recordUsage } from '@/lib/chat/rate-limit';
import { insertLead } from '@/lib/leads';

/**
 * The chat assistant endpoint.
 *
 * Node runtime, not edge: the lead insert and the rate limiter both need the
 * `server-only` service-role Supabase client, and IP hashing uses `node:crypto`.
 * Edge's advantage is long-lived streams, which is irrelevant when `max_tokens`
 * is capped at ~1k.
 */
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 60;

/** Max model round trips per request: one reply, plus one after a tool call. */
const MAX_ITERATIONS = 2;

function sse(event: ChatEvent): string {
  return `data: ${JSON.stringify(event)}\n\n`;
}

function refuse(message: string, status: number) {
  return NextResponse.json({ error: message }, { status });
}

export async function POST(request: Request) {
  if (!process.env.ANTHROPIC_API_KEY) {
    console.error('Chat disabled: ANTHROPIC_API_KEY is not set.');
    return refuse('The assistant is not available right now.', 503);
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return refuse('Invalid request.', 400);
  }

  const parsed = chatRequestSchema.safeParse(body);
  if (!parsed.success) return refuse('Invalid request.', 400);

  // Silently accept bot submissions, same as the lead form.
  if (parsed.data.botField) {
    return new NextResponse(sse({ type: 'done' }), {
      headers: { 'Content-Type': 'text/event-stream' },
    });
  }

  const structural = validateConversation(parsed.data.messages);
  if (!structural.ok) return refuse(structural.error, 400);

  const ipHash = hashIp(request);

  if (!passesBurstLimit(ipHash)) {
    return refuse('Slow down a moment, then try again.', 429);
  }

  const admission = await admit(ipHash);
  if (!admission.allowed) {
    const status = admission.reason === 'global' ? 503 : 429;
    return refuse(
      admission.reason === 'global'
        ? 'The assistant is offline right now. Use the contact form below and Samme will get back to you.'
        : "We've chatted quite a bit today. Use the contact form below and Samme will pick it up directly.",
      status,
    );
  }

  // Rebuild the history as plain text-only turns. The raw request object is
  // never forwarded to the API, so a visitor cannot inject fabricated tool_use
  // or tool_result blocks into the conversation.
  const messages: Anthropic.MessageParam[] = parsed.data.messages.map((turn) => ({
    role: turn.role,
    content: turn.content,
  }));

  const client = new Anthropic();
  const encoder = new TextEncoder();

  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      const send = (event: ChatEvent) =>
        controller.enqueue(encoder.encode(sse(event)));

      try {
        for (let iteration = 0; iteration < MAX_ITERATIONS; iteration += 1) {
          const modelStream = client.messages.stream({
            model: CHAT_MODEL,
            max_tokens: CHAT_MAX_TOKENS,
            // No `output_config.effort` and no `thinking`: Sonnet 4.5 rejects
            // the effort ladder outright, and predates adaptive thinking. See
            // the note in lib/chat/config.ts before adding either back.
            system: [
              {
                type: 'text',
                text: SYSTEM_PROMPT,
                // Prefix cache: the system prompt is byte-identical between
                // requests, so every turn after the first reads it at ~0.1x.
                cache_control: { type: 'ephemeral' },
              },
            ],
            tools: [CAPTURE_LEAD_TOOL],
            messages,
          });

          modelStream.on('text', (delta) => send({ type: 'text', text: delta }));

          const final = await modelStream.finalMessage();

          await recordUsage(admission.eventId, final.usage);
          console.info('[chat] usage', {
            input: final.usage.input_tokens,
            output: final.usage.output_tokens,
            cacheRead: final.usage.cache_read_input_tokens ?? 0,
            cacheWrite: final.usage.cache_creation_input_tokens ?? 0,
          });

          if (final.stop_reason !== 'tool_use') break;

          const toolUses = final.content.filter(
            (block): block is Anthropic.ToolUseBlock => block.type === 'tool_use',
          );

          const results: Anthropic.ToolResultBlockParam[] = [];

          for (const toolUse of toolUses) {
            if (toolUse.name !== CAPTURE_LEAD_TOOL.name) {
              results.push({
                type: 'tool_result',
                tool_use_id: toolUse.id,
                content: 'Unknown tool.',
                is_error: true,
              });
              continue;
            }

            const input = leadToolSchema.safeParse(toolUse.input);

            if (!input.success) {
              results.push({
                type: 'tool_result',
                tool_use_id: toolUse.id,
                content:
                  'Those details were incomplete or malformed. Ask the visitor ' +
                  'for what is missing, then try again.',
                is_error: true,
              });
              continue;
            }

            const lead = input.data;
            const saved = await insertLead({
              form: 'chat',
              email: lead.email,
              name: lead.name,
              // Gives the existing admin table's Details cell something useful
              // with no changes to how it renders.
              subject: `Chat: ${lead.service}`,
              message: lead.summary,
              service: lead.service,
              timeline: lead.timeline,
            });

            if (!saved.ok) {
              results.push({
                type: 'tool_result',
                tool_use_id: toolUse.id,
                content:
                  'Could not save their details. Apologise briefly and give ' +
                  'them the contact form on the page instead.',
                is_error: true,
              });
              continue;
            }

            // The booking URL enters the conversation here and nowhere else.
            // It is absent from the system prompt and the knowledge base, so
            // no amount of prompting can extract it before this point.
            results.push({
              type: 'tool_result',
              tool_use_id: toolUse.id,
              content: `Saved. Share this booking link with them: ${BOOKING_URL}`,
            });

            send({ type: 'qualified', bookingUrl: BOOKING_URL });
          }

          messages.push({ role: 'assistant', content: final.content });
          messages.push({ role: 'user', content: results });
        }

        send({ type: 'done' });
      } catch (error) {
        // Once the stream has started the HTTP status is already sent, so
        // failures ship as a frame the widget can render.
        if (error instanceof Anthropic.RateLimitError) {
          send({
            type: 'error',
            message: 'Busy right now — try again in a moment.',
            retryable: true,
          });
        } else if (error instanceof Anthropic.BadRequestError) {
          console.error('[chat] bad request:', error.message);
          send({
            type: 'error',
            message: 'Something went wrong with that message.',
            retryable: false,
          });
        } else if (error instanceof Anthropic.APIError) {
          console.error('[chat] API error', error.status, error.message);
          send({
            type: 'error',
            message: 'The assistant is having trouble. Try again shortly.',
            retryable: true,
          });
        } else {
          console.error('[chat] unexpected error:', error);
          send({
            type: 'error',
            message: 'The assistant is having trouble. Try again shortly.',
            retryable: true,
          });
        }
      } finally {
        controller.close();
      }
    },
  });

  return new NextResponse(stream, {
    headers: {
      'Content-Type': 'text/event-stream; charset=utf-8',
      'Cache-Control': 'no-store, no-transform',
      Connection: 'keep-alive',
      // Stops proxies buffering the stream into one lump.
      'X-Accel-Buffering': 'no',
    },
  });
}
