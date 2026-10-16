import React from 'react';
import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { isSupabaseConfigured, isSupabaseAdminConfigured } from '@/lib/supabase/config';
import { getFounderProfileForUser } from '@/lib/data/profiles';
import { sampleFounders } from '@/data/founders';
import { SettingsClient } from './SettingsClient';

export const metadata: Metadata = {
  title: 'Studio Settings & Diagnostic | Vixel Media Dashboard',
  description: 'Backend health, Row Level Security verification, and storage audit.',
};

export default async function DashboardSettingsPage() {
  const configured = isSupabaseConfigured();
  const adminConfigured = isSupabaseAdminConfigured();

  let userEmail = 'alex@vixelmedia.demo';
  let userId = 'demo-founder-1';
  let founderName = sampleFounders[0].name;
  let founderRole = sampleFounders[0].role;

  if (configured) {
    const supabase = await createClient();
    if (!supabase) {
      redirect('/login');
    }

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      redirect('/login?returnTo=/dashboard/settings');
    }

    userEmail = user.email || '';
    userId = user.id;

    const profile = await getFounderProfileForUser(user.id);
    if (profile) {
      founderName = profile.full_name;
      founderRole = profile.role;
    }
  }

  return (
    <SettingsClient
      userEmail={userEmail}
      userId={userId}
      founderName={founderName}
      founderRole={founderRole}
      isConfigured={configured}
      isAdminConfigured={adminConfigured}
    />
  );
}
