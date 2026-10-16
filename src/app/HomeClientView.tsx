'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { 
  Play, 
  ArrowRight, 
  Sparkles, 
  Zap, 
  CheckCircle2, 
  Film, 
  BarChart3,
  Award
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { VideoCard } from '@/components/video/VideoCard';
import { VideoPlayerModal } from '@/components/video/VideoPlayerModal';
import { FounderCard } from '@/components/founders/FounderCard';
import { ServiceCard } from '@/components/services/ServiceCard';
import { sampleClientLogos } from '@/data/testimonials';
import type { Project, Founder, Service } from '@/types';

interface HomeClientViewProps {
  featuredProjects: Project[];
  services: Service[];
  founders: Founder[];
}

export function HomeClientView({
  featuredProjects,
  services,
  founders,
}: HomeClientViewProps) {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenProject = (project: Project) => {
    setSelectedProject(project);
    setIsModalOpen(true);
  };

  const whyUsPillars = [
    {
      title: 'Fast Delivery',
      subtitle: '24h - 48h turnarounds on vertical reels and rapid weekly long-form sprints without sacrificing editorial depth.',
      icon: <Zap className="w-6 h-6 text-violet-400" />,
      metric: 'Under 48 Hours',
    },
    {
      title: 'Creative Storytelling',
      subtitle: 'We engineer pacing psychology, sound arcs, and emotional contrast to transform raw footage into addictive cinema.',
      icon: <Film className="w-6 h-6 text-purple-400" />,
      metric: '65%+ Avg. Retention',
    },
    {
      title: 'Platform-Optimized Content',
      subtitle: 'Native formatting for YouTube 16:9, vertical 9:16 reels, TikTok algorithms, and high-conversion paid ads.',
      icon: <BarChart3 className="w-6 h-6 text-violet-400" />,
      metric: '4x Higher Reach',
    },
    {
      title: 'Experienced Editors',
      subtitle: 'Every cut and keyframe is executed directly by seasoned creative directors and motion specialists.',
      icon: <Award className="w-6 h-6 text-purple-400" />,
      metric: '15+ Yrs Combined Experience',
    },
  ];

  return (
    <div className="relative overflow-hidden">
      {/* Video Modal */}
      <VideoPlayerModal
        project={selectedProject}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />

      {/* 1. HERO SECTION */}
      <section className="relative pt-12 pb-20 md:pt-20 md:pb-32 grid-glow-bg">
        {/* Glow orb */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-violet-600/15 rounded-full blur-[140px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-4xl mx-auto space-y-6">
            {/* Studio Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-violet-950/60 border border-violet-500/30 text-violet-300 text-xs font-medium shadow-sm">
              <span className="w-2 h-2 rounded-full bg-violet-400 animate-ping" />
              <span>VIXEL MEDIA STUDIO • HIGH-IMPACT POST-PRODUCTION</span>
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-white leading-[1.08]">
              Creative That <span className="text-gradient">Converts.</span>
            </h1>

            {/* Supporting Text */}
            <p className="text-lg sm:text-xl md:text-2xl text-gray-300 font-normal max-w-2xl mx-auto leading-relaxed">
              We craft high-impact videos, visuals, and digital experiences for brands and creators.
            </p>

            {/* CTA Buttons */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button
                href="/work"
                variant="primary"
                size="lg"
                icon={<ArrowRight className="w-4 h-4" />}
              >
                View Our Work
              </Button>
              <Button
                href="/contact"
                variant="secondary"
                size="lg"
                icon={<Sparkles className="w-4 h-4 text-violet-400" />}
              >
                Get a Quote
              </Button>
            </div>
          </div>

          {/* Compelling Visual & Video Showcase Reel Box */}
          <div className="mt-14 sm:mt-18 max-w-5xl mx-auto">
            <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden border border-white/15 bg-[#121218] shadow-2xl shadow-purple-950/40 group">
              {/* Aspect Ratio Video Showcase Box */}
              <div className="relative aspect-video w-full overflow-hidden">
                <Image
                  src="https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&w=1600&q=80"
                  alt="Vixel Media Editorial Suite Preview"
                  fill
                  priority
                  className="object-cover group-hover:scale-105 transition-transform duration-1000 ease-out opacity-80"
                />

                {/* Dark Vignette Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0B0B0D] via-black/40 to-black/20" />

                {/* Big Center Interactive Play Trigger */}
                <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center z-20">
                  <button
                    onClick={() => featuredProjects[0] && handleOpenProject(featuredProjects[0])}
                    aria-label="Play showreel"
                    className="w-16 h-16 sm:w-24 sm:h-24 rounded-full bg-violet-600/90 text-white flex items-center justify-center shadow-2xl shadow-violet-900/80 backdrop-blur-md border border-violet-400/40 hover:scale-110 active:scale-95 transition-all cursor-pointer group-hover:shadow-violet-600/70"
                  >
                    <Play className="w-7 h-7 sm:w-10 sm:h-10 fill-current ml-1" />
                  </button>

                  <div className="mt-4">
                    <span className="text-xs sm:text-sm font-semibold tracking-wider uppercase text-white/90 font-mono">
                      Click to Play 2026 Studio Reel
                    </span>
                    <div className="text-[11px] text-gray-400 mt-1">
                      Featuring Lumina Anthem & 4K Cinema Grading
                    </div>
                  </div>
                </div>

                {/* Live Floating Studio Badges */}
                <div className="absolute top-4 left-4 sm:top-6 sm:left-6 z-20 flex items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-xs text-white font-mono">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    4K HDR MASTERING
                  </span>
                  <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-xs text-violet-300 font-mono">
                    DA VINCI RESOLVE & AFTER EFFECTS
                  </span>
                </div>

                <div className="absolute bottom-4 right-4 sm:bottom-6 sm:right-6 z-20">
                  <Badge variant="sample" size="sm">
                    Studio Reel Preview
                  </Badge>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. TRUSTED BY SECTION */}
      <section className="py-12 border-y border-white/5 bg-[#0D0D11]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-6">
            <span className="text-xs font-mono uppercase tracking-widest text-gray-500">
              Trusted by creators and innovative brands (Sample Client Placeholders)
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4 sm:gap-6 items-center">
            {sampleClientLogos.map((client, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl bg-white/[0.02] border border-white/5 hover:border-violet-500/20 text-center transition-colors group"
              >
                <span className="text-xs sm:text-sm font-bold text-gray-400 group-hover:text-white font-mono transition-colors">
                  {client.label}
                </span>
                <div className="text-[9px] text-gray-600 mt-0.5">Sample Partner</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. SERVICES PREVIEW SECTION */}
      <section className="py-20 md:py-28 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          badge="What We Do"
          title="Engineered for Rhythm & Reach"
          subtitle="From cinematic YouTube storytelling to high-velocity vertical reels and 3D map animations, we cover the full modern video spectrum."
          alignment="center"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {services.slice(0, 6).map((service) => (
            <ServiceCard key={service.id} service={service} detailed={false} />
          ))}
        </div>

        <div className="mt-12 text-center">
          <Button
            href="/services"
            variant="secondary"
            size="md"
            icon={<ArrowRight className="w-4 h-4" />}
          >
            Explore All 6 Detailed Services & Deliverables
          </Button>
        </div>
      </section>

      {/* 4. FEATURED WORK SECTION */}
      <section className="py-20 md:py-28 bg-[#0D0D12] border-y border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 sm:mb-16 gap-6">
            <div>
              <div className="mb-3">
                <Badge variant="purple">Selected Works</Badge>
              </div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white">
                Featured Productions
              </h2>
              <p className="mt-3 text-base text-gray-400 max-w-xl">
                Explore a curation of recent client edits, motion systems, and 3D map cartography.
              </p>
            </div>

            <Button
              href="/work"
              variant="outline"
              size="md"
              icon={<ArrowRight className="w-4 h-4" />}
            >
              Browse Full Agency Portfolio
            </Button>
          </div>

          {/* Featured Work Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {featuredProjects.map((project) => (
              <VideoCard
                key={project.id}
                project={project}
                onSelect={handleOpenProject}
              />
            ))}
          </div>

          <div className="mt-12 p-4 rounded-2xl bg-[#14141A] border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
            <div className="flex items-center gap-3">
              <span className="p-2 rounded-xl bg-violet-600/20 text-violet-400">
                <Sparkles className="w-5 h-5" />
              </span>
              <div>
                <h4 className="text-sm font-semibold text-white">Want to see projects filtered by category?</h4>
                <p className="text-xs text-gray-400">Filter across Reels, Long-form, Commercial Ads, and Motion Graphics.</p>
              </div>
            </div>
            <Button href="/work" variant="primary" size="sm">
              Open Filterable Portfolio
            </Button>
          </div>
        </div>
      </section>

      {/* 5. WHY VIXEL MEDIA SECTION */}
      <section className="py-20 md:py-28 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          badge="Why Vixel Media"
          title="The Standard in Video Post-Production"
          subtitle="We combine editorial artistry with algorithmic retention strategies to deliver content that commands attention."
          alignment="center"
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {whyUsPillars.map((pillar, idx) => (
            <div
              key={idx}
              className="p-7 rounded-2xl bg-[#14141B] border border-white/10 hover:border-violet-500/30 transition-all duration-300 flex flex-col justify-between group hover:-translate-y-1"
            >
              <div>
                <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                  {pillar.icon}
                </div>
                <h3 className="text-lg font-bold text-white mb-2 group-hover:text-violet-300 transition-colors">
                  {pillar.title}
                </h3>
                <p className="text-xs sm:text-sm text-gray-400 leading-relaxed">
                  {pillar.subtitle}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-white/5">
                <span className="text-[11px] font-mono uppercase tracking-wider text-violet-400 font-semibold">
                  {pillar.metric}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 6. MEET THE CO-FOUNDERS SECTION */}
      <section className="py-20 md:py-28 bg-[#0D0D12] border-y border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            badge="Studio Leadership"
            title="Meet the Co-Founders"
            subtitle="Two dedicated craftspeople leading editorial direction and motion design. Each maintains an individual portfolio with their signature projects."
            alignment="center"
          />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {founders.map((founder) => (
              <FounderCard key={founder.id} founder={founder} />
            ))}
          </div>

          <div className="mt-8 text-center text-xs text-gray-500">
            Note: Co-founder names and biographies are structured sample entries ready for authenticated management in Supabase Phase 2.
          </div>
        </div>
      </section>

      {/* 7. FINAL CTA SECTION */}
      <section className="py-20 md:py-32 relative overflow-hidden">
        {/* Glow backdrop */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-violet-950/20 to-black pointer-events-none" />

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <div className="p-8 sm:p-14 md:p-16 rounded-3xl bg-gradient-to-b from-[#181822] to-[#101015] border border-white/10 shadow-2xl relative overflow-hidden">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-600/20 border border-violet-500/30 text-violet-300 text-xs font-medium mb-6">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Accepting New Client Productions for Q4</span>
            </div>

            <h2 className="text-3xl sm:text-5xl md:text-6xl font-extrabold text-white tracking-tight leading-tight mb-6">
              Let&apos;s build something <span className="text-gradient">powerful together.</span>
            </h2>

            <p className="text-base sm:text-xl text-gray-300 max-w-2xl mx-auto mb-8 leading-relaxed">
              Whether you need a full YouTube long-form editorial pipeline, high-velocity vertical reels, or signature 3D map cartography, we are ready to elevate your visual identity.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button
                href="/contact"
                variant="primary"
                size="lg"
                icon={<ArrowRight className="w-5 h-5" />}
              >
                Start Your Project Inquiry
              </Button>
              <Button
                href="/pricing"
                variant="secondary"
                size="lg"
              >
                Learn How We Scope & Price
              </Button>
            </div>

            <div className="mt-8 pt-8 border-t border-white/10 flex flex-wrap items-center justify-center gap-6 text-xs text-gray-400">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-violet-400" /> Fast Onboarding
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-violet-400" /> Frame.io Timecode Revisions
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-violet-400" /> 100% Commercial Music Clearance
              </span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
