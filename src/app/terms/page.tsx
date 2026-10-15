import React from 'react';
import type { Metadata } from 'next';
import { Badge } from '@/components/ui/Badge';
import { AlertCircle } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Terms of Service | Vixel Media',
  description: 'Draft Terms of Service for creative post-production, revision cycles, and licensing with Vixel Media.',
};

export default function TermsOfServicePage() {
  return (
    <div className="py-12 sm:py-16 md:py-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-10 text-center">
          <Badge variant="purple" className="mb-3">Legal Draft</Badge>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white">Terms of Service</h1>
          <p className="text-sm text-gray-400 mt-2">Last updated: October 2024</p>

          <div className="mt-6 p-4 rounded-2xl bg-amber-950/30 border border-amber-500/30 text-left text-xs text-amber-200 flex items-start gap-3">
            <AlertCircle className="w-4 h-4 text-amber-400 mt-0.5 shrink-0" />
            <span>
              <strong>Draft Content Notice:</strong> These terms are an editable staging template defining production scope, revision cycles, and asset licensing. They should be reviewed by legal counsel before signing formal master service agreements.
            </span>
          </div>
        </div>

        <div className="prose prose-invert max-w-none space-y-8 text-sm sm:text-base text-gray-300 leading-relaxed bg-[#14141B] p-8 sm:p-12 rounded-3xl border border-white/10">
          <section className="space-y-3">
            <h2 className="text-xl font-bold text-white">1. Scope of Post-Production Services</h2>
            <p>
              Vixel Media delivers video post-production services including editing, color grading, audio sweetening, motion graphics, and 3D map animations according to the deliverables agreed upon in each specific Statement of Work (SOW) or written quotation.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-white">2. Revision Rounds & Frame.io Feedback</h2>
            <p>
              Standard single-sprint projects include up to two (2) comprehensive rounds of feedback. Feedback must be consolidated via Frame.io or written timecodes within five (5) business days of rough-cut delivery. Substantial script, concept, or structural re-edits requested after rough-cut approval may be subject to additional scoping.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-white">3. Commercial Music & Sound Licensing</h2>
            <p>
              All music and sound effects incorporated into final deliverables are licensed under valid commercial licenses (via Artlist, Musicbed, or Soundstripe) for global online streaming, broadcast, and digital advertising as defined in the project scope.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-white">4. Ownership & Intellectual Property</h2>
            <p>
              Upon receipt of full payment, the client owns all final exported video deliverables. Raw project files (such as Adobe Premiere Pro .prproj, After Effects .aep, or DaVinci .drp project files) remain studio property unless explicitly included in the purchased project package deliverables.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-white">5. Governing Law</h2>
            <p>
              These draft terms are governed under applicable state and federal commercial laws. For formal contract execution or enterprise Master Services Agreements (MSA), contact <a href="mailto:hello@vixelmedia.demo" className="text-violet-400 underline">hello@vixelmedia.demo</a>.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
