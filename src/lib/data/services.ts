import { createClient } from '@/lib/supabase/server';
import { isSupabaseConfigured } from '@/lib/supabase/config';
import { agencyServices } from '@/data/services';
import type { Service } from '@/types';
import type { ServiceRow } from '@/types/database.types';

function mapServiceRowToService(row: ServiceRow): Service {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    badge: row.badge || '',
    shortDescription: row.description,
    fullDescription: row.full_description || row.description,
    deliverables: Array.isArray(row.deliverables) ? (row.deliverables as string[]) : [],
    intendedPlatforms: Array.isArray(row.platforms) ? (row.platforms as string[]) : [],
    turnaroundTime: row.turnaround_time || '',
    idealFor: row.ideal_for || '',
    sampleVideoUrl: row.sample_video_url || undefined,
    thumbnailUrl: row.image_url || '',
    features: Array.isArray(row.features) ? (row.features as string[]) : [],
  };
}

export async function getPublishedServices(): Promise<Service[]> {
  if (!isSupabaseConfigured()) {
    return agencyServices;
  }

  try {
    const supabase = await createClient();
    if (!supabase) return agencyServices;

    const { data, error } = await supabase
      .from('services')
      .select('*')
      .eq('is_published', true)
      .order('sort_order', { ascending: true });

    if (error || !data || data.length === 0) {
      return agencyServices;
    }

    return (data as ServiceRow[]).map(mapServiceRowToService);
  } catch (err) {
    console.error('Error in getPublishedServices:', err);
    return agencyServices;
  }
}

export async function getPublishedServiceBySlug(slug: string): Promise<Service | null> {
  const services = await getPublishedServices();
  return services.find((s) => s.slug === slug) || null;
}

export async function getAllServices(): Promise<ServiceRow[]> {
  const supabase = await createClient();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from('services')
    .select('*')
    .order('sort_order', { ascending: true });

  if (error || !data) return [];
  return data as ServiceRow[];
}
