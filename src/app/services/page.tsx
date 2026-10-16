import React from 'react';
import type { Metadata } from 'next';
import Image from 'next/image';
import { 
  CheckCircle2, 
  ArrowRight, 
  Monitor, 
  Clock
} from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { getPublishedServices } from '@/lib/data/services';

export const metadata: Metadata = {
  title: 'Post-Production Services | Vixel Media',
  description: 'Detailed capabilities for YouTube video editing, high-retention vertical reels, 3D map animations, motion graphics, and brand films.',
};

export default async function ServicesPage() {
  const services = await getPublishedServices();

  return (
    <div className="py-12 sm:py-16 md:py-24">
      {/* Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center max-w-3xl">
        <Badge variant="purple" className="mb-4">
          Capabilities & Deliverables
        </Badge>
        <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold text-white tracking-tight leading-tight">
          Services Engineered for <span className="text-gradient">Impact.</span>
        </h1>
        <p className="mt-5 text-base sm:text-lg text-gray-300 leading-relaxed">
          Explore our six core post-production disciplines. Every service is backed by timecode-accurate collaboration, broadcast master standards, and dedicated creative direction.
        </p>
      </div>

      {/* Services Detailed List */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16 sm:mt-24 space-y-16 sm:space-y-24">
        {services.map((service, index) => {
          const isEven = index % 2 === 1;

          return (
            <div
              key={service.id}
              id={service.slug}
              className={`flex flex-col lg:flex-row items-center gap-10 lg:gap-14 p-6 sm:p-10 rounded-3xl bg-[#14141B] border border-white/10 hover:border-violet-500/30 transition-all ${
                isEven ? 'lg:flex-row-reverse' : ''
              }`}
            >
              {/* Visual Demo Box */}
              <div className="w-full lg:w-1/2 relative aspect-video rounded-2xl overflow-hidden bg-black border border-white/10 group">
                <Image
                  src={service.thumbnailUrl}
                  alt={service.title}
                  fill
                  className="object-cover opacity-80 group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20" />

                <div className="absolute top-4 left-4 z-10">
                  <Badge variant="purple" size="sm">
                    {service.badge}
                  </Badge>
                </div>

                <div className="absolute bottom-4 left-4 right-4 z-10 flex items-center justify-between text-xs text-white">
                  <span className="font-mono bg-black/60 px-2.5 py-1 rounded-md border border-white/10 backdrop-blur-sm">
                    4K ProRes & H.264
                  </span>
                  <span className="inline-flex items-center gap-1 font-mono text-gray-300 bg-black/60 px-2.5 py-1 rounded-md border border-white/10 backdrop-blur-sm">
                    <Clock className="w-3 h-3 text-violet-400" />
                    {service.turnaroundTime}
                  </span>
                </div>
              </div>

              {/* Service Content & Specs */}
              <div className="w-full lg:w-1/2 space-y-5">
                <div>
                  <div className="text-xs font-mono uppercase tracking-widest text-violet-400 mb-1">
                    Service 0{index + 1}
                  </div>
                  <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white">
                    {service.title}
                  </h2>
                </div>

                <p className="text-sm sm:text-base text-gray-300 leading-relaxed">
                  {service.fullDescription}
                </p>

                {/* Deliverables Checklist */}
                <div>
                  <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
                    Key Deliverables:
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {service.deliverables.map((item, i) => (
                      <div key={i} className="flex items-start gap-2 text-xs text-gray-300">
                        <CheckCircle2 className="w-3.5 h-3.5 text-violet-400 mt-0.5 shrink-0" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Intended Platforms */}
                <div className="pt-2">
                  <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <Monitor className="w-3.5 h-3.5 text-violet-400" />
                    Intended Platforms & Channels:
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {service.intendedPlatforms.map((platform, i) => (
                      <span
                        key={i}
                        className="text-xs px-2.5 py-1 rounded-md bg-white/5 border border-white/10 text-gray-300 font-medium"
                      >
                        {platform}
                      </span>
                    ))}
                  </div>
                </div>

                {/* CTA Action */}
                <div className="pt-4 flex flex-col sm:flex-row items-start sm:items-center gap-3">
                  <Button
                    href={`/contact?service=${encodeURIComponent(service.title)}`}
                    variant="primary"
                    size="md"
                    icon={<ArrowRight className="w-4 h-4" />}
                  >
                    Request {service.title}
                  </Button>
                  <Button
                    href="/pricing"
                    variant="ghost"
                    size="sm"
                    className="text-gray-400"
                  >
                    View Scoping Process
                  </Button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Production Workflow Banner */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mt-24 sm:mt-32">
        <div className="p-8 sm:p-12 rounded-3xl bg-[#14141B] border border-white/10 text-center">
          <Badge variant="purple" className="mb-3">
            Our Production Pipeline
          </Badge>
          <h3 className="text-2xl sm:text-3xl font-bold text-white mb-3">
            How a Vixel Media Sprint Works
          </h3>
          <p className="text-sm text-gray-400 max-w-xl mx-auto mb-8">
            From raw asset drop to final master delivery in 4 streamlined phases.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-left">
            <div className="p-4 rounded-xl bg-white/5 border border-white/5">
              <div className="text-xs font-mono text-violet-400 font-bold mb-1">01. INGESTION</div>
              <div className="text-sm font-semibold text-white mb-1">Asset Drop & Brief</div>
              <div className="text-xs text-gray-400">Footage transfer, audio sync, narrative outline, and style alignment.</div>
            </div>
            <div className="p-4 rounded-xl bg-white/5 border border-white/5">
              <div className="text-xs font-mono text-violet-400 font-bold mb-1">02. ASSEMBLY</div>
              <div className="text-sm font-semibold text-white mb-1">Rough Cut & Rhythm</div>
              <div className="text-xs text-gray-400">Dead-air removal, narrative pacing, and music score architecture.</div>
            </div>
            <div className="p-4 rounded-xl bg-white/5 border border-white/5">
              <div className="text-xs font-mono text-violet-400 font-bold mb-1">03. POLISH</div>
              <div className="text-sm font-semibold text-white mb-1">Grade, SFX & VFX</div>
              <div className="text-xs text-gray-400">3D map sequences, kinetic graphics, DaVinci color, and sound sweetening.</div>
            </div>
            <div className="p-4 rounded-xl bg-white/5 border border-white/5">
              <div className="text-xs font-mono text-violet-400 font-bold mb-1">04. DELIVERY</div>
              <div className="text-sm font-semibold text-white mb-1">Frame.io QA & 4K</div>
              <div className="text-xs text-gray-400">Timecode revisions and final multi-format ProRes masters.</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
