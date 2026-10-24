'use client';

import React from 'react';
import { usePathname } from 'next/navigation';

export function MainWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isDashboard = pathname.startsWith('/dashboard');

  return (
    <main
      id="main-content"
      className={`flex-1 ${isDashboard ? 'pt-0' : 'pt-20'}`}
    >
      {children}
    </main>
  );
}
