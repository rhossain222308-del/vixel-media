import { createClient } from '@/lib/supabase/server';
import { isSupabaseConfigured } from '@/lib/supabase/config';
import { sampleTestimonials } from '@/data/testimonials';
import type { Testimonial } from '@/types';
import type { TestimonialRow } from '@/types/database.types';

function mapTestimonialRowToTestimonial(row: TestimonialRow): Testimonial {
  return {
    id: row.id,
    clientName: row.client_name,
    role: row.role || '',
    company: row.company,
    avatarUrl: row.avatar_url || '',
    quote: row.quote,
    rating: row.rating ?? 5,
    projectTitle: row.project_title || '',
    projectCategory: row.project_category || '',
    metricsResult: row.metrics_result || undefined,
    isVerified: row.is_verified,
    hasVideoReview: row.has_video_review,
  };
}

export async function getPublishedTestimonials(): Promise<Testimonial[]> {
  if (!isSupabaseConfigured()) {
    return sampleTestimonials;
  }

  try {
    const supabase = await createClient();
    if (!supabase) return sampleTestimonials;

    const { data, error } = await supabase
      .from('testimonials')
      .select('*')
      .eq('is_published', true)
      .order('sort_order', { ascending: true });

    if (error || !data || data.length === 0) {
      return sampleTestimonials;
    }

    return (data as TestimonialRow[]).map(mapTestimonialRowToTestimonial);
  } catch (err) {
    console.error('Error in getPublishedTestimonials:', err);
    return sampleTestimonials;
  }
}

export async function getAllTestimonials(): Promise<TestimonialRow[]> {
  const supabase = await createClient();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from('testimonials')
    .select('*')
    .order('sort_order', { ascending: true });

  if (error || !data) return [];
  return data as TestimonialRow[];
}
