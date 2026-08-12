import { Navbar } from '@/components/layout/navbar';
import { MobileNav } from '@/components/layout/mobile-nav';
import { Footer } from '@/components/layout/footer';
import { PageTransition } from '@/components/layout/page-transition';
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
import { getPublishedPosts } from '@/lib/posts';

/**
 * Re-fetch posts at most once a minute. Publishing from /admin shows up within
 * that window without a redeploy, and visitors still get a cached static page.
 */
export const revalidate = 60;

export default async function Home() {
  // Fetched on the server so post text is in the HTML that crawlers see.
  const posts = await getPublishedPosts();

  return (
    <>
      <Navbar />

      <PageTransition>
        <ProfileHeader />

        <div className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-[260px_1fr] xl:grid-cols-[260px_1fr_300px]">
            <aside aria-label="Profile information">
              <ProfileSidebar />
            </aside>

            <div className="min-w-0 space-y-2">
              <ContentFeed posts={posts} />
              <AboutSection />
              <ExperienceSection />
              <ServicesSection />
              <ProjectsSection />
              <TestimonialsSection />
              <ResourcesSection />
              <ContactSection />
            </div>

            <aside aria-label="Additional information">
              <RightSidebar posts={posts} />
            </aside>
          </div>
        </div>

        <Footer />
      </PageTransition>

      <MobileNav />
    </>
  );
}
