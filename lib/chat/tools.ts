import type Anthropic from '@anthropic-ai/sdk';
import { z } from 'zod';
import { services } from '@/lib/data';

/**
 * The single tool the assistant can call.
 *
 * Qualification is done with tool use rather than by prompting, because a tool
 * call is a discrete, server-observable event. Prompt-only qualification means
 * the only record that someone qualified is some text in a chat log, and there
 * is no moment for the server to hang a database write on.
 *
 * Structured output would have worked too, but it forces the entire reply into
 * a schema and kills token-by-token streaming of the conversational text.
 */

/** Derived from the portfolio data, so the enum can never drift from the site. */
const SERVICE_TITLES = services.map((service) => service.title);

export const TIMELINES = [
  'immediately',
  'within-30-days',
  'within-90-days',
] as const;

/** Validates the model's tool input before any of it reaches the database. */
export const leadToolSchema = z.object({
  name: z.string().max(200).optional(),
  email: z.string().email().max(320),
  company: z.string().max(200).optional(),
  service: z.enum(SERVICE_TITLES as [string, ...string[]]),
  timeline: z.enum(TIMELINES),
  summary: z.string().min(1).max(2000),
});

export type LeadToolInput = z.infer<typeof leadToolSchema>;

export const CAPTURE_LEAD_TOOL: Anthropic.Tool = {
  name: 'capture_lead',
  description:
    'Call this ONCE, only when the visitor meets ALL FOUR qualification ' +
    'criteria in your instructions AND has given you their email address. ' +
    'Calling it saves their details and returns the booking link, which you ' +
    'then share with them. Never call it speculatively, never call it to ' +
    '"check" whether someone qualifies, and never invent a value for any ' +
    'field — if you do not know something, ask the visitor instead.',
  input_schema: {
    type: 'object',
    properties: {
      name: {
        type: 'string',
        description: "The visitor's name, exactly as they gave it.",
      },
      email: {
        type: 'string',
        description: 'Their email address, exactly as they typed it.',
      },
      company: {
        type: 'string',
        description: 'Their business or agency name, if they mentioned one.',
      },
      service: {
        type: 'string',
        enum: SERVICE_TITLES,
        description:
          'The single closest matching service from the list. If nothing ' +
          'fits, the visitor does not qualify — do not call this tool.',
      },
      timeline: {
        type: 'string',
        enum: [...TIMELINES],
        description: 'How soon they intend to start.',
      },
      summary: {
        type: 'string',
        description:
          'Two or three sentences: what they need, their situation, and ' +
          'anything worth knowing before the call. Use their words. Do not ' +
          'embellish or add detail they did not give you.',
      },
    },
    required: ['email', 'service', 'timeline', 'summary'],
  },
};
