import React from 'react';
import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { isSupabaseConfigured } from '@/lib/supabase/config';
import { getAllTestimonials } from '@/lib/data/testimonials';
import { sampleTestimonials } from '@/data/testimonials';
import { TestimonialsManagerClient } from './TestimonialsManagerClient';
import type { TestimonialRow } from '@/types/database.types';

export const metadata: Metadata = {
  title: 'Testimonials Manager | Vixel Media Dashboard',
  description: 'Manage verified client reviews, quotes, metrics, and star ratings.',
};

export default async function DashboardTestimonialsPage() {
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
      redirect('/login?returnTo=/dashboard/testimonials');
    }

    const testimonials = await getAllTestimonials();

    return <TestimonialsManagerClient initialTestimonials={testimonials} />;
  }

  // Offline / Demo fallback
  const staticIso = '2026-10-15T12:00:00.000Z';
  const mockTestimonials: TestimonialRow[] = sampleTestimonials.map((t, idx) => ({
    id: t.id,
    client_name: t.clientName,
    role: t.role,
    company: t.company,
    quote: t.quote,
    rating: t.rating,
    avatar_url: t.avatarUrl,
    project_title: t.projectTitle || '',
    project_category: 'Commercial Video',
    metrics_result: t.metricsResult || '',
    is_verified: true,
    has_video_review: false,
    project_image_url: '',
    published_at: staticIso,
    sort_order: idx + 1,
    is_published: true,
    created_at: staticIso,
    updated_at: staticIso,
  }));

  return <TestimonialsManagerClient initialTestimonials={mockTestimonials} />;
}
