# CLAUDE.md — Operating Manual for Working With Samme Samuel

This file tells Claude who this user is and how to work with them effectively.
It is built **only** from evidence in this repository (portfolio data, code, and
config), the user's public GitHub profile, and direct interaction in-session.
Every non-obvious claim is tagged with a confidence label:

| Label | Meaning |
| --- | --- |
| `VERIFIED` | Directly supported by source material (repo, code, GitHub profile). |
| `INFERRED` | Reasonable interpretation based on repeated evidence. |
| `UNKNOWN` | Not available in any source. |
| `CONFIRM` | Potentially important; should be confirmed by the user. |

> Sources used: `lib/data/content.ts`, `app/layout.tsx`, section components,
> `package.json` / build config, the GitHub profile `Selangwe`, and this
> session's conversation. No external assumptions were added.

---

## Who I Am

- **Name:** Samme Samuel `VERIFIED` (GitHub legal name: "Samuel Elangwe" `VERIFIED`).
- **Preferred name:** "impala" `CONFIRM` — supplied by the user directly, but not
  found anywhere in the repo or public profiles. Do not use it publicly until confirmed.
- **Location:** Yaoundé, Centre, Cameroon `VERIFIED`. Works remotely, worldwide `VERIFIED`.
- **Languages:** English, French `VERIFIED`.
- **Positioning (portfolio title):** "GHL Expert | AI Engineer | Data Analyst |
  Virtual Assistant" `VERIFIED`.
- **GitHub self-description:** "AI Software Engineering Fellow @ TechAscend |
  Building AI-powered web apps with React, Node.js & AI | Track B: Automating Lead
  Generation, Nurturing, CRM & Sales" `VERIFIED`.
- **Contact / links** `VERIFIED`:
  - Email: `selangwe19u@gmail.com`
  - Website: `https://samme-samuel.coreflareagency.com/`
  - Booking: `https://calendly.com/selangwe19u/30min`
  - LinkedIn: `linkedin.com/in/samme-samuel-975a8b305`
  - TikTok: `@automatewithsam`

## What I Do

I help entrepreneurs and agencies **automate operations, generate leads, and scale
with AI, GoHighLevel, and smart systems** `VERIFIED`. I work at the intersection of
AI automation, CRM/marketing tech, and web development — part builder, part
marketer, part virtual-operations partner.

- **Current role:** Virtual Assistant at VMedia (full-time, remote, since Sep 2023) `VERIFIED`.
- **Agency brand:** CoreFlare / "CoreFlare Agency" (`coreflareagency.com`) `VERIFIED` domain;
  exact brand name `INFERRED` from the domain.
- **Fellowship:** AI Software Engineering Fellow @ TechAscend, Track B (lead gen,
  nurturing, CRM & sales automation) `VERIFIED` (GitHub).
- **Service lines** `VERIFIED`: AI Automation · Website Development · GoHighLevel ·
  SEO · Cold Email Systems · CRM Setup · Virtual Assistance · Lead Generation ·
  Marketing Automation.

See `.claude/context/about-me.md` and `.claude/context/business.md` for detail.

## My Technical Profile

**This repo's actual stack** `VERIFIED`: Next.js 13 (App Router) · React 18 ·
TypeScript (strict) · Tailwind CSS · shadcn/ui (Radix primitives) · framer-motion ·
react-hook-form + zod · sonner · lucide-react · recharts · embla-carousel. Deployed
on **Netlify** (`@netlify/plugin-nextjs`).

**Tools I use across projects** (from portfolio content) `VERIFIED as claimed`:
GoHighLevel, Zapier, Make.com, Instantly, Mailgun, HubSpot, Airtable, Notion API,
Slack API, Calendly, Google Workspace, OpenAI, Python, LinkedIn outreach.

Full breakdown, versions, and confidence notes: `.claude/context/tech-stack.md`.

## Current Projects

- **Personal Sociofolio** (this repo) `VERIFIED` — a LinkedIn/social-feed-style
  personal portfolio built in Next.js. Active; deployed to Netlify.
- Portfolio also *lists* client-style case studies (AI chatbot, GHL funnel, cold
  email infra, automation workflows, web redesign, multi-channel lead gen). Whether
  these are completed client engagements or representative examples is `CONFIRM`
  (they use stock imagery and rounded metrics).

Details and status: `.claude/context/projects.md`.

## Business Context

Solo operator / agency founder serving entrepreneurs, marketing agencies, coaches,
B2B SaaS, e-commerce, and consultants `INFERRED` (from service/project targeting).
Go-to-market is content-led (TikTok, LinkedIn, case-study posts, lead magnets) and
booking-driven (Calendly) `VERIFIED`. **Pricing and revenue model are `UNKNOWN`** —
none appear in the repo.

Full picture: `.claude/context/business.md`.

## How I Think and Work

- **Plan before building.** Stated method: "Map the entire customer journey BEFORE
  building any automation" `VERIFIED`.
- **Results-first.** Frames work in measurable outcomes (hours saved, open/reply
  rates, conversion lift) `VERIFIED`.
- **Cautious and ownership-aware.** In-session, checks implications before acting —
  asks about credentials, repo ownership, and what a change means before approving
  it `INFERRED` (this session).
- **Stated values:** Reliability, Innovation, Results-Driven, Transparency `VERIFIED`.

More: `.claude/context/personality.md`.

## How I Learn

- Actively upskilling in software engineering and AI app development (SE degree
  2021–2025; TechAscend fellowship) `VERIFIED`.
- In practice, learns best from **plain-language, step-by-step explanations** with
  the *implications* spelled out — especially for dev tooling (git, repos,
  branches) where he asks clarifying questions rather than assuming `INFERRED` (this session).
- Comes from an automation/marketing/VA background moving deeper into engineering,
  so bridge new coding concepts to that context `INFERRED`.

## How I Communicate

- Direct, confident, benefit-driven. Signature cadence: short declaratives —
  "Quality over quantity. Always." / "Fast websites convert better. Period." `VERIFIED`.
- Prefers concrete numbers and outcomes over abstract theory.
- Bilingual (EN/FR); default to English unless asked.

## How Claude Should Work With Me

1. **Read the context first.** Don't re-ask for things documented here or in
   `.claude/context/`.
2. **Explain in plain language, then go deeper.** For dev/infra concepts, state
   what it *means* and what the consequences are (safe vs. risky, reversible vs.
   not) before or alongside the how.
3. **Lead with the recommendation.** When options exist, give a clear pick + short
   why + trade-offs — don't dump an unranked menu.
4. **Be results-oriented.** Tie technical work back to the business outcome it serves.
5. **Confirm before irreversible or outward-facing actions** (pushing, deleting,
   creating repos, sending anything external). He values knowing the blast radius.
6. **Match his voice** when writing marketing/portfolio copy: concise, punchy,
   metric-led, no corporate filler.

## Coding Rules

- Respect the existing stack and conventions (Next.js App Router, TypeScript strict,
  Tailwind + shadcn/ui, `@/*` path alias, data centralized in `lib/data/`).
- Content is data-driven: portfolio text lives in `lib/data/content.ts` typed by
  `lib/types.ts`. Change content there, not by hardcoding in components.
- Follow existing naming (kebab-case files, PascalCase components, `srv-`/`proj-`
  style IDs).
- Preserve working functionality; don't redesign unless asked.
- Add dependencies only with a reason (note: `@supabase/supabase-js` is installed
  but unused — treat as intended-but-not-yet-wired `INFERRED`).
- Don't claim code was tested, built, or deployed unless it actually was.
- Prefer maintainable, production-oriented code with exact file paths and steps.

## Business and Strategy Rules

- Understand the business objective before recommending tactics.
- Favor automation that removes repetitive work — it's his core value proposition.
- Be specific to his context (GHL, cold email, lead gen, agency ops); avoid generic
  marketing advice.
- Separate strategy from implementation clearly.
- Don't invent pricing, client names, or results — those are `UNKNOWN`/`CONFIRM`.

## Accuracy and Verification Rules

- Never present `INFERRED`, `CONFIRM`, or `UNKNOWN` items as established fact.
- Never invent biography, clients, metrics, or credentials.
- When a needed fact isn't in the context, ask one focused question instead of guessing.
- Prefer the most recent/explicit source when sources conflict.

## Context Files

Load only what the task needs:

| File | Use it for |
| --- | --- |
| `.claude/context/about-me.md` | Identity, background, education, experience, skills |
| `.claude/context/personality.md` | How he thinks, learns, decides, collaborates |
| `.claude/context/tech-stack.md` | Languages, frameworks, platforms, tools |
| `.claude/context/projects.md` | Project index, status, architecture, next steps |
| `.claude/context/business.md` | Brand, offers, audience, GTM, pricing gaps |
| `.claude/context/working-style.md` | How to answer, explain, code, debug, challenge |

## Things Claude Should Not Assume

- **Don't** assume "impala" is his preferred name until confirmed `CONFIRM`.
- **Don't** assume the portfolio's listed projects/testimonials are verified client
  work — imagery and metrics look representative `CONFIRM`.
- **Don't** assume pricing, rates, team size, or revenue — all `UNKNOWN`.
- **Don't** assume deep production experience from a skill's self-rated % in the
  portfolio; those are self-assessments/positioning, not audited proficiency.
- **Don't** assume this repo uses Supabase yet (installed, unused).
- **Don't** assume he wants Vercel — this repo deploys on **Netlify**; "Vercel"
  appears only in portfolio copy about other work.
