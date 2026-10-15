import React from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getFounderBySlug, sampleFounders } from '@/data/founders';
import { getProjectsByFounder } from '@/data/projects';
import { PortfolioDetailView } from './PortfolioDetailView';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return sampleFounders.map((founder) => ({
    slug: founder.slug,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const founder = getFounderBySlug(slug);

  if (!founder) {
    return {
      title: 'Founder Not Found | Vixel Media',
    };
  }

  return {
    title: `${founder.name} — ${founder.role} | Vixel Media`,
    description: founder.tagline,
  };
}

export default async function FounderPortfolioPage({ params }: PageProps) {
  const { slug } = await params;
  const founder = getFounderBySlug(slug);

  if (!founder) {
    notFound();
  }

  const founderProjects = getProjectsByFounder(founder.id);

  return <PortfolioDetailView founder={founder} projects={founderProjects} />;
}
