import { BlogPost } from '@/types';

export const sampleBlogPosts: BlogPost[] = [
  {
    id: 'post-1',
    slug: 'retention-science-youtube-long-form',
    title: 'The Psychology of Pacing: How We Maintain 65%+ Retention on 15-Minute Videos',
    excerpt: 'Analyzing micro-hooks, visual reset intervals, and auditory pattern interrupts that stop viewers from clicking away.',
    content: [
      'In modern video post-production, retention is not achieved by frantic, continuous movement—it is achieved through strategic rhythmic contrast. When every second is filled with sound effects and screen shakes, the human brain acclimatizes and boredom sets in.',
      'Our editorial philosophy at Vixel Media relies on what we call "Visual Tension & Release". For every 8 to 12 seconds of high-density information or kinetic visual stimulation, we introduce a 2-second breathing room cut with pure ambient sound. This allows the viewer\'s cognitive load to reset without losing immersion.',
      'Key findings from testing over 150 long-form YouTube episodes include: placing audio pattern interrupts prior to visual cuts, utilizing asymmetrical J-cuts to lead the viewer into the next concept, and reserving full-screen 3D graphic animations for moments of highest conceptual abstraction.'
    ],
    category: 'Editorial Strategy',
    readTime: '6 min read',
    publishedAt: 'October 12, 2024',
    author: {
      name: 'Alex Vance',
      role: 'Co-Founder & Creative Director',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'
    },
    coverImage: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&w=1200&q=80',
    tags: ['YouTube Growth', 'Pacing Psychology', 'Video Editing', 'Audience Retention']
  },
  {
    id: 'post-2',
    slug: '3d-map-animations-geolayers-guide',
    title: 'Inside Our 3D Map Pipeline: Bringing Geopolitics and Terrain to Life',
    excerpt: 'A behind-the-scenes look at how we combine GeoLayers 3, elevation heightmaps, and Cinema 4D lighting for documentary impact.',
    content: [
      'Top-tier documentary channels like Vox and Johnny Harris transformed how audiences consume complex geopolitical conflicts and environmental journeys. Static satellite screenshots no longer suffice.',
      'At Vixel Media, our 3D cartography pipeline begins with NASA SRTM elevation telemetry and satellite textures. Using GeoLayers 3 within After Effects, we pin vector paths to accurate geographic coordinates, ensuring that historical troop movements or trade flows reflect physical terrain realism.',
      'By transferring our camera paths into Cinema 4D or Blender for volumetric atmospheric scattering and golden-hour sun angles, we create maps that feel like cinematic IMAX drone footage rather than 2D diagrams.'
    ],
    category: 'Motion & VFX',
    readTime: '8 min read',
    publishedAt: 'September 28, 2024',
    author: {
      name: 'Marcus Chen',
      role: 'Co-Founder & Head of Motion Design',
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80'
    },
    coverImage: 'https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=1200&q=80',
    tags: ['Map Animation', 'After Effects', 'GeoLayers 3', 'Documentary Visuals']
  },
  {
    id: 'post-3',
    slug: 'vertical-hooks-that-convert',
    title: 'The First 1.5 Seconds: Crafting Viral Short-Form Hooks for Reels & TikTok',
    excerpt: 'Why traditional intro title sequences destroy short-form reach, and the exact visual disruption techniques we use instead.',
    content: [
      'In short-form vertical feeds (Instagram Reels, TikTok, YouTube Shorts), your viewer has the physical thumb readiness to swipe away within 1,200 milliseconds. If your video opens with "Hey guys, welcome back," you have already lost 70% of the audience.',
      'Instead, high-converting hooks utilize visual dissonance: opening in the middle of physical motion, displaying an unexpected text premise, or creating an immediate auditory pattern disruption.',
      'We also structure subtitle color accents to highlight high-emotional valence words in contrasting neon purple and gold, guiding the viewer\'s focal center to the middle third of the phone screen where the eye naturally rests.'
    ],
    category: 'Short-Form Video',
    readTime: '5 min read',
    publishedAt: 'September 15, 2024',
    author: {
      name: 'Marcus Chen',
      role: 'Co-Founder & Head of Motion Design',
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80'
    },
    coverImage: 'https://images.unsplash.com/photo-1616469829941-c7200edec809?auto=format&fit=crop&w=1200&q=80',
    tags: ['Reels', 'TikTok Hooks', 'Short-form Strategy', 'Subtitles']
  }
];

export function getBlogPostBySlug(slug: string): BlogPost | undefined {
  return sampleBlogPosts.find((post) => post.slug === slug);
}
