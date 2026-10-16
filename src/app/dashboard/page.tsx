import React from 'react';
import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { isSupabaseConfigured } from '@/lib/supabase/config';
import { getFounderProfileForUser } from '@/lib/data/profiles';
import { getFounderProjects } from '@/lib/data/projects';
import { getAllSiteContent } from '@/lib/data/siteContent';
import { getAllServices } from '@/lib/data/services';
import { getAllTestimonials } from '@/lib/data/testimonials';
import { getInquiries } from '@/lib/data/inquiries';
import { DashboardClientView } from './DashboardClientView';
import { sampleFounders } from '@/data/founders';
import { sampleProjects } from '@/data/projects';
import { agencyServices } from '@/data/services';
import { sampleTestimonials } from '@/data/testimonials';
import type { 
  ProfileRow, 
  PortfolioProjectRow, 
  ServiceRow, 
  TestimonialRow, 
  ContactInquiryRow,
  SiteContentRow,
  Json
} from '@/types/database.types';

export const metadata: Metadata = {
  title: 'Co-Founder Studio Desk | Vixel Media',
  description: 'Private administration panel for Vixel Media co-founders.',
};

export default async function DashboardPage() {
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
      redirect('/login?returnTo=/dashboard');
    }

    const [profile, projects, siteContent, services, testimonials, inquiries] =
      await Promise.all([
        getFounderProfileForUser(user.id),
        getFounderProjects(user.id),
        getAllSiteContent(),
        getAllServices(),
        getAllTestimonials(),
        getInquiries(),
      ]);

    return (
      <DashboardClientView
        isConfigured={true}
        userEmail={user.email || ''}
        userId={user.id}
        initialProfile={profile}
        initialProjects={projects}
        initialSiteContent={siteContent}
        initialServices={services}
        initialTestimonials={testimonials}
        initialInquiries={inquiries}
      />
    );
  }

  // Graceful offline/preview mode when Supabase credentials are not yet configured
  const staticIsoTime = '2026-10-15T12:00:00.000Z';
  const staticPastTime1 = '2026-10-15T10:00:00.000Z';
  const staticPastTime2 = '2026-10-14T08:30:00.000Z';

  const mockProfile: ProfileRow = {
    id: 'demo-founder-1',
    slug: sampleFounders[0].slug,
    full_name: sampleFounders[0].name,
    role: sampleFounders[0].role,
    tagline: sampleFounders[0].tagline,
    bio: sampleFounders[0].shortBio,
    full_bio: sampleFounders[0].fullBio,
    avatar_url: sampleFounders[0].avatarUrl,
    cover_url: sampleFounders[0].coverUrl || '',
    contact_email: sampleFounders[0].email,
    location: sampleFounders[0].location,
    years_experience: sampleFounders[0].yearsExperience,
    socials: sampleFounders[0].socials as unknown as Json,
    skills: sampleFounders[0].skills as unknown as Json,
    tools: sampleFounders[0].tools as unknown as Json,
    experience: sampleFounders[0].experience as unknown as Json,
    clients: sampleFounders[0].sampleClients,
    featured_project_ids: sampleFounders[0].featuredProjectIds,
    is_published: true,
    created_at: staticIsoTime,
    updated_at: staticIsoTime,
  };

  const mockProjects: PortfolioProjectRow[] = sampleProjects.map((p) => ({
    id: p.id,
    owner_id: 'demo-founder-1',
    title: p.title,
    slug: p.slug,
    client: p.client,
    description: p.description,
    long_description: p.longDescription || '',
    category: p.category,
    category_label: p.categoryLabel,
    deliverables: p.deliverables,
    duration: p.duration,
    aspect_ratio: p.aspectRatio,
    thumbnail_url: p.thumbnailUrl,
    video_url: p.videoUrl || '',
    platform: 'YouTube',
    has_playable_media: p.hasPlayableMedia,
    featured: p.featured,
    sort_order: 1,
    status: 'published',
    metrics: p.metrics || {},
    tools_used: p.toolsUsed,
    year: p.year,
    created_at: staticIsoTime,
    updated_at: staticIsoTime,
  }));

  const mockServices: ServiceRow[] = agencyServices.map((s, idx) => ({
    id: s.id,
    title: s.title,
    slug: s.slug,
    badge: s.badge,
    description: s.shortDescription,
    full_description: s.fullDescription,
    deliverables: s.deliverables,
    platforms: s.intendedPlatforms,
    turnaround_time: s.turnaroundTime,
    ideal_for: s.idealFor,
    sample_video_url: s.sampleVideoUrl || '',
    image_url: s.thumbnailUrl,
    features: s.features,
    sort_order: idx + 1,
    is_published: true,
    created_at: staticIsoTime,
    updated_at: staticIsoTime,
  }));

  const mockTestimonials: TestimonialRow[] = sampleTestimonials.map((t, idx) => ({
    id: t.id,
    client_name: t.clientName,
    role: t.role,
    company: t.company,
    avatar_url: t.avatarUrl,
    quote: t.quote,
    rating: t.rating,
    project_title: t.projectTitle,
    project_category: t.projectCategory,
    metrics_result: t.metricsResult || '',
    is_verified: t.isVerified,
    has_video_review: t.hasVideoReview || false,
    project_image_url: '',
    is_published: true,
    sort_order: idx + 1,
    created_at: staticIsoTime,
    updated_at: staticIsoTime,
  }));

  const mockSiteContent: SiteContentRow[] = [
    {
      id: 'sec-1',
      section_key: 'home_hero',
      content: {
        badge: 'High-Impact Video Post-Production & Motion Studio',
        headline: 'Transforming Raw Footage into High-Retention Cinematic Video.',
        cta_primary_text: 'Explore Agency Work',
      },
      status: 'published',
      updated_by: 'demo-founder-1',
      created_at: staticIsoTime,
      updated_at: staticIsoTime,
    },
    {
      id: 'sec-2',
      section_key: 'about_story',
      content: {
        tagline: 'Two Co-Founders. One Relentless Standard.',
        story_title: 'Built on Pacing, Precision, and Visual Engineering',
      },
      status: 'published',
      updated_by: 'demo-founder-1',
      created_at: staticIsoTime,
      updated_at: staticIsoTime,
    },
    {
      id: 'sec-3',
      section_key: 'agency_settings',
      content: {
        brand_name: 'VIXEL MEDIA',
        contact_email: 'hello@vixelmedia.demo',
        studio_location: 'Los Angeles • San Francisco • Remote',
      },
      status: 'published',
      updated_by: 'demo-founder-1',
      created_at: staticIsoTime,
      updated_at: staticIsoTime,
    },
  ];

  const mockInquiries: ContactInquiryRow[] = [
    {
      id: 'inq-demo-1',
      name: 'Sarah Jenkins',
      email: 'sjenkins@luminalabs.demo',
      company: 'Lumina Digital Labs',
      service: 'Video Editing',
      budget: '$5,000 - $10,000',
      timeline: 'Within 2-4 weeks',
      founder_preference: 'Alex Vance (Lead Editor)',
      message: 'Looking for high-end DaVinci Resolve grading and editorial pacing for our upcoming 4-part founder documentary series.',
      status: 'new',
      created_at: staticPastTime1,
    },
    {
      id: 'inq-demo-2',
      name: 'David Rossi',
      email: 'david@echomedia.demo',
      company: 'Echoes of Empires Studio',
      service: 'Map Animation',
      budget: '$10,000+',
      timeline: 'Needed ASAP',
      founder_preference: 'Marcus Chen (Motion & 3D Maps)',
      message: 'Need 12 photorealistic 3D map animation sequences using GeoLayers and Cinema 4D for our geopolitical series.',
      status: 'in_review',
      created_at: staticPastTime2,
    },
  ];

  return (
    <DashboardClientView
      isConfigured={false}
      userEmail="demo-founder@vixelmedia.demo"
      userId="demo-founder-1"
      initialProfile={mockProfile}
      initialProjects={mockProjects}
      initialSiteContent={mockSiteContent}
      initialServices={mockServices}
      initialTestimonials={mockTestimonials}
      initialInquiries={mockInquiries}
    />
  );
}
