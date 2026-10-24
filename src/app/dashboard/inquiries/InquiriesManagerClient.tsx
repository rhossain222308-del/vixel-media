'use client';

import React, { useState, useTransition } from 'react';
import { 
  Mail, 
  Search, 
  Trash2, 
  DollarSign, 
  Briefcase, 
  CheckCircle2, 
  AlertCircle,
  User
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { ConfirmModal } from '@/components/dashboard/ConfirmModal';
import { updateInquiryStatusAction, deleteInquiryAction } from '@/lib/actions/inquiries';
import type { ContactInquiryRow } from '@/types/database.types';

interface InquiriesManagerClientProps {
  initialInquiries: ContactInquiryRow[];
}

export function InquiriesManagerClient({
  initialInquiries,
}: InquiriesManagerClientProps) {
  const [inquiries, setInquiries] = useState<ContactInquiryRow[]>(initialInquiries);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'new' | 'in_review' | 'contacted' | 'archived'>('all');
  const [deleteTarget, setDeleteTarget] = useState<ContactInquiryRow | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [, startTransition] = useTransition();

  const filtered = inquiries.filter((inq) => {
    const matchesSearch =
      inq.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inq.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (inq.company && inq.company.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (inq.service && inq.service.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (inq.message && inq.message.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesStatus =
      statusFilter === 'all' || inq.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const handleStatusChange = (
    inquiryId: string,
    newStatus: 'new' | 'in_review' | 'contacted' | 'archived'
  ) => {
    setFeedback(null);
    startTransition(async () => {
      const result = await updateInquiryStatusAction(inquiryId, newStatus);
      if (result.success) {
        setInquiries((prev) =>
          prev.map((i) => (i.id === inquiryId ? { ...i, status: newStatus } : i))
        );
        setFeedback({ type: 'success', message: `Lead status updated to ${newStatus.replace('_', ' ')}.` });
      } else {
        setFeedback({ type: 'error', message: result.error || 'Failed to update status.' });
      }
    });
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    setFeedback(null);

    const result = await deleteInquiryAction(deleteTarget.id);
    setIsDeleting(false);

    if (result.success) {
      setInquiries((prev) => prev.filter((i) => i.id !== deleteTarget.id));
      setFeedback({ type: 'success', message: 'Inquiry deleted successfully.' });
      setDeleteTarget(null);
    } else {
      setFeedback({ type: 'error', message: result.error || 'Failed to delete inquiry.' });
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <div className="inline-flex items-center gap-2 mb-1">
            <span className="text-xs font-mono uppercase tracking-wider text-violet-400 font-bold">
              Private Client Desk
            </span>
            <span className="text-gray-600">•</span>
            <span className="text-xs text-gray-400">
              Restricted exclusively to authenticated co-founders
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            Client Inquiries & Leads Desk
          </h1>
          <p className="text-xs sm:text-sm text-gray-400 mt-1">
            Review incoming project briefs, budget allocations, service requirements, and client contact details.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Badge variant="purple" size="sm">
            {inquiries.filter((i) => i.status === 'new').length} New Leads
          </Badge>
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

      {/* Search and Status Filters */}
      <div className="p-4 rounded-2xl bg-[#14141B] border border-white/10 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-2.5 w-4 h-4 text-gray-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search leads by name, email, company, or message..."
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-black/40 border border-white/10 text-white placeholder-gray-500 text-xs focus:outline-none focus:border-violet-500 transition-colors"
          />
        </div>

        {/* Status Filter Tabs */}
        <div className="flex flex-wrap items-center gap-1.5 p-1 rounded-xl bg-black/40 border border-white/10">
          {(
            [
              { id: 'all', label: 'All' },
              { id: 'new', label: 'New' },
              { id: 'in_review', label: 'In Review' },
              { id: 'contacted', label: 'Contacted' },
              { id: 'archived', label: 'Archived' },
            ] as const
          ).map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setStatusFilter(tab.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                statusFilter === tab.id
                  ? 'bg-violet-600 text-white shadow-sm'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              {tab.label}
              {tab.id === 'new' && (
                <span className="ml-1.5 px-1.5 py-0.2 rounded-full bg-emerald-500 text-white text-[9px] font-mono font-bold">
                  {inquiries.filter((i) => i.status === 'new').length}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Inquiries List */}
      {filtered.length === 0 ? (
        <div className="p-12 text-center rounded-3xl bg-[#14141B] border border-white/10 space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-gray-500 mx-auto">
            <Mail className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">No inquiries found</h3>
            <p className="text-xs text-gray-400 max-w-sm mx-auto mt-1">
              {searchQuery || statusFilter !== 'all'
                ? 'Try resetting your search query or status filter.'
                : 'No client inquiries have been submitted through the contact form yet.'}
            </p>
          </div>
          {(searchQuery || statusFilter !== 'all') && (
            <Button
              variant="secondary"
              size="sm"
              onClick={() => {
                setSearchQuery('');
                setStatusFilter('all');
              }}
            >
              Clear Filters
            </Button>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((inquiry) => (
            <div
              key={inquiry.id}
              className="p-6 rounded-3xl bg-[#14141B] border border-white/10 hover:border-violet-500/30 transition-all space-y-4 shadow-lg group"
            >
              {/* Header row: Client, Company & Status */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-violet-600/10 border border-violet-500/20 flex items-center justify-center text-violet-400 shrink-0 font-bold text-sm">
                    {inquiry.name.slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-bold text-white group-hover:text-violet-300 transition-colors">
                        {inquiry.name}
                      </h3>
                      {inquiry.company && (
                        <span className="text-xs text-gray-400 font-medium">
                          ({inquiry.company})
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-3 text-xs text-gray-400">
                      <a
                        href={`mailto:${inquiry.email}?subject=Vixel Media — In Response to Your Inquiry`}
                        className="text-violet-400 hover:text-violet-300 hover:underline flex items-center gap-1 font-mono text-[11px]"
                      >
                        <Mail className="w-3 h-3" />
                        <span>{inquiry.email}</span>
                      </a>
                      <span className="text-gray-600">•</span>
                      <span className="text-[11px] text-gray-500 font-mono">
                        {new Date(inquiry.created_at).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Status Selector & Delete */}
                <div className="flex items-center gap-3">
                  <select
                    value={inquiry.status}
                    onChange={(e) =>
                      handleStatusChange(
                        inquiry.id,
                        e.target.value as 'new' | 'in_review' | 'contacted' | 'archived'
                      )
                    }
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold focus:outline-none cursor-pointer border ${
                      inquiry.status === 'new'
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                        : inquiry.status === 'in_review'
                        ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                        : inquiry.status === 'contacted'
                        ? 'bg-blue-500/20 text-blue-300 border-blue-500/40'
                        : 'bg-white/10 text-gray-300 border-white/10'
                    }`}
                  >
                    <option value="new" className="bg-[#14141B] text-white">● New Lead</option>
                    <option value="in_review" className="bg-[#14141B] text-white">● In Review</option>
                    <option value="contacted" className="bg-[#14141B] text-white">● Contacted</option>
                    <option value="archived" className="bg-[#14141B] text-white">● Archived</option>
                  </select>

                  <button
                    type="button"
                    onClick={() => setDeleteTarget(inquiry)}
                    title="Delete inquiry"
                    className="p-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Badges: Requested Service & Budget */}
              <div className="flex flex-wrap items-center gap-3 text-xs">
                {inquiry.service && (
                  <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-gray-300">
                    <Briefcase className="w-3.5 h-3.5 text-violet-400" />
                    <span>Service: <strong className="text-white">{inquiry.service}</strong></span>
                  </div>
                )}
                {inquiry.budget && (
                  <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-gray-300">
                    <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Budget: <strong className="text-white">{inquiry.budget}</strong></span>
                  </div>
                )}
                {inquiry.founder_preference && (
                  <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-gray-300">
                    <User className="w-3.5 h-3.5 text-blue-400" />
                    <span>Preferred Founder: <strong className="text-white capitalize">{inquiry.founder_preference}</strong></span>
                  </div>
                )}
              </div>

              {/* Message Content */}
              <div className="p-4 rounded-2xl bg-black/40 border border-white/5 space-y-1">
                <span className="text-[10px] font-mono uppercase tracking-wider text-gray-500 font-semibold block">
                  Project Brief & Requirements
                </span>
                <p className="text-xs text-gray-200 leading-relaxed whitespace-pre-line">
                  {inquiry.message}
                </p>
              </div>

              {/* Action reply */}
              <div className="flex justify-end pt-1">
                <a
                  href={`mailto:${inquiry.email}?subject=Vixel Media — Following up on your inquiry (${inquiry.service || 'Video Project'})`}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-xs font-semibold shadow-md shadow-violet-900/40 transition-colors"
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>Reply via Email</span>
                </a>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={!!deleteTarget}
        title="Delete Inquiry?"
        message={`Are you sure you want to delete the lead from ${deleteTarget?.name}? This record will be permanently deleted.`}
        confirmText="Delete Inquiry"
        isDestructive={true}
        isLoading={isDeleting}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
