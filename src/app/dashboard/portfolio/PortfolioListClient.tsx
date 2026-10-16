'use client';

import React, { useState, useTransition } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  Plus, 
  Search, 
  Film, 
  Edit3, 
  Trash2, 
  Eye, 
  Star, 
  CheckCircle2, 
  AlertCircle,
  Play,
  X
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { ConfirmModal } from '@/components/dashboard/ConfirmModal';
import { VideoEmbedPreview } from '@/components/dashboard/VideoEmbedPreview';
import { deleteProjectAction, updateProjectAction } from '@/lib/actions/projects';
import type { PortfolioProjectRow } from '@/types/database.types';

interface PortfolioListClientProps {
  initialProjects: PortfolioProjectRow[];
  userId?: string;
}

export function PortfolioListClient({
  initialProjects,
}: PortfolioListClientProps) {
  const [projects, setProjects] = useState<PortfolioProjectRow[]>(initialProjects);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'published' | 'draft'>('all');
  
  // Modal states
  const [previewProject, setPreviewProject] = useState<PortfolioProjectRow | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<PortfolioProjectRow | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [, startTransition] = useTransition();

  // Filter logic
  const filteredProjects = projects.filter((project) => {
    const matchesSearch =
      project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (project.client && project.client.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (project.description && project.description.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCategory =
      selectedCategory === 'all' || project.category === selectedCategory;

    const matchesStatus =
      statusFilter === 'all' || project.status === statusFilter;

    return matchesSearch && matchesCategory && matchesStatus;
  });

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    setFeedback(null);

    const result = await deleteProjectAction(deleteTarget.id);
    setIsDeleting(false);

    if (result.success) {
      setProjects((prev) => prev.filter((p) => p.id !== deleteTarget.id));
      setFeedback({ type: 'success', message: 'Project removed successfully.' });
      setDeleteTarget(null);
    } else {
      setFeedback({ type: 'error', message: result.error || 'Failed to delete project.' });
    }
  };

  const handleToggleStatus = (project: PortfolioProjectRow) => {
    const nextStatus = project.status === 'published' ? 'draft' : 'published';
    setFeedback(null);

    const formData = new FormData();
    formData.append('projectId', project.id);
    formData.append('title', project.title);
    formData.append('category', project.category);
    formData.append('client', project.client || '');
    formData.append('description', project.description || '');
    formData.append('videoUrl', project.video_url || '');
    formData.append('thumbnailUrl', project.thumbnail_url);
    formData.append('platform', project.platform);
    formData.append('duration', project.duration || '');
    formData.append('aspectRatio', project.aspect_ratio || '16:9');
    formData.append('sortOrder', project.sort_order.toString());
    formData.append('status', nextStatus);
    formData.append('featured', project.featured ? 'true' : 'false');

    startTransition(async () => {
      const result = await updateProjectAction(null, formData);
      if (result.success) {
        setProjects((prev) =>
          prev.map((p) => (p.id === project.id ? { ...p, status: nextStatus } : p))
        );
        setFeedback({
          type: 'success',
          message: `Project marked as ${nextStatus === 'published' ? 'Published live' : 'Draft'}.`,
        });
      } else {
        setFeedback({ type: 'error', message: result.error || 'Failed to update status.' });
      }
    });
  };

  const handleToggleFeatured = (project: PortfolioProjectRow) => {
    const nextFeatured = !project.featured;
    setFeedback(null);

    const formData = new FormData();
    formData.append('projectId', project.id);
    formData.append('title', project.title);
    formData.append('category', project.category);
    formData.append('client', project.client || '');
    formData.append('description', project.description || '');
    formData.append('videoUrl', project.video_url || '');
    formData.append('thumbnailUrl', project.thumbnail_url);
    formData.append('platform', project.platform);
    formData.append('duration', project.duration || '');
    formData.append('aspectRatio', project.aspect_ratio || '16:9');
    formData.append('sortOrder', project.sort_order.toString());
    formData.append('status', project.status);
    formData.append('featured', nextFeatured ? 'true' : 'false');

    startTransition(async () => {
      const result = await updateProjectAction(null, formData);
      if (result.success) {
        setProjects((prev) =>
          prev.map((p) => (p.id === project.id ? { ...p, featured: nextFeatured } : p))
        );
        setFeedback({
          type: 'success',
          message: nextFeatured
            ? 'Project marked as Featured spotlight!'
            : 'Removed from featured spotlight.',
        });
      } else {
        setFeedback({ type: 'error', message: result.error || 'Failed to update featured flag.' });
      }
    });
  };

  const categories = [
    { id: 'all', label: 'All Categories' },
    { id: 'reels', label: 'Reels' },
    { id: 'long-form', label: 'Long-form' },
    { id: 'ads', label: 'Commercial Ads' },
    { id: 'motion-graphics', label: 'Motion Graphics' },
  ];

  return (
    <div className="space-y-6">
      {/* Header and Add Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <div className="inline-flex items-center gap-2 mb-1">
            <span className="text-xs font-mono uppercase tracking-wider text-violet-400 font-bold">
              Portfolio Catalog
            </span>
            <span className="text-gray-600">•</span>
            <span className="text-xs text-gray-400">
              {projects.length} {projects.length === 1 ? 'Project' : 'Projects'} in your portfolio
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            Personal Portfolio Manager
          </h1>
          <p className="text-xs sm:text-sm text-gray-400 mt-1">
            Create, edit, preview, and reorder video projects attributed to your co-founder profile.
          </p>
        </div>

        <Link href="/dashboard/portfolio/new">
          <Button className="gap-2 shadow-lg shadow-violet-900/30">
            <Plus className="w-4 h-4" />
            <span>Add New Project</span>
          </Button>
        </Link>
      </div>

      {/* Feedback banner */}
      {feedback && (
        <div
          className={`p-4 rounded-2xl flex items-start gap-3 text-xs animate-in fade-in ${
            feedback.type === 'success'
              ? 'bg-emerald-950/40 border border-emerald-500/30 text-emerald-200'
              : 'bg-red-950/40 border border-red-500/30 text-red-200'
          }`}
        >
          {feedback.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
          ) : (
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
          )}
          <span className="font-medium">{feedback.message}</span>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-2xl bg-[#14141B] border border-white/10 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-2.5 w-4 h-4 text-gray-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search projects by title, client, or keyword..."
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-black/40 border border-white/10 text-white placeholder-gray-500 text-xs focus:outline-none focus:border-violet-500 transition-colors"
          />
        </div>

        {/* Category & Status Filters */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Category Dropdown/Pills */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-gray-300 text-xs focus:outline-none focus:border-violet-500"
          >
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.label}
              </option>
            ))}
          </select>

          {/* Status Pills */}
          <div className="flex rounded-xl bg-black/40 border border-white/10 p-1">
            <button
              type="button"
              onClick={() => setStatusFilter('all')}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${
                statusFilter === 'all'
                  ? 'bg-violet-600 text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              All
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter('published')}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${
                statusFilter === 'published'
                  ? 'bg-violet-600 text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Published
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter('draft')}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${
                statusFilter === 'draft'
                  ? 'bg-violet-600 text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Drafts
            </button>
          </div>
        </div>
      </div>

      {/* Projects Grid */}
      {filteredProjects.length === 0 ? (
        <div className="p-12 text-center rounded-3xl bg-[#14141B] border border-white/10 space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-gray-500 mx-auto">
            <Film className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">No projects found</h3>
            <p className="text-xs text-gray-400 max-w-sm mx-auto mt-1">
              {searchQuery || selectedCategory !== 'all' || statusFilter !== 'all'
                ? 'Try adjusting your search query or filters to find what you are looking for.'
                : 'You have not added any projects yet. Click "+ Add New Project" to get started.'}
            </p>
          </div>
          {(searchQuery || selectedCategory !== 'all' || statusFilter !== 'all') && (
            <Button
              variant="secondary"
              size="sm"
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
                setStatusFilter('all');
              }}
            >
              Clear Filters
            </Button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
            <div
              key={project.id}
              className="rounded-3xl bg-[#14141B] border border-white/10 overflow-hidden hover:border-violet-500/40 transition-all flex flex-col justify-between group shadow-lg"
            >
              {/* Media Thumbnail Container */}
              <div className="relative aspect-video bg-black overflow-hidden">
                <Image
                  src={project.thumbnail_url}
                  alt={project.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />

                {/* Top Overlay Badges */}
                <div className="absolute top-3 left-3 flex items-center gap-1.5">
                  <span className="px-2.5 py-0.5 rounded-full bg-black/75 backdrop-blur-md text-[10px] font-mono text-white capitalize font-semibold">
                    {project.category}
                  </span>
                  {project.featured && (
                    <span className="px-2 py-0.5 rounded-full bg-amber-500/90 text-black text-[10px] font-bold flex items-center gap-1">
                      <Star className="w-3 h-3 fill-current" />
                      <span>Featured</span>
                    </span>
                  )}
                </div>

                {/* Status Badge */}
                <div className="absolute top-3 right-3">
                  <button
                    type="button"
                    onClick={() => handleToggleStatus(project)}
                    title={`Click to switch to ${project.status === 'published' ? 'draft' : 'published'}`}
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold transition-transform hover:scale-105 cursor-pointer backdrop-blur-md ${
                      project.status === 'published'
                        ? 'bg-emerald-500/80 text-white'
                        : 'bg-yellow-500/80 text-black'
                    }`}
                  >
                    {project.status === 'published' ? 'Published' : 'Draft'}
                  </button>
                </div>

                {/* Play / Preview Hover Overlay */}
                {project.video_url && (
                  <button
                    type="button"
                    onClick={() => setPreviewProject(project)}
                    className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer"
                  >
                    <div className="w-12 h-12 rounded-full bg-violet-600/90 hover:bg-violet-600 text-white flex items-center justify-center shadow-lg transform transition-transform group-hover:scale-110">
                      <Play className="w-5 h-5 ml-0.5" />
                    </div>
                  </button>
                )}
              </div>

              {/* Content Body */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                <div>
                  <div className="flex items-center justify-between text-[11px] text-gray-500 font-mono mb-1">
                    <span>{project.client || 'Agency Client'}</span>
                    <span>{project.duration || '0:45'}</span>
                  </div>
                  <h3 className="text-base font-bold text-white group-hover:text-violet-300 transition-colors line-clamp-1">
                    {project.title}
                  </h3>
                  <p className="text-xs text-gray-400 line-clamp-2 mt-1">
                    {project.description || 'No description provided.'}
                  </p>
                </div>

                {/* Card Actions Footer */}
                <div className="pt-3 border-t border-white/5 flex items-center justify-between">
                  {/* Left: Star Featured Toggle */}
                  <button
                    type="button"
                    onClick={() => handleToggleFeatured(project)}
                    title={project.featured ? 'Remove featured' : 'Mark as featured'}
                    className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
                      project.featured
                        ? 'bg-amber-500/10 border-amber-500/30 text-amber-400'
                        : 'bg-white/5 border-white/10 text-gray-500 hover:text-white'
                    }`}
                  >
                    <Star className={`w-3.5 h-3.5 ${project.featured ? 'fill-current' : ''}`} />
                  </button>

                  {/* Right: Preview, Edit, Delete */}
                  <div className="flex items-center gap-1.5">
                    {project.video_url && (
                      <button
                        type="button"
                        onClick={() => setPreviewProject(project)}
                        title="Preview video embed"
                        className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                    )}

                    <Link
                      href={`/dashboard/portfolio/${project.id}/edit`}
                      className="p-1.5 rounded-lg bg-violet-600/10 hover:bg-violet-600/20 text-violet-400 hover:text-violet-300 transition-colors"
                      title="Edit project"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </Link>

                    <button
                      type="button"
                      onClick={() => setDeleteTarget(project)}
                      title="Delete project"
                      className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Video Preview Modal */}
      {previewProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in">
          <div className="w-full max-w-3xl rounded-3xl bg-[#14141B] border border-white/15 p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div>
                <h3 className="text-lg font-bold text-white">{previewProject.title}</h3>
                <span className="text-xs text-gray-400">
                  {previewProject.client} • {previewProject.category}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setPreviewProject(null)}
                className="p-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <VideoEmbedPreview videoUrl={previewProject.video_url || ''} />

            <div className="flex justify-end pt-2">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setPreviewProject(null)}
              >
                Close Preview
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={!!deleteTarget}
        title="Delete Project?"
        message={`Are you sure you want to permanently delete "${deleteTarget?.title}"? This action cannot be undone.`}
        confirmText="Delete Project"
        isDestructive={true}
        isLoading={isDeleting}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
