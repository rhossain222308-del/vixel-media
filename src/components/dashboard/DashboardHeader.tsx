'use client';

import React, { useTransition } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  Menu, 
  ExternalLink, 
  LogOut
} from 'lucide-react';
import { logoutAction } from '@/lib/actions/auth';

interface DashboardHeaderProps {
  founderName: string;
  founderRole: string;
  founderAvatar?: string;
  isConfigured: boolean;
  onOpenMobile?: () => void;
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  founderName,
  founderRole,
  founderAvatar,
  isConfigured,
  onOpenMobile,
}) => {
  const [isLoggingOut, startLogoutTransition] = useTransition();

  const handleLogout = () => {
    startLogoutTransition(async () => {
      await logoutAction();
    });
  };

  const initials = founderName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase() || 'FM';

  return (
    <header className="sticky top-0 z-20 h-16 bg-[#0E0E14]/80 backdrop-blur-md border-b border-white/10 px-4 sm:px-6 flex items-center justify-between">
      {/* Left side: Mobile Toggle & Status */}
      <div className="flex items-center gap-3">
        {onOpenMobile && (
          <button
            type="button"
            onClick={onOpenMobile}
            aria-label="Open mobile menu"
            className="md:hidden p-2 rounded-xl text-gray-400 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
          >
            <Menu className="w-5 h-5" />
          </button>
        )}

        {/* Studio Connection Status Pill */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs">
          <span
            className={`w-2 h-2 rounded-full ${
              isConfigured
                ? 'bg-emerald-400 animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.6)]'
                : 'bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.5)]'
            }`}
          />
          <span className="font-mono text-[11px] text-gray-300 hidden sm:inline">
            {isConfigured ? 'Supabase Live Connected' : 'Offline Preview Mode'}
          </span>
          <span className="font-mono text-[11px] text-gray-300 sm:hidden">
            {isConfigured ? 'Live' : 'Offline'}
          </span>
        </div>
      </div>

      {/* Right side: Actions, Founder Profile & Logout */}
      <div className="flex items-center gap-2 sm:gap-4">
        {/* Public Website Shortcut */}
        <Link
          href="/"
          target="_blank"
          className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium text-gray-300 hover:text-white bg-white/5 hover:bg-white/10 transition-colors border border-white/5"
        >
          <ExternalLink className="w-3.5 h-3.5 text-violet-400" />
          <span>View Live Site</span>
        </Link>

        {/* Current Founder Capsule */}
        <div className="flex items-center gap-2.5 pl-2 sm:pl-3 border-l border-white/10">
          <div className="relative w-8 h-8 rounded-full overflow-hidden bg-violet-600/20 border border-violet-500/30 flex items-center justify-center shrink-0">
            {founderAvatar ? (
              <Image
                src={founderAvatar}
                alt={founderName}
                fill
                className="object-cover"
                sizes="32px"
              />
            ) : (
              <span className="text-violet-300 text-xs font-bold">{initials}</span>
            )}
          </div>
          <div className="hidden lg:block text-left">
            <div className="text-xs font-semibold text-white truncate max-w-[140px]">
              {founderName}
            </div>
            <div className="text-[10px] text-gray-400 truncate max-w-[140px]">
              {founderRole}
            </div>
          </div>
        </div>

        {/* Secure Logout Button */}
        <button
          type="button"
          onClick={handleLogout}
          disabled={isLoggingOut}
          title="Sign out of co-founder portal"
          className="p-2 sm:px-3 sm:py-1.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 hover:text-red-300 text-xs font-medium transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">
            {isLoggingOut ? 'Signing out...' : 'Sign Out'}
          </span>
        </button>
      </div>
    </header>
  );
};
