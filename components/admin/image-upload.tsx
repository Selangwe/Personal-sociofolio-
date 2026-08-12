'use client';

import { useRef, useState } from 'react';
import { ImagePlus, Link2, Loader2, X } from 'lucide-react';
import { toast } from 'sonner';
import { getBrowserClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const BUCKET = 'post-images';
const MAX_BYTES = 5 * 1024 * 1024;

/**
 * Turns "DSC_0042 (final).PNG" into "dsc_0042-final.png".
 *
 * Storage keys with spaces and parentheses produce URLs that need escaping
 * everywhere they are used. The site already has one such file in
 * `public/images/` and it is a persistent nuisance — don't create more.
 */
function safeName(name: string): string {
  const dot = name.lastIndexOf('.');
  const base = (dot === -1 ? name : name.slice(0, dot)).toLowerCase();
  const ext = (dot === -1 ? '' : name.slice(dot + 1)).toLowerCase();
  const cleanBase =
    base
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .slice(0, 60) || 'image';
  const cleanExt = ext.replace(/[^a-z0-9]/g, '') || 'jpg';
  return `${Date.now()}-${cleanBase}.${cleanExt}`;
}

interface ImageUploadProps {
  value: string[];
  onChange: (urls: string[]) => void;
  /** 1 for a single-image post, more for a carousel. */
  max?: number;
}

export function ImageUpload({ value, onChange, max = 1 }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [urlDraft, setUrlDraft] = useState('');
  const [dragging, setDragging] = useState(false);
  const fileInput = useRef<HTMLInputElement>(null);

  const remaining = max - value.length;

  const uploadFiles = async (files: FileList | File[]) => {
    const supabase = getBrowserClient();
    if (!supabase) {
      toast.error('Supabase is not configured.');
      return;
    }

    const chosen = Array.from(files).slice(0, Math.max(remaining, 0));
    if (chosen.length === 0) {
      toast.error(`You can add at most ${max} image${max === 1 ? '' : 's'}.`);
      return;
    }

    setUploading(true);
    const uploaded: string[] = [];

    for (const file of chosen) {
      if (!file.type.startsWith('image/')) {
        toast.error(`${file.name} is not an image.`);
        continue;
      }
      if (file.size > MAX_BYTES) {
        toast.error(`${file.name} is larger than 5MB.`);
        continue;
      }

      const key = safeName(file.name);
      const { error } = await supabase.storage
        .from(BUCKET)
        .upload(key, file, { cacheControl: '31536000', upsert: false });

      if (error) {
        toast.error(`Upload failed: ${error.message}`);
        continue;
      }

      const { data } = supabase.storage.from(BUCKET).getPublicUrl(key);
      uploaded.push(data.publicUrl);
    }

    if (uploaded.length > 0) {
      onChange([...value, ...uploaded]);
      toast.success(`Uploaded ${uploaded.length} image${uploaded.length === 1 ? '' : 's'}.`);
    }
    setUploading(false);
    if (fileInput.current) fileInput.current.value = '';
  };

  const addUrl = () => {
    const url = urlDraft.trim();
    if (!url) return;
    try {
      new URL(url);
    } catch {
      toast.error('That is not a valid URL.');
      return;
    }
    if (remaining <= 0) {
      toast.error(`You can add at most ${max} image${max === 1 ? '' : 's'}.`);
      return;
    }
    onChange([...value, url]);
    setUrlDraft('');
  };

  const removeAt = (index: number) => {
    // Storage objects are left in place deliberately: the same upload may be
    // referenced by another post, and an orphaned file is cheaper than a
    // broken image.
    onChange(value.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-3">
      {value.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {value.map((url, index) => (
            <div
              key={`${url}-${index}`}
              className="group relative h-20 w-20 overflow-hidden rounded-lg border border-border"
            >
              <img src={url} alt="" className="h-full w-full object-cover" />
              <button
                type="button"
                onClick={() => removeAt(index)}
                aria-label={`Remove image ${index + 1}`}
                className="absolute right-1 top-1 rounded-full bg-background/90 p-1 text-foreground opacity-0 transition-opacity group-hover:opacity-100 focus:opacity-100"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}
        </div>
      )}

      {remaining > 0 && (
        <>
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setDragging(true);
            }}
            onDragLeave={() => setDragging(false)}
            onDrop={(e) => {
              e.preventDefault();
              setDragging(false);
              if (e.dataTransfer.files.length) uploadFiles(e.dataTransfer.files);
            }}
            onClick={() => fileInput.current?.click()}
            className={`flex cursor-pointer flex-col items-center justify-center gap-1 rounded-lg border border-dashed p-4 text-center text-xs transition-colors ${
              dragging
                ? 'border-primary bg-primary/5'
                : 'border-border hover:border-primary/50'
            }`}
          >
            {uploading ? (
              <Loader2 className="h-5 w-5 animate-spin text-primary" />
            ) : (
              <ImagePlus className="h-5 w-5 text-muted-foreground" />
            )}
            <span className="text-muted-foreground">
              {uploading
                ? 'Uploading...'
                : `Drop ${max === 1 ? 'an image' : 'images'} here, or click to browse`}
            </span>
            <span className="text-[10px] text-muted-foreground">
              PNG or JPG, up to 5MB
            </span>
          </div>

          <input
            ref={fileInput}
            type="file"
            accept="image/*"
            multiple={max > 1}
            className="hidden"
            onChange={(e) => e.target.files && uploadFiles(e.target.files)}
          />

          <div className="flex gap-2">
            <Input
              value={urlDraft}
              onChange={(e) => setUrlDraft(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  // The editor form is an ancestor; Enter here must not submit it.
                  e.preventDefault();
                  addUrl();
                }
              }}
              placeholder="...or paste an image URL"
              className="h-9 text-xs"
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addUrl}
              className="h-9 shrink-0"
            >
              <Link2 className="mr-1 h-3 w-3" />
              Add
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
