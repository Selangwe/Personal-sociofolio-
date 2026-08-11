'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Newspaper,
  FolderKanban,
  Video,
  Mail,
  Calendar,
  Sparkles,
  ArrowRight,
  CheckCircle2,
} from 'lucide-react';
import { toast } from 'sonner';
import { posts, profile, projects, upcomingEvents } from '@/lib/data';
import { submitLead } from '@/lib/lead-capture';
import { RippleButton } from '@/components/ui/ripple-button';

export function RightSidebar() {
  const [subscribed, setSubscribed] = useState(false);
  const [email, setEmail] = useState('');
  const [pending, setPending] = useState(false);
  const featuredProject = projects[0];
  const recentPosts = posts.slice(0, 3);
  const tiktok = profile.socials.find((s) => s.icon === 'tiktok');

  return (
    <motion.aside
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="sticky top-32 hidden h-fit space-y-4 xl:block"
    >
      <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
        <h4 className="flex items-center gap-2 text-sm font-semibold text-foreground">
          <Newspaper className="h-4 w-4 text-primary" />
          Recent Posts
        </h4>
        <div className="mt-3 space-y-3">
          {recentPosts.map((post) => (
            <div
              key={post.id}
              className="flex gap-3 rounded-lg p-2 transition-colors hover:bg-secondary"
            >
              {post.image && (
                <img
                  src={post.image}
                  alt=""
                  className="h-12 w-12 shrink-0 rounded-lg object-cover"
                />
              )}
              {!post.image && (
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                  <Newspaper className="h-5 w-5 text-primary" />
                </div>
              )}
              <div className="min-w-0">
                <p className="truncate text-xs font-medium text-foreground">
                  {post.title}
                </p>
                <p className="text-xs text-muted-foreground">
                  {post.timestamp}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
        <h4 className="flex items-center gap-2 text-sm font-semibold text-foreground">
          <FolderKanban className="h-4 w-4 text-primary" />
          Featured Project
        </h4>
        <div className="mt-3 overflow-hidden rounded-lg">
          <img
            src={featuredProject.cover}
            alt={featuredProject.title}
            className="h-32 w-full object-cover"
          />
        </div>
        <p className="mt-2 text-xs font-semibold text-foreground">
          {featuredProject.title}
        </p>
        <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">
          {featuredProject.description}
        </p>
        <button
          onClick={() =>
            document
              .getElementById('projects')
              ?.scrollIntoView({ behavior: 'smooth' })
          }
          className="mt-2 flex items-center gap-1 text-xs font-medium text-primary hover:underline"
        >
          View project <ArrowRight className="h-3 w-3" />
        </button>
      </div>

      <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
        <h4 className="flex items-center gap-2 text-sm font-semibold text-foreground">
          <Video className="h-4 w-4 text-primary" />
          Latest Content
        </h4>
        <p className="mt-2 text-xs text-muted-foreground">
          Short-form automation tips, posted regularly.
        </p>
        <a
          href={tiktok?.href}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 flex items-center justify-center gap-2 rounded-lg border border-border py-2 text-xs font-medium text-foreground transition-colors hover:border-primary hover:text-primary"
        >
          Watch on TikTok
          <ArrowRight className="h-3 w-3" />
        </a>
      </div>

      <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
        <h4 className="flex items-center gap-2 text-sm font-semibold text-foreground">
          <Mail className="h-4 w-4 text-primary" />
          Newsletter
        </h4>
        <p className="mt-2 text-xs text-muted-foreground">
          Weekly automation tips and AI insights.
        </p>
        {subscribed ? (
          <div className="mt-3 flex items-center gap-2 text-xs font-medium text-green-600">
            <CheckCircle2 className="h-4 w-4" />
            You&apos;re subscribed!
          </div>
        ) : (
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              if (pending) return;
              setPending(true);
              try {
                await submitLead('newsletter', { email });
                setSubscribed(true);
                setEmail('');
              } catch {
                toast.error('Could not subscribe. Please try again.');
              } finally {
                setPending(false);
              }
            }}
            className="mt-3 flex gap-2"
          >
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              className="h-9 flex-1 rounded-lg border border-border bg-background px-3 text-xs text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
            />
            <motion.button
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.97 }}
              type="submit"
              disabled={pending}
              className="rounded-lg bg-primary px-3 text-xs font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-60"
            >
              {pending ? '...' : 'Join'}
            </motion.button>
          </form>
        )}
      </div>

      {upcomingEvents.length > 0 && (
      <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
        <h4 className="flex items-center gap-2 text-sm font-semibold text-foreground">
          <Calendar className="h-4 w-4 text-primary" />
          Upcoming Events
        </h4>
        <div className="mt-3 space-y-3">
          {upcomingEvents.map((event, i) => (
            <div key={i} className="flex items-start gap-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                <Sparkles className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="text-xs font-medium text-foreground">
                  {event.title}
                </p>
                <p className="text-xs text-muted-foreground">
                  {event.date} - {event.type}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
      )}

      <div className="rounded-xl bg-gradient-to-br from-primary to-accent p-5 text-primary-foreground shadow-lg">
        <h4 className="text-sm font-bold">Ready to automate?</h4>
        <p className="mt-1 text-xs text-primary-foreground/80">
          Book a free 30-minute consultation and let&apos;s build systems that
          scale your business.
        </p>
        <RippleButton
          href="https://calendly.com/selangwe19u/30min"
          variant="secondary"
          size="sm"
          className="mt-3 w-full bg-white text-primary hover:bg-white/90"
        >
          <Calendar className="h-4 w-4" />
          Book a Call
        </RippleButton>
      </div>
    </motion.aside>
  );
}
