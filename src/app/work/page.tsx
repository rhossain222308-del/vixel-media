import React from 'react';
import type { Metadata } from 'next';
import { getPublishedProjects } from '@/lib/data/projects';
import { WorkClientView } from './WorkClientView';

export const metadata: Metadata = {
  title: 'Selected Agency Works | Vixel Media',
  description: 'Browse our complete catalog of video productions, commercial spots, high-retention vertical reels, and 3D map cartography.',
};

export default async function WorkPage() {
  const projects = await getPublishedProjects();

  return <WorkClientView initialProjects={projects} />;
}
