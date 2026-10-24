import React from 'react';
import type { Metadata } from 'next';
import { 
  Sparkles, 
  Target, 
  Eye, 
  ShieldCheck, 
  ArrowRight,
  Clock,
  MessageSquare
} from 'lucide-react';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { FounderCard } from '@/components/founders/FounderCard';
import { getPublishedFounders } from '@/lib/data/profiles';
import { getPublishedSiteContent } from '@/lib/data/siteContent';

export const metadata: Metadata = {
  title: 'About Us | Vixel Media',
  description: 'Learn the story, vision, and core philosophy behind Vixel Media — a creative agency founded on narrative rhythm and visual precision.',
};

export default async function AboutPage() {
  const [founders, storyVision] = await Promise.all([
    getPublishedFounders(),
    getPublishedSiteContent('story_vision', {
      storyTitle: 'From Solo Timelines to a Unified Creative Studio',
      storyBody: '',
      mission: 'To liberate creators and brand leaders from editorial friction by providing an agile, dependable, and aesthetically uncompromising video production engine that turns raw ideas into viral, high-converting digital assets.',
      vision: 'To redefine post-production as a strategic growth asset. We envision a creator ecosystem where every ambitious brand commands the production fidelity previously reserved for high-budget television networks.',
    }),
  ]);
  const philosophies = [
    {
      title: 'Creativity',
      subtitle: 'We avoid generic templates and cookie-cutter cuts. Every project receives bespoke pacing, customized color treatment, and original sound architecture.',
      icon: <Sparkles className="w-5 h-5 text-violet-400" />,
    },
    {
      title: 'Quality',
      subtitle: 'From sub-frame audio synchronization to 4K color gamut management in DaVinci Resolve, our standard is broadcast and cinema excellence.',
      icon: <ShieldCheck className="w-5 h-5 text-purple-400" />,
    },
    {
      title: 'Communication',
      subtitle: 'Direct collaboration with the editors doing the work. Timecode-accurate Frame.io feedback, rapid response times, and clear milestone dates.',
      icon: <MessageSquare className="w-5 h-5 text-violet-400" />,
    },
    {
      title: 'Consistency',
      subtitle: 'A repeatable post-production pipeline that guarantees your video schedule never slips, whether you publish weekly or manage daily vertical campaigns.',
      icon: <Clock className="w-5 h-5 text-purple-400" />,
    },
  ];

  return (
    <div className="py-12 sm:py-16 md:py-24">
      {/* 1. Header Hero */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center max-w-3xl">
        <Badge variant="purple" className="mb-4">
          Agency Origins
        </Badge>
        <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold text-white tracking-tight leading-tight">
          Crafting Visual Gravity for the <span className="text-gradient">Digital Age.</span>
        </h1>
        <p className="mt-5 text-base sm:text-lg text-gray-300 leading-relaxed">
          Vixel Media was born out of a shared frustration with bloated, slow agencies and low-effort freelance mills. We operate as an elite creative studio where directors and motion designers execute directly.
        </p>
      </div>

      {/* 2. Our Story */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mt-16 sm:mt-24">
        <div className="p-8 sm:p-12 rounded-3xl bg-[#14141B] border border-white/10 relative overflow-hidden">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-xs font-mono uppercase tracking-widest text-violet-400">
              Our Story
            </span>
            <span className="text-xs text-gray-500">•</span>
            <Badge variant="sample" size="sm">Editable Staged Story</Badge>
          </div>

          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-6">
            {storyVision.storyTitle || 'From Solo Timelines to a Unified Creative Studio'}
          </h2>

          <div className="space-y-4 text-sm sm:text-base text-gray-300 leading-relaxed">
            {storyVision.storyBody ? (
              storyVision.storyBody.split('\n\n').map((paragraph: string, idx: number) => (
                <p key={idx}>{paragraph}</p>
              ))
            ) : (
              <>
                <p>
                  In an attention economy where billions of hours of video are uploaded every single week, having clean footage is no longer enough. The difference between an average video and one that converts viewers into lifelong customers or devoted subscribers is pacing, rhythm, and visual disruption.
                </p>
                <p>
                  Co-founders <strong className="text-white">Alex Vance</strong> (cinematic storytelling & long-form editorial) and <strong className="text-white">Marcus Chen</strong> (motion design, 3D cartography, and high-velocity short-form hooks) combined their complimentary skillsets to form Vixel Media.
                </p>
                <p>
                  Our studio bridges the gap between Hollywood-grade post-production principles and algorithmic audience retention. Today, we partner with top YouTube creators, venture-backed startups, and visionary brands to engineer content that not only looks stunning, but delivers measurable watch time, engagement, and conversion.
                </p>
              </>
            )}
          </div>
        </div>
      </div>

      {/* 3. Vision & Mission */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16 sm:mt-24">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Vision */}
          <div className="p-8 sm:p-10 rounded-3xl bg-[#13131A] border border-white/10 flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-violet-950/60 border border-violet-500/30 flex items-center justify-center text-violet-400 mb-6">
                <Eye className="w-6 h-6" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-white mb-3">Our Vision</h3>
              <p className="text-sm sm:text-base text-gray-400 leading-relaxed">
                {storyVision.vision || 'To redefine post-production as a strategic growth asset. We envision a creator ecosystem where every ambitious brand commands the production fidelity previously reserved for high-budget television networks.'}
              </p>
            </div>
            <div className="mt-8 pt-4 border-t border-white/5 text-xs text-violet-400 font-mono">
              Impact-Driven Visual Storytelling
            </div>
          </div>

          {/* Mission */}
          <div className="p-8 sm:p-10 rounded-3xl bg-[#13131A] border border-white/10 flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-purple-950/60 border border-purple-500/30 flex items-center justify-center text-purple-400 mb-6">
                <Target className="w-6 h-6" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-white mb-3">Our Mission</h3>
              <p className="text-sm sm:text-base text-gray-400 leading-relaxed">
                {storyVision.mission || 'To liberate creators and brand leaders from editorial friction by providing an agile, dependable, and aesthetically uncompromising video production engine that turns raw ideas into viral, high-converting digital assets.'}
              </p>
            </div>
            <div className="mt-8 pt-4 border-t border-white/5 text-xs text-purple-400 font-mono">
              Retention-Engineered Production
            </div>
          </div>
        </div>
      </div>

      {/* 4. Philosophy: Creativity, Quality, Communication, Consistency */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-20 sm:mt-28">
        <SectionHeading
          badge="Our Principles"
          title="The Four Cornerstones of Vixel Media"
          subtitle="How we approach every timeline, color grade, and keyframe delivery."
          alignment="center"
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {philosophies.map((item, idx) => (
            <div
              key={idx}
              className="p-6 sm:p-7 rounded-2xl bg-[#14141B] border border-white/10 hover:border-violet-500/30 transition-all group"
            >
              <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                {item.icon}
              </div>
              <h3 className="text-lg font-bold text-white mb-2 group-hover:text-violet-300 transition-colors">
                {item.title}
              </h3>
              <p className="text-xs sm:text-sm text-gray-400 leading-relaxed">
                {item.subtitle}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* 5. Co-Founders Cards */}
      <div id="founders" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-20 sm:mt-28">
        <SectionHeading
          badge="Creative Partners"
          title="Meet the Co-Founders"
          subtitle="Explore the individual portfolios, tools, and background of our two studio leads."
          alignment="center"
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {founders.map((founder) => (
            <FounderCard key={founder.id} founder={founder} />
          ))}
        </div>
      </div>

      {/* 6. Ready to work banner */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mt-20 sm:mt-28 text-center">
        <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-violet-950/40 via-[#15151F] to-purple-950/40 border border-white/10">
          <h3 className="text-2xl sm:text-3xl font-bold text-white mb-3">
            Want to collaborate with our creative team?
          </h3>
          <p className="text-sm text-gray-300 max-w-md mx-auto mb-6">
            We take on a limited number of recurring creator partnerships and bespoke commercial campaigns each quarter.
          </p>
          <Button href="/contact" variant="primary" size="md" icon={<ArrowRight className="w-4 h-4" />}>
            Request Studio Consultation
          </Button>
        </div>
      </div>
    </div>
  );
}
