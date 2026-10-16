import { createClient } from '@/lib/supabase/server';
import { isSupabaseConfigured } from '@/lib/supabase/config';
import type { ContactInquiryRow } from '@/types/database.types';

export interface InquiryInput {
  name: string;
  email: string;
  company?: string;
  service: string;
  budget?: string;
  timeline?: string;
  founderPreference?: string;
  message: string;
  honeypot?: string; // Bot trap
}

// In-memory rate limiting map: identifier -> timestamp[]
const rateLimitMap = new Map<string, number[]>();

function checkRateLimit(ipOrId: string, limit = 5, windowMs = 10 * 60 * 1000): boolean {
  const now = Date.now();
  const timestamps = (rateLimitMap.get(ipOrId) || []).filter((ts) => now - ts < windowMs);

  if (timestamps.length >= limit) {
    return false; // Rate limit exceeded
  }

  timestamps.push(now);
  rateLimitMap.set(ipOrId, timestamps);
  return true;
}

function sanitizeText(input: string, maxLength: number): string {
  if (!input) return '';
  return input
    .replace(/<[^>]*>?/gm, '') // Strip HTML tags
    .trim()
    .slice(0, maxLength);
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Validates, sanitizes, and submits a client inquiry to Supabase
 */
export async function submitContactInquiry(
  input: InquiryInput,
  clientIp = 'unknown'
): Promise<{ success: boolean; error?: string }> {
  // 1. Anti-spam Honeypot Check: If honeypot is populated, bot detected!
  if (input.honeypot && input.honeypot.trim().length > 0) {
    // Pretend success so bots do not retry with different algorithms
    return { success: true };
  }

  // 2. Rate limiting check
  if (!checkRateLimit(clientIp)) {
    return {
      success: false,
      error: 'Too many inquiries submitted in a short time. Please wait a few minutes before trying again.',
    };
  }

  // 3. Validation & Sanitization
  const name = sanitizeText(input.name, 100);
  const email = sanitizeText(input.email, 150).toLowerCase();
  const company = sanitizeText(input.company || '', 120);
  const service = sanitizeText(input.service, 100);
  const budget = sanitizeText(input.budget || '', 100);
  const timeline = sanitizeText(input.timeline || '', 100);
  const founderPreference = sanitizeText(input.founderPreference || '', 100);
  const message = sanitizeText(input.message, 3000);

  if (!name || name.length < 2) {
    return { success: false, error: 'Please enter a valid name (at least 2 characters).' };
  }

  if (!email || !EMAIL_REGEX.test(email)) {
    return { success: false, error: 'Please enter a valid email address.' };
  }

  if (!service) {
    return { success: false, error: 'Please select a service of interest.' };
  }

  if (!message || message.length < 5) {
    return { success: false, error: 'Please provide a project description (at least 5 characters).' };
  }

  // 4. If Supabase is not configured yet, log gracefully
  if (!isSupabaseConfigured()) {
    console.info('[Vixel Inquiry Simulation]', {
      name,
      email,
      service,
      budget,
      timeline,
      timestamp: new Date().toISOString(),
      note: 'Supabase unconfigured; simulated clean submission',
    });
    return { success: true };
  }

  // 5. Insert into Supabase
  try {
    const supabase = await createClient();
    if (!supabase) {
      return { success: true };
    }

    const { error } = await supabase.from('contact_inquiries').insert({
      name,
      email,
      company,
      service,
      budget,
      timeline,
      founder_preference: founderPreference,
      message,
      status: 'new',
    });

    if (error) {
      console.error('Supabase error inserting contact inquiry:', error);
      return { success: false, error: 'Database error saving inquiry. Please try direct email.' };
    }

    return { success: true };
  } catch (err) {
    console.error('Unexpected error inserting inquiry:', err);
    return { success: false, error: 'An unexpected error occurred. Please try direct email.' };
  }
}

/**
 * Fetch inquiries for authenticated co-founders
 */
export async function getInquiries(): Promise<ContactInquiryRow[]> {
  const supabase = await createClient();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from('contact_inquiries')
    .select('*')
    .order('created_at', { ascending: false });

  if (error || !data) return [];
  return data as ContactInquiryRow[];
}
