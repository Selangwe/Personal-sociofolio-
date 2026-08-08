'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Heart, MessageCircle, Loader2, Send } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import type { Post } from '@/lib/types';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { ShareMenu } from '@/components/feed/share-menu';
import { toast } from 'sonner';

interface PostActionsProps {
  post: Post;
}

interface Comment {
  id: string;
  author: string;
  body: string;
  created_at: string;
}

const likedKey = (postId: string) => `sociofolio:liked:${postId}`;

export function PostActions({ post }: PostActionsProps) {
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(post.likes);
  const [likePending, setLikePending] = useState(false);

  const [commentsOpen, setCommentsOpen] = useState(false);
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentCount, setCommentCount] = useState(post.comments);
  const [loadingComments, setLoadingComments] = useState(false);

  const [author, setAuthor] = useState('');
  const [body, setBody] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Remember this browser's like state, and pull live counts when configured.
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setLiked(window.localStorage.getItem(likedKey(post.id)) === '1');
    }
    if (!isSupabaseConfigured || !supabase) return;

    let active = true;
    (async () => {
      const [{ data: likeRow }, { count }] = await Promise.all([
        supabase.from('post_likes').select('count').eq('post_id', post.id).maybeSingle(),
        supabase
          .from('post_comments')
          .select('*', { count: 'exact', head: true })
          .eq('post_id', post.id),
      ]);
      if (!active) return;
      if (likeRow?.count != null) setLikeCount(likeRow.count as number);
      if (count != null) setCommentCount(count);
    })();

    return () => {
      active = false;
    };
  }, [post.id]);

  const toggleLike = async () => {
    const next = !liked;

    // Local-only fallback when there is no database yet.
    if (!isSupabaseConfigured || !supabase) {
      setLiked(next);
      setLikeCount((c) => c + (next ? 1 : -1));
      window.localStorage.setItem(likedKey(post.id), next ? '1' : '0');
      return;
    }

    setLikePending(true);
    // Optimistic update.
    setLiked(next);
    setLikeCount((c) => c + (next ? 1 : -1));
    const { data, error } = await supabase.rpc(
      next ? 'increment_post_like' : 'decrement_post_like',
      { p_post_id: post.id },
    );
    setLikePending(false);

    if (error) {
      // Roll back on failure.
      setLiked(!next);
      setLikeCount((c) => c + (next ? -1 : 1));
      toast.error('Could not update your like. Please try again.');
      return;
    }
    if (typeof data === 'number') setLikeCount(data);
    window.localStorage.setItem(likedKey(post.id), next ? '1' : '0');
  };

  const openComments = async () => {
    const opening = !commentsOpen;
    setCommentsOpen(opening);
    if (!opening || comments.length > 0 || !isSupabaseConfigured || !supabase) return;

    setLoadingComments(true);
    const { data, error } = await supabase
      .from('post_comments')
      .select('id, author, body, created_at')
      .eq('post_id', post.id)
      .order('created_at', { ascending: false });
    setLoadingComments(false);
    if (!error && data) setComments(data as Comment[]);
  };

  const submitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    const name = author.trim();
    const text = body.trim();
    if (name.length < 1 || text.length < 1) return;

    if (!isSupabaseConfigured || !supabase) {
      toast.error('Comments are not connected yet.');
      return;
    }

    setSubmitting(true);
    const { data, error } = await supabase
      .from('post_comments')
      .insert({ post_id: post.id, author: name, body: text })
      .select('id, author, body, created_at')
      .single();
    setSubmitting(false);

    if (error || !data) {
      toast.error('Could not post your comment. Please try again.');
      return;
    }
    setComments((list) => [data as Comment, ...list]);
    setCommentCount((c) => c + 1);
    setBody('');
    toast.success('Comment posted');
  };

  const timeAgo = (iso: string) => {
    try {
      return formatDistanceToNow(new Date(iso), { addSuffix: true });
    } catch {
      return '';
    }
  };

  return (
    <>
      {/* Counts summary */}
      <div className="flex items-center justify-between border-t border-border px-4 py-2">
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <Heart className="h-3.5 w-3.5 fill-red-500 text-red-500" />
            {likeCount}
          </span>
          <span className="mx-2">·</span>
          <button onClick={openComments} className="hover:text-primary">
            {commentCount} comments
          </button>
          <span className="mx-2">·</span>
          <span>{post.shares} shares</span>
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex items-center gap-1 border-t border-border px-2 py-1">
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={toggleLike}
          disabled={likePending}
          className={`flex flex-1 items-center justify-center gap-2 rounded-lg py-2 text-sm font-medium transition-colors disabled:opacity-60 ${
            liked ? 'text-red-500' : 'text-muted-foreground hover:bg-secondary'
          }`}
        >
          <Heart className={`h-4 w-4 ${liked ? 'fill-red-500' : ''}`} />
          Like
        </motion.button>
        <button
          onClick={openComments}
          className="flex flex-1 items-center justify-center gap-2 rounded-lg py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary"
        >
          <MessageCircle className="h-4 w-4" />
          Comment
        </button>
        <ShareMenu postId={post.id} title={post.title || post.content.slice(0, 80)} />
      </div>

      {/* Comments panel */}
      {commentsOpen && (
        <div className="border-t border-border px-4 py-4">
          {!isSupabaseConfigured ? (
            <p className="text-xs text-muted-foreground">
              Comments will appear here once the site is connected to its database.
            </p>
          ) : (
            <>
              <form onSubmit={submitComment} className="mb-4 space-y-2">
                <input
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  placeholder="Your name"
                  maxLength={60}
                  className="h-10 w-full rounded-lg border border-border bg-background px-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                />
                <div className="flex items-end gap-2">
                  <textarea
                    value={body}
                    onChange={(e) => setBody(e.target.value)}
                    placeholder="Add a comment…"
                    rows={2}
                    maxLength={1000}
                    className="w-full resize-none rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                  <button
                    type="submit"
                    disabled={submitting || !author.trim() || !body.trim()}
                    className="flex h-10 shrink-0 items-center gap-1.5 rounded-lg bg-primary px-3 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-50"
                  >
                    {submitting ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Send className="h-4 w-4" />
                    )}
                    Post
                  </button>
                </div>
              </form>

              {loadingComments ? (
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Loader2 className="h-4 w-4 animate-spin" /> Loading comments…
                </div>
              ) : comments.length === 0 ? (
                <p className="text-xs text-muted-foreground">
                  No comments yet. Be the first to comment.
                </p>
              ) : (
                <ul className="space-y-3">
                  {comments.map((c) => (
                    <li key={c.id} className="rounded-lg bg-secondary/50 p-3">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-foreground">
                          {c.author}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {timeAgo(c.created_at)}
                        </span>
                      </div>
                      <p className="mt-1 whitespace-pre-line text-sm text-muted-foreground">
                        {c.body}
                      </p>
                    </li>
                  ))}
                </ul>
              )}
            </>
          )}
        </div>
      )}
    </>
  );
}
