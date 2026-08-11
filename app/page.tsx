'use client';

import { motion } from 'framer-motion';
import { Navbar } from '@/components/layout/navbar';
import { MobileNav } from '@/components/layout/mobile-nav';
import { Footer } from '@/components/layout/footer';
import { ProfileHeader } from '@/components/profile/profile-header';
import { ProfileSidebar } from '@/components/sidebar/profile-sidebar';
import { RightSidebar } from '@/components/sidebar/right-sidebar';
import { ContentFeed } from '@/components/feed/content-feed';
import { AboutSection } from '@/components/sections/about-section';
import { ExperienceSection } from '@/components/sections/experience-section';
import { ServicesSection } from '@/components/sections/services-section';
import { ProjectsSection } from '@/components/sections/projects-section';
import { TestimonialsSection } from '@/components/sections/testimonials-section';
import { ResourcesSection } from '@/components/sections/resources-section';
import { ContactSection } from '@/components/sections/contact-section';

export default function Home() {
  return (
    <>
      <Navbar />

      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <ProfileHeader />

        <div className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-[260px_1fr] xl:grid-cols-[260px_1fr_300px]">
            <aside aria-label="Profile information">
              <ProfileSidebar />
            </aside>

            <div className="min-w-0 space-y-2">
              <ContentFeed />
              <AboutSection />
              <ExperienceSection />
              <ServicesSection />
              <ProjectsSection />
              <TestimonialsSection />
              <ResourcesSection />
              <ContactSection />
            </div>

            <aside aria-label="Additional information">
              <RightSidebar />
            </aside>
          </div>
        </div>

        <Footer />
      </motion.main>

      <MobileNav />
    </>
  );
}
