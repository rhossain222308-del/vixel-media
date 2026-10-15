import React from 'react';
import type { Metadata } from 'next';
import { 
  Sparkles, 
  Film, 
  ArrowRight, 
  CheckCircle2, 
  Laptop
} from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';

export const metadata: Metadata = {
  title: 'Careers & Talent Roster | Vixel Media',
  description: 'Join the Vixel Media creative network. We partner with elite remote video editors, 3D cartographers, and motion designers worldwide.',
};

export default function CareersPage() {
  const openRoles = [
    {
      title: 'Senior YouTube Narrative Editor',
      type: 'Contract / Full-time Remote',
      location: 'Remote (Worldwide)',
      department: 'Editorial Suite',
      description: 'Master of pacing, story arcs, and audio design for high-profile 100K+ subscriber creator channels.',
    },
    {
      title: '3D Map & Motion Graphics Specialist',
      type: 'Project-based / Retainer',
      location: 'Remote (Worldwide)',
      department: 'VFX & Cartography',
      description: 'Deep mastery of GeoLayers 3, Cinema 4D/Blender, and After Effects for documentary visualizations.',
    },
    {
      title: 'Short-Form Viral Hook Editor',
      type: 'Part-time / Retainer',
      location: 'Remote (Worldwide)',
      department: 'Short-Form Vertical',
      description: 'Obsessed with the first 1.5 seconds, dynamic kinetic typography, and audio disruption techniques for Reels & TikTok.',
    },
  ];

  const perks = [
    {
      title: '100% Remote & Asynchronous',
      description: 'Work from anywhere on your own creative schedule as long as sprint milestones are met.',
      icon: <Laptop className="w-5 h-5 text-violet-400" />,
    },
    {
      title: 'High-Impact Creator Projects',
      description: 'Edit for top-tier creators, venture-backed tech startups, and documentary filmmakers.',
      icon: <Film className="w-5 h-5 text-purple-400" />,
    },
    {
      title: 'Premium Asset Access',
      description: 'Unlimited access to licensed music libraries (Artlist, Musicbed), SFX suites, and motion plugins.',
      icon: <Sparkles className="w-5 h-5 text-violet-400" />,
    },
    {
      title: 'Fair, Transparent Pay',
      description: 'Competitive per-project or monthly retainer fees with zero scope creep.',
      icon: <CheckCircle2 className="w-5 h-5 text-purple-400" />,
    },
  ];

  return (
    <div className="py-12 sm:py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <Badge variant="purple" className="mb-4">
            Talent Network
          </Badge>
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold text-white tracking-tight leading-tight">
            Build the Future of <span className="text-gradient">Video.</span>
          </h1>
          <p className="mt-4 text-base sm:text-lg text-gray-300 leading-relaxed">
            We are always scouting exceptional video editors, sound designers, colorists, and 3D motion animators to join our extended studio network.
          </p>
        </div>

        {/* Culture / Perks */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
          {perks.map((perk, idx) => (
            <div
              key={idx}
              className="p-6 rounded-2xl bg-[#14141B] border border-white/10 hover:border-violet-500/30 transition-all"
            >
              <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center mb-4">
                {perk.icon}
              </div>
              <h3 className="text-base font-bold text-white mb-2">{perk.title}</h3>
              <p className="text-xs text-gray-400 leading-relaxed">{perk.description}</p>
            </div>
          ))}
        </div>

        {/* Open Opportunities */}
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <h2 className="text-2xl font-bold text-white">Open Staged Opportunities</h2>
            <Badge variant="sample" size="sm">Talent Ingestion</Badge>
          </div>

          <div className="space-y-4">
            {openRoles.map((role, idx) => (
              <div
                key={idx}
                className="p-6 sm:p-7 rounded-2xl bg-[#14141B] border border-white/10 hover:border-violet-500/30 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
              >
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono text-violet-400">{role.department}</span>
                    <span className="text-xs text-gray-500">•</span>
                    <span className="text-xs text-gray-400">{role.type}</span>
                  </div>
                  <h3 className="text-lg font-bold text-white">{role.title}</h3>
                  <p className="text-xs text-gray-400 max-w-lg">{role.description}</p>
                </div>

                <Button
                  href="/contact?service=Talent+Application"
                  variant="secondary"
                  size="sm"
                  icon={<ArrowRight className="w-3.5 h-3.5" />}
                  className="shrink-0"
                >
                  Submit Portfolio Reel
                </Button>
              </div>
            ))}
          </div>

          {/* General Talent Roster Box */}
          <div className="p-8 rounded-3xl bg-gradient-to-r from-violet-950/40 via-[#15151F] to-purple-950/40 border border-white/10 text-center mt-12">
            <h3 className="text-xl font-bold text-white mb-2">
              Don&apos;t see your exact creative specialty?
            </h3>
            <p className="text-xs sm:text-sm text-gray-400 max-w-md mx-auto mb-6">
              If your showreel demonstrates high retention, meticulous pacing, and sound design discipline, send us your portfolio link.
            </p>
            <Button href="/contact?service=General+Talent+Application" variant="primary" size="md">
              Join Our Freelance Roster
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
