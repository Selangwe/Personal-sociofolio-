'use client';

import { motion } from 'framer-motion';
import { ArrowUp, Mail, Linkedin } from 'lucide-react';
import { profile, navItems } from '@/lib/data';

export function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scrollToSection = (href: string) => {
    const el = document.getElementById(href);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <footer className="border-t border-border bg-card">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 md:grid-cols-4">
          <div className="md:col-span-1">
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-sm font-bold text-primary-foreground" aria-hidden="true">
                SS
              </div>
              <span className="text-sm font-semibold text-foreground">
                Samme Samuel
              </span>
            </div>
            <p className="mt-3 text-sm text-muted-foreground">
              {profile.headline}
            </p>
            <div className="mt-4 flex gap-3">
              <a
                href={profile.socials[1].href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-border text-muted-foreground transition-colors hover:border-primary hover:text-primary"
                aria-label="LinkedIn"
              >
                <Linkedin className="h-4 w-4" />
              </a>
              <a
                href={`mailto:${profile.email}`}
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-border text-muted-foreground transition-colors hover:border-primary hover:text-primary"
                aria-label="Email"
              >
                <Mail className="h-4 w-4" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-foreground">Navigation</h4>
            <ul className="mt-3 space-y-2" role="list">
              {navItems.map((item) => (
                <li key={item.href}>
                  <button
                    onClick={() => scrollToSection(item.href)}
                    className="text-sm text-muted-foreground transition-colors hover:text-primary"
                  >
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-foreground">Services</h4>
            <ul className="mt-3 space-y-2" role="list">
              <li className="text-sm text-muted-foreground">AI Automation</li>
              <li className="text-sm text-muted-foreground">Website Development</li>
              <li className="text-sm text-muted-foreground">GoHighLevel Setup</li>
              <li className="text-sm text-muted-foreground">Cold Email Systems</li>
              <li className="text-sm text-muted-foreground">Lead Generation</li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-foreground">Newsletter</h4>
            <p className="mt-3 text-sm text-muted-foreground">
              Get automation tips and AI insights delivered weekly.
            </p>
            <form
              onSubmit={(e) => e.preventDefault()}
              className="mt-3 flex gap-2"
            >
              <input
                type="email"
                placeholder="your@email.com"
                aria-label="Email address for newsletter"
                className="h-10 flex-1 rounded-lg border border-border bg-background px-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
              />
              <motion.button
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.97 }}
                type="submit"
                className="rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground hover:bg-primary/90"
              >
                Join
              </motion.button>
            </form>
          </div>
        </div>

        <div className="mt-8 flex flex-col items-center justify-between gap-4 border-t border-border pt-6 sm:flex-row">
          <p className="text-xs text-muted-foreground">
            2025 Samme Samuel. All rights reserved.
          </p>
          <motion.button
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.97 }}
            onClick={scrollToTop}
            className="flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:border-primary hover:text-primary"
          >
            <ArrowUp className="h-3.5 w-3.5" />
            Back to top
          </motion.button>
        </div>
      </div>
    </footer>
  );
}
