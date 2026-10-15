export type ProjectCategory = 'all' | 'reels' | 'long-form' | 'ads' | 'motion-graphics';

export interface Project {
  id: string;
  slug: string;
  title: string;
  client: string;
  category: 'reels' | 'long-form' | 'ads' | 'motion-graphics';
  categoryLabel: string;
  description: string;
  longDescription?: string;
  deliverables: string[];
  duration: string;
  aspectRatio: '16:9' | '9:16' | '1:1' | '4:5';
  thumbnailUrl: string;
  videoUrl?: string; // MP4 or streaming link; if empty or placeholder, player shows dedicated empty state
  hasPlayableMedia: boolean;
  featured: boolean;
  metrics?: {
    views?: string;
    retentionRate?: string;
    roas?: string;
    engagement?: string;
  };
  founderId?: string; // Links to personal portfolio e.g. 'alex-vance' or 'marcus-chen'
  toolsUsed: string[];
  year: number;
}

export interface FounderSkill {
  name: string;
  level: number; // 0 - 100 percentage
  category: 'Editing' | 'Color & Grading' | 'VFX & Motion' | 'Sound Design' | 'Directing';
}

export interface FounderTool {
  name: string;
  category: string;
  iconName: string;
}

export interface FounderExperience {
  year: string;
  role: string;
  companyOrClient: string;
  description: string;
}

export interface Founder {
  id: string;
  slug: string;
  name: string;
  role: string;
  tagline: string;
  shortBio: string;
  fullBio: string[];
  avatarUrl: string;
  coverUrl?: string;
  email: string;
  location: string;
  yearsExperience: number;
  socials: {
    instagram?: string;
    x?: string;
    linkedin?: string;
    youtube?: string;
    behance?: string;
  };
  skills: FounderSkill[];
  tools: FounderTool[];
  experience: FounderExperience[];
  sampleClients: string[];
  featuredProjectIds: string[];
}

export interface Service {
  id: string;
  slug: string;
  title: string;
  badge: string;
  shortDescription: string;
  fullDescription: string;
  deliverables: string[];
  intendedPlatforms: string[];
  turnaroundTime: string;
  idealFor: string;
  sampleVideoUrl?: string;
  thumbnailUrl: string;
  features: string[];
}

export interface Testimonial {
  id: string;
  clientName: string;
  role: string;
  company: string;
  avatarUrl: string;
  quote: string;
  rating: number;
  projectTitle: string;
  projectCategory: string;
  metricsResult?: string;
  isVerified: boolean;
  hasVideoReview?: boolean;
}

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string[];
  category: string;
  readTime: string;
  publishedAt: string;
  author: {
    name: string;
    role: string;
    avatarUrl: string;
  };
  coverImage: string;
  tags: string[];
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: 'general' | 'production' | 'pricing' | 'delivery';
}

export interface ContactInquiry {
  id?: string;
  name: string;
  email: string;
  company?: string;
  service: string;
  projectDescription: string;
  budgetRange?: string;
  timeline?: string;
  founderPreference?: string;
  createdAt?: string;
}
