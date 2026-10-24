'use client';

import React, { useState, useTransition } from 'react';
import Link from 'next/link';
import { 
  Save, 
  UploadCloud, 
  CheckCircle2, 
  AlertCircle, 
  RotateCcw, 
  History, 
  ExternalLink,
  Sparkles,
  Layers,
  Building,
  DollarSign,
  Phone,
  Film,
  Trash2
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { 
  saveSiteContentDraftAction, 
  publishSiteContentAction, 
  revertSiteContentDraftAction,
  rollbackToRevisionAction
} from '@/lib/actions/siteContent';
import type { SiteContentRow, SiteContentRevisionRow } from '@/types/database.types';

interface WebsiteCmsClientProps {
  initialContent: SiteContentRow[];
  revisions: Record<string, SiteContentRevisionRow[]>;
  userId?: string;
}

type SectionKey = 
  | 'hero' 
  | 'trusted_by' 
  | 'why_vixel' 
  | 'story_vision' 
  | 'pricing' 
  | 'contact_footer';

export function WebsiteCmsClient({
  initialContent,
  revisions,
}: WebsiteCmsClientProps) {
  const [activeSection, setActiveSection] = useState<SectionKey>('hero');
  const [isPending, startTransition] = useTransition();
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [historySection, setHistorySection] = useState<SectionKey>('hero');
  const [changeSummary, setChangeSummary] = useState('');

  // Extract initial section data helper
  const getSectionData = (key: string, fallback: Record<string, unknown>) => {
    const row = initialContent.find((item) => item.section_key === key);
    if (!row) return { live: fallback, draft: fallback, status: 'published' };
    const live = (row.content as Record<string, unknown>) || fallback;
    const draft = (row.draft_content as Record<string, unknown>) || live;
    return { live, draft, status: row.status };
  };

  // Section 1: Hero Form State
  const initialHero = getSectionData('hero', {
    badge: 'Elite Video Production & Post-Production Studio',
    title: 'We craft high-retention video narratives for visionary brands.',
    subtitle: 'From cinematic YouTube series and viral short-form reels to commercial ad spots, our co-founders engineer video that converts.',
    primaryCtaLabel: 'Book a Production Call',
    primaryCtaLink: '/contact',
    secondaryCtaLabel: 'Explore Agency Work',
    secondaryCtaLink: '/work',
    videoReelUrl: 'https://vimeo.com/76979871',
    wordmark: 'VIXEL MEDIA',
    brandTagline: 'Cinema-grade pacing. Unmatched retention.',
  });
  const [heroForm, setHeroForm] = useState(initialHero.draft);
  const [heroStatus, setHeroStatus] = useState(initialHero.status);

  // Section 2: Trusted By Form State
  const initialTrusted = getSectionData('trusted_by', {
    heading: 'Trusted by High-Growth Creators & Industry Leaders',
    clients: ['Apex Motors', 'Red Bull', 'Nike Training', 'Sony Music', 'NovaWave Audio'],
    metricHighlight: '450M+ Organic Views Generated',
  });
  const [trustedForm, setTrustedForm] = useState(initialTrusted.draft);
  const [newClientName, setNewClientName] = useState('');
  const [trustedStatus, setTrustedStatus] = useState(initialTrusted.status);

  // Section 3: Why Vixel Form State
  const initialWhy = getSectionData('why_vixel', {
    badge: 'The Vixel Standard',
    headline: 'Why Leading Creators & Brands Choose Us',
    description: 'We combine Hollywood narrative depth with algorithmic pacing engineered for maximum watch time.',
    pillars: [
      {
        title: 'Story Architecture First',
        desc: 'Every cut, pause, and sound cue is tuned to psychological retention curves.',
      },
      {
        title: 'Co-Founder Direct Involvement',
        desc: 'You work directly with Alex Vance or Marcus Chen. Zero junior handoffs.',
      },
      {
        title: 'Color Grading & Sound Precision',
        desc: 'Hollywood-standard DaVinci Resolve grading and multi-layer soundscapes.',
      },
      {
        title: 'Speed Without Compromise',
        desc: '48-72h turnaround on short-form assets with predictable release cadence.',
      },
    ],
  });
  const [whyForm, setWhyForm] = useState(initialWhy.draft);
  const [whyStatus, setWhyStatus] = useState(initialWhy.status);

  // Section 4: Story & Vision Form State
  const initialStory = getSectionData('story_vision', {
    storyTitle: 'Crafted from a Passion for Modern Cinema',
    storyBody: 'Founded by Alex Vance and Marcus Chen, Vixel Media emerged from a desire to bridge high-end commercial cinematography with rapid-fire digital retention.',
    mission: 'To empower ambitious creators and brands with cinematic video that commands attention in a distracted world.',
    vision: 'Building the most respected boutique post-production studio in the digital age.',
  });
  const [storyForm, setStoryForm] = useState(initialStory.draft);
  const [storyStatus, setStoryStatus] = useState(initialStory.status);

  // Section 5: Pricing Form State
  const initialPricing = getSectionData('pricing', {
    headline: 'Transparent Investment, Uncompromising Quality',
    subheadline: 'Predictable retainers and bespoke project packaging for serious creators and enterprise brands.',
    guarantee: '100% Satisfaction Guarantee: Unlimited collaborative revisions until the final render is flawless.',
    turnaroundNotice: 'Standard 48-72 hour delivery on weekly sprint packages.',
    ctaLabel: 'Request Studio Rate Card',
  });
  const [pricingForm, setPricingForm] = useState(initialPricing.draft);
  const [pricingStatus, setPricingStatus] = useState(initialPricing.status);

  // Section 6: Contact & Footer Form State
  const initialContact = getSectionData('contact_footer', {
    email: 'contact@vixelmedia.com',
    whatsapp: '+1 (555) 234-5678',
    location: 'Los Angeles, California / Worldwide Remote',
    instagram: 'https://instagram.com/vixelmedia',
    youtube: 'https://youtube.com/@vixelmedia',
    linkedin: 'https://linkedin.com/company/vixelmedia',
    twitter: 'https://twitter.com/vixelmedia',
    footerCopyright: '© 2026 Vixel Media Studio LLC. All rights reserved.',
  });
  const [contactForm, setContactForm] = useState(initialContact.draft);
  const [contactStatus, setContactStatus] = useState(initialContact.status);

  // Helper to get active form data
  const getCurrentFormData = () => {
    switch (activeSection) {
      case 'hero': return { data: heroForm, setStatus: setHeroStatus };
      case 'trusted_by': return { data: trustedForm, setStatus: setTrustedStatus };
      case 'why_vixel': return { data: whyForm, setStatus: setWhyStatus };
      case 'story_vision': return { data: storyForm, setStatus: setStoryStatus };
      case 'pricing': return { data: pricingForm, setStatus: setPricingStatus };
      case 'contact_footer': return { data: contactForm, setStatus: setContactStatus };
    }
  };

  const getCurrentStatus = () => {
    switch (activeSection) {
      case 'hero': return heroStatus;
      case 'trusted_by': return trustedStatus;
      case 'why_vixel': return whyStatus;
      case 'story_vision': return storyStatus;
      case 'pricing': return pricingStatus;
      case 'contact_footer': return contactStatus;
    }
  };

  // Actions
  const handleSaveDraft = () => {
    setFeedback(null);
    const { data, setStatus } = getCurrentFormData();

    const formData = new FormData();
    formData.append('sectionKey', activeSection);
    formData.append('content', JSON.stringify(data));

    startTransition(async () => {
      const result = await saveSiteContentDraftAction(null, formData);
      if (result.success) {
        setStatus('draft');
        setFeedback({ type: 'success', message: `Draft saved for '${activeSection}'. (Not published to live site yet)` });
      } else {
        setFeedback({ type: 'error', message: result.error || 'Failed to save draft.' });
      }
    });
  };

  const handlePublish = () => {
    setFeedback(null);
    const { data, setStatus } = getCurrentFormData();

    const formData = new FormData();
    formData.append('sectionKey', activeSection);
    formData.append('content', JSON.stringify(data));
    formData.append('changeSummary', changeSummary || `Published changes to ${activeSection}`);

    startTransition(async () => {
      const result = await publishSiteContentAction(null, formData);
      if (result.success) {
        setStatus('published');
        setChangeSummary('');
        setFeedback({ type: 'success', message: `Section '${activeSection}' is now LIVE on the public website!` });
      } else {
        setFeedback({ type: 'error', message: result.error || 'Failed to publish section.' });
      }
    });
  };

  const handleRevert = async () => {
    setFeedback(null);
    const result = await revertSiteContentDraftAction(activeSection);
    if (result.success) {
      const { setStatus } = getCurrentFormData();
      setStatus('published');
      setFeedback({ type: 'success', message: 'Working draft discarded. Reverted to live published content.' });
    } else {
      setFeedback({ type: 'error', message: result.error || 'Failed to revert draft.' });
    }
  };

  const handleRollback = async (revisionId: string) => {
    setFeedback(null);
    const result = await rollbackToRevisionAction(historySection, revisionId);
    setShowHistoryModal(false);

    if (result.success) {
      setFeedback({ type: 'success', message: 'Restored historical revision and published to live website!' });
    } else {
      setFeedback({ type: 'error', message: result.error || 'Failed to rollback revision.' });
    }
  };

  const navSections = [
    { id: 'hero', label: 'Home Hero & Brand', icon: Film },
    { id: 'trusted_by', label: 'Trusted By & Logos', icon: Building },
    { id: 'why_vixel', label: 'Why Vixel Pillars', icon: Sparkles },
    { id: 'story_vision', label: 'Agency Story & Vision', icon: Layers },
    { id: 'pricing', label: 'Pricing & Guarantee', icon: DollarSign },
    { id: 'contact_footer', label: 'Contact & Social Links', icon: Phone },
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <div className="inline-flex items-center gap-2 mb-1">
            <span className="text-xs font-mono uppercase tracking-wider text-violet-400 font-bold">
              Shared Agency Content
            </span>
            <span className="text-gray-600">•</span>
            <span className="text-xs text-gray-400">Collaborative CMS for both Co-Founders</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            Shared Website Content Editor
          </h1>
          <p className="text-xs sm:text-sm text-gray-400 mt-1">
            Edit live copy, brand settings, why-vixel pillars, pricing guarantees, and footer details.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              setHistorySection(activeSection);
              setShowHistoryModal(true);
            }}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium text-gray-300 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 transition-colors cursor-pointer"
          >
            <History className="w-3.5 h-3.5 text-violet-400" />
            <span>Version History</span>
          </button>

          <Link
            href="/"
            target="_blank"
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium text-gray-300 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5 text-violet-400" />
            <span>View Public Site</span>
          </Link>
        </div>
      </div>

      {/* Feedback Alert */}
      {feedback && (
        <div
          className={`p-4 rounded-2xl flex items-start gap-3 text-xs animate-in fade-in ${
            feedback.type === 'success'
              ? 'bg-emerald-950/40 border border-emerald-500/30 text-emerald-200'
              : 'bg-red-950/40 border border-red-500/30 text-red-200'
          }`}
        >
          {feedback.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
          ) : (
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
          )}
          <span className="font-medium">{feedback.message}</span>
        </div>
      )}

      {/* Section Tabs Navigation */}
      <div className="flex flex-wrap items-center gap-2 p-1.5 rounded-2xl bg-[#14141B] border border-white/10 overflow-x-auto">
        {navSections.map((sec) => {
          const Icon = sec.icon;
          const isActive = activeSection === sec.id;
          return (
            <button
              key={sec.id}
              type="button"
              onClick={() => setActiveSection(sec.id as SectionKey)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer shrink-0 ${
                isActive
                  ? 'bg-violet-600 text-white shadow-md shadow-violet-900/30'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{sec.label}</span>
            </button>
          );
        })}
      </div>

      {/* Section Status & Publishing Bar */}
      <div className="p-4 rounded-2xl bg-[#14141B] border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Badge
            variant={getCurrentStatus() === 'published' ? 'green' : 'sample'}
            size="sm"
          >
            {getCurrentStatus() === 'published' ? 'Live on Public Website' : 'Unpublished Working Draft'}
          </Badge>
          <span className="text-xs text-gray-400 hidden sm:inline">
            Editing Section: <strong className="text-white capitalize">{activeSection.replace('_', ' ')}</strong>
          </span>
        </div>

        <div className="flex items-center gap-2">
          {getCurrentStatus() === 'draft' && (
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={handleRevert}
              disabled={isPending}
              className="gap-1.5 text-gray-300"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Discard Draft</span>
            </Button>
          )}

          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={handleSaveDraft}
            disabled={isPending}
            className="gap-1.5"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Save Working Draft</span>
          </Button>

          <Button
            type="button"
            size="sm"
            onClick={handlePublish}
            disabled={isPending}
            className="gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-900/30 border-0"
          >
            <UploadCloud className="w-3.5 h-3.5" />
            <span>Publish to Live Site</span>
          </Button>
        </div>
      </div>

      {/* Active Section Forms */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[#14141B] border border-white/10 space-y-6">
        {/* Tab 1: Hero & Brand */}
        {activeSection === 'hero' && (
          <div className="space-y-6">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Film className="w-4 h-4 text-violet-400" />
              <span>Hero Headline, Call-to-Actions & Brand</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-2">
                  Studio Wordmark / Name
                </label>
                <input
                  type="text"
                  value={heroForm.wordmark as string}
                  onChange={(e) => setHeroForm({ ...heroForm, wordmark: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white text-sm focus:outline-none focus:border-violet-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-2">
                  Brand Tagline
                </label>
                <input
                  type="text"
                  value={heroForm.brandTagline as string}
                  onChange={(e) => setHeroForm({ ...heroForm, brandTagline: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white text-sm focus:outline-none focus:border-violet-500"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-gray-300 mb-2">
                  Hero Top Badge Pill
                </label>
                <input
                  type="text"
                  value={heroForm.badge as string}
                  onChange={(e) => setHeroForm({ ...heroForm, badge: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white text-sm focus:outline-none focus:border-violet-500"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-gray-300 mb-2">
                  Hero Main Headline *
                </label>
                <textarea
                  rows={2}
                  value={heroForm.title as string}
                  onChange={(e) => setHeroForm({ ...heroForm, title: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white text-sm focus:outline-none focus:border-violet-500"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-gray-300 mb-2">
                  Hero Supporting Subtitle *
                </label>
                <textarea
                  rows={3}
                  value={heroForm.subtitle as string}
                  onChange={(e) => setHeroForm({ ...heroForm, subtitle: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white text-sm focus:outline-none focus:border-violet-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-2">
                  Primary CTA Button Label
                </label>
                <input
                  type="text"
                  value={heroForm.primaryCtaLabel as string}
                  onChange={(e) => setHeroForm({ ...heroForm, primaryCtaLabel: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white text-sm focus:outline-none focus:border-violet-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-2">
                  Primary CTA Destination Link
                </label>
                <input
                  type="text"
                  value={heroForm.primaryCtaLink as string}
                  onChange={(e) => setHeroForm({ ...heroForm, primaryCtaLink: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white text-sm focus:outline-none focus:border-violet-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-2">
                  Secondary CTA Button Label
                </label>
                <input
                  type="text"
                  value={heroForm.secondaryCtaLabel as string}
                  onChange={(e) => setHeroForm({ ...heroForm, secondaryCtaLabel: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white text-sm focus:outline-none focus:border-violet-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-2">
                  Secondary CTA Destination Link
                </label>
                <input
                  type="text"
                  value={heroForm.secondaryCtaLink as string}
                  onChange={(e) => setHeroForm({ ...heroForm, secondaryCtaLink: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white text-sm focus:outline-none focus:border-violet-500"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-gray-300 mb-2">
                  Hero Showreel Video URL (YouTube, Vimeo, or MP4)
                </label>
                <input
                  type="url"
                  value={heroForm.videoReelUrl as string}
                  onChange={(e) => setHeroForm({ ...heroForm, videoReelUrl: e.target.value })}
                  placeholder="https://vimeo.com/..."
                  className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white text-sm focus:outline-none focus:border-violet-500"
                />
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Trusted By */}
        {activeSection === 'trusted_by' && (
          <div className="space-y-6">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Building className="w-4 h-4 text-violet-400" />
              <span>Trusted By Clients & Proof Badges</span>
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-2">
                  Social Proof Headline
                </label>
                <input
                  type="text"
                  value={trustedForm.heading as string}
                  onChange={(e) => setTrustedForm({ ...trustedForm, heading: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white text-sm focus:outline-none focus:border-violet-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-2">
                  Key Metric Highlight
                </label>
                <input
                  type="text"
                  value={trustedForm.metricHighlight as string}
                  onChange={(e) => setTrustedForm({ ...trustedForm, metricHighlight: e.target.value })}
                  placeholder="e.g. 450M+ Organic Views Generated"
                  className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white text-sm focus:outline-none focus:border-violet-500"
                />
              </div>

              {/* Client List */}
              <div className="pt-4 border-t border-white/5 space-y-3">
                <label className="block text-xs font-semibold text-gray-300">
                  Featured Client Brands
                </label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {(trustedForm.clients as string[]).map((client, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-white text-xs font-semibold"
                    >
                      <span>{client}</span>
                      <button
                        type="button"
                        onClick={() => {
                          const updated = (trustedForm.clients as string[]).filter((_, i) => i !== idx);
                          setTrustedForm({ ...trustedForm, clients: updated });
                        }}
                        className="text-gray-400 hover:text-white"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>

                <div className="flex gap-2 max-w-md">
                  <input
                    type="text"
                    value={newClientName}
                    onChange={(e) => setNewClientName(e.target.value)}
                    placeholder="Add brand (e.g. Sony Music)..."
                    className="flex-1 px-4 py-2 rounded-xl bg-black/40 border border-white/10 text-white text-xs focus:outline-none focus:border-violet-500"
                  />
                  <Button
                    type="button"
                    size="sm"
                    variant="secondary"
                    onClick={() => {
                      if (newClientName.trim()) {
                        setTrustedForm({
                          ...trustedForm,
                          clients: [...(trustedForm.clients as string[]), newClientName.trim()],
                        });
                        setNewClientName('');
                      }
                    }}
                  >
                    Add Client
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Why Vixel Pillars */}
        {activeSection === 'why_vixel' && (
          <div className="space-y-6">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-violet-400" />
              <span>Why Vixel Media (4 Value Pillars)</span>
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-2">
                  Section Headline
                </label>
                <input
                  type="text"
                  value={whyForm.headline as string}
                  onChange={(e) => setWhyForm({ ...whyForm, headline: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white text-sm focus:outline-none focus:border-violet-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-2">
                  Section Description
                </label>
                <textarea
                  rows={2}
                  value={whyForm.description as string}
                  onChange={(e) => setWhyForm({ ...whyForm, description: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white text-sm focus:outline-none focus:border-violet-500"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-white/5">
                {(whyForm.pillars as Array<{ title: string; desc: string }>).map((p, idx) => (
                  <div key={idx} className="p-4 rounded-2xl bg-black/40 border border-white/5 space-y-2">
                    <span className="text-[10px] font-mono uppercase text-violet-400 font-bold">
                      Pillar {idx + 1}
                    </span>
                    <input
                      type="text"
                      value={p.title}
                      onChange={(e) => {
                        const updated = [...(whyForm.pillars as Array<{ title: string; desc: string }>)];
                        updated[idx].title = e.target.value;
                        setWhyForm({ ...whyForm, pillars: updated });
                      }}
                      className="w-full px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-white text-xs font-semibold focus:outline-none focus:border-violet-500"
                    />
                    <textarea
                      rows={2}
                      value={p.desc}
                      onChange={(e) => {
                        const updated = [...(whyForm.pillars as Array<{ title: string; desc: string }>)];
                        updated[idx].desc = e.target.value;
                        setWhyForm({ ...whyForm, pillars: updated });
                      }}
                      className="w-full px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-gray-300 text-xs focus:outline-none focus:border-violet-500"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Tab 4: Story & Vision */}
        {activeSection === 'story_vision' && (
          <div className="space-y-6">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Layers className="w-4 h-4 text-violet-400" />
              <span>Agency Story, Mission & Vision (About Page)</span>
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-2">
                  Story Title
                </label>
                <input
                  type="text"
                  value={storyForm.storyTitle as string}
                  onChange={(e) => setStoryForm({ ...storyForm, storyTitle: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white text-sm focus:outline-none focus:border-violet-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-2">
                  Founding Story Body
                </label>
                <textarea
                  rows={4}
                  value={storyForm.storyBody as string}
                  onChange={(e) => setStoryForm({ ...storyForm, storyBody: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white text-sm focus:outline-none focus:border-violet-500"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-2">
                    Studio Mission
                  </label>
                  <textarea
                    rows={3}
                    value={storyForm.mission as string}
                    onChange={(e) => setStoryForm({ ...storyForm, mission: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white text-sm focus:outline-none focus:border-violet-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-2">
                    Studio Vision
                  </label>
                  <textarea
                    rows={3}
                    value={storyForm.vision as string}
                    onChange={(e) => setStoryForm({ ...storyForm, vision: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white text-sm focus:outline-none focus:border-violet-500"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 5: Pricing */}
        {activeSection === 'pricing' && (
          <div className="space-y-6">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-violet-400" />
              <span>Pricing Page Copy & Guarantee</span>
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-2">
                  Pricing Headline
                </label>
                <input
                  type="text"
                  value={pricingForm.headline as string}
                  onChange={(e) => setPricingForm({ ...pricingForm, headline: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white text-sm focus:outline-none focus:border-violet-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-2">
                  Pricing Subheadline
                </label>
                <textarea
                  rows={2}
                  value={pricingForm.subheadline as string}
                  onChange={(e) => setPricingForm({ ...pricingForm, subheadline: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white text-sm focus:outline-none focus:border-violet-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-2">
                  Client Guarantee Copy
                </label>
                <textarea
                  rows={2}
                  value={pricingForm.guarantee as string}
                  onChange={(e) => setPricingForm({ ...pricingForm, guarantee: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white text-sm focus:outline-none focus:border-violet-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-2">
                    Turnaround Commitment Notice
                  </label>
                  <input
                    type="text"
                    value={pricingForm.turnaroundNotice as string}
                    onChange={(e) => setPricingForm({ ...pricingForm, turnaroundNotice: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white text-sm focus:outline-none focus:border-violet-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-2">
                    Pricing CTA Button Label
                  </label>
                  <input
                    type="text"
                    value={pricingForm.ctaLabel as string}
                    onChange={(e) => setPricingForm({ ...pricingForm, ctaLabel: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white text-sm focus:outline-none focus:border-violet-500"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 6: Contact & Footer */}
        {activeSection === 'contact_footer' && (
          <div className="space-y-6">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Phone className="w-4 h-4 text-violet-400" />
              <span>Studio Contact Information, Social Handles & Footer</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-2">
                  Official Studio Email
                </label>
                <input
                  type="email"
                  value={contactForm.email as string}
                  onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white text-sm focus:outline-none focus:border-violet-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-2">
                  Studio WhatsApp / Direct Line
                </label>
                <input
                  type="text"
                  value={contactForm.whatsapp as string}
                  onChange={(e) => setContactForm({ ...contactForm, whatsapp: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white text-sm focus:outline-none focus:border-violet-500"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-gray-300 mb-2">
                  Studio Location & Operational Base
                </label>
                <input
                  type="text"
                  value={contactForm.location as string}
                  onChange={(e) => setContactForm({ ...contactForm, location: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white text-sm focus:outline-none focus:border-violet-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-2">
                  Instagram URL
                </label>
                <input
                  type="url"
                  value={contactForm.instagram as string}
                  onChange={(e) => setContactForm({ ...contactForm, instagram: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white text-sm focus:outline-none focus:border-violet-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-2">
                  YouTube Channel URL
                </label>
                <input
                  type="url"
                  value={contactForm.youtube as string}
                  onChange={(e) => setContactForm({ ...contactForm, youtube: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white text-sm focus:outline-none focus:border-violet-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-2">
                  LinkedIn URL
                </label>
                <input
                  type="url"
                  value={contactForm.linkedin as string}
                  onChange={(e) => setContactForm({ ...contactForm, linkedin: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white text-sm focus:outline-none focus:border-violet-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-2">
                  Twitter / X URL
                </label>
                <input
                  type="url"
                  value={contactForm.twitter as string}
                  onChange={(e) => setContactForm({ ...contactForm, twitter: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white text-sm focus:outline-none focus:border-violet-500"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-gray-300 mb-2">
                  Footer Copyright Notice
                </label>
                <input
                  type="text"
                  value={contactForm.footerCopyright as string}
                  onChange={(e) => setContactForm({ ...contactForm, footerCopyright: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white text-sm focus:outline-none focus:border-violet-500"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Version History Modal */}
      {showHistoryModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in">
          <div className="w-full max-w-2xl rounded-3xl bg-[#14141B] border border-white/15 p-6 space-y-4 shadow-2xl max-h-[80vh] flex flex-col">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-2">
                <History className="w-5 h-5 text-violet-400" />
                <h3 className="text-lg font-bold text-white">
                  Revision History: {historySection.replace('_', ' ')}
                </h3>
              </div>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setShowHistoryModal(false)}
              >
                Close
              </Button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-3 pr-2">
              {(revisions[historySection] || []).length === 0 ? (
                <div className="py-8 text-center text-gray-400 text-xs">
                  No previous revisions logged yet for this section. When you publish changes, an immutable snapshot is recorded here for rollback.
                </div>
              ) : (
                revisions[historySection].map((rev) => (
                  <div
                    key={rev.id}
                    className="p-4 rounded-2xl bg-black/40 border border-white/10 flex items-center justify-between gap-4"
                  >
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="px-2 py-0.5 rounded-full bg-violet-600/30 text-violet-300 text-[10px] font-mono font-bold">
                          v{rev.version_number}
                        </span>
                        <span className="text-xs font-semibold text-white">
                          {rev.change_summary || 'Studio revision'}
                        </span>
                      </div>
                      <div className="text-[11px] text-gray-500 font-mono">
                        {new Date(rev.created_at).toLocaleString()}
                      </div>
                    </div>

                    <Button
                      type="button"
                      size="sm"
                      variant="secondary"
                      onClick={() => handleRollback(rev.id)}
                      className="gap-1.5 text-xs hover:border-violet-500"
                    >
                      <RotateCcw className="w-3.5 h-3.5 text-violet-400" />
                      <span>Restore v{rev.version_number}</span>
                    </Button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
