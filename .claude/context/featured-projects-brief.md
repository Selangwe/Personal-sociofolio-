# Featured Projects — Authoring Brief

The content contract for the `#projects` section. Read this before adding,
editing, or rewriting a project card. Every rule below is derived from the
shipped code and the six existing cards — not invented.

**Source of truth**

| What | Where |
| --- | --- |
| Type | `lib/types.ts` → `interface Project` |
| Data | `lib/data/content.ts` → `export const projects: Project[]` (line ~241) |
| Render | `components/sections/projects-section.tsx` |
| Badges | `components/ui/skill-badge.tsx` |

Content is data-driven. Add cards to `content.ts`. Never hardcode a project
into the component.

---

## Purpose

The section is the proof layer between *what I say I do* (Services) and *what
people say about me* (Testimonials). Each card answers one question for a
prospect skimming on a phone: **"has he done my thing, and did it work?"**

Cards are scanned, not read. Title and the three metrics do ~90% of the work.
The one-liner exists to make the metrics believable.

---

## Card anatomy

Six fields, in render order. The layout is `sm:grid-cols-2` — every card is
half-width on tablet and up, which is what drives the length limits.

### 1. Title — `title`

- **≤ 32 characters.** Observed range: 25–31. Must not wrap to a second line.
- Noun phrase naming the *system built*, not the task performed.
  "Cold Email Infrastructure" ✅ · "I set up cold email for a client" ❌
- No client names. No years. No "Project" as a suffix.

### 2. Category tag — `category`

Renders as a pill **over the cover image**, top-left, `text-xs`. Keep it short —
the longest in use is `Web Development` (15 chars). **Hard cap 18.**

Use the existing project vocabulary. Do not coin a new one without adding it
deliberately:

`AI Automation` · `GoHighLevel` · `Cold Email` · `Automation` ·
`Web Development` · `Lead Generation`

> ⚠️ **Known drift:** these do *not* match the Services titles in the same
> file. Services say `Website Development`, `Cold Email Systems`; projects say
> `Web Development`, `Cold Email`. Nothing breaks — no filtering reads these —
> but the two lists should be reconciled if a category filter is ever added.

### 3. One-liner — `description`

- **130–150 characters.** Observed range: 131–149. One sentence. No line breaks.
- **Open with a past-tense build verb.** In use: Built · Designed and built ·
  Set up · Created · Redesigned · Launched.
- Structure that works: `[verb] [what] for [who] that [outcome]`.
- Name the client *type*, never the client: "an e-commerce brand", "a B2B SaaS
  company", "a coaching business".
- Escape apostrophes — the file uses single-quoted strings (`client\'s`).

### 4. Tech stack — `techStack`

- **Exactly 4.** All six cards use 4; 3 looks thin, 5 wraps to a second badge row
  and pushes the metrics down.
- Real, nameable tools only. No categories-as-tools, no "AI", no "Automation".
- Match the spelling already used elsewhere in the file: `Make.com`, `Next.js`,
  `TailwindCSS`, `Slack API`, `Notion API`, `Google Workspace`, `GoHighLevel`.

### 5. Metrics — `results`

**Exactly 3.** The component renders `grid-cols-3` — a 4th metric wraps onto a
second row alone and looks broken; 2 leaves a visible gap.

| Part | Rule |
| --- | --- |
| `value` | ≤ 8 chars. Renders bold, beside an icon, one line. e.g. `+120/mo`, `0.8s`, `62%` |
| `label` | ≤ 18 chars, ideally 2 words. Longer wraps to two lines and unevens the row |

Pick three metrics that are *different kinds* of proof — speed, volume, and
quality — rather than three flavours of the same number:

- **Speed / effort:** Response Time, Setup Time, Hours Saved, Load Time
- **Volume:** Booked Calls, Meetings Booked, Leads Generated
- **Quality / rate:** Reply Rate, Conversion, Error Rate, Lighthouse

> ⚠️ **Known issue:** `<TrendingUp />` renders on *every* metric unconditionally.
> A genuine decrease still shows an upward arrow — `-95%` on `proj-1` currently
> reads with an up-arrow. Either phrase reductions as gains ("Response Time"
> → `0.4s`) or fix the component to pick the icon from the value's sign.

### 6. CTA — `link` (optional)

The CTA is **not** authored. It is derived:

- `link` present → external anchor, **"View Project"** (opens in a new tab)
- `link` absent → scrolls to `#contact`, **"Discuss a project like this"**

So: **omit `link` unless there is a real, public, working URL.** The fallback is
the higher-converting path anyway — it sends a warm reader straight to the form.

### Also required — `cover` and `id`

- `cover` is **not optional** in the type. Every card needs one.
  Format in use: `800×500`, `?w=800&h=500&fit=crop`. Rendered `h-48 object-cover`,
  so keep the subject centred.
- `id` follows `proj-N`, sequential, never reused.

---

## Voice

Match the rest of the site: concise, punchy, metric-led, no corporate filler.

**Banned:** "leveraged", "utilized", "solutions", "cutting-edge", "seamless",
"passionate about", "helped them to", "state-of-the-art", "robust", "synergy",
"in today's fast-paced world".

**Prefer:** plain verbs (built, set up, wired, cut, launched), concrete nouns,
and a number wherever a number exists.

---

## Honesty rules

Non-negotiable, and currently the section's weakest point.

1. **Never invent a client name, logo, or testimonial.** None of the six cards
   name a client — keep it that way unless a client has agreed in writing.
2. **Never invent a metric.** If the real number isn't known, use a metric that
   *is* real (setup time, tools integrated, pages shipped) rather than rounding
   an imaginary one up.
3. The six existing cards use **stock Unsplash imagery and round numbers**, and
   are flagged `CONFIRM` in `CLAUDE.md` — meaning it isn't established whether
   they're delivered client work or representative examples. Two honest fixes:
   - swap in real screenshots and real numbers, card by card; or
   - retitle the section heading to signal capability rather than history.

   Don't leave them ambiguous while adding new verified cards beside them —
   mixing real and representative work in one grid undermines both.

---

## Adding a card — steps

1. Open `lib/data/content.ts`, find `export const projects: Project[]`.
2. Append an object with the next `proj-N` id. Order in the array *is* display
   order — best proof first; the grid fills left-to-right, top-to-bottom.
3. Fill all six fields against the rules above. Include `cover`. Omit `link`
   unless the URL is public and live.
4. TypeScript will catch a missing required field on build. It will **not** catch
   4 metrics, a 6-word label, or a 300-char one-liner — check those by eye.
5. Run the dev server and view the section at `sm` width and mobile width.
   Confirm: title on one line, badges on one row, metric row even, no clipped pill.

Keep the count **even** (6, 8, 10). The two-column grid leaves an orphan card at
odd counts.

---

## Template

```ts
{
  id: 'proj-7',
  title: '',                    // ≤32 chars, names the system
  description:
    '',                         // 130–150 chars, one sentence, past-tense verb
  cover:
    '',                         // 800×500, subject centred
  category: '',                 // from the vocabulary above, ≤18 chars
  techStack: ['', '', '', ''],  // exactly 4, real tools
  results: [
    { label: '', value: '' },   // exactly 3 · label ≤18 · value ≤8
    { label: '', value: '' },
    { label: '', value: '' },
  ],
  // link: '',                  // only if public and live
},
```
