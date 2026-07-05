'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Heart,
  MessageCircle,
  Share2,
  MoreHorizontal,
  BadgeCheck,
  ChevronLeft,
  ChevronRight,
  Play,
} from 'lucide-react';
import type { Post } from '@/lib/types';
import { profile } from '@/lib/data';
import { SkillBadge } from '@/components/ui/skill-badge';

interface PostCardProps {
  post: Post;
  index: number;
}

export function PostCard({ post, index }: PostCardProps) {
  const [liked, setLiked] = useState(false);
  const [carouselIndex, setCarouselIndex] = useState(0);

  const likeCount = post.likes + (liked ? 1 : 0);

  return (
    <motion.article
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.4, delay: Math.min(index * 0.05, 0.2) }}
      whileHover={{ y: -2 }}
      className="overflow-hidden rounded-xl border border-border bg-card shadow-sm transition-shadow hover:shadow-md"
    >
      <div className="flex items-center gap-3 p-4">
        <img
          src={profile.avatar}
          alt={profile.name}
          className="h-10 w-10 rounded-full object-cover"
        />
        <div className="flex-1">
          <div className="flex items-center gap-1.5">
            <span className="text-sm font-semibold text-foreground">
              {profile.name}
            </span>
            <BadgeCheck className="h-4 w-4 text-primary" />
            <span className="text-xs text-muted-foreground">
              {post.category}
            </span>
          </div>
          <span className="text-xs text-muted-foreground">
            {post.timestamp}
          </span>
        </div>
        <button className="rounded-lg p-2 text-muted-foreground hover:bg-secondary">
          <MoreHorizontal className="h-4 w-4" />
        </button>
      </div>

      <div className="px-4 pb-3">
        {post.title && (
          <h3 className="mb-2 text-base font-semibold text-foreground">
            {post.title}
          </h3>
        )}
        <p className="whitespace-pre-line text-sm text-muted-foreground">
          {post.content}
        </p>
      </div>

      {post.image && (
        <img
          src={post.image}
          alt={post.title || ''}
          className="w-full max-h-96 object-cover"
        />
      )}

      {post.images && post.images.length > 0 && (
        <div className="relative">
          <div className="aspect-video w-full overflow-hidden">
            <img
              src={post.images[carouselIndex]}
              alt=""
              className="h-full w-full object-cover"
            />
          </div>
          {post.images.length > 1 && (
            <>
              <button
                onClick={() =>
                  setCarouselIndex((i) =>
                    i === 0 ? post.images!.length - 1 : i - 1,
                  )
                }
                className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-black/50 p-1.5 text-white hover:bg-black/70"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                onClick={() =>
                  setCarouselIndex((i) =>
                    i === post.images!.length - 1 ? 0 : i + 1,
                  )
                }
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-black/50 p-1.5 text-white hover:bg-black/70"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
              <div className="absolute bottom-2 left-1/2 flex -translate-x-1/2 gap-1.5">
                {post.images.map((_, i) => (
                  <span
                    key={i}
                    className={`h-1.5 w-1.5 rounded-full ${
                      i === carouselIndex ? 'bg-white' : 'bg-white/50'
                    }`}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      )}

      {post.youtubeId && (
        <div className="relative aspect-video w-full bg-black">
          <div className="flex h-full w-full items-center justify-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-600 text-white shadow-lg">
              <Play className="h-7 w-7 fill-white" />
            </div>
          </div>
          <span className="absolute bottom-2 right-2 rounded bg-black/70 px-2 py-0.5 text-xs text-white">
            YouTube
          </span>
        </div>
      )}

      <div className="flex flex-wrap gap-2 px-4 pt-3">
        {post.tags.map((tag) => (
          <SkillBadge key={tag} name={`#${tag}`} />
        ))}
      </div>

      <div className="flex items-center justify-between border-t border-border px-4 py-2">
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <Heart className="h-3.5 w-3.5 fill-red-500 text-red-500" />
            {likeCount}
          </span>
          <span className="mx-2">·</span>
          <span>{post.comments} comments</span>
          <span className="mx-2">·</span>
          <span>{post.shares} shares</span>
        </div>
      </div>

      <div className="flex items-center gap-1 border-t border-border px-2 py-1">
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => setLiked(!liked)}
          className={`flex flex-1 items-center justify-center gap-2 rounded-lg py-2 text-sm font-medium transition-colors ${
            liked
              ? 'text-red-500'
              : 'text-muted-foreground hover:bg-secondary'
          }`}
        >
          <Heart className={`h-4 w-4 ${liked ? 'fill-red-500' : ''}`} />
          Like
        </motion.button>
        <button className="flex flex-1 items-center justify-center gap-2 rounded-lg py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary">
          <MessageCircle className="h-4 w-4" />
          Comment
        </button>
        <button className="flex flex-1 items-center justify-center gap-2 rounded-lg py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary">
          <Share2 className="h-4 w-4" />
          Share
        </button>
      </div>
    </motion.article>
  );
}
