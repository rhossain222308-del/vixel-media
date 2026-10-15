import React from 'react';
import type { Metadata } from 'next';
import { FaqClientView } from './FaqClientView';

export const metadata: Metadata = {
  title: 'Frequently Asked Questions | Vixel Media',
  description: 'Find answers to common questions about video editing turnaround, footage transfer, Frame.io revisions, and commercial music licensing.',
};

export default function FaqPage() {
  return <FaqClientView />;
}
