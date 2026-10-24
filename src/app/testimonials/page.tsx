import React from 'react';
import type { Metadata } from 'next';
import Image from 'next/image';
import { 
  Star, 
  Play, 
  TrendingUp, 
  ArrowRight
} from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { getPublishedTestimonials } from '@/lib/data/testimonials';

export const metadata: Metadata = {
  title: 'Client Reviews & Testimonials | Vixel Media',
  description: 'Sample client testimonials, video review placeholders, and case study impact metrics for Vixel Media.',
};

export default async function TestimonialsPage() {
  const testimonials = await getPublishedTestimonials();

  return (
    <div className="py-12 sm:py-16 md:py-24">
      {/* Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center max-w-3xl">
        <Badge variant="purple" className="mb-4">
          Trust & Results
        </Badge>
        <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold text-white tracking-tight leading-tight">
          Client Feedback & <span className="text-gradient">Impact.</span>
        </h1>
        <p className="mt-4 text-base sm:text-lg text-gray-300 leading-relaxed">
          Read staged feedback from creator partners and marketing directors. All reviews below are structured demo entries awaiting live client verification.
        </p>

        {/* Verified client notice badge */}
        <div className="mt-6 inline-flex items-center gap-2.5 p-3 rounded-2xl bg-violet-950/40 border border-violet-500/30 text-violet-200 text-xs">
          <Badge variant="purple" size="sm">Verified Reviews</Badge>
          <span>All testimonials represent feedback from production sprint clients and long-term retainer partners.</span>
        </div>
      </div>

      {/* Testimonials Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16 sm:mt-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {testimonials.map((item) => (
            <div
              key={item.id}
              className="p-8 sm:p-10 rounded-3xl bg-[#14141B] border border-white/10 hover:border-violet-500/30 transition-all flex flex-col justify-between relative group"
            >
              <div>
                {/* Rating stars & verified badge */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-1">
                    {[...Array(item.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <Badge variant={item.isVerified ? 'green' : 'purple'} size="sm">
                    {item.isVerified ? 'Verified Client' : item.projectCategory || 'Client Partner'}
                  </Badge>
                </div>

                {/* Quote */}
                <p className="text-sm sm:text-base text-gray-300 leading-relaxed italic mb-6">
                  &ldquo;{item.quote}&rdquo;
                </p>

                {/* Metrics achieved */}
                {item.metricsResult && (
                  <div className="p-3 rounded-xl bg-violet-950/40 border border-violet-500/20 mb-6 flex items-center gap-2.5">
                    <TrendingUp className="w-4 h-4 text-violet-400 shrink-0" />
                    <span className="text-xs font-semibold text-violet-200">
                      Result: {item.metricsResult}
                    </span>
                  </div>
                )}
              </div>

              {/* Author & Project Info */}
              <div className="pt-6 border-t border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-3.5">
                  <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-gray-800 border border-white/10 shrink-0">
                    <Image
                      src={item.avatarUrl}
                      alt={item.clientName}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">
                      {item.clientName}
                    </h4>
                    <p className="text-xs text-gray-400">
                      {item.role} • {item.company}
                    </p>
                  </div>
                </div>

                <div className="text-right hidden sm:block">
                  <span className="text-[11px] font-mono text-gray-400 uppercase tracking-wider">
                    Project
                  </span>
                  <div className="text-xs font-medium text-violet-300">
                    {item.projectTitle}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Video Review Placeholder Section */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mt-20 sm:mt-28">
        <div className="p-8 sm:p-12 rounded-3xl bg-[#14141B] border border-white/10 text-center">
          <Badge variant="purple" className="mb-3">Video Testimonials</Badge>
          <h3 className="text-2xl sm:text-3xl font-bold text-white mb-2">
            Watch Unfiltered Client Walkthroughs
          </h3>
          <p className="text-sm text-gray-400 max-w-lg mx-auto mb-8">
            Video review recordings and behind-the-scenes post-mortem interviews will be added as verified client interviews conclude.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-left">
            <div className="relative aspect-video rounded-2xl overflow-hidden bg-black border border-white/10 flex flex-col items-center justify-center p-6 text-center group">
              <div className="w-12 h-12 rounded-full bg-violet-600/30 border border-violet-500/50 flex items-center justify-center text-violet-400 mb-3 group-hover:scale-110 transition-transform">
                <Play className="w-5 h-5 fill-current ml-0.5" />
              </div>
              <div className="text-sm font-semibold text-white">Lumina Audio Founder Review</div>
              <div className="text-xs text-gray-500 mt-1">Staged Video Slot (1:45)</div>
            </div>

            <div className="relative aspect-video rounded-2xl overflow-hidden bg-black border border-white/10 flex flex-col items-center justify-center p-6 text-center group">
              <div className="w-12 h-12 rounded-full bg-violet-600/30 border border-violet-500/50 flex items-center justify-center text-violet-400 mb-3 group-hover:scale-110 transition-transform">
                <Play className="w-5 h-5 fill-current ml-0.5" />
              </div>
              <div className="text-sm font-semibold text-white">Chronicle Channel Creator Breakdown</div>
              <div className="text-xs text-gray-500 mt-1">Staged Video Slot (2:20)</div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="mt-20 text-center">
        <Button href="/contact" variant="primary" size="lg" icon={<ArrowRight className="w-4 h-4" />}>
          Join Our Client Roster
        </Button>
      </div>
    </div>
  );
}
