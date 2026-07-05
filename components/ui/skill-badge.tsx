'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface SkillBadgeProps {
  name: string;
  level?: number;
  className?: string;
}

export function SkillBadge({ name, level, className }: SkillBadgeProps) {
  return (
    <motion.span
      whileHover={{ scale: 1.05, y: -2 }}
      transition={{ type: 'spring', stiffness: 400, damping: 17 }}
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border border-border bg-secondary px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:border-primary hover:bg-primary/10 hover:text-primary',
        className,
      )}
    >
      {name}
      {level !== undefined && (
        <span className="text-muted-foreground">{level}%</span>
      )}
    </motion.span>
  );
}
