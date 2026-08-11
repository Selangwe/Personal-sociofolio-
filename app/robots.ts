import type { MetadataRoute } from 'next';

const SITE_URL = 'https://samme-samuel.coreflareagency.com';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      // Netlify's form-definition stub — no reason for it to be indexed.
      disallow: '/__forms.html',
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
