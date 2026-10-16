import React from 'react';
import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { isSupabaseConfigured } from '@/lib/supabase/config';
import { getAllServices } from '@/lib/data/services';
import { agencyServices } from '@/data/services';
import { ServicesManagerClient } from './ServicesManagerClient';
import type { ServiceRow, Json } from '@/types/database.types';

export const metadata: Metadata = {
  title: 'Shared Services Manager | Vixel Media Dashboard',
  description: 'Manage agency service packages, deliverables, and turnaround times.',
};

export default async function DashboardServicesPage() {
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
      redirect('/login?returnTo=/dashboard/services');
    }

    const services = await getAllServices();

    return <ServicesManagerClient initialServices={services} />;
  }

  // Offline / Demo fallback
  const staticIso = '2026-10-15T12:00:00.000Z';
  const mockServices: ServiceRow[] = agencyServices.map((s, idx) => ({
    id: s.id,
    title: s.title,
    slug: s.slug,
    badge: s.badge || '',
    description: s.shortDescription,
    full_description: s.fullDescription,
    deliverables: s.deliverables as unknown as Json,
    platforms: s.intendedPlatforms as unknown as Json,
    turnaround_time: s.turnaroundTime,
    ideal_for: s.idealFor,
    sample_video_url: s.sampleVideoUrl || '',
    image_url: s.thumbnailUrl,
    features: (s.features as unknown as Json) || [],
    sort_order: idx + 1,
    is_published: true,
    published_at: staticIso,
    created_at: staticIso,
    updated_at: staticIso,
  }));

  return <ServicesManagerClient initialServices={mockServices} />;
}
