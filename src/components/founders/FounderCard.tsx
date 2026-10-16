'use client';

import React from 'react';
import Image from 'next/image';
import { Founder } from '@/types';
import { ArrowRight, Sparkles, MapPin } from 'lucide-react';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';

interface FounderCardProps {
  founder: Founder;
}

export const FounderCard: React.FC<FounderCardProps> = ({ founder }) => {
  return (
    <div className="group relative flex flex-col rounded-3xl bg-[#14141A] border border-white/10 hover:border-violet-500/40 overflow-hidden transition-all duration-300 hover:shadow-2xl hover:shadow-violet-950/40">
      {/* Top Banner & Photo Area */}
      <div className="relative h-64 sm:h-72 w-full overflow-hidden bg-black">
        {founder.coverUrl && (
          <Image
            src={founder.coverUrl}
            alt=""
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover opacity-30 group-hover:scale-105 transition-transform duration-700"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#14141A] via-[#14141A]/60 to-transparent" />

        {/* Founder Portrait Circle */}
        <div className="absolute bottom-4 left-6 flex items-end gap-4 z-10">
          <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden border-2 border-violet-500/40 shadow-xl bg-gray-900 shrink-0">
            <Image
              src={founder.avatarUrl}
              alt={founder.name}
              fill
              sizes="96px"
              className="object-cover"
            />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Badge variant="sample" size="sm">Sample Profile</Badge>
              <span className="text-[11px] text-gray-400 flex items-center gap-1">
                <MapPin className="w-3 h-3 text-violet-400" />
                {founder.location}
              </span>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-white group-hover:text-violet-300 transition-colors">
              {founder.name}
            </h3>
            <p className="text-xs sm:text-sm text-violet-400 font-medium">
              {founder.role}
            </p>
          </div>
        </div>
      </div>

      {/* Founder Details Body */}
      <div className="p-6 sm:p-7 flex-1 flex flex-col justify-between">
        <div>
          <p className="text-sm text-gray-300 leading-relaxed italic border-l-2 border-violet-500/50 pl-3.5 my-2">
            &ldquo;{founder.tagline}&rdquo;
          </p>

          <p className="text-sm text-gray-400 mt-3 leading-relaxed">
            {founder.shortBio}
          </p>

          {/* Key Skills */}
          <div className="mt-5">
            <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-violet-400" />
              Core Competencies
            </div>
            <div className="flex flex-wrap gap-1.5">
              {founder.skills.slice(0, 3).map((skill, idx) => (
                <span
                  key={idx}
                  className="text-xs px-2.5 py-1 rounded-lg bg-white/5 border border-white/5 text-gray-300 font-medium"
                >
                  {skill.name}
                </span>
              ))}
            </div>
          </div>

          {/* Tools Used */}
          <div className="mt-4 pt-4 border-t border-white/5 flex items-center justify-between text-xs text-gray-400">
            <span>Primary Tools:</span>
            <span className="font-mono text-violet-300">
              {founder.tools.slice(0, 3).map(t => t.name).join(', ')}
            </span>
          </div>
        </div>

        {/* Action Button */}
        <div className="mt-6 pt-5 border-t border-white/10 flex items-center justify-between">
          <span className="text-xs text-gray-500 font-medium">
            {founder.yearsExperience}+ Years Production
          </span>
          <Button
            href={`/portfolio/${founder.slug}`}
            variant="secondary"
            size="sm"
            icon={<ArrowRight className="w-4 h-4" />}
          >
            View Co-Founder Portfolio
          </Button>
        </div>
      </div>
    </div>
  );
};
