/**
 * One-off migration: copies the hardcoded posts in `lib/data/content.ts` into
 * the Supabase `posts` table.
 *
 * Run locally, once, after the schema is in place:
 *
 *   npm run seed
 *
 * Requires NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in
 * `.env.local`. Uses the service role key so it can write without a login.
 *
 * Safe to re-run: rows are matched on `slug`, so existing posts are updated
 * rather than duplicated.
 *
 * The array stays in `content.ts` afterwards — it is the fallback the public
 * feed renders whenever the database is unreachable.
 */

import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { createClient } from '@supabase/supabase-js';
import { posts } from '../lib/data/content';

// Minimal .env.local reader so the script needs no extra dependency.
function loadEnv() {
  try {
    const raw = readFileSync(resolve(process.cwd(), '.env.local'), 'utf8');
    for (const line of raw.split('\n')) {
      const match = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
      if (!match) continue;
      const value = match[2].replace(/^["']|["']$/g, '');
      if (!process.env[match[1]]) process.env[match[1]] = value;
    }
  } catch {
    // Falls through to the check below.
  }
}

/**
 * Turns '2 days ago' / '1 week ago' into a real date, so the migrated feed
 * keeps its original order and the relative labels still read the same.
 */
function parseRelative(timestamp: string): string {
  const match = timestamp.match(/^(\d+)\s+(minute|hour|day|week|month|year)s?\s+ago$/i);
  const now = Date.now();
  if (!match) return new Date(now).toISOString();

  const amount = Number(match[1]);
  const ms: Record<string, number> = {
    minute: 60_000,
    hour: 3_600_000,
    day: 86_400_000,
    week: 604_800_000,
    month: 2_592_000_000,
    year: 31_536_000_000,
  };
  return new Date(now - amount * ms[match[2].toLowerCase()]).toISOString();
}

async function main() {
  loadEnv();

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceKey) {
    console.error(
      'Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY.\n' +
        'Add both to .env.local and try again.',
    );
    process.exit(1);
  }

  const supabase = createClient(url, serviceKey, {
    auth: { persistSession: false },
  });

  const rows = posts.map((post) => {
    const createdAt = parseRelative(post.timestamp);
    return {
      slug: post.id,
      // 'video' exists in the static type but has no rendering path; the seed
      // data does not use it, and this keeps the check constraint satisfied.
      type: post.type === 'video' ? 'text' : post.type,
      title: post.title ?? null,
      content: post.content,
      image: post.image ?? null,
      images: post.images ?? null,
      youtube_id: post.youtubeId ?? null,
      tags: post.tags,
      category: post.category,
      likes: post.likes,
      comments: post.comments,
      shares: post.shares,
      published: true,
      created_at: createdAt,
      updated_at: createdAt,
    };
  });

  const { data, error } = await supabase
    .from('posts')
    .upsert(rows, { onConflict: 'slug' })
    .select('slug');

  if (error) {
    console.error('Seed failed:', error.message);
    process.exit(1);
  }

  console.log(`Seeded ${data?.length ?? 0} posts:`);
  for (const row of data ?? []) console.log(`  - ${row.slug}`);
}

main();
