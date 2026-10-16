'use server';

import { headers } from 'next/headers';
import { createClient } from '@/lib/supabase/server';
import { isSupabaseConfigured } from '@/lib/supabase/config';
import { submitContactInquiry, type InquiryInput } from '@/lib/data/inquiries';
import { revalidatePath } from 'next/cache';
import type { ActionResponse } from './profile';

export async function submitInquiryAction(
  _prevState: ActionResponse | null,
  formData: FormData
): Promise<ActionResponse> {
  const headerList = await headers();
  const forwardedFor = headerList.get('x-forwarded-for');
  const clientIp = forwardedFor ? forwardedFor.split(',')[0].trim() : 'local';

  const input: InquiryInput = {
    name: (formData.get('name') as string) || '',
    email: (formData.get('email') as string) || '',
    company: (formData.get('company') as string) || '',
    service: (formData.get('service') as string) || '',
    budget: (formData.get('budget') as string) || '',
    timeline: (formData.get('timeline') as string) || '',
    founderPreference: (formData.get('founderPreference') as string) || '',
    message: (formData.get('message') as string) || '',
    honeypot: (formData.get('website_url') as string) || '', // Honeypot field trap
  };

  const result = await submitContactInquiry(input, clientIp);

  if (!result.success) {
    return { success: false, error: result.error || 'Failed to submit inquiry.' };
  }

  return {
    success: true,
    message: 'Your inquiry has been submitted! Our editorial team will follow up within 24 hours.',
  };
}

export async function updateInquiryStatusAction(
  inquiryId: string,
  newStatus: 'new' | 'in_review' | 'contacted' | 'archived'
): Promise<ActionResponse> {
  if (!isSupabaseConfigured()) {
    return { success: false, error: 'Supabase credentials not configured.' };
  }

  const supabase = await createClient();
  if (!supabase) return { success: false, error: 'Database client not available.' };

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: 'Unauthorized: Founder login required.' };
  }

  const { error } = await supabase
    .from('contact_inquiries')
    .update({ status: newStatus })
    .eq('id', inquiryId);

  if (error) {
    console.error('Error updating inquiry status:', error);
    return { success: false, error: `Failed to update status: ${error.message}` };
  }

  revalidatePath('/dashboard');
  revalidatePath('/dashboard/inquiries');
  return { success: true, message: `Inquiry status updated to ${newStatus}.` };
}

export async function deleteInquiryAction(inquiryId: string): Promise<ActionResponse> {
  if (!isSupabaseConfigured()) {
    return { success: false, error: 'Supabase credentials not configured.' };
  }

  const supabase = await createClient();
  if (!supabase) return { success: false, error: 'Database client not available.' };

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: 'Unauthorized: Founder login required.' };
  }

  const { error } = await supabase.from('contact_inquiries').delete().eq('id', inquiryId);

  if (error) {
    console.error('Error deleting inquiry:', error);
    return { success: false, error: `Failed to delete inquiry: ${error.message}` };
  }

  revalidatePath('/dashboard');
  revalidatePath('/dashboard/inquiries');
  return { success: true, message: 'Inquiry deleted successfully.' };
}

