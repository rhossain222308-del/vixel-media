import React from 'react';
import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { isSupabaseConfigured } from '@/lib/supabase/config';
import { ProjectNewClient } from './ProjectNewClient';

export const metadata: Metadata = {
  title: 'Add New Project | Vixel Media Dashboard',
  description: 'Add a new video project to your personal portfolio.',
};

export default async function DashboardNewProjectPage() {
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
      redirect('/login?returnTo=/dashboard/portfolio/new');
    }
  }

  return <ProjectNewClient />;
}
