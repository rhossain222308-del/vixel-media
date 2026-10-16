'use client';

import React, { useState, useTransition } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { 
  Film, 
  Lock, 
  Mail, 
  ShieldCheck, 
  AlertCircle, 
  ArrowLeft,
  Terminal
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { loginAction } from '@/lib/actions/auth';

function LoginForm() {
  const searchParams = useSearchParams();
  const returnTo = searchParams.get('returnTo') || '/dashboard';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleLogin = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage(null);

    const formData = new FormData();
    formData.append('email', email);
    formData.append('password', password);
    formData.append('returnTo', returnTo);

    startTransition(async () => {
      const result = await loginAction(null, formData);
      if (result?.error) {
        setErrorMessage(result.error);
      }
    });
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-16 sm:py-24 relative overflow-hidden">
      {/* Background radial glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-violet-600/10 rounded-full blur-[160px] pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        {/* Back to website button */}
        <div className="mb-6">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-medium text-gray-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Public Agency Site</span>
          </Link>
        </div>

        {/* Login Card */}
        <div className="p-8 sm:p-10 rounded-3xl bg-[#14141B]/90 border border-white/10 shadow-2xl backdrop-blur-xl">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-violet-600 to-purple-500 flex items-center justify-center text-white mx-auto shadow-lg shadow-violet-900/40 mb-4">
              <Film className="w-6 h-6" />
            </div>

            <div className="inline-flex items-center gap-1.5 mb-2">
              <Badge variant="purple" size="sm">Co-Founder Desk</Badge>
              <Badge variant="sample" size="sm">Private Access</Badge>
            </div>

            <h1 className="text-2xl font-extrabold text-white tracking-tight">
              Studio Portal Login
            </h1>
            <p className="mt-2 text-xs text-gray-400 leading-relaxed">
              Restricted management portal for Vixel Media co-founders.
            </p>
          </div>

          {/* Security Alert: Registration Disabled */}
          <div className="mb-6 p-3.5 rounded-2xl bg-violet-950/40 border border-violet-500/20 flex items-start gap-3">
            <ShieldCheck className="w-4 h-4 text-violet-400 mt-0.5 shrink-0" />
            <p className="text-[11px] text-gray-300 leading-relaxed">
              <strong className="text-white">Strict Security Policy:</strong> Public registration is permanently disabled. Only the two authorized founders have accounts provisioned in Supabase Auth.
            </p>
          </div>

          {/* Error Message Alert */}
          {errorMessage && (
            <div className="mb-6 p-4 rounded-2xl bg-red-950/40 border border-red-500/30 flex items-start gap-3 text-red-200 text-xs">
              <AlertCircle className="w-4 h-4 text-red-400 mt-0.5 shrink-0" />
              <div className="space-y-1">
                <span className="font-semibold text-white">Authentication Note:</span>
                <p>{errorMessage}</p>
              </div>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label
                htmlFor="email"
                className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-2"
              >
                Founder Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-500">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="alex@vixelmedia.demo"
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#0F0F14] border border-white/10 text-white placeholder-gray-500 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500 transition-all"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-2"
              >
                Founder Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-500">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#0F0F14] border border-white/10 text-white placeholder-gray-500 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500 transition-all"
                />
              </div>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              disabled={isPending}
              className="w-full"
              icon={<Lock className="w-4 h-4" />}
            >
              {isPending ? 'Authenticating with Supabase...' : 'Sign In to Studio Dashboard'}
            </Button>
          </form>

          {/* Quick Access to Preview Dashboard when Supabase is unconfigured */}
          <div className="mt-6 pt-6 border-t border-white/10 text-center space-y-3">
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-1.5 text-xs text-violet-400 hover:text-violet-300 font-medium transition-colors"
            >
              <Terminal className="w-3.5 h-3.5" />
              <span>Explore Dashboard in Staging/Setup Mode</span>
            </Link>

            <p className="text-[10px] text-gray-500">
              When live Supabase credentials are not connected, the dashboard opens in configuration mode to inspect migrations, RLS rules, and schemas.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <React.Suspense
      fallback={
        <div className="min-h-[85vh] flex items-center justify-center text-gray-400 text-sm">
          Loading studio portal...
        </div>
      }
    >
      <LoginForm />
    </React.Suspense>
  );
}

