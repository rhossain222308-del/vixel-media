-- ==============================================================================
-- Migration: 20261016000003_storage_buckets.sql
-- Description: Supabase Storage configuration and RLS policies for Vixel Media
-- Buckets: avatars, portfolio, agency-assets, services
-- ==============================================================================

-- 1. Create Storage Buckets
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES 
  ('avatars', 'avatars', true, 10485760, ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']),
  ('portfolio', 'portfolio', true, 20971520, ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'video/mp4']),
  ('agency-assets', 'agency-assets', true, 10485760, ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml']),
  ('services', 'services', true, 10485760, ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif'])
ON CONFLICT (id) DO UPDATE SET
  public = EXCLUDED.public,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

-- ==============================================================================
-- 2. Storage Objects RLS Policies
-- ==============================================================================

-- A. PUBLIC READ ACCESS
-- Allow anyone to read/download public media assets
CREATE POLICY "Public media access for agency buckets"
  ON storage.objects
  FOR SELECT
  TO public
  USING (bucket_id IN ('avatars', 'portfolio', 'agency-assets', 'services'));

-- B. AVATARS BUCKET: Founder-specific folder isolation
-- Folder structure: avatars/<founder_auth_id>/filename.png
CREATE POLICY "Founders can upload their own avatars"
  ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'avatars' AND 
    (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "Founders can update their own avatars"
  ON storage.objects
  FOR UPDATE
  TO authenticated
  USING (
    bucket_id = 'avatars' AND 
    (storage.foldername(name))[1] = auth.uid()::text
  )
  WITH CHECK (
    bucket_id = 'avatars' AND 
    (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "Founders can delete their own avatars"
  ON storage.objects
  FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'avatars' AND 
    (storage.foldername(name))[1] = auth.uid()::text
  );

-- C. PORTFOLIO BUCKET: Founder-specific folder isolation
-- Folder structure: portfolio/<founder_auth_id>/filename.png
CREATE POLICY "Founders can upload their own portfolio media"
  ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'portfolio' AND 
    (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "Founders can update their own portfolio media"
  ON storage.objects
  FOR UPDATE
  TO authenticated
  USING (
    bucket_id = 'portfolio' AND 
    (storage.foldername(name))[1] = auth.uid()::text
  )
  WITH CHECK (
    bucket_id = 'portfolio' AND 
    (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "Founders can delete their own portfolio media"
  ON storage.objects
  FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'portfolio' AND 
    (storage.foldername(name))[1] = auth.uid()::text
  );

-- D. SHARED AGENCY ASSETS & SERVICES: Both authenticated co-founders can manage
CREATE POLICY "Founders can upload shared agency assets"
  ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id IN ('agency-assets', 'services'));

CREATE POLICY "Founders can update shared agency assets"
  ON storage.objects
  FOR UPDATE
  TO authenticated
  USING (bucket_id IN ('agency-assets', 'services'))
  WITH CHECK (bucket_id IN ('agency-assets', 'services'));

CREATE POLICY "Founders can delete shared agency assets"
  ON storage.objects
  FOR DELETE
  TO authenticated
  USING (bucket_id IN ('agency-assets', 'services'));
