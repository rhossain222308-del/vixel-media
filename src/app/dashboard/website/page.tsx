import React from 'react';
import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { isSupabaseConfigured } from '@/lib/supabase/config';
import { getAllSiteContent, getSectionRevisions } from '@/lib/data/siteContent';
import { WebsiteCmsClient } from './WebsiteCmsClient';
import type { SiteContentRow, SiteContentRevisionRow } from '@/types/database.types';

export const metadata: Metadata = {
  title: 'Shared Website CMS | Vixel Media Dashboard',
  description: 'Manage shared agency website headlines, branding, pillars, and contact information.',
};

export default async function DashboardWebsitePage() {
  const configured = isSupabaseConfigured();

  let siteContent: SiteContentRow[] = [];
  const revisionsMap: Record<string, SiteContentRevisionRow[]> = {};
  let userId = 'demo-founder-1';

  if (configured) {
    const supabase = await createClient();
    if (!supabase) {
      redirect('/login');
    }

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      redirect('/login?returnTo=/dashboard/website');
    }

    userId = user.id;
    siteContent = await getAllSiteContent();

    const sections = ['hero', 'trusted_by', 'why_vixel', 'story_vision', 'pricing', 'contact_footer'];
    const revisionsResults = await Promise.all(
      sections.map((sec) => getSectionRevisions(sec))
    );

    sections.forEach((sec, idx) => {
      revisionsMap[sec] = revisionsResults[idx] || [];
    });
  }

  return (
    <WebsiteCmsClient
      initialContent={siteContent}
      revisions={revisionsMap}
      userId={userId}
    />
  );
}
