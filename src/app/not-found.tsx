import React from 'react';
import Link from 'next/link';
import type { Metadata } from 'next';
import { Film, ArrowRight, Home } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export const metadata: Metadata = {
  title: 'Page Not Found (404) | Vixel Media',
  description: 'The requested scene or timeline could not be found.',
};

export default function NotFound() {
  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-16 sm:py-24 relative overflow-hidden">
      {/* Background radial ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-violet-600/10 rounded-full blur-[180px] pointer-events-none" />

      <div className="w-full max-w-2xl text-center relative z-10 space-y-6">
        {/* Status Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-violet-950/60 border border-violet-500/30 text-violet-300 text-xs font-mono">
          <Film className="w-3.5 h-3.5 text-violet-400" />
          <span>TIMELINE SEQUENCE 404 • MISSING ASSET</span>
        </div>

        {/* Big Glitch/Cinema Title */}
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-white leading-tight">
          This Cut Does <span className="text-gradient">Not Exist.</span>
        </h1>

        <p className="text-base sm:text-lg text-gray-300 max-w-lg mx-auto leading-relaxed">
          The scene, project cut, or URL you are looking for has been relocated or never existed in our production sequence.
        </p>

        {/* Action Buttons */}
        <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button
            href="/"
            variant="primary"
            size="lg"
            icon={<Home className="w-4 h-4" />}
          >
            Return to Studio Home
          </Button>

          <Button
            href="/work"
            variant="secondary"
            size="lg"
            icon={<ArrowRight className="w-4 h-4" />}
          >
            Browse Selected Works
          </Button>
        </div>

        {/* Helpful Shortcuts */}
        <div className="pt-10 border-t border-white/10 max-w-md mx-auto">
          <div className="text-xs font-mono text-gray-500 uppercase tracking-wider mb-3">
            Quick Navigation
          </div>
          <div className="flex flex-wrap items-center justify-center gap-3 text-xs">
            <Link
              href="/services"
              className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white transition-colors border border-white/5"
            >
              Services & Capabilities
            </Link>
            <Link
              href="/pricing"
              className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white transition-colors border border-white/5"
            >
              Pricing & Scopes
            </Link>
            <Link
              href="/contact"
              className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white transition-colors border border-white/5"
            >
              Inquiry Desk
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
