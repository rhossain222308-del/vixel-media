-- ==============================================================================
-- Migration: 20261016000004_draft_publish_revisions.sql
-- Description: Adds draft/publish separation, published timestamps, and revision history
-- ==============================================================================

-- 1. Enhance site_content with separate draft_content and published_at
ALTER TABLE public.site_content 
  ADD COLUMN IF NOT EXISTS draft_content JSONB,
  ADD COLUMN IF NOT EXISTS published_at TIMESTAMPTZ;

-- Backfill draft_content with content for existing rows
UPDATE public.site_content 
SET draft_content = content 
WHERE draft_content IS NULL;

-- 2. Create site_content_revisions table for audit log and rollback history
CREATE TABLE IF NOT EXISTS public.site_content_revisions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  section_key TEXT NOT NULL,
  content JSONB NOT NULL,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  version_number INTEGER NOT NULL DEFAULT 1,
  change_summary TEXT DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Index for fast lookup by section and time
CREATE INDEX IF NOT EXISTS idx_revisions_section ON public.site_content_revisions(section_key, created_at DESC);

-- 3. Enable RLS on revisions
ALTER TABLE public.site_content_revisions ENABLE ROW LEVEL SECURITY;

-- Founders can view all revisions
CREATE POLICY "Founders can view site content revisions"
  ON public.site_content_revisions
  FOR SELECT
  TO authenticated
  USING (true);

-- Founders can create revision snapshots
CREATE POLICY "Founders can insert site content revisions"
  ON public.site_content_revisions
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- 4. Enhance portfolio_projects with published_at timestamp
ALTER TABLE public.portfolio_projects
  ADD COLUMN IF NOT EXISTS published_at TIMESTAMPTZ;

-- 5. Enhance services and testimonials with published_at timestamp
ALTER TABLE public.services
  ADD COLUMN IF NOT EXISTS published_at TIMESTAMPTZ;

ALTER TABLE public.testimonials
  ADD COLUMN IF NOT EXISTS published_at TIMESTAMPTZ;
