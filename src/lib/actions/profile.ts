'use server';

import { createClient } from '@/lib/supabase/server';
import { isSupabaseConfigured } from '@/lib/supabase/config';
import { revalidatePath } from 'next/cache';

export interface ActionResponse {
  success: boolean;
  error?: string;
  message?: string;
}

/**
 * Server Action: Update Founder Profile
 * Rule A: A founder can update ONLY their own profile (auth.uid() = id).
 * Prevents changing another founder's profile data.
 */
export async function updateFounderProfileAction(
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
  if (!supabase) {
    return { success: false, error: 'Failed to initialize database client.' };
  }

  // 1. Verify authenticated user
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: 'Unauthorized: You must be logged in to update your profile.' };
  }

  const targetProfileId = formData.get('profileId') as string;

  // 2. Enforce profile ownership rule: user can only modify their own profile record
  if (targetProfileId && targetProfileId !== user.id) {
    return {
      success: false,
      error: 'Security Violation: You are not authorized to update another co-founder’s profile.',
    };
  }

  const fullName = (formData.get('fullName') as string)?.trim();
  const role = (formData.get('role') as string)?.trim();
  const tagline = (formData.get('tagline') as string)?.trim();
  const bio = (formData.get('bio') as string)?.trim();
  const contactEmail = (formData.get('contactEmail') as string)?.trim();
  const location = (formData.get('location') as string)?.trim();
  const yearsExperience = parseInt((formData.get('yearsExperience') as string) || '0', 10);
  const isPublished = formData.get('isPublished') === 'true';

  if (!fullName) {
    return { success: false, error: 'Full name is required.' };
  }

  // Parse optional JSON fields if present
  let socials = {};
  let skills = [];
  let tools = [];

  try {
    const rawSocials = formData.get('socials') as string;
    if (rawSocials) socials = JSON.parse(rawSocials);

    const rawSkills = formData.get('skills') as string;
    if (rawSkills) skills = JSON.parse(rawSkills);

    const rawTools = formData.get('tools') as string;
    if (rawTools) tools = JSON.parse(rawTools);
  } catch {
    // Graceful fallback if JSON is empty or malformed
  }

  // 3. Perform update with strict auth user ID
  const { error } = await supabase
    .from('profiles')
    .update({
      full_name: fullName,
      role: role || 'Co-Founder',
      tagline: tagline || '',
      bio: bio || '',
      contact_email: contactEmail || '',
      location: location || '',
      years_experience: isNaN(yearsExperience) ? 0 : yearsExperience,
      is_published: isPublished,
      socials,
      skills,
      tools,
      updated_at: new Date().toISOString(),
    })
    .eq('id', user.id);

  if (error) {
    console.error('Error updating founder profile:', error);
    return { success: false, error: `Failed to update profile: ${error.message}` };
  }

  revalidatePath('/dashboard');
  revalidatePath('/about');
  revalidatePath('/portfolio/[slug]', 'page');

  return { success: true, message: 'Profile updated successfully!' };
}
