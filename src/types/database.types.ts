export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string; // references auth.users(id)
          slug: string;
          full_name: string;
          role: string;
          tagline: string;
          bio: string;
          full_bio: string;
          avatar_url: string;
          cover_url: string;
          contact_email: string;
          location: string;
          years_experience: number;
          socials: Json;
          skills: Json;
          tools: Json;
          experience: Json;
          clients: Json;
          featured_project_ids: Json;
          is_published: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          slug: string;
          full_name: string;
          role?: string;
          tagline?: string;
          bio?: string;
          full_bio?: string;
          avatar_url?: string;
          cover_url?: string;
          contact_email?: string;
          location?: string;
          years_experience?: number;
          socials?: Json;
          skills?: Json;
          tools?: Json;
          experience?: Json;
          clients?: Json;
          featured_project_ids?: Json;
          is_published?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          slug?: string;
          full_name?: string;
          role?: string;
          tagline?: string;
          bio?: string;
          full_bio?: string;
          avatar_url?: string;
          cover_url?: string;
          contact_email?: string;
          location?: string;
          years_experience?: number;
          socials?: Json;
          skills?: Json;
          tools?: Json;
          experience?: Json;
          clients?: Json;
          featured_project_ids?: Json;
          is_published?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      portfolio_projects: {
        Row: {
          id: string;
          owner_id: string;
          title: string;
          slug: string;
          client: string;
          description: string;
          long_description: string;
          category: 'reels' | 'long-form' | 'ads' | 'motion-graphics';
          category_label: string;
          deliverables: Json;
          duration: string;
          aspect_ratio: '16:9' | '9:16' | '1:1' | '4:5';
          thumbnail_url: string;
          video_url: string;
          platform: string;
          has_playable_media: boolean;
          featured: boolean;
          sort_order: number;
          status: 'draft' | 'published';
          metrics: Json;
          tools_used: Json;
          year: number;
          published_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          owner_id: string;
          title: string;
          slug: string;
          client?: string;
          description?: string;
          long_description?: string;
          category: 'reels' | 'long-form' | 'ads' | 'motion-graphics';
          category_label?: string;
          deliverables?: Json;
          duration?: string;
          aspect_ratio?: '16:9' | '9:16' | '1:1' | '4:5';
          thumbnail_url?: string;
          video_url?: string;
          platform?: string;
          has_playable_media?: boolean;
          featured?: boolean;
          sort_order?: number;
          status?: 'draft' | 'published';
          metrics?: Json;
          tools_used?: Json;
          year?: number;
          published_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          owner_id?: string;
          title?: string;
          slug?: string;
          client?: string;
          description?: string;
          long_description?: string;
          category?: 'reels' | 'long-form' | 'ads' | 'motion-graphics';
          category_label?: string;
          deliverables?: Json;
          duration?: string;
          aspect_ratio?: '16:9' | '9:16' | '1:1' | '4:5';
          thumbnail_url?: string;
          video_url?: string;
          platform?: string;
          has_playable_media?: boolean;
          featured?: boolean;
          sort_order?: number;
          status?: 'draft' | 'published';
          metrics?: Json;
          tools_used?: Json;
          year?: number;
          published_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      site_content: {
        Row: {
          id: string;
          section_key: string;
          content: Json;
          draft_content: Json | null;
          status: 'draft' | 'published';
          updated_by: string | null;
          published_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          section_key: string;
          content?: Json;
          draft_content?: Json | null;
          status?: 'draft' | 'published';
          updated_by?: string | null;
          published_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          section_key?: string;
          content?: Json;
          draft_content?: Json | null;
          status?: 'draft' | 'published';
          updated_by?: string | null;
          published_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      site_content_revisions: {
        Row: {
          id: string;
          section_key: string;
          content: Json;
          created_by: string | null;
          version_number: number;
          change_summary: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          section_key: string;
          content: Json;
          created_by?: string | null;
          version_number?: number;
          change_summary?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          section_key?: string;
          content?: Json;
          created_by?: string | null;
          version_number?: number;
          change_summary?: string;
          created_at?: string;
        };
        Relationships: [];
      };
      services: {
        Row: {
          id: string;
          title: string;
          slug: string;
          badge: string;
          description: string;
          full_description: string;
          deliverables: Json;
          platforms: Json;
          turnaround_time: string;
          ideal_for: string;
          sample_video_url: string;
          image_url: string;
          features: Json;
          sort_order: number;
          is_published: boolean;
          published_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          slug: string;
          badge?: string;
          description: string;
          full_description?: string;
          deliverables?: Json;
          platforms?: Json;
          turnaround_time?: string;
          ideal_for?: string;
          sample_video_url?: string;
          image_url?: string;
          features?: Json;
          sort_order?: number;
          is_published?: boolean;
          published_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          slug?: string;
          badge?: string;
          description?: string;
          full_description?: string;
          deliverables?: Json;
          platforms?: Json;
          turnaround_time?: string;
          ideal_for?: string;
          sample_video_url?: string;
          image_url?: string;
          features?: Json;
          sort_order?: number;
          is_published?: boolean;
          published_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      testimonials: {
        Row: {
          id: string;
          client_name: string;
          role: string;
          company: string;
          avatar_url: string;
          quote: string;
          rating: number | null;
          project_title: string;
          project_category: string;
          metrics_result: string;
          is_verified: boolean;
          has_video_review: boolean;
          project_image_url: string;
          is_published: boolean;
          published_at: string | null;
          sort_order: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          client_name: string;
          role?: string;
          company: string;
          avatar_url?: string;
          quote: string;
          rating?: number | null;
          project_title?: string;
          project_category?: string;
          metrics_result?: string;
          is_verified?: boolean;
          has_video_review?: boolean;
          project_image_url?: string;
          is_published?: boolean;
          published_at?: string | null;
          sort_order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          client_name?: string;
          role?: string;
          company?: string;
          avatar_url?: string;
          quote?: string;
          rating?: number | null;
          project_title?: string;
          project_category?: string;
          metrics_result?: string;
          is_verified?: boolean;
          has_video_review?: boolean;
          project_image_url?: string;
          is_published?: boolean;
          published_at?: string | null;
          sort_order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      contact_inquiries: {
        Row: {
          id: string;
          name: string;
          email: string;
          company: string;
          service: string;
          budget: string;
          timeline: string;
          founder_preference: string;
          message: string;
          status: 'new' | 'in_review' | 'contacted' | 'archived';
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          email: string;
          company?: string;
          service: string;
          budget?: string;
          timeline?: string;
          founder_preference?: string;
          message: string;
          status?: 'new' | 'in_review' | 'contacted' | 'archived';
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          email?: string;
          company?: string;
          service?: string;
          budget?: string;
          timeline?: string;
          founder_preference?: string;
          message?: string;
          status?: 'new' | 'in_review' | 'contacted' | 'archived';
          created_at?: string;
        };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}

export type ProfileRow = Database['public']['Tables']['profiles']['Row'];
export type PortfolioProjectRow = Database['public']['Tables']['portfolio_projects']['Row'];
export type SiteContentRow = Database['public']['Tables']['site_content']['Row'];
export type SiteContentRevisionRow = Database['public']['Tables']['site_content_revisions']['Row'];
export type ServiceRow = Database['public']['Tables']['services']['Row'];
export type TestimonialRow = Database['public']['Tables']['testimonials']['Row'];
export type ContactInquiryRow = Database['public']['Tables']['contact_inquiries']['Row'];
