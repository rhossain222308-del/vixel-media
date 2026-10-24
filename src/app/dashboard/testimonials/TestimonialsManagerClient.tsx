'use client';

import React, { useState, useTransition } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  Sparkles, 
  Plus, 
  Edit3, 
  Trash2, 
  CheckCircle2, 
  AlertCircle, 
  ExternalLink,
  Star,
  Save,
  X,
  TrendingUp
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { ConfirmModal } from '@/components/dashboard/ConfirmModal';
import { ImageUpload } from '@/components/dashboard/ImageUpload';
import { saveTestimonialAction, deleteTestimonialAction } from '@/lib/actions/testimonials';
import type { TestimonialRow } from '@/types/database.types';

interface TestimonialsManagerClientProps {
  initialTestimonials: TestimonialRow[];
}

export function TestimonialsManagerClient({
  initialTestimonials,
}: TestimonialsManagerClientProps) {
  const [testimonials, setTestimonials] = useState<TestimonialRow[]>(initialTestimonials);
  const [isPending, startTransition] = useTransition();
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Edit / Add Modal state
  const [editingItem, setEditingItem] = useState<Partial<TestimonialRow> | null>(null);
  const [isNewItem, setIsNewItem] = useState(false);

  // Delete modal state
  const [deleteTarget, setDeleteTarget] = useState<TestimonialRow | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const openAddModal = () => {
    setIsNewItem(true);
    setEditingItem({
      client_name: '',
      role: 'Founder & CEO',
      company: '',
      quote: '',
      rating: 5,
      project_title: 'Brand Documentary',
      metrics_result: '+240% Watch Time Retention',
      avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
      sort_order: testimonials.length + 1,
      is_published: true,
    });
  };

  const openEditModal = (item: TestimonialRow) => {
    setIsNewItem(false);
    setEditingItem(item);
  };

  const handleSave = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editingItem) return;
    setFeedback(null);

    const formData = new FormData();
    if (!isNewItem && editingItem.id) {
      formData.append('testimonialId', editingItem.id);
    }
    formData.append('clientName', editingItem.client_name || '');
    formData.append('role', editingItem.role || '');
    formData.append('company', editingItem.company || '');
    formData.append('quote', editingItem.quote || '');
    formData.append('rating', (editingItem.rating || 5).toString());
    formData.append('projectTitle', editingItem.project_title || '');
    formData.append('metricsResult', editingItem.metrics_result || '');
    formData.append('avatarUrl', editingItem.avatar_url || '');
    formData.append('sortOrder', (editingItem.sort_order || 0).toString());
    formData.append('isPublished', editingItem.is_published ? 'true' : 'false');

    startTransition(async () => {
      const result = await saveTestimonialAction(null, formData);
      if (result.success) {
        setFeedback({ type: 'success', message: 'Testimonial saved successfully!' });
        setEditingItem(null);
        if (isNewItem) {
          setTestimonials((prev) => [
            ...prev,
            {
              ...editingItem,
              id: `test-${Date.now()}`,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            } as TestimonialRow,
          ]);
        } else {
          setTestimonials((prev) =>
            prev.map((t) => (t.id === editingItem.id ? ({ ...t, ...editingItem } as TestimonialRow) : t))
          );
        }
      } else {
        setFeedback({ type: 'error', message: result.error || 'Failed to save testimonial.' });
      }
    });
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    setFeedback(null);

    const result = await deleteTestimonialAction(deleteTarget.id);
    setIsDeleting(false);

    if (result.success) {
      setTestimonials((prev) => prev.filter((t) => t.id !== deleteTarget.id));
      setFeedback({ type: 'success', message: 'Testimonial removed.' });
      setDeleteTarget(null);
    } else {
      setFeedback({ type: 'error', message: result.error || 'Failed to delete.' });
    }
  };

  const handleTogglePublish = (item: TestimonialRow) => {
    const nextPublished = !item.is_published;
    setFeedback(null);

    const formData = new FormData();
    formData.append('testimonialId', item.id);
    formData.append('clientName', item.client_name);
    formData.append('role', item.role || '');
    formData.append('company', item.company);
    formData.append('quote', item.quote);
    formData.append('rating', (item.rating ?? 5).toString());
    formData.append('projectTitle', item.project_title || '');
    formData.append('metricsResult', item.metrics_result || '');
    formData.append('avatarUrl', item.avatar_url || '');
    formData.append('sortOrder', item.sort_order.toString());
    formData.append('isPublished', nextPublished ? 'true' : 'false');

    startTransition(async () => {
      const result = await saveTestimonialAction(null, formData);
      if (result.success) {
        setTestimonials((prev) =>
          prev.map((t) => (t.id === item.id ? { ...t, is_published: nextPublished } : t))
        );
        setFeedback({
          type: 'success',
          message: nextPublished
            ? `Testimonial from ${item.client_name} published to live website.`
            : `Testimonial unpublished.`,
        });
      } else {
        setFeedback({ type: 'error', message: result.error || 'Failed to toggle status.' });
      }
    });
  };

  return (
    <div className="space-y-6">
      {/* Header & Add Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <div className="inline-flex items-center gap-2 mb-1">
            <span className="text-xs font-mono uppercase tracking-wider text-violet-400 font-bold">
              Shared Client Reviews
            </span>
            <span className="text-gray-600">•</span>
            <span className="text-xs text-gray-400">
              {testimonials.length} {testimonials.length === 1 ? 'Review' : 'Reviews'} in catalog
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            Client Testimonials Manager
          </h1>
          <p className="text-xs sm:text-sm text-gray-400 mt-1">
            Manage genuine client reviews, impact metrics, ratings, and quotes displayed on the public website.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/testimonials"
            target="_blank"
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium text-gray-300 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5 text-violet-400" />
            <span>Public Testimonials</span>
          </Link>
          <Button onClick={openAddModal} className="gap-2 shadow-lg shadow-violet-900/30">
            <Plus className="w-4 h-4" />
            <span>Add Testimonial</span>
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

      {/* Testimonials Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {testimonials.map((item) => (
          <div
            key={item.id}
            className="p-6 rounded-3xl bg-[#14141B] border border-white/10 hover:border-violet-500/30 transition-all flex flex-col justify-between space-y-4 shadow-lg group"
          >
            <div>
              {/* Header: Stars & Status */}
              <div className="flex items-center justify-between gap-2 mb-3">
                <div className="flex items-center gap-1 text-amber-400">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`w-3.5 h-3.5 ${
                        i < (item.rating ?? 5) ? 'fill-current' : 'text-gray-700'
                      }`}
                    />
                  ))}
                </div>

                <button
                  type="button"
                  onClick={() => handleTogglePublish(item)}
                  title={item.is_published ? 'Click to unpublish' : 'Click to publish'}
                  className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold transition-transform hover:scale-105 cursor-pointer ${
                    item.is_published
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      : 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30'
                  }`}
                >
                  {item.is_published ? 'Published' : 'Draft'}
                </button>
              </div>

              {/* Quote */}
              <p className="text-xs text-gray-300 italic leading-relaxed line-clamp-4">
                &ldquo;{item.quote}&rdquo;
              </p>

              {/* Metric Result Pill */}
              {item.metrics_result && (
                <div className="mt-3 flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-violet-600/10 border border-violet-500/20 text-violet-300 text-[11px] font-medium">
                  <TrendingUp className="w-3.5 h-3.5 text-violet-400 shrink-0" />
                  <span className="truncate">{item.metrics_result}</span>
                </div>
              )}
            </div>

            {/* Footer: Client Info & Actions */}
            <div className="pt-3 border-t border-white/5 space-y-3">
              <div className="flex items-center gap-3">
                <div className="relative w-9 h-9 rounded-full overflow-hidden bg-white/10 shrink-0">
                  {item.avatar_url ? (
                    <Image
                      src={item.avatar_url}
                      alt={item.client_name}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-xs font-bold text-white">
                      {item.client_name.slice(0, 2).toUpperCase()}
                    </div>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-xs font-bold text-white truncate">
                    {item.client_name}
                  </div>
                  <div className="text-[10px] text-gray-400 truncate">
                    {item.role ? `${item.role}, ` : ''}{item.company}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-1.5">
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => openEditModal(item)}
                  className="gap-1 text-xs"
                >
                  <Edit3 className="w-3 h-3 text-violet-400" />
                  <span>Edit</span>
                </Button>
                <Button
                  size="sm"
                  variant="danger"
                  onClick={() => setDeleteTarget(item)}
                  className="p-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add / Edit Testimonial Modal */}
      {editingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in overflow-y-auto">
          <div className="w-full max-w-xl rounded-3xl bg-[#14141B] border border-white/15 p-6 sm:p-8 space-y-6 shadow-2xl my-8">
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-violet-400" />
                <h3 className="text-lg font-bold text-white">
                  {isNewItem ? 'Add Client Testimonial' : `Edit: ${editingItem.client_name}`}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setEditingItem(null)}
                className="p-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                    Client Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={editingItem.client_name || ''}
                    onChange={(e) => setEditingItem({ ...editingItem, client_name: e.target.value })}
                    placeholder="e.g. David Vance"
                    className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white text-sm focus:outline-none focus:border-violet-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                    Company / Organization *
                  </label>
                  <input
                    type="text"
                    required
                    value={editingItem.company || ''}
                    onChange={(e) => setEditingItem({ ...editingItem, company: e.target.value })}
                    placeholder="e.g. Apex Hypercars"
                    className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white text-sm focus:outline-none focus:border-violet-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                    Client Role / Title
                  </label>
                  <input
                    type="text"
                    value={editingItem.role || ''}
                    onChange={(e) => setEditingItem({ ...editingItem, role: e.target.value })}
                    placeholder="e.g. Head of Brand & Content"
                    className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white text-sm focus:outline-none focus:border-violet-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                    Star Rating (1-5)
                  </label>
                  <select
                    value={editingItem.rating || 5}
                    onChange={(e) => setEditingItem({ ...editingItem, rating: parseInt(e.target.value, 10) || 5 })}
                    className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white text-sm focus:outline-none focus:border-violet-500"
                  >
                    <option value={5}>★★★★★ (5 Stars)</option>
                    <option value={4}>★★★★☆ (4 Stars)</option>
                    <option value={3}>★★★☆☆ (3 Stars)</option>
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                    Testimonial Quote *
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={editingItem.quote || ''}
                    onChange={(e) => setEditingItem({ ...editingItem, quote: e.target.value })}
                    placeholder="Share client feedback regarding video retention, cinematography, and turnaround speed..."
                    className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white text-sm focus:outline-none focus:border-violet-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                    Project Title Reference
                  </label>
                  <input
                    type="text"
                    value={editingItem.project_title || ''}
                    onChange={(e) => setEditingItem({ ...editingItem, project_title: e.target.value })}
                    placeholder="e.g. Apex Hypercar Commercial"
                    className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white text-sm focus:outline-none focus:border-violet-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                    Metric / Growth Result
                  </label>
                  <input
                    type="text"
                    value={editingItem.metrics_result || ''}
                    onChange={(e) => setEditingItem({ ...editingItem, metrics_result: e.target.value })}
                    placeholder="e.g. +340% View Duration"
                    className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white text-sm focus:outline-none focus:border-violet-500"
                  />
                </div>

                <div className="sm:col-span-2 pt-2 border-t border-white/5">
                  <ImageUpload
                    value={editingItem.avatar_url || ''}
                    onChange={(url) => setEditingItem({ ...editingItem, avatar_url: url })}
                    bucket="avatars"
                    label="Client Headshot Photo"
                    aspectRatio="square"
                  />
                </div>

                <div className="sm:col-span-2 pt-2 border-t border-white/5 flex items-center justify-between">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={editingItem.is_published ?? true}
                      onChange={(e) => setEditingItem({ ...editingItem, is_published: e.target.checked })}
                      className="w-4 h-4 rounded border-gray-700 text-violet-600 focus:ring-violet-500"
                    />
                    <span className="text-xs font-semibold text-white">
                      Publish Live on Public Testimonials & Home Page
                    </span>
                  </label>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={() => setEditingItem(null)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isPending}
                  className="gap-2 shadow-lg shadow-violet-900/40"
                >
                  <Save className="w-4 h-4" />
                  <span>{isPending ? 'Saving...' : 'Save Testimonial'}</span>
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={!!deleteTarget}
        title="Delete Testimonial?"
        message={`Are you sure you want to remove the testimonial from ${deleteTarget?.client_name}?`}
        confirmText="Delete Testimonial"
        isDestructive={true}
        isLoading={isDeleting}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
