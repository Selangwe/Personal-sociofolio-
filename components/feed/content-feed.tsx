'use client';

import { Newspaper } from 'lucide-react';
import type { Post } from '@/lib/types';
import { PostCard } from './post-card';

export function ContentFeed({ posts }: { posts: Post[] }) {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Newspaper className="h-5 w-5 text-primary" />
        <h2 className="text-lg font-semibold text-foreground">Activity Feed</h2>
      </div>

      {posts.map((post, index) => (
        <PostCard key={post.id} post={post} index={index} />
      ))}
    </div>
  );
}
