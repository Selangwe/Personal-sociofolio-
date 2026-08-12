'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { getBrowserClient } from '@/lib/supabase/client';
import {
  POST_TYPES,
  extractYouTubeId,
  parseTags,
  postFormSchema,
  slugify,
  toPostRecord,
  type PostFormOutput,
  type PostFormValues,
} from '@/lib/schemas/post';
import type { Post, PostRecord } from '@/lib/types';
import { PostCard } from '@/components/feed/post-card';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { ImageUpload } from './image-upload';

const EMPTY: PostFormValues = {
  slug: '',
  type: 'text',
  title: '',
  content: '',
  category: '',
  tags: '',
  image: '',
  images: [],
  youtubeId: '',
  likes: '0',
  comments: '0',
  shares: '0',
  published: false,
};

function toFormValues(record: PostRecord): PostFormValues {
  return {
    slug: record.slug,
    type: record.type,
    title: record.title ?? '',
    content: record.content,
    category: record.category,
    tags: record.tags.join(', '),
    image: record.image ?? '',
    images: record.images ?? [],
    youtubeId: record.youtube_id ?? '',
    likes: String(record.likes),
    comments: String(record.comments),
    shares: String(record.shares),
    published: record.published,
  };
}

interface PostEditorProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** The post being edited, or null to create a new one. */
  post: PostRecord | null;
  onSaved: () => void;
}

export function PostEditor({ open, onOpenChange, post, onSaved }: PostEditorProps) {
  const [saving, setSaving] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<PostFormValues, unknown, PostFormOutput>({
    resolver: zodResolver(postFormSchema),
    defaultValues: EMPTY,
  });

  // Reload the form whenever a different post is opened.
  useEffect(() => {
    if (open) reset(post ? toFormValues(post) : EMPTY);
  }, [open, post, reset]);

  const values = watch();

  /**
   * Renders the card exactly as the feed will, so the preview cannot drift from
   * production. Counts fall back to 0 while the inputs hold partial text.
   */
  const preview: Post = {
    id: values.slug || 'preview',
    type: values.type,
    timestamp: 'just now',
    title: values.title || undefined,
    content: values.content || 'Your post content will appear here.',
    image: values.type === 'image' ? values.image || undefined : undefined,
    images: values.type === 'carousel' ? values.images : undefined,
    youtubeId:
      values.type === 'youtube' ? extractYouTubeId(values.youtubeId) || undefined : undefined,
    tags: parseTags(values.tags),
    likes: Number(values.likes) || 0,
    comments: Number(values.comments) || 0,
    shares: Number(values.shares) || 0,
    category: values.category || 'Uncategorised',
  };

  const onSubmit = async (data: PostFormOutput) => {
    const supabase = getBrowserClient();
    if (!supabase) {
      toast.error('Supabase is not configured.');
      return;
    }

    setSaving(true);
    const record = toPostRecord(data);

    const { error } = post
      ? await supabase.from('posts').update(record).eq('id', post.id)
      : await supabase.from('posts').insert(record);

    setSaving(false);

    if (error) {
      // 23505 is Postgres' unique-violation code; the only unique column is slug.
      toast.error(
        error.code === '23505'
          ? 'That slug is already used by another post.'
          : `Could not save: ${error.message}`,
      );
      return;
    }

    toast.success(post ? 'Post updated.' : 'Post created.');
    onOpenChange(false);
    onSaved();
  };

  const fieldError = (message?: string) =>
    message ? <p className="text-xs text-destructive">{message}</p> : null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-5xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{post ? 'Edit post' : 'New post'}</DialogTitle>
          <DialogDescription>
            The preview on the right is the real feed card — what you see is what
            visitors get.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-6 lg:grid-cols-2">
          <form
            id="post-form"
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-4"
          >
            <div className="space-y-1.5">
              <Label htmlFor="type">Post type</Label>
              <Select
                value={values.type}
                onValueChange={(v) =>
                  setValue('type', v as PostFormValues['type'], {
                    shouldValidate: true,
                  })
                }
              >
                <SelectTrigger id="type">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {POST_TYPES.map((t) => (
                    <SelectItem key={t.value} value={t.value}>
                      {t.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                {...register('title')}
                onBlur={(e) => {
                  // Prefill the slug from the title, but never overwrite an
                  // existing one — slugs are public share links.
                  if (!values.slug && e.target.value) {
                    setValue('slug', slugify(e.target.value), {
                      shouldValidate: true,
                    });
                  }
                }}
                placeholder="Optional headline"
              />
              {fieldError(errors.title?.message)}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="slug">Slug</Label>
              <Input id="slug" {...register('slug')} placeholder="post-7" />
              <p className="text-[11px] text-muted-foreground">
                Used in the share link. Changing it on a published post breaks any
                link already shared.
              </p>
              {fieldError(errors.slug?.message)}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="content">Content</Label>
              <Textarea
                id="content"
                rows={10}
                {...register('content')}
                placeholder="Write your post. Line breaks are preserved."
              />
              {fieldError(errors.content?.message)}
            </div>

            {values.type === 'image' && (
              <div className="space-y-1.5">
                <Label>Image</Label>
                <ImageUpload
                  value={values.image ? [values.image] : []}
                  onChange={(urls) =>
                    setValue('image', urls[0] ?? '', { shouldValidate: true })
                  }
                  max={1}
                />
                {fieldError(errors.image?.message)}
              </div>
            )}

            {values.type === 'carousel' && (
              <div className="space-y-1.5">
                <Label>Carousel images</Label>
                <ImageUpload
                  value={values.images}
                  onChange={(urls) => setValue('images', urls, { shouldValidate: true })}
                  max={10}
                />
                {fieldError(errors.images?.message)}
              </div>
            )}

            {values.type === 'youtube' && (
              <div className="space-y-1.5">
                <Label htmlFor="youtubeId">YouTube link or video ID</Label>
                <Input
                  id="youtubeId"
                  {...register('youtubeId')}
                  placeholder="https://youtube.com/watch?v=..."
                />
                {fieldError(errors.youtubeId?.message)}
              </div>
            )}

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="category">Category</Label>
                <Input
                  id="category"
                  {...register('category')}
                  placeholder="Case Study"
                />
                {fieldError(errors.category?.message)}
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="tags">Tags</Label>
                <Input
                  id="tags"
                  {...register('tags')}
                  placeholder="GoHighLevel, AI Automation"
                />
                {fieldError(errors.tags?.message)}
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              {(['likes', 'comments', 'shares'] as const).map((field) => (
                <div key={field} className="space-y-1.5">
                  <Label htmlFor={field} className="capitalize">
                    {field}
                  </Label>
                  <Input id={field} inputMode="numeric" {...register(field)} />
                  {fieldError(errors[field]?.message)}
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between rounded-lg border border-border p-3">
              <div>
                <Label htmlFor="published">Published</Label>
                <p className="text-[11px] text-muted-foreground">
                  Drafts stay hidden from the public feed.
                </p>
              </div>
              <Switch
                id="published"
                checked={values.published}
                onCheckedChange={(checked) => setValue('published', checked)}
              />
            </div>
          </form>

          <div className="lg:sticky lg:top-0 lg:h-fit">
            <p className="mb-2 text-xs font-medium text-muted-foreground">Preview</p>
            <div className="pointer-events-none rounded-xl bg-muted/30 p-3">
              <PostCard post={preview} index={0} />
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button type="submit" form="post-form" disabled={saving}>
            {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {post ? 'Save changes' : 'Create post'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
