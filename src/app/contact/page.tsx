import React, { Suspense } from 'react';
import type { Metadata } from 'next';
import { ContactPageContent } from './ContactPageContent';
import { getPublishedSiteContent } from '@/lib/data/siteContent';

export const metadata: Metadata = {
  title: 'Contact Us & Project Inquiry | Vixel Media',
  description: 'Get in touch with Vixel Media for custom video editing quotes, motion graphics pipelines, and creator retainers.',
};

export default async function ContactPage() {
  const contactInfo = await getPublishedSiteContent('contact_footer', {
    email: 'contact@vixelmedia.com',
    whatsapp: '+1 (555) 234-5678',
    location: 'Los Angeles, California / Worldwide Remote',
    instagram: 'https://instagram.com/vixelmedia',
    youtube: 'https://youtube.com/@vixelmedia',
    linkedin: 'https://linkedin.com/company/vixelmedia',
    twitter: 'https://twitter.com/vixelmedia',
  });

  return (
    <Suspense fallback={<div className="py-24 text-center text-gray-400">Loading inquiry desk...</div>}>
      <ContactPageContent contactInfo={contactInfo} />
    </Suspense>
  );
}
