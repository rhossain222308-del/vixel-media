'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  User, 
  Film, 
  Globe, 
  Layers, 
  Sparkles, 
  Mail, 
  Settings, 
  ExternalLink,
  ChevronRight,
  ShieldCheck
} from 'lucide-react';

interface DashboardSidebarProps {
  founderName: string;
  founderRole: string;
  inquiriesCount?: number;
  isOpenMobile?: boolean;
  onCloseMobile?: () => void;
}

export const DashboardSidebar: React.FC<DashboardSidebarProps> = ({
  founderName,
  founderRole,
  inquiriesCount = 0,
  isOpenMobile = false,
  onCloseMobile,
}) => {
  const pathname = usePathname();

  const navItems = [
    {
      title: 'Studio Overview',
      href: '/dashboard',
      icon: LayoutDashboard,
      exact: true,
    },
    {
      title: 'My Profile',
      href: '/dashboard/profile',
      icon: User,
      badge: 'Personal',
    },
    {
      title: 'My Portfolio',
      href: '/dashboard/portfolio',
      icon: Film,
      badge: 'Personal',
    },
    {
      title: 'Shared Website CMS',
      href: '/dashboard/website',
      icon: Globe,
      badge: 'Shared',
    },
    {
      title: 'Shared Services',
      href: '/dashboard/services',
      icon: Layers,
      badge: 'Shared',
    },
    {
      title: 'Testimonials',
      href: '/dashboard/testimonials',
      icon: Sparkles,
      badge: 'Shared',
    },
    {
      title: 'Inquiries Desk',
      href: '/dashboard/inquiries',
      icon: Mail,
      count: inquiriesCount,
    },
    {
      title: 'Studio Settings',
      href: '/dashboard/settings',
      icon: Settings,
    },
  ];

  const sidebarContent = (
    <div className="flex flex-col h-full bg-[#101015] border-r border-white/10 text-white select-none">
      {/* Brand Header */}
      <div className="p-5 border-b border-white/10 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-violet-600 to-purple-500 flex items-center justify-center text-white shadow-md shadow-violet-900/40 group-hover:scale-105 transition-transform">
            <Film className="w-4 h-4" />
          </div>
          <div>
            <div className="text-sm font-extrabold tracking-wider text-white">
              VIXEL<span className="text-violet-400">STUDIO</span>
            </div>
            <div className="text-[9px] uppercase tracking-widest text-gray-500 font-mono">
              Co-Founder Admin
            </div>
          </div>
        </Link>
      </div>

      {/* Founder Badge Banner */}
      <div className="p-4 mx-3 my-3 rounded-2xl bg-[#161620] border border-white/5 flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-violet-600/20 border border-violet-500/30 flex items-center justify-center text-violet-300 text-xs font-bold shrink-0">
          {founderName
            .split(' ')
            .map((n) => n[0])
            .join('')
            .slice(0, 2)
            .toUpperCase() || 'FM'}
        </div>
        <div className="min-w-0 flex-1">
          <div className="text-xs font-bold text-white truncate">{founderName}</div>
          <div className="text-[10px] text-gray-400 truncate">{founderRole}</div>
        </div>
        <div title="Authorized Co-Founder Account">
          <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
        </div>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 px-3 py-2 space-y-1 overflow-y-auto">
        <div className="px-3 py-1.5 text-[10px] uppercase font-mono tracking-wider text-gray-500 font-semibold">
          Studio Navigation
        </div>

        {navItems.map((item) => {
          const isActive = item.exact
            ? pathname === item.href
            : pathname.startsWith(item.href);
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onCloseMobile}
              className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all group ${
                isActive
                  ? 'bg-violet-600 text-white shadow-md shadow-violet-900/40 font-semibold'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon
                  className={`w-4 h-4 transition-transform group-hover:scale-110 ${
                    isActive ? 'text-white' : 'text-gray-400 group-hover:text-violet-400'
                  }`}
                />
                <span>{item.title}</span>
              </div>

              <div className="flex items-center gap-1.5">
                {item.count !== undefined && item.count > 0 && (
                  <span className="px-1.5 py-0.5 rounded-full bg-violet-500 text-white text-[10px] font-mono font-bold">
                    {item.count}
                  </span>
                )}
                {item.badge && !isActive && (
                  <span className="text-[9px] px-1.5 py-0.5 rounded bg-white/5 text-gray-400 font-mono">
                    {item.badge}
                  </span>
                )}
                <ChevronRight
                  className={`w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity ${
                    isActive ? 'opacity-100 text-white' : 'text-gray-500'
                  }`}
                />
              </div>
            </Link>
          );
        })}
      </div>

      {/* Footer link to public website */}
      <div className="p-4 border-t border-white/10 space-y-2">
        <Link
          href="/"
          target="_blank"
          className="flex items-center justify-between p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-xs text-gray-300 hover:text-white transition-colors group"
        >
          <span className="flex items-center gap-2">
            <ExternalLink className="w-3.5 h-3.5 text-violet-400" />
            <span>Open Public Site</span>
          </span>
          <span className="text-[10px] text-gray-500 group-hover:text-gray-300">↗</span>
        </Link>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar (visible on md+) */}
      <aside className="hidden md:flex flex-col w-64 shrink-0 fixed inset-y-0 left-0 z-30">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer Backdrop */}
      {isOpenMobile && (
        <div
          onClick={onCloseMobile}
          className="md:hidden fixed inset-0 z-40 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200"
        />
      )}

      {/* Mobile Drawer Sidebar */}
      <aside
        className={`md:hidden fixed inset-y-0 left-0 z-50 w-72 transform transition-transform duration-300 ease-in-out ${
          isOpenMobile ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {sidebarContent}
      </aside>
    </>
  );
};
