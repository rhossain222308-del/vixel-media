import type { MetadataRoute } from 'next';
import { sampleFounders } from '@/data/founders';
import { sampleBlogPosts } from '@/data/blog';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://vixelmedia.com';
  const lastModified = new Date();

  // Static marketing pages
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${baseUrl}`, lastModified, changeFrequency: 'weekly', priority: 1.0 },
    { url: `${baseUrl}/work`, lastModified, changeFrequency: 'daily', priority: 0.9 },
    { url: `${baseUrl}/services`, lastModified, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${baseUrl}/about`, lastModified, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/pricing`, lastModified, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${baseUrl}/contact`, lastModified, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/testimonials`, lastModified, changeFrequency: 'weekly', priority: 0.7 },
    { url: `${baseUrl}/blog`, lastModified, changeFrequency: 'weekly', priority: 0.7 },
    { url: `${baseUrl}/faq`, lastModified, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${baseUrl}/careers`, lastModified, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${baseUrl}/privacy`, lastModified, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${baseUrl}/terms`, lastModified, changeFrequency: 'yearly', priority: 0.3 },
  ];

  // Co-founder personal portfolios
  const founderRoutes: MetadataRoute.Sitemap = sampleFounders.map((f) => ({
    url: `${baseUrl}/portfolio/${f.slug}`,
    lastModified,
    changeFrequency: 'weekly',
    priority: 0.85,
  }));

  // Blog articles
  const blogRoutes: MetadataRoute.Sitemap = sampleBlogPosts.map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: new Date(post.publishedAt || lastModified),
    changeFrequency: 'monthly',
    priority: 0.65,
  }));

  return [...staticRoutes, ...founderRoutes, ...blogRoutes];
}
