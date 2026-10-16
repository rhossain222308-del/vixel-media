import { createClient } from '@/lib/supabase/server';
import { isSupabaseConfigured } from '@/lib/supabase/config';
import type { SiteContentRow, SiteContentRevisionRow } from '@/types/database.types';

export async function getPublishedSiteContent<T>(sectionKey: string, fallback: T): Promise<T> {
  if (!isSupabaseConfigured()) {
    return fallback;
  }

  try {
    const supabase = await createClient();
    if (!supabase) return fallback;

    const { data, error } = await supabase
      .from('site_content')
      .select('content, status')
      .eq('section_key', sectionKey)
      .single();

    if (error || !data || !data.content) {
      return fallback;
    }

    return data.content as T;
  } catch (err) {
    console.error(`Error in getPublishedSiteContent(${sectionKey}):`, err);
    return fallback;
  }
}

export async function getAllSiteContent(): Promise<SiteContentRow[]> {
  const supabase = await createClient();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from('site_content')
    .select('*')
    .order('section_key', { ascending: true });

  if (error || !data) return [];
  return data as SiteContentRow[];
}

export async function getSectionRevisions(sectionKey: string): Promise<SiteContentRevisionRow[]> {
  const supabase = await createClient();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from('site_content_revisions')
    .select('*')
    .eq('section_key', sectionKey)
    .order('created_at', { ascending: false })
    .limit(10);

  if (error || !data) return [];
  return data as SiteContentRevisionRow[];
}
