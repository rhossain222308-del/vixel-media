# VIXEL MEDIA — Supabase Backend & Security Setup Guide

This guide details the complete backend foundation for Vixel Media, built on **Supabase Auth**, **PostgreSQL**, **Supabase Storage**, and **Row Level Security (RLS)**.

---

## Architecture Overview

```
                      ┌────────────────────────────────────────┐
                      │              PUBLIC VISITORS           │
                      └──────────────────┬─────────────────────┘
                                         │
                         (Read-Only Published Assets)
                         (Submit Inquiries with Anti-Spam)
                                         ▼
┌────────────────────────────────────────────────────────────────────────────┐
│                             NEXT.JS 16 APP ROUTER                          │
│                                                                            │
│  - Public Catalog: /work, /services, /about, /portfolio/[slug]             │
│  - Inbound Pipeline: /contact (Server Action + Honeypot + Rate Limit)       │
│  - Middleware Session Guard: /dashboard (Redirects unauthenticated users)  │
│  - Co-Founder Studio Desk: /dashboard & /login                             │
└─────────────────────────────────────┬──────────────────────────────────────┘
                                      │
                   Server Actions & Supabase Client (@supabase/ssr)
                                      │
                                      ▼
┌────────────────────────────────────────────────────────────────────────────┐
│                    SUPABASE POSTGRESQL + RLS ENFORCEMENT                   │
│                                                                            │
│  • profiles            [Rule A: Isolated to auth.uid() = id]               │
│  • portfolio_projects  [Rule B: Isolated to auth.uid() = owner_id]         │
│  • site_content        [Rule C: Shared co-founder write, public published] │
│  • services            [Rule C: Shared co-founder write, public published] │
│  • testimonials        [Rule C: Shared co-founder write, public published] │
│  • contact_inquiries   [Rule D: Anon INSERT only, Founders SELECT/UPDATE]  │
│                                                                            │
│                    STORAGE BUCKETS (avatars, portfolio, agency, services)   │
└────────────────────────────────────────────────────────────────────────────┘
```

---

## 1. Environment Configuration

1. Copy `.env.example` to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```
2. Populate the required environment variables:
   ```env
   # Found in Supabase Dashboard -> Project Settings -> API
   NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key-here

   # CRITICAL: Server-only! Never prefix with NEXT_PUBLIC_ or expose to client
   SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-secret-here

   # Canonical URL
   NEXT_PUBLIC_SITE_URL=http://localhost:3000
   ```

> [!WARNING]
> Never commit `.env.local` or expose `SUPABASE_SERVICE_ROLE_KEY` to client-side code. The application uses server-side clients with `@supabase/ssr` to ensure keys remain secure.

---

## 2. Database Schema & Migrations

Run the SQL migration files in sequence in the **Supabase Dashboard → SQL Editor** (or via `supabase db push` if using Supabase CLI):

1. **`supabase/migrations/20261016000001_initial_schema.sql`**:
   - Enables `uuid-ossp` and `pgcrypto`.
   - Creates `profiles`, `portfolio_projects`, `site_content`, `services`, `testimonials`, `contact_inquiries`.
   - Configures `set_updated_at_timestamp` triggers for auto-updating timestamps.
   - Creates performance indexes on slugs, foreign keys, and status columns.

2. **`supabase/migrations/20261016000002_rls_policies.sql`**:
   - Enables RLS on all 6 tables.
   - **Rule A (Profiles)**: Co-founders can only view and update their own personal profile (`auth.uid() = id`). Public visitors see only published profiles (`is_published = true`).
   - **Rule B (Personal Projects)**: Project mutations strictly require `owner_id = auth.uid()`. Cross-founder reassignment or tampering is blocked at the database level. Public visitors only see published projects of published founders.
   - **Rule C (Shared CMS)**: Both authenticated founders can collaboratively create, update, and manage shared website content (`site_content`), `services`, and `testimonials`. Public visitors can read only published records.
   - **Rule D (Inquiries)**: Public visitors can INSERT inquiries, but have 0 read/update/delete permissions. Only authenticated founders can view and update inquiry leads.

3. **`supabase/migrations/20261016000003_storage_buckets.sql`**:
   - Creates buckets: `avatars`, `portfolio`, `agency-assets`, and `services`.
   - Public read allowed for published media assets.
   - `avatars` and `portfolio` write access is restricted by folder name: `(storage.foldername(name))[1] = auth.uid()::text`.
   - `agency-assets` and `services` write access is open to both authenticated founders.

4. **`supabase/seed.sql`**:
   - Seeds agency services, client testimonials, and section content (`home_hero`, `about_story`, `pricing_tiers`, `agency_settings`, `footer_info`).

---

## 3. Disabling Public Self-Registration & Provisioning Co-Founders

To ensure strict security and prevent unauthorized sign-ups:

### Step 3.1: Disable Public Sign-ups in Supabase
1. In your Supabase Dashboard, go to **Authentication → Providers → Email**.
2. Uncheck **"Enable Sign-ups"**.
3. Click **Save**.
4. (Optional) Under **Authentication → Settings**, verify that email confirmations are enabled if desired.

### Step 3.2: Create the Two Founder Accounts
Go to **Authentication → Users → Add User → Create User**:

1. **Founder 1 (Alex Vance - Creative Director / Lead Editor)**:
   - Email: `alex@vixelmedia.demo` (or founder's real email)
   - Password: Choose a strong, unique password (e.g., 20+ random characters).
   - Copy the generated user UUID (e.g. `11111111-2222-3333-4444-555555555555`).

2. **Founder 2 (Marcus Chen - Head of Motion Design / VFX)**:
   - Email: `marcus@vixelmedia.demo` (or founder's real email)
   - Password: Choose a strong, unique password.
   - Copy the generated user UUID (e.g. `66666666-7777-8888-9999-000000000000`).

### Step 3.3: Link Founder User Accounts to Profiles
Open the Supabase SQL Editor and run the profile linking query from the bottom of `supabase/seed.sql`:

```sql
-- Link Alex Vance
INSERT INTO public.profiles (
  id, slug, full_name, role, tagline, bio, full_bio, 
  avatar_url, cover_url, contact_email, location, years_experience, 
  socials, skills, tools, experience, clients, is_published
) VALUES (
  'PASTE_ALEX_USER_UUID_HERE'::uuid,
  'alex-vance',
  'Alex Vance',
  'Co-Founder & Creative Director / Lead Editor',
  'Architect of narrative pacing, cinematic color science, and high-retention video storytelling.',
  '8+ years crafting cinematic brand documentaries, YouTube masterclasses, and high-conversion commercial films.',
  '["Alex specializes in narrative architecture, pacing psychology, and high-end DaVinci Resolve color grading.", "At Vixel Media, Alex leads video editing pipelines and editorial quality standards."]'::jsonb,
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&w=1600&q=80',
  'alex@vixelmedia.demo',
  'Los Angeles / Remote',
  8,
  '{"instagram": "https://instagram.com", "x": "https://x.com", "linkedin": "https://linkedin.com", "youtube": "https://youtube.com"}'::jsonb,
  '[{"name": "Narrative Pacing & Story Architecture", "level": 96, "category": "Editing"}, {"name": "DaVinci Resolve Color Grading & HDR", "level": 92, "category": "Color & Grading"}]'::jsonb,
  '[{"name": "Adobe Premiere Pro", "category": "NLE", "iconName": "Film"}, {"name": "DaVinci Resolve Studio", "category": "Color & Mastering", "iconName": "Palette"}]'::jsonb,
  '[{"year": "2023 - Present", "role": "Co-Founder & Creative Director", "companyOrClient": "Vixel Media Studio", "description": "Directing editorial pipelines and setting visual language."}]'::jsonb,
  '["Tech Brand Alpha", "Creator Studio Lab", "Nordic Venture Group"]'::jsonb,
  true
) ON CONFLICT (id) DO UPDATE SET
  full_name = EXCLUDED.full_name,
  is_published = EXCLUDED.is_published;

-- Link Marcus Chen
INSERT INTO public.profiles (
  id, slug, full_name, role, tagline, bio, full_bio, 
  avatar_url, cover_url, contact_email, location, years_experience, 
  socials, skills, tools, experience, clients, is_published
) VALUES (
  'PASTE_MARCUS_USER_UUID_HERE'::uuid,
  'marcus-chen',
  'Marcus Chen',
  'Co-Founder & Head of Motion Design / VFX',
  'Transforming complex data and geographic journeys into dynamic 3D map animations and kinetic visuals.',
  'Master of After Effects, 3D cartography, kinetic typography, and scroll-stopping short-form hooks.',
  '["Marcus brings a technical yet intensely creative approach to motion design and visual effects.", "At Vixel Media, Marcus spearheads motion graphics systems, map animation sequences, and vertical Reels engineered for algorithmic retention."]'::jsonb,
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1600&q=80',
  'marcus@vixelmedia.demo',
  'San Francisco / Remote',
  7,
  '{"instagram": "https://instagram.com", "x": "https://x.com", "linkedin": "https://linkedin.com", "behance": "https://behance.net"}'::jsonb,
  '[{"name": "3D Map & Geographic Journey Animation", "level": 98, "category": "VFX & Motion"}, {"name": "Kinetic Typography & Brand Motion Systems", "level": 95, "category": "VFX & Motion"}]'::jsonb,
  '[{"name": "Adobe After Effects", "category": "Motion & Compositing", "iconName": "Sparkles"}, {"name": "Maxon Cinema 4D", "category": "3D Modeling & Dynamics", "iconName": "Layers"}]'::jsonb,
  '[{"year": "2023 - Present", "role": "Co-Founder & Head of Motion Design", "companyOrClient": "Vixel Media Studio", "description": "Leading 3D cartography pipelines and kinetic typography systems."}]'::jsonb,
  '["GeoChronicle Series", "Terra Visuals", "Hyperflow Tech"]'::jsonb,
  true
) ON CONFLICT (id) DO UPDATE SET
  full_name = EXCLUDED.full_name,
  is_published = EXCLUDED.is_published;
```

---

## 4. Verification & Permission Matrix

| Operation | Public Visitor | Founder 1 (Alex) | Founder 2 (Marcus) | Enforcing Layer |
|---|---|---|---|---|
| Read Alex Vance Profile | Published only | Full (Draft & Pub) | Published only | RLS + Data Layer |
| Update Alex Vance Profile | Blocked (0 rows) | **Allowed** | **BLOCKED** | RLS + Server Action |
| Read Marcus Chen Profile | Published only | Published only | Full (Draft & Pub) | RLS + Data Layer |
| Update Marcus Chen Profile | Blocked (0 rows) | **BLOCKED** | **Allowed** | RLS + Server Action |
| Create Project for Alex | Blocked | **Allowed** (owner_id = Alex) | **BLOCKED** | RLS + Server Action |
| Update Alex's Project | Blocked | **Allowed** | **BLOCKED** | RLS + Server Action |
| Edit Shared Site Content | Blocked | **Allowed** | **Allowed** | RLS + Server Action |
| Edit Agency Services | Blocked | **Allowed** | **Allowed** | RLS + Server Action |
| Submit Contact Inquiry | **Allowed** (Validated) | Allowed | Allowed | Server Action + RLS |
| View / Read Inquiries | **BLOCKED** (0 rows) | **Allowed** | **Allowed** | RLS + Server Action |
| Upload to `avatars/<userId>` | Blocked | Allowed for own folder | Allowed for own folder | Storage RLS |

---

## 5. Offline & Graceful Configuration State

If Supabase credentials are missing or unconfigured:
- The public website seamlessly falls back to the curated sample data in `src/data/`.
- The dashboard at `/dashboard` opens in **Offline Setup Mode**, providing a preview of all controls and a direct reference to the setup documentation.
- The contact form safely simulates submission and displays clear status without throwing unhandled exceptions.
- The authentication page at `/login` provides explicit guidance without crashing.
