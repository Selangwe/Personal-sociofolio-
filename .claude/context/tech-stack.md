# Tech Stack — Samme Samuel

Two layers: (A) the **actual stack of this repo** (verified from code/config), and
(B) **tools referenced across his portfolio work** (verified as claimed usage, not
audited).

## A. This repository (VERIFIED)

| Layer | Choice | Notes |
| --- | --- | --- |
| Framework | Next.js `13.5.1`, App Router | `app/` dir, RSC enabled |
| Language | TypeScript `5.2`, `strict: true` | `@/*` path alias → repo root |
| UI runtime | React `18.2` | |
| Styling | Tailwind CSS `3.3` | `cssVariables`, neutral base color |
| Components | shadcn/ui on Radix primitives | full set under `components/ui/` |
| Animation | framer-motion | scroll/parallax, section reveals |
| Forms | react-hook-form + zod (`@hookform/resolvers`) | contact form validation |
| Toasts | sonner | |
| Icons | lucide-react | |
| Charts | recharts | present in `ui/chart.tsx` |
| Carousel | embla-carousel-react | |
| Theming | next-themes | |
| Deployment | **Netlify** (`@netlify/plugin-nextjs`) | `netlify.toml`: `npx next build` |

**Build/config facts:**
- `next.config.js`: `images.unoptimized: true`, `eslint.ignoreDuringBuilds: true`.
- Images are largely remote (Unsplash) + one local avatar under `/images/`.
- Package name is the scaffold default (`"nextjs"`) `INFERRED` (bootstrapped from a starter).

**Present but unused:**
- `@supabase/supabase-js` is installed but **not referenced anywhere in code**
  `VERIFIED` (unused) → likely a planned backend/auth/data layer `INFERRED`.

## B. Tools used across portfolio work (VERIFIED as claimed)

| Domain | Tools |
| --- | --- |
| Automation / no-code | GoHighLevel (primary), Zapier, Make.com |
| AI | OpenAI, custom AI chatbots; Python |
| Cold email / outreach | Instantly, Mailgun, Google Workspace, LinkedIn |
| CRM / marketing | GoHighLevel, HubSpot |
| Data / ops | Airtable, Notion API, Slack API, Calendly |
| Web / hosting | Next.js, Tailwind, Netlify (this repo), Vercel (mentioned in copy) |
| From GitHub bio | React, Node.js, AI-powered web apps |

## C. Infrastructure added in-session

- **Hostinger MCP servers** configured via project-scoped `.mcp.json` (hosting,
  domains, DNS, reach, VPS, ecommerce). Token injected via `${HOSTINGER_API_TOKEN}`
  from the environment — **no secret is committed**. See root `README.md`. `VERIFIED`

## Conventions to follow

- Content is **data-driven**: all portfolio copy lives in `lib/data/content.ts`,
  typed by `lib/types.ts`. Edit content there, not inline in components.
- File naming: kebab-case files, PascalCase React components.
- Keep UI primitives in `components/ui/`; feature sections in `components/sections/`.
- Don't introduce new dependencies without a clear reason.

## Gaps / unknowns

- No test framework, CI, or backend/API layer in the repo `VERIFIED` (none present).
- Contact form is a **mock** (simulated submit, no backend) `VERIFIED`.
- Preferred cloud/hosting beyond Netlify: `UNKNOWN` (Hostinger now available via MCP,
  Vercel referenced in copy only).
