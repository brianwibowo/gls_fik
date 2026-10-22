'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/lib/auth';
import {
  Activity,
  ArrowLeft,
  Mail,
  Lock,
  LogIn,
  AlertCircle,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login, isLoggedIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  React.useEffect(() => {
    if (isLoggedIn) {
      const redirect = searchParams.get('redirect') || '/';
      router.push(redirect);
    }
  }, [isLoggedIn, router, searchParams]);

  if (isLoggedIn) {
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    const result = await login(email, password);
    if (result.success) {
      const redirect = searchParams.get('redirect') || '/';
      router.push(redirect);
    } else {
      setError(result.error || 'Authentication failed. Please check your credentials.');
      setIsLoading(false);
    }
  };

  const handleFillDemo = (demoEmail: string, demoPass: string) => {
    setEmail(demoEmail);
    setPassword(demoPass);
    setError('');
  };

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2 bg-[#0a0a0a]">
      {/* Hero Visual Panel */}
      <div className="hidden lg:flex relative overflow-hidden flex-col justify-between p-12 bg-black">
        <Image
          src="/images/feature-video.webp"
          alt="Artistic gymnastics competition technique analysis"
          fill
          priority
          className="object-cover object-center filter brightness-95"
          sizes="50vw"
        />

        {/* Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black/70" />
        <div className="absolute inset-0 bg-black/20" />

        {/* Top Branding */}
        <div className="relative z-10 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#c1ff72] flex items-center justify-center text-[#1f2a2e] font-black shadow-lg">
            <Activity className="w-5 h-5 stroke-[3]" />
          </div>
          <div>
            <span className="text-lg font-black tracking-tight text-white block leading-none">
              GCL
            </span>
            <span className="text-xs text-slate-300 font-medium">
              Gymnastics Competition Level
            </span>
          </div>
        </div>

        {/* Bottom Editorial Content */}
        <div className="relative z-10 space-y-4 max-w-lg">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#c1ff72]/20 border border-[#c1ff72]/40 text-xs font-bold text-[#c1ff72]">
            <span>Technical Competition Curriculum</span>
          </div>

          <h2 className="text-3xl xl:text-4xl font-black text-white leading-tight tracking-tight">
            Technique Precision, Checklists &amp; Coach Scoring.
          </h2>

          <p className="text-sm text-slate-300 leading-relaxed">
            The integrated technical platform for competitive gymnasts, coaches, and evaluators to master all 6 Men&apos;s Artistic Gymnastics apparatus.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-2 text-xs font-semibold text-slate-300">
            <span className="px-2.5 py-1 rounded-md bg-black/60 border border-white/20">Floor Exercise</span>
            <span className="px-2.5 py-1 rounded-md bg-black/60 border border-white/20">Pommel Horse</span>
            <span className="px-2.5 py-1 rounded-md bg-black/60 border border-white/20">Still Rings</span>
            <span className="px-2.5 py-1 rounded-md bg-black/60 border border-white/20">Vault</span>
          </div>
        </div>
      </div>

      {/* Login Form Column */}
      <div className="flex flex-col justify-center items-center px-6 sm:px-12 py-12 bg-[#0c0f14] text-white">
        <div className="w-full max-w-md space-y-8">
          {/* Header Link */}
          <div className="flex items-center justify-between">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-400 hover:text-white transition-colors group min-h-[44px]"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              <span>Back to Home</span>
            </Link>

            <span className="text-[11px] font-bold text-[#c1ff72] bg-[#c1ff72]/10 border border-[#c1ff72]/20 px-2.5 py-0.5 rounded-full">
              Sign In Portal
            </span>
          </div>

          {/* Title Area */}
          <div>
            <div className="w-10 h-10 rounded-xl bg-[#c1ff72] flex items-center justify-center text-[#1f2a2e] mb-4 shadow-md lg:hidden">
              <Activity className="w-5 h-5 stroke-[3]" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Sign In to Your Account
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1.5">
              Access your apparatus routines, technique tracker, and coach evaluations.
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 flex items-start gap-3 text-sm text-red-300">
              <AlertCircle className="w-5 h-5 shrink-0 mt-0.5 text-red-400" />
              <span>{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-2 uppercase tracking-wider">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="athlete@gymnasticcomplevel.com"
                  required
                  className="w-full min-h-[44px] pl-10 pr-4 py-3 rounded-xl bg-[#141a24] border border-[#273549] text-base sm:text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-[#c1ff72]/40 focus:border-[#c1ff72] transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-2 uppercase tracking-wider">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                  className="w-full min-h-[44px] pl-10 pr-4 py-3 rounded-xl bg-[#141a24] border border-[#273549] text-base sm:text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-[#c1ff72]/40 focus:border-[#c1ff72] transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full min-h-[46px] py-3.5 rounded-xl bg-[#c1ff72] hover:bg-[#b0f555] text-[#1f2a2e] font-black text-sm sm:text-base active:scale-[0.99] transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
            >
              {isLoading ? (
                <span>Authenticating...</span>
              ) : (
                <>
                  <LogIn className="w-4 h-4 stroke-[2.5]" />
                  <span>Sign In to GCL</span>
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Access Box */}
          <div className="p-4 rounded-2xl bg-[#141a24] border border-[#273549] space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#c1ff72]" />
                <span className="text-xs font-bold text-slate-200">Demo Role Credentials:</span>
              </div>
              <span className="text-[10px] text-slate-400">Click to autofill</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => handleFillDemo('athlete@gymnasticcomplevel.com', 'athlete123')}
                className="p-2.5 rounded-xl bg-[#1f2937] hover:bg-[#334155] border border-[#374151] text-left transition-colors cursor-pointer min-h-[44px]"
              >
                <div className="flex items-center justify-between text-xs font-bold text-white">
                  <span>Athlete</span>
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#c1ff72]" />
                </div>
                <p className="text-[10px] text-slate-400 mt-0.5 truncate">athlete@gymnasticcomplevel.com</p>
              </button>

              <button
                type="button"
                onClick={() => handleFillDemo('coach@gymnasticcomplevel.com', 'coach123')}
                className="p-2.5 rounded-xl bg-[#1f2937] hover:bg-[#334155] border border-[#374151] text-left transition-colors cursor-pointer min-h-[44px]"
              >
                <div className="flex items-center justify-between text-xs font-bold text-[#c1ff72]">
                  <span>Coach</span>
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#c1ff72]" />
                </div>
                <p className="text-[10px] text-slate-400 mt-0.5 truncate">coach@gymnasticcomplevel.com</p>
              </button>

              <button
                type="button"
                onClick={() => handleFillDemo('admin@gymnasticcomplevel.com', 'admin123')}
                className="p-2.5 rounded-xl bg-[#1f2937] hover:bg-[#334155] border border-[#374151] text-left transition-colors cursor-pointer min-h-[44px]"
              >
                <div className="flex items-center justify-between text-xs font-bold text-white">
                  <span>Admin</span>
                  <CheckCircle2 className="w-3.5 h-3.5 text-slate-400" />
                </div>
                <p className="text-[10px] text-slate-400 mt-0.5 truncate">admin@gymnasticcomplevel.com</p>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#0a0a0a]" />}>
      <LoginForm />
    </Suspense>
  );
}
