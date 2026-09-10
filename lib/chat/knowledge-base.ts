import {
  profile,
  services,
  projects,
  experiences,
  education,
  skills,
  testimonials,
  resources,
  stats,
  coreValues,
  timeline,
} from '@/lib/data';
import { SITE_URL } from '@/lib/site-config';

/**
 * The assistant's knowledge base, serialized from the site's own content.
 *
 * `lib/data/content.ts` is already the source of truth for every word on the page,
 * so deriving the KB from it means the assistant physically cannot contradict what
 * a visitor is reading. Edit the portfolio copy and the assistant updates with it.
 *
 * ## Why this is a module-level constant
 *
 * It is built once at module load, not per request. Two reasons:
 *
 * 1. It goes into the `system` block with `cache_control: { type: 'ephemeral' }`.
 *    Prompt caching is a **prefix match** — one changed byte anywhere invalidates
 *    the whole cached prefix and every subsequent request pays full price.
 * 2. Rebuilding identical text on every request is wasted work.
 *
 * ## Determinism rules — do not break these
 *
 * Nothing in here may vary between requests. No `Date.now()`, no `toLocaleString()`,
 * no locale-dependent formatting, no `Math.random()`, no iteration over object keys
 * where order isn't guaranteed. Arrays are walked in their declared order.
 *
 * Live Supabase feed posts are deliberately **excluded**: `lib/posts.ts` renders
 * their timestamps as relative strings ("2 days ago") that change between requests,
 * which would invalidate the cache on every single call.
 *
 * Image URLs, icon names, and Tailwind colour tokens are also excluded — they are
 * noise to a text assistant and would inflate the cached prefix for nothing.
 */

function section(heading: string, body: string): string {
  return `## ${heading}\n\n${body.trim()}\n`;
}

function bullets(lines: string[]): string {
  return lines.map((line) => `- ${line}`).join('\n');
}

const identity = section(
  'Who this site belongs to',
  `
Name: ${profile.name}
Positioning: ${profile.title}
Headline: ${profile.headline}
Location: ${profile.location}
Languages: ${profile.languages.join(', ')}
Working hours: ${profile.availability}
Contact email: ${profile.email}
This website: ${SITE_URL}

The booking link is deliberately not listed here. It is returned to you by the
capture_lead tool once a visitor qualifies, and that is the only way you may
obtain or share it.

About:
${profile.bio}
`,
);

const servicesSection = section(
  'Services offered (the nine things he sells)',
  services
    .map((service) =>
      [
        `### ${service.title} (id: ${service.id})`,
        service.description,
        '',
        'What it includes:',
        bullets(service.benefits),
      ].join('\n'),
    )
    .join('\n\n'),
);

const projectsSection = section(
  'Portfolio work shown on the site',
  `
PROVENANCE — read this before describing any project below. These are the case
studies displayed on the site. Their figures are illustrative of the kind of
outcome the work targets; they are NOT audited, client-attested results, and no
client is named. Describe them as examples of work he does. Never present a
figure below as a guaranteed or verified result for a named client.

${projects
  .map((project) =>
    [
      `### ${project.title}`,
      `Category: ${project.category}`,
      `Tools: ${project.techStack.join(', ')}`,
      project.description,
      `Illustrative figures: ${project.results
        .map((r) => `${r.label} ${r.value}`)
        .join(' · ')}`,
    ].join('\n'),
  )
  .join('\n\n')}
`,
);

const experienceSection = section(
  'Work history',
  experiences
    .map((job) =>
      [
        `### ${job.role} — ${job.company} (${job.type})`,
        `${job.startDate} to ${job.current ? 'present' : job.endDate} · ${job.location}`,
        job.description,
        bullets(job.responsibilities),
        `Skills used: ${job.skills.join(', ')}`,
      ].join('\n'),
    )
    .join('\n\n'),
);

const educationSection = section(
  'Education',
  education
    .map((entry) =>
      [
        `### ${entry.degree}${entry.field ? `, ${entry.field}` : ''} — ${entry.school}`,
        `${entry.startDate} to ${entry.endDate}`,
        entry.description,
      ].join('\n'),
    )
    .join('\n\n'),
);

const skillsSection = section(
  'Skills',
  // Grouped by category. The category order is derived from first appearance in
  // the source array rather than sorted, so it stays stable and byte-identical.
  (() => {
    const order: string[] = [];
    const grouped = new Map<string, string[]>();
    for (const skill of skills) {
      if (!grouped.has(skill.category)) {
        grouped.set(skill.category, []);
        order.push(skill.category);
      }
      grouped.get(skill.category)!.push(skill.name);
    }
    return order
      .map((category) => `${category}: ${grouped.get(category)!.join(', ')}`)
      .join('\n');
  })(),
);

const testimonialsSection = section(
  'Testimonials shown on the site',
  `
PROVENANCE — these quotes are displayed on the site as social proof. Do not
treat them as independently verified, and do not volunteer the reviewers' names
as referenceable clients. If a visitor asks for references, offer to connect
them with Samme directly instead.

${testimonials
  .map((t) => `- ${t.role}, ${t.company}: "${t.quote}"`)
  .join('\n')}
`,
);

const resourcesSection = section(
  'Free resources / lead magnets',
  `
${bullets(resources.map((r) => `${r.title} (${r.type}) — ${r.description}`))}

Note: several download links on the site are still placeholders. If a visitor
wants one, take their email and say it will be sent over, rather than promising
an instant download.
`,
);

const statsSection = section(
  'Headline figures displayed on the site',
  `
These are self-reported marketing figures, not audited metrics. State them as
"what the site says" if asked, and never inflate them.

${bullets(stats.map((s) => `${s.label}: ${s.value}${s.suffix}`))}
`,
);

const valuesSection = section(
  'Stated values',
  bullets(coreValues.map((v) => `${v.title} — ${v.description}`)),
);

const timelineSection = section(
  'Career timeline',
  bullets(timeline.map((t) => `${t.year}: ${t.title} — ${t.description}`)),
);

export const KNOWLEDGE_BASE = [
  '# Knowledge base',
  '',
  'Everything below is drawn from the live content of this website.',
  '',
  identity,
  servicesSection,
  projectsSection,
  experienceSection,
  educationSection,
  skillsSection,
  testimonialsSection,
  resourcesSection,
  statsSection,
  valuesSection,
  timelineSection,
].join('\n');
