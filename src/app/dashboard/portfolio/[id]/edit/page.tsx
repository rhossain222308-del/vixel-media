import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { ShieldAlert } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';
import { isSupabaseConfigured } from '@/lib/supabase/config';
import { getProjectById } from '@/lib/data/projects';
import { sampleProjects } from '@/data/projects';
import { ProjectEditClient } from './ProjectEditClient';
import { Button } from '@/components/ui/Button';
import type { PortfolioProjectRow, Json } from '@/types/database.types';

export const metadata: Metadata = {
  title: 'Edit Project | Vixel Media Dashboard',
  description: 'Modify project details, media embeds, and publication status.',
};

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function DashboardEditProjectPage({ params }: PageProps) {
  const { id } = await params;
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
      redirect(`/login?returnTo=/dashboard/portfolio/${id}/edit`);
    }

    const project = await getProjectById(id, user.id);

    if (!project) {
      return (
        <div className="p-12 text-center rounded-3xl bg-[#14141B] border border-white/10 space-y-4 max-w-lg mx-auto mt-12">
          <div className="w-12 h-12 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400 mx-auto">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold text-white">Project Not Found or Access Denied</h2>
          <p className="text-xs text-gray-400">
            This project does not exist or belongs to another co-founder. Under strict RLS policy, you can only edit projects you personally created.
          </p>
          <div className="pt-2">
            <Link href="/dashboard/portfolio">
              <Button size="sm">Return to My Portfolio</Button>
            </Link>
          </div>
        </div>
      );
    }

    return <ProjectEditClient project={project} userId={user.id} />;
  }

  // Offline / Demo fallback
  const sample = sampleProjects.find((p) => p.id === id) || sampleProjects[0];
  const staticIso = '2026-10-15T12:00:00.000Z';

  const mockProject: PortfolioProjectRow = {
    id: sample.id,
    owner_id: 'demo-founder-1',
    title: sample.title,
    slug: sample.slug,
    client: sample.client,
    description: sample.description,
    long_description: sample.longDescription || '',
    category: sample.category,
    category_label: sample.categoryLabel,
    deliverables: sample.deliverables as unknown as Json,
    duration: sample.duration,
    aspect_ratio: sample.aspectRatio,
    thumbnail_url: sample.thumbnailUrl,
    video_url: sample.videoUrl || '',
    platform: 'YouTube',
    has_playable_media: sample.hasPlayableMedia,
    featured: sample.featured,
    sort_order: 1,
    status: 'published',
    metrics: (sample.metrics as unknown as Json) || {},
    tools_used: sample.toolsUsed as unknown as Json,
    year: sample.year,
    published_at: staticIso,
    created_at: staticIso,
    updated_at: staticIso,
  };

  return <ProjectEditClient project={mockProject} userId="demo-founder-1" />;
}
