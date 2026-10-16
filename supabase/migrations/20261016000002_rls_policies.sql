-- ==============================================================================
-- Migration: 20261016000002_rls_policies.sql
-- Description: Strict Row Level Security (RLS) policies for Vixel Media
-- Enforces co-founder ownership isolation and public draft protection
-- ==============================================================================

-- 1. Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.portfolio_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_inquiries ENABLE ROW LEVEL SECURITY;

-- ==============================================================================
-- 2. PROFILES POLICIES
-- Rule A: Co-founders can only view/edit/delete their own profile.
-- Public visitors can only view published profiles.
-- ==============================================================================

-- Public can view published profiles
CREATE POLICY "Public can view published profiles"
  ON public.profiles
  FOR SELECT
  TO public
  USING (is_published = true);

-- Founder can view their own profile even if unpublished (draft mode)
CREATE POLICY "Founders can view their own profile"
  ON public.profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

-- Founder can only insert their own profile
CREATE POLICY "Founders can insert their own profile"
  ON public.profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Founder can only update their own profile (cannot modify another founder's profile)
CREATE POLICY "Founders can update only their own profile"
  ON public.profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Founder can only delete their own profile
CREATE POLICY "Founders can delete only their own profile"
  ON public.profiles
  FOR DELETE
  TO authenticated
  USING (auth.uid() = id);

-- ==============================================================================
-- 3. PORTFOLIO_PROJECTS POLICIES
-- Rule B: Founders can create, edit, delete projects ONLY when owner_id matches auth.uid().
-- Cannot change another founder's projects or transfer ownership.
-- Public can only view published projects of published founders.
-- ==============================================================================

-- Public can view published projects belonging to published profiles
CREATE POLICY "Public can view published projects of published profiles"
  ON public.portfolio_projects
  FOR SELECT
  TO public
  USING (
    status = 'published' AND
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE public.profiles.id = public.portfolio_projects.owner_id
      AND public.profiles.is_published = true
    )
  );

-- Founder can view all of their own projects (both drafts and published)
CREATE POLICY "Founders can view all their own projects"
  ON public.portfolio_projects
  FOR SELECT
  TO authenticated
  USING (auth.uid() = owner_id);

-- Founder can insert projects only with their own owner_id
CREATE POLICY "Founders can insert projects with their own owner_id"
  ON public.portfolio_projects
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = owner_id);

-- Founder can update only their own projects (and cannot reassign owner_id)
CREATE POLICY "Founders can update only their own projects"
  ON public.portfolio_projects
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = owner_id)
  WITH CHECK (auth.uid() = owner_id);

-- Founder can delete only their own projects
CREATE POLICY "Founders can delete only their own projects"
  ON public.portfolio_projects
  FOR DELETE
  TO authenticated
  USING (auth.uid() = owner_id);

-- ==============================================================================
-- 4. SITE_CONTENT POLICIES (Shared Agency CMS)
-- Rule C: Both authorized founders can manage shared content.
-- Public can read only published content.
-- ==============================================================================

-- Public can read published site content
CREATE POLICY "Public can view published site content"
  ON public.site_content
  FOR SELECT
  TO public
  USING (status = 'published');

-- Authenticated founders can view all site content (drafts & published)
CREATE POLICY "Founders can view all site content"
  ON public.site_content
  FOR SELECT
  TO authenticated
  USING (true);

-- Authenticated founders can insert site content
CREATE POLICY "Founders can insert site content"
  ON public.site_content
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Authenticated founders can update site content
CREATE POLICY "Founders can update site content"
  ON public.site_content
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Authenticated founders can delete site content
CREATE POLICY "Founders can delete site content"
  ON public.site_content
  FOR DELETE
  TO authenticated
  USING (true);

-- ==============================================================================
-- 5. SERVICES POLICIES (Shared Agency Offerings)
-- Rule C: Both authorized founders can manage services.
-- Public can read only published services.
-- ==============================================================================

-- Public can read published services
CREATE POLICY "Public can view published services"
  ON public.services
  FOR SELECT
  TO public
  USING (is_published = true);

-- Authenticated founders can view all services
CREATE POLICY "Founders can view all services"
  ON public.services
  FOR SELECT
  TO authenticated
  USING (true);

-- Authenticated founders can insert services
CREATE POLICY "Founders can insert services"
  ON public.services
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Authenticated founders can update services
CREATE POLICY "Founders can update services"
  ON public.services
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Authenticated founders can delete services
CREATE POLICY "Founders can delete services"
  ON public.services
  FOR DELETE
  TO authenticated
  USING (true);

-- ==============================================================================
-- 6. TESTIMONIALS POLICIES (Shared Social Proof)
-- Rule C: Both authorized founders can manage testimonials.
-- Public can read only published testimonials.
-- ==============================================================================

-- Public can read published testimonials
CREATE POLICY "Public can view published testimonials"
  ON public.testimonials
  FOR SELECT
  TO public
  USING (is_published = true);

-- Authenticated founders can view all testimonials
CREATE POLICY "Founders can view all testimonials"
  ON public.testimonials
  FOR SELECT
  TO authenticated
  USING (true);

-- Authenticated founders can insert testimonials
CREATE POLICY "Founders can insert testimonials"
  ON public.testimonials
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Authenticated founders can update testimonials
CREATE POLICY "Founders can update testimonials"
  ON public.testimonials
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Authenticated founders can delete testimonials
CREATE POLICY "Founders can delete testimonials"
  ON public.testimonials
  FOR DELETE
  TO authenticated
  USING (true);

-- ==============================================================================
-- 7. CONTACT_INQUIRIES POLICIES
-- Rule D: Visitors can submit an inquiry.
-- Visitors CANNOT read, update, or delete submitted inquiries.
-- Authenticated founders have full access to read and update inquiries.
-- ==============================================================================

-- Visitors can insert inquiries
CREATE POLICY "Visitors can submit contact inquiries"
  ON public.contact_inquiries
  FOR INSERT
  TO public
  WITH CHECK (true);

-- Authenticated founders can view all contact inquiries
CREATE POLICY "Founders can view contact inquiries"
  ON public.contact_inquiries
  FOR SELECT
  TO authenticated
  USING (true);

-- Authenticated founders can update inquiries (e.g., mark contacted/in_review)
CREATE POLICY "Founders can update contact inquiries"
  ON public.contact_inquiries
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Authenticated founders can delete inquiries
CREATE POLICY "Founders can delete contact inquiries"
  ON public.contact_inquiries
  FOR DELETE
  TO authenticated
  USING (true);
