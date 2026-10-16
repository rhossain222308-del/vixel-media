'use client';

import React, { useState, useTransition } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  ArrowLeft, 
  Film, 
  Save, 
  CheckCircle2, 
  AlertCircle, 
  Play, 
  Trash2,
  Plus,
  X,
  Sparkles,
  ExternalLink
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { ImageUpload } from '@/components/dashboard/ImageUpload';
import { VideoEmbedPreview } from '@/components/dashboard/VideoEmbedPreview';
import { ConfirmModal } from '@/components/dashboard/ConfirmModal';
import { updateProjectAction, deleteProjectAction } from '@/lib/actions/projects';
import type { PortfolioProjectRow } from '@/types/database.types';

interface ProjectEditClientProps {
  project: PortfolioProjectRow;
  userId: string;
}

export function ProjectEditClient({
  project,
  userId,
}: ProjectEditClientProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Form states prefilled from project
  const [title, setTitle] = useState(project.title);
  const [slug, setSlug] = useState(project.slug);
  const [client, setClient] = useState(project.client || '');
  const [category, setCategory] = useState<'reels' | 'long-form' | 'ads' | 'motion-graphics'>(
    project.category as 'reels' | 'long-form' | 'ads' | 'motion-graphics'
  );
  const [description, setDescription] = useState(project.description || '');
  const [longDescription, setLongDescription] = useState(project.long_description || '');
  const [videoUrl, setVideoUrl] = useState(project.video_url || '');
  const [thumbnailUrl, setThumbnailUrl] = useState(project.thumbnail_url);
  const [platform, setPlatform] = useState(project.platform || 'YouTube');
  const [duration, setDuration] = useState(project.duration || '0:45');
  const [aspectRatio, setAspectRatio] = useState<'16:9' | '9:16' | '1:1' | '4:5'>(
    project.aspect_ratio || '16:9'
  );
  const [sortOrder, setSortOrder] = useState(project.sort_order || 0);
  const [featured, setFeatured] = useState(project.featured);
  const [status, setStatus] = useState<'published' | 'draft'>(project.status);

  // Deliverables tags
  const [deliverables, setDeliverables] = useState<string[]>(
    Array.isArray(project.deliverables) ? (project.deliverables as string[]) : []
  );
  const [newDeliverableInput, setNewDeliverableInput] = useState('');

  const addDeliverable = () => {
    const trimmed = newDeliverableInput.trim();
    if (trimmed && !deliverables.includes(trimmed)) {
      setDeliverables([...deliverables, trimmed]);
      setNewDeliverableInput('');
    }
  };

  const removeDeliverable = (index: number) => {
    setDeliverables(deliverables.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFeedback(null);

    const formData = new FormData();
    formData.append('projectId', project.id);
    formData.append('title', title);
    formData.append('slug', slug);
    formData.append('client', client);
    formData.append('category', category);
    formData.append('description', description);
    formData.append('longDescription', longDescription);
    formData.append('videoUrl', videoUrl);
    formData.append('thumbnailUrl', thumbnailUrl);
    formData.append('platform', platform);
    formData.append('duration', duration);
    formData.append('aspectRatio', aspectRatio);
    formData.append('sortOrder', sortOrder.toString());
    formData.append('featured', featured ? 'true' : 'false');
    formData.append('status', status);
    formData.append('deliverables', JSON.stringify(deliverables));

    startTransition(async () => {
      const result = await updateProjectAction(null, formData);
      if (result.success) {
        setFeedback({ type: 'success', message: 'Project updated successfully!' });
      } else {
        setFeedback({ type: 'error', message: result.error || 'Failed to update project.' });
      }
    });
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    setFeedback(null);

    const result = await deleteProjectAction(project.id);
    setIsDeleting(false);

    if (result.success) {
      router.push('/dashboard/portfolio');
    } else {
      setShowDeleteModal(false);
      setFeedback({ type: 'error', message: result.error || 'Failed to delete project.' });
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div className="space-y-1">
          <Link
            href="/dashboard/portfolio"
            className="inline-flex items-center gap-1.5 text-xs text-gray-400 hover:text-white transition-colors mb-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Portfolio Manager</span>
          </Link>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
              Edit Project
            </h1>
            <Badge variant={status === 'published' ? 'green' : 'sample'} size="sm">
              {status === 'published' ? 'Live Published' : 'Draft'}
            </Badge>
          </div>
          <p className="text-xs text-gray-400">
            Project ID: <span className="font-mono text-gray-500">{project.id}</span>
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="danger"
            size="sm"
            onClick={() => setShowDeleteModal(true)}
            className="gap-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20"
          >
            <Trash2 className="w-4 h-4" />
            <span>Delete</span>
          </Button>
        </div>
      </div>

      {/* Feedback Alert */}
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

      {/* Edit Form */}
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Section 1: Core Details */}
        <div className="p-6 sm:p-8 rounded-3xl bg-[#14141B] border border-white/10 space-y-6">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Film className="w-4 h-4 text-violet-400" />
            <span>Project Details</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-gray-300 mb-2">
                Project Title *
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white placeholder-gray-600 text-sm focus:outline-none focus:border-violet-500 transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-2">
                Slug (URL Path) *
              </label>
              <input
                type="text"
                required
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white placeholder-gray-600 text-sm font-mono focus:outline-none focus:border-violet-500 transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-2">
                Client / Brand Name
              </label>
              <input
                type="text"
                value={client}
                onChange={(e) => setClient(e.target.value)}
                placeholder="e.g. Apex Motors / Red Bull"
                className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white placeholder-gray-600 text-sm focus:outline-none focus:border-violet-500 transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-2">
                Category *
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as typeof category)}
                className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white text-sm focus:outline-none focus:border-violet-500 transition-colors"
              >
                <option value="reels">Reels & Vertical Shorts (9:16)</option>
                <option value="long-form">Long-form Videos & Docs (16:9)</option>
                <option value="ads">Commercial Ads</option>
                <option value="motion-graphics">Motion Graphics & 3D</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-2">
                Aspect Ratio
              </label>
              <select
                value={aspectRatio}
                onChange={(e) => setAspectRatio(e.target.value as typeof aspectRatio)}
                className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white text-sm focus:outline-none focus:border-violet-500 transition-colors"
              >
                <option value="16:9">16:9 Widescreen (Landscape)</option>
                <option value="9:16">9:16 Vertical (Reels / TikTok)</option>
                <option value="1:1">1:1 Square</option>
                <option value="4:5">4:5 Social Portrait</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-2">
                Video Duration
              </label>
              <input
                type="text"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                placeholder="e.g. 0:45 or 3:20"
                className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white placeholder-gray-600 text-sm focus:outline-none focus:border-violet-500 transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-2">
                Sort Order (Display priority)
              </label>
              <input
                type="number"
                min="0"
                max="999"
                value={sortOrder}
                onChange={(e) => setSortOrder(parseInt(e.target.value, 10) || 0)}
                className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white placeholder-gray-600 text-sm focus:outline-none focus:border-violet-500 transition-colors"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-gray-300 mb-2">
                Short Summary Description *
              </label>
              <textarea
                rows={2}
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white placeholder-gray-600 text-sm focus:outline-none focus:border-violet-500 transition-colors"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-gray-300 mb-2">
                Detailed Narrative / Editorial Story
              </label>
              <textarea
                rows={4}
                value={longDescription}
                onChange={(e) => setLongDescription(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white placeholder-gray-600 text-sm focus:outline-none focus:border-violet-500 transition-colors"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Media & Playable Video URL */}
        <div className="p-6 sm:p-8 rounded-3xl bg-[#14141B] border border-white/10 space-y-6">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Play className="w-4 h-4 text-violet-400" />
            <span>Playable Video & Thumbnail</span>
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-2">
                Video Embed URL (YouTube, Vimeo, or Direct MP4)
              </label>
              <div className="flex gap-3">
                <input
                  type="url"
                  value={videoUrl}
                  onChange={(e) => setVideoUrl(e.target.value)}
                  placeholder="https://www.youtube.com/watch?v=... or https://vimeo.com/..."
                  className="flex-1 px-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white placeholder-gray-600 text-sm focus:outline-none focus:border-violet-500 transition-colors"
                />
                <select
                  value={platform}
                  onChange={(e) => setPlatform(e.target.value)}
                  className="px-3 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white text-sm focus:outline-none focus:border-violet-500"
                >
                  <option value="YouTube">YouTube</option>
                  <option value="Vimeo">Vimeo</option>
                  <option value="Custom">Direct MP4 / CDN</option>
                </select>
              </div>
            </div>

            {/* Live Video Player Preview */}
            <div className="pt-2">
              <label className="block text-xs font-semibold text-gray-300 mb-2">
                Real-Time Embed Player Preview
              </label>
              <div className="max-w-xl">
                <VideoEmbedPreview videoUrl={videoUrl} />
              </div>
            </div>

            {/* Thumbnail Upload */}
            <div className="pt-4 border-t border-white/5">
              <ImageUpload
                value={thumbnailUrl}
                onChange={setThumbnailUrl}
                bucket="portfolio"
                label="Project Thumbnail Image *"
                aspectRatio="video"
              />
            </div>
          </div>
        </div>

        {/* Section 3: Deliverables Tags */}
        <div className="p-6 sm:p-8 rounded-3xl bg-[#14141B] border border-white/10 space-y-4">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-violet-400" />
            <span>Deliverables & Services Provided</span>
          </h2>

          <div className="flex flex-wrap gap-2 mb-2">
            {deliverables.map((d, index) => (
              <span
                key={index}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-violet-600/20 border border-violet-500/30 text-violet-200 text-xs"
              >
                <span>{d}</span>
                <button
                  type="button"
                  onClick={() => removeDeliverable(index)}
                  className="hover:text-white transition-colors"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              value={newDeliverableInput}
              onChange={(e) => setNewDeliverableInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  addDeliverable();
                }
              }}
              placeholder="Add deliverable..."
              className="flex-1 px-4 py-2 rounded-xl bg-black/40 border border-white/10 text-white placeholder-gray-600 text-xs focus:outline-none focus:border-violet-500"
            />
            <Button type="button" variant="secondary" size="sm" onClick={addDeliverable}>
              <Plus className="w-3.5 h-3.5" />
              <span>Add</span>
            </Button>
          </div>
        </div>

        {/* Section 4: Publishing & Actions */}
        <div className="p-6 sm:p-8 rounded-3xl bg-[#14141B] border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="flex flex-col sm:flex-row sm:items-center gap-6">
            {/* Featured toggle */}
            <label className="flex items-center gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={featured}
                onChange={(e) => setFeatured(e.target.checked)}
                className="w-4 h-4 rounded border-gray-700 text-violet-600 focus:ring-violet-500"
              />
              <span className="text-xs font-semibold text-white">
                Feature on Homepage & Spotlight
              </span>
            </label>

            {/* Status toggle: draft vs published */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setStatus('draft')}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-colors ${
                  status === 'draft'
                    ? 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                Save as Draft
              </button>
              <button
                type="button"
                onClick={() => setStatus('published')}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-colors ${
                  status === 'published'
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                Publish Live
              </button>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link href="/dashboard/portfolio">
              <Button type="button" variant="secondary" size="sm">
                Cancel
              </Button>
            </Link>
            <Button
              type="submit"
              disabled={isPending}
              className="gap-2 shadow-lg shadow-violet-900/40"
            >
              <Save className="w-4 h-4" />
              <span>{isPending ? 'Saving...' : 'Save Changes'}</span>
            </Button>
          </div>
        </div>
      </form>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={showDeleteModal}
        title="Delete Project?"
        message={`Are you sure you want to delete "${project.title}"? This cannot be undone.`}
        confirmText="Delete Project"
        isDestructive={true}
        isLoading={isDeleting}
        onConfirm={handleDelete}
        onCancel={() => setShowDeleteModal(false)}
      />
    </div>
  );
}
