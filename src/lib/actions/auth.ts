'use server';

import { createClient } from '@/lib/supabase/server';
import { isSupabaseConfigured } from '@/lib/supabase/config';
import { redirect } from 'next/navigation';

export interface AuthState {
  error?: string;
  success?: boolean;
}

/**
 * Server Action for Founder Login
 * Strictly checks credentials against Supabase Auth.
 * Self-registration is intentionally disabled.
 */
export async function loginAction(
  _prevState: AuthState | null,
  formData: FormData
): Promise<AuthState> {
  const email = (formData.get('email') as string)?.trim();
  const password = formData.get('password') as string;
  const returnTo = (formData.get('returnTo') as string) || '/dashboard';

  if (!email || !password) {
    return { error: 'Please enter both your founder email and password.' };
  }

  if (!isSupabaseConfigured()) {
    return {
      error:
        'Supabase is not configured yet. Please configure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local to authenticate with live founder accounts.',
    };
  }

  const supabase = await createClient();
  if (!supabase) {
    return { error: 'Failed to initialize Supabase server client.' };
  }

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    console.warn(`Failed founder login attempt for ${email}:`, error.message);
    return { error: 'Invalid founder email or password. Access is restricted to authorized founders.' };
  }

  redirect(returnTo);
}

/**
 * Server Action for Founder Logout
 */
export async function logoutAction(): Promise<void> {
  if (isSupabaseConfigured()) {
    const supabase = await createClient();
    if (supabase) {
      await supabase.auth.signOut();
    }
  }

  redirect('/login');
}
