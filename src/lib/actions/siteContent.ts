'use server';

import { createClient } from '@/lib/supabase/server';
import { isSupabaseConfigured } from '@/lib/supabase/config';
import { revalidatePath } from 'next/cache';
import type { ActionResponse } from './profile';

/**
 * Server Action: Update Shared Site Content Section
 * Rule C: Both authorized co-founders can edit shared website content.
 */
export async function updateSiteContentAction(
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
    return { success: false, error: 'Unauthorized: Founder login required.' };
  }

  const sectionKey = (formData.get('sectionKey') as string)?.trim();
  const rawContent = (formData.get('content') as string)?.trim();
  const status = formData.get('status') === 'published' ? 'published' : 'draft';

  if (!sectionKey) {
    return { success: false, error: 'Section key is required.' };
  }

  let contentJson = {};
  try {
    contentJson = JSON.parse(rawContent || '{}');
  } catch {
    return { success: false, error: 'Malformed JSON payload for section content.' };
  }

  const { error } = await supabase.from('site_content').upsert(
    {
      section_key: sectionKey,
      content: contentJson,
      status,
      updated_by: user.id,
      updated_at: new Date().toISOString(),
    },
    { onConflict: 'section_key' }
  );

  if (error) {
    console.error('Error updating site content:', error);
    return { success: false, error: `Failed to update site content: ${error.message}` };
  }

  revalidatePath('/');
  revalidatePath('/about');
  revalidatePath('/pricing');
  revalidatePath('/dashboard');

  return { success: true, message: `Section '${sectionKey}' saved successfully!` };
}
