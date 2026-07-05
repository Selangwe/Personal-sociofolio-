'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface TimelineProps {
  events: { year: string; title: string; description: string }[];
  className?: string;
}

export function Timeline({ events, className }: TimelineProps) {
  return (
    <div className={cn('relative', className)}>
      <div className="absolute left-4 top-2 bottom-2 w-px bg-border sm:left-1/2" />
      <div className="space-y-8">
        {events.map((event, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className={cn(
              'relative flex items-start gap-6',
              'sm:w-1/2',
              index % 2 === 0 ? 'sm:pr-8 sm:text-right' : 'sm:ml-auto sm:pl-8',
            )}
          >
            <div
              className={cn(
                'absolute left-4 top-1.5 z-10 h-3 w-3 -translate-x-1/2 rounded-full border-2 border-primary bg-primary ring-4 ring-background sm:left-1/2',
                index % 2 === 0 ? 'sm:-translate-x-1/2' : 'sm:-translate-x-1/2',
              )}
            />
            <div className="ml-10 rounded-xl border border-border bg-card p-4 shadow-sm sm:ml-0">
              <span className="text-xs font-semibold text-primary">
                {event.year}
              </span>
              <h4 className="mt-1 text-sm font-semibold text-foreground">
                {event.title}
              </h4>
              <p className="mt-1 text-xs text-muted-foreground">
                {event.description}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
