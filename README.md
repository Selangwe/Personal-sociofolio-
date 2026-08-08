# Personal Sociofolio

A personal portfolio built with [Next.js](https://nextjs.org/), Tailwind CSS, and
Radix UI components.

## Getting started

```bash
npm install
npm run dev
```

The app runs at [http://localhost:3000](http://localhost:3000).

Useful scripts:

- `npm run dev` – start the dev server
- `npm run build` – production build
- `npm run start` – serve the production build
- `npm run lint` – run ESLint
- `npm run typecheck` – type-check with `tsc`

## Post interactions (likes, comments, share)

Each post in the feed supports **liking**, **commenting**, and **sharing** to
Facebook, X (Twitter), LinkedIn, WhatsApp, and — on mobile — Instagram and any
other app via the phone's native share sheet.

- **Share** works with no setup (it opens each platform's own share window).
  Instagram has no web share API, so it's reachable only through the mobile share
  sheet or by copying the link.
- **Likes and comments** are stored in **Supabase**. Until Supabase is configured,
  the site still runs: likes fall back to a local (per-browser) toggle and the
  comment box shows a "not connected yet" note.

### Connecting Supabase (one-time)

1. Create a free project at [supabase.com](https://supabase.com/).
2. In the project, open **SQL Editor → New query**, paste the contents of
   [`supabase/schema.sql`](supabase/schema.sql), and run it. This creates the
   `post_likes` and `post_comments` tables, the like helpers, and the access
   policies (public can read likes/comments and add comments; edits/deletes are
   dashboard-only, so you moderate from Supabase).
3. Copy your API credentials from **Project Settings → API**.
4. Locally: `cp .env.example .env.local` and fill in `NEXT_PUBLIC_SUPABASE_URL`
   and `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` (the legacy
   `NEXT_PUBLIC_SUPABASE_ANON_KEY` is also accepted).
5. On Netlify: add those same two variables under **Site settings → Environment
   variables**, then redeploy.

> The publishable / `anon` key is safe to expose in the browser — access is
> governed by the Row Level Security policies in `supabase/schema.sql`. Never put
> the `secret` / `service_role` key in `NEXT_PUBLIC_*` variables.

### Moderating comments

Comments are public and unauthenticated. Review or remove them from the Supabase
dashboard (**Table editor → post_comments**). To harden against spam later,
consider adding a captcha or rate limiting before promoting the site widely.
