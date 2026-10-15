import React from 'react';
import type { Metadata } from 'next';
import { Badge } from '@/components/ui/Badge';
import { AlertCircle } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Privacy Policy | Vixel Media',
  description: 'Draft Privacy Policy for Vixel Media video agency website and client asset handling.',
};

export default function PrivacyPolicyPage() {
  return (
    <div className="py-12 sm:py-16 md:py-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-10 text-center">
          <Badge variant="purple" className="mb-3">Legal Draft</Badge>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white">Privacy Policy</h1>
          <p className="text-sm text-gray-400 mt-2">Last updated: October 2024</p>

          <div className="mt-6 p-4 rounded-2xl bg-amber-950/30 border border-amber-500/30 text-left text-xs text-amber-200 flex items-start gap-3">
            <AlertCircle className="w-4 h-4 text-amber-400 mt-0.5 shrink-0" />
            <span>
              <strong>Draft Content Notice:</strong> This privacy policy is an editable draft document provided for staging and architectural completeness. It does not constitute formal legal counsel and should be reviewed by qualified legal counsel prior to formal production deployment.
            </span>
          </div>
        </div>

        <div className="prose prose-invert max-w-none space-y-8 text-sm sm:text-base text-gray-300 leading-relaxed bg-[#14141B] p-8 sm:p-12 rounded-3xl border border-white/10">
          <section className="space-y-3">
            <h2 className="text-xl font-bold text-white">1. Overview & Scope</h2>
            <p>
              Vixel Media (&ldquo;we,&rdquo; &ldquo;our,&rdquo; or &ldquo;us&rdquo;) provides high-end video post-production, motion graphics, and creative content services. This Privacy Policy describes how we handle information collected through our website, contact forms, and collaborative client platforms (such as Frame.io and Google Workspace).
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-white">2. Information We Collect</h2>
            <ul className="list-disc pl-5 space-y-1.5 text-gray-400">
              <li><strong>Contact Information:</strong> Name, work email address, company or channel name, and optional phone numbers provided via inquiry forms.</li>
              <li><strong>Project Metadata:</strong> Video brief details, target delivery timelines, budget tier selections, and script outlines.</li>
              <li><strong>Digital Telemetry:</strong> Anonymized usage data such as browser type, referring URL, and pages visited to optimize website performance.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-white">3. Client Media Assets & Raw Footage Confidentiality</h2>
            <p>
              All video footage, audio recordings, project files, and unreleased intellectual property provided by clients are treated under strict confidentiality. We do not sell, rent, or distribute client footage to third parties. Media files are stored on encrypted cloud drives and are accessible solely by assigned editors and directors.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-white">4. Showcase Rights & NDA Respect</h2>
            <p>
              We only display client projects in our portfolio or marketing materials where explicit client consent or broadcast publication has occurred. For NDA-bound unreleased campaigns, project assets remain strictly confidential until public embargo release.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-white">5. Contact Information</h2>
            <p>
              For privacy inquiries, NDA requests, or footage deletion requests, please contact our studio leads at <a href="mailto:hello@vixelmedia.demo" className="text-violet-400 underline">hello@vixelmedia.demo</a>.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
