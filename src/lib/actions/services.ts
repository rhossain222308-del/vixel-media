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
 * Server Action: Save Service (Insert or Update)
 * Rule C: Both authorized founders can manage shared agency services.
 */
export async function saveServiceAction(
  _prevState: ActionResponse | null,
  formData: FormData
): Promise<ActionResponse> {
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
    return { success: false, error: 'Unauthorized: Founder login required.' };
  }

  const serviceId = (formData.get('serviceId') as string)?.trim();
  const title = (formData.get('title') as string)?.trim();
  const badge = (formData.get('badge') as string)?.trim() || '';
  const description = (formData.get('description') as string)?.trim() || '';
  const fullDescription = (formData.get('fullDescription') as string)?.trim() || description;
  const turnaroundTime = (formData.get('turnaroundTime') as string)?.trim() || '';
  const idealFor = (formData.get('idealFor') as string)?.trim() || '';
  const imageUrl = (formData.get('imageUrl') as string)?.trim() || '';
  const sampleVideoUrl = (formData.get('sampleVideoUrl') as string)?.trim() || '';
  const sortOrder = parseInt((formData.get('sortOrder') as string) || '0', 10);
  const isPublished = formData.get('isPublished') === 'true';

  let deliverables: string[] = [];
  const rawDeliverables = formData.get('deliverables') as string;
  if (rawDeliverables) {
    try {
      deliverables = JSON.parse(rawDeliverables);
    } catch {
      deliverables = rawDeliverables.split(',').map((s) => s.trim()).filter(Boolean);
    }
  }

  let platforms: string[] = [];
  const rawPlatforms = formData.get('platforms') as string;
  if (rawPlatforms) {
    try {
      platforms = JSON.parse(rawPlatforms);
    } catch {
      platforms = rawPlatforms.split(',').map((s) => s.trim()).filter(Boolean);
    }
  }

  if (!title || !description) {
    return { success: false, error: 'Service title and description are required.' };
  }

  const slug = generateSlug(title);

  if (serviceId) {
    // Update
    const { error } = await supabase
      .from('services')
      .update({
        title,
        badge,
        description,
        full_description: fullDescription,
        turnaround_time: turnaroundTime,
        ideal_for: idealFor,
        image_url: imageUrl,
        sample_video_url: sampleVideoUrl,
        deliverables,
        platforms,
        sort_order: isNaN(sortOrder) ? 0 : sortOrder,
        is_published: isPublished,
        updated_at: new Date().toISOString(),
      })
      .eq('id', serviceId);

    if (error) {
      console.error('Error updating service:', error);
      return { success: false, error: `Failed to update service: ${error.message}` };
    }
  } else {
    // Insert
    const { error } = await supabase.from('services').insert({
      title,
      slug,
      badge,
      description,
      full_description: fullDescription,
      turnaround_time: turnaroundTime,
      ideal_for: idealFor,
      image_url: imageUrl,
      sample_video_url: sampleVideoUrl,
      deliverables,
      platforms,
      sort_order: isNaN(sortOrder) ? 0 : sortOrder,
      is_published: isPublished,
    });

    if (error) {
      console.error('Error inserting service:', error);
      return { success: false, error: `Failed to create service: ${error.message}` };
    }
  }

  revalidatePath('/services');
  revalidatePath('/dashboard');
  revalidatePath('/dashboard/services');

  return { success: true, message: 'Service saved successfully!' };
}

/**
 * Server Action: Delete Service
 */
export async function deleteServiceAction(serviceId: string): Promise<ActionResponse> {
  if (!isSupabaseConfigured()) {
    return { success: false, error: 'Supabase credentials are not configured yet.' };
  }

  const supabase = await createClient();
  if (!supabase) return { success: false, error: 'Database client not available.' };

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: 'Unauthorized: Founder login required.' };
  }

  const { error } = await supabase.from('services').delete().eq('id', serviceId);

  if (error) {
    console.error('Error deleting service:', error);
    return { success: false, error: `Failed to delete service: ${error.message}` };
  }

  revalidatePath('/services');
  revalidatePath('/dashboard');
  revalidatePath('/dashboard/services');

  return { success: true, message: 'Service removed successfully.' };
}
