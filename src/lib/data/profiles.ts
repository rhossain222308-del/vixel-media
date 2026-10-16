import { createClient } from '@/lib/supabase/server';
import { isSupabaseConfigured } from '@/lib/supabase/config';
import { sampleFounders, getFounderBySlug as getSampleFounderBySlug } from '@/data/founders';
import type { Founder, FounderSkill, FounderTool, FounderExperience } from '@/types';
import type { ProfileRow } from '@/types/database.types';

function mapProfileRowToFounder(row: ProfileRow): Founder {
  return {
    id: row.id,
    slug: row.slug,
    name: row.full_name,
    role: row.role,
    tagline: row.tagline || '',
    shortBio: row.bio || '',
    fullBio: Array.isArray(row.full_bio) ? (row.full_bio as string[]) : [],
    avatarUrl: row.avatar_url || '',
    coverUrl: row.cover_url || undefined,
    email: row.contact_email || '',
    location: row.location || '',
    yearsExperience: row.years_experience || 0,
    socials: (row.socials as Record<string, string>) || {},
    skills: (row.skills as unknown as FounderSkill[]) || [],
    tools: (row.tools as unknown as FounderTool[]) || [],
    experience: (row.experience as unknown as FounderExperience[]) || [],
    sampleClients: Array.isArray(row.clients) ? (row.clients as string[]) : [],
    featuredProjectIds: Array.isArray(row.featured_project_ids)
      ? (row.featured_project_ids as string[])
      : [],
  };
}

/**
 * Fetch all published founder profiles for public site
 */
export async function getPublishedFounders(): Promise<Founder[]> {
  if (!isSupabaseConfigured()) {
    return sampleFounders;
  }

  try {
    const supabase = await createClient();
    if (!supabase) return sampleFounders;

    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('is_published', true)
      .order('created_at', { ascending: true });

    if (error || !data || data.length === 0) {
      return sampleFounders;
    }

    return (data as ProfileRow[]).map(mapProfileRowToFounder);
  } catch (err) {
    console.error('Error in getPublishedFounders:', err);
    return sampleFounders;
  }
}

/**
 * Fetch a single published founder by slug
 */
export async function getPublishedFounderBySlug(slug: string): Promise<Founder | null> {
  if (!isSupabaseConfigured()) {
    return getSampleFounderBySlug(slug) || null;
  }

  try {
    const supabase = await createClient();
    if (!supabase) return getSampleFounderBySlug(slug) || null;

    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('slug', slug)
      .eq('is_published', true)
      .single();

    if (error || !data) {
      return getSampleFounderBySlug(slug) || null;
    }

    return mapProfileRowToFounder(data as ProfileRow);
  } catch (err) {
    console.error(`Error in getPublishedFounderBySlug(${slug}):`, err);
    return getSampleFounderBySlug(slug) || null;
  }
}

/**
 * Fetch a founder's profile by their authenticated auth.users ID (regardless of published status)
 * Strictly enforces that users only access their own profile.
 */
export async function getFounderProfileForUser(userId: string): Promise<ProfileRow | null> {
  const supabase = await createClient();
  if (!supabase) return null;

  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();

  if (error || !data) {
    return null;
  }

  return data as ProfileRow;
}
