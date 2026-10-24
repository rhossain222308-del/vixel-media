import React from 'react';
import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { isSupabaseConfigured } from '@/lib/supabase/config';
import { getFounderProfileForUser } from '@/lib/data/profiles';
import { sampleFounders } from '@/data/founders';
import { ProfileFormClient } from './ProfileFormClient';
import type { ProfileRow, Json } from '@/types/database.types';

export const metadata: Metadata = {
  title: 'Founder Profile Editor | Vixel Media Dashboard',
  description: 'Manage your individual co-founder portfolio, bio, skills, and tools.',
};

export default async function DashboardProfilePage() {
  const configured = isSupabaseConfigured();

  if (configured) {
    const supabase = await createClient();
    if (!supabase) {
      redirect('/login');
    }

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      redirect('/login?returnTo=/dashboard/profile');
    }

    const profile = await getFounderProfileForUser(user.id);

    return (
      <ProfileFormClient
        initialProfile={profile}
        userEmail={user.email || ''}
        userId={user.id}
      />
    );
  }

  // Offline / Demo fallback
  const staticIso = '2026-10-15T12:00:00.000Z';
  const mockProfile: ProfileRow = {
    id: 'demo-founder-1',
    slug: sampleFounders[0].slug,
    full_name: sampleFounders[0].name,
    role: sampleFounders[0].role,
    tagline: sampleFounders[0].tagline,
    bio: sampleFounders[0].shortBio,
    full_bio: sampleFounders[0].fullBio.join('\n\n'),
    avatar_url: sampleFounders[0].avatarUrl,
    cover_url: sampleFounders[0].coverUrl || '',
    contact_email: sampleFounders[0].email,
    location: sampleFounders[0].location,
    years_experience: sampleFounders[0].yearsExperience,
    socials: sampleFounders[0].socials as unknown as Json,
    skills: sampleFounders[0].skills.map((s) => s.name) as unknown as Json,
    tools: sampleFounders[0].tools.map((t) => t.name) as unknown as Json,
    experience: sampleFounders[0].experience as unknown as Json,
    clients: sampleFounders[0].sampleClients,
    featured_project_ids: sampleFounders[0].featuredProjectIds,
    is_published: true,
    created_at: staticIso,
    updated_at: staticIso,
  };

  return (
    <ProfileFormClient
      initialProfile={mockProfile}
      userEmail="alex@vixelmedia.demo"
      userId="demo-founder-1"
    />
  );
}
