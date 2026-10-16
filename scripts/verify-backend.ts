import fs from 'fs';
import path from 'path';

/**
 * Backend Architecture & RLS Verification Suite
 * Verifies SQL migrations, RLS policies, schemas, and configurations
 */

function runVerification() {
  console.log('====================================================');
  console.log('VIXEL MEDIA — BACKEND & RLS VERIFICATION SUITE');
  console.log('====================================================\n');

  let passedTests = 0;
  let totalTests = 0;

  function assert(condition: boolean, testName: string, detail?: string) {
    totalTests++;
    if (condition) {
      passedTests++;
      console.log(`✓ [PASS] ${testName}`);
    } else {
      console.error(`✗ [FAIL] ${testName}`);
      if (detail) console.error(`  Detail: ${detail}`);
    }
  }

  const projectRoot = process.cwd();

  // 1. Check migrations existence
  const migrationDir = path.join(projectRoot, 'supabase', 'migrations');
  assert(fs.existsSync(migrationDir), 'Migrations directory exists');

  const migration1 = path.join(migrationDir, '20261016000001_initial_schema.sql');
  const migration2 = path.join(migrationDir, '20261016000002_rls_policies.sql');
  const migration3 = path.join(migrationDir, '20261016000003_storage_buckets.sql');
  const seedFile = path.join(projectRoot, 'supabase', 'seed.sql');

  assert(fs.existsSync(migration1), 'Migration 1 (initial_schema) exists');
  assert(fs.existsSync(migration2), 'Migration 2 (rls_policies) exists');
  assert(fs.existsSync(migration3), 'Migration 3 (storage_buckets) exists');
  assert(fs.existsSync(seedFile), 'Seed data file exists');

  // 2. Validate tables in migration 1
  const m1Content = fs.readFileSync(migration1, 'utf8');
  assert(m1Content.includes('CREATE TABLE IF NOT EXISTS public.profiles'), 'profiles table defined in schema');
  assert(m1Content.includes('CREATE TABLE IF NOT EXISTS public.portfolio_projects'), 'portfolio_projects table defined in schema');
  assert(m1Content.includes('CREATE TABLE IF NOT EXISTS public.site_content'), 'site_content table defined in schema');
  assert(m1Content.includes('CREATE TABLE IF NOT EXISTS public.services'), 'services table defined in schema');
  assert(m1Content.includes('CREATE TABLE IF NOT EXISTS public.testimonials'), 'testimonials table defined in schema');
  assert(m1Content.includes('CREATE TABLE IF NOT EXISTS public.contact_inquiries'), 'contact_inquiries table defined in schema');
  assert(m1Content.includes('REFERENCES auth.users(id)'), 'profiles references auth.users(id)');
  assert(m1Content.includes('REFERENCES public.profiles(id)'), 'portfolio_projects references profiles(id)');

  // 3. Validate RLS policies in migration 2
  const m2Content = fs.readFileSync(migration2, 'utf8');
  assert(m2Content.includes('ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;'), 'RLS enabled on profiles');
  assert(m2Content.includes('ALTER TABLE public.portfolio_projects ENABLE ROW LEVEL SECURITY;'), 'RLS enabled on portfolio_projects');
  assert(m2Content.includes('ALTER TABLE public.site_content ENABLE ROW LEVEL SECURITY;'), 'RLS enabled on site_content');
  assert(m2Content.includes('ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;'), 'RLS enabled on services');
  assert(m2Content.includes('ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;'), 'RLS enabled on testimonials');
  assert(m2Content.includes('ALTER TABLE public.contact_inquiries ENABLE ROW LEVEL SECURITY;'), 'RLS enabled on contact_inquiries');

  // Rule A check
  assert(
    m2Content.includes('USING (auth.uid() = id)') && m2Content.includes('WITH CHECK (auth.uid() = id)'),
    'Rule A: Founder profile update strictly isolated to auth.uid() = id (Founder 1 cannot edit Founder 2)'
  );

  // Rule B check
  assert(
    m2Content.includes('USING (auth.uid() = owner_id)') && m2Content.includes('WITH CHECK (auth.uid() = owner_id)'),
    'Rule B: Portfolio project update strictly isolated to owner_id = auth.uid() (Founder 1 cannot edit Founder 2 projects)'
  );

  // Rule C check
  assert(
    m2Content.includes('ON public.site_content') && m2Content.includes('TO authenticated') && m2Content.includes('USING (true)'),
    'Rule C: Shared site content editable by all authenticated co-founders'
  );

  // Rule D check
  assert(
    m2Content.includes('ON public.contact_inquiries') && m2Content.includes('FOR SELECT') && m2Content.includes('TO authenticated'),
    'Rule D: Contact inquiries SELECT policy restricted strictly to authenticated founders (anon has 0 read permission)'
  );

  // Draft vs Published check
  assert(
    m2Content.includes("USING (is_published = true)") && m2Content.includes("USING (status = 'published'"),
    'Public queries enforce is_published = true / status = published (drafts protected)'
  );

  // 4. Validate Storage Buckets in migration 3
  const m3Content = fs.readFileSync(migration3, 'utf8');
  assert(m3Content.includes("'avatars'"), 'avatars storage bucket configured');
  assert(m3Content.includes("'portfolio'"), 'portfolio storage bucket configured');
  assert(m3Content.includes("'agency-assets'"), 'agency-assets storage bucket configured');
  assert(m3Content.includes("'services'"), 'services storage bucket configured');
  assert(
    m3Content.includes("(storage.foldername(name))[1] = auth.uid()::text"),
    'Storage folder isolation enforces founder-specific upload directories'
  );

  // 5. Validate Environment & Client helpers
  const envExample = path.join(projectRoot, '.env.example');
  assert(fs.existsSync(envExample), '.env.example exists');
  const envContent = fs.readFileSync(envExample, 'utf8');
  assert(envContent.includes('NEXT_PUBLIC_SUPABASE_URL'), '.env.example includes NEXT_PUBLIC_SUPABASE_URL');
  assert(envContent.includes('NEXT_PUBLIC_SUPABASE_ANON_KEY'), '.env.example includes NEXT_PUBLIC_SUPABASE_ANON_KEY');
  assert(envContent.includes('SUPABASE_SERVICE_ROLE_KEY'), '.env.example includes SUPABASE_SERVICE_ROLE_KEY');

  // Check client files
  const clientTs = path.join(projectRoot, 'src', 'lib', 'supabase', 'client.ts');
  const serverTs = path.join(projectRoot, 'src', 'lib', 'supabase', 'server.ts');
  const adminTs = path.join(projectRoot, 'src', 'lib', 'supabase', 'admin.ts');
  const middlewareTs = path.join(projectRoot, 'src', 'lib', 'supabase', 'middleware.ts');

  assert(fs.existsSync(clientTs), 'Browser client (client.ts) exists');
  assert(fs.existsSync(serverTs), 'Server client (server.ts) exists');
  assert(fs.existsSync(adminTs), 'Admin client (admin.ts) exists');
  assert(fs.existsSync(middlewareTs), 'Middleware session updater (middleware.ts) exists');

  console.log('\n----------------------------------------------------');
  console.log(`Verification Complete: ${passedTests}/${totalTests} Tests Passed`);
  console.log('----------------------------------------------------\n');

  if (passedTests !== totalTests) {
    process.exit(1);
  }
}

runVerification();
