'use client';

import React, { useState } from 'react';
import { DashboardSidebar } from './DashboardSidebar';
import { DashboardHeader } from './DashboardHeader';

interface DashboardLayoutClientProps {
  founderName: string;
  founderRole: string;
  founderAvatar?: string;
  inquiriesCount: number;
  isConfigured: boolean;
  children: React.ReactNode;
}

export const DashboardLayoutClient: React.FC<DashboardLayoutClientProps> = ({
  founderName,
  founderRole,
  founderAvatar,
  inquiriesCount,
  isConfigured,
  children,
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#0A0A0E] text-white flex">
      {/* Sidebar Navigation */}
      <DashboardSidebar
        founderName={founderName}
        founderRole={founderRole}
        inquiriesCount={inquiriesCount}
        isOpenMobile={isMobileMenuOpen}
        onCloseMobile={() => setIsMobileMenuOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 md:pl-64 flex flex-col min-w-0">
        <DashboardHeader
          founderName={founderName}
          founderRole={founderRole}
          founderAvatar={founderAvatar}
          isConfigured={isConfigured}
          onOpenMobile={() => setIsMobileMenuOpen(true)}
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto animate-in fade-in duration-200">
          {children}
        </main>
      </div>
    </div>
  );
};
