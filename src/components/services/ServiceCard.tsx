'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Service } from '@/types';
import { CheckCircle2, ArrowRight, Clock, Monitor } from 'lucide-react';
import { Badge } from '../ui/Badge';

interface ServiceCardProps {
  service: Service;
  detailed?: boolean;
}

export const ServiceCard: React.FC<ServiceCardProps> = ({
  service,
  detailed = false,
}) => {
  return (
    <div
      id={service.slug}
      className="group relative flex flex-col rounded-3xl bg-[#14141A] border border-white/10 hover:border-violet-500/40 overflow-hidden transition-all duration-300 hover:shadow-2xl hover:shadow-violet-950/40"
    >
      {/* Service Header Visual */}
      <div className="relative h-48 sm:h-52 w-full overflow-hidden bg-black">
        <Image
          src={service.thumbnailUrl}
          alt={service.title}
          fill
          className="object-cover opacity-40 group-hover:scale-105 transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#14141A] via-[#14141A]/50 to-transparent" />

        <div className="absolute top-4 left-4 z-10">
          <Badge variant="purple" size="sm">
            {service.badge}
          </Badge>
        </div>

        <div className="absolute bottom-4 left-5 right-5 z-10">
          <h3 className="text-xl sm:text-2xl font-bold text-white group-hover:text-violet-300 transition-colors">
            {service.title}
          </h3>
        </div>
      </div>

      {/* Service Details Body */}
      <div className="p-6 sm:p-7 flex-1 flex flex-col justify-between">
        <div>
          <p className="text-sm text-gray-300 leading-relaxed">
            {detailed ? service.fullDescription : service.shortDescription}
          </p>

          {/* Turnaround metadata */}
          <div className="mt-4 flex items-center gap-2 text-xs text-gray-400">
            <Clock className="w-3.5 h-3.5 text-violet-400" />
            <span>Turnaround: <strong className="text-gray-300">{service.turnaroundTime}</strong></span>
          </div>

          {/* Deliverables */}
          <div className="mt-5">
            <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2.5">
              Deliverables & Specs
            </div>
            <ul className="space-y-2">
              {service.deliverables.slice(0, detailed ? 6 : 4).map((item, idx) => (
                <li key={idx} className="flex items-start gap-2.5 text-xs text-gray-300">
                  <CheckCircle2 className="w-3.5 h-3.5 text-violet-400 mt-0.5 shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Intended Platforms */}
          <div className="mt-5 pt-4 border-t border-white/5">
            <div className="text-[11px] text-gray-500 font-medium mb-2 flex items-center gap-1.5">
              <Monitor className="w-3 h-3 text-violet-400" />
              Intended Platforms:
            </div>
            <div className="flex flex-wrap gap-1.5">
              {service.intendedPlatforms.map((platform, idx) => (
                <span
                  key={idx}
                  className="text-[11px] px-2 py-0.5 rounded-md bg-white/5 text-gray-300 border border-white/5"
                >
                  {platform}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="mt-6 pt-5 border-t border-white/10 flex items-center justify-between">
          <Link
            href={`/contact?service=${encodeURIComponent(service.title)}`}
            className="text-xs sm:text-sm font-semibold text-violet-400 hover:text-violet-300 inline-flex items-center gap-1.5 group-hover:translate-x-1 transition-all"
          >
            <span>Request This Service</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          <span className="text-[11px] text-gray-500 font-mono">Bespoke Scope</span>
        </div>
      </div>
    </div>
  );
};
