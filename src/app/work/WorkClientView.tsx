'use client';

import React, { useState, useMemo } from 'react';
import { Project, ProjectCategory } from '@/types';
import { VideoCard } from '@/components/video/VideoCard';
import { VideoPlayerModal } from '@/components/video/VideoPlayerModal';
import { PortfolioFilter } from '@/components/portfolio/PortfolioFilter';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Film } from 'lucide-react';
import Link from 'next/link';

interface WorkClientViewProps {
  initialProjects: Project[];
}

export function WorkClientView({ initialProjects }: WorkClientViewProps) {
  const [activeCategory, setActiveCategory] = useState<ProjectCategory>('all');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Filter projects by category using real state
  const filteredProjects = useMemo(() => {
    if (activeCategory === 'all') {
      return initialProjects;
    }
    return initialProjects.filter((p) => p.category === activeCategory);
  }, [activeCategory, initialProjects]);

  // Compute counts for each category
  const categoryCounts = useMemo(() => {
    const counts: Record<ProjectCategory, number> = {
      'all': initialProjects.length,
      'reels': initialProjects.filter((p) => p.category === 'reels').length,
      'long-form': initialProjects.filter((p) => p.category === 'long-form').length,
      'ads': initialProjects.filter((p) => p.category === 'ads').length,
      'motion-graphics': initialProjects.filter((p) => p.category === 'motion-graphics').length,
    };
    return counts;
  }, [initialProjects]);

  const handleOpenProject = (project: Project) => {
    setSelectedProject(project);
    setIsModalOpen(true);
  };

  return (
    <div className="py-12 sm:py-16 md:py-24">
      {/* Video Playback Modal */}
      <VideoPlayerModal
        project={selectedProject}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />

      {/* Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center max-w-3xl">
        <div className="flex items-center justify-center gap-2 mb-3">
          <Badge variant="purple">Agency Catalog</Badge>
          <Badge variant="sample" size="sm">Live Connected / Staged</Badge>
        </div>
        <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold text-white tracking-tight leading-tight">
          Selected <span className="text-gradient">Agency Works.</span>
        </h1>
        <p className="mt-4 text-base sm:text-lg text-gray-300 leading-relaxed">
          Browse our complete catalog of video productions, commercial spots, high-retention vertical reels, and 3D map cartography.
        </p>
      </div>

      {/* Filter Tabs Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 sm:mt-16">
        <div className="p-2 sm:p-3 rounded-2xl bg-[#14141B] border border-white/10 max-w-3xl mx-auto">
          <PortfolioFilter
            activeCategory={activeCategory}
            onSelectCategory={setActiveCategory}
            counts={categoryCounts}
          />
        </div>

        {/* Filter Feedback Bar */}
        <div className="flex items-center justify-between text-xs text-gray-400 mt-6 max-w-7xl mx-auto px-2">
          <span>
            Showing <strong className="text-white">{filteredProjects.length}</strong> project{filteredProjects.length === 1 ? '' : 's'} in category
          </span>
          {activeCategory !== 'all' && (
            <button
              onClick={() => setActiveCategory('all')}
              className="text-violet-400 hover:text-violet-300 transition-colors underline cursor-pointer"
            >
              Reset filter
            </button>
          )}
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mt-8">
          {filteredProjects.map((project) => (
            <VideoCard
              key={project.id}
              project={project}
              onSelect={handleOpenProject}
            />
          ))}
        </div>

        {/* Empty State */}
        {filteredProjects.length === 0 && (
          <div className="py-20 text-center rounded-3xl bg-[#14141B] border border-white/10 mt-8">
            <Film className="w-12 h-12 text-gray-500 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-white">No projects found in this category</h3>
            <p className="text-sm text-gray-400 mt-1 max-w-sm mx-auto">
              Try selecting a different filter category or reset to view all agency projects.
            </p>
            <Button
              variant="secondary"
              size="sm"
              className="mt-5"
              onClick={() => setActiveCategory('all')}
            >
              Show All Works
            </Button>
          </div>
        )}

        {/* Co-founder personal portfolios cross-link */}
        <div className="mt-20 p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-violet-950/40 via-purple-950/20 to-black/60 border border-violet-500/20 text-center max-w-4xl mx-auto">
          <Badge variant="purple" className="mb-3">Founder Portfolios</Badge>
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">
            Looking for personal co-founder credentials?
          </h2>
          <p className="text-sm sm:text-base text-gray-300 max-w-2xl mx-auto mb-6">
            Both of our co-founders maintain individual personal portfolios displaying specialized tools, skill proficiencies, and dedicated reels.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link href="/portfolio/alex-vance">
              <Button variant="primary" size="md">
                View Alex Vance (Lead Editor)
              </Button>
            </Link>
            <Link href="/portfolio/marcus-chen">
              <Button variant="secondary" size="md">
                View Marcus Chen (Motion & 3D Maps)
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
