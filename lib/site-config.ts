/**
 * The one place the site's own URL is defined.
 *
 * Before this file, the URL was hardcoded in three places — `app/sitemap.ts`,
 * `app/robots.ts`, and the `metadataBase` in `app/layout.tsx` — each with its own
 * copy of the string. Changing domains meant finding all three.
 *
 * `samme-samuel.coreflareagency.com` is the intended brand domain but is **not
 * connected yet** (DNS pending), so the default below points at the Vercel
 * deployment that actually serves this build. Anything that tells a visitor where
 * they are — including the chat assistant — must read `SITE_URL`, never
 * `profile.website` in `lib/data/content.ts`, which still holds the aspirational
 * domain for display as contact info.
 *
 * To cut over once DNS resolves: set `NEXT_PUBLIC_SITE_URL` in the Vercel project
 * settings and redeploy. No code change needed.
 */

const FALLBACK_SITE_URL = 'https://personal-sociofolio.vercel.app';

/** Absolute origin, never with a trailing slash. */
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL || FALLBACK_SITE_URL
).replace(/\/+$/, '');

/** Display name used in metadata and the assistant's grounding. */
export const SITE_NAME = 'Samme Samuel';
