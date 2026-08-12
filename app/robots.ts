import type { MetadataRoute } from 'next';

const SITE_URL = 'https://samme-samuel.coreflareagency.com';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      // Keeping the dashboard and the lead endpoint out of search results.
      // This is tidiness, not access control — that lives in the database's
      // row-level policies.
      disallow: ['/admin', '/api/'],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
