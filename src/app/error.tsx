'use client';

import React, { useEffect } from 'react';
import { AlertCircle, RotateCcw, Home } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ErrorBoundary({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error('Unhandled studio application error:', error);
  }, [error]);

  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-16 sm:py-24 relative overflow-hidden">
      {/* Background ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-red-600/10 rounded-full blur-[160px] pointer-events-none" />

      <div className="w-full max-w-lg text-center relative z-10 space-y-6">
        <div className="w-16 h-16 rounded-2xl bg-red-950/60 border border-red-500/30 flex items-center justify-center text-red-400 mx-auto shadow-xl shadow-red-950/50">
          <AlertCircle className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <div className="text-xs font-mono uppercase tracking-widest text-red-400">
            Playback Render Interruption
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-white">
            Something went wrong.
          </h1>
          <p className="text-sm text-gray-400 max-w-sm mx-auto leading-relaxed">
            An unexpected error occurred while processing this scene. You can attempt to reload the timeline or return to the main stage.
          </p>
        </div>

        {error?.digest && (
          <div className="p-2.5 rounded-xl bg-white/5 border border-white/5 text-[11px] font-mono text-gray-500 max-w-xs mx-auto">
            Digest Code: {error.digest}
          </div>
        )}

        <div className="pt-2 flex items-center justify-center gap-3">
          <Button
            onClick={() => reset()}
            variant="primary"
            size="md"
            icon={<RotateCcw className="w-4 h-4" />}
          >
            Reload Scene
          </Button>

          <Button
            href="/"
            variant="secondary"
            size="md"
            icon={<Home className="w-4 h-4" />}
          >
            Studio Home
          </Button>
        </div>
      </div>
    </div>
  );
}
