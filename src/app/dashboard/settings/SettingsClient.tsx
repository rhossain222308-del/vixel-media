'use client';

import React from 'react';
import Link from 'next/link';
import { 
  Settings, 
  Database, 
  ShieldCheck, 
  Lock, 
  Key, 
  HardDrive, 
  UserCheck, 
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  Copy,
  Terminal,
  HelpCircle
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';

interface SettingsClientProps {
  userEmail: string;
  userId: string;
  founderName: string;
  founderRole: string;
  isConfigured: boolean;
  isAdminConfigured: boolean;
}

export function SettingsClient({
  userEmail,
  userId,
  founderName,
  founderRole,
  isConfigured,
  isAdminConfigured,
}: SettingsClientProps) {
  const [copiedKey, setCopiedKey] = React.useState<string | null>(null);

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(label);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const buckets = [
    {
      name: 'avatars',
      desc: 'Founder profile photos & client headshots',
      access: 'Public Read / Founder Isolated Write',
      status: 'Active',
    },
    {
      name: 'portfolio',
      desc: 'Project video posters & media thumbnails',
      access: 'Public Read / Owner Isolated Write',
      status: 'Active',
    },
    {
      name: 'agency-assets',
      desc: 'Brand logos, hero graphics, and banners',
      access: 'Public Read / Co-Founders Write',
      status: 'Active',
    },
    {
      name: 'services',
      desc: 'Service package imagery & preview stills',
      access: 'Public Read / Co-Founders Write',
      status: 'Active',
    },
  ];

  const rlsRules = [
    {
      rule: 'Rule A — Personal Founder Profiles',
      enforcement: 'auth.uid() = id',
      desc: 'Each founder can edit only their own name, bio, headshot, and public slug. Editing another founder is strictly blocked.',
    },
    {
      rule: 'Rule B — Portfolio Projects Isolation',
      enforcement: 'auth.uid() = owner_id',
      desc: 'Projects are strictly owned by the creator. A founder cannot modify or delete projects owned by the other founder.',
    },
    {
      rule: 'Rule C — Shared Agency Website & Services',
      enforcement: 'auth.uid() IS NOT NULL',
      desc: 'Both authenticated co-founders have collaborative edit rights over shared website copy, agency services, and testimonials.',
    },
    {
      rule: 'Rule D — Private Inquiries Desk',
      enforcement: 'Public INSERT only / Founder SELECT, UPDATE, DELETE',
      desc: 'Public visitors can submit contact forms with honeypot and rate limiting. Only authenticated co-founders can read or manage leads.',
    },
  ];

  return (
    <div className="space-y-8 max-w-5xl">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <div className="inline-flex items-center gap-2 mb-1">
            <span className="text-xs font-mono uppercase tracking-wider text-violet-400 font-bold">
              Studio Configuration
            </span>
            <span className="text-gray-600">•</span>
            <span className="text-xs text-gray-400">Security & Backend Health</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            Studio Settings & Security Diagnostic
          </h1>
          <p className="text-xs sm:text-sm text-gray-400 mt-1">
            Verify Supabase authentication, database connectivity, storage bucket health, and Row Level Security enforcement.
          </p>
        </div>
      </div>

      {/* Account Capsule */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[#14141B] border border-white/10 space-y-6">
        <h2 className="text-base font-bold text-white flex items-center gap-2">
          <UserCheck className="w-4 h-4 text-violet-400" />
          <span>Active Authenticated Co-Founder Account</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-2xl bg-black/40 border border-white/5 space-y-1">
            <span className="text-[10px] font-mono uppercase text-gray-500 font-bold">
              Founder Profile Name
            </span>
            <div className="text-sm font-bold text-white">{founderName}</div>
            <div className="text-xs text-violet-400">{founderRole}</div>
          </div>

          <div className="p-4 rounded-2xl bg-black/40 border border-white/5 space-y-1">
            <span className="text-[10px] font-mono uppercase text-gray-500 font-bold">
              Authenticated Email Address
            </span>
            <div className="text-sm font-mono text-white">{userEmail}</div>
            <div className="text-[11px] text-gray-500">Managed via Supabase Auth</div>
          </div>

          <div className="p-4 rounded-2xl bg-black/40 border border-white/5 space-y-1 md:col-span-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono uppercase text-gray-500 font-bold">
                User Auth UUID
              </span>
              <button
                type="button"
                onClick={() => handleCopy(userId, 'uuid')}
                className="text-[11px] text-violet-400 hover:text-violet-300 font-mono flex items-center gap-1 cursor-pointer"
              >
                <Copy className="w-3 h-3" />
                <span>{copiedKey === 'uuid' ? 'Copied!' : 'Copy UUID'}</span>
              </button>
            </div>
            <div className="text-xs font-mono text-gray-300 break-all">{userId}</div>
          </div>
        </div>

        <div className="flex items-center gap-3 pt-2">
          <Link href="/dashboard/profile">
            <Button size="sm" variant="secondary" className="gap-2">
              <span>Edit My Profile & Bio</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* Supabase Environment Diagnostic */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[#14141B] border border-white/10 space-y-6">
        <h2 className="text-base font-bold text-white flex items-center gap-2">
          <Database className="w-4 h-4 text-violet-400" />
          <span>Supabase Infrastructure Status</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 rounded-2xl bg-black/40 border border-white/5 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-gray-300">Database & API</span>
              {isConfigured ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              ) : (
                <AlertCircle className="w-4 h-4 text-amber-400" />
              )}
            </div>
            <div className="text-sm font-bold text-white">
              {isConfigured ? 'Connected (Live)' : 'Offline Preview'}
            </div>
            <p className="text-[11px] text-gray-400">
              {isConfigured
                ? 'All queries & mutations persist to Supabase PostgreSQL.'
                : 'Showing mock data fixtures until credentials are populated.'}
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-black/40 border border-white/5 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-gray-300">Public Anon Key</span>
              {isConfigured ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              ) : (
                <AlertCircle className="w-4 h-4 text-amber-400" />
              )}
            </div>
            <div className="text-sm font-bold text-white">
              {isConfigured ? 'Valid Client Token' : 'Placeholder'}
            </div>
            <p className="text-[11px] text-gray-400">
              Safe browser-accessible publishable key.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-black/40 border border-white/5 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-gray-300">Service Role Key</span>
              {isAdminConfigured ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              ) : (
                <span className="text-[10px] font-mono text-gray-500">Optional</span>
              )}
            </div>
            <div className="text-sm font-bold text-white">
              {isAdminConfigured ? 'Guarded Server-Only' : 'Not Loaded'}
            </div>
            <p className="text-[11px] text-gray-400">
              Never exposed to the client or browser bundle.
            </p>
          </div>
        </div>
      </div>

      {/* Supabase Storage Buckets Audit */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[#14141B] border border-white/10 space-y-6">
        <h2 className="text-base font-bold text-white flex items-center gap-2">
          <HardDrive className="w-4 h-4 text-violet-400" />
          <span>Supabase Storage Buckets</span>
        </h2>

        <div className="divide-y divide-white/5">
          {buckets.map((b) => (
            <div
              key={b.name}
              className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2"
            >
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-mono font-bold text-white">{b.name}</span>
                  <Badge variant="purple" size="sm">{b.status}</Badge>
                </div>
                <p className="text-xs text-gray-400 mt-0.5">{b.desc}</p>
              </div>
              <span className="text-xs font-mono text-gray-500">{b.access}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Row Level Security Audit */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[#14141B] border border-white/10 space-y-6">
        <h2 className="text-base font-bold text-white flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Row Level Security (RLS) Policy Architecture</span>
        </h2>

        <div className="space-y-3">
          {rlsRules.map((rule, idx) => (
            <div
              key={idx}
              className="p-4 rounded-2xl bg-black/40 border border-white/5 space-y-1.5"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                <span className="text-xs font-bold text-white">{rule.rule}</span>
                <span className="text-[11px] font-mono text-violet-400 bg-violet-950/40 px-2 py-0.5 rounded border border-violet-500/20">
                  {rule.enforcement}
                </span>
              </div>
              <p className="text-xs text-gray-400 leading-relaxed">{rule.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Second Co-Founder Provisioning Guide */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-[#181824] to-[#14141C] border border-white/10 space-y-4">
        <div className="flex items-center gap-2">
          <Key className="w-4 h-4 text-violet-400" />
          <h2 className="text-base font-bold text-white">
            Connecting Marcus Chen (Second Co-Founder)
          </h2>
        </div>
        <p className="text-xs text-gray-300 leading-relaxed">
          Public signup is permanently disabled for security. To provision the second co-founder account:
        </p>
        <ol className="list-decimal list-inside text-xs text-gray-400 space-y-1.5 pl-1 leading-relaxed">
          <li>
            Open your <strong>Supabase Dashboard → Authentication → Users</strong>.
          </li>
          <li>
            Click <strong>Add User → Create User</strong> with email <code className="text-violet-300 bg-white/5 px-1 py-0.5 rounded">marcus@vixelmedia.com</code> and a temporary password.
          </li>
          <li>
            Copy Marcus&apos;s generated User UUID.
          </li>
          <li>
            Execute the following SQL command in the <strong>SQL Editor</strong> to link his profile record:
          </li>
        </ol>

        <div className="p-3.5 rounded-2xl bg-black/60 border border-white/10 font-mono text-xs text-gray-300 overflow-x-auto">
          <code>UPDATE profiles SET id = &apos;&lt;MARCUS_AUTH_UUID&gt;&apos; WHERE slug = &apos;marcus-chen&apos;;</code>
        </div>
      </div>
    </div>
  );
}
