'use client';

import { motion } from 'framer-motion';
import {
  Bot,
  Code,
  Rocket,
  Search,
  Mail,
  Database,
  Headset,
  Target,
  Workflow,
  ArrowRight,
  CheckCircle2,
} from 'lucide-react';
import { services } from '@/lib/data';
import { SectionHeading } from '@/components/ui/section-heading';

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Bot,
  Code,
  Rocket,
  Search,
  Mail,
  Database,
  Headset,
  Target,
  Workflow,
};

export function ServicesSection() {
  return (
    <section id="services" className="scroll-mt-32 py-12">
      <SectionHeading
        title="Services"
        subtitle="Specialized solutions to automate, scale, and grow your business."
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {services.map((service, index) => {
          const Icon = iconMap[service.icon] || Bot;
          return (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.4, delay: Math.min(index * 0.05, 0.2) }}
              whileHover={{ y: -4 }}
              className="group flex flex-col rounded-xl border border-border bg-card p-6 shadow-sm transition-shadow hover:shadow-md"
            >
              <div
                className={`flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br ${service.color} text-white shadow-sm`}
              >
                <Icon className="h-6 w-6" />
              </div>
              <h3 className="mt-4 text-base font-semibold text-foreground">
                {service.title}
              </h3>
              <p className="mt-2 flex-1 text-sm text-muted-foreground">
                {service.description}
              </p>
              <ul className="mt-4 space-y-1.5">
                {service.benefits.map((benefit, i) => (
                  <li
                    key={i}
                    className="flex items-center gap-2 text-xs text-muted-foreground"
                  >
                    <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-primary" />
                    {benefit}
                  </li>
                ))}
              </ul>
              <button
                onClick={() =>
                  document
                    .getElementById('contact')
                    ?.scrollIntoView({ behavior: 'smooth' })
                }
                className="mt-4 flex items-center gap-1.5 text-sm font-medium text-primary transition-colors hover:gap-2.5"
              >
                Get Started
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </button>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
