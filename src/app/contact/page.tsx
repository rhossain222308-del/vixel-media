import React, { Suspense } from 'react';
import type { Metadata } from 'next';
import { ContactPageContent } from './ContactPageContent';

export const metadata: Metadata = {
  title: 'Contact Us & Project Inquiry | Vixel Media',
  description: 'Get in touch with Vixel Media for custom video editing quotes, motion graphics pipelines, and creator retainers.',
};

export default function ContactPage() {
  return (
    <Suspense fallback={<div className="py-24 text-center text-gray-400">Loading inquiry desk...</div>}>
      <ContactPageContent />
    </Suspense>
  );
}
