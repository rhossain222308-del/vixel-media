import { Founder } from '@/types';

export const sampleFounders: Founder[] = [
  {
    id: 'founder-1',
    slug: 'alex-vance',
    name: 'Alex Vance',
    role: 'Co-Founder & Creative Director / Lead Editor',
    tagline: 'Architect of narrative pacing, cinematic color science, and high-retention video storytelling.',
    shortBio: '[Sample Profile] 8+ years crafting cinematic brand documentaries, YouTube masterclasses, and high-conversion commercial films.',
    fullBio: [
      '[Sample Profile - Co-Founder Biography Placeholder]',
      'Alex specializes in narrative architecture, pacing psychology, and high-end DaVinci Resolve color grading. Having edited for top-tier digital creators and commercial brands, Alex focuses on turning raw footage into cinematic experiences that command viewer retention.',
      'At Vixel Media, Alex leads video editing pipelines, editorial quality standards, and client creative direction for long-form, corporate, and narrative brand productions.',
      'Note: This profile content is sample data structured for CMS integration. Official biographical details, headshot, and verified client roster will be configured via the upcoming Supabase admin panel.'
    ],
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80',
    coverUrl: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&w=1600&q=80',
    email: 'alex@vixelmedia.demo',
    location: 'Los Angeles / Remote',
    yearsExperience: 8,
    socials: {
      instagram: 'https://instagram.com',
      x: 'https://x.com',
      linkedin: 'https://linkedin.com',
      youtube: 'https://youtube.com',
    },
    skills: [
      { name: 'Narrative Pacing & Story Architecture', level: 96, category: 'Editing' },
      { name: 'DaVinci Resolve Color Grading & HDR', level: 92, category: 'Color & Grading' },
      { name: 'Multi-cam & Long-form Documentary', level: 94, category: 'Editing' },
      { name: 'Audio Mixing & Foley Sound Design', level: 88, category: 'Sound Design' },
      { name: 'Creative Directing & Client Onboarding', level: 90, category: 'Directing' },
    ],
    tools: [
      { name: 'Adobe Premiere Pro', category: 'NLE', iconName: 'Film' },
      { name: 'DaVinci Resolve Studio', category: 'Color & Mastering', iconName: 'Palette' },
      { name: 'Apple Final Cut Pro', category: 'Editorial', iconName: 'Video' },
      { name: 'Adobe Audition', category: 'Audio Engineering', iconName: 'Headphones' },
      { name: 'Frame.io', category: 'Client Review & QA', iconName: 'CheckCircle2' },
    ],
    experience: [
      {
        year: '2023 - Present',
        role: 'Co-Founder & Creative Director',
        companyOrClient: 'Vixel Media Studio',
        description: 'Directing editorial pipelines, overseeing client post-production workflows, and setting visual language.'
      },
      {
        year: '2020 - 2023',
        role: 'Senior Commercial Video Editor',
        companyOrClient: 'Aura Digital Productions',
        description: 'Lead editor for tech brand launches, venture-backed company profiles, and episodic YouTube series.'
      },
      {
        year: '2017 - 2020',
        role: 'Post-Production Specialist',
        companyOrClient: 'Independent Creator Studio',
        description: 'Edited over 400+ videos with an aggregate viewership surpassing 85M organic views.'
      }
    ],
    sampleClients: [
      'Sample Tech Brand Alpha',
      'Creator Studio Lab',
      'Nordic Venture Group',
      'Horizon Media Collective'
    ],
    featuredProjectIds: ['project-1', 'project-3', 'project-7']
  },
  {
    id: 'founder-2',
    slug: 'marcus-chen',
    name: 'Marcus Chen',
    role: 'Co-Founder & Head of Motion Design / VFX',
    tagline: 'Transforming complex data and geographic journeys into dynamic 3D map animations and kinetic visuals.',
    shortBio: '[Sample Profile] Master of After Effects, 3D cartography, kinetic typography, and scroll-stopping short-form hooks.',
    fullBio: [
      '[Sample Profile - Co-Founder Biography Placeholder]',
      'Marcus brings a technical yet intensely creative approach to motion design and visual effects. With deep expertise in After Effects, Cinema 4D, and GeoLayers 3D cartography, Marcus creates visual hooks that explain complex stories in seconds.',
      'At Vixel Media, Marcus spearheads motion graphics systems, map animation sequences, and high-velocity short-form vertical assets (Reels & Shorts) engineered for algorithmic retention.',
      'Note: This profile content is sample data structured for CMS integration. Official biographical details, headshot, and verified client roster will be configured via the upcoming Supabase admin panel.'
    ],
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80',
    coverUrl: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1600&q=80',
    email: 'marcus@vixelmedia.demo',
    location: 'San Francisco / Remote',
    yearsExperience: 7,
    socials: {
      instagram: 'https://instagram.com',
      x: 'https://x.com',
      linkedin: 'https://linkedin.com',
      behance: 'https://behance.net',
    },
    skills: [
      { name: '3D Map & Geographic Journey Animation', level: 98, category: 'VFX & Motion' },
      { name: 'Kinetic Typography & Brand Motion Systems', level: 95, category: 'VFX & Motion' },
      { name: 'Vertical Reel & Short-Form Retention Hooks', level: 96, category: 'Editing' },
      { name: '3D Product Rendering & Compositing', level: 86, category: 'VFX & Motion' },
      { name: 'Sound FX Sync & Micro-Animations', level: 90, category: 'Sound Design' },
    ],
    tools: [
      { name: 'Adobe After Effects', category: 'Motion Graphics', iconName: 'Sparkles' },
      { name: 'GeoLayers 3 & Mapbox', category: '3D Map Cartography', iconName: 'Compass' },
      { name: 'Cinema 4D / Blender', category: '3D Animation', iconName: 'Layers' },
      { name: 'Adobe Illustrator', category: 'Vector Assets', iconName: 'PenTool' },
      { name: 'Premiere Pro', category: 'Timeline Assembly', iconName: 'Film' },
    ],
    experience: [
      {
        year: '2023 - Present',
        role: 'Co-Founder & Motion Lead',
        companyOrClient: 'Vixel Media Studio',
        description: 'Leading 3D map animations, bespoke title design, and motion identity for international creators.'
      },
      {
        year: '2021 - 2023',
        role: 'Motion Graphic Designer & Cartographer',
        companyOrClient: 'Apex Visual Lab',
        description: 'Developed custom geographic storytelling animations and graphics packages for documentary channels.'
      },
      {
        year: '2018 - 2021',
        role: 'Short-Form Video Specialist',
        companyOrClient: 'Viral Peak Agency',
        description: 'Engineered viral TikTok & Reels content strategies reaching tens of millions of views.'
      }
    ],
    sampleClients: [
      'Documentary Channel X',
      'Global Atlas Insights',
      'Apex Mobility Corp',
      'Pulse Fitness Apparel'
    ],
    featuredProjectIds: ['project-2', 'project-5', 'project-6']
  }
];

export function getFounderBySlug(slug: string): Founder | undefined {
  return sampleFounders.find((founder) => founder.slug === slug);
}
