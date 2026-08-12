'use client';

import { motion } from 'framer-motion';
import type { ReactNode } from 'react';

/**
 * The page's fade-in wrapper.
 *
 * Extracted from `app/page.tsx` so that file can be a server component and
 * fetch posts. This is the only thing on the page that needed to be client-side;
 * the sections it wraps stay client components and are passed straight through
 * as children.
 */
export function PageTransition({ children }: { children: ReactNode }) {
  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {children}
    </motion.main>
  );
}
