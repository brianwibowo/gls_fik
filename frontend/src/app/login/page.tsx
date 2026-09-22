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

  // If already logged in, redirect
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
      setError(result.error || 'Login gagal.');
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
      {/* Hero visual */}
      <div className="hidden lg:flex relative overflow-hidden flex-col justify-between p-12 bg-black">
        {/* Background Image */}
        <Image
          src="/images/feature-video.webp"
          alt="Evaluasi Video Pembelajaran Senam FIK"
          fill
          priority
          className="object-cover object-center filter brightness-95"
          sizes="50vw"
        />

        {/* Gradient Overlays for High Contrast Text */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black/70" />
        <div className="absolute inset-0 bg-black/20" />

        {/* Top Branding */}
        <div className="relative z-10 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#c1ff72] flex items-center justify-center text-[#1f2a2e] font-black shadow-lg">
            <Activity className="w-5 h-5 stroke-[3]" />
          </div>
          <div>
            <span className="text-lg font-black tracking-tight text-white block leading-none">
              GLS FIK
            </span>
            <span className="text-xs text-slate-300 font-medium">
              Gymnastics Learning System
            </span>
          </div>
        </div>

        {/* Bottom Editorial Content */}
        <div className="relative z-10 space-y-4 max-w-lg">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#c1ff72]/20 border border-[#c1ff72]/40 text-xs font-bold text-[#c1ff72]">
            <span>Kurikulum Pembelajaran Senam</span>
          </div>

          <h2 className="text-3xl xl:text-4xl font-black text-white leading-tight tracking-tight">
            Peragaan Teknik Gerak & Evaluasi Pendaratan.
          </h2>

          <p className="text-sm text-slate-300 leading-relaxed">
            Platform kurikulum senam digital terintegrasi untuk pelatih, atlet, dan mahasiswa
            Fakultas Ilmu Keolahragaan dalam mempelajari berbagai kategori senam artistik.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-2 text-xs font-semibold text-slate-300">
            <span className="px-2.5 py-1 rounded-md bg-black/60 border border-white/20">Floor Exercise</span>
            <span className="px-2.5 py-1 rounded-md bg-black/60 border border-white/20">Pommel Horse</span>
            <span className="px-2.5 py-1 rounded-md bg-black/60 border border-white/20">Vault</span>
          </div>
        </div>
      </div>

      {/* Login form card */}
      <div className="flex flex-col justify-center items-center px-6 sm:px-12 py-12 bg-[#0c0f14] text-white">
        <div className="w-full max-w-md space-y-8">
          {/* Header Link */}
          <div className="flex items-center justify-between">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-400 hover:text-white transition-colors group"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              <span>Kembali ke Beranda</span>
            </Link>

            <span className="text-[11px] font-bold text-[#c1ff72] bg-[#c1ff72]/10 border border-[#c1ff72]/20 px-2.5 py-0.5 rounded-full">
              Portal Akses
            </span>
          </div>

          {/* Title Area */}
          <div>
            <div className="w-10 h-10 rounded-xl bg-[#c1ff72] flex items-center justify-center text-[#1f2a2e] mb-4 shadow-md lg:hidden">
              <Activity className="w-5 h-5 stroke-[3]" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Masuk Akun Pengguna
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1.5">
              Gunakan email dan kata sandi Anda untuk mengakses materi video atau panel admin.
            </p>
          </div>

          {/* Error message */}
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
                Alamat Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@gls.id"
                  required
                  className="w-full min-h-[44px] pl-10 pr-4 py-3 rounded-xl bg-[#141a24] border border-[#273549] text-base sm:text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-[#c1ff72]/40 focus:border-[#c1ff72] transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-2 uppercase tracking-wider">
                Kata Sandi
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Masukkan kata sandi akun"
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
                <span>Memverifikasi Akun...</span>
              ) : (
                <>
                  <LogIn className="w-4 h-4 stroke-[2.5]" />
                  <span>Masuk Sekarang</span>
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Access Box */}
          <div className="p-4 rounded-xl bg-[#141a24] border border-[#273549] space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#c1ff72]" />
                <span className="text-xs font-bold text-slate-200">Akun Demo Pengujian:</span>
              </div>
              <span className="text-[10px] text-slate-400">Klik untuk isi otomatis</span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleFillDemo('admin@gls.id', 'admin123')}
                className="p-2.5 rounded-lg bg-[#1f2937] hover:bg-[#334155] border border-[#374151] text-left transition-colors cursor-pointer"
              >
                <div className="flex items-center justify-between text-xs font-bold text-white">
                  <span>Akun Admin</span>
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#c1ff72]" />
                </div>
                <p className="text-[10px] text-slate-400 mt-0.5">admin@gls.id</p>
              </button>

              <button
                type="button"
                onClick={() => handleFillDemo('alisha@gls.id', 'user123')}
                className="p-2.5 rounded-lg bg-[#1f2937] hover:bg-[#334155] border border-[#374151] text-left transition-colors cursor-pointer"
              >
                <div className="flex items-center justify-between text-xs font-bold text-white">
                  <span>Akun Atlet / User</span>
                  <CheckCircle2 className="w-3.5 h-3.5 text-slate-400" />
                </div>
                <p className="text-[10px] text-slate-400 mt-0.5">alisha@gls.id</p>
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
