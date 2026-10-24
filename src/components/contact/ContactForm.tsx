'use client';

import React, { useState } from 'react';
import { 
  Send, 
  CheckCircle2, 
  Sparkles,
  AlertCircle
} from 'lucide-react';
import { Button } from '../ui/Button';
import { submitInquiryAction } from '@/lib/actions/inquiries';

interface ContactFormProps {
  initialService?: string;
}

export const ContactForm: React.FC<ContactFormProps> = ({ initialService = '' }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    service: initialService || 'Video Editing',
    budget: '$3,000 - $7,500',
    description: '',
    timeline: 'Within 2-4 weeks',
    honeypot: '',
  });

  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const services = [
    'Video Editing',
    'Reels & Shorts Editing',
    'Motion Graphics & Animation',
    'Brand Storytelling Videos',
    'Social Media Content Creation',
    'Map Animation',
    'Full Creative Retainer'
  ];

  const budgetTiers = [
    '< $2,500 (Small Project / Pilot)',
    '$2,500 - $5,000 (Standard Production)',
    '$5,000 - $10,000 (Brand Anthem / Multi-Video)',
    '$10,000+ (Comprehensive Campaign)',
    'Undetermined / Discussion Needed'
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage(null);

    const data = new FormData();
    data.append('name', formData.name);
    data.append('email', formData.email);
    data.append('company', formData.company);
    data.append('service', formData.service);
    data.append('budget', formData.budget);
    data.append('timeline', formData.timeline);
    data.append('message', formData.description);
    data.append('website_url', formData.honeypot); // Bot honeypot trap

    try {
      const response = await submitInquiryAction(null, data);
      if (response.success) {
        setSubmitted(true);
      } else {
        setErrorMessage(response.error || 'Failed to submit inquiry. Please try again.');
      }
    } catch (err) {
      console.error('Submission failed:', err);
      setErrorMessage('An unexpected error occurred. Please try again or reach out via email.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative rounded-3xl bg-[#14141B] border border-white/10 p-6 sm:p-10 shadow-2xl backdrop-blur-xl">
      {/* Notice alert */}
      <div className="mb-8 p-3.5 rounded-2xl bg-violet-950/40 border border-violet-500/20 flex items-start gap-3">
        <Sparkles className="w-4 h-4 text-violet-400 mt-0.5 shrink-0" />
        <p className="text-xs text-gray-300 leading-relaxed">
          <strong className="text-white">Studio Response Guarantee:</strong> Inquiries are processed with server-side validation, rate limiting, and honeypot protection, directly syncing with our editorial production desk.
        </p>
      </div>

      {errorMessage && (
        <div className="mb-6 p-4 rounded-xl bg-red-950/40 border border-red-500/30 flex items-center gap-3 text-red-300 text-sm">
          <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {submitted ? (
        <div className="py-12 px-4 text-center space-y-4 animate-in fade-in zoom-in-95 duration-300">
          <div className="w-16 h-16 rounded-2xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto shadow-xl shadow-emerald-950/40">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <h3 className="text-2xl font-bold text-white">
            Project Inquiry Received!
          </h3>

          <p className="text-sm text-gray-300 max-w-md mx-auto leading-relaxed">
            Thank you, <strong className="text-white">{formData.name}</strong>. Your inquiry for <strong className="text-violet-300">{formData.service}</strong> has been received. Our editorial team will review your project scope and follow up within 24 business hours.
          </p>

          <div className="p-4 rounded-xl bg-white/5 border border-white/5 text-xs text-left max-w-md mx-auto space-y-1.5 font-mono text-gray-400">
            <div><strong>Client:</strong> {formData.name} ({formData.email})</div>
            <div><strong>Target Scope:</strong> {formData.service}</div>
            <div><strong>Budget Range:</strong> {formData.budget}</div>
            <div><strong>Target Timeline:</strong> {formData.timeline}</div>
          </div>

          <div className="pt-4">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => {
                setSubmitted(false);
                setFormData({
                  name: '',
                  email: '',
                  company: '',
                  service: 'Video Editing',
                  budget: '$3,000 - $7,500',
                  description: '',
                  timeline: 'Within 2-4 weeks',
                  honeypot: '',
                });
              }}
            >
              Submit Another Inquiry
            </Button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Honeypot field to trap spam bots */}
          <div className="hidden" aria-hidden="true" style={{ display: 'none' }}>
            <label htmlFor="website_url">Website URL</label>
            <input
              id="website_url"
              name="website_url"
              type="text"
              tabIndex={-1}
              autoComplete="off"
              value={formData.honeypot}
              onChange={(e) => setFormData({ ...formData, honeypot: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* Name */}
            <div>
              <label htmlFor="name" className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-2">
                Your Full Name <span className="text-violet-400">*</span>
              </label>
              <input
                id="name"
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Sarah Jenkins"
                className="w-full px-4 py-3 rounded-xl bg-[#0F0F14] border border-white/10 text-white placeholder-gray-500 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500 transition-all"
              />
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-2">
                Work Email <span className="text-violet-400">*</span>
              </label>
              <input
                id="email"
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="sarah@company.com"
                className="w-full px-4 py-3 rounded-xl bg-[#0F0F14] border border-white/10 text-white placeholder-gray-500 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500 transition-all"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* Company / Brand */}
            <div>
              <label htmlFor="company" className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-2">
                Brand / Channel Name
              </label>
              <input
                id="company"
                type="text"
                value={formData.company}
                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                placeholder="e.g. Lumina Audio Labs"
                className="w-full px-4 py-3 rounded-xl bg-[#0F0F14] border border-white/10 text-white placeholder-gray-500 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500 transition-all"
              />
            </div>

            {/* Service */}
            <div>
              <label htmlFor="service" className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-2">
                Primary Service Needed <span className="text-violet-400">*</span>
              </label>
              <select
                id="service"
                value={formData.service}
                onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-[#0F0F14] border border-white/10 text-white text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500 transition-all"
              >
                {services.map((svc) => (
                  <option key={svc} value={svc} className="bg-[#14141B] text-white">
                    {svc}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* Budget */}
            <div>
              <label htmlFor="budget" className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-2">
                Estimated Project Budget
              </label>
              <select
                id="budget"
                value={formData.budget}
                onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-[#0F0F14] border border-white/10 text-white text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500 transition-all"
              >
                {budgetTiers.map((tier) => (
                  <option key={tier} value={tier} className="bg-[#14141B] text-white">
                    {tier}
                  </option>
                ))}
              </select>
            </div>

            {/* Timeline */}
            <div>
              <label htmlFor="timeline" className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-2">
                Target Timeline
              </label>
              <input
                id="timeline"
                type="text"
                value={formData.timeline}
                onChange={(e) => setFormData({ ...formData, timeline: e.target.value })}
                placeholder="e.g. Needed by end of the month"
                className="w-full px-4 py-3 rounded-xl bg-[#0F0F14] border border-white/10 text-white placeholder-gray-500 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500 transition-all"
              />
            </div>
          </div>

          {/* Project Description */}
          <div>
            <label htmlFor="description" className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-2">
              Project Scope & Vision <span className="text-violet-400">*</span>
            </label>
            <textarea
              id="description"
              required
              rows={4}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Tell us about the video concept, raw footage available, target audience, reference videos, and key goals..."
              className="w-full px-4 py-3 rounded-xl bg-[#0F0F14] border border-white/10 text-white placeholder-gray-500 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500 transition-all leading-relaxed"
            />
          </div>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            disabled={isSubmitting}
            className="w-full"
            icon={<Send className="w-4 h-4" />}
          >
            {isSubmitting ? 'Submitting Inquiry...' : 'Submit Project Inquiry'}
          </Button>

          <p className="text-[11px] text-gray-500 text-center">
            🔒 We respect NDA agreements. Your raw footage, scripts, and concepts remain 100% confidential.
          </p>
        </form>
      )}
    </div>
  );
};
