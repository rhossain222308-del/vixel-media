import React from 'react';
import type { Metadata } from 'next';
import { 
  Sparkles, 
  CheckCircle2, 
  ArrowRight, 
  HelpCircle, 
  Layers, 
  Clock, 
  Video
} from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';

export const metadata: Metadata = {
  title: 'Custom Pricing & Scoping | Vixel Media',
  description: 'Understand how Vixel Media scopes and estimates bespoke video editing, 3D map animations, and recurring creator pipelines.',
};

export default function PricingPage() {
  const scopingFactors = [
    {
      title: 'Raw Footage Volume & Multi-Cam Ratio',
      description: 'A 20-minute single-camera talking head video requires drastically different assembly and color time than a 4-camera documentary shoot with 8 hours of b-roll.',
      icon: <Video className="w-5 h-5 text-violet-400" />,
    },
    {
      title: 'Visual Effects & 3D Cartography Density',
      description: 'Standard lower thirds and subtitling are lightweight, whereas custom 3D topographical map sequences in GeoLayers 3 and Blender require dedicated keyframing and GPU rendering.',
      icon: <Layers className="w-5 h-5 text-purple-400" />,
    },
    {
      title: 'Turnaround Velocity & Publishing Frequency',
      description: 'Rush 24-hour turnaround sprints on daily vertical reels require reserved editor allocation compared to standard 5-day long-form production cycles.',
      icon: <Clock className="w-5 h-5 text-violet-400" />,
    },
    {
      title: 'Sound Design & Foley Complexity',
      description: 'Every edit includes custom sound design. Bespoke multi-track orchestral mixes, atmospheric foley, and licensed audio stems are factored into scope.',
      icon: <Sparkles className="w-5 h-5 text-purple-400" />,
    },
  ];

  const engagementModels = [
    {
      name: 'Bespoke Production Sprint',
      badge: 'Single Project',
      idealFor: 'Brand Anthems, Launch Films, Flagship Documentaries & Keynotes',
      deliverables: [
        'Dedicated Creative Director oversight',
        'Multi-cam rough cut through 4K ProRes master',
        'DaVinci Resolve color grading & LUT export',
        'Commercially cleared music & custom SFX',
        '2 comprehensive rounds of Frame.io revisions',
        'Cutdowns for social media (16:9 and 9:16)',
      ],
      pricingNote: 'Priced individually based on project timeline and complexity.',
    },
    {
      name: 'Recurring Content Engine',
      badge: 'Creator Retainer',
      idealFor: 'High-Growth YouTubers, Founders & Podcasts publishing weekly',
      deliverables: [
        'Guaranteed weekly editorial turnaround slots',
        'Fixed editor assigned to your brand voice',
        'Batch vertical reel extraction (4-12 reels/mo)',
        'Continuous retention hook testing & metrics QA',
        'Dedicated Slack or Frame.io collaboration room',
        'Archival project file management & cloud backups',
      ],
      pricingNote: 'Scoped as a predictable monthly retainer tailored to your upload schedule.',
    },
    {
      name: 'Motion & 3D Map Package',
      badge: 'Specialty Asset',
      idealFor: 'Documentary Channels, Geopolitics Series & Tech Explanations',
      deliverables: [
        'GeoLayers 3 satellite elevation mapping',
        'High-resolution terrain rendering & camera moves',
        'Custom kinetic typography & vector HUDs',
        'Alpha channel overlays or baked video files',
        'Modular After Effects project files upon request',
        'Full atmospheric sound design included',
      ],
      pricingNote: 'Scoped per sequence duration or per episode graphics package.',
    },
  ];

  return (
    <div className="py-12 sm:py-16 md:py-24">
      {/* Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center max-w-3xl">
        <Badge variant="purple" className="mb-4">
          Transparent Scoping
        </Badge>
        <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold text-white tracking-tight leading-tight">
          Every Project is <span className="text-gradient">Unique.</span>
        </h1>
        <p className="mt-4 text-base sm:text-lg text-gray-300 leading-relaxed">
          We don&apos;t force your creative vision into rigid, generic subscription boxes. We provide tailored quotations based on your exact footage, editorial complexity, and delivery goals.
        </p>

        {/* Primary CTA button as required by prompt */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button
            href="/contact"
            variant="primary"
            size="lg"
            icon={<ArrowRight className="w-4 h-4" />}
          >
            Request Pricing
          </Button>
          <Button
            href="/services"
            variant="secondary"
            size="lg"
          >
            Review Service Specs
          </Button>
        </div>
      </div>

      {/* Engagement Models (Not fixed prices, but clear project tiers) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16 sm:mt-24">
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-white">
            Common Engagement Scopes
          </h2>
          <p className="text-sm text-gray-400 mt-2">
            Structured models tailored to individual creative workflows.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {engagementModels.map((model, idx) => (
            <div
              key={idx}
              className="p-8 rounded-3xl bg-[#14141B] border border-white/10 hover:border-violet-500/40 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <Badge variant="purple" size="sm">{model.badge}</Badge>
                  <span className="text-xs font-mono text-gray-400">Custom Scope</span>
                </div>

                <h3 className="text-xl font-bold text-white mb-2">
                  {model.name}
                </h3>

                <p className="text-xs text-gray-400 mb-6 italic">
                  Ideal for: {model.idealFor}
                </p>

                <div className="space-y-3 pt-4 border-t border-white/5">
                  <div className="text-xs font-semibold text-gray-300 uppercase tracking-wider">
                    Included in Scope:
                  </div>
                  {model.deliverables.map((item, i) => (
                    <div key={i} className="flex items-start gap-2.5 text-xs text-gray-300">
                      <CheckCircle2 className="w-3.5 h-3.5 text-violet-400 mt-0.5 shrink-0" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-white/10">
                <div className="text-xs text-gray-400 mb-4 font-mono leading-relaxed">
                  {model.pricingNote}
                </div>
                <Button
                  href={`/contact?scope=${encodeURIComponent(model.name)}`}
                  variant="primary"
                  size="sm"
                  className="w-full"
                  icon={<ArrowRight className="w-3.5 h-3.5" />}
                >
                  Request Pricing for This Scope
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Why No Fixed Prices Section */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mt-20 sm:mt-28">
        <div className="p-8 sm:p-12 rounded-3xl bg-[#14141B] border border-white/10">
          <div className="flex items-center gap-2 mb-3">
            <HelpCircle className="w-5 h-5 text-violet-400" />
            <h3 className="text-xl sm:text-2xl font-bold text-white">
              Why We Provide Custom Quotations
            </h3>
          </div>
          <p className="text-sm text-gray-300 leading-relaxed mb-8">
            Fixed prices in high-end video production invariably lead to one of two problems: either the client overpays for simple edits, or the agency rushes and compromises on narrative quality to hit an artificial margin. We estimate each production based on four transparent levers:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {scopingFactors.map((factor, idx) => (
              <div key={idx} className="p-5 rounded-2xl bg-white/5 border border-white/5">
                <div className="w-9 h-9 rounded-xl bg-violet-600/20 text-violet-400 flex items-center justify-center mb-3">
                  {factor.icon}
                </div>
                <h4 className="text-sm font-bold text-white mb-1.5">{factor.title}</h4>
                <p className="text-xs text-gray-400 leading-relaxed">{factor.description}</p>
              </div>
            ))}
          </div>

          <div className="mt-10 p-5 rounded-2xl bg-violet-950/40 border border-violet-500/30 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-xs text-violet-200">
              Ready to receive a detailed breakdown within 24 business hours?
            </div>
            <Button href="/contact" variant="primary" size="sm">
              Request Pricing Quote
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
