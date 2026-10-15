'use client';

import React, { useState } from 'react';
import { ChevronDown, ArrowRight, MessageSquare } from 'lucide-react';
import { agencyFaqs } from '@/data/faq';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';

export function FaqClientView() {
  const [openIds, setOpenIds] = useState<string[]>(['faq-1', 'faq-2']);
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const toggleFaq = (id: string) => {
    if (openIds.includes(id)) {
      setOpenIds(openIds.filter((item) => item !== id));
    } else {
      setOpenIds([...openIds, id]);
    }
  };

  const categories = [
    { key: 'all', label: 'All Questions' },
    { key: 'production', label: 'Production & Revisions' },
    { key: 'delivery', label: 'Turnaround & Formats' },
    { key: 'pricing', label: 'Pricing & Scoping' },
    { key: 'general', label: 'General & Licensing' },
  ];

  const filteredFaqs = agencyFaqs.filter((faq) => {
    if (activeCategory === 'all') return true;
    return faq.category === activeCategory;
  });

  return (
    <div className="py-12 sm:py-16 md:py-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <Badge variant="purple" className="mb-4">
            Answers & Clarity
          </Badge>
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold text-white tracking-tight leading-tight">
            Frequently Asked <span className="text-gradient">Questions.</span>
          </h1>
          <p className="mt-4 text-base sm:text-lg text-gray-300 leading-relaxed max-w-2xl mx-auto">
            Everything you need to know about our footage transfer workflows, Frame.io revision process, master deliverables, and project turnaround.
          </p>
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center justify-center flex-wrap gap-2 mb-10">
          {categories.map((cat) => (
            <button
              key={cat.key}
              onClick={() => setActiveCategory(cat.key)}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all cursor-pointer ${
                activeCategory === cat.key
                  ? 'bg-gradient-to-r from-violet-600 to-purple-600 text-white shadow-lg shadow-violet-900/30'
                  : 'bg-[#14141B] text-gray-400 hover:text-white border border-white/5'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* FAQ Accordion List */}
        <div className="space-y-4">
          {filteredFaqs.map((faq) => {
            const isOpen = openIds.includes(faq.id);

            return (
              <div
                key={faq.id}
                className="rounded-2xl bg-[#14141B] border border-white/10 hover:border-violet-500/30 transition-all overflow-hidden"
              >
                <button
                  onClick={() => toggleFaq(faq.id)}
                  aria-expanded={isOpen}
                  className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 cursor-pointer focus:outline-none focus:ring-2 focus:ring-violet-500/50"
                >
                  <span className="text-base sm:text-lg font-semibold text-white">
                    {faq.question}
                  </span>
                  <div
                    className={`w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-gray-400 shrink-0 transition-transform duration-300 ${
                      isOpen ? 'rotate-180 text-violet-400 bg-violet-600/20' : ''
                    }`}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-5 pb-6 sm:px-6 sm:pb-6 text-sm text-gray-300 leading-relaxed border-t border-white/5 pt-4 animate-in fade-in duration-200">
                    <p>{faq.answer}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Still have questions card */}
        <div className="mt-16 p-8 rounded-3xl bg-gradient-to-b from-[#181824] to-[#121217] border border-white/10 text-center">
          <div className="w-12 h-12 rounded-2xl bg-violet-600/20 text-violet-400 flex items-center justify-center mx-auto mb-4">
            <MessageSquare className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">Have a specific production question?</h3>
          <p className="text-sm text-gray-400 max-w-md mx-auto mb-6">
            We are happy to jump on a brief discovery call or reply via WhatsApp to review your footage logistics.
          </p>
          <Button href="/contact" variant="primary" size="md" icon={<ArrowRight className="w-4 h-4" />}>
            Ask Our Editorial Leads
          </Button>
        </div>
      </div>
    </div>
  );
}
