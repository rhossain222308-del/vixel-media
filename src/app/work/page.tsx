'use client';

import React, { useState, useMemo } from 'react';
import { Project, ProjectCategory } from '@/types';
import { sampleProjects } from '@/data/projects';
import { VideoCard } from '@/components/video/VideoCard';
import { VideoPlayerModal } from '@/components/video/VideoPlayerModal';
import { PortfolioFilter } from '@/components/portfolio/PortfolioFilter';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Film } from 'lucide-react';

export default function WorkPage() {
  const [activeCategory, setActiveCategory] = useState<ProjectCategory>('all');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Filter projects by category using real state
  const filteredProjects = useMemo(() => {
    if (activeCategory === 'all') {
      return sampleProjects;
    }
    return sampleProjects.filter((p) => p.category === activeCategory);
  }, [activeCategory]);

  // Compute counts for each category
  const categoryCounts = useMemo(() => {
    const counts: Record<ProjectCategory, number> = {
      'all': sampleProjects.length,
      'reels': sampleProjects.filter((p) => p.category === 'reels').length,
      'long-form': sampleProjects.filter((p) => p.category === 'long-form').length,
      'ads': sampleProjects.filter((p) => p.category === 'ads').length,
      'motion-graphics': sampleProjects.filter((p) => p.category === 'motion-graphics').length,
    };
    return counts;
  }, []);

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
          <Badge variant="sample" size="sm">Staged For Supabase</Badge>
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
          <span className="font-mono text-violet-400">
            Click any card to launch video player or technical specs
          </span>
        </div>
      </div>

      {/* Projects Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        {filteredProjects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {filteredProjects.map((project) => (
              <VideoCard
                key={project.id}
                project={project}
                onSelect={handleOpenProject}
              />
            ))}
          </div>
        ) : (
          <div className="p-16 rounded-3xl bg-[#14141A] border border-white/10 text-center max-w-md mx-auto my-12">
            <Film className="w-10 h-10 text-gray-500 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-white mb-1">No Projects Found</h3>
            <p className="text-xs text-gray-400 mb-4">
              There are currently no projects matching this category filter.
            </p>
            <Button variant="secondary" size="sm" onClick={() => setActiveCategory('all')}>
              Reset Filter to All
            </Button>
          </div>
        )}
      </div>

      {/* Co-Founder Personal Portfolios Callout */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mt-24">
        <div className="p-8 sm:p-10 rounded-3xl bg-gradient-to-b from-[#181824] to-[#121217] border border-white/10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <span className="text-xs font-mono uppercase tracking-widest text-violet-400">
              Co-Founder Specific Works
            </span>
            <h3 className="text-xl sm:text-2xl font-bold text-white">
              Looking for individual founder portfolios?
            </h3>
            <p className="text-sm text-gray-400 max-w-lg leading-relaxed">
              Explore Alex Vance&apos;s directorial timeline cuts and Marcus Chen&apos;s motion design reel on their dedicated co-founder pages.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 shrink-0">
            <Button href="/portfolio/alex-vance" variant="secondary" size="sm">
              Alex Vance Portfolio
            </Button>
            <Button href="/portfolio/marcus-chen" variant="secondary" size="sm">
              Marcus Chen Portfolio
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
