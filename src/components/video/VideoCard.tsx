'use client';

import React from 'react';
import Image from 'next/image';
import { Project } from '@/types';
import { Play, Clock, ArrowUpRight } from 'lucide-react';
import { Badge } from '../ui/Badge';

interface VideoCardProps {
  project: Project;
  onSelect: (project: Project) => void;
  priority?: boolean;
}

export const VideoCard: React.FC<VideoCardProps> = ({
  project,
  onSelect,
  priority = false,
}) => {
  const isVertical = project.aspectRatio === '9:16';

  return (
    <div
      onClick={() => onSelect(project)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onSelect(project);
        }
      }}
      className="group relative flex flex-col rounded-2xl bg-[#14141A] border border-white/10 hover:border-violet-500/40 overflow-hidden transition-all duration-300 hover:shadow-2xl hover:shadow-violet-950/40 hover:-translate-y-1 cursor-pointer focus:outline-none focus:ring-2 focus:ring-violet-500/60"
    >
      {/* Thumbnail Container */}
      <div className={`relative w-full overflow-hidden bg-[#0A0A0E] ${isVertical ? 'aspect-[4/5] sm:aspect-[9/16] max-h-[460px]' : 'aspect-video'}`}>
        <Image
          src={project.thumbnailUrl}
          alt={project.title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          priority={priority}
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />

        {/* Gradient vignette */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#14141A] via-transparent to-black/30 opacity-70 group-hover:opacity-90 transition-opacity" />

        {/* Top Badges */}
        <div className="absolute top-3 inset-x-3 flex items-center justify-between z-10 pointer-events-none">
          <Badge variant="purple" size="sm">
            {project.categoryLabel}
          </Badge>
          <div className="flex items-center gap-1.5">
            <span className="px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-md text-[10px] font-mono text-gray-300 border border-white/10">
              {project.aspectRatio}
            </span>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-md text-[10px] font-mono text-gray-300 border border-white/10">
              <Clock className="w-2.5 h-2.5 text-violet-400" />
              {project.duration}
            </span>
          </div>
        </div>

        {/* Play Button Overlay on Hover */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 transform scale-90 group-hover:scale-100 z-10">
          <div className="w-14 h-14 rounded-full bg-violet-600/90 text-white flex items-center justify-center shadow-2xl shadow-violet-800/80 backdrop-blur-md border border-violet-400/40">
            <Play className="w-6 h-6 fill-current ml-0.5" />
          </div>
        </div>

        {/* Playable or Showcase Tag */}
        <div className="absolute bottom-3 left-3 z-10">
          {project.hasPlayableMedia ? (
            <span className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-md bg-emerald-950/80 text-emerald-300 border border-emerald-500/30 backdrop-blur-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Play Video
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-md bg-amber-950/80 text-amber-300 border border-amber-500/30 backdrop-blur-sm">
              Specs Showcase
            </span>
          )}
        </div>
      </div>

      {/* Card Content */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <div className="text-xs text-gray-400 font-medium tracking-wide mb-1 flex items-center justify-between">
            <span>{project.client}</span>
            <span className="text-[11px] text-gray-500">{project.year}</span>
          </div>

          <h3 className="text-base sm:text-lg font-bold text-white group-hover:text-violet-300 transition-colors line-clamp-1">
            {project.title}
          </h3>

          <p className="mt-2 text-xs sm:text-sm text-gray-400 line-clamp-2 leading-relaxed">
            {project.description}
          </p>
        </div>

        <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-1.5 flex-wrap">
            {project.toolsUsed.slice(0, 2).map((tool, idx) => (
              <span
                key={idx}
                className="text-[10px] px-2 py-0.5 rounded bg-white/5 text-gray-400 font-mono border border-white/5"
              >
                {tool}
              </span>
            ))}
            {project.toolsUsed.length > 2 && (
              <span className="text-[10px] text-gray-500">
                +{project.toolsUsed.length - 2}
              </span>
            )}
          </div>

          <span className="text-violet-400 text-xs font-medium inline-flex items-center gap-0.5 group-hover:translate-x-0.5 transition-transform">
            View <ArrowUpRight className="w-3.5 h-3.5" />
          </span>
        </div>
      </div>
    </div>
  );
};
