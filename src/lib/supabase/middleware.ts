import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';
import type { Database } from '@/types/database.types';
import { isSupabaseConfigured } from './config';
import { sanitizeRedirectUrl } from '@/lib/security';

export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const pathname = request.nextUrl.pathname;

  // If Supabase credentials are not configured, handle dashboard access gracefully
  if (!isSupabaseConfigured()) {
    // If user tries to access /login, allow them to view the setup guide and offline portal
    return response;
  }

  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          response = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // Refresh auth session
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Protected route check for /dashboard
  const isDashboardRoute = pathname.startsWith('/dashboard') || pathname.startsWith('/admin');
  const isAuthRoute = pathname === '/login';

  if (isDashboardRoute && !user) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('returnTo', pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (isAuthRoute && user) {
    const rawReturnTo = request.nextUrl.searchParams.get('returnTo');
    const safeReturnTo = sanitizeRedirectUrl(rawReturnTo);
    return NextResponse.redirect(new URL(safeReturnTo, request.url));
  }

  return response;
}
