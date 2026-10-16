import React from 'react';
import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { isSupabaseConfigured } from '@/lib/supabase/config';
import { getInquiries } from '@/lib/data/inquiries';
import { InquiriesManagerClient } from './InquiriesManagerClient';
import type { ContactInquiryRow } from '@/types/database.types';

export const metadata: Metadata = {
  title: 'Client Inquiries Desk | Vixel Media Dashboard',
  description: 'Private co-founder desk for managing prospective client briefs and video leads.',
};

export default async function DashboardInquiriesPage() {
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
      redirect('/login?returnTo=/dashboard/inquiries');
    }

    const inquiries = await getInquiries();
    return <InquiriesManagerClient initialInquiries={inquiries} />;
  }

  // Offline / Demo fallback
  const staticIso1 = '2026-10-15T18:30:00.000Z';
  const staticIso2 = '2026-10-14T14:15:00.000Z';
  const staticIso3 = '2026-10-13T09:45:00.000Z';

  const mockInquiries: ContactInquiryRow[] = [
    {
      id: 'demo-inq-1',
      name: 'Sarah Jenkins',
      email: 'sarah@aurorabrand.com',
      company: 'Aurora Luxury Apparel',
      service: 'Cinematic Brand Reel',
      budget: '$5,000 - $10,000',
      timeline: '2-3 Weeks',
      founder_preference: 'alex',
      message: 'Looking for a cinematic, high-retention reel for our Autumn/Winter outerwear campaign. Need cinema-grade color grading and punchy sound design.',
      status: 'new',
      created_at: staticIso1,
    },
    {
      id: 'demo-inq-2',
      name: 'Michael Chang',
      email: 'm.chang@apexmedia.io',
      company: 'Apex Media Group',
      service: 'Long-Form YouTube Documentary',
      budget: '$10,000+',
      timeline: '1 Month',
      founder_preference: 'marcus',
      message: 'We produce long-form business essays (15-25 minutes). Our channel has 450K subscribers and we want to elevate our pacing and motion graphics.',
      status: 'in_review',
      created_at: staticIso2,
    },
    {
      id: 'demo-inq-3',
      name: 'Elena Rostova',
      email: 'elena@novawave.co',
      company: 'NovaWave Audio',
      service: 'Performance Ad Creatives',
      budget: '$3,000 - $5,000',
      timeline: 'Immediate (1 Week)',
      founder_preference: 'any',
      message: 'Need 5 variations of high-converting Meta and TikTok video ads for a wireless earbud product launch. Fast hooks in first 2 seconds.',
      status: 'contacted',
      created_at: staticIso3,
    },
  ];

  return <InquiriesManagerClient initialInquiries={mockInquiries} />;
}
