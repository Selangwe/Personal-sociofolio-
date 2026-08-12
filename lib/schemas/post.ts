import { z } from 'zod';

/**
 * Validation for the post editor, following the pattern established in
 * `components/sections/contact-section.tsx`.
 *
 * Counts and tags are typed as strings because they come straight from text
 * inputs; `toPostRecord` below converts them. Keeping the form schema honest
 * about what an <input> actually produces avoids coercion surprises and gives
 * readable error messages.
 */

export const POST_TYPES = [
  { value: 'text', label: 'Text only' },
  { value: 'case-study', label: 'Case study' },
  { value: 'image', label: 'Single image' },
  { value: 'carousel', label: 'Image carousel' },
  { value: 'youtube', label: 'YouTube video' },
] as const;

const wholeNumber = z
  .string()
  .regex(/^\d+$/, 'Must be a whole number')
  .transform((v) => Number(v));

export const postFormSchema = z
  .object({
    slug: z
      .string()
      .trim()
      .min(1, 'Slug is required')
      .max(80)
      .regex(
        /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
        'Lowercase letters, numbers and hyphens only',
      ),
    type: z.enum(['text', 'image', 'carousel', 'youtube', 'case-study']),
    title: z.string().trim().max(200).optional(),
    content: z.string().trim().min(1, 'Content is required').max(10000),
    category: z.string().trim().min(1, 'Category is required').max(80),
    tags: z.string().trim().max(300),
    image: z.string().trim(),
    images: z.array(z.string()),
    youtubeId: z.string().trim(),
    likes: wholeNumber,
    comments: wholeNumber,
    shares: wholeNumber,
    published: z.boolean(),
  })
  .superRefine((value, ctx) => {
    // Each post type promises a specific piece of media. Without these checks
    // it is possible to save, say, a carousel with no images — which renders as
    // a bare text post with no indication anything is wrong.
    if (value.type === 'image' && !value.image) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['image'],
        message: 'Add an image or change the post type',
      });
    }
    if (value.type === 'carousel' && value.images.length < 2) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['images'],
        message: 'A carousel needs at least 2 images',
      });
    }
    if (value.type === 'youtube' && !value.youtubeId) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['youtubeId'],
        message: 'Add a YouTube link or video ID',
      });
    }
  });

/** What the inputs hold before validation. */
export type PostFormValues = z.input<typeof postFormSchema>;
/** What comes out after validation, with counts as real numbers. */
export type PostFormOutput = z.output<typeof postFormSchema>;

/**
 * Accepts a full YouTube URL or a bare video ID.
 *
 * Pasting the address bar is the obvious thing to do, so handle it rather than
 * making the user dig the ID out of the URL themselves.
 */
export function extractYouTubeId(input: string): string {
  const value = input.trim();
  if (!value) return '';

  const patterns = [
    /(?:youtube\.com\/watch\?(?:.*&)?v=)([\w-]{11})/,
    /(?:youtu\.be\/)([\w-]{11})/,
    /(?:youtube\.com\/(?:embed|shorts|live)\/)([\w-]{11})/,
  ];

  for (const pattern of patterns) {
    const match = value.match(pattern);
    if (match) return match[1];
  }

  // Already a bare ID.
  return /^[\w-]{11}$/.test(value) ? value : value;
}

/** Comma-separated input to the tag array the card renders. */
export function parseTags(input: string): string[] {
  return input
    .split(',')
    .map((tag) => tag.trim().replace(/^#/, ''))
    .filter(Boolean);
}

/** Turns a validated form into the column shape of the `posts` table. */
export function toPostRecord(values: PostFormOutput) {
  return {
    slug: values.slug,
    type: values.type,
    title: values.title || null,
    content: values.content,
    image: values.type === 'image' ? values.image || null : null,
    images: values.type === 'carousel' ? values.images : null,
    youtube_id:
      values.type === 'youtube' ? extractYouTubeId(values.youtubeId) || null : null,
    tags: parseTags(values.tags),
    category: values.category,
    likes: values.likes,
    comments: values.comments,
    shares: values.shares,
    published: values.published,
    updated_at: new Date().toISOString(),
  };
}

/** Builds a URL-safe slug from a title, used to prefill the slug field. */
export function slugify(input: string): string {
  return input
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80);
}
