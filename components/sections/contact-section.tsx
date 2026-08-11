'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Mail,
  MapPin,
  Clock,
  Calendar,
  Send,
  CheckCircle2,
  Linkedin,
} from 'lucide-react';
import { profile } from '@/lib/data';
import { submitLead } from '@/lib/lead-capture';
import { SectionHeading } from '@/components/ui/section-heading';
import { RippleButton } from '@/components/ui/ripple-button';
import { toast } from 'sonner';

const schema = z.object({
  name: z.string().min(2, 'Name is required'),
  email: z.string().email('Valid email is required'),
  subject: z.string().min(3, 'Subject is required'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
});

type FormData = z.infer<typeof schema>;

export function ContactSection() {
  const [submitted, setSubmitted] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    try {
      await submitLead('contact', data);
      setSubmitted(true);
      toast.success('Message sent! I\'ll get back to you soon.');
      reset();
      setTimeout(() => setSubmitted(false), 3000);
    } catch {
      toast.error(
        `Something went wrong. Email me directly at ${profile.email}.`,
      );
    }
  };

  return (
    <section id="contact" aria-label="Contact Samme Samuel" className="scroll-mt-32 py-12">
      <SectionHeading
        title="Get in Touch"
        subtitle="Have a project in mind? Let's talk about how I can help your business grow."
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.5 }}
          className="space-y-4"
        >
          <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
            <h3 className="text-base font-semibold text-foreground">
              Contact Information
            </h3>
            <div className="mt-4 space-y-3">
              <a
                href={`mailto:${profile.email}`}
                className="flex items-center gap-3 text-sm text-muted-foreground transition-colors hover:text-primary"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
                  <Mail className="h-4 w-4 text-primary" />
                </div>
                {profile.email}
              </a>
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
                  <MapPin className="h-4 w-4 text-primary" />
                </div>
                {profile.location}
              </div>
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
                  <Clock className="h-4 w-4 text-primary" />
                </div>
                {profile.availability}
              </div>
            </div>

            <div className="mt-4 flex gap-2">
              <RippleButton
                href={profile.calendly}
                size="sm"
                className="flex-1"
              >
                <Calendar className="h-4 w-4" />
                Book a Call
              </RippleButton>
              <a
                href={profile.socials[1].href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-9 items-center justify-center gap-2 rounded-lg border border-border px-4 text-sm font-medium text-foreground transition-colors hover:border-primary hover:text-primary"
              >
                <Linkedin className="h-4 w-4" />
                LinkedIn
              </a>
            </div>
          </div>

          <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
            <div className="flex h-48 items-center justify-center bg-secondary">
              <div className="text-center">
                <MapPin className="mx-auto h-8 w-8 text-primary" />
                <p className="mt-2 text-sm font-medium text-foreground">
                  {profile.location}
                </p>
                <p className="text-xs text-muted-foreground">
                  Available worldwide - Remote
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.5 }}
          className="rounded-xl border border-border bg-card p-6 shadow-sm"
        >
          <h3 className="text-base font-semibold text-foreground">
            Send a Message
          </h3>
          {submitted ? (
            <div className="flex h-64 flex-col items-center justify-center text-center">
              <CheckCircle2 className="h-12 w-12 text-green-500" />
              <p className="mt-3 text-sm font-medium text-foreground">
                Message sent successfully!
              </p>
              <p className="text-xs text-muted-foreground">
                I&apos;ll get back to you within 24 hours.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="mt-4 space-y-4">
              <div>
                <input
                  {...register('name')}
                  placeholder="Your name"
                  className="h-11 w-full rounded-lg border border-border bg-background px-4 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                />
                {errors.name && (
                  <p className="mt-1 text-xs text-destructive">
                    {errors.name.message}
                  </p>
                )}
              </div>
              <div>
                <input
                  {...register('email')}
                  type="email"
                  placeholder="Your email"
                  className="h-11 w-full rounded-lg border border-border bg-background px-4 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                />
                {errors.email && (
                  <p className="mt-1 text-xs text-destructive">
                    {errors.email.message}
                  </p>
                )}
              </div>
              <div>
                <input
                  {...register('subject')}
                  placeholder="Subject"
                  className="h-11 w-full rounded-lg border border-border bg-background px-4 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                />
                {errors.subject && (
                  <p className="mt-1 text-xs text-destructive">
                    {errors.subject.message}
                  </p>
                )}
              </div>
              <div>
                <textarea
                  {...register('message')}
                  placeholder="Tell me about your project..."
                  rows={5}
                  className="w-full rounded-lg border border-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                />
                {errors.message && (
                  <p className="mt-1 text-xs text-destructive">
                    {errors.message.message}
                  </p>
                )}
              </div>
              <RippleButton
                type="submit"
                size="lg"
                className="w-full"
                disabled={isSubmitting}
              >
                <Send className="h-4 w-4" />
                {isSubmitting ? 'Sending...' : 'Send Message'}
              </RippleButton>
            </form>
          )}
        </motion.div>
      </div>
    </section>
  );
}
