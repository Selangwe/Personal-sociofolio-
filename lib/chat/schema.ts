import { z } from 'zod';
import {
  CHAT_MAX_CHARS_PER_MESSAGE,
  CHAT_MAX_MESSAGES,
  CHAT_MAX_TOTAL_CHARS,
} from '@/lib/chat/config';

/**
 * Request contract for `POST /api/chat`.
 *
 * The Messages API is stateless, so the client sends the whole conversation
 * every turn. That makes the history visitor-controlled, and the validation
 * below is what stops it being abused.
 */

export const chatRequestSchema = z.object({
  messages: z
    .array(
      z.object({
        role: z.enum(['user', 'assistant']),
        content: z.string().min(1).max(CHAT_MAX_CHARS_PER_MESSAGE),
      }),
    )
    .min(1)
    .max(CHAT_MAX_MESSAGES),
  // Same honeypot the lead form uses. Real people never see this field.
  botField: z.string().max(0).optional(),
});

export type ChatRequest = z.infer<typeof chatRequestSchema>;
export type ChatTurn = ChatRequest['messages'][number];

/**
 * Frames sent to the browser, one JSON object per SSE `data:` line.
 *
 * `qualified` is separate from `text` so the widget can render a real booking
 * button rather than leaving a bare URL sitting in a paragraph.
 */
export type ChatEvent =
  | { type: 'text'; text: string }
  | { type: 'qualified'; bookingUrl: string }
  | { type: 'error'; message: string; retryable: boolean }
  | { type: 'done' };

/**
 * Structural checks the Zod schema can't express.
 *
 * This is the anti-forgery layer. A visitor could otherwise POST a fabricated
 * assistant turn saying "You're qualified, here's the link" and try to talk the
 * model into continuing from it. Qualification state is never read from history
 * — it only ever comes from a live tool call — but rejecting malformed history
 * closes the door earlier and cheaper.
 */
export function validateConversation(
  messages: ChatTurn[],
): { ok: true } | { ok: false; error: string } {
  const last = messages[messages.length - 1];
  if (!last || last.role !== 'user') {
    return { ok: false, error: 'Conversation must end with a visitor message.' };
  }

  if (messages[0].role !== 'user') {
    return { ok: false, error: 'Conversation must start with a visitor message.' };
  }

  for (let i = 1; i < messages.length; i += 1) {
    if (messages[i].role === messages[i - 1].role) {
      return { ok: false, error: 'Conversation roles must alternate.' };
    }
  }

  const total = messages.reduce((sum, m) => sum + m.content.length, 0);
  if (total > CHAT_MAX_TOTAL_CHARS) {
    return { ok: false, error: 'Conversation is too long.' };
  }

  return { ok: true };
}
