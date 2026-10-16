-- ==============================================================================
-- Vixel Media — Supabase Seed Data
-- ==============================================================================
-- This script seeds shared agency services, testimonials, and site content.
-- Co-founder profile records require user UUIDs from auth.users (see section below).
-- ==============================================================================

-- 1. SEED SHARED SERVICES
INSERT INTO public.services (
  title, slug, badge, description, full_description, 
  deliverables, platforms, turnaround_time, ideal_for, 
  sample_video_url, image_url, features, sort_order, is_published
) VALUES
(
  'Video Editing',
  'video-editing',
  'Core Specialty',
  'Cinematic long-form, YouTube masterclasses, and corporate video editing with rhythm and retention.',
  'We transform raw A-roll and multi-camera footage into polished, rhythmic stories that maintain audience retention from the first second to the final frame. Every cut, beat drop, J-cut, and transition is meticulously tuned to eliminate dead air and maximize viewer engagement.',
  '["Multi-cam assembly & A/B narrative cut", "Pacing optimization & dead-air reduction", "DaVinci Resolve color correction & LUT grading", "Comprehensive audio enhancement, mastering & SFX", "Lower thirds, title cards & chapter markers", "Full 4K ProRes & H.264 web master deliveries"]'::jsonb,
  '["YouTube", "Vimeo", "Corporate Portals", "Investor Presentations", "Webinar Repurposing"]'::jsonb,
  '3 - 5 business days per long-form episode',
  'YouTubers, educational creators, enterprise teams, and podcast hosts looking for premium production quality.',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
  'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&w=1200&q=80',
  '["Retention-focused rhythm cuts", "Dynamic B-roll sourcing and archival montage", "Custom color grading matching your brand palette", "Stereo audio sweetening and noise cleanup"]'::jsonb,
  1,
  true
),
(
  'Reels & Shorts Editing',
  'reels-shorts-editing',
  'High Viral Impact',
  'Scroll-stopping 9:16 vertical videos engineered for algorithmic retention, watch time, and shares.',
  'In vertical video, the first 1.5 seconds decide whether a viewer swipes away or stays. We engineer every reel, TikTok, and YouTube Short with gripping visual hooks, dynamic kinetic captions, sound design accents, and micro-zooms that keep eyes locked on screen.',
  '["Instant hook optimization & visual disruptions", "Synchronized kinetic subtitles with brand styling", "Micro-animations, zooms & sound effect cues", "Platform-safe 9:16 framing & UI overlay avoidance", "Hook testing variants (A/B testing cuts)", "Batch delivery schedules for consistent posting"]'::jsonb,
  '["Instagram Reels", "TikTok", "YouTube Shorts", "LinkedIn Video"]'::jsonb,
  '24 - 48 hours for batch packages',
  'Personal brands, founders, e-commerce stores, and high-frequency content creators.',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
  'https://images.unsplash.com/photo-1616469829941-c7200edec809?auto=format&fit=crop&w=1200&q=80',
  '["High-velocity pacing & zero dead space", "Custom stylized kinetic caption design", "Custom sound effects & whooshes on key points", "Bespoke visual metaphors and pop-ups"]'::jsonb,
  2,
  true
),
(
  'Motion Graphics & Animation',
  'motion-graphics',
  'Visual Sophistication',
  'High-end After Effects animations, kinetic typography, 3D product displays, and bespoke logo reveals.',
  'Elevate your visual identity with custom vector and 3D motion graphics. We create branded lower thirds, UI software mockups, explanatory isometric animations, and sleek title systems that make your videos look like high-budget network broadcasts.',
  '["Custom kinetic typography systems", "Software UI/UX feature walkthrough animations", "Logo animations & channel intro/outro bumpers", "Infographics, charts & animated data cards", "Alpha-channel transparent overlays & lottie/MOV files"]'::jsonb,
  '["Broadcast Television", "Product Demos", "App Launch Trailers", "YouTube Intro Sequences"]'::jsonb,
  '4 - 7 business days depending on 2D/3D complexity',
  'SaaS tech startups, app developers, fintech firms, and creators seeking high-end explanatory visuals.',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
  'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1200&q=80',
  '["Cinema 4D & After Effects pipelines", "Custom sound effects mapped to every motion anchor", "Full vector asset illustration and rigging", "Brand design system integration"]'::jsonb,
  3,
  true
),
(
  'Brand Storytelling Videos',
  'brand-storytelling',
  'Cinematic Prestige',
  'Documentary-style founder profiles, customer success anthems, and vision films that build lasting trust.',
  'Nothing builds market authority like authentic cinematic storytelling. We conduct narrative shaping, emotional pacing, archival integration, and score synchronization to turn your company mission into an unforgettable visual documentary.',
  '["Story arc structuring & narrative script editing", "Documentary interviews & B-roll pacing", "Orchestral audio mixing & voice enhancement", "Bespoke film emulation & cinematic color grading", "Full marketing suite cutdowns (60s, 30s, 15s)"]'::jsonb,
  '["Company Homepages", "Venture Pitch Decks", "Sales Enablement", "Keynote Presentations"]'::jsonb,
  '1 - 2 weeks including review cycles',
  'Venture-backed startups, visionary founders, non-profits, and luxury brands commanding premium positioning.',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
  'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&w=1200&q=80',
  '["Multi-layer narrative framing", "Emotional arc engineering", "Licensed cinematic soundtrack scoring", "Multi-aspect ratio deliverables for cross-platform campaigns"]'::jsonb,
  4,
  true
),
(
  'Social Media Content Creation',
  'social-media-content',
  'Ecosystem Omnipresence',
  'End-to-end multi-platform content engines: podcasts repurposed into 20+ viral snippets and graphics.',
  'Stop wasting long-form content. Our studio takes 1 podcast episode or livestream and converts it into a month-long omnipresent media campaign: 8 Reels, 4 carousels, 10 audiograms, and YouTube chaptered cutdowns.',
  '["Automated content extraction & snippet timestamping", "High-conversion caption copywriting", "Platform-specific typography & thumbnail graphics", "Audio-visual waveform generators for podcasts", "Editorial scheduling and asset management"]'::jsonb,
  '["YouTube Community", "Instagram", "TikTok", "LinkedIn", "X (Twitter)"]'::jsonb,
  'Ongoing monthly delivery cadence',
  'Podcasters, agency owners, thought leaders, and venture funds publishing high-cadence content.',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackSeeTheWorld.mp4',
  'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?auto=format&fit=crop&w=1200&q=80',
  '["Continuous 30-day editorial pipeline", "Dedicated asset management repository", "Unified cross-platform visual consistency", "Rapid turnaround on breaking announcements"]'::jsonb,
  5,
  true
),
(
  'Map Animation',
  'map-animation',
  'Signature 3D Cartography',
  'Photorealistic 3D terrain animations, satellite flyovers, and route visualizers powered by GeoLayers & Cinema 4D.',
  'Our signature visual specialty: turning geographical and geopolitical stories into breathtaking 3D cartographic sequences. We utilize digital elevation models, photorealistic satellite textures, and camera choreography to visualize migrations, military maneuvers, trade corridors, and travel journeys.',
  '["DEM 3D terrain displacement & altitude rendering", "Animated flight paths, shipping lanes & travel routes", "Custom tactical labels, flags & animated battlefronts", "Cinematic camera banking, orbits & lighting passes", "Photorealistic satellite texture blending"]'::jsonb,
  '["Documentary YouTube Channels", "Geopolitical Explainer Media", "Travel Documentaries", "News Outlets"]'::jsonb,
  '3 - 5 business days per animated sequence',
  'Geopolitics channels, history creators, travel brands, investigative journalists, and documentary filmmakers.',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4',
  'https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=1200&q=80',
  '["Sub-meter high-res satellite imagery", "True-to-scale topographical elevation modeling", "Bespoke styling (tactical, antique, or modern HUD)", "Spatial 3D sound design integration"]'::jsonb,
  6,
  true
)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  badge = EXCLUDED.badge,
  description = EXCLUDED.description,
  full_description = EXCLUDED.full_description,
  deliverables = EXCLUDED.deliverables,
  platforms = EXCLUDED.platforms,
  turnaround_time = EXCLUDED.turnaround_time,
  ideal_for = EXCLUDED.ideal_for,
  sample_video_url = EXCLUDED.sample_video_url,
  image_url = EXCLUDED.image_url,
  features = EXCLUDED.features,
  sort_order = EXCLUDED.sort_order,
  is_published = EXCLUDED.is_published;

-- 2. SEED TESTIMONIALS
INSERT INTO public.testimonials (
  client_name, role, company, avatar_url, quote, rating, 
  project_title, project_category, metrics_result, is_verified, 
  has_video_review, is_published, sort_order
) VALUES
(
  'Sarah Jenkins',
  'VP of Brand Marketing',
  'Lumina Digital Labs',
  'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
  'Vixel Media took our raw interview footage and produced a brand documentary that exceeded every expectation. Their understanding of pacing and sound design transformed a standard corporate video into an emotional masterpiece.',
  5,
  'Lumina Brand Anthem',
  'Brand Storytelling',
  '420K+ Organic Views & 68% Watch Retention',
  true,
  true,
  true,
  1
),
(
  'David K. Rossi',
  'Head of Growth & Creators',
  'Echoes of Empires Studio',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
  'Marcus and Alex are relentless about quality. The 3D map animations they crafted for our geopolitics series became our channel''s signature style and directly drove a 2.4x spike in subscriber conversion.',
  5,
  'Echoes of Empires 3D Cartography',
  'Motion Graphics & Map Animation',
  '1.2M Views & +45K Subscribers',
  true,
  false,
  true,
  2
),
(
  'Elena Rostova',
  'Founder & CEO',
  'Modern Mindset Media',
  'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=400&q=80',
  'Our short-form retention was languishing at 35% before Vixel took over. Within our first batch of 15 reels, average watch time jumped past 85%, and three clips went viral on Instagram and TikTok.',
  5,
  '30-Day Viral Reel Series',
  'Reels & Shorts Editing',
  '2.8M Total Impressions',
  true,
  true,
  true,
  3
),
(
  'Michael Thorn',
  'Creative Director',
  'Apex Athletic Gear',
  'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=400&q=80',
  'The speed ramp transitions and bass drops in our commercial were dialed down to the millisecond. Finding an editing team that respects deadlines as much as artistic integrity is rare.',
  5,
  'The Frictionless Run Campaign',
  'Commercial Ads',
  '5.2x Verified Ad ROAS',
  true,
  false,
  true,
  4
);

-- 3. SEED SHARED SITE_CONTENT SECTIONS
INSERT INTO public.site_content (section_key, content, status)
VALUES
(
  'home_hero',
  '{
    "badge": "High-Impact Video Post-Production & Motion Studio",
    "headline": "Transforming Raw Footage into High-Retention Cinematic Video.",
    "subheadline": "We help elite digital creators, venture-backed tech brands, and commercial filmmakers dominate attention with cinematic video editing, custom 3D map animations, and scroll-stopping motion graphics.",
    "cta_primary_text": "Explore Agency Work",
    "cta_primary_link": "/work",
    "cta_secondary_text": "Book Project Inquiry",
    "cta_secondary_link": "/contact",
    "metrics": [
      { "label": "Combined Views Generated", "value": "250M+" },
      { "label": "Average Watch Retention", "value": "78%" },
      { "label": "Completed Productions", "value": "450+" },
      { "label": "Client ROAS Boost", "value": "3.8x" }
    ]
  }'::jsonb,
  'published'
),
(
  'about_story',
  '{
    "tagline": "Two Co-Founders. One Relentless Standard.",
    "story_title": "Built on Pacing, Precision, and Visual Engineering",
    "paragraphs": [
      "Vixel Media was born out of frustration with mediocre post-production. Too many video agencies deliver cookie-cutter templates, sluggish pacing, and flat colors that cause viewers to click away in seconds.",
      "Founded by lead editor Alex Vance and motion director Marcus Chen, Vixel brings together deep narrative storytelling and cutting-edge 3D cartography. Every cut, transition, sound bite, and camera bank is engineered to capture psychological retention.",
      "We operate as an agile, founder-led boutique. When you partner with Vixel Media, you work directly with the co-founders directing your project from concept to final export."
    ],
    "values": [
      { "title": "Zero Dead Air", "description": "Every millisecond must earn the viewer''s continued attention." },
      { "title": "Bespoke Sound Design", "description": "Audio carries 70% of perceived cinematic quality." },
      { "title": "Direct Founder Access", "description": "No junior project manager intermediaries. You talk directly with the creators." }
    ]
  }'::jsonb,
  'published'
),
(
  'agency_settings',
  '{
    "brand_name": "VIXEL MEDIA",
    "tagline": "High-Impact Video Editing & Motion Graphics Studio",
    "contact_email": "hello@vixelmedia.demo",
    "studio_location": "Los Angeles • San Francisco • Remote Worldwide",
    "turnaround_sla": "24-48 business hours response on new inquiries",
    "social_links": {
      "youtube": "https://youtube.com",
      "instagram": "https://instagram.com",
      "x": "https://x.com",
      "linkedin": "https://linkedin.com"
    }
  }'::jsonb,
  'published'
),
(
  'pricing_tiers',
  '{
    "guarantee": "100% Satisfaction SLA — 2 Free Revision Cycles Per Production",
    "tiers": [
      {
        "name": "Single Sprint",
        "price": "$2,850",
        "description": "Ideal for a single high-impact YouTube video, product launch clip, or commercial anthem.",
        "turnaround": "3-5 Business Days",
        "features": ["1 Hero 4K Video Edit", "DaVinci Resolve Color Grade", "Foley Sound Design & Mix", "3 Vertical Cutdowns (Reels/Shorts)", "2 Revision Rounds"]
      },
      {
        "name": "Creator Retainer",
        "price": "$5,500/mo",
        "is_popular": true,
        "description": "Our most popular package for active YouTube creators and corporate brand channels.",
        "turnaround": "Continuous 48-Hour Cadence",
        "features": ["4 Long-form YouTube Videos/mo", "16 Optimized Shorts/Reels/mo", "Full 3D Map Animations & AE VFX", "Dedicated Private Slack Channel", "Real-Time Retention Analytics Review"]
      },
      {
        "name": "Full Studio Production",
        "price": "Custom Quote",
        "description": "End-to-end campaign post-production, commercial ads, and bespoke 3D cartography sequences.",
        "turnaround": "Dedicated Project Timeline",
        "features": ["Multi-cam Cinema Camera Ingestion", "3D Photorealistic Map Visuals", "Custom Sound Design & Original Scoring", "All Aspect Ratio Exports", "Commercial Broadcast Licensing"]
      }
    ]
  }'::jsonb,
  'published'
),
(
  'footer_info',
  '{
    "statement": "Vixel Media is an independent video post-production studio crafting high-retention stories, motion graphics, and 3D map animations for digital innovators.",
    "copyright": "© 2026 Vixel Media Studio LLC. All rights reserved."
  }'::jsonb,
  'published'
)
ON CONFLICT (section_key) DO UPDATE SET
  content = EXCLUDED.content,
  status = EXCLUDED.status;

-- ==============================================================================
-- 4. FOUNDER PROFILE LINKING TEMPLATE
-- When creating the 2 founder accounts in Supabase Auth (via Dashboard or CLI):
-- Run the snippet below replacing 'PASTE_FOUNDER_1_USER_ID_HERE' and 'PASTE_FOUNDER_2_USER_ID_HERE'
-- with the UUIDs generated by Supabase Auth:
-- ==============================================================================

/*
-- FOUNDER 1: Alex Vance (Lead Editor & Creative Director)
INSERT INTO public.profiles (
  id, slug, full_name, role, tagline, bio, full_bio, 
  avatar_url, cover_url, contact_email, location, years_experience, 
  socials, skills, tools, experience, clients, is_published
) VALUES (
  'PASTE_FOUNDER_1_USER_ID_HERE'::uuid,
  'alex-vance',
  'Alex Vance',
  'Co-Founder & Creative Director / Lead Editor',
  'Architect of narrative pacing, cinematic color science, and high-retention video storytelling.',
  '8+ years crafting cinematic brand documentaries, YouTube masterclasses, and high-conversion commercial films.',
  '["Alex specializes in narrative architecture, pacing psychology, and high-end DaVinci Resolve color grading.", "At Vixel Media, Alex leads video editing pipelines, editorial quality standards, and client creative direction for long-form, corporate, and narrative brand productions."]'::jsonb,
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&w=1600&q=80',
  'alex@vixelmedia.demo',
  'Los Angeles / Remote',
  8,
  '{"instagram": "https://instagram.com", "x": "https://x.com", "linkedin": "https://linkedin.com", "youtube": "https://youtube.com"}'::jsonb,
  '[{"name": "Narrative Pacing & Story Architecture", "level": 96, "category": "Editing"}, {"name": "DaVinci Resolve Color Grading & HDR", "level": 92, "category": "Color & Grading"}, {"name": "Multi-cam & Long-form Documentary", "level": 94, "category": "Editing"}, {"name": "Audio Mixing & Foley Sound Design", "level": 88, "category": "Sound Design"}, {"name": "Creative Directing & Client Onboarding", "level": 90, "category": "Directing"}]'::jsonb,
  '[{"name": "Adobe Premiere Pro", "category": "NLE", "iconName": "Film"}, {"name": "DaVinci Resolve Studio", "category": "Color & Mastering", "iconName": "Palette"}, {"name": "Apple Final Cut Pro", "category": "Editorial", "iconName": "Video"}, {"name": "Adobe Audition", "category": "Audio Engineering", "iconName": "Headphones"}, {"name": "Frame.io", "category": "Client Review & QA", "iconName": "CheckCircle2"}]'::jsonb,
  '[{"year": "2023 - Present", "role": "Co-Founder & Creative Director", "companyOrClient": "Vixel Media Studio", "description": "Directing editorial pipelines, overseeing client post-production workflows, and setting visual language."}, {"year": "2020 - 2023", "role": "Senior Commercial Video Editor", "companyOrClient": "Aura Digital Productions", "description": "Lead editor for tech brand launches and episodic YouTube series."}]'::jsonb,
  '["Tech Brand Alpha", "Creator Studio Lab", "Nordic Venture Group", "Horizon Media Collective"]'::jsonb,
  true
) ON CONFLICT (id) DO UPDATE SET
  full_name = EXCLUDED.full_name,
  role = EXCLUDED.role,
  tagline = EXCLUDED.tagline,
  bio = EXCLUDED.bio,
  skills = EXCLUDED.skills,
  tools = EXCLUDED.tools,
  is_published = EXCLUDED.is_published;

-- FOUNDER 2: Marcus Chen (Head of Motion Design / VFX)
INSERT INTO public.profiles (
  id, slug, full_name, role, tagline, bio, full_bio, 
  avatar_url, cover_url, contact_email, location, years_experience, 
  socials, skills, tools, experience, clients, is_published
) VALUES (
  'PASTE_FOUNDER_2_USER_ID_HERE'::uuid,
  'marcus-chen',
  'Marcus Chen',
  'Co-Founder & Head of Motion Design / VFX',
  'Transforming complex data and geographic journeys into dynamic 3D map animations and kinetic visuals.',
  'Master of After Effects, 3D cartography, kinetic typography, and scroll-stopping short-form hooks.',
  '["Marcus brings a technical yet intensely creative approach to motion design and visual effects. With deep expertise in After Effects, Cinema 4D, and GeoLayers 3D cartography, Marcus creates visual hooks that explain complex stories in seconds.", "At Vixel Media, Marcus spearheads motion graphics systems, map animation sequences, and high-velocity short-form vertical assets (Reels & Shorts) engineered for algorithmic retention."]'::jsonb,
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1600&q=80',
  'marcus@vixelmedia.demo',
  'San Francisco / Remote',
  7,
  '{"instagram": "https://instagram.com", "x": "https://x.com", "linkedin": "https://linkedin.com", "behance": "https://behance.net"}'::jsonb,
  '[{"name": "3D Map & Geographic Journey Animation", "level": 98, "category": "VFX & Motion"}, {"name": "Kinetic Typography & Brand Motion Systems", "level": 95, "category": "VFX & Motion"}, {"name": "Vertical Reel & Short-Form Retention Hooks", "level": 96, "category": "Editing"}, {"name": "3D Product Rendering & Compositing", "level": 86, "category": "VFX & Motion"}, {"name": "Sound FX Sync & Micro-Animations", "level": 90, "category": "Sound Design"}]'::jsonb,
  '[{"name": "Adobe After Effects", "category": "Motion & Compositing", "iconName": "Sparkles"}, {"name": "Maxon Cinema 4D", "category": "3D Modeling & Dynamics", "iconName": "Layers"}, {"name": "GeoLayers 3", "category": "Cartographic 3D Maps", "iconName": "MapPin"}, {"name": "Blender 3D", "category": "Open 3D Suite", "iconName": "Box"}, {"name": "Boris FX Sapphire", "category": "Visual Effects Suite", "iconName": "Wand2"}]'::jsonb,
  '[{"year": "2023 - Present", "role": "Co-Founder & Head of Motion Design", "companyOrClient": "Vixel Media Studio", "description": "Leading 3D cartography pipelines, short-form retention architectures, and kinetic typography systems."}, {"year": "2021 - 2023", "role": "Lead Motion Graphics Artist", "companyOrClient": "Apex Media Dynamics", "description": "Developed 3D map animation templates for geopolitics and documentary creator channels."}]'::jsonb,
  '["GeoChronicle Series", "Terra Visuals", "Hyperflow Tech", "Strata Media Group"]'::jsonb,
  true
) ON CONFLICT (id) DO UPDATE SET
  full_name = EXCLUDED.full_name,
  role = EXCLUDED.role,
  tagline = EXCLUDED.tagline,
  bio = EXCLUDED.bio,
  skills = EXCLUDED.skills,
  tools = EXCLUDED.tools,
  is_published = EXCLUDED.is_published;
*/
