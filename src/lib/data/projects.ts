import { createClient } from '@/lib/supabase/server';
import { isSupabaseConfigured } from '@/lib/supabase/config';
import { sampleProjects } from '@/data/projects';
import type { Project, ProjectCategory } from '@/types';
import type { PortfolioProjectRow } from '@/types/database.types';

function mapProjectRowToProject(row: PortfolioProjectRow): Project {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    client: row.client || '',
    category: row.category,
    categoryLabel: row.category_label || row.category,
    description: row.description || '',
    longDescription: row.long_description || undefined,
    deliverables: Array.isArray(row.deliverables) ? (row.deliverables as string[]) : [],
    duration: row.duration || '',
    aspectRatio: row.aspect_ratio || '16:9',
    thumbnailUrl: row.thumbnail_url,
    videoUrl: row.video_url || undefined,
    hasPlayableMedia: row.has_playable_media,
    featured: row.featured,
    metrics: (row.metrics as Project['metrics']) || undefined,
    founderId: row.owner_id,
    toolsUsed: Array.isArray(row.tools_used) ? (row.tools_used as string[]) : [],
    year: row.year || new Date().getFullYear(),
  };
}

/**
 * Fetch all published projects for the public agency work catalogue.
 * Automatically filters out drafts and projects whose owner profile is unpublished.
 */
export async function getPublishedProjects(category?: ProjectCategory): Promise<Project[]> {
  if (!isSupabaseConfigured()) {
    if (!category || category === 'all') return sampleProjects;
    return sampleProjects.filter((p) => p.category === category);
  }

  try {
    const supabase = await createClient();
    if (!supabase) {
      if (!category || category === 'all') return sampleProjects;
      return sampleProjects.filter((p) => p.category === category);
    }

    let query = supabase
      .from('portfolio_projects')
      .select('*')
      .eq('status', 'published')
      .order('sort_order', { ascending: true })
      .order('created_at', { ascending: false });

    if (category && category !== 'all') {
      query = query.eq('category', category);
    }

    const { data, error } = await query;

    if (error || !data || data.length === 0) {
      if (!category || category === 'all') return sampleProjects;
      return sampleProjects.filter((p) => p.category === category);
    }

    return (data as PortfolioProjectRow[]).map(mapProjectRowToProject);
  } catch (err) {
    console.error('Error in getPublishedProjects:', err);
    if (!category || category === 'all') return sampleProjects;
    return sampleProjects.filter((p) => p.category === category);
  }
}

/**
 * Fetch published projects belonging to a specific founder (by profile UUID or slug)
 */
export async function getPublishedProjectsByFounder(founderIdOrSlug: string): Promise<Project[]> {
  if (!isSupabaseConfigured()) {
    return sampleProjects.filter(
      (p) => p.founderId === founderIdOrSlug || p.founderId?.includes(founderIdOrSlug)
    );
  }

  try {
    const supabase = await createClient();
    if (!supabase) {
      return sampleProjects.filter(
        (p) => p.founderId === founderIdOrSlug || p.founderId?.includes(founderIdOrSlug)
      );
    }

    // First check if input is slug: look up founder ID
    let ownerId = founderIdOrSlug;
    if (!founderIdOrSlug.includes('-') || founderIdOrSlug.length !== 36) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('id')
        .eq('slug', founderIdOrSlug)
        .single();
      if (profile) {
        ownerId = profile.id;
      }
    }

    const { data, error } = await supabase
      .from('portfolio_projects')
      .select('*')
      .eq('owner_id', ownerId)
      .eq('status', 'published')
      .order('sort_order', { ascending: true })
      .order('created_at', { ascending: false });

    if (error || !data || data.length === 0) {
      return sampleProjects.filter(
        (p) => p.founderId === founderIdOrSlug || p.founderId?.includes(founderIdOrSlug)
      );
    }

    return (data as PortfolioProjectRow[]).map(mapProjectRowToProject);
  } catch (err) {
    console.error(`Error in getPublishedProjectsByFounder(${founderIdOrSlug}):`, err);
    return sampleProjects.filter(
      (p) => p.founderId === founderIdOrSlug || p.founderId?.includes(founderIdOrSlug)
    );
  }
}

/**
 * Fetch all projects (including drafts) for an authenticated founder's dashboard
 */
export async function getFounderProjects(userId: string): Promise<PortfolioProjectRow[]> {
  const supabase = await createClient();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from('portfolio_projects')
    .select('*')
    .eq('owner_id', userId)
    .order('sort_order', { ascending: true })
    .order('created_at', { ascending: false });

  if (error || !data) {
    return [];
  }

  return data as PortfolioProjectRow[];
}
