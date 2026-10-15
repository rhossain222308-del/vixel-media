'use client';

import React from 'react';
import { ProjectCategory } from '@/types';

interface PortfolioFilterProps {
  activeCategory: ProjectCategory;
  onSelectCategory: (category: ProjectCategory) => void;
  counts: Record<ProjectCategory, number>;
}

export const PortfolioFilter: React.FC<PortfolioFilterProps> = ({
  activeCategory,
  onSelectCategory,
  counts,
}) => {
  const categories: { key: ProjectCategory; label: string }[] = [
    { key: 'all', label: 'All Projects' },
    { key: 'reels', label: 'Reels & Shorts' },
    { key: 'long-form', label: 'Long-form Videos' },
    { key: 'ads', label: 'Commercial Ads' },
    { key: 'motion-graphics', label: 'Motion & 3D Maps' },
  ];

  return (
    <div className="flex items-center justify-start sm:justify-center overflow-x-auto no-scrollbar py-2 px-1 gap-2 sm:gap-3 w-full">
      {categories.map((cat) => {
        const isActive = activeCategory === cat.key;
        const count = counts[cat.key] || 0;

        return (
          <button
            key={cat.key}
            onClick={() => onSelectCategory(cat.key)}
            className={`relative shrink-0 inline-flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-all duration-300 cursor-pointer focus:outline-none focus:ring-2 focus:ring-violet-500/50 ${
              isActive
                ? 'bg-gradient-to-r from-violet-600 to-purple-600 text-white shadow-lg shadow-violet-900/40 border border-violet-400/30'
                : 'bg-[#15151C] text-gray-400 hover:text-white hover:bg-[#1E1E28] border border-white/5'
            }`}
          >
            <span>{cat.label}</span>
            <span
              className={`text-[10px] font-mono px-2 py-0.5 rounded-full transition-colors ${
                isActive
                  ? 'bg-black/30 text-white font-semibold'
                  : 'bg-white/5 text-gray-500'
              }`}
            >
              {count}
            </span>
          </button>
        );
      })}
    </div>
  );
};
