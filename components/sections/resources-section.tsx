'use client';

import { motion } from 'framer-motion';
import {
  Sparkles,
  Mail,
  ListChecks,
  Workflow,
  Download,
  ArrowRight,
} from 'lucide-react';
import { resources } from '@/lib/data';
import { SectionHeading } from '@/components/ui/section-heading';

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Sparkles,
  Mail,
  ListChecks,
  Workflow,
};

export function ResourcesSection() {
  return (
    <section id="resources" aria-label="Free resources" className="scroll-mt-32 py-12">
      <SectionHeading
        title="Resources"
        subtitle="Free tools, templates, and guides to help you automate and grow."
      />

      <div className="grid gap-4 sm:grid-cols-2">
        {resources.map((resource, index) => {
          const Icon = iconMap[resource.icon] || Sparkles;
          return (
            <motion.div
              key={resource.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              whileHover={{ y: -4 }}
              className="group flex items-start gap-4 rounded-xl border border-border bg-card p-5 shadow-sm transition-shadow hover:shadow-md"
            >
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                <Icon className="h-6 w-6 text-primary" aria-hidden="true" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="rounded-full bg-secondary px-2 py-0.5 text-xs font-medium text-muted-foreground">
                    {resource.type}
                  </span>
                  {resource.downloads && (
                    <span className="text-xs text-muted-foreground">
                      {resource.downloads} downloads
                    </span>
                  )}
                </div>
                <h3 className="mt-2 text-sm font-semibold text-foreground">
                  {resource.title}
                </h3>
                <p className="mt-1 text-xs text-muted-foreground">
                  {resource.description}
                </p>
                <button className="mt-3 flex items-center gap-1.5 text-xs font-medium text-primary transition-colors hover:gap-2.5">
                  <Download className="h-3.5 w-3.5" aria-hidden="true" />
                  Get Resource
                  <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
