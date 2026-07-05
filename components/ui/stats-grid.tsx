'use client';

import { motion } from 'framer-motion';
import { AnimatedCounter } from './animated-counter';

interface StatsGridProps {
  stats: { label: string; value: number; suffix: string }[];
}

export function StatsGrid({ stats }: StatsGridProps) {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
      {stats.map((stat, index) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.4, delay: index * 0.1 }}
          whileHover={{ y: -4 }}
          className="rounded-xl border border-border bg-card p-4 text-center shadow-sm transition-shadow hover:shadow-md"
        >
          <div className="text-2xl font-bold text-primary sm:text-3xl">
            <AnimatedCounter value={stat.value} suffix={stat.suffix} />
          </div>
          <p className="mt-1 text-xs text-muted-foreground sm:text-sm">
            {stat.label}
          </p>
        </motion.div>
      ))}
    </div>
  );
}
