import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://vixelmedia.com';

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/dashboard/', '/admin/', '/login'],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
