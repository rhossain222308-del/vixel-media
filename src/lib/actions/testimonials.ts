'use server';

import { createClient } from '@/lib/supabase/server';
import { isSupabaseConfigured } from '@/lib/supabase/config';
import { revalidatePath } from 'next/cache';
import type { ActionResponse } from './profile';

/**
 * Server Action: Save Testimonial (Insert or Update)
 * Rule C: Both authorized founders can manage shared testimonials.
 */
export async function saveTestimonialAction(
  _prevState: ActionResponse | null,
  formData: FormData
): Promise<ActionResponse> {
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

  const testimonialId = (formData.get('testimonialId') as string)?.trim();
  const clientName = (formData.get('clientName') as string)?.trim();
  const role = (formData.get('role') as string)?.trim() || '';
  const company = (formData.get('company') as string)?.trim();
  const quote = (formData.get('quote') as string)?.trim();
  const rating = parseInt((formData.get('rating') as string) || '5', 10);
  const projectTitle = (formData.get('projectTitle') as string)?.trim() || '';
  const metricsResult = (formData.get('metricsResult') as string)?.trim() || '';
  const avatarUrl = (formData.get('avatarUrl') as string)?.trim() || '';
  const sortOrder = parseInt((formData.get('sortOrder') as string) || '0', 10);
  const isPublished = formData.get('isPublished') === 'true';

  if (!clientName || !company || !quote) {
    return { success: false, error: 'Client name, company, and testimonial quote are required.' };
  }

  if (testimonialId) {
    // Update
    const { error } = await supabase
      .from('testimonials')
      .update({
        client_name: clientName,
        role,
        company,
        quote,
        rating: isNaN(rating) ? 5 : rating,
        project_title: projectTitle,
        metrics_result: metricsResult,
        avatar_url: avatarUrl,
        sort_order: isNaN(sortOrder) ? 0 : sortOrder,
        is_published: isPublished,
        updated_at: new Date().toISOString(),
      })
      .eq('id', testimonialId);

    if (error) {
      console.error('Error updating testimonial:', error);
      return { success: false, error: `Failed to update testimonial: ${error.message}` };
    }
  } else {
    // Insert
    const { error } = await supabase.from('testimonials').insert({
      client_name: clientName,
      role,
      company,
      quote,
      rating: isNaN(rating) ? 5 : rating,
      project_title: projectTitle,
      metrics_result: metricsResult,
      avatar_url: avatarUrl,
      sort_order: isNaN(sortOrder) ? 0 : sortOrder,
      is_published: isPublished,
    });

    if (error) {
      console.error('Error creating testimonial:', error);
      return { success: false, error: `Failed to create testimonial: ${error.message}` };
    }
  }

  revalidatePath('/testimonials');
  revalidatePath('/dashboard');

  return { success: true, message: 'Testimonial saved successfully!' };
}

/**
 * Server Action: Delete Testimonial
 */
export async function deleteTestimonialAction(testimonialId: string): Promise<ActionResponse> {
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

  const { error } = await supabase.from('testimonials').delete().eq('id', testimonialId);

  if (error) {
    console.error('Error deleting testimonial:', error);
    return { success: false, error: `Failed to delete testimonial: ${error.message}` };
  }

  revalidatePath('/testimonials');
  revalidatePath('/dashboard');

  return { success: true, message: 'Testimonial removed successfully.' };
}
