import { createBrowserClient } from '@supabase/ssr';
import type { Database } from '@/types/database.types';
import { isSupabaseConfigured } from './config';

let client: ReturnType<typeof createBrowserClient<Database>> | null = null;

/**
 * Returns a Supabase client for client-side components.
 * Returns null if Supabase credentials are not configured.
 */
export function createClient() {
  if (!isSupabaseConfigured()) {
    return null;
  }

  if (client) return client;

  client = createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  return client;
}
