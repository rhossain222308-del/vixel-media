import React from 'react';
import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { isSupabaseConfigured } from '@/lib/supabase/config';
import { getFounderProfileForUser } from '@/lib/data/profiles';
import { getInquiries } from '@/lib/data/inquiries';
import { DashboardLayoutClient } from '@/components/dashboard/DashboardLayoutClient';
import { sampleFounders } from '@/data/founders';

export const metadata: Metadata = {
  title: 'Co-Founder Studio Desk | Vixel Media',
  description: 'Private administration panel for Vixel Media co-founders.',
};

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const configured = isSupabaseConfigured();

  let founderName = sampleFounders[0].name;
  let founderRole = sampleFounders[0].role;
  let founderAvatar = sampleFounders[0].avatarUrl;
  let inquiriesCount = 3;

  if (configured) {
    const supabase = await createClient();
    if (!supabase) {
      redirect('/login');
    }

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      redirect('/login?returnTo=/dashboard');
    }

    const [profile, inquiries] = await Promise.all([
      getFounderProfileForUser(user.id),
      getInquiries(),
    ]);

    if (profile) {
      founderName = profile.full_name;
      founderRole = profile.role;
      founderAvatar = profile.avatar_url;
    } else if (user.email) {
      founderName = user.email.split('@')[0];
    }

    inquiriesCount = inquiries.filter((inq) => inq.status === 'new').length;
  }

  return (
    <DashboardLayoutClient
      founderName={founderName}
      founderRole={founderRole}
      founderAvatar={founderAvatar}
      inquiriesCount={inquiriesCount}
      isConfigured={configured}
    >
      {children}
    </DashboardLayoutClient>
  );
}
