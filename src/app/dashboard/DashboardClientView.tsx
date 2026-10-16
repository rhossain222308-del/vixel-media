'use client';

import React, { useState, useTransition } from 'react';
import Link from 'next/link';
import { 
  User, 
  Film, 
  FileText, 
  Layers, 
  MessageSquare, 
  Mail, 
  Database, 
  LogOut, 
  Plus, 
  Trash2, 
  CheckCircle2, 
  AlertCircle, 
  Sparkles, 
  ExternalLink,
  ShieldAlert
} from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { logoutAction } from '@/lib/actions/auth';
import { updateFounderProfileAction } from '@/lib/actions/profile';
import { createProjectAction, deleteProjectAction } from '@/lib/actions/projects';
import { updateSiteContentAction } from '@/lib/actions/siteContent';
import { updateInquiryStatusAction } from '@/lib/actions/inquiries';
import type { 
  ProfileRow, 
  PortfolioProjectRow, 
  SiteContentRow, 
  ServiceRow, 
  TestimonialRow, 
  ContactInquiryRow 
} from '@/types/database.types';

interface DashboardClientViewProps {
  isConfigured: boolean;
  userEmail: string;
  userId: string;
  initialProfile: ProfileRow | null;
  initialProjects: PortfolioProjectRow[];
  initialSiteContent: SiteContentRow[];
  initialServices: ServiceRow[];
  initialTestimonials: TestimonialRow[];
  initialInquiries: ContactInquiryRow[];
}

type TabType = 
  | 'profile' 
  | 'portfolio' 
  | 'site-content' 
  | 'services' 
  | 'testimonials' 
  | 'inquiries' 
  | 'supabase-setup';

export function DashboardClientView({
  isConfigured,
  userEmail,
  userId,
  initialProfile,
  initialProjects,
  initialSiteContent,
  initialServices,
  initialTestimonials,
  initialInquiries,
}: DashboardClientViewProps) {
  const [activeTab, setActiveTab] = useState<TabType>('profile');
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [isPending, startTransition] = useTransition();

  // Local state for profile form
  const [profileForm, setProfileForm] = useState({
    fullName: initialProfile?.full_name || 'Alex Vance',
    role: initialProfile?.role || 'Co-Founder & Creative Director',
    tagline: initialProfile?.tagline || 'Architect of narrative pacing and cinematic video storytelling.',
    bio: initialProfile?.bio || '8+ years crafting cinematic brand documentaries and high-conversion films.',
    contactEmail: initialProfile?.contact_email || userEmail || 'alex@vixelmedia.demo',
    location: initialProfile?.location || 'Los Angeles / Remote',
    yearsExperience: initialProfile?.years_experience || 8,
    isPublished: initialProfile?.is_published ?? true,
  });

  // Local state for new project modal/form
  const [newProject, setNewProject] = useState({
    title: '',
    client: '',
    category: 'reels' as 'reels' | 'long-form' | 'ads' | 'motion-graphics',
    description: '',
    videoUrl: '',
    thumbnailUrl: '',
    platform: 'YouTube',
    duration: '',
    status: 'published' as 'draft' | 'published',
    featured: false,
  });
  const [showNewProjectModal, setShowNewProjectModal] = useState(false);

  // Local state for site content section editor
  const [selectedSectionKey, setSelectedSectionKey] = useState<string>('home_hero');
  const currentSection = initialSiteContent.find((s) => s.section_key === selectedSectionKey);
  const [sectionContentJson, setSectionContentJson] = useState<string>(
    currentSection ? JSON.stringify(currentSection.content, null, 2) : '{\n  "headline": "Creative That Converts."\n}'
  );
  const [sectionStatus, setSectionStatus] = useState<'draft' | 'published'>(
    currentSection?.status || 'published'
  );

  // Filter for inquiries
  const [inquiryStatusFilter, setInquiryStatusFilter] = useState<string>('all');
  const filteredInquiries = initialInquiries.filter((inq) => {
    if (inquiryStatusFilter === 'all') return true;
    return inq.status === inquiryStatusFilter;
  });

  const clearFeedback = () => setFeedback(null);

  // Profile submission handler
  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    clearFeedback();

    const data = new FormData();
    data.append('profileId', userId || 'demo-founder-1');
    data.append('fullName', profileForm.fullName);
    data.append('role', profileForm.role);
    data.append('tagline', profileForm.tagline);
    data.append('bio', profileForm.bio);
    data.append('contactEmail', profileForm.contactEmail);
    data.append('location', profileForm.location);
    data.append('yearsExperience', profileForm.yearsExperience.toString());
    data.append('isPublished', profileForm.isPublished ? 'true' : 'false');

    startTransition(async () => {
      const res = await updateFounderProfileAction(null, data);
      if (res.success) {
        setFeedback({ type: 'success', message: res.message || 'Profile saved successfully!' });
      } else {
        setFeedback({ type: 'error', message: res.error || 'Failed to update profile.' });
      }
    });
  };

  // Project creation handler
  const handleCreateProject = (e: React.FormEvent) => {
    e.preventDefault();
    clearFeedback();

    const data = new FormData();
    data.append('title', newProject.title);
    data.append('client', newProject.client);
    data.append('category', newProject.category);
    data.append('description', newProject.description);
    data.append('videoUrl', newProject.videoUrl);
    data.append('thumbnailUrl', newProject.thumbnailUrl);
    data.append('platform', newProject.platform);
    data.append('duration', newProject.duration);
    data.append('status', newProject.status);
    data.append('featured', newProject.featured ? 'true' : 'false');

    startTransition(async () => {
      const res = await createProjectAction(null, data);
      if (res.success) {
        setFeedback({ type: 'success', message: 'Project created successfully!' });
        setShowNewProjectModal(false);
        setNewProject({
          title: '',
          client: '',
          category: 'reels',
          description: '',
          videoUrl: '',
          thumbnailUrl: '',
          platform: 'YouTube',
          duration: '',
          status: 'published',
          featured: false,
        });
      } else {
        setFeedback({ type: 'error', message: res.error || 'Failed to create project.' });
      }
    });
  };

  // Project deletion handler
  const handleDeleteProject = (projectId: string) => {
    if (!confirm('Are you sure you want to delete this project?')) return;
    clearFeedback();

    startTransition(async () => {
      const res = await deleteProjectAction(projectId);
      if (res.success) {
        setFeedback({ type: 'success', message: 'Project removed successfully.' });
      } else {
        setFeedback({ type: 'error', message: res.error || 'Failed to delete project.' });
      }
    });
  };

  // Site content update handler
  const handleSaveSiteContent = (e: React.FormEvent) => {
    e.preventDefault();
    clearFeedback();

    const data = new FormData();
    data.append('sectionKey', selectedSectionKey);
    data.append('content', sectionContentJson);
    data.append('status', sectionStatus);

    startTransition(async () => {
      const res = await updateSiteContentAction(null, data);
      if (res.success) {
        setFeedback({ type: 'success', message: res.message || 'Section saved successfully!' });
      } else {
        setFeedback({ type: 'error', message: res.error || 'Failed to save section content.' });
      }
    });
  };

  // Inquiry status change handler
  const handleUpdateInquiryStatus = (id: string, status: 'new' | 'in_review' | 'contacted' | 'archived') => {
    clearFeedback();
    startTransition(async () => {
      const res = await updateInquiryStatusAction(id, status);
      if (res.success) {
        setFeedback({ type: 'success', message: res.message || 'Status updated.' });
      } else {
        setFeedback({ type: 'error', message: res.error || 'Failed to update status.' });
      }
    });
  };

  return (
    <div className="py-8 sm:py-12 md:py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Top Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-3xl bg-[#14141B] border border-white/10 shadow-2xl backdrop-blur-xl mb-8">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-violet-600 to-purple-500 flex items-center justify-center text-white shadow-lg shadow-violet-900/40">
            <Film className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-extrabold text-white">
                Co-Founder Studio Desk
              </h1>
              {isConfigured ? (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-950/60 border border-emerald-500/30 text-[10px] font-mono text-emerald-300">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Supabase Live
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-950/60 border border-amber-500/30 text-[10px] font-mono text-amber-300">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                  Offline Setup Mode
                </span>
              )}
            </div>
            <p className="text-xs text-gray-400 mt-0.5">
              Active Founder Session: <strong className="text-white">{userEmail || 'alex@vixelmedia.demo'}</strong>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/" target="_blank" className="text-xs text-gray-400 hover:text-white flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 transition-colors">
            <ExternalLink className="w-3.5 h-3.5" />
            <span>View Public Site</span>
          </Link>
          <form action={logoutAction}>
            <Button type="submit" variant="secondary" size="sm" icon={<LogOut className="w-3.5 h-3.5" />}>
              Sign Out
            </Button>
          </form>
        </div>
      </div>

      {/* Database Connection Alert Banner if not configured */}
      {!isConfigured && (
        <div className="mb-8 p-5 sm:p-6 rounded-3xl bg-amber-950/30 border border-amber-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <AlertCircle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <h3 className="text-sm font-bold text-amber-200">
                Supabase Credentials Not Configured in Environment
              </h3>
              <p className="text-xs text-amber-300/80 mt-1 max-w-2xl leading-relaxed">
                The application is running in staging preview mode with graceful fallbacks. To connect your live PostgreSQL database, copy <code className="bg-black/40 px-1.5 py-0.5 rounded text-white font-mono">.env.example</code> to <code className="bg-black/40 px-1.5 py-0.5 rounded text-white font-mono">.env.local</code> and input your Supabase project URL and anon key.
              </p>
            </div>
          </div>
          <button
            onClick={() => setActiveTab('supabase-setup')}
            className="shrink-0 px-4 py-2 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 text-xs font-semibold border border-amber-500/40 transition-colors cursor-pointer"
          >
            Open Setup Guide →
          </button>
        </div>
      )}

      {/* Toast Feedback Notification */}
      {feedback && (
        <div
          className={`mb-6 p-4 rounded-2xl flex items-center justify-between gap-3 text-xs ${
            feedback.type === 'success'
              ? 'bg-emerald-950/60 border border-emerald-500/40 text-emerald-200'
              : 'bg-red-950/60 border border-red-500/40 text-red-200'
          }`}
        >
          <div className="flex items-center gap-2">
            {feedback.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
            )}
            <span>{feedback.message}</span>
          </div>
          <button onClick={clearFeedback} className="text-gray-400 hover:text-white text-sm font-bold">
            ×
          </button>
        </div>
      )}

      {/* Studio Navigation Tabs */}
      <div className="flex flex-wrap items-center gap-2 p-1.5 rounded-2xl bg-[#14141B] border border-white/10 mb-8 overflow-x-auto">
        <button
          onClick={() => setActiveTab('profile')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
            activeTab === 'profile'
              ? 'bg-violet-600 text-white shadow-lg shadow-violet-900/40'
              : 'text-gray-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <User className="w-3.5 h-3.5" />
          <span>My Profile (Personal)</span>
        </button>

        <button
          onClick={() => setActiveTab('portfolio')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
            activeTab === 'portfolio'
              ? 'bg-violet-600 text-white shadow-lg shadow-violet-900/40'
              : 'text-gray-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <Film className="w-3.5 h-3.5" />
          <span>My Portfolio Projects</span>
        </button>

        <button
          onClick={() => setActiveTab('site-content')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
            activeTab === 'site-content'
              ? 'bg-violet-600 text-white shadow-lg shadow-violet-900/40'
              : 'text-gray-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          <span>Shared Agency CMS</span>
        </button>

        <button
          onClick={() => setActiveTab('services')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
            activeTab === 'services'
              ? 'bg-violet-600 text-white shadow-lg shadow-violet-900/40'
              : 'text-gray-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>Shared Services ({initialServices.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('testimonials')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
            activeTab === 'testimonials'
              ? 'bg-violet-600 text-white shadow-lg shadow-violet-900/40'
              : 'text-gray-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <MessageSquare className="w-3.5 h-3.5" />
          <span>Testimonials ({initialTestimonials.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('inquiries')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
            activeTab === 'inquiries'
              ? 'bg-violet-600 text-white shadow-lg shadow-violet-900/40'
              : 'text-gray-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <Mail className="w-3.5 h-3.5" />
          <span>Inquiries Desk ({initialInquiries.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('supabase-setup')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
            activeTab === 'supabase-setup'
              ? 'bg-violet-600 text-white shadow-lg shadow-violet-900/40'
              : 'text-gray-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <Database className="w-3.5 h-3.5" />
          <span>Setup & Security Docs</span>
        </button>
      </div>

      {/* =========================================================================
          TAB 1: MY PROFILE (PERSONAL) - ENFORCES RULE A
         ========================================================================= */}
      {activeTab === 'profile' && (
        <div className="space-y-6">
          <div className="p-4 rounded-2xl bg-violet-950/40 border border-violet-500/20 flex items-start gap-3">
            <ShieldAlert className="w-4 h-4 text-violet-400 mt-0.5 shrink-0" />
            <div className="text-xs text-gray-300 leading-relaxed">
              <strong className="text-white">Rule A Enforced:</strong> Under PostgreSQL Row Level Security and server authorization, you are strictly editing your own co-founder profile. Cross-founder modifications are completely blocked.
            </div>
          </div>

          <form onSubmit={handleProfileSubmit} className="p-6 sm:p-10 rounded-3xl bg-[#14141B] border border-white/10 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
              <div>
                <h2 className="text-xl font-bold text-white">Edit Personal Founder Profile</h2>
                <p className="text-xs text-gray-400 mt-0.5">Manage your credentials, bio, and public portfolio status.</p>
              </div>

              {/* Public Publishing Status Toggle */}
              <div className="flex items-center gap-3">
                <span className="text-xs text-gray-300">Public Status:</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={profileForm.isPublished}
                    onChange={(e) => setProfileForm({ ...profileForm, isPublished: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                  <span className="ml-2 text-xs font-semibold text-white">
                    {profileForm.isPublished ? 'Live & Published' : 'Draft / Unpublished'}
                  </span>
                </label>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={profileForm.fullName}
                  onChange={(e) => setProfileForm({ ...profileForm, fullName: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-[#0F0F14] border border-white/10 text-white text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/50"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-2">
                  Role / Specialization
                </label>
                <input
                  type="text"
                  required
                  value={profileForm.role}
                  onChange={(e) => setProfileForm({ ...profileForm, role: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-[#0F0F14] border border-white/10 text-white text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/50"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-2">
                  Creative Tagline
                </label>
                <input
                  type="text"
                  value={profileForm.tagline}
                  onChange={(e) => setProfileForm({ ...profileForm, tagline: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-[#0F0F14] border border-white/10 text-white text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/50"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-2">
                  Short Biography
                </label>
                <textarea
                  rows={3}
                  value={profileForm.bio}
                  onChange={(e) => setProfileForm({ ...profileForm, bio: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-[#0F0F14] border border-white/10 text-white text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/50"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-2">
                  Contact Email
                </label>
                <input
                  type="email"
                  value={profileForm.contactEmail}
                  onChange={(e) => setProfileForm({ ...profileForm, contactEmail: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-[#0F0F14] border border-white/10 text-white text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/50"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-2">
                  Studio Location
                </label>
                <input
                  type="text"
                  value={profileForm.location}
                  onChange={(e) => setProfileForm({ ...profileForm, location: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-[#0F0F14] border border-white/10 text-white text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/50"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-2">
                  Years of Industry Experience
                </label>
                <input
                  type="number"
                  min={0}
                  value={profileForm.yearsExperience}
                  onChange={(e) => setProfileForm({ ...profileForm, yearsExperience: parseInt(e.target.value, 10) || 0 })}
                  className="w-full px-4 py-3 rounded-xl bg-[#0F0F14] border border-white/10 text-white text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/50"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-white/10 flex justify-end">
              <Button type="submit" variant="primary" size="md" disabled={isPending}>
                {isPending ? 'Saving Profile...' : 'Save Profile Changes'}
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* =========================================================================
          TAB 2: MY PORTFOLIO PROJECTS - ENFORCES RULE B
         ========================================================================= */}
      {activeTab === 'portfolio' && (
        <div className="space-y-6">
          <div className="p-4 rounded-2xl bg-violet-950/40 border border-violet-500/20 flex items-start gap-3">
            <ShieldAlert className="w-4 h-4 text-violet-400 mt-0.5 shrink-0" />
            <div className="text-xs text-gray-300 leading-relaxed">
              <strong className="text-white">Rule B Enforced:</strong> Projects are scoped strictly to your authenticated founder account (`owner_id = auth.uid()`). Founders cannot modify or reassign another founder&apos;s projects.
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-white">My Personal Portfolio Projects</h2>
              <p className="text-xs text-gray-400">Total Projects: {initialProjects.length}</p>
            </div>

            <Button
              variant="primary"
              size="sm"
              icon={<Plus className="w-4 h-4" />}
              onClick={() => setShowNewProjectModal(true)}
            >
              Add New Project
            </Button>
          </div>

          {/* New Project Modal / Form */}
          {showNewProjectModal && (
            <form onSubmit={handleCreateProject} className="p-6 sm:p-8 rounded-3xl bg-[#181824] border border-violet-500/40 shadow-2xl space-y-5 animate-in fade-in duration-200">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-violet-400" />
                  <span>Create New Portfolio Project</span>
                </h3>
                <button
                  type="button"
                  onClick={() => setShowNewProjectModal(false)}
                  className="text-gray-400 hover:text-white text-lg font-bold"
                >
                  ×
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1.5">Project Title *</label>
                  <input
                    type="text"
                    required
                    value={newProject.title}
                    onChange={(e) => setNewProject({ ...newProject, title: e.target.value })}
                    placeholder="e.g. Lumina Cinematic Anthem"
                    className="w-full px-4 py-2.5 rounded-xl bg-[#0F0F14] border border-white/10 text-white text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1.5">Category *</label>
                  <select
                    value={newProject.category}
                    onChange={(e) =>
                      setNewProject({
                        ...newProject,
                        category: e.target.value as 'reels' | 'long-form' | 'ads' | 'motion-graphics',
                      })
                    }
                    className="w-full px-4 py-2.5 rounded-xl bg-[#0F0F14] border border-white/10 text-white text-sm"
                  >
                    <option value="reels">Reels & Shorts (9:16)</option>
                    <option value="long-form">Long-form & Documentary</option>
                    <option value="ads">Commercial Ads</option>
                    <option value="motion-graphics">Motion Graphics & 3D Maps</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1.5">Client Name</label>
                  <input
                    type="text"
                    value={newProject.client}
                    onChange={(e) => setNewProject({ ...newProject, client: e.target.value })}
                    placeholder="e.g. Tech Brand Alpha"
                    className="w-full px-4 py-2.5 rounded-xl bg-[#0F0F14] border border-white/10 text-white text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1.5">Video URL (Embed/MP4)</label>
                  <input
                    type="url"
                    value={newProject.videoUrl}
                    onChange={(e) => setNewProject({ ...newProject, videoUrl: e.target.value })}
                    placeholder="https://commondatastorage.googleapis.com/.../sample.mp4"
                    className="w-full px-4 py-2.5 rounded-xl bg-[#0F0F14] border border-white/10 text-white text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1.5">Thumbnail Image URL</label>
                  <input
                    type="url"
                    value={newProject.thumbnailUrl}
                    onChange={(e) => setNewProject({ ...newProject, thumbnailUrl: e.target.value })}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full px-4 py-2.5 rounded-xl bg-[#0F0F14] border border-white/10 text-white text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1.5">Duration</label>
                  <input
                    type="text"
                    value={newProject.duration}
                    onChange={(e) => setNewProject({ ...newProject, duration: e.target.value })}
                    placeholder="e.g. 02:45 or 0:45"
                    className="w-full px-4 py-2.5 rounded-xl bg-[#0F0F14] border border-white/10 text-white text-sm"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-gray-300 mb-1.5">Project Description</label>
                  <textarea
                    rows={2}
                    value={newProject.description}
                    onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#0F0F14] border border-white/10 text-white text-sm"
                  />
                </div>

                <div className="flex items-center gap-6 sm:col-span-2">
                  <label className="flex items-center gap-2 text-xs text-white cursor-pointer">
                    <input
                      type="checkbox"
                      checked={newProject.status === 'published'}
                      onChange={(e) => setNewProject({ ...newProject, status: e.target.checked ? 'published' : 'draft' })}
                      className="rounded bg-black border-white/20 text-violet-600"
                    />
                    <span>Publish Immediately (Make public)</span>
                  </label>

                  <label className="flex items-center gap-2 text-xs text-white cursor-pointer">
                    <input
                      type="checkbox"
                      checked={newProject.featured}
                      onChange={(e) => setNewProject({ ...newProject, featured: e.target.checked })}
                      className="rounded bg-black border-white/20 text-violet-600"
                    />
                    <span>Feature on Agency Homepage</span>
                  </label>
                </div>
              </div>

              <div className="pt-3 flex justify-end gap-3">
                <Button type="button" variant="secondary" size="sm" onClick={() => setShowNewProjectModal(false)}>
                  Cancel
                </Button>
                <Button type="submit" variant="primary" size="sm" disabled={isPending}>
                  {isPending ? 'Saving...' : 'Create Project'}
                </Button>
              </div>
            </form>
          )}

          {/* Projects Table / List */}
          <div className="rounded-3xl bg-[#14141B] border border-white/10 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-white/5 border-b border-white/10 text-gray-400 uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="px-6 py-4">Title & Client</th>
                    <th className="px-6 py-4">Category</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4">Featured</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {initialProjects.map((project) => (
                    <tr key={project.id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-semibold text-white">{project.title}</div>
                        <div className="text-[11px] text-gray-400">{project.client || 'Agency Spec / Independent'}</div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="capitalize px-2.5 py-1 rounded-md bg-white/5 text-gray-300">
                          {project.category}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {project.status === 'published' ? (
                          <span className="inline-flex items-center gap-1 text-emerald-400 font-semibold">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                            Published
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-amber-400 font-semibold">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                            Draft
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        {project.featured ? (
                          <span className="text-violet-400 font-medium">★ Yes</span>
                        ) : (
                          <span className="text-gray-500">No</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => handleDeleteProject(project.id)}
                          className="p-1.5 rounded-lg text-red-400 hover:text-red-300 hover:bg-red-950/40 transition-colors"
                          title="Delete Project"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {initialProjects.length === 0 && (
                    <tr>
                      <td colSpan={5} className="px-6 py-12 text-center text-gray-400">
                        No projects created yet. Click &apos;Add New Project&apos; to add your first work!
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 3: SHARED AGENCY CMS (SITE CONTENT) - ENFORCES RULE C
         ========================================================================= */}
      {activeTab === 'site-content' && (
        <div className="space-y-6">
          <div className="p-4 rounded-2xl bg-violet-950/40 border border-violet-500/20 flex items-start gap-3">
            <ShieldAlert className="w-4 h-4 text-violet-400 mt-0.5 shrink-0" />
            <div className="text-xs text-gray-300 leading-relaxed">
              <strong className="text-white">Rule C Enforced:</strong> Both co-founders share collaborative write access to shared website content (`site_content`). Public visitors see only published sections.
            </div>
          </div>

          <form onSubmit={handleSaveSiteContent} className="p-6 sm:p-10 rounded-3xl bg-[#14141B] border border-white/10 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
              <div>
                <h2 className="text-xl font-bold text-white">Agency Shared Content CMS</h2>
                <p className="text-xs text-gray-400 mt-0.5">Edit homepage hero copy, about story, agency settings, and pricing SLA.</p>
              </div>

              {/* Status Toggle */}
              <div className="flex items-center gap-3">
                <span className="text-xs text-gray-300">Section Status:</span>
                <select
                  value={sectionStatus}
                  onChange={(e) => setSectionStatus(e.target.value as 'draft' | 'published')}
                  className="px-3 py-1.5 rounded-xl bg-[#0F0F14] border border-white/10 text-white text-xs"
                >
                  <option value="published">Published (Public)</option>
                  <option value="draft">Draft (Private)</option>
                </select>
              </div>
            </div>

            {/* Section Selector */}
            <div>
              <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-2">
                Select Section
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
                {[
                  { key: 'home_hero', label: 'Home Hero' },
                  { key: 'about_story', label: 'About Story' },
                  { key: 'agency_settings', label: 'Agency Settings' },
                  { key: 'pricing_tiers', label: 'Pricing Tiers' },
                  { key: 'footer_info', label: 'Footer Info' },
                ].map((s) => (
                  <button
                    key={s.key}
                    type="button"
                    onClick={() => {
                      setSelectedSectionKey(s.key);
                      const sec = initialSiteContent.find((item) => item.section_key === s.key);
                      if (sec) {
                        setSectionContentJson(JSON.stringify(sec.content, null, 2));
                        setSectionStatus(sec.status);
                      }
                    }}
                    className={`p-3 rounded-xl text-xs font-semibold text-center border transition-all cursor-pointer ${
                      selectedSectionKey === s.key
                        ? 'bg-violet-600/30 border-violet-500 text-white'
                        : 'bg-white/5 border-white/5 text-gray-400 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>

            {/* JSON Content Editor */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider">
                  Section Content (Validated JSON)
                </label>
                <span className="text-[10px] text-gray-500 font-mono">JSONB Schema</span>
              </div>
              <textarea
                rows={12}
                value={sectionContentJson}
                onChange={(e) => setSectionContentJson(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-[#0A0A0E] border border-white/10 text-violet-200 font-mono text-xs leading-relaxed focus:outline-none focus:ring-2 focus:ring-violet-500/50"
              />
            </div>

            <div className="pt-4 border-t border-white/10 flex justify-end">
              <Button type="submit" variant="primary" size="md" disabled={isPending}>
                {isPending ? 'Saving Section...' : 'Save Section Content'}
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* =========================================================================
          TAB 4: SHARED SERVICES - ENFORCES RULE C
         ========================================================================= */}
      {activeTab === 'services' && (
        <div className="space-y-6">
          <div className="p-4 rounded-2xl bg-violet-950/40 border border-violet-500/20 flex items-start gap-3">
            <ShieldAlert className="w-4 h-4 text-violet-400 mt-0.5 shrink-0" />
            <div className="text-xs text-gray-300 leading-relaxed">
              <strong className="text-white">Rule C Enforced:</strong> Shared services are co-managed by both founders. Published services are displayed publicly on <code className="text-violet-300">/services</code>.
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {initialServices.map((service) => (
              <div key={service.id} className="p-6 rounded-3xl bg-[#14141B] border border-white/10 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant="purple" size="sm">{service.badge || 'Service'}</Badge>
                    <span className="text-[11px] font-mono text-gray-400">{service.turnaround_time}</span>
                  </div>
                  <h3 className="text-lg font-bold text-white">{service.title}</h3>
                  <p className="text-xs text-gray-300 mt-2 line-clamp-3 leading-relaxed">
                    {service.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between text-xs">
                  <span className={service.is_published ? 'text-emerald-400 font-medium' : 'text-amber-400 font-medium'}>
                    {service.is_published ? '● Live on Services Page' : '○ Draft Only'}
                  </span>
                  <Link href={`/services#${service.slug}`} target="_blank" className="text-violet-400 hover:text-violet-300 flex items-center gap-1">
                    <span>Preview</span>
                    <ExternalLink className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 5: SHARED TESTIMONIALS - ENFORCES RULE C
         ========================================================================= */}
      {activeTab === 'testimonials' && (
        <div className="space-y-6">
          <div className="p-4 rounded-2xl bg-violet-950/40 border border-violet-500/20 flex items-start gap-3">
            <ShieldAlert className="w-4 h-4 text-violet-400 mt-0.5 shrink-0" />
            <div className="text-xs text-gray-300 leading-relaxed">
              <strong className="text-white">Rule C Enforced:</strong> Client testimonials are collaboratively managed by both founders and public queries filter out unpublished entries.
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {initialTestimonials.map((item) => (
              <div key={item.id} className="p-6 rounded-3xl bg-[#14141B] border border-white/10 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="text-amber-400 text-sm">{'★'.repeat(item.rating || 5)}</div>
                    <span className="text-[10px] font-mono text-gray-400">{item.project_category}</span>
                  </div>
                  <p className="text-xs text-gray-300 italic mb-4 leading-relaxed">&ldquo;{item.quote}&rdquo;</p>
                  <div className="font-semibold text-white text-xs">{item.client_name}</div>
                  <div className="text-[11px] text-gray-400">{item.role ? `${item.role}, ` : ''}{item.company}</div>
                </div>

                <div className="mt-4 pt-4 border-t border-white/5 flex items-center justify-between text-xs">
                  <span className="text-violet-400 font-mono text-[11px]">{item.metrics_result || 'Impact Verified'}</span>
                  <span className={item.is_published ? 'text-emerald-400' : 'text-gray-500'}>
                    {item.is_published ? 'Published' : 'Hidden'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 6: CLIENT INQUIRIES DESK - ENFORCES RULE D
         ========================================================================= */}
      {activeTab === 'inquiries' && (
        <div className="space-y-6">
          <div className="p-4 rounded-2xl bg-violet-950/40 border border-violet-500/20 flex items-start gap-3">
            <ShieldAlert className="w-4 h-4 text-violet-400 mt-0.5 shrink-0" />
            <div className="text-xs text-gray-300 leading-relaxed">
              <strong className="text-white">Rule D Enforced:</strong> Inquiries submitted via `/contact` are strictly private. Anonymous visitors have 0 read permissions in PostgreSQL. Only authenticated co-founders can inspect and update client leads.
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-white">Client Inquiry Leads Pipeline</h2>
              <p className="text-xs text-gray-400">Incoming inquiries from website visitors.</p>
            </div>

            {/* Filter buttons */}
            <div className="flex items-center gap-1.5 p-1 rounded-xl bg-[#14141B] border border-white/10 text-xs">
              {['all', 'new', 'in_review', 'contacted', 'archived'].map((status) => (
                <button
                  key={status}
                  onClick={() => setInquiryStatusFilter(status)}
                  className={`px-3 py-1.5 rounded-lg capitalize transition-colors cursor-pointer ${
                    inquiryStatusFilter === status
                      ? 'bg-violet-600 text-white font-semibold'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>

          {/* Inquiries List */}
          <div className="space-y-4">
            {filteredInquiries.map((inq) => (
              <div key={inq.id} className="p-6 rounded-3xl bg-[#14141B] border border-white/10 hover:border-violet-500/30 transition-all space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/5 pb-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-bold text-white">{inq.name}</h3>
                      {inq.company && <span className="text-xs text-gray-400">({inq.company})</span>}
                    </div>
                    <a href={`mailto:${inq.email}`} className="text-xs text-violet-400 hover:underline">
                      {inq.email}
                    </a>
                  </div>

                  <div className="flex items-center gap-3">
                    {/* Status updater dropdown */}
                    <select
                      value={inq.status}
                      onChange={(e) =>
                        handleUpdateInquiryStatus(
                          inq.id,
                          e.target.value as 'new' | 'in_review' | 'contacted' | 'archived'
                        )
                      }
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold border ${
                        inq.status === 'new'
                          ? 'bg-emerald-950/50 border-emerald-500/40 text-emerald-300'
                          : inq.status === 'in_review'
                          ? 'bg-blue-950/50 border-blue-500/40 text-blue-300'
                          : inq.status === 'contacted'
                          ? 'bg-purple-950/50 border-purple-500/40 text-purple-300'
                          : 'bg-gray-800 border-gray-600 text-gray-400'
                      }`}
                    >
                      <option value="new">New Inquiry</option>
                      <option value="in_review">In Review</option>
                      <option value="contacted">Contacted</option>
                      <option value="archived">Archived</option>
                    </select>

                    <span className="text-[11px] text-gray-500 font-mono">
                      {new Date(inq.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div className="p-3 rounded-xl bg-white/5">
                    <span className="text-[10px] uppercase text-gray-400 block font-mono">Service</span>
                    <span className="text-white font-medium">{inq.service}</span>
                  </div>
                  <div className="p-3 rounded-xl bg-white/5">
                    <span className="text-[10px] uppercase text-gray-400 block font-mono">Budget</span>
                    <span className="text-white font-medium">{inq.budget || 'Not specified'}</span>
                  </div>
                  <div className="p-3 rounded-xl bg-white/5">
                    <span className="text-[10px] uppercase text-gray-400 block font-mono">Timeline</span>
                    <span className="text-white font-medium">{inq.timeline || 'Flexible'}</span>
                  </div>
                  <div className="p-3 rounded-xl bg-white/5">
                    <span className="text-[10px] uppercase text-gray-400 block font-mono">Founder Pref</span>
                    <span className="text-white font-medium">{inq.founder_preference || 'Either Lead'}</span>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-[#0B0B0E] border border-white/5 text-xs text-gray-300 leading-relaxed">
                  <span className="text-[10px] uppercase text-gray-500 block font-mono mb-1">Project Scope:</span>
                  {inq.message}
                </div>
              </div>
            ))}

            {filteredInquiries.length === 0 && (
              <div className="p-12 text-center rounded-3xl bg-[#14141B] border border-white/10 text-gray-400 text-xs">
                No inquiries matching status filter &apos;{inquiryStatusFilter}&apos;.
              </div>
            )}
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 7: SUPABASE SETUP & SECURITY DOCUMENTATION
         ========================================================================= */}
      {activeTab === 'supabase-setup' && (
        <div className="p-6 sm:p-10 rounded-3xl bg-[#14141B] border border-white/10 space-y-8">
          <div>
            <Badge variant="purple" className="mb-2">Backend Architecture</Badge>
            <h2 className="text-2xl font-bold text-white">Supabase PostgreSQL & Security Setup Guide</h2>
            <p className="text-xs text-gray-400 mt-1">
              Instructions for configuring production Supabase credentials, migrations, storage buckets, and founder accounts.
            </p>
          </div>

          {/* Step 1: Environment Variables */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-violet-600 text-white text-[11px] flex items-center justify-center font-mono">1</span>
              <span>Configure Environment Variables</span>
            </h3>
            <p className="text-xs text-gray-300 leading-relaxed">
              Copy <code className="bg-black/40 px-1.5 py-0.5 rounded text-white font-mono">.env.example</code> to <code className="bg-black/40 px-1.5 py-0.5 rounded text-white font-mono">.env.local</code>. Never commit <code className="bg-black/40 px-1.5 py-0.5 rounded text-white font-mono">.env.local</code> to source control.
            </p>
            <div className="p-4 rounded-2xl bg-black/60 border border-white/10 text-xs font-mono text-gray-300 space-y-1">
              <div>NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co</div>
              <div>NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here</div>
              <div>SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-do-not-expose-to-browser</div>
            </div>
          </div>

          {/* Step 2: Running Migrations */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-violet-600 text-white text-[11px] flex items-center justify-center font-mono">2</span>
              <span>Execute Database Migrations</span>
            </h3>
            <p className="text-xs text-gray-300 leading-relaxed">
              In your Supabase Dashboard SQL Editor, run the three migration files located in <code className="bg-black/40 px-1.5 py-0.5 rounded text-white font-mono">supabase/migrations/</code>:
            </p>
            <ul className="text-xs text-gray-300 space-y-2 list-disc pl-5">
              <li><strong className="text-white">20261016000001_initial_schema.sql</strong>: Creates <code className="text-violet-300">profiles</code>, <code className="text-violet-300">portfolio_projects</code>, <code className="text-violet-300">site_content</code>, <code className="text-violet-300">services</code>, <code className="text-violet-300">testimonials</code>, <code className="text-violet-300">contact_inquiries</code> with triggers & indexes.</li>
              <li><strong className="text-white">20261016000002_rls_policies.sql</strong>: Enforces strict Row Level Security (RLS) policies for Rules A, B, C, D.</li>
              <li><strong className="text-white">20261016000003_storage_buckets.sql</strong>: Sets up <code className="text-violet-300">avatars</code>, <code className="text-violet-300">portfolio</code>, <code className="text-violet-300">agency-assets</code>, and <code className="text-violet-300">services</code> storage buckets with isolation policies.</li>
            </ul>
          </div>

          {/* Step 3: Disable Self Registration & Create Founders */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-violet-600 text-white text-[11px] flex items-center justify-center font-mono">3</span>
              <span>Disable Public Self-Registration & Provision Founders</span>
            </h3>
            <p className="text-xs text-gray-300 leading-relaxed">
              In Supabase Dashboard → <strong className="text-white">Authentication → Providers → Email</strong>, uncheck <strong className="text-white">&ldquo;Enable Sign-ups&rdquo;</strong> to prevent public accounts. Then go to <strong className="text-white">Authentication → Users → Add User</strong> to invite the two co-founders:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-white/5 border border-white/5 text-xs space-y-1">
                <div className="font-bold text-white">Co-Founder 1: Alex Vance</div>
                <div className="text-gray-400">Role: Creative Director / Lead Editor</div>
                <div className="text-violet-300 font-mono">alex@vixelmedia.demo</div>
              </div>
              <div className="p-4 rounded-xl bg-white/5 border border-white/5 text-xs space-y-1">
                <div className="font-bold text-white">Co-Founder 2: Marcus Chen</div>
                <div className="text-gray-400">Role: Head of Motion Design & VFX</div>
                <div className="text-violet-300 font-mono">marcus@vixelmedia.demo</div>
              </div>
            </div>
          </div>

          {/* Step 4: Link Profiles */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-violet-600 text-white text-[11px] flex items-center justify-center font-mono">4</span>
              <span>Seed Initial CMS & Link Profiles</span>
            </h3>
            <p className="text-xs text-gray-300 leading-relaxed">
              Run <code className="bg-black/40 px-1.5 py-0.5 rounded text-white font-mono">supabase/seed.sql</code> in the SQL editor. Paste the generated founder user UUIDs into the template at the bottom of the seed script to link their profile records.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
