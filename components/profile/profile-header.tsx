'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import {
  BadgeCheck,
  MapPin,
  Users,
  Calendar,
  MessageCircle,
  Download,
  Briefcase,
} from 'lucide-react';
import { profile } from '@/lib/data';
import { RippleButton } from '@/components/ui/ripple-button';

export function ProfileHeader() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  });
  const coverY = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);
  const coverScale = useTransform(scrollYProgress, [0, 1], [1, 1.15]);
  const contentY = useTransform(scrollYProgress, [0, 1], ['0%', '50%']);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <header ref={containerRef} id="home" className="relative">
      <div className="relative h-48 overflow-hidden sm:h-60 lg:h-72">
        <motion.div
          style={{ y: coverY, scale: coverScale }}
          className="absolute inset-0"
        >
          <img
            src={profile.cover}
            alt="Cover banner for Samme Samuel's profile"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
        </motion.div>
      </div>

      <motion.div
        style={{ y: contentY, opacity: contentOpacity }}
        className="mx-auto -mt-16 max-w-7xl px-4 pb-10 sm:px-6 lg:px-8"
      >
        <div className="flex flex-col items-center gap-6 text-center sm:flex-row sm:items-end sm:text-left">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="relative shrink-0"
          >
            <div className="h-32 w-32 overflow-hidden rounded-full border-4 border-card bg-card shadow-lg sm:h-40 sm:w-40">
              <img
                src={profile.avatar}
                alt={`${profile.name} profile photo`}
                className="h-full w-full object-cover"
              />
            </div>
            <span
              className="absolute bottom-2 right-2 flex h-5 w-5 items-center justify-center rounded-full border-2 border-card bg-green-500"
              aria-label="Available for work"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex-1 pb-2"
          >
            <div className="flex items-center justify-center gap-2 sm:justify-start">
              <h1 className="text-2xl font-bold text-foreground sm:text-3xl">
                {profile.name}
              </h1>
              {profile.verified && (
                <BadgeCheck className="h-6 w-6 text-primary" aria-label="Verified" />
              )}
            </div>
            <p className="mt-1 text-sm font-medium text-muted-foreground sm:text-base">
              {profile.title}
            </p>
            <p className="mx-auto mt-2 max-w-2xl text-sm text-muted-foreground sm:mx-0">
              {profile.headline}
            </p>

            <div className="mt-3 flex flex-wrap items-center justify-center gap-4 text-xs text-muted-foreground sm:justify-start sm:text-sm">
              <span className="flex items-center gap-1.5">
                <MapPin className="h-4 w-4" aria-hidden="true" />
                {profile.location}
              </span>
              <span className="flex items-center gap-1.5">
                <Users className="h-4 w-4" aria-hidden="true" />
                {profile.followers} followers
              </span>
              <span className="flex items-center gap-1.5">
                <Users className="h-4 w-4" aria-hidden="true" />
                {profile.connections} connections
              </span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex flex-wrap justify-center gap-2 pb-2 sm:justify-end"
          >
            <RippleButton href={profile.calendly} size="sm">
              <Calendar className="h-4 w-4" />
              Book a Call
            </RippleButton>
            <RippleButton
              variant="outline"
              size="sm"
              onClick={() =>
                document
                  .getElementById('contact')
                  ?.scrollIntoView({ behavior: 'smooth' })
              }
            >
              <Briefcase className="h-4 w-4" />
              Work with Me
            </RippleButton>
            <RippleButton
              variant="ghost"
              size="sm"
              onClick={() =>
                document
                  .getElementById('contact')
                  ?.scrollIntoView({ behavior: 'smooth' })
              }
            >
              <MessageCircle className="h-4 w-4" />
              Send Message
            </RippleButton>
            <RippleButton variant="outline" size="sm" href={profile.resumeUrl}>
              <Download className="h-4 w-4" />
              Resume
            </RippleButton>
          </motion.div>
        </div>
      </motion.div>
    </header>
  );
}
