import { Service } from '@/types';

export const agencyServices: Service[] = [
  {
    id: 'service-video-editing',
    slug: 'video-editing',
    title: 'Video Editing',
    badge: 'Core Specialty',
    shortDescription: 'Cinematic long-form, YouTube masterclasses, and corporate video editing with rhythm and retention.',
    fullDescription: 'We transform raw A-roll and multi-camera footage into polished, rhythmic stories that maintain audience retention from the first second to the final frame. Every cut, beat drop, J-cut, and transition is meticulously tuned to eliminate dead air and maximize viewer engagement.',
    deliverables: [
      'Multi-cam assembly & A/B narrative cut',
      'Pacing optimization & dead-air reduction',
      'DaVinci Resolve color correction & LUT grading',
      'Comprehensive audio enhancement, mastering & SFX',
      'Lower thirds, title cards & chapter markers',
      'Full 4K ProRes & H.264 web master deliveries'
    ],
    intendedPlatforms: ['YouTube', 'Vimeo', 'Corporate Portals', 'Investor Presentations', 'Webinar Repurposing'],
    turnaroundTime: '3 - 5 business days per long-form episode',
    idealFor: 'YouTubers, educational creators, enterprise teams, and podcast hosts looking for premium production quality.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&w=1200&q=80',
    sampleVideoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    features: [
      'Retention-focused rhythm cuts',
      'Dynamic B-roll sourcing and archival montage',
      'Custom color grading matching your brand palette',
      'Stereo audio sweetening and noise cleanup'
    ]
  },
  {
    id: 'service-reels-shorts',
    slug: 'reels-shorts-editing',
    title: 'Reels & Shorts Editing',
    badge: 'High Viral Impact',
    shortDescription: 'Scroll-stopping 9:16 vertical videos engineered for algorithmic retention, watch time, and shares.',
    fullDescription: 'In vertical video, the first 1.5 seconds decide whether a viewer swipes away or stays. We engineer every reel, TikTok, and YouTube Short with gripping visual hooks, dynamic kinetic captions, sound design accents, and micro-zooms that keep eyes locked on screen.',
    deliverables: [
      'Instant hook optimization & visual disruptions',
      'Synchronized kinetic subtitles with brand styling',
      'Micro-animations, zooms & sound effect cues',
      'Platform-safe 9:16 framing & UI overlay avoidance',
      'Hook testing variants (A/B testing cuts)',
      'Batch delivery schedules for consistent posting'
    ],
    intendedPlatforms: ['Instagram Reels', 'TikTok', 'YouTube Shorts', 'LinkedIn Video'],
    turnaroundTime: '24 - 48 hours for batch packages',
    idealFor: 'Personal brands, founders, e-commerce stores, and high-frequency content creators.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1616469829941-c7200edec809?auto=format&fit=crop&w=1200&q=80',
    sampleVideoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    features: [
      'High-velocity pacing & zero dead space',
      'Custom stylized kinetic caption design',
      'Custom sound effects & whooshes on key points',
      'Bespoke visual metaphors and pop-ups'
    ]
  },
  {
    id: 'service-motion-graphics',
    slug: 'motion-graphics',
    title: 'Motion Graphics & Animation',
    badge: 'Visual Sophistication',
    shortDescription: 'High-end After Effects animations, kinetic typography, 3D product displays, and bespoke logo reveals.',
    fullDescription: 'Elevate your visual identity with custom vector and 3D motion graphics. We create branded lower thirds, UI software mockups, explanatory isometric animations, and sleek title systems that make your videos look like high-budget network broadcasts.',
    deliverables: [
      'Custom kinetic typography systems',
      'Software UI/UX feature walkthrough animations',
      'Logo animations & channel intro/outro bumpers',
      'Infographics, charts & animated data cards',
      'Alpha-channel transparent overlays & lottie/MOV files',
      'Reusable MOGRT templates for your in-house team'
    ],
    intendedPlatforms: ['Product Launches', 'Websites & Landing Pages', 'Digital Ads', 'Broadcast & Streaming'],
    turnaroundTime: '4 - 7 business days depending on complexity',
    idealFor: 'SaaS companies, tech startups, fintech apps, and agencies seeking high-end motion branding.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1200&q=80',
    sampleVideoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4',
    features: [
      'Sleek 60FPS vector and 3D keyframe precision',
      'Bespoke easing curves & organic physics',
      'Seamless brand guideline integration',
      'Modular editable project files upon request'
    ]
  },
  {
    id: 'service-brand-videos',
    slug: 'brand-videos',
    title: 'Brand Storytelling Videos',
    badge: 'Conversion & Emotion',
    shortDescription: 'Compelling brand identity films, founder stories, manifesto videos, and launch anthems that build deep trust.',
    fullDescription: 'A great brand film creates an emotional resonance that converts cold audiences into lifelong advocates. We combine documentary interview footage, cinematic visual metaphors, original pacing, and evocative score selection to communicate your mission with undeniable gravity.',
    deliverables: [
      'Story arc curation & script editorial consultation',
      'Cinematic color grading with filmic grain emulation',
      'Orchestral / cinematic soundtrack licensing & mix',
      'Full-length anthem video (90-180 seconds)',
      'Multiple cutdowns for paid social ads (15s, 30s, 60s)',
      'High-resolution thumbnail package and poster stills'
    ],
    intendedPlatforms: ['Homepage Hero', 'Funding Pitch Decks', 'Paid Social Campaigns', 'Keynote Events'],
    turnaroundTime: '7 - 10 business days',
    idealFor: 'Venture-backed startups, lifestyle brands, agencies, and visionary founders.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&w=1200&q=80',
    sampleVideoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
    features: [
      'Emotional narrative framing',
      'Hollywood-grade color grading and aspect ratios',
      'Multi-tier licensing for commercial sound tracks',
      'Full campaign multi-format asset package'
    ]
  },
  {
    id: 'service-social-media',
    slug: 'social-media-content',
    title: 'Social Media Content Creation',
    badge: 'Scalable Engine',
    shortDescription: 'An end-to-end video pipeline delivering monthly batches of platform-native video assets for brands.',
    fullDescription: 'Stop worrying about what to post next week. We take your long-form webinars, podcasts, founder interviews, or raw b-roll and continuously produce a steady stream of high-performing social clips, carousels, and teaser videos optimized for each platform algorithm.',
    deliverables: [
      'Long-form footage ingestion and highlight extraction',
      'Multi-platform reformatting (16:9, 9:16, 1:1, 4:5)',
      'Platform-native thumbnails and engaging cover images',
      'Monthly content calendar batch deliveries',
      'Consistent subtitle styles, fonts, and color accents',
      'Organized cloud delivery folder structured by week'
    ],
    intendedPlatforms: ['Instagram', 'LinkedIn', 'YouTube', 'TikTok', 'X / Twitter'],
    turnaroundTime: 'Weekly or bi-weekly scheduled drops',
    idealFor: 'Busy executives, marketing directors, and media creators who need hands-off consistency.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1516251193007-45ef944ab0c6?auto=format&fit=crop&w=1200&q=80',
    sampleVideoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyBlazes.mp4',
    features: [
      'Guaranteed delivery deadlines and batch turnaround',
      'Continuous iterative improvement based on engagement data',
      'Full metadata, hashtag suggestions, and hook notes',
      'Dedicated Slack or Frame.io review channel'
    ]
  },
  {
    id: 'service-map-animation',
    slug: 'map-animation',
    title: 'Map Animation',
    badge: 'Signature Studio Specialty',
    shortDescription: 'Geopolitical 3D terrain animations, satellite zoom sequences, and dynamic travel route visualizations.',
    fullDescription: 'Map animations are one of the highest-retention visual tools used by modern documentary channels like Johnny Harris and Vox. We construct realistic 3D satellite landscapes, animated flight paths, battle lines, trade routes, and geographical data breakdowns using GeoLayers 3 and custom 3D cartography.',
    deliverables: [
      'High-resolution satellite & topographical 3D terrain rendering',
      'Dynamic camera sweep & elevation flyovers',
      'Custom animated pins, borders, highlights & labels',
      'Custom stylistic palettes (dark mode, retro topographic, neon vector)',
      'Subtle atmospheric clouds, depth of field & lens effects',
      'Synchronized documentary sound design and ambient foley'
    ],
    intendedPlatforms: ['Documentaries', 'YouTube Video Essays', 'History & Geopolitics Series', 'Travel & Expedition Shows'],
    turnaroundTime: '3 - 5 business days per sequence',
    idealFor: 'Documentary filmmakers, analytical video essayists, travel brands, and real estate developers.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=1200&q=80',
    sampleVideoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
    features: [
      'True-to-scale geographical data & satellite imagery',
      'Smooth camera physics with cinematic focal length shifts',
      'Custom historical territory lines and dynamic borders',
      'Immersive atmospheric sound design included'
    ]
  }
];

export function getServiceBySlug(slug: string): Service | undefined {
  return agencyServices.find((service) => service.slug === slug);
}
