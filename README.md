# VIXEL MEDIA — High-Impact Video Production Studio

> Premium dark creative-agency platform for Vixel Media, featuring distinct co-founder portfolios, unified agency work catalog, custom client CMS, video showcase embeds, and Supabase Row Level Security (RLS) backend.

---

## 1. Architecture & Tech Stack

- **Framework**: Next.js 16 (App Router with Turbopack)
- **Language**: TypeScript 5 (Strict type checking)
- **Styling**: Tailwind CSS with custom glassmorphism and deep violet neon design system
- **Backend / Database**: Supabase PostgreSQL + Auth + Storage
- **Security**: Row Level Security (RLS) policies, session middleware, honeypot & IP rate-limited contact submissions, sanitized open-redirect protection, secure embed parsers (`youtube-nocookie.com`, `player.vimeo.com`, direct HTTPS MP4)
- **SEO & Meta**: Dynamic sitemap (`/sitemap.xml`), robots exclusion (`/robots.txt`), OpenGraph cards, Twitter cards, metadata base configuration

---

## 2. Directory Structure

```
vixel_Media/
├── supabase/
│   ├── migrations/
│   │   ├── 20261024000001_initial_schema.sql       # Database tables, triggers, indexes
│   │   ├── 20261024000002_rls_policies.sql         # Row Level Security rules (A, B, C, D)
│   │   └── 20261024000003_storage_buckets.sql       # Avatars, portfolio, assets buckets & policies
│   └── seed.sql                                    # Initial co-founder profiles & sample projects
├── src/
│   ├── app/                                        # App Router routes & pages
│   │   ├── (public marketing pages)                # /, /work, /services, /about, /pricing, /contact...
│   │   ├── portfolio/[slug]/                       # Co-founder distinct portfolios
│   │   ├── login/                                  # Founder authentication portal
│   │   ├── dashboard/                              # Protected administrative studio CMS
│   │   ├── sitemap.ts                              # Dynamic sitemap generator
│   │   ├── robots.ts                               # Dynamic robots.txt
│   │   ├── not-found.tsx                           # Studio 404 handler
│   │   └── error.tsx                               # Error boundary with retry
│   ├── components/                                 # Reusable visual components
│   │   ├── layout/                                 # MainWrapper, Navbar, Footer
│   │   ├── video/                                  # Responsive video modal player
│   │   ├── contact/                                # Contact inquiry form
│   │   └── dashboard/                              # Dashboard layout & controls
│   ├── lib/                                        # Business logic, data access, & security
│   │   ├── actions/                                # Next.js Server Actions (auth, cms)
│   │   ├── data/                                   # Data loaders (profiles, portfolio, site, inquiries)
│   │   ├── supabase/                               # Browser, server, admin, & middleware clients
│   │   ├── security.ts                             # Open redirect & input sanitizers
│   │   └── video.ts                                # Video URL parser & embed generator
│   └── data/                                       # High-fidelity sample fallback agency data
└── scripts/
    ├── test-permissions-and-workflows.ts           # 44 automated security & workflow tests
    └── verify-backend.ts                           # 37 backend RLS & schema tests
```

---

## 3. Environment Variables Configuration

Copy `.env.example` to `.env.local`:

```bash
cp .env.example .env.local
```

Populate the required keys from your Supabase Dashboard:

| Variable | Description | Exposure |
| :--- | :--- | :--- |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase Project URL (`https://xyz.supabase.co`) | Public (Client & Server) |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Public Anon / Publishable API Key | Public (Client & Server) |
| `SUPABASE_SERVICE_ROLE_KEY` | Administrative secret key for seed scripts | **Server-only (Never expose to client)** |
| `NEXT_PUBLIC_SITE_URL` | Canonical production URL (e.g., `https://vixelmedia.com`) | Public (Metadata & Sitemap) |

---

## 4. Supabase Setup Instructions

### Step 1: Run Database Migrations
Execute the SQL migrations located in `supabase/migrations/` in order within your Supabase SQL Editor:
1. `20261024000001_initial_schema.sql` (Creates tables: `profiles`, `portfolio_projects`, `site_content`, `services`, `testimonials`, `contact_inquiries`).
2. `20261024000002_rls_policies.sql` (Enforces Row Level Security rules).
3. `20261024000003_storage_buckets.sql` (Initializes storage buckets: `avatars`, `portfolio`, `agency-assets`, `services`).

### Step 2: Create the Co-Founder Accounts
In the Supabase Dashboard under **Authentication -> Users**, create the two co-founder accounts:
- **Founder 1**: `alex@vixelmedia.com` (Alex Vance)
- **Founder 2**: `marcus@vixelmedia.com` (Marcus Chen)

*Note down their generated `UUID`s.*

### Step 3: Seed Profiles & Initial Content
In `supabase/seed.sql`, replace the placeholder UUIDs with the actual `auth.users` UUIDs from Step 2, then execute the file in the Supabase SQL Editor.

---

## 5. Security & Permission Boundaries

- **Rule A (Profile Isolation)**: `auth.uid() = id`. A founder can only update their own profile; editing another founder's profile is strictly denied.
- **Rule B (Portfolio Ownership)**: `owner_id = auth.uid()`. A founder can only create, update, or delete projects belonging to their own user ID.
- **Rule C (Shared Agency CMS)**: All authenticated founders have write access to shared site content, services, and testimonials. Unauthenticated visitors are blocked.
- **Rule D (Inquiry Privacy)**: Public visitors can insert contact inquiries; reading or modifying inquiries is strictly restricted to authenticated founders.
- **Input & Media Sanitization**:
  - `parseVideoUrl`: Enforces HTTPS streaming and embeds via `youtube-nocookie.com` or `player.vimeo.com`, neutralizing XSS attempts.
  - `sanitizeRedirectUrl`: Prevents open redirect exploits through `returnTo` parameters.
  - Rate Limiting: In-memory sliding window limits public inquiries to 5 per IP address per 10 minutes.
  - Honeypot Trap: Invisible honeypot field silences automated bot submissions.

---

## 6. Local Development & Verification

### Running the App Locally:
```bash
npm run dev
```
Open `http://localhost:3000` to view the public site or `http://localhost:3000/login` to access the studio dashboard.

### Running Automated Checks:
```bash
# Run TypeScript compilation check
npx tsc --noEmit

# Run ESLint check
npm run lint

# Run Complete Automated Test Suites (81/81 Tests)
npm test

# Run Next.js Production Build
npm run build
```

---

## 7. Deployment Instructions (Vercel)

1. Push your repository to GitHub or GitLab.
2. In Vercel, import the repository as a Next.js project.
3. In **Settings -> Environment Variables**, add:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `NEXT_PUBLIC_SITE_URL` (Set to your live domain, e.g. `https://vixelmedia.com`)
4. Trigger deployment. Next.js will build the 32 static and dynamic pages with zero errors.

---

## 8. Smoke-Test Checklist

- [ ] **Home Page (`/`)**: Hero animation, featured work, showreel, and services load smoothly.
- [ ] **Agency Work (`/work`)**: Catalog renders projects; category filter tabs function; clicking a card opens the responsive video player modal.
- [ ] **Founder 1 Portfolio (`/portfolio/alex-vance`)**: Displays Alex Vance's personal showreel, metrics, and curated projects.
- [ ] **Founder 2 Portfolio (`/portfolio/marcus-chen`)**: Displays Marcus Chen's personal showreel, 3D motion pieces, and distinct catalog.
- [ ] **Contact Form (`/contact`)**: Submitting a test inquiry validates inputs, tests honeypot/rate-limiting, and displays the success card.
- [ ] **Login Flow (`/login`)**: Logging in redirects to `/dashboard` while preventing open-redirects.
- [ ] **Dashboard (`/dashboard`)**: Sidebar navigation functions; public navbar and footer are hidden; mobile drawer functions on small screens.
- [ ] **Portfolio CRUD (`/dashboard/portfolio`)**: Create, edit, draft, preview, and publish workflows function as expected.
- [ ] **Inquiries Inbox (`/dashboard/inquiries`)**: Founders can review and mark client inquiries as reviewed or archived.
- [ ] **Sitemap & Robots (`/sitemap.xml`, `/robots.txt`)**: Properly generated; disallows crawler access to `/dashboard/*`.
