'use client';

import { useCallback, useEffect, useState } from 'react';
import { format } from 'date-fns';
import { Loader2, Pencil, Plus, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { getBrowserClient } from '@/lib/supabase/client';
import type { PostRecord } from '@/lib/types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { PostEditor } from './post-editor';

export function PostList() {
  const [posts, setPosts] = useState<PostRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<PostRecord | null>(null);
  const [editorOpen, setEditorOpen] = useState(false);
  const [pendingDelete, setPendingDelete] = useState<PostRecord | null>(null);

  const load = useCallback(async () => {
    const supabase = getBrowserClient();
    if (!supabase) return;

    setLoading(true);
    // No `published` filter — the owner needs to see drafts too, which the
    // row-level policy allows only for their own session.
    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .order('created_at', { ascending: false });
    setLoading(false);

    if (error) {
      toast.error(`Could not load posts: ${error.message}`);
      return;
    }
    setPosts((data ?? []) as PostRecord[]);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const togglePublished = async (post: PostRecord, published: boolean) => {
    const supabase = getBrowserClient();
    if (!supabase) return;

    // Update locally first so the switch responds immediately.
    setPosts((current) =>
      current.map((p) => (p.id === post.id ? { ...p, published } : p)),
    );

    const { error } = await supabase
      .from('posts')
      .update({ published, updated_at: new Date().toISOString() })
      .eq('id', post.id);

    if (error) {
      // Put the switch back where it was; the database never changed.
      setPosts((current) =>
        current.map((p) => (p.id === post.id ? { ...p, published: !published } : p)),
      );
      toast.error(`Could not update: ${error.message}`);
      return;
    }

    toast.success(published ? 'Post published.' : 'Post moved to drafts.');
  };

  const confirmDelete = async () => {
    const supabase = getBrowserClient();
    if (!supabase || !pendingDelete) return;

    const { error } = await supabase.from('posts').delete().eq('id', pendingDelete.id);
    setPendingDelete(null);

    if (error) {
      toast.error(`Could not delete: ${error.message}`);
      return;
    }
    toast.success('Post deleted.');
    load();
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {loading ? 'Loading...' : `${posts.length} post${posts.length === 1 ? '' : 's'}`}
        </p>
        <Button
          size="sm"
          onClick={() => {
            setEditing(null);
            setEditorOpen(true);
          }}
        >
          <Plus className="mr-1.5 h-4 w-4" />
          New post
        </Button>
      </div>

      <div className="rounded-xl border border-border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead className="hidden sm:table-cell">Category</TableHead>
              <TableHead className="hidden md:table-cell">Created</TableHead>
              <TableHead>Live</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading && (
              <TableRow>
                <TableCell colSpan={5} className="py-10 text-center">
                  <Loader2 className="mx-auto h-5 w-5 animate-spin text-muted-foreground" />
                </TableCell>
              </TableRow>
            )}

            {!loading && posts.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="py-10 text-center text-sm text-muted-foreground"
                >
                  No posts yet. The public feed is showing the built-in fallback
                  posts until you create one.
                </TableCell>
              </TableRow>
            )}

            {posts.map((post) => (
              <TableRow key={post.id}>
                <TableCell>
                  <div className="font-medium">{post.title || 'Untitled'}</div>
                  <div className="text-xs text-muted-foreground">
                    /{post.slug} &middot; {post.type}
                  </div>
                </TableCell>
                <TableCell className="hidden sm:table-cell">
                  <Badge variant="secondary">{post.category}</Badge>
                </TableCell>
                <TableCell className="hidden md:table-cell text-xs text-muted-foreground">
                  {format(new Date(post.created_at), 'd MMM yyyy')}
                </TableCell>
                <TableCell>
                  <Switch
                    checked={post.published}
                    onCheckedChange={(checked) => togglePublished(post, checked)}
                    aria-label={`Publish ${post.title || post.slug}`}
                  />
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    size="icon"
                    aria-label={`Edit ${post.title || post.slug}`}
                    onClick={() => {
                      setEditing(post);
                      setEditorOpen(true);
                    }}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    aria-label={`Delete ${post.title || post.slug}`}
                    onClick={() => setPendingDelete(post)}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <PostEditor
        open={editorOpen}
        onOpenChange={setEditorOpen}
        post={editing}
        onSaved={load}
      />

      <AlertDialog
        open={pendingDelete !== null}
        onOpenChange={(open) => !open && setPendingDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this post?</AlertDialogTitle>
            <AlertDialogDescription>
              &ldquo;{pendingDelete?.title || pendingDelete?.slug}&rdquo; will be
              removed permanently. This cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
