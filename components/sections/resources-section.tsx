'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Sparkles,
  Mail,
  ListChecks,
  Workflow,
  Download,
  ArrowRight,
  CheckCircle2,
} from 'lucide-react';
import { resources } from '@/lib/data';
import { submitLead } from '@/lib/lead-capture';
import type { Resource } from '@/lib/types';
import { SectionHeading } from '@/components/ui/section-heading';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Sparkles,
  Mail,
  ListChecks,
  Workflow,
};

/** Starts the file download without navigating away from the page. */
function triggerDownload(resource: Resource) {
  const a = document.createElement('a');
  a.href = resource.link;
  a.download = resource.link.split('/').pop() ?? '';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

export function ResourcesSection() {
  const [active, setActive] = useState<Resource | null>(null);
  const [email, setEmail] = useState('');
  const [pending, setPending] = useState(false);
  const [done, setDone] = useState(false);

  const closeDialog = () => {
    setActive(null);
    // Reset after the close animation so the form doesn't flicker on the way out.
    setTimeout(() => {
      setEmail('');
      setDone(false);
      setPending(false);
    }, 200);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!active || pending) return;
    setPending(true);

    // The visitor was promised a file in exchange for their email. Deliver it
    // either way — a capture failure on our side is not their problem, and a
    // broken download costs far more trust than a missed lead.
    try {
      await submitLead('resource-download', { email, resource: active.title });
    } catch (err) {
      console.error('Lead capture failed for', active.title, err);
    } finally {
      setDone(true);
      triggerDownload(active);
      setPending(false);
    }
  };

  return (
    <section
      id="resources"
      aria-label="Free resources"
      className="scroll-mt-32 py-12"
    >
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
                  {resource.pages && (
                    <span className="text-xs text-muted-foreground">
                      PDF &middot; {resource.pages}
                    </span>
                  )}
                </div>
                <h3 className="mt-2 text-sm font-semibold text-foreground">
                  {resource.title}
                </h3>
                <p className="mt-1 text-xs text-muted-foreground">
                  {resource.description}
                </p>
                <button
                  onClick={() => setActive(resource)}
                  aria-label={`Get ${resource.title}`}
                  className="mt-3 flex items-center gap-1.5 text-xs font-medium text-primary transition-colors hover:gap-2.5"
                >
                  <Download className="h-3.5 w-3.5" aria-hidden="true" />
                  Get Resource
                  <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>

      <Dialog open={active !== null} onOpenChange={(o) => !o && closeDialog()}>
        <DialogContent className="sm:max-w-md">
          {done ? (
            <div className="flex flex-col items-center py-6 text-center">
              <CheckCircle2 className="h-12 w-12 text-green-500" />
              <p className="mt-3 text-sm font-medium text-foreground">
                Your download has started.
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                If nothing happened,{' '}
                <a
                  href={active?.link}
                  download
                  className="font-medium text-primary hover:underline"
                >
                  click here to download it
                </a>
                .
              </p>
            </div>
          ) : (
            <>
              <DialogHeader>
                <DialogTitle className="text-base">
                  {active?.title}
                </DialogTitle>
                <DialogDescription className="text-xs">
                  Enter your email and the download starts right away. No spam,
                  unsubscribe anytime.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="mt-2 space-y-3">
                <input
                  type="email"
                  required
                  autoFocus
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  aria-label="Your email address"
                  className="h-11 w-full rounded-lg border border-border bg-background px-4 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                />
                <button
                  type="submit"
                  disabled={pending}
                  className="flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-primary text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-60"
                >
                  <Download className="h-4 w-4" />
                  {pending ? 'Preparing...' : 'Send me the file'}
                </button>
              </form>
            </>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
}
