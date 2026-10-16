'use server';

import { createClient } from '@/lib/supabase/server';
import { isSupabaseConfigured } from '@/lib/supabase/config';
import { revalidatePath } from 'next/cache';
import type { ActionResponse } from './profile';

/**
 * Server Action: Save Site Content as DRAFT
 * Does NOT overwrite live published content.
 */
export async function saveSiteContentDraftAction(
  _prevState: ActionResponse | null,
  formData: FormData
): Promise<ActionResponse> {
  if (!isSupabaseConfigured()) {
    return {
      success: true,
      message: 'Draft saved in offline preview mode.',
    };
  }

  const supabase = await createClient();
  if (!supabase) return { success: false, error: 'Database client not available.' };

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: 'Unauthorized: Founder login required.' };
  }

  const sectionKey = (formData.get('sectionKey') as string)?.trim();
  const rawContent = (formData.get('content') as string)?.trim();

  if (!sectionKey) {
    return { success: false, error: 'Section key is required.' };
  }

  let contentJson = {};
  try {
    contentJson = JSON.parse(rawContent || '{}');
  } catch {
    return { success: false, error: 'Malformed JSON payload for section content.' };
  }

  // Fetch current row to preserve published content if exists
  const { data: existing } = await supabase
    .from('site_content')
    .select('content')
    .eq('section_key', sectionKey)
    .single();

  const liveContent = existing?.content || contentJson;

  const { error } = await supabase.from('site_content').upsert(
    {
      section_key: sectionKey,
      content: liveContent, // Keep live content unchanged
      draft_content: contentJson, // Save new draft
      status: 'draft',
      updated_by: user.id,
      updated_at: new Date().toISOString(),
    },
    { onConflict: 'section_key' }
  );

  if (error) {
    console.error('Error saving site content draft:', error);
    return { success: false, error: `Failed to save draft: ${error.message}` };
  }

  revalidatePath('/dashboard/website');
  return { success: true, message: `Draft for '${sectionKey}' saved! (Not visible on public site yet)` };
}

/**
 * Server Action: Publish Site Content
 * Copies draft into live content, saves revision history, and revalidates public routes.
 */
export async function publishSiteContentAction(
  _prevState: ActionResponse | null,
  formData: FormData
): Promise<ActionResponse> {
  if (!isSupabaseConfigured()) {
    return {
      success: true,
      message: 'Published in offline preview mode.',
    };
  }

  const supabase = await createClient();
  if (!supabase) return { success: false, error: 'Database client not available.' };

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: 'Unauthorized: Founder login required.' };
  }

  const sectionKey = (formData.get('sectionKey') as string)?.trim();
  const rawContent = (formData.get('content') as string)?.trim();
  const changeSummary = (formData.get('changeSummary') as string)?.trim() || 'Published via Studio CMS';

  if (!sectionKey) {
    return { success: false, error: 'Section key is required.' };
  }

  let contentJson = {};
  try {
    contentJson = JSON.parse(rawContent || '{}');
  } catch {
    return { success: false, error: 'Malformed JSON payload for section content.' };
  }

  const now = new Date().toISOString();

  // 1. Update site_content: content = contentJson, draft_content = contentJson, status = 'published'
  const { error: updateError } = await supabase.from('site_content').upsert(
    {
      section_key: sectionKey,
      content: contentJson,
      draft_content: contentJson,
      status: 'published',
      updated_by: user.id,
      published_at: now,
      updated_at: now,
    },
    { onConflict: 'section_key' }
  );

  if (updateError) {
    console.error('Error publishing site content:', updateError);
    return { success: false, error: `Failed to publish: ${updateError.message}` };
  }

  // 2. Create entry in site_content_revisions
  const { count } = await supabase
    .from('site_content_revisions')
    .select('*', { count: 'exact', head: true })
    .eq('section_key', sectionKey);

  const nextVersion = (count || 0) + 1;

  await supabase.from('site_content_revisions').insert({
    section_key: sectionKey,
    content: contentJson,
    created_by: user.id,
    version_number: nextVersion,
    change_summary: changeSummary,
    created_at: now,
  });

  // Revalidate public pages
  revalidatePath('/');
  revalidatePath('/about');
  revalidatePath('/pricing');
  revalidatePath('/services');
  revalidatePath('/work');
  revalidatePath('/dashboard/website');

  return { success: true, message: `Section '${sectionKey}' is now live on the public website (v${nextVersion})!` };
}

/**
 * Server Action: Revert Draft to Last Published Content
 */
export async function revertSiteContentDraftAction(sectionKey: string): Promise<ActionResponse> {
  if (!isSupabaseConfigured()) {
    return { success: true, message: 'Draft reverted to published version.' };
  }

  const supabase = await createClient();
  if (!supabase) return { success: false, error: 'Database client not available.' };

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: 'Unauthorized: Founder login required.' };
  }

  const { data: existing, error: fetchError } = await supabase
    .from('site_content')
    .select('content')
    .eq('section_key', sectionKey)
    .single();

  if (fetchError || !existing) {
    return { success: false, error: 'Could not find published content to revert to.' };
  }

  const { error: updateError } = await supabase
    .from('site_content')
    .update({
      draft_content: existing.content,
      status: 'published',
      updated_at: new Date().toISOString(),
    })
    .eq('section_key', sectionKey);

  if (updateError) {
    return { success: false, error: `Failed to revert draft: ${updateError.message}` };
  }

  revalidatePath('/dashboard/website');
  return { success: true, message: 'Working draft discarded. Restored last published version!' };
}

/**
 * Server Action: Rollback to a specific historical revision
 */
export async function rollbackToRevisionAction(
  sectionKey: string,
  revisionId: string
): Promise<ActionResponse> {
  if (!isSupabaseConfigured()) {
    return { success: true, message: 'Restored revision.' };
  }

  const supabase = await createClient();
  if (!supabase) return { success: false, error: 'Database client not available.' };

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: 'Unauthorized: Founder login required.' };
  }

  const { data: rev, error: revError } = await supabase
    .from('site_content_revisions')
    .select('*')
    .eq('id', revisionId)
    .single();

  if (revError || !rev) {
    return { success: false, error: 'Revision record not found.' };
  }

  const now = new Date().toISOString();

  // Publish this historical revision
  const { error: updateError } = await supabase
    .from('site_content')
    .update({
      content: rev.content,
      draft_content: rev.content,
      status: 'published',
      updated_by: user.id,
      published_at: now,
      updated_at: now,
    })
    .eq('section_key', sectionKey);

  if (updateError) {
    return { success: false, error: `Rollback failed: ${updateError.message}` };
  }

  // Create audit revision entry noting rollback
  await supabase.from('site_content_revisions').insert({
    section_key: sectionKey,
    content: rev.content,
    created_by: user.id,
    version_number: rev.version_number + 1,
    change_summary: `Rollback to revision from ${new Date(rev.created_at).toLocaleDateString()}`,
    created_at: now,
  });

  revalidatePath('/');
  revalidatePath('/about');
  revalidatePath('/pricing');
  revalidatePath('/dashboard/website');

  return { success: true, message: `Successfully rolled back '${sectionKey}' to v${rev.version_number}!` };
}
