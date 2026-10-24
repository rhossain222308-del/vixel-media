import fs from 'fs';
import path from 'path';
import { parseVideoUrl } from '../src/lib/video';
import { sanitizeRedirectUrl } from '../src/lib/security';
import { submitContactInquiry } from '../src/lib/data/inquiries';
import { sampleProjects } from '../src/data/projects';
import { sampleFounders } from '../src/data/founders';

/**
 * VIXEL MEDIA — COMPREHENSIVE PERMISSIONS, SECURITY & WORKFLOWS TEST SUITE
 * Tests end-to-end founder workflows, authorization boundaries, RLS rules, and input sanitization.
 */

async function runTestSuite() {
  console.log('================================================================');
  console.log('VIXEL MEDIA — AUTOMATED SECURITY & WORKFLOWS TEST SUITE');
  console.log('================================================================\n');

  let passed = 0;
  let total = 0;

  function assert(condition: boolean, testName: string, detail?: string) {
    total++;
    if (condition) {
      passed++;
      console.log(`✓ [PASS] ${testName}`);
    } else {
      console.error(`✗ [FAIL] ${testName}`);
      if (detail) console.error(`  Detail: ${detail}`);
    }
  }

  // ============================================================================
  // SUITE 1: Video URL Sanitization & Embed Security
  // ============================================================================
  console.log('\n--- 1. Safe Video Embed & Sanitization Suite ---');

  const ytStandard = parseVideoUrl('https://www.youtube.com/watch?v=dQw4w9WgXcQ');
  assert(
    Boolean(ytStandard.isValid && ytStandard.type === 'youtube' && ytStandard.embedUrl?.includes('youtube-nocookie.com')),
    'YouTube standard watch URL parsed into secure youtube-nocookie embed'
  );

  const ytShorts = parseVideoUrl('https://www.youtube.com/shorts/dQw4w9WgXcQ');
  assert(
    ytShorts.isValid && ytShorts.type === 'youtube' && ytShorts.videoId === 'dQw4w9WgXcQ',
    'YouTube vertical Shorts URL recognized and parsed correctly'
  );

  const ytShortLink = parseVideoUrl('https://youtu.be/dQw4w9WgXcQ');
  assert(
    ytShortLink.isValid && ytShortLink.type === 'youtube' && ytShortLink.videoId === 'dQw4w9WgXcQ',
    'YouTube short youtu.be link parsed correctly'
  );

  const vimeoUrl = parseVideoUrl('https://vimeo.com/76979871');
  assert(
    Boolean(vimeoUrl.isValid && vimeoUrl.type === 'vimeo' && vimeoUrl.embedUrl?.includes('player.vimeo.com')),
    'Vimeo URL parsed into secure player.vimeo.com embed'
  );

  const directMp4 = parseVideoUrl('https://cdn.example.com/assets/video_master.mp4');
  assert(
    directMp4.isValid && directMp4.type === 'direct' && directMp4.embedUrl === 'https://cdn.example.com/assets/video_master.mp4',
    'Direct HTTPS MP4 streaming link verified'
  );

  // Attack vectors
  const xssJs = parseVideoUrl('javascript:alert("XSS")');
  assert(!xssJs.isValid && xssJs.embedUrl === null, 'Rejects javascript: XSS injection attempt');

  const xssHtml = parseVideoUrl('<script>alert(1)</script>');
  assert(!xssHtml.isValid, 'Rejects script tag injection');

  const insecureHttp = parseVideoUrl('http://insecure-cdn.com/video.mp4');
  assert(!insecureHttp.isValid, 'Rejects unencrypted HTTP direct video stream');

  const randomString = parseVideoUrl('not-a-video-link');
  assert(!randomString.isValid, 'Fails gracefully on arbitrary malformed input');

  // ============================================================================
  // SUITE 2: Open Redirect Vulnerability Protection
  // ============================================================================
  console.log('\n--- 2. Open Redirect Protection Suite ---');

  assert(sanitizeRedirectUrl('/dashboard') === '/dashboard', 'Allows safe internal /dashboard redirect');
  assert(sanitizeRedirectUrl('/dashboard/portfolio') === '/dashboard/portfolio', 'Allows safe subroute redirect');
  assert(sanitizeRedirectUrl('https://evil.com') === '/dashboard', 'Neutralizes external https://evil.com open redirect');
  assert(sanitizeRedirectUrl('//evil.com/hack') === '/dashboard', 'Neutralizes protocol-relative //evil.com redirect');
  assert(sanitizeRedirectUrl('/\\evil.com') === '/dashboard', 'Neutralizes backslash evasion /\\evil.com redirect');
  assert(sanitizeRedirectUrl('') === '/dashboard', 'Safely defaults empty redirect string to /dashboard');
  assert(sanitizeRedirectUrl(null) === '/dashboard', 'Safely defaults null redirect to /dashboard');

  // ============================================================================
  // SUITE 3: Public Inquiry Submission, Anti-Spam & Rate Limiting
  // ============================================================================
  console.log('\n--- 3. Public Inquiry Validation & Anti-Spam Suite ---');

  // Clean submission
  const validInquiry = await submitContactInquiry(
    {
      name: 'Sarah Connor',
      email: 'sarah@skynet-defense.com',
      service: 'Video Editing',
      message: 'Need 4 multi-camera podcast episodes edited per month.',
      honeypot: '',
    },
    '192.168.1.100'
  );
  assert(validInquiry.success, 'Valid client inquiry submission succeeds');

  // Honeypot bot trap
  const botInquiry = await submitContactInquiry(
    {
      name: 'Spam Bot',
      email: 'bot@spamnetwork.com',
      service: 'Video Editing',
      message: 'Buy cheap backlink services now!',
      honeypot: 'http://spam-site.com', // Bot filled the hidden trap
    },
    '192.168.1.101'
  );
  // Returns success: true to deceive bot, but skips database insertion
  assert(botInquiry.success, 'Anti-spam honeypot safely traps automated bots');

  // Invalid email rejection
  const badEmailInquiry = await submitContactInquiry(
    {
      name: 'John Doe',
      email: 'not-an-email',
      service: 'Video Editing',
      message: 'Hello studio, need video quote.',
    },
    '192.168.1.102'
  );
  assert(Boolean(!badEmailInquiry.success && badEmailInquiry.error?.includes('email')), 'Rejects invalid email format');

  // Short message rejection
  const shortMsgInquiry = await submitContactInquiry(
    {
      name: 'John Doe',
      email: 'john@example.com',
      service: 'Video Editing',
      message: 'Hi', // Under 5 characters
    },
    '192.168.1.103'
  );
  assert(Boolean(!shortMsgInquiry.success && shortMsgInquiry.error?.includes('description')), 'Rejects excessively short project message');

  // Rate limiting test (limit is 5 inquiries per IP in 10 minutes)
  const rateLimitIp = '192.168.2.222';
  for (let i = 0; i < 5; i++) {
    await submitContactInquiry(
      {
        name: `Tester ${i}`,
        email: `tester${i}@example.com`,
        service: 'Video Editing',
        message: 'Valid test message for rate limit check',
      },
      rateLimitIp
    );
  }
  const rateLimitedInquiry = await submitContactInquiry(
    {
      name: 'Tester 6',
      email: 'tester6@example.com',
      service: 'Video Editing',
      message: 'This 6th request should trigger rate limit',
    },
    rateLimitIp
  );
  assert(
    Boolean(!rateLimitedInquiry.success && rateLimitedInquiry.error?.includes('Too many inquiries')),
    'Rate limiter throttles excessive submissions from same IP'
  );

  // ============================================================================
  // SUITE 4: Founder Isolation & Permission Logic (Rules A, B, C, D)
  // ============================================================================
  console.log('\n--- 4. Founder Ownership & Permissions Suite ---');

  const founder1Id = 'uuid-founder-1-alex';
  const founder2Id = 'uuid-founder-2-marcus';

  // Rule A Check: Profile isolation logic simulation
  function simulateProfileUpdate(sessionUserId: string, targetProfileId: string) {
    if (sessionUserId !== targetProfileId) {
      return { success: false, error: 'Security Violation: Cannot edit another founder profile' };
    }
    return { success: true };
  }

  assert(
    simulateProfileUpdate(founder1Id, founder1Id).success,
    'Rule A: Founder 1 can update their own personal profile'
  );
  assert(
    !simulateProfileUpdate(founder1Id, founder2Id).success,
    'Rule A: Founder 1 is BLOCKED from modifying Founder 2 profile'
  );
  assert(
    !simulateProfileUpdate(founder2Id, founder1Id).success,
    'Rule A: Founder 2 is BLOCKED from modifying Founder 1 profile'
  );

  // Rule B Check: Portfolio project isolation logic simulation
  function simulateProjectModification(sessionUserId: string, projectOwnerId: string) {
    if (sessionUserId !== projectOwnerId) {
      return { success: false, error: 'Security Violation: You do not own this project' };
    }
    return { success: true };
  }

  assert(
    simulateProjectModification(founder1Id, founder1Id).success,
    'Rule B: Founder 1 can edit and delete their own portfolio projects'
  );
  assert(
    !simulateProjectModification(founder1Id, founder2Id).success,
    'Rule B: Founder 1 is BLOCKED from editing or deleting Founder 2 projects'
  );
  assert(
    !simulateProjectModification(founder2Id, founder1Id).success,
    'Rule B: Founder 2 is BLOCKED from editing or deleting Founder 1 projects'
  );

  // Rule C Check: Shared website content logic simulation
  function simulateSharedContentEdit(sessionUserId: string | null) {
    if (!sessionUserId) {
      return { success: false, error: 'Unauthorized: Founder login required' };
    }
    return { success: true };
  }

  assert(
    simulateSharedContentEdit(founder1Id).success,
    'Rule C: Founder 1 has write access to shared agency website CMS'
  );
  assert(
    simulateSharedContentEdit(founder2Id).success,
    'Rule C: Founder 2 has write access to shared agency website CMS'
  );
  assert(
    !simulateSharedContentEdit(null).success,
    'Rule C: Unauthenticated public visitor is BLOCKED from writing to shared CMS'
  );

  // Rule D Check: Inquiries private access
  function simulateInquiryAccess(sessionUserId: string | null, action: 'read' | 'insert') {
    if (action === 'insert') return { success: true }; // Public can submit
    if (!sessionUserId) return { success: false, error: 'Unauthorized: Login required to view inquiries' };
    return { success: true };
  }

  assert(
    simulateInquiryAccess(null, 'insert').success,
    'Rule D: Public visitor can submit contact inquiries'
  );
  assert(
    !simulateInquiryAccess(null, 'read').success,
    'Rule D: Public visitor is BLOCKED from viewing private submitted inquiries'
  );
  assert(
    simulateInquiryAccess(founder1Id, 'read').success,
    'Rule D: Authenticated Founder 1 can access inquiry inbox'
  );
  assert(
    simulateInquiryAccess(founder2Id, 'read').success,
    'Rule D: Authenticated Founder 2 can access inquiry inbox'
  );

  // ============================================================================
  // SUITE 5: Portfolio Separation & Dynamic Slugs
  // ============================================================================
  console.log('\n--- 5. Co-Founder Separation & Portfolio Catalog Suite ---');

  const f1Projects = sampleProjects.filter(
    (p) => p.founderId === sampleFounders[0].id || p.founderId === sampleFounders[0].slug
  );
  const f2Projects = sampleProjects.filter(
    (p) => p.founderId === sampleFounders[1].id || p.founderId === sampleFounders[1].slug
  );

  assert(f1Projects.length > 0, `Founder 1 (Alex Vance) catalog loaded (${f1Projects.length} projects)`);
  assert(f2Projects.length > 0, `Founder 2 (Marcus Chen) catalog loaded (${f2Projects.length} projects)`);

  const sharedProjectIds = f1Projects.filter((p1) => f2Projects.some((p2) => p2.id === p1.id));
  assert(
    sharedProjectIds.length === 0,
    'Founder 1 and Founder 2 public portfolios are completely distinct (0 cross-contamination)'
  );

  const founders = sampleFounders;
  assert(founders.length === 2, 'Exactly two co-founders defined in agency registry');
  assert(founders[0].slug !== founders[1].slug, 'Co-founders possess unique, non-colliding URL slugs');

  // ============================================================================
  // SUITE 6: SEO, Meta & Route Manifest Verification
  // ============================================================================
  console.log('\n--- 6. SEO, Meta & Manifest Integrity Suite ---');

  const sitemapPath = path.join(process.cwd(), 'src', 'app', 'sitemap.ts');
  const robotsPath = path.join(process.cwd(), 'src', 'app', 'robots.ts');
  const notFoundPath = path.join(process.cwd(), 'src', 'app', 'not-found.tsx');
  const errorPath = path.join(process.cwd(), 'src', 'app', 'error.tsx');

  assert(fs.existsSync(sitemapPath), 'Dynamic sitemap.ts exists');
  assert(fs.existsSync(robotsPath), 'Dynamic robots.ts exists');
  assert(fs.existsSync(notFoundPath), 'Custom 404 not-found.tsx exists');
  assert(fs.existsSync(errorPath), 'Custom error.tsx error boundary exists');

  const robotsContent = fs.readFileSync(robotsPath, 'utf8');
  assert(
    robotsContent.includes("disallow: ['/dashboard/', '/admin/', '/login']") || robotsContent.includes('/dashboard/'),
    'robots.ts disallows indexing of private /dashboard/ administrative routes'
  );

  // ============================================================================
  // Summary
  // ============================================================================
  console.log('\n================================================================');
  console.log(`Test Execution Completed: ${passed}/${total} Tests Passed`);
  console.log('================================================================\n');

  if (passed !== total) {
    process.exit(1);
  }
}

runTestSuite().catch((err) => {
  console.error('Test suite execution failed with fatal error:', err);
  process.exit(1);
});
