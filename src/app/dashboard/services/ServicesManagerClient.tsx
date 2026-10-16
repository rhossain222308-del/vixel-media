'use client';

import React, { useState, useTransition } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  Layers, 
  Plus, 
  Edit3, 
  Trash2, 
  CheckCircle2, 
  AlertCircle, 
  ExternalLink,
  Sparkles,
  Save,
  X,
  Eye,
  EyeOff,
  Clock,
  ArrowUpDown
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { ConfirmModal } from '@/components/dashboard/ConfirmModal';
import { ImageUpload } from '@/components/dashboard/ImageUpload';
import { saveServiceAction, deleteServiceAction } from '@/lib/actions/services';
import type { ServiceRow } from '@/types/database.types';

interface ServicesManagerClientProps {
  initialServices: ServiceRow[];
}

export function ServicesManagerClient({
  initialServices,
}: ServicesManagerClientProps) {
  const [services, setServices] = useState<ServiceRow[]>(initialServices);
  const [isPending, startTransition] = useTransition();
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Edit / Add Modal state
  const [editingService, setEditingService] = useState<Partial<ServiceRow> | null>(null);
  const [isNewService, setIsNewService] = useState(false);

  // Deliverables & Platforms tags inside modal
  const [modalDeliverables, setModalDeliverables] = useState<string[]>([]);
  const [newDeliverableInput, setNewDeliverableInput] = useState('');
  const [modalPlatforms, setModalPlatforms] = useState<string[]>([]);
  const [newPlatformInput, setNewPlatformInput] = useState('');

  // Delete modal state
  const [deleteTarget, setDeleteTarget] = useState<ServiceRow | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const openAddModal = () => {
    setIsNewService(true);
    setEditingService({
      title: '',
      badge: 'High Retention',
      description: '',
      full_description: '',
      turnaround_time: '48-72 Hours',
      ideal_for: 'Creators & Brands',
      image_url: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&w=1200&q=80',
      sample_video_url: '',
      sort_order: services.length + 1,
      is_published: true,
    });
    setModalDeliverables(['Color Grading', 'Sound Design', 'Kinetic Typography']);
    setModalPlatforms(['YouTube', 'Instagram Reels', 'TikTok']);
  };

  const openEditModal = (service: ServiceRow) => {
    setIsNewService(false);
    setEditingService(service);
    setModalDeliverables(Array.isArray(service.deliverables) ? (service.deliverables as string[]) : []);
    setModalPlatforms(Array.isArray(service.platforms) ? (service.platforms as string[]) : []);
  };

  const handleSaveService = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editingService) return;
    setFeedback(null);

    const formData = new FormData();
    if (!isNewService && editingService.id) {
      formData.append('serviceId', editingService.id);
    }
    formData.append('title', editingService.title || '');
    formData.append('badge', editingService.badge || '');
    formData.append('description', editingService.description || '');
    formData.append('fullDescription', editingService.full_description || editingService.description || '');
    formData.append('turnaroundTime', editingService.turnaround_time || '');
    formData.append('idealFor', editingService.ideal_for || '');
    formData.append('imageUrl', editingService.image_url || '');
    formData.append('sampleVideoUrl', editingService.sample_video_url || '');
    formData.append('sortOrder', (editingService.sort_order || 0).toString());
    formData.append('isPublished', editingService.is_published ? 'true' : 'false');
    formData.append('deliverables', JSON.stringify(modalDeliverables));
    formData.append('platforms', JSON.stringify(modalPlatforms));

    startTransition(async () => {
      const result = await saveServiceAction(null, formData);
      if (result.success) {
        setFeedback({ type: 'success', message: 'Service saved successfully and synced to live site!' });
        setEditingService(null);
        // Optimistic refresh
        if (isNewService) {
          setServices((prev) => [
            ...prev,
            {
              ...editingService,
              id: `svc-${Date.now()}`,
              slug: editingService.title?.toLowerCase().replace(/\s+/g, '-') || 'service',
              deliverables: modalDeliverables,
              platforms: modalPlatforms,
              features: [],
              published_at: new Date().toISOString(),
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            } as ServiceRow,
          ]);
        } else {
          setServices((prev) =>
            prev.map((s) =>
              s.id === editingService.id
                ? ({
                    ...s,
                    ...editingService,
                    deliverables: modalDeliverables,
                    platforms: modalPlatforms,
                  } as ServiceRow)
                : s
            )
          );
        }
      } else {
        setFeedback({ type: 'error', message: result.error || 'Failed to save service.' });
      }
    });
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    setFeedback(null);

    const result = await deleteServiceAction(deleteTarget.id);
    setIsDeleting(false);

    if (result.success) {
      setServices((prev) => prev.filter((s) => s.id !== deleteTarget.id));
      setFeedback({ type: 'success', message: 'Service removed successfully.' });
      setDeleteTarget(null);
    } else {
      setFeedback({ type: 'error', message: result.error || 'Failed to delete service.' });
    }
  };

  const handleTogglePublish = (service: ServiceRow) => {
    const nextPublished = !service.is_published;
    setFeedback(null);

    const formData = new FormData();
    formData.append('serviceId', service.id);
    formData.append('title', service.title);
    formData.append('badge', service.badge || '');
    formData.append('description', service.description);
    formData.append('fullDescription', service.full_description || service.description);
    formData.append('turnaroundTime', service.turnaround_time || '');
    formData.append('idealFor', service.ideal_for || '');
    formData.append('imageUrl', service.image_url || '');
    formData.append('sortOrder', service.sort_order.toString());
    formData.append('isPublished', nextPublished ? 'true' : 'false');
    formData.append('deliverables', JSON.stringify(service.deliverables || []));
    formData.append('platforms', JSON.stringify(service.platforms || []));

    startTransition(async () => {
      const result = await saveServiceAction(null, formData);
      if (result.success) {
        setServices((prev) =>
          prev.map((s) => (s.id === service.id ? { ...s, is_published: nextPublished } : s))
        );
        setFeedback({
          type: 'success',
          message: nextPublished
            ? `Service '${service.title}' is now LIVE on the public Services page.`
            : `Service '${service.title}' unpublished (hidden from public site).`,
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
              Shared Agency Offerings
            </span>
            <span className="text-gray-600">•</span>
            <span className="text-xs text-gray-400">
              {services.length} {services.length === 1 ? 'Service' : 'Services'} configured
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            Shared Services Manager
          </h1>
          <p className="text-xs sm:text-sm text-gray-400 mt-1">
            Manage packages, turnaround guarantees, deliverables, and platforms shown on the public Services and Home pages.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/services"
            target="_blank"
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium text-gray-300 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5 text-violet-400" />
            <span>Public Services Page</span>
          </Link>
          <Button onClick={openAddModal} className="gap-2 shadow-lg shadow-violet-900/30">
            <Plus className="w-4 h-4" />
            <span>Add Service</span>
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

      {/* Services Cards List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {services.map((service) => {
          const deliverablesList = Array.isArray(service.deliverables)
            ? (service.deliverables as string[])
            : [];
          const platformsList = Array.isArray(service.platforms)
            ? (service.platforms as string[])
            : [];

          return (
            <div
              key={service.id}
              className="p-6 rounded-3xl bg-[#14141B] border border-white/10 hover:border-violet-500/30 transition-all flex flex-col justify-between space-y-4 shadow-lg group"
            >
              <div>
                {/* Header row */}
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="px-2.5 py-0.5 rounded-full bg-violet-600/20 border border-violet-500/30 text-violet-300 text-[10px] font-mono font-bold">
                      {service.badge || 'Studio Service'}
                    </span>
                    <span className="text-[10px] text-gray-500 font-mono">
                      Order #{service.sort_order}
                    </span>
                  </div>

                  {/* Publish Switch */}
                  <button
                    type="button"
                    onClick={() => handleTogglePublish(service)}
                    title={service.is_published ? 'Click to unpublish' : 'Click to publish'}
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold transition-transform hover:scale-105 cursor-pointer ${
                      service.is_published
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        : 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30'
                    }`}
                  >
                    {service.is_published ? 'Published' : 'Draft'}
                  </button>
                </div>

                <h3 className="text-lg font-bold text-white group-hover:text-violet-300 transition-colors">
                  {service.title}
                </h3>
                <p className="text-xs text-gray-400 mt-1 line-clamp-3 leading-relaxed">
                  {service.description}
                </p>

                {/* Turnaround & Ideal For pill */}
                <div className="flex flex-wrap items-center gap-3 mt-4 pt-3 border-t border-white/5 text-[11px] text-gray-400">
                  {service.turnaround_time && (
                    <span className="flex items-center gap-1 text-violet-300">
                      <Clock className="w-3.5 h-3.5 text-violet-400" />
                      <span>{service.turnaround_time}</span>
                    </span>
                  )}
                  {service.ideal_for && (
                    <span className="truncate max-w-[200px]">
                      Ideal for: <strong className="text-gray-300">{service.ideal_for}</strong>
                    </span>
                  )}
                </div>

                {/* Deliverables tags preview */}
                {deliverablesList.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {deliverablesList.slice(0, 4).map((d, i) => (
                      <span
                        key={i}
                        className="px-2 py-0.5 rounded-md bg-white/5 text-gray-300 text-[10px]"
                      >
                        ✓ {d}
                      </span>
                    ))}
                    {deliverablesList.length > 4 && (
                      <span className="px-2 py-0.5 rounded-md bg-white/5 text-gray-500 text-[10px]">
                        +{deliverablesList.length - 4} more
                      </span>
                    )}
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-2 pt-3 border-t border-white/5">
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => openEditModal(service)}
                  className="gap-1.5 text-xs"
                >
                  <Edit3 className="w-3.5 h-3.5 text-violet-400" />
                  <span>Edit Service</span>
                </Button>

                <Button
                  size="sm"
                  variant="danger"
                  onClick={() => setDeleteTarget(service)}
                  className="p-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </Button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Edit / Add Service Modal */}
      {editingService && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in overflow-y-auto">
          <div className="w-full max-w-2xl rounded-3xl bg-[#14141B] border border-white/15 p-6 sm:p-8 space-y-6 shadow-2xl my-8">
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <div className="flex items-center gap-2">
                <Layers className="w-5 h-5 text-violet-400" />
                <h3 className="text-lg font-bold text-white">
                  {isNewService ? 'Add New Agency Service' : `Edit: ${editingService.title}`}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setEditingService(null)}
                className="p-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveService} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                    Service Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={editingService.title || ''}
                    onChange={(e) => setEditingService({ ...editingService, title: e.target.value })}
                    placeholder="e.g. YouTube Retention Mastery"
                    className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white text-sm focus:outline-none focus:border-violet-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                    Badge Pill
                  </label>
                  <input
                    type="text"
                    value={editingService.badge || ''}
                    onChange={(e) => setEditingService({ ...editingService, badge: e.target.value })}
                    placeholder="e.g. High Retention or Flagship"
                    className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white text-sm focus:outline-none focus:border-violet-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                    Turnaround Guarantee
                  </label>
                  <input
                    type="text"
                    value={editingService.turnaround_time || ''}
                    onChange={(e) => setEditingService({ ...editingService, turnaround_time: e.target.value })}
                    placeholder="e.g. 48-72 Hours"
                    className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white text-sm focus:outline-none focus:border-violet-500"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                    Short Description *
                  </label>
                  <textarea
                    rows={2}
                    required
                    value={editingService.description || ''}
                    onChange={(e) => setEditingService({ ...editingService, description: e.target.value })}
                    placeholder="Concise overview of what this package delivers..."
                    className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white text-sm focus:outline-none focus:border-violet-500"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                    Full In-Depth Description
                  </label>
                  <textarea
                    rows={4}
                    value={editingService.full_description || ''}
                    onChange={(e) => setEditingService({ ...editingService, full_description: e.target.value })}
                    placeholder="Detailed explanation of workflow, editorial pacing, and delivery format..."
                    className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white text-sm focus:outline-none focus:border-violet-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                    Ideal Client Fit
                  </label>
                  <input
                    type="text"
                    value={editingService.ideal_for || ''}
                    onChange={(e) => setEditingService({ ...editingService, ideal_for: e.target.value })}
                    placeholder="e.g. YouTube creators scaling to 500k+"
                    className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white text-sm focus:outline-none focus:border-violet-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                    Sort Order
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="99"
                    value={editingService.sort_order || 0}
                    onChange={(e) => setEditingService({ ...editingService, sort_order: parseInt(e.target.value, 10) || 0 })}
                    className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white text-sm focus:outline-none focus:border-violet-500"
                  />
                </div>

                {/* Service Image Upload */}
                <div className="sm:col-span-2 pt-2 border-t border-white/5">
                  <ImageUpload
                    value={editingService.image_url || ''}
                    onChange={(url) => setEditingService({ ...editingService, image_url: url })}
                    bucket="services"
                    label="Service Cover Image"
                    aspectRatio="video"
                  />
                </div>

                {/* Deliverables tags */}
                <div className="sm:col-span-2 pt-2 border-t border-white/5 space-y-2">
                  <label className="block text-xs font-semibold text-gray-300">
                    Included Deliverables
                  </label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {modalDeliverables.map((d, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-violet-600/20 border border-violet-500/30 text-violet-200 text-xs"
                      >
                        <span>{d}</span>
                        <button
                          type="button"
                          onClick={() => setModalDeliverables(modalDeliverables.filter((_, i) => i !== idx))}
                          className="hover:text-white"
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
                          if (newDeliverableInput.trim()) {
                            setModalDeliverables([...modalDeliverables, newDeliverableInput.trim()]);
                            setNewDeliverableInput('');
                          }
                        }
                      }}
                      placeholder="Add deliverable (e.g. Color Grading)..."
                      className="flex-1 px-4 py-2 rounded-xl bg-black/40 border border-white/10 text-white text-xs focus:outline-none focus:border-violet-500"
                    />
                    <Button
                      type="button"
                      variant="secondary"
                      size="sm"
                      onClick={() => {
                        if (newDeliverableInput.trim()) {
                          setModalDeliverables([...modalDeliverables, newDeliverableInput.trim()]);
                          setNewDeliverableInput('');
                        }
                      }}
                    >
                      Add
                    </Button>
                  </div>
                </div>

                {/* Platforms tags */}
                <div className="sm:col-span-2 pt-2 border-t border-white/5 space-y-2">
                  <label className="block text-xs font-semibold text-gray-300">
                    Target Platforms
                  </label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {modalPlatforms.map((p, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-600/20 border border-blue-500/30 text-blue-200 text-xs"
                      >
                        <span>{p}</span>
                        <button
                          type="button"
                          onClick={() => setModalPlatforms(modalPlatforms.filter((_, i) => i !== idx))}
                          className="hover:text-white"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newPlatformInput}
                      onChange={(e) => setNewPlatformInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          if (newPlatformInput.trim()) {
                            setModalPlatforms([...modalPlatforms, newPlatformInput.trim()]);
                            setNewPlatformInput('');
                          }
                        }
                      }}
                      placeholder="Add platform (e.g. YouTube, TikTok)..."
                      className="flex-1 px-4 py-2 rounded-xl bg-black/40 border border-white/10 text-white text-xs focus:outline-none focus:border-violet-500"
                    />
                    <Button
                      type="button"
                      variant="secondary"
                      size="sm"
                      onClick={() => {
                        if (newPlatformInput.trim()) {
                          setModalPlatforms([...modalPlatforms, newPlatformInput.trim()]);
                          setNewPlatformInput('');
                        }
                      }}
                    >
                      Add
                    </Button>
                  </div>
                </div>

                {/* Publication switch */}
                <div className="sm:col-span-2 pt-2 border-t border-white/5 flex items-center justify-between">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={editingService.is_published ?? true}
                      onChange={(e) => setEditingService({ ...editingService, is_published: e.target.checked })}
                      className="w-4 h-4 rounded border-gray-700 text-violet-600 focus:ring-violet-500"
                    />
                    <span className="text-xs font-semibold text-white">
                      Publish Live on Public Services & Home Page
                    </span>
                  </label>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={() => setEditingService(null)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isPending}
                  className="gap-2 shadow-lg shadow-violet-900/40"
                >
                  <Save className="w-4 h-4" />
                  <span>{isPending ? 'Saving...' : 'Save Service'}</span>
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={!!deleteTarget}
        title="Delete Service?"
        message={`Are you sure you want to delete "${deleteTarget?.title}"? This service will be removed from the public website.`}
        confirmText="Delete Service"
        isDestructive={true}
        isLoading={isDeleting}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
