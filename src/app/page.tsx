import React from 'react';
import type { Metadata } from 'next';
import { getPublishedProjects } from '@/lib/data/projects';
import { getPublishedServices } from '@/lib/data/services';
import { getPublishedFounders } from '@/lib/data/profiles';
import { getPublishedSiteContent } from '@/lib/data/siteContent';
import { HomeClientView } from './HomeClientView';

export const metadata: Metadata = {
  title: 'VIXEL MEDIA | High-Impact Video Editing & Motion Graphics Studio',
  description:
    'Two dedicated co-founders crafting high-retention video post-production, 3D map cartography, and motion graphics for elite creators and tech brands.',
};

export default async function HomePage() {
  const [allProjects, services, founders, heroContent] = await Promise.all([
    getPublishedProjects(),
    getPublishedServices(),
    getPublishedFounders(),
    getPublishedSiteContent('hero', {
      badge: 'VIXEL MEDIA STUDIO • HIGH-IMPACT POST-PRODUCTION',
      title: '',
      subtitle: 'We craft high-impact videos, visuals, and digital experiences for brands and creators.',
      primaryCtaLabel: 'View Our Work',
      primaryCtaLink: '/work',
      secondaryCtaLabel: 'Get a Quote',
      secondaryCtaLink: '/contact',
      videoReelUrl: '',
    }),
  ]);

  const featuredProjects = allProjects.filter((p) => p.featured).slice(0, 6);

  return (
    <HomeClientView
      featuredProjects={featuredProjects.length > 0 ? featuredProjects : allProjects.slice(0, 6)}
      services={services}
      founders={founders}
      heroContent={heroContent}
    />
  );
}
