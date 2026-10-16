/**
 * Supabase configuration checker
 * Detects whether real Supabase credentials have been configured in .env.local
 */

export function isSupabaseConfigured(): boolean {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    return false;
  }

  // Check for placeholder values
  if (
    url.includes('your-project-id') ||
    url.includes('example.com') ||
    anonKey.includes('your-supabase-anon-key') ||
    anonKey === ''
  ) {
    return false;
  }

  try {
    const parsed = new URL(url);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch {
    return false;
  }
}

export function isSupabaseAdminConfigured(): boolean {
  if (!isSupabaseConfigured()) return false;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!serviceKey) return false;
  if (serviceKey.includes('your-supabase-service-role') || serviceKey === '') return false;
  return true;
}

export function getSupabaseConfig() {
  return {
    url: process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
    isConfigured: isSupabaseConfigured(),
    isAdminConfigured: isSupabaseAdminConfigured(),
  };
}
