'use client';

import React from 'react';
import { useSearchParams } from 'next/navigation';
import { 
  Mail, 
  MapPin, 
  MessageCircle, 
  Clock, 
  ShieldCheck, 
  Sparkles
} from 'lucide-react';
import { YoutubeIcon, InstagramIcon, TwitterIcon, LinkedinIcon } from '@/components/ui/SocialIcons';
import { ContactForm } from '@/components/contact/ContactForm';
import { Badge } from '@/components/ui/Badge';

interface ContactPageContentProps {
  contactInfo?: {
    email?: string;
    whatsapp?: string;
    location?: string;
    instagram?: string;
    youtube?: string;
    linkedin?: string;
    twitter?: string;
  };
}

export function ContactPageContent({ contactInfo }: ContactPageContentProps) {
  const searchParams = useSearchParams();
  const preselectedService = searchParams.get('service') || '';
  const preselectedFounder = searchParams.get('founder') || '';
  const preselectedScope = searchParams.get('scope') || '';

  return (
    <div className="py-12 sm:py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <Badge variant="purple" className="mb-4">
            Start a Conversation
          </Badge>
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold text-white tracking-tight leading-tight">
            Let&apos;s Build Something <span className="text-gradient">Powerful.</span>
          </h1>
          <p className="mt-4 text-base sm:text-lg text-gray-300 leading-relaxed">
            Fill out the project inquiry below or reach out directly. We review new project briefs and respond with turnaround estimates within 24 business hours.
          </p>

          {(preselectedService || preselectedFounder || preselectedScope) && (
            <div className="mt-4 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-violet-950/60 border border-violet-500/30 text-xs text-violet-300">
              <Sparkles className="w-3.5 h-3.5" />
              <span>
                Inquiry focused on:{' '}
                <strong className="text-white">
                  {preselectedService || preselectedFounder || preselectedScope}
                </strong>
              </span>
            </div>
          )}
        </div>

        {/* 2-Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14">
          {/* Contact Form Column */}
          <div className="lg:col-span-7">
            <ContactForm initialService={preselectedService} />
          </div>

          {/* Contact Details & Direct Channels Column */}
          <div className="lg:col-span-5 space-y-6">
            {/* Quick Contact Card */}
            <div className="p-7 sm:p-8 rounded-3xl bg-[#14141B] border border-white/10 space-y-6">
              <h3 className="text-xl font-bold text-white">
                Direct Channels
              </h3>

              <div className="space-y-4">
                {/* Email */}
                <a
                  href={`mailto:${contactInfo?.email || 'contact@vixelmedia.com'}`}
                  className="flex items-start gap-3.5 p-3.5 rounded-2xl bg-white/5 border border-white/5 hover:border-violet-500/30 hover:bg-white/10 transition-colors group"
                >
                  <div className="p-2.5 rounded-xl bg-violet-600/20 text-violet-400 group-hover:scale-110 transition-transform">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs text-gray-400">Direct Inquiries</div>
                    <div className="text-sm font-semibold text-white">{contactInfo?.email || 'contact@vixelmedia.com'}</div>
                    <div className="text-[11px] text-gray-500 mt-0.5">Average response: &lt; 4 hours</div>
                  </div>
                </a>

                {/* WhatsApp */}
                <a
                  href={contactInfo?.whatsapp ? `https://wa.me/${contactInfo.whatsapp.replace(/[^0-9]/g, '')}` : 'https://whatsapp.com'}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-start gap-3.5 p-3.5 rounded-2xl bg-white/5 border border-white/5 hover:border-emerald-500/30 hover:bg-white/10 transition-colors group"
                >
                  <div className="p-2.5 rounded-xl bg-emerald-600/20 text-emerald-400 group-hover:scale-110 transition-transform">
                    <MessageCircle className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs text-gray-400">Instant Chat & Production Desk</div>
                    <div className="text-sm font-semibold text-white">{contactInfo?.whatsapp || 'WhatsApp Studio Desk'}</div>
                    <div className="text-[11px] text-gray-500 mt-0.5">Click to chat with editorial leads</div>
                  </div>
                </a>

                {/* Studio Location */}
                <div className="flex items-start gap-3.5 p-3.5 rounded-2xl bg-white/5 border border-white/5">
                  <div className="p-2.5 rounded-xl bg-violet-600/20 text-violet-400">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs text-gray-400">Locations & Studio Operations</div>
                    <div className="text-sm font-semibold text-white">{contactInfo?.location || 'Los Angeles, CA & Remote Global'}</div>
                    <div className="text-[11px] text-gray-500 mt-0.5">Working across PST, EST & European timezones</div>
                  </div>
                </div>
              </div>

              {/* Social Channels */}
              <div className="pt-4 border-t border-white/10">
                <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
                  Connect on Socials:
                </div>
                <div className="flex items-center gap-2.5">
                  <a
                    href={contactInfo?.youtube || 'https://youtube.com'}
                    target="_blank"
                    rel="noreferrer"
                    aria-label="YouTube"
                    className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white border border-white/5"
                  >
                    <YoutubeIcon size={16} />
                  </a>
                  <a
                    href={contactInfo?.instagram || 'https://instagram.com'}
                    target="_blank"
                    rel="noreferrer"
                    aria-label="Instagram"
                    className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white border border-white/5"
                  >
                    <InstagramIcon size={16} />
                  </a>
                  <a
                    href={contactInfo?.twitter || 'https://x.com'}
                    target="_blank"
                    rel="noreferrer"
                    aria-label="X"
                    className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white border border-white/5"
                  >
                    <TwitterIcon size={14} />
                  </a>
                  <a
                    href={contactInfo?.linkedin || 'https://linkedin.com'}
                    target="_blank"
                    rel="noreferrer"
                    aria-label="LinkedIn"
                    className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white border border-white/5"
                  >
                    <LinkedinIcon size={16} />
                  </a>
                </div>
              </div>
            </div>

            {/* Production Guarantees Card */}
            <div className="p-7 sm:p-8 rounded-3xl bg-gradient-to-b from-[#181824] to-[#121217] border border-white/10 space-y-4">
              <h4 className="text-base font-bold text-white flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-violet-400" />
                The Vixel Commitment
              </h4>

              <div className="space-y-3 text-xs text-gray-300 leading-relaxed">
                <div className="flex items-start gap-2">
                  <Clock className="w-3.5 h-3.5 text-violet-400 mt-0.5 shrink-0" />
                  <span><strong>Guaranteed Delivery Dates:</strong> We never take on more projects than our editorial schedule can comfortably master.</span>
                </div>
                <div className="flex items-start gap-2">
                  <ShieldCheck className="w-3.5 h-3.5 text-violet-400 mt-0.5 shrink-0" />
                  <span><strong>Strict Confidentiality:</strong> NDAs signed before unreleased product launches or sensitive creator interviews.</span>
                </div>
                <div className="flex items-start gap-2">
                  <Sparkles className="w-3.5 h-3.5 text-violet-400 mt-0.5 shrink-0" />
                  <span><strong>Full Commercial Licensing:</strong> Broadcast and online rights included with all soundtrack and sound effect deliverables.</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
