import { createClient as createSupabaseClient } from '@supabase/supabase-js';
import type { Database } from '@/types/database.types';
import { isSupabaseAdminConfigured } from './config';

/**
 * Creates an administrative Supabase client using the service-role key.
 *
 * CRITICAL SECURITY RULES:
 * 1. This client bypasses Row Level Security (RLS).
 * 2. It must NEVER be used in client components or sent to the browser.
 * 3. Use solely for administrative setup, user provisioning, or background scripts.
 */
export function createAdminClient() {
  if (typeof window !== 'undefined') {
    throw new Error('FATAL: createAdminClient cannot be executed in the browser context.');
  }

  if (!isSupabaseAdminConfigured()) {
    return null;
  }

  return createSupabaseClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  );
}
