'use client';

import { motion } from 'framer-motion';
import {
  Target,
  Eye,
  ShieldCheck,
  Lightbulb,
  TrendingUp,
} from 'lucide-react';
import { profile, coreValues, timeline, stats } from '@/lib/data';
import { SectionHeading } from '@/components/ui/section-heading';
import { StatsGrid } from '@/components/ui/stats-grid';
import { Timeline } from '@/components/ui/timeline';

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  ShieldCheck,
  Lightbulb,
  TrendingUp,
  Eye,
};

export function AboutSection() {
  return (
    <section id="about" aria-label="About Samme Samuel" className="scroll-mt-32 py-12">
      <SectionHeading
        title="About Me"
        subtitle="Get to know my story, mission, and what drives my work."
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ duration: 0.5 }}
        className="rounded-xl border border-border bg-card p-6 shadow-sm"
      >
        <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">
          {profile.bio}
        </p>
      </motion.div>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.5 }}
          className="rounded-xl border border-border bg-card p-6 shadow-sm"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
            <Target className="h-5 w-5 text-primary" />
          </div>
          <h3 className="mt-3 text-base font-semibold text-foreground">
            Mission
          </h3>
          <p className="mt-2 text-sm text-muted-foreground">
            To empower businesses with intelligent automation systems that
            eliminate repetitive work, generate qualified leads, and create
            sustainable growth without adding overhead.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.5 }}
          className="rounded-xl border border-border bg-card p-6 shadow-sm"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
            <Eye className="h-5 w-5 text-primary" />
          </div>
          <h3 className="mt-3 text-base font-semibold text-foreground">
            Vision
          </h3>
          <p className="mt-2 text-sm text-muted-foreground">
            To become a trusted partner for entrepreneurs and agencies worldwide,
            helping them leverage AI and automation to operate at peak efficiency
            and scale beyond what manual processes allow.
          </p>
        </motion.div>
      </div>

      <div className="mt-6">
        <h3 className="mb-4 text-lg font-semibold text-foreground">
          Core Values
        </h3>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {coreValues.map((value, index) => {
            const Icon = iconMap[value.icon] || ShieldCheck;
            return (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                whileHover={{ y: -4 }}
                className="rounded-xl border border-border bg-card p-5 shadow-sm transition-shadow hover:shadow-md"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <Icon className="h-5 w-5 text-primary" />
                </div>
                <h4 className="mt-3 text-sm font-semibold text-foreground">
                  {value.title}
                </h4>
                <p className="mt-1 text-xs text-muted-foreground">
                  {value.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>

      <div className="mt-8">
        <StatsGrid stats={stats} />
      </div>

      <div className="mt-12">
        <h3 className="mb-6 text-center text-lg font-semibold text-foreground">
          My Journey
        </h3>
        <Timeline events={timeline} />
      </div>
    </section>
  );
}
