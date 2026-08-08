'use client';

import { Share2, Link2, Send } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu';
import { profile } from '@/lib/data';
import { toast } from 'sonner';

interface ShareMenuProps {
  /** Post id, used to build a deep link (#post-id) to the specific post. */
  postId: string;
  /** Text used as the share caption / tweet body. */
  title: string;
}

/**
 * Builds the absolute URL to this specific post. Falls back to the configured
 * website when window isn't available (SSR).
 */
function getShareUrl(postId: string): string {
  if (typeof window !== 'undefined') {
    return `${window.location.origin}${window.location.pathname}#${postId}`;
  }
  return `${profile.website}#${postId}`;
}

/** Minimal inline brand icons (lucide dropped its brand icons, so we inline them). */
function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M22 12a10 10 0 1 0-11.56 9.88v-6.99H7.9V12h2.54V9.8c0-2.5 1.49-3.89 3.77-3.89 1.09 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56V12h2.78l-.44 2.89h-2.34v6.99A10 10 0 0 0 22 12Z" />
    </svg>
  );
}

function XIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24h-6.66l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231 5.45-6.231Zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77Z" />
    </svg>
  );
}

function LinkedInIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.13 1.45-2.13 2.94v5.67H9.35V9h3.42v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28ZM5.34 7.43a2.07 2.07 0 1 1 0-4.14 2.07 2.07 0 0 1 0 4.14ZM7.12 20.45H3.55V9h3.57v11.45ZM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.22.79 24 1.77 24h20.45c.98 0 1.78-.78 1.78-1.73V1.73C24 .77 23.2 0 22.22 0Z" />
    </svg>
  );
}

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M.06 24l1.69-6.16a11.87 11.87 0 0 1-1.6-5.95C.15 5.34 5.5 0 12.06 0a11.82 11.82 0 0 1 8.42 3.49 11.82 11.82 0 0 1 3.48 8.42c0 6.56-5.34 11.9-11.9 11.9a11.9 11.9 0 0 1-5.69-1.45L.06 24Zm6.6-3.8c1.68.99 3.28 1.59 5.4 1.59 5.45 0 9.89-4.43 9.89-9.88a9.86 9.86 0 0 0-16.83-6.99A9.82 9.82 0 0 0 2.23 12c0 2.22.62 3.88 1.66 5.62l-1 3.66 3.77-.99Zm11.36-5.29c-.07-.12-.27-.2-.56-.34-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.96-.94 1.16-.17.2-.35.22-.64.07-.3-.15-1.25-.46-2.38-1.47-.88-.78-1.47-1.75-1.65-2.05-.17-.3-.02-.46.13-.6.13-.14.3-.35.44-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.8.37s-1.05 1.02-1.05 2.5 1.08 2.9 1.23 3.1c.15.2 2.12 3.24 5.14 4.54.72.31 1.28.5 1.71.63.72.23 1.37.2 1.89.12.58-.09 1.76-.72 2.01-1.42.25-.7.25-1.29.17-1.42Z" />
    </svg>
  );
}

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M12 2.16c3.2 0 3.58.01 4.85.07 1.17.05 1.8.25 2.23.41.56.22.96.48 1.38.9.42.42.68.82.9 1.38.16.42.36 1.06.41 2.23.06 1.27.07 1.65.07 4.85s-.01 3.58-.07 4.85c-.05 1.17-.25 1.8-.41 2.23-.22.56-.48.96-.9 1.38-.42.42-.82.68-1.38.9-.42.16-1.06.36-2.23.41-1.27.06-1.65.07-4.85.07s-3.58-.01-4.85-.07c-1.17-.05-1.8-.25-2.23-.41a3.72 3.72 0 0 1-1.38-.9 3.72 3.72 0 0 1-.9-1.38c-.16-.42-.36-1.06-.41-2.23C2.17 15.58 2.16 15.2 2.16 12s.01-3.58.07-4.85c.05-1.17.25-1.8.41-2.23.22-.56.48-.96.9-1.38.42-.42.82-.68 1.38-.9.42-.16 1.06-.36 2.23-.41C8.42 2.17 8.8 2.16 12 2.16ZM12 0C8.74 0 8.33.01 7.05.07 5.78.13 4.9.33 4.14.63a5.88 5.88 0 0 0-2.13 1.38A5.88 5.88 0 0 0 .63 4.14C.33 4.9.13 5.78.07 7.05.01 8.33 0 8.74 0 12s.01 3.67.07 4.95c.06 1.27.26 2.15.56 2.91.31.79.72 1.46 1.38 2.13a5.88 5.88 0 0 0 2.13 1.38c.76.3 1.64.5 2.91.56C8.33 23.99 8.74 24 12 24s3.67-.01 4.95-.07c1.27-.06 2.15-.26 2.91-.56a5.88 5.88 0 0 0 2.13-1.38 5.88 5.88 0 0 0 1.38-2.13c.3-.76.5-1.64.56-2.91.06-1.28.07-1.69.07-4.95s-.01-3.67-.07-4.95c-.06-1.27-.26-2.15-.56-2.91a5.88 5.88 0 0 0-1.38-2.13A5.88 5.88 0 0 0 19.86.63c-.76-.3-1.64-.5-2.91-.56C15.67.01 15.26 0 12 0Zm0 5.84A6.16 6.16 0 1 0 18.16 12 6.16 6.16 0 0 0 12 5.84Zm0 10.16A4 4 0 1 1 16 12a4 4 0 0 1-4 4Zm6.4-11.85a1.44 1.44 0 1 0 1.44 1.44 1.44 1.44 0 0 0-1.44-1.44Z" />
    </svg>
  );
}

export function ShareMenu({ postId, title }: ShareMenuProps) {
  const share = (platform: 'facebook' | 'x' | 'linkedin' | 'whatsapp') => {
    const url = encodeURIComponent(getShareUrl(postId));
    const text = encodeURIComponent(title);
    const links: Record<typeof platform, string> = {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${url}`,
      x: `https://twitter.com/intent/tweet?url=${url}&text=${text}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${url}`,
      whatsapp: `https://wa.me/?text=${text}%20${url}`,
    };
    window.open(links[platform], '_blank', 'noopener,noreferrer,width=600,height=600');
  };

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(getShareUrl(postId));
      toast.success('Link copied to clipboard');
    } catch {
      toast.error('Could not copy the link');
    }
  };

  /** Native share sheet (mobile). This is the only way to reach Instagram/TikTok. */
  const nativeShare = async () => {
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({ title, url: getShareUrl(postId) });
      } catch {
        /* user dismissed the share sheet - no-op */
      }
    } else {
      await copyLink();
      toast.info('Open the Instagram app and paste the link into your story or bio.');
    }
  };

  const itemClass =
    'flex cursor-pointer items-center gap-3 text-sm text-foreground focus:bg-secondary';

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className="flex flex-1 items-center justify-center gap-2 rounded-lg py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary"
          aria-label="Share this post"
        >
          <Share2 className="h-4 w-4" />
          Share
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-52">
        <DropdownMenuItem className={itemClass} onClick={() => share('facebook')}>
          <FacebookIcon className="h-4 w-4 text-[#1877F2]" />
          Facebook
        </DropdownMenuItem>
        <DropdownMenuItem className={itemClass} onClick={() => share('x')}>
          <XIcon className="h-4 w-4" />
          X (Twitter)
        </DropdownMenuItem>
        <DropdownMenuItem className={itemClass} onClick={() => share('linkedin')}>
          <LinkedInIcon className="h-4 w-4 text-[#0A66C2]" />
          LinkedIn
        </DropdownMenuItem>
        <DropdownMenuItem className={itemClass} onClick={() => share('whatsapp')}>
          <WhatsAppIcon className="h-4 w-4 text-[#25D366]" />
          WhatsApp
        </DropdownMenuItem>
        <DropdownMenuItem className={itemClass} onClick={nativeShare}>
          <InstagramIcon className="h-4 w-4 text-[#E4405F]" />
          Instagram &amp; more
        </DropdownMenuItem>
        <DropdownMenuItem className={itemClass} onClick={nativeShare}>
          <Send className="h-4 w-4" />
          More apps…
        </DropdownMenuItem>
        <DropdownMenuItem className={itemClass} onClick={copyLink}>
          <Link2 className="h-4 w-4" />
          Copy link
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
