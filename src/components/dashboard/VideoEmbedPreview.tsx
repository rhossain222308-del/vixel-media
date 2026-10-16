'use client';

import React from 'react';
import { Film, AlertCircle, CheckCircle2 } from 'lucide-react';
import { parseVideoUrl } from '@/lib/video';

interface VideoEmbedPreviewProps {
  videoUrl: string;
}

export const VideoEmbedPreview: React.FC<VideoEmbedPreviewProps> = ({ videoUrl }) => {
  if (!videoUrl || videoUrl.trim() === '') {
    return (
      <div className="aspect-video rounded-2xl bg-[#0F0F14] border border-white/10 flex flex-col items-center justify-center text-center p-6 text-gray-500">
        <Film className="w-8 h-8 mb-2 text-gray-600" />
        <span className="text-xs font-semibold text-gray-400">Video Player Preview</span>
        <span className="text-[11px] text-gray-600 mt-1">
          Supports YouTube, Vimeo, and direct MP4/WebM video links.
        </span>
      </div>
    );
  }

  const parsed = parseVideoUrl(videoUrl);

  if (!parsed.isValid || !parsed.embedUrl) {
    return (
      <div className="p-4 rounded-2xl bg-amber-950/40 border border-amber-500/30 flex items-start gap-3 text-amber-200 text-xs">
        <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
        <div>
          <span className="font-semibold block text-white">Unrecognized Video URL Format</span>
          <p className="mt-0.5 text-amber-300/80">
            Please provide a valid YouTube watch/embed/shorts URL, a Vimeo video URL, or a direct HTTPS link ending in .mp4 or .webm.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div className="relative aspect-video rounded-2xl overflow-hidden bg-black border border-white/15 shadow-xl">
        {parsed.type === 'direct' ? (
          <video
            src={parsed.embedUrl}
            controls
            playsInline
            preload="metadata"
            className="w-full h-full object-contain"
          />
        ) : (
          <iframe
            src={parsed.embedUrl}
            title="Video Player Preview"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            sandbox="allow-scripts allow-same-origin allow-presentation allow-forms"
            className="w-full h-full border-0"
          />
        )}
      </div>

      <div className="flex items-center gap-1.5 text-[11px] text-emerald-400">
        <CheckCircle2 className="w-3.5 h-3.5" />
        <span className="capitalize">Verified {parsed.type} stream preview active</span>
      </div>
    </div>
  );
};
