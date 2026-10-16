import React from 'react';
import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { isSupabaseConfigured } from '@/lib/supabase/config';
import { getFounderProjects } from '@/lib/data/projects';
import { sampleProjects } from '@/data/projects';
import { PortfolioListClient } from './PortfolioListClient';
import type { PortfolioProjectRow, Json } from '@/types/database.types';

export const metadata: Metadata = {
  title: 'Portfolio Manager | Vixel Media Dashboard',
  description: 'Manage, edit, and organize your personal video portfolio projects.',
};

export default async function DashboardPortfolioPage() {
  const configured = isSupabaseConfigured();

  if (configured) {
    const supabase = await createClient();
    if (!supabase) {
      redirect('/login');
    }

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      redirect('/login?returnTo=/dashboard/portfolio');
    }

    const projects = await getFounderProjects(user.id);

    return (
      <PortfolioListClient
        initialProjects={projects}
        userId={user.id}
      />
    );
  }

  // Offline / Demo fallback: Map sample projects for Alex Vance
  const staticIso = '2026-10-15T12:00:00.000Z';
  const mockProjects: PortfolioProjectRow[] = sampleProjects
    .filter((p) => p.founderId === 'alex-vance')
    .map((p) => ({
      id: p.id,
      owner_id: 'demo-founder-1',
      title: p.title,
      slug: p.slug,
      client: p.client,
      description: p.description,
      long_description: p.longDescription || '',
      category: p.category,
      category_label: p.categoryLabel,
      deliverables: p.deliverables as unknown as Json,
      duration: p.duration,
      aspect_ratio: p.aspectRatio,
      thumbnail_url: p.thumbnailUrl,
      video_url: p.videoUrl || '',
      platform: 'YouTube',
      has_playable_media: p.hasPlayableMedia,
      featured: p.featured,
      sort_order: 1,
      status: 'published',
      metrics: (p.metrics as unknown as Json) || {},
      tools_used: p.toolsUsed as unknown as Json,
      year: p.year,
      published_at: staticIso,
      created_at: staticIso,
      updated_at: staticIso,
    }));

  return (
    <PortfolioListClient
      initialProjects={mockProjects}
      userId="demo-founder-1"
    />
  );
}
