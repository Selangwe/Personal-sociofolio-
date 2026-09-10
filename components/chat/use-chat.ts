'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import type { ChatEvent } from '@/lib/chat/schema';

/**
 * Conversation state, the POST, and SSE parsing for the chat widget.
 *
 * History lives in `sessionStorage` so a scroll-triggered re-render or an
 * accidental refresh doesn't lose the thread, and clears when the tab closes.
 */

export interface ChatTurn {
  role: 'user' | 'assistant';
  content: string;
}

const STORAGE_KEY = 'sam-chat-v1';

/** Client-side, so an idle visitor costs nothing. */
export const GREETING =
  "Hi — I'm Samme's assistant. Ask me about his services, his work, or what he could do for your business.";

/** Mirrors CHAT_MAX_MESSAGES on the server. */
const MAX_TURNS = 24;

export function useChat() {
  const [turns, setTurns] = useState<ChatTurn[]>([]);
  const [streaming, setStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [bookingUrl, setBookingUrl] = useState<string | null>(null);
  const [offline, setOffline] = useState(false);

  const abortRef = useRef<AbortController | null>(null);

  // Restore on mount. Wrapped because storage throws in some privacy modes.
  useEffect(() => {
    try {
      const saved = sessionStorage.getItem(STORAGE_KEY);
      if (saved) setTurns(JSON.parse(saved) as ChatTurn[]);
    } catch {
      /* no history is a fine starting state */
    }
  }, []);

  useEffect(() => {
    try {
      if (turns.length > 0) {
        sessionStorage.setItem(STORAGE_KEY, JSON.stringify(turns));
      }
    } catch {
      /* persistence is a convenience, never a requirement */
    }
  }, [turns]);

  useEffect(() => () => abortRef.current?.abort(), []);

  const atLimit = turns.length >= MAX_TURNS;

  const send = useCallback(
    async (text: string) => {
      const message = text.trim();
      if (!message || streaming || atLimit || offline) return;

      setError(null);

      const history: ChatTurn[] = [...turns, { role: 'user', content: message }];
      // Empty assistant turn that the stream fills in token by token.
      setTurns([...history, { role: 'assistant', content: '' }]);
      setStreaming(true);

      const controller = new AbortController();
      abortRef.current = controller;

      try {
        const response = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ messages: history }),
          signal: controller.signal,
        });

        if (!response.ok || !response.body) {
          const payload = await response.json().catch(() => null);
          const detail =
            payload && typeof payload.error === 'string'
              ? payload.error
              : 'The assistant is unavailable right now.';

          if (response.status === 503) setOffline(true);
          setError(detail);
          // Drop the empty assistant bubble — there's nothing to show in it.
          setTurns(history);
          return;
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let buffer = '';

        const append = (delta: string) =>
          setTurns((current) => {
            const next = [...current];
            const last = next[next.length - 1];
            if (last?.role === 'assistant') {
              next[next.length - 1] = {
                ...last,
                content: last.content + delta,
              };
            }
            return next;
          });

        // eslint-disable-next-line no-constant-condition
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });

          const frames = buffer.split('\n\n');
          buffer = frames.pop() ?? '';

          for (const frame of frames) {
            const line = frame.trim();
            if (!line.startsWith('data:')) continue;

            let event: ChatEvent;
            try {
              event = JSON.parse(line.slice(5).trim()) as ChatEvent;
            } catch {
              continue;
            }

            if (event.type === 'text') append(event.text);
            else if (event.type === 'qualified') setBookingUrl(event.bookingUrl);
            else if (event.type === 'error') setError(event.message);
          }
        }
      } catch (caught) {
        if ((caught as Error)?.name === 'AbortError') return;
        setError('Connection lost. Try again in a moment.');
        setTurns(history);
      } finally {
        setStreaming(false);
        abortRef.current = null;
      }
    },
    [atLimit, offline, streaming, turns],
  );

  const reset = useCallback(() => {
    abortRef.current?.abort();
    setTurns([]);
    setError(null);
    setBookingUrl(null);
    try {
      sessionStorage.removeItem(STORAGE_KEY);
    } catch {
      /* nothing to clean up */
    }
  }, []);

  return { turns, send, reset, streaming, error, bookingUrl, atLimit, offline };
}
