'use server';

import { createClient } from '@/lib/supabase/server';
import { isSupabaseConfigured } from '@/lib/supabase/config';

export interface StorageUploadResponse {
  success: boolean;
  publicUrl?: string;
  error?: string;
}

const ALLOWED_MIME_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
  'image/svg+xml',
];
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

/**
 * Server action to safely upload an asset to Supabase Storage
 * Enforces authentication, MIME type restrictions, and founder folder isolation.
 */
export async function uploadAssetAction(
  formData: FormData
): Promise<StorageUploadResponse> {
  if (!isSupabaseConfigured()) {
    // Graceful offline mock response
    return {
      success: true,
      publicUrl: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&w=1200&q=80',
    };
  }

  const supabase = await createClient();
  if (!supabase) {
    return { success: false, error: 'Failed to initialize database client.' };
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: 'Unauthorized: Founder login required to upload media.' };
  }

  const file = formData.get('file') as File | null;
  const bucket = (formData.get('bucket') as string) || 'portfolio';

  if (!file || !(file instanceof File) || file.size === 0) {
    return { success: false, error: 'No valid file selected for upload.' };
  }

  if (file.size > MAX_FILE_SIZE) {
    return { success: false, error: 'File size exceeds maximum 10MB limit.' };
  }

  if (!ALLOWED_MIME_TYPES.includes(file.type)) {
    return {
      success: false,
      error: `Invalid file format (${file.type}). Allowed formats: JPG, PNG, WEBP, GIF, SVG.`,
    };
  }

  // Sanitize filename and construct isolated path
  const sanitizedFileName = file.name
    .toLowerCase()
    .replace(/[^\w.-]/g, '_')
    .slice(0, 100);

  const fileExt = file.name.split('.').pop() || 'png';
  const uniqueName = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${fileExt}`;

  // For avatars and portfolio, isolate to folder = user.id
  let storagePath = uniqueName;
  if (bucket === 'avatars' || bucket === 'portfolio') {
    storagePath = `${user.id}/${uniqueName}`;
  } else {
    storagePath = `${sanitizedFileName}_${uniqueName}`;
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const { error: uploadError } = await supabase.storage
    .from(bucket)
    .upload(storagePath, buffer, {
      contentType: file.type,
      upsert: true,
    });

  if (uploadError) {
    console.error('Storage upload error:', uploadError);
    return { success: false, error: `Upload failed: ${uploadError.message}` };
  }

  const { data: urlData } = supabase.storage.from(bucket).getPublicUrl(storagePath);

  return {
    success: true,
    publicUrl: urlData.publicUrl,
  };
}
