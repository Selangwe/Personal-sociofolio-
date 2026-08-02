'use client';

import { motion } from 'framer-motion';
import { ArrowRight, TrendingUp } from 'lucide-react';
import { projects } from '@/lib/data';
import { SectionHeading } from '@/components/ui/section-heading';
import { SkillBadge } from '@/components/ui/skill-badge';

export function ProjectsSection() {
  return (
    <section id="projects" aria-label="Projects portfolio" className="scroll-mt-32 py-12">
      <SectionHeading
        title="Featured Projects"
        subtitle="A selection of automation systems, websites, and campaigns I've built."
      />

      <div className="grid gap-6 sm:grid-cols-2">
        {projects.map((project, index) => (
          <motion.div
            key={project.id}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.4, delay: Math.min(index * 0.05, 0.2) }}
            whileHover={{ y: -4 }}
            className="group overflow-hidden rounded-xl border border-border bg-card shadow-sm transition-shadow hover:shadow-md"
          >
            <div className="relative h-48 overflow-hidden">
              <img
                src={project.cover}
                alt={project.title}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <span className="absolute left-3 top-3 rounded-full bg-primary px-2.5 py-1 text-xs font-medium text-primary-foreground">
                {project.category}
              </span>
            </div>

            <div className="p-5">
              <h3 className="text-base font-semibold text-foreground">
                {project.title}
              </h3>
              <p className="mt-2 text-sm text-muted-foreground">
                {project.description}
              </p>

              <div className="mt-3 flex flex-wrap gap-2">
                {project.techStack.map((tech) => (
                  <SkillBadge key={tech} name={tech} />
                ))}
              </div>

              <div className="mt-4 grid grid-cols-3 gap-2 border-t border-border pt-4">
                {project.results.map((result) => (
                  <div key={result.label} className="text-center">
                    <div className="flex items-center justify-center gap-1 text-sm font-bold text-primary">
                      <TrendingUp className="h-3.5 w-3.5" />
                      {result.value}
                    </div>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      {result.label}
                    </p>
                  </div>
                ))}
              </div>

              <button
                onClick={() =>
                  document
                    .getElementById('contact')
                    ?.scrollIntoView({ behavior: 'smooth' })
                }
                className="mt-4 flex items-center gap-1.5 text-sm font-medium text-primary transition-colors hover:gap-2.5"
              >
                View Project
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
