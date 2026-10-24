/**
 * Vixel Media Security Utilities
 * Input sanitization, redirect protection, and boundary validation
 */

/**
 * Sanitizes a redirect URL to prevent open-redirect vulnerabilities.
 * Ensures the target is strictly an internal path starting with a single '/'
 * and prevents protocol-relative ('//') or backslash ('\') evasion attempts.
 */
export function sanitizeRedirectUrl(url: string | null | undefined): string {
  if (!url || typeof url !== 'string') return '/dashboard';
  const trimmed = url.trim();
  // Must start with '/' and not '//' to prevent protocol-relative redirects, no backslashes
  if (trimmed.startsWith('/') && !trimmed.startsWith('//') && !trimmed.includes('\\')) {
    return trimmed;
  }
  return '/dashboard';
}
