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
  const rawSlug = (formData.get('slug') as string)?.trim();
  const role = (formData.get('role') as string)?.trim();
  const tagline = (formData.get('tagline') as string)?.trim();
  const bio = (formData.get('bio') as string)?.trim();
  const fullBio = (formData.get('fullBio') as string)?.trim();
  const avatarUrl = (formData.get('avatarUrl') as string)?.trim();
  const coverUrl = (formData.get('coverUrl') as string)?.trim();
  const contactEmail = (formData.get('contactEmail') as string)?.trim();
  const location = (formData.get('location') as string)?.trim();
  const yearsExperience = parseInt((formData.get('yearsExperience') as string) || '0', 10);
  const isPublished = formData.get('isPublished') === 'true';

  if (!fullName) {
    return { success: false, error: 'Full name is required.' };
  }

  // Sanitize slug
  const slug = rawSlug
    ? rawSlug.toLowerCase().replace(/[^a-z0-9-]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '')
    : fullName.toLowerCase().replace(/[^a-z0-9-]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');

  if (!slug) {
    return { success: false, error: 'A valid public slug is required.' };
  }

  // Check slug uniqueness across other founder profiles
  const { data: existingSlugUser, error: slugCheckError } = await supabase
    .from('profiles')
    .select('id')
    .eq('slug', slug)
    .neq('id', user.id)
    .maybeSingle();

  if (slugCheckError) {
    console.error('Error checking slug uniqueness:', slugCheckError);
  }

  if (existingSlugUser) {
    return {
      success: false,
      error: `Public slug '${slug}' is already in use by another profile. Please choose a unique slug.`,
    };
  }

  // Parse optional JSON fields if present
  let socials = {};
  let skills: string[] = [];
  let tools: string[] = [];
  let clients: string[] = [];
  let experience = [];

  try {
    const rawSocials = formData.get('socials') as string;
    if (rawSocials) socials = JSON.parse(rawSocials);

    const rawSkills = formData.get('skills') as string;
    if (rawSkills) skills = JSON.parse(rawSkills);

    const rawTools = formData.get('tools') as string;
    if (rawTools) tools = JSON.parse(rawTools);

    const rawClients = formData.get('clients') as string;
    if (rawClients) clients = JSON.parse(rawClients);

    const rawExperience = formData.get('experience') as string;
    if (rawExperience) experience = JSON.parse(rawExperience);
  } catch {
    // Graceful fallback if JSON is empty or malformed
  }

  // 3. Perform update with strict auth user ID (auth.uid() === user.id)
  const { error } = await supabase
    .from('profiles')
    .update({
      full_name: fullName,
      slug,
      role: role || 'Co-Founder',
      tagline: tagline || '',
      bio: bio || '',
      full_bio: fullBio || bio || '',
      avatar_url: avatarUrl || '',
      cover_url: coverUrl || '',
      contact_email: contactEmail || '',
      location: location || '',
      years_experience: isNaN(yearsExperience) ? 0 : yearsExperience,
      is_published: isPublished,
      socials,
      skills,
      tools,
      clients,
      experience,
      updated_at: new Date().toISOString(),
    })
    .eq('id', user.id);

  if (error) {
    console.error('Error updating founder profile:', error);
    return { success: false, error: `Failed to update profile: ${error.message}` };
  }

  revalidatePath('/dashboard');
  revalidatePath('/dashboard/profile');
  revalidatePath('/about');
  revalidatePath(`/portfolio/${slug}`);

  return { success: true, message: 'Your founder profile has been updated successfully!' };
}
