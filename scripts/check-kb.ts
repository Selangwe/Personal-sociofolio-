import { createHash } from 'node:crypto';
import { KNOWLEDGE_BASE } from '../lib/chat/knowledge-base';

/**
 * Determinism check for the chat assistant's knowledge base.
 *
 * The KB sits behind a `cache_control` breakpoint, and prompt caching is a
 * prefix match — one byte of drift between requests and the cache never hits,
 * so every message pays full price for ~6k tokens forever.
 *
 * Run this in three separate processes and compare. Identical hashes mean the
 * cache can work; differing hashes mean something non-deterministic leaked in
 * (a date, a relative timestamp, an unstable key order).
 *
 *   npm run check:kb
 *
 * Then change one word in lib/data/content.ts and re-run: the hash MUST change.
 * A hash that is stable because the serializer is silently dropping content is
 * worse than one that drifts.
 */

const hash = createHash('sha256').update(KNOWLEDGE_BASE).digest('hex');

// A rough token estimate. Good enough to notice if the KB doubles in size;
// use the count_tokens endpoint if you need a real number.
const approxTokens = Math.round(KNOWLEDGE_BASE.length / 4);

console.log(`sha256  ${hash}`);
console.log(`chars   ${KNOWLEDGE_BASE.length}`);
console.log(`tokens  ~${approxTokens}`);

if (/\d{4}-\d{2}-\d{2}T\d{2}:/.test(KNOWLEDGE_BASE)) {
  console.error('\nFAIL: an ISO timestamp is present — the cache will never hit.');
  process.exit(1);
}

if (/\b(seconds?|minutes?|hours?|days?|months?) ago\b/.test(KNOWLEDGE_BASE)) {
  console.error('\nFAIL: a relative timestamp is present — the cache will never hit.');
  process.exit(1);
}
