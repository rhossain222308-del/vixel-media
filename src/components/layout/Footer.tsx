'use client';

import React from 'react';
import Link from 'next/link';
import { 
  Film, 
  Mail, 
  MapPin, 
  ArrowUpRight
} from 'lucide-react';
import { YoutubeIcon, InstagramIcon, TwitterIcon, LinkedinIcon } from '../ui/SocialIcons';
import { Badge } from '../ui/Badge';

export const Footer: React.FC = () => {
  return (
    <footer className="relative bg-[#09090C] border-t border-white/10 pt-16 pb-12 overflow-hidden">
      {/* Background ambient glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-28 bg-violet-600/10 blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8 pb-12 border-b border-white/10">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-violet-600 to-purple-500 flex items-center justify-center text-white shadow-md shadow-violet-900/40">
                <Film className="w-5 h-5" />
              </div>
              <span className="text-xl font-extrabold tracking-wider text-white font-sans">
                VIXEL<span className="text-violet-400">MEDIA</span>
              </span>
            </Link>

            <p className="text-sm text-gray-400 max-w-sm leading-relaxed">
              Creative That Converts. We craft high-impact videos, visuals, and digital experiences for brands and creators across the globe.
            </p>

            <div className="flex items-center gap-3 pt-2">
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noreferrer"
                aria-label="YouTube"
                className="w-9 h-9 rounded-xl bg-white/5 hover:bg-violet-600/20 hover:text-violet-400 border border-white/5 flex items-center justify-center text-gray-400 transition-colors"
              >
                <YoutubeIcon size={16} />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram"
                className="w-9 h-9 rounded-xl bg-white/5 hover:bg-violet-600/20 hover:text-violet-400 border border-white/5 flex items-center justify-center text-gray-400 transition-colors"
              >
                <InstagramIcon size={16} />
              </a>
              <a
                href="https://x.com"
                target="_blank"
                rel="noreferrer"
                aria-label="X / Twitter"
                className="w-9 h-9 rounded-xl bg-white/5 hover:bg-violet-600/20 hover:text-violet-400 border border-white/5 flex items-center justify-center text-gray-400 transition-colors"
              >
                <TwitterIcon size={14} />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noreferrer"
                aria-label="LinkedIn"
                className="w-9 h-9 rounded-xl bg-white/5 hover:bg-violet-600/20 hover:text-violet-400 border border-white/5 flex items-center justify-center text-gray-400 transition-colors"
              >
                <LinkedinIcon size={16} />
              </a>
            </div>

            <div className="pt-2">
              <Badge variant="sample" size="sm">
                Staged Platform Architecture
              </Badge>
            </div>
          </div>

          {/* Quick Links Column */}
          <div>
            <h4 className="text-xs font-semibold text-white uppercase tracking-wider mb-4 font-mono">
              Agency
            </h4>
            <ul className="space-y-2.5 text-sm text-gray-400">
              <li>
                <Link href="/work" className="hover:text-white transition-colors">
                  Agency Portfolio
                </Link>
              </li>
              <li>
                <Link href="/services" className="hover:text-white transition-colors">
                  Our Services
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-white transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/testimonials" className="hover:text-white transition-colors">
                  Client Reviews
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="hover:text-white transition-colors">
                  Custom Pricing
                </Link>
              </li>
            </ul>
          </div>

          {/* Co-Founders & Resources */}
          <div>
            <h4 className="text-xs font-semibold text-white uppercase tracking-wider mb-4 font-mono">
              Founders & Blog
            </h4>
            <ul className="space-y-2.5 text-sm text-gray-400">
              <li>
                <Link href="/portfolio/alex-vance" className="hover:text-white transition-colors flex items-center justify-between group">
                  <span>Alex Vance</span>
                  <span className="text-[10px] text-violet-400 opacity-0 group-hover:opacity-100 transition-opacity">Lead Editor</span>
                </Link>
              </li>
              <li>
                <Link href="/portfolio/marcus-chen" className="hover:text-white transition-colors flex items-center justify-between group">
                  <span>Marcus Chen</span>
                  <span className="text-[10px] text-violet-400 opacity-0 group-hover:opacity-100 transition-opacity">Motion Lead</span>
                </Link>
              </li>
              <li>
                <Link href="/blog" className="hover:text-white transition-colors">
                  Production Blog
                </Link>
              </li>
              <li>
                <Link href="/careers" className="hover:text-white transition-colors">
                  Careers & Talent
                </Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-white transition-colors">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact / Inquiries Column */}
          <div>
            <h4 className="text-xs font-semibold text-white uppercase tracking-wider mb-4 font-mono">
              Get In Touch
            </h4>
            <ul className="space-y-3 text-sm text-gray-400">
              <li className="flex items-start gap-2.5">
                <Mail className="w-4 h-4 text-violet-400 mt-0.5 shrink-0" />
                <span className="text-gray-300">hello@vixelmedia.demo</span>
              </li>
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-violet-400 mt-0.5 shrink-0" />
                <span>Los Angeles & Remote Worldwide</span>
              </li>
              <li className="pt-2">
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-violet-400 hover:text-violet-300"
                >
                  <span>Start Project Inquiry</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Legal & Copyright Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-500">
          <div>
            © {new Date().getFullYear()} Vixel Media Studio. All rights reserved.
          </div>

          <div className="flex items-center gap-6">
            <Link href="/privacy" className="hover:text-gray-300 transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-gray-300 transition-colors">
              Terms of Service
            </Link>
            <Link href="/login" className="text-violet-400 hover:text-violet-300 transition-colors font-medium">
              Founder Portal
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
