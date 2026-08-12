import { formatDistanceToNow } from 'date-fns';
import { posts as staticPosts } from '@/lib/data';
import { getServerClient } from '@/lib/supabase/server';
import type { Post, PostRecord } from '@/lib/types';

/**
 * The single seam between the posts table and the rendered site.
 *
 * Everything that displays posts goes through here, mirroring how
 * `lib/lead-capture.ts` is the single seam for form submissions.
 */

/**
 * Converts a database row into the shape `PostCard` already expects.
 *
 * Two mappings matter: `slug` becomes `id` (the card uses it as the DOM anchor
 * and share link), and `created_at` becomes a relative string computed at read
 * time. The latter fixes the seed data's frozen timestamps — a hardcoded
 * '2 days ago' still says '2 days ago' a year later.
 */
export function toPost(row: PostRecord): Post {
  return {
    id: row.slug,
    type: row.type,
    timestamp: formatDistanceToNow(new Date(row.created_at), { addSuffix: true }),
    title: row.title ?? undefined,
    content: row.content,
    image: row.image ?? undefined,
    images: row.images ?? undefined,
    youtubeId: row.youtube_id ?? undefined,
    tags: row.tags,
    likes: row.likes,
    comments: row.comments,
    shares: row.shares,
    category: row.category,
  };
}

/**
 * Published posts, newest first.
 *
 * Falls back to the static posts in `lib/data/content.ts` whenever the database
 * is unconfigured, unreachable, or empty. The feed is the centrepiece of the
 * page, so a backend problem must never render it blank — the site simply keeps
 * showing what it showed before Supabase existed.
 */
export async function getPublishedPosts(): Promise<Post[]> {
  const supabase = getServerClient();
  if (!supabase) return staticPosts;

  try {
    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .eq('published', true)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Falling back to static posts:', error.message);
      return staticPosts;
    }

    // An empty table means the migration has not run yet, not that the owner
    // deliberately published nothing.
    if (!data || data.length === 0) return staticPosts;

    return (data as PostRecord[]).map(toPost);
  } catch (err) {
    console.error('Falling back to static posts:', err);
    return staticPosts;
  }
}
