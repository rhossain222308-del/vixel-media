import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { 
  Film, 
  User, 
  Globe, 
  Layers, 
  Sparkles, 
  Mail, 
  ArrowRight, 
  Plus, 
  ShieldCheck,
  ExternalLink,
  ChevronRight,
  Database
} from 'lucide-react';
import { createClient } from '@/lib/supabase/server';
import { isSupabaseConfigured } from '@/lib/supabase/config';
import { getFounderProfileForUser } from '@/lib/data/profiles';
import { getFounderProjects } from '@/lib/data/projects';
import { getAllServices } from '@/lib/data/services';
import { getAllTestimonials } from '@/lib/data/testimonials';
import { getInquiries } from '@/lib/data/inquiries';
import { sampleFounders } from '@/data/founders';
import { sampleProjects } from '@/data/projects';
import { agencyServices } from '@/data/services';
import { sampleTestimonials } from '@/data/testimonials';
import { Button } from '@/components/ui/Button';

export const metadata: Metadata = {
  title: 'Studio Overview | Vixel Media Dashboard',
  description: 'Co-founder studio overview and operational control panel.',
};

export default async function DashboardOverviewPage() {
  const configured = isSupabaseConfigured();

  let founder = sampleFounders[0];
  let projects = sampleProjects.filter((p) => p.founderId === 'alex-vance');
  let servicesCount = agencyServices.length;
  let testimonialsCount = sampleTestimonials.length;
  let inquiries = [
    {
      id: 'demo-inq-1',
      name: 'Sarah Jenkins',
      email: 'sarah@aurorabrand.com',
      service: 'Cinematic Brand Reel',
      budget: '$5,000 - $10,000',
      status: 'new' as const,
      created_at: '2026-10-15T18:30:00Z',
    },
    {
      id: 'demo-inq-2',
      name: 'Michael Chang',
      email: 'm.chang@apexmedia.io',
      service: 'Long-Form YouTube Documentary',
      budget: '$10,000+',
      status: 'in_review' as const,
      created_at: '2026-10-14T14:15:00Z',
    },
    {
      id: 'demo-inq-3',
      name: 'Elena Rostova',
      email: 'elena@novawave.co',
      service: 'Performance Ad Creatives',
      budget: '$3,000 - $5,000',
      status: 'contacted' as const,
      created_at: '2026-10-13T09:45:00Z',
    },
  ];

  if (configured) {
    const supabase = await createClient();
    if (supabase) {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        const [dbProfile, dbProjects, dbServices, dbTestimonials, dbInquiries] =
          await Promise.all([
            getFounderProfileForUser(user.id),
            getFounderProjects(user.id),
            getAllServices(),
            getAllTestimonials(),
            getInquiries(),
          ]);

        if (dbProfile) {
          founder = {
            id: dbProfile.id,
            slug: dbProfile.slug,
            name: dbProfile.full_name,
            role: dbProfile.role,
            tagline: dbProfile.tagline,
            shortBio: dbProfile.bio,
            fullBio: typeof dbProfile.full_bio === 'string' ? [dbProfile.full_bio] : [],
            avatarUrl: dbProfile.avatar_url,
            coverUrl: dbProfile.cover_url,
            email: dbProfile.contact_email,
            location: dbProfile.location,
            yearsExperience: dbProfile.years_experience,
            socials: dbProfile.socials as unknown as typeof founder.socials,
            skills: (dbProfile.skills as unknown as typeof founder.skills) || [],
            tools: (dbProfile.tools as unknown as typeof founder.tools) || [],
            sampleClients: (dbProfile.clients as unknown as string[]) || [],
            experience: (dbProfile.experience as unknown as typeof founder.experience) || [],
            featuredProjectIds: (dbProfile.featured_project_ids as unknown as string[]) || [],
          };
        }

        if (dbProjects.length > 0) {
          projects = dbProjects.map((p) => ({
            id: p.id,
            slug: p.slug,
            title: p.title,
            client: p.client || '',
            category: p.category,
            categoryLabel: p.category_label || p.category,
            description: p.description || '',
            deliverables: [],
            duration: p.duration || '',
            aspectRatio: p.aspect_ratio || '16:9',
            thumbnailUrl: p.thumbnail_url,
            hasPlayableMedia: p.has_playable_media,
            featured: p.featured,
            founderId: p.owner_id,
            toolsUsed: [],
            year: p.year,
          }));
        }

        servicesCount = dbServices.length;
        testimonialsCount = dbTestimonials.length;
        if (dbInquiries.length > 0) {
          inquiries = dbInquiries.slice(0, 5).map((inq) => ({
            id: inq.id,
            name: inq.name,
            email: inq.email,
            service: inq.service || 'General Video Production',
            budget: inq.budget || 'Not specified',
            status: inq.status as 'new' | 'in_review' | 'contacted',
            created_at: inq.created_at,
          }));
        }
      }
    }
  }

  const newInquiriesCount = inquiries.filter((i) => i.status === 'new').length;

  return (
    <div className="space-y-8">
      {/* Studio Banner & Welcome */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#14141E] via-[#161622] to-[#12121A] border border-white/10 p-6 sm:p-8">
        <div className="absolute top-0 right-0 -mt-12 -mr-12 w-96 h-96 bg-violet-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-300 text-xs font-medium">
              <ShieldCheck className="w-3.5 h-3.5 text-violet-400" />
              <span>Co-Founder Studio Desk</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Welcome back, <span className="text-violet-400">{founder.name}</span>
            </h1>
            <p className="text-sm text-gray-400 max-w-xl leading-relaxed">
              Manage your personal portfolio, profile presentation, and collaborate on shared Vixel Media agency content and client leads.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link href="/dashboard/portfolio/new">
              <Button size="sm" className="gap-2 shadow-lg shadow-violet-900/30">
                <Plus className="w-4 h-4" />
                <span>New Project</span>
              </Button>
            </Link>
            <Link href={`/portfolio/${founder.slug}`} target="_blank">
              <Button variant="secondary" size="sm" className="gap-2">
                <ExternalLink className="w-4 h-4 text-violet-400" />
                <span>View Public Profile</span>
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Quick Metrics Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="p-5 rounded-2xl bg-[#14141B] border border-white/10 hover:border-violet-500/30 transition-all group">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-xl bg-violet-600/10 border border-violet-500/20 flex items-center justify-center text-violet-400 group-hover:scale-105 transition-transform">
              <Film className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-mono uppercase tracking-wider text-gray-500">Personal</span>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-white">
            {projects.length}
          </div>
          <div className="text-xs text-gray-400 mt-1 flex items-center justify-between">
            <span>Portfolio Projects</span>
            <Link href="/dashboard/portfolio" className="text-violet-400 hover:text-violet-300">
              Manage →
            </Link>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-[#14141B] border border-white/10 hover:border-violet-500/30 transition-all group">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 group-hover:scale-105 transition-transform">
              <Mail className="w-5 h-5" />
            </div>
            {newInquiriesCount > 0 && (
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-mono font-bold">
                {newInquiriesCount} New
              </span>
            )}
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-white">
            {inquiries.length}
          </div>
          <div className="text-xs text-gray-400 mt-1 flex items-center justify-between">
            <span>Client Inquiries</span>
            <Link href="/dashboard/inquiries" className="text-violet-400 hover:text-violet-300">
              Review →
            </Link>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-[#14141B] border border-white/10 hover:border-violet-500/30 transition-all group">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-xl bg-purple-600/10 border border-purple-500/20 flex items-center justify-center text-purple-400 group-hover:scale-105 transition-transform">
              <Layers className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-mono uppercase tracking-wider text-gray-500">Shared</span>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-white">
            {servicesCount}
          </div>
          <div className="text-xs text-gray-400 mt-1 flex items-center justify-between">
            <span>Agency Services</span>
            <Link href="/dashboard/services" className="text-violet-400 hover:text-violet-300">
              Edit →
            </Link>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-[#14141B] border border-white/10 hover:border-violet-500/30 transition-all group">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-xl bg-amber-600/10 border border-amber-500/20 flex items-center justify-center text-amber-400 group-hover:scale-105 transition-transform">
              <Sparkles className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-mono uppercase tracking-wider text-gray-500">Shared</span>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-white">
            {testimonialsCount}
          </div>
          <div className="text-xs text-gray-400 mt-1 flex items-center justify-between">
            <span>Client Reviews</span>
            <Link href="/dashboard/testimonials" className="text-violet-400 hover:text-violet-300">
              View →
            </Link>
          </div>
        </div>
      </div>

      {/* Main Split: Recent Projects & Inquiries */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: My Recent Projects */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-white">My Portfolio Works</h2>
              <p className="text-xs text-gray-400">
                Projects owned and attributed to your co-founder profile.
              </p>
            </div>
            <Link
              href="/dashboard/portfolio"
              className="text-xs text-violet-400 hover:text-violet-300 font-medium flex items-center gap-1"
            >
              <span>All Projects</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {projects.slice(0, 4).map((project) => (
              <div
                key={project.id}
                className="group p-4 rounded-2xl bg-[#14141B] border border-white/10 hover:border-violet-500/40 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="relative aspect-video rounded-xl overflow-hidden mb-3 bg-black">
                    <Image
                      src={project.thumbnailUrl}
                      alt={project.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-2 left-2">
                      <span className="px-2 py-0.5 rounded-full bg-black/70 backdrop-blur-md text-[10px] font-mono text-white capitalize">
                        {project.category}
                      </span>
                    </div>
                  </div>
                  <h3 className="text-sm font-bold text-white line-clamp-1 group-hover:text-violet-300 transition-colors">
                    {project.title}
                  </h3>
                  <p className="text-xs text-gray-400 line-clamp-2 mt-1">
                    {project.description}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-3 mt-3 border-t border-white/5">
                  <span className="text-[11px] text-gray-500 font-mono">
                    {project.client || 'Agency Spec'}
                  </span>
                  <Link
                    href={`/dashboard/portfolio/${project.id}/edit`}
                    className="text-xs text-violet-400 hover:text-white font-medium"
                  >
                    Edit →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right 1 Col: Recent Inquiries Desk */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-white">Recent Leads</h2>
              <p className="text-xs text-gray-400">Incoming inquiries from the site.</p>
            </div>
            <Link
              href="/dashboard/inquiries"
              className="text-xs text-violet-400 hover:text-violet-300 font-medium flex items-center gap-1"
            >
              <span>Desk</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-3">
            {inquiries.slice(0, 4).map((inquiry) => (
              <div
                key={inquiry.id}
                className="p-4 rounded-2xl bg-[#14141B] border border-white/10 hover:border-white/20 transition-all space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white truncate">
                    {inquiry.name}
                  </span>
                  <span
                    className={`text-[10px] font-mono px-2 py-0.5 rounded-full capitalize ${
                      inquiry.status === 'new'
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        : inquiry.status === 'in_review'
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                        : 'bg-white/10 text-gray-300'
                    }`}
                  >
                    {inquiry.status.replace('_', ' ')}
                  </span>
                </div>
                <div className="text-[11px] text-gray-400 truncate">
                  {inquiry.service}
                </div>
                <div className="flex items-center justify-between text-[10px] text-gray-500 font-mono pt-1 border-t border-white/5">
                  <span>{inquiry.budget}</span>
                  <span>{new Date(inquiry.created_at).toLocaleDateString()}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Quick Studio Links Card */}
          <div className="p-5 rounded-2xl bg-gradient-to-b from-[#181824] to-[#12121A] border border-white/10 space-y-3">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">
              Studio Quick Links
            </h3>
            <div className="space-y-1.5 text-xs">
              <Link
                href="/dashboard/profile"
                className="flex items-center justify-between p-2 rounded-xl hover:bg-white/5 text-gray-300 hover:text-white transition-colors"
              >
                <span className="flex items-center gap-2">
                  <User className="w-3.5 h-3.5 text-violet-400" />
                  <span>Update Profile & Skills</span>
                </span>
                <ChevronRight className="w-3.5 h-3.5 text-gray-500" />
              </Link>
              <Link
                href="/dashboard/website"
                className="flex items-center justify-between p-2 rounded-xl hover:bg-white/5 text-gray-300 hover:text-white transition-colors"
              >
                <span className="flex items-center gap-2">
                  <Globe className="w-3.5 h-3.5 text-violet-400" />
                  <span>Edit Shared Public Site</span>
                </span>
                <ChevronRight className="w-3.5 h-3.5 text-gray-500" />
              </Link>
              <Link
                href="/dashboard/settings"
                className="flex items-center justify-between p-2 rounded-xl hover:bg-white/5 text-gray-300 hover:text-white transition-colors"
              >
                <span className="flex items-center gap-2">
                  <Database className="w-3.5 h-3.5 text-violet-400" />
                  <span>Database & Storage Health</span>
                </span>
                <ChevronRight className="w-3.5 h-3.5 text-gray-500" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
