# Projects — Samme Samuel

## Primary / owned

### Personal Sociofolio (this repo) `VERIFIED`
- **Purpose:** Personal portfolio presented as a LinkedIn/social-feed hybrid — a
  "sociofolio" with a profile header, content feed, sidebars, and section blocks
  (About, Experience, Services, Projects, Testimonials, Resources, Contact).
- **Stack:** Next.js 13 App Router, TypeScript, Tailwind + shadcn/ui, framer-motion.
  See `tech-stack.md`.
- **Architecture:** Single-page composition in `app/page.tsx`; all content is
  data-driven from `lib/data/content.ts` (typed in `lib/types.ts`); presentational
  components split into `layout/`, `profile/`, `sidebar/`, `feed/`, `sections/`, `ui/`.
- **Status:** Active; deployed on Netlify.
- **Known limitations:** contact form is a mock (no backend submit); many images are
  Unsplash placeholders; `resumeUrl` points to `/resume.pdf` (verify the asset ships);
  `@supabase/supabase-js` installed but unused.
- **Next objectives (likely):** wire the contact form to a real backend (Supabase is
  already a dependency), replace placeholder imagery/metrics with real assets `INFERRED`.

## Portfolio-listed case studies `CONFIRM`

> These appear in `lib/data/content.ts` as showcase projects. They use stock cover
> images and rounded metrics, and the testimonials use stock avatars with generic
> names — so treat them as **representative examples unless the user confirms they are
> real client engagements**. Do not cite their metrics as verified results.

| Project | Category | Stack (as listed) | Headline metrics (unverified) |
| --- | --- | --- | --- |
| AI Customer Support Chatbot | AI Automation | OpenAI, Python, Zapier, Slack API | 80% inquiries automated, −95% response time |
| GoHighLevel Agency Funnel | GoHighLevel | GHL, Funnels, SMS, Calendars | +45% conversion, +120 booked calls/mo |
| Cold Email Infrastructure | Cold Email | Instantly, Mailgun, Zapier, Google Workspace | 62% open, 8.5% reply |
| Automation Workflow System | Automation | Make.com, Notion API, Slack, Airtable | 30 hrs/week saved |
| Portfolio Website Redesign | Web Development | Next.js, Tailwind, Vercel, SEO | Lighthouse 98, 0.8s load, +210% traffic |
| Lead Gen Multi-Channel Campaign | Lead Generation | LinkedIn, Instantly, HubSpot, Calendly | 150+ leads, −40% CPL |

## Content & lead-magnet assets `VERIFIED as listed`

- AI Prompt Library for Business, Cold Email Playbook, GoHighLevel Setup Checklist
  (47-point), Automation Workflow Templates (Make.com/Zapier). Download links are
  placeholders (`#`) in the repo.

## Aggregate stats shown on site `VERIFIED as displayed` (self-reported)

50+ projects completed · ~25 hrs saved/client/week · 98% client satisfaction ·
3+ years experience. (Self-reported marketing figures, not audited.)
