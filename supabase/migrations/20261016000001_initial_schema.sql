-- ==============================================================================
-- Migration: 20261016000001_initial_schema.sql
-- Description: Core schema for Vixel Media co-founders, portfolios, and shared CMS
-- ==============================================================================

-- 1. Setup Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. Timestamp update trigger function
CREATE OR REPLACE FUNCTION set_updated_at_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = timezone('utc'::text, now());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 3. PROFILES TABLE (One record per co-founder)
-- References auth.users(id) - created when founder account is provisioned
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  slug TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'Co-Founder',
  tagline TEXT DEFAULT '',
  bio TEXT DEFAULT '',
  full_bio JSONB NOT NULL DEFAULT '[]'::jsonb,
  avatar_url TEXT DEFAULT '',
  cover_url TEXT DEFAULT '',
  contact_email TEXT DEFAULT '',
  location TEXT DEFAULT '',
  years_experience INTEGER DEFAULT 0,
  socials JSONB NOT NULL DEFAULT '{}'::jsonb,
  skills JSONB NOT NULL DEFAULT '[]'::jsonb,
  tools JSONB NOT NULL DEFAULT '[]'::jsonb,
  experience JSONB NOT NULL DEFAULT '[]'::jsonb,
  clients JSONB NOT NULL DEFAULT '[]'::jsonb,
  featured_project_ids JSONB NOT NULL DEFAULT '[]'::jsonb,
  is_published BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Profiles indexes
CREATE INDEX IF NOT EXISTS idx_profiles_slug ON public.profiles(slug);
CREATE INDEX IF NOT EXISTS idx_profiles_published ON public.profiles(is_published);

-- Trigger for profiles
DROP TRIGGER IF EXISTS trigger_profiles_updated_at ON public.profiles;
CREATE TRIGGER trigger_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION set_updated_at_timestamp();

-- 4. PORTFOLIO_PROJECTS TABLE
-- Owned strictly by one of the co-founders (owner_id references profiles.id)
CREATE TABLE IF NOT EXISTS public.portfolio_projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  client TEXT DEFAULT '',
  description TEXT DEFAULT '',
  long_description TEXT DEFAULT '',
  category TEXT NOT NULL CHECK (category IN ('reels', 'long-form', 'ads', 'motion-graphics')),
  category_label TEXT DEFAULT '',
  deliverables JSONB NOT NULL DEFAULT '[]'::jsonb,
  duration TEXT DEFAULT '',
  aspect_ratio TEXT NOT NULL DEFAULT '16:9' CHECK (aspect_ratio IN ('16:9', '9:16', '1:1', '4:5')),
  thumbnail_url TEXT NOT NULL DEFAULT '',
  video_url TEXT DEFAULT '',
  platform TEXT DEFAULT 'Vimeo',
  has_playable_media BOOLEAN NOT NULL DEFAULT false,
  featured BOOLEAN NOT NULL DEFAULT false,
  sort_order INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
  metrics JSONB NOT NULL DEFAULT '{}'::jsonb,
  tools_used JSONB NOT NULL DEFAULT '[]'::jsonb,
  year INTEGER NOT NULL DEFAULT EXTRACT(year FROM now())::int,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Portfolio projects indexes
CREATE INDEX IF NOT EXISTS idx_projects_owner_id ON public.portfolio_projects(owner_id);
CREATE INDEX IF NOT EXISTS idx_projects_slug ON public.portfolio_projects(slug);
CREATE INDEX IF NOT EXISTS idx_projects_status ON public.portfolio_projects(status);
CREATE INDEX IF NOT EXISTS idx_projects_category ON public.portfolio_projects(category);
CREATE INDEX IF NOT EXISTS idx_projects_featured ON public.portfolio_projects(featured);
CREATE INDEX IF NOT EXISTS idx_projects_sort_order ON public.portfolio_projects(sort_order);

-- Trigger for portfolio_projects
DROP TRIGGER IF EXISTS trigger_portfolio_projects_updated_at ON public.portfolio_projects;
CREATE TRIGGER trigger_portfolio_projects_updated_at
  BEFORE UPDATE ON public.portfolio_projects
  FOR EACH ROW
  EXECUTE FUNCTION set_updated_at_timestamp();

-- 5. SITE_CONTENT TABLE (Flexible shared agency content)
-- Section-based model supporting Home, About, Services, Agency Portfolio, Pricing, Footer, etc.
CREATE TABLE IF NOT EXISTS public.site_content (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  section_key TEXT UNIQUE NOT NULL,
  content JSONB NOT NULL DEFAULT '{}'::jsonb,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
  updated_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Site content indexes
CREATE INDEX IF NOT EXISTS idx_site_content_section ON public.site_content(section_key);
CREATE INDEX IF NOT EXISTS idx_site_content_status ON public.site_content(status);

-- Trigger for site_content
DROP TRIGGER IF EXISTS trigger_site_content_updated_at ON public.site_content;
CREATE TRIGGER trigger_site_content_updated_at
  BEFORE UPDATE ON public.site_content
  FOR EACH ROW
  EXECUTE FUNCTION set_updated_at_timestamp();

-- 6. SERVICES TABLE (Shared agency offerings)
CREATE TABLE IF NOT EXISTS public.services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  badge TEXT DEFAULT '',
  description TEXT NOT NULL,
  full_description TEXT DEFAULT '',
  deliverables JSONB NOT NULL DEFAULT '[]'::jsonb,
  platforms JSONB NOT NULL DEFAULT '[]'::jsonb,
  turnaround_time TEXT DEFAULT '',
  ideal_for TEXT DEFAULT '',
  sample_video_url TEXT DEFAULT '',
  image_url TEXT DEFAULT '',
  features JSONB NOT NULL DEFAULT '[]'::jsonb,
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_published BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Services indexes
CREATE INDEX IF NOT EXISTS idx_services_slug ON public.services(slug);
CREATE INDEX IF NOT EXISTS idx_services_published ON public.services(is_published);
CREATE INDEX IF NOT EXISTS idx_services_sort_order ON public.services(sort_order);

-- Trigger for services
DROP TRIGGER IF EXISTS trigger_services_updated_at ON public.services;
CREATE TRIGGER trigger_services_updated_at
  BEFORE UPDATE ON public.services
  FOR EACH ROW
  EXECUTE FUNCTION set_updated_at_timestamp();

-- 7. TESTIMONIALS TABLE (Client social proof)
CREATE TABLE IF NOT EXISTS public.testimonials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_name TEXT NOT NULL,
  role TEXT DEFAULT '',
  company TEXT NOT NULL,
  avatar_url TEXT DEFAULT '',
  quote TEXT NOT NULL,
  rating INTEGER CHECK (rating IS NULL OR (rating >= 1 AND rating <= 5)),
  project_title TEXT DEFAULT '',
  project_category TEXT DEFAULT '',
  metrics_result TEXT DEFAULT '',
  is_verified BOOLEAN NOT NULL DEFAULT true,
  has_video_review BOOLEAN NOT NULL DEFAULT false,
  project_image_url TEXT DEFAULT '',
  is_published BOOLEAN NOT NULL DEFAULT false,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Testimonials indexes
CREATE INDEX IF NOT EXISTS idx_testimonials_published ON public.testimonials(is_published);
CREATE INDEX IF NOT EXISTS idx_testimonials_sort_order ON public.testimonials(sort_order);

-- Trigger for testimonials
DROP TRIGGER IF EXISTS trigger_testimonials_updated_at ON public.testimonials;
CREATE TRIGGER trigger_testimonials_updated_at
  BEFORE UPDATE ON public.testimonials
  FOR EACH ROW
  EXECUTE FUNCTION set_updated_at_timestamp();

-- 8. CONTACT_INQUIRIES TABLE (Client inbound requests)
CREATE TABLE IF NOT EXISTS public.contact_inquiries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  company TEXT DEFAULT '',
  service TEXT NOT NULL,
  budget TEXT DEFAULT '',
  timeline TEXT DEFAULT '',
  founder_preference TEXT DEFAULT '',
  message TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'in_review', 'contacted', 'archived')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Inquiries indexes
CREATE INDEX IF NOT EXISTS idx_inquiries_status ON public.contact_inquiries(status);
CREATE INDEX IF NOT EXISTS idx_inquiries_created_at ON public.contact_inquiries(created_at DESC);
