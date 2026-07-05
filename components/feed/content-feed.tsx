'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Newspaper } from 'lucide-react';
import { posts } from '@/lib/data';
import { PostCard } from './post-card';
import { LoadingFeed } from '@/components/ui/skeleton-card';

export function ContentFeed() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 600);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Newspaper className="h-5 w-5 text-primary" />
        <h2 className="text-lg font-semibold text-foreground">Activity Feed</h2>
      </div>

      {loading ? (
        <LoadingFeed />
      ) : (
        posts.map((post, index) => (
          <PostCard key={post.id} post={post} index={index} />
        ))
      )}
    </div>
  );
}
