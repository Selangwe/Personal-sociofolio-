'use client';

import { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { Calendar, Loader2, MessageCircle, RotateCcw, Send, X } from 'lucide-react';

import { profile } from '@/lib/data';
import { cn } from '@/lib/utils';
import { GREETING, useChat } from '@/components/chat/use-chat';

/**
 * Floating chat assistant.
 *
 * Mounted globally in `app/layout.tsx` beside the Toaster, and hidden on
 * `/admin` — the dashboard is a working surface, not a place to be sold to.
 *
 * Positioning note: `components/layout/mobile-nav.tsx` already renders a
 * Calendly FAB at `bottom-20 right-4 z-50` and the mobile nav bar at `z-40`.
 * The launcher stacks directly above that FAB rather than on top of it, and the
 * open panel sits at `z-[55]` — above the `z-50` navbar, below the `z-[60]`
 * skip link.
 */

const MAX_CHARS = 2000;

export function ChatWidget() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState('');

  const reduceMotion = useReducedMotion();
  const { turns, send, reset, streaming, error, bookingUrl, atLimit, offline } =
    useChat();

  const launcherRef = useRef<HTMLButtonElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const logEndRef = useRef<HTMLDivElement>(null);

  // Focus the composer on open; hand focus back to the launcher on close.
  useEffect(() => {
    if (open) inputRef.current?.focus();
    else launcherRef.current?.focus({ preventScroll: true });
  }, [open]);

  // Escape closes, and focus stays inside the panel while it's open.
  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.stopPropagation();
        setOpen(false);
        return;
      }

      if (event.key !== 'Tab' || !panelRef.current) return;

      const focusable = panelRef.current.querySelectorAll<HTMLElement>(
        'button, [href], textarea, input, select, [tabindex]:not([tabindex="-1"])',
      );
      if (focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', onKeyDown, true);
    return () => document.removeEventListener('keydown', onKeyDown, true);
  }, [open]);

  useEffect(() => {
    logEndRef.current?.scrollIntoView({
      behavior: reduceMotion ? 'auto' : 'smooth',
      block: 'end',
    });
  }, [turns, reduceMotion]);

  // The dashboard doesn't get a sales assistant.
  if (pathname?.startsWith('/admin')) return null;

  const submit = () => {
    const text = draft.trim();
    if (!text) return;
    setDraft('');
    void send(text);
  };

  const composerDisabled = streaming || atLimit || offline;

  const motionProps = reduceMotion
    ? { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 } }
    : {
        initial: { opacity: 0, y: 16, scale: 0.98 },
        animate: { opacity: 1, y: 0, scale: 1 },
        exit: { opacity: 0, y: 16, scale: 0.98 },
      };

  return (
    <>
      <motion.button
        ref={launcherRef}
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-label={open ? 'Close chat' : "Chat with Samme's assistant"}
        aria-expanded={open}
        aria-controls="chat-panel"
        whileTap={reduceMotion ? undefined : { scale: 0.92 }}
        className={cn(
          'fixed z-50 flex h-12 w-12 items-center justify-center rounded-full',
          'bg-primary text-primary-foreground shadow-lg',
          'transition-colors hover:bg-primary/90',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2',
          // Mobile: directly above the existing Calendly FAB at bottom-20.
          'bottom-36 right-4',
          // Desktop: the mobile FAB is hidden, so the corner is free.
          'md:bottom-6 md:right-6 md:h-14 md:w-14',
        )}
      >
        {open ? (
          <X className="h-5 w-5" />
        ) : (
          <MessageCircle className="h-5 w-5 md:h-6 md:w-6" />
        )}
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            {...motionProps}
            transition={{ duration: 0.18 }}
            ref={panelRef}
            id="chat-panel"
            role="dialog"
            aria-modal="true"
            aria-labelledby="chat-title"
            className={cn(
              'fixed inset-0 z-[55] flex flex-col bg-card',
              'md:inset-auto md:bottom-24 md:right-6 md:h-[560px] md:w-[380px]',
              'md:rounded-xl md:border md:border-border md:shadow-xl',
            )}
          >
            <header className="flex items-center justify-between border-b border-border px-4 py-3">
              <div className="min-w-0">
                <h2 id="chat-title" className="text-sm font-semibold text-foreground">
                  Ask about {profile.name.split(' ')[0]}&apos;s work
                </h2>
                <p className="truncate text-xs text-muted-foreground">
                  AI assistant · replies are not from {profile.name.split(' ')[0]} directly
                </p>
              </div>
              <div className="flex items-center gap-1">
                {turns.length > 0 && (
                  <button
                    type="button"
                    onClick={reset}
                    aria-label="Start a new conversation"
                    className="rounded-md p-2 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                  >
                    <RotateCcw className="h-4 w-4" />
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  aria-label="Close chat"
                  className="rounded-md p-2 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </header>

            <div
              role="log"
              aria-live="polite"
              aria-relevant="additions text"
              className="flex-1 space-y-3 overflow-y-auto px-4 py-4"
            >
              <Bubble role="assistant" content={GREETING} />

              {turns.map((turn, index) => (
                <Bubble
                  key={index}
                  role={turn.role}
                  content={turn.content}
                  pending={
                    streaming &&
                    index === turns.length - 1 &&
                    turn.role === 'assistant' &&
                    turn.content === ''
                  }
                />
              ))}

              {bookingUrl && (
                <a
                  href={bookingUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                >
                  <Calendar className="h-4 w-4" />
                  Book a 30-minute call
                </a>
              )}

              {error && (
                <p
                  role="status"
                  className="rounded-lg bg-secondary px-3 py-2 text-xs text-muted-foreground"
                >
                  {error}{' '}
                  <a href={`mailto:${profile.email}`} className="underline">
                    Email {profile.name.split(' ')[0]} instead
                  </a>
                  .
                </p>
              )}

              {atLimit && !error && (
                <p className="rounded-lg bg-secondary px-3 py-2 text-xs text-muted-foreground">
                  That&apos;s a good place to pause — a call will get you further
                  than I can.{' '}
                  <a
                    href={profile.calendly}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline"
                  >
                    Book one here
                  </a>
                  .
                </p>
              )}

              <div ref={logEndRef} />
            </div>

            <div className="border-t border-border p-3">
              <label htmlFor="chat-input" className="sr-only">
                Your message
              </label>
              <div className="flex items-end gap-2">
                <textarea
                  ref={inputRef}
                  id="chat-input"
                  rows={1}
                  value={draft}
                  maxLength={MAX_CHARS}
                  disabled={composerDisabled}
                  placeholder={
                    offline
                      ? 'The assistant is offline right now'
                      : atLimit
                        ? 'Conversation limit reached'
                        : 'Ask a question…'
                  }
                  onChange={(event) => setDraft(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter' && !event.shiftKey) {
                      event.preventDefault();
                      submit();
                    }
                  }}
                  className="max-h-32 min-h-[2.75rem] flex-1 resize-none rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary disabled:opacity-60"
                />
                <button
                  type="button"
                  onClick={submit}
                  disabled={composerDisabled || draft.trim().length === 0}
                  aria-label="Send message"
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:opacity-50"
                >
                  {streaming ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                </button>
              </div>
              {draft.length > MAX_CHARS - 200 && (
                <p className="mt-1 text-right text-xs text-muted-foreground">
                  {draft.length} / {MAX_CHARS}
                </p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function Bubble({
  role,
  content,
  pending = false,
}: {
  role: 'user' | 'assistant';
  content: string;
  pending?: boolean;
}) {
  const isUser = role === 'user';

  return (
    <div className={cn('flex', isUser ? 'justify-end' : 'justify-start')}>
      <div
        className={cn(
          'max-w-[85%] rounded-xl px-3 py-2 text-sm',
          isUser
            ? 'bg-primary text-primary-foreground'
            : 'bg-secondary text-secondary-foreground',
        )}
      >
        {pending ? (
          <span className="flex items-center gap-1">
            <span className="sr-only">Assistant is typing</span>
            <Dot delay="0ms" />
            <Dot delay="150ms" />
            <Dot delay="300ms" />
          </span>
        ) : (
          // Plain text only. No markdown renderer and no dangerouslySetInnerHTML:
          // this content originates from a model that reads visitor input.
          <p className="whitespace-pre-wrap break-words">{content}</p>
        )}
      </div>
    </div>
  );
}

function Dot({ delay }: { delay: string }) {
  return (
    <span
      aria-hidden="true"
      className="h-1.5 w-1.5 animate-pulse rounded-full bg-muted-foreground"
      style={{ animationDelay: delay }}
    />
  );
}
