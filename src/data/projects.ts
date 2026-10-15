import { Project } from '@/types';

export const sampleProjects: Project[] = [
  {
    id: 'project-1',
    slug: 'lumina-brand-anthem',
    title: 'Lumina — The Dawn of Ambient Sound',
    client: '[Sample Client] Lumina Audio Labs',
    category: 'long-form',
    categoryLabel: 'Long-form Video',
    description: '[Sample Project] A 7-minute cinematic brand documentary exploring acoustic physics and minimalist product design.',
    longDescription: 'Crafted as a flagship YouTube centerpiece and investor showcase. Features multi-camera 4K cinema footage, custom sound architecture, and an intimate documentary narrative arc designed to hold viewer retention through complex acoustic engineering topics.',
    deliverables: ['Main 7-minute 4K Master', '60s Cinema Trailer', '3x Vertical Hook Cutdowns', 'Custom Color Grading LUT Pack'],
    duration: '07:18',
    aspectRatio: '16:9',
    thumbnailUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=1200&q=80',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
    hasPlayableMedia: true,
    featured: true,
    metrics: {
      views: '420K+ Views',
      retentionRate: '68% Avg. Watch Time',
      engagement: '9.4% Interaction Rate'
    },
    founderId: 'founder-1', // Alex Vance
    toolsUsed: ['Adobe Premiere Pro', 'DaVinci Resolve Studio', 'Adobe Audition'],
    year: 2024
  },
  {
    id: 'project-2',
    slug: 'silk-road-3d-cartography',
    title: 'Echoes of Empires: The Silk Road 3D Map',
    client: '[Sample Client] Chronicle Documentary Channel',
    category: 'motion-graphics',
    categoryLabel: 'Motion Graphics & Map Animation',
    description: '[Sample Project] Photorealistic 3D satellite elevation flyovers and historical trade route visualizations.',
    longDescription: 'Built using GeoLayers 3, Mapbox elevation telemetry, and Cinema 4D. Animates over 8,000 miles of mountain passes and desert caravans with dynamic camera velocity and custom atmospheric lighting.',
    deliverables: ['12x Modular Map Sequences', '4K Clean Plate Renders', 'Custom Topographic HUD Elements'],
    duration: '03:45',
    aspectRatio: '16:9',
    thumbnailUrl: 'https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=1200&q=80',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
    hasPlayableMedia: true,
    featured: true,
    metrics: {
      views: '1.2M+ Views',
      retentionRate: '82% Sequence Retention'
    },
    founderId: 'founder-2', // Marcus Chen
    toolsUsed: ['Adobe After Effects', 'GeoLayers 3', 'Cinema 4D', 'Illustrator'],
    year: 2024
  },
  {
    id: 'project-3',
    slug: 'hyperflow-ai-launch',
    title: 'Hyperflow AI — Zero Latency Intelligence',
    client: '[Sample Client] Hyperflow Technologies',
    category: 'ads',
    categoryLabel: 'Commercial Ad',
    description: '[Sample Project] A fast-paced, high-conversion commercial launch video with kinetic UI and 3D typography.',
    longDescription: 'High-energy 45-second commercial engineered for high-intent paid social campaigns. Combines kinetic typography, glassmorphic software mockups, and heavy foley sound effects to explain AI data orchestration.',
    deliverables: ['45s Hero Ad', '30s & 15s Cutdowns', 'Vertical 9:16 Story Ads', 'Sound Design Stem Pack'],
    duration: '00:45',
    aspectRatio: '16:9',
    thumbnailUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4',
    hasPlayableMedia: true,
    featured: true,
    metrics: {
      roas: '4.8x ROAS',
      views: '950K Impressions'
    },
    founderId: 'founder-1', // Alex Vance
    toolsUsed: ['Premiere Pro', 'After Effects', 'Soundly'],
    year: 2024
  },
  {
    id: 'project-4',
    slug: 'viral-creator-retention-reels',
    title: 'Mastering Focus: 30-Day Viral Reel Series',
    client: '[Sample Client] Modern Mindset Podcast',
    category: 'reels',
    categoryLabel: 'Reels & Shorts',
    description: '[Sample Project] Series of 15 high-retention vertical reels with punchy typography and dynamic b-roll.',
    longDescription: 'Transformed 2-hour long podcast interviews into punchy, scroll-stopping 45-second vertical clips. Implemented zero-dead-air rhythm editing, kinetic colored word-by-word subtitles, sound punchlines, and micro-zooms.',
    deliverables: ['15x Ready-to-Post 9:16 Reels', 'Custom Branded Caption Style', 'B-Roll & Sound FX Library'],
    duration: '00:52',
    aspectRatio: '9:16',
    thumbnailUrl: 'https://images.unsplash.com/photo-1616469829941-c7200edec809?auto=format&fit=crop&w=1200&q=80',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    hasPlayableMedia: true,
    featured: true,
    metrics: {
      views: '2.8M Total Views',
      engagement: '14.2% Share Rate'
    },
    founderId: 'founder-2', // Marcus Chen
    toolsUsed: ['Premiere Pro', 'After Effects', 'Photoshop'],
    year: 2024
  },
  {
    id: 'project-5',
    slug: 'strata-kinetic-brand-system',
    title: 'Strata Energy — Kinetic Motion Identity',
    client: '[Sample Client] Strata Clean Tech',
    category: 'motion-graphics',
    categoryLabel: 'Motion Graphics',
    description: '[Sample Project] A modular brand motion system with fluid particles and 3D data visualizations.',
    longDescription: 'Created a comprehensive broadcast-grade motion design system. Delivered customizable lower-thirds, animated transitions, particle stream animations, and title cards for recurring brand content.',
    deliverables: ['Motion Design System Guidelines', '6x MOGRT Dynamic Templates', '3D Particle Loops'],
    duration: '01:20',
    aspectRatio: '16:9',
    thumbnailUrl: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1200&q=80',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    hasPlayableMedia: true,
    featured: true,
    metrics: {
      retentionRate: '88% Completion'
    },
    founderId: 'founder-2', // Marcus Chen
    toolsUsed: ['Cinema 4D', 'After Effects', 'Redshift'],
    year: 2024
  },
  {
    id: 'project-6',
    slug: 'apex-velocity-commercial',
    title: 'Apex Footwear — The Frictionless Run',
    client: '[Sample Client] Apex Athletic Gear',
    category: 'ads',
    categoryLabel: 'Commercial Ad',
    description: '[Sample Project] Fast-paced commercial featuring high-frame-rate speed ramps and explosive sound design.',
    longDescription: 'High-octane commercial that matches rhythmic percussion with athletic movement. Synchronized slow-motion 120fps cuts with explosive bass drops and energetic color grading.',
    deliverables: ['30s TV & Web Spot', '15s Vertical Cut for TikTok Ads', 'Sound Mix in 5.1 & Stereo'],
    duration: '00:30',
    aspectRatio: '16:9',
    thumbnailUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1200&q=80',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyBlazes.mp4',
    hasPlayableMedia: true,
    featured: true,
    metrics: {
      roas: '5.2x Verified Return',
      views: '1.4M Paid Views'
    },
    founderId: 'founder-1', // Alex Vance
    toolsUsed: ['DaVinci Resolve', 'Premiere Pro', 'Audition'],
    year: 2024
  },
  {
    id: 'project-7',
    slug: 'nordic-frontier-documentary',
    title: 'Beyond the Arctic: Expedition Svalbard',
    client: '[Sample Client] Terra Expeditions',
    category: 'long-form',
    categoryLabel: 'Long-form Video',
    description: '[Sample Project] A 14-minute cinematic documentary following research vessels across arctic ice fields.',
    longDescription: 'Full editorial post-production for a natural history documentary. Features extensive drone color grading in DaVinci Resolve, wind noise restoration, and custom atmospheric ambient soundscapes.',
    deliverables: ['14-minute 4K Festival Master', 'Trailer', 'Soundtrack Stem Masters'],
    duration: '14:20',
    aspectRatio: '16:9',
    thumbnailUrl: 'https://images.unsplash.com/photo-1517411032315-54ef2cb783bb?auto=format&fit=crop&w=1200&q=80',
    // Intentionally no playable media URL to demonstrate the requirement:
    // "Show a clear placeholder when a project has no playable media"
    hasPlayableMedia: false,
    featured: true,
    metrics: {
      views: 'Selected at 3 Film Festivals'
    },
    founderId: 'founder-1', // Alex Vance
    toolsUsed: ['DaVinci Resolve Studio', 'Premiere Pro', 'iZotope RX'],
    year: 2023
  },
  {
    id: 'project-8',
    slug: 'creator-daily-short-bundle',
    title: 'Finance Unlocked: 40-Episode Shorts Pipeline',
    client: '[Sample Client] Capital Vision Media',
    category: 'reels',
    categoryLabel: 'Reels & Shorts',
    description: '[Sample Project] Scalable vertical editing pipeline delivering daily 30-second financial breakdowns.',
    longDescription: 'High-frequency production workflow designed for daily publishing. Leveraged custom After Effects kinetic graphics, stock chart visualizers, and punchy editorial timing.',
    deliverables: ['40x Vertical Videos', 'Thumbnail Stills', 'SEO Metadata Templates'],
    duration: '00:38',
    aspectRatio: '9:16',
    thumbnailUrl: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=1200&q=80',
    hasPlayableMedia: false,
    featured: false,
    metrics: {
      views: '5.1M Total Aggregate Views'
    },
    founderId: 'founder-2', // Marcus Chen
    toolsUsed: ['After Effects', 'Premiere Pro'],
    year: 2024
  },
  {
    id: 'project-9',
    slug: 'geopolitics-canal-route',
    title: 'Chokepoints: The Suez Dilemma 3D Mapping',
    client: '[Sample Client] World Perspective Journal',
    category: 'motion-graphics',
    categoryLabel: 'Motion Graphics & Map Animation',
    description: '[Sample Project] Animated maritime route visualization showing global shipping flow vulnerabilities.',
    longDescription: 'Custom 3D globe animation demonstrating maritime choke points, ship transit densities, and freight insurance escalation models.',
    deliverables: ['3D Animated Globe Sequence', 'Bathymetric Water Shading Plate', 'Vector Infographics'],
    duration: '02:15',
    aspectRatio: '16:9',
    thumbnailUrl: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=1200&q=80',
    hasPlayableMedia: false,
    featured: false,
    metrics: {
      retentionRate: '79% Video Completion'
    },
    founderId: 'founder-2', // Marcus Chen
    toolsUsed: ['GeoLayers 3', 'After Effects', 'Blender'],
    year: 2024
  }
];

export function getProjectBySlug(slug: string): Project | undefined {
  return sampleProjects.find((p) => p.slug === slug);
}

export function getProjectsByFounder(founderId: string): Project[] {
  return sampleProjects.filter((p) => p.founderId === founderId);
}
