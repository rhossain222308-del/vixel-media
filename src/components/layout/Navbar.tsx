'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Menu, 
  X, 
  Film, 
  ChevronDown, 
  ArrowRight 
} from 'lucide-react';
import { Button } from '../ui/Button';

export const Navbar: React.FC = () => {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [foundersOpen, setFoundersOpen] = useState(false);
  const [prevPathname, setPrevPathname] = useState(pathname);

  if (prevPathname !== pathname) {
    setPrevPathname(pathname);
    setIsOpen(false);
    setFoundersOpen(false);
  }

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Work', href: '/work' },
    { name: 'Services', href: '/services' },
    { name: 'About', href: '/about' },
    { name: 'Testimonials', href: '/testimonials' },
    { name: 'Pricing', href: '/pricing' },
    { name: 'Blog', href: '/blog' },
  ];

  return (
    <header
      className={`fixed top-0 inset-x-0 z-40 transition-all duration-300 ${
        isScrolled
          ? 'bg-[#0B0B0D]/90 backdrop-blur-md border-b border-white/10 shadow-lg shadow-black/40 py-3.5'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Brand Wordmark & Logo */}
        <Link
          href="/"
          className="flex items-center gap-2.5 group focus:outline-none focus:ring-2 focus:ring-violet-500 rounded-lg p-1"
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-violet-600 to-purple-500 flex items-center justify-center text-white shadow-md shadow-violet-900/40 group-hover:shadow-violet-600/50 group-hover:scale-105 transition-all">
            <Film className="w-5 h-5" />
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-extrabold tracking-wider text-white font-sans flex items-center gap-1">
              VIXEL<span className="text-violet-400">MEDIA</span>
            </span>
            <span className="text-[9px] tracking-widest uppercase text-gray-400 font-mono -mt-1">
              Creative Agency
            </span>
          </div>
        </Link>

        {/* Desktop Nav Items */}
        <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.name}
                href={link.href}
                className={`px-3.5 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'text-white bg-white/10'
                    : 'text-gray-300 hover:text-white hover:bg-white/5'
                }`}
              >
                {link.name}
              </Link>
            );
          })}

          {/* Co-Founders Dropdown */}
          <div className="relative group">
            <button
              onMouseEnter={() => setFoundersOpen(true)}
              onClick={() => setFoundersOpen(!foundersOpen)}
              className="flex items-center gap-1 px-3.5 py-1.5 rounded-lg text-sm font-medium text-gray-300 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
            >
              <span>Founders</span>
              <ChevronDown className="w-3.5 h-3.5 text-gray-400 transition-transform group-hover:rotate-180" />
            </button>

            {/* Dropdown Menu */}
            <div
              onMouseLeave={() => setFoundersOpen(false)}
              className={`absolute top-full left-0 mt-2 w-64 p-2 rounded-2xl bg-[#14141B] border border-white/10 shadow-2xl backdrop-blur-xl transition-all duration-200 ${
                foundersOpen ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible -translate-y-2'
              }`}
            >
              <div className="text-[10px] font-mono uppercase text-gray-400 px-3 py-1">
                Co-Founder Portfolios
              </div>
              <Link
                href="/portfolio/alex-vance"
                className="flex items-center gap-2.5 p-2.5 rounded-xl hover:bg-white/5 transition-colors group"
              >
                <div className="w-8 h-8 rounded-lg bg-violet-950/60 border border-violet-500/30 flex items-center justify-center text-violet-400 text-xs font-bold">
                  AV
                </div>
                <div>
                  <div className="text-xs font-semibold text-white group-hover:text-violet-300">
                    Alex Vance
                  </div>
                  <div className="text-[11px] text-gray-400">
                    Lead Editor & Director
                  </div>
                </div>
              </Link>
              <Link
                href="/portfolio/marcus-chen"
                className="flex items-center gap-2.5 p-2.5 rounded-xl hover:bg-white/5 transition-colors group"
              >
                <div className="w-8 h-8 rounded-lg bg-violet-950/60 border border-violet-500/30 flex items-center justify-center text-violet-400 text-xs font-bold">
                  MC
                </div>
                <div>
                  <div className="text-xs font-semibold text-white group-hover:text-violet-300">
                    Marcus Chen
                  </div>
                  <div className="text-[11px] text-gray-400">
                    Head of Motion & VFX
                  </div>
                </div>
              </Link>
            </div>
          </div>
        </nav>

        {/* Action Button & Mobile Menu Toggle */}
        <div className="flex items-center gap-3">
          <Button
            href="/contact"
            variant="primary"
            size="sm"
            icon={<ArrowRight className="w-3.5 h-3.5" />}
            className="hidden sm:inline-flex"
          >
            Get a Quote
          </Button>

          {/* Mobile hamburger */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle navigation menu"
            className="lg:hidden p-2 rounded-xl text-gray-300 hover:text-white hover:bg-white/10 transition-colors focus:outline-none focus:ring-2 focus:ring-violet-500"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isOpen && (
        <div className="lg:hidden fixed inset-x-0 top-[65px] bg-[#0E0E12] border-b border-white/10 shadow-2xl p-6 animate-in slide-in-from-top-4 duration-300">
          <div className="flex flex-col gap-2">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`px-4 py-3 rounded-xl text-base font-medium transition-colors ${
                    isActive
                      ? 'text-white bg-violet-600/20 border border-violet-500/30'
                      : 'text-gray-300 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}

            <div className="pt-2 pb-1 text-xs font-mono uppercase text-gray-500 px-4">
              Co-Founder Portfolios
            </div>
            <Link
              href="/portfolio/alex-vance"
              className="px-4 py-2.5 rounded-xl text-sm font-medium text-gray-300 hover:text-white hover:bg-white/5 flex items-center justify-between"
            >
              <span>Alex Vance (Director & Editorial)</span>
              <span className="text-xs text-violet-400">Portfolio →</span>
            </Link>
            <Link
              href="/portfolio/marcus-chen"
              className="px-4 py-2.5 rounded-xl text-sm font-medium text-gray-300 hover:text-white hover:bg-white/5 flex items-center justify-between"
            >
              <span>Marcus Chen (Motion Design & 3D)</span>
              <span className="text-xs text-violet-400">Portfolio →</span>
            </Link>

            <div className="pt-4 mt-2 border-t border-white/10 flex flex-col gap-2">
              <Button href="/contact" variant="primary" size="md" className="w-full">
                Get a Quote
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
