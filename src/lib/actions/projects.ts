'use server';

import { createClient } from '@/lib/supabase/server';
import { isSupabaseConfigured } from '@/lib/supabase/config';
import { revalidatePath } from 'next/cache';
import type { ActionResponse } from './profile';

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * Server Action: Create Portfolio Project
 * Rule B: Project owner_id MUST match authenticated founder's user ID.
 */
export async function createProjectAction(
  _prevState: ActionResponse | null,
  formData: FormData
): Promise<ActionResponse> {
  if (!isSupabaseConfigured()) {
    return {
      success: false,
      error: 'Supabase credentials are not configured yet. Live mutations require a connected database.',
    };
  }

  const supabase = await createClient();
  if (!supabase) return { success: false, error: 'Database client not available.' };

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: 'Unauthorized: You must be logged in to create projects.' };
  }

  const title = (formData.get('title') as string)?.trim();
  const rawCategory = (formData.get('category') as string)?.trim();
  const category = (['reels', 'long-form', 'ads', 'motion-graphics'].includes(rawCategory)
    ? rawCategory
    : 'video-editing') as 'reels' | 'long-form' | 'ads' | 'motion-graphics';

  const client = (formData.get('client') as string)?.trim() || '';
  const description = (formData.get('description') as string)?.trim() || '';
  const videoUrl = (formData.get('videoUrl') as string)?.trim() || '';
  const thumbnailUrl = (formData.get('thumbnailUrl') as string)?.trim() || '';
  const platform = (formData.get('platform') as string)?.trim() || 'Vimeo';
  const duration = (formData.get('duration') as string)?.trim() || '';
  const rawStatus = (formData.get('status') as string)?.trim();
  const status = rawStatus === 'published' ? 'published' : 'draft';
  const featured = formData.get('featured') === 'true';

  if (!title) {
    return { success: false, error: 'Project title is required.' };
  }

  const baseSlug = generateSlug(title);
  const slug = `${baseSlug}-${Date.now().toString(36)}`;

  // Strict ownership assignment: owner_id is set to user.id, never trusted from client
  const { error } = await supabase.from('portfolio_projects').insert({
    owner_id: user.id,
    title,
    slug,
    client,
    description,
    category,
    video_url: videoUrl,
    thumbnail_url: thumbnailUrl || 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&w=1200&q=80',
    platform,
    duration,
    status,
    featured,
    has_playable_media: !!videoUrl,
  });

  if (error) {
    console.error('Error creating project:', error);
    return { success: false, error: `Failed to create project: ${error.message}` };
  }

  revalidatePath('/dashboard');
  revalidatePath('/work');
  revalidatePath('/portfolio/[slug]', 'page');

  return { success: true, message: 'Project created successfully!' };
}

/**
 * Server Action: Update Portfolio Project
 * Rule B: Validates that project belongs to authenticated user before updating.
 * Prevents changing owner_id.
 */
export async function updateProjectAction(
  _prevState: ActionResponse | null,
  formData: FormData
): Promise<ActionResponse> {
  if (!isSupabaseConfigured()) {
    return {
      success: false,
      error: 'Supabase credentials are not configured yet. Live mutations require a connected database.',
    };
  }

  const supabase = await createClient();
  if (!supabase) return { success: false, error: 'Database client not available.' };

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: 'Unauthorized: You must be logged in to edit projects.' };
  }

  const projectId = formData.get('projectId') as string;
  if (!projectId) {
    return { success: false, error: 'Project ID is required.' };
  }

  // 1. Verify existing project ownership
  const { data: existingProject, error: checkError } = await supabase
    .from('portfolio_projects')
    .select('id, owner_id')
    .eq('id', projectId)
    .single();

  if (checkError || !existingProject) {
    return { success: false, error: 'Project not found.' };
  }

  if (existingProject.owner_id !== user.id) {
    return {
      success: false,
      error: 'Security Violation: You do not own this project and cannot modify it.',
    };
  }

  const title = (formData.get('title') as string)?.trim();
  const rawCategory = (formData.get('category') as string)?.trim();
  const category = (['reels', 'long-form', 'ads', 'motion-graphics'].includes(rawCategory)
    ? rawCategory
    : 'video-editing') as 'reels' | 'long-form' | 'ads' | 'motion-graphics';

  const client = (formData.get('client') as string)?.trim() || '';
  const description = (formData.get('description') as string)?.trim() || '';
  const videoUrl = (formData.get('videoUrl') as string)?.trim() || '';
  const thumbnailUrl = (formData.get('thumbnailUrl') as string)?.trim() || '';
  const platform = (formData.get('platform') as string)?.trim() || 'Vimeo';
  const duration = (formData.get('duration') as string)?.trim() || '';
  const rawStatus = (formData.get('status') as string)?.trim();
  const status = rawStatus === 'published' ? 'published' : 'draft';
  const featured = formData.get('featured') === 'true';

  if (!title) {
    return { success: false, error: 'Project title is required.' };
  }

  // 2. Perform update with strict owner_id check (never modifying owner_id)
  const { error } = await supabase
    .from('portfolio_projects')
    .update({
      title,
      client,
      description,
      category,
      video_url: videoUrl,
      thumbnail_url: thumbnailUrl,
      platform,
      duration,
      status,
      featured,
      has_playable_media: !!videoUrl,
      updated_at: new Date().toISOString(),
    })
    .eq('id', projectId)
    .eq('owner_id', user.id);

  if (error) {
    console.error('Error updating project:', error);
    return { success: false, error: `Failed to update project: ${error.message}` };
  }

  revalidatePath('/dashboard');
  revalidatePath('/work');
  revalidatePath('/portfolio/[slug]', 'page');

  return { success: true, message: 'Project updated successfully!' };
}

/**
 * Server Action: Delete Portfolio Project
 * Rule B: Validates ownership before deletion.
 */
export async function deleteProjectAction(projectId: string): Promise<ActionResponse> {
  if (!isSupabaseConfigured()) {
    return {
      success: false,
      error: 'Supabase credentials are not configured yet.',
    };
  }

  const supabase = await createClient();
  if (!supabase) return { success: false, error: 'Database client not available.' };

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: 'Unauthorized: You must be logged in to delete projects.' };
  }

  // Strictly enforce user.id === owner_id
  const { error } = await supabase
    .from('portfolio_projects')
    .delete()
    .eq('id', projectId)
    .eq('owner_id', user.id);

  if (error) {
    console.error('Error deleting project:', error);
    return { success: false, error: `Failed to delete project: ${error.message}` };
  }

  revalidatePath('/dashboard');
  revalidatePath('/work');

  return { success: true, message: 'Project deleted successfully!' };
}
