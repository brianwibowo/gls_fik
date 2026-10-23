'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/lib/auth';
import { GoogleLogin } from '@react-oauth/google';
import {
  Activity,
  ArrowLeft,
  AlertCircle,
  ShieldCheck,
  Lock,
} from 'lucide-react';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { loginWithGoogle, isLoggedIn } = useAuth();
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleSuccess = async (credential: string) => {
    setError('');
    setIsLoading(true);
    const result = await loginWithGoogle(credential);
    if (result.success) {
      const redirect = searchParams.get('redirect') || '/';
      router.push(redirect);
    } else {
      setError(result.error || 'Login dengan Google gagal. Silakan coba kembali.');
      setIsLoading(false);
    }
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
              Masuk ke GLS FIK
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-2 leading-relaxed">
              Gunakan akun Google Anda untuk langsung mengakses seluruh kurikulum video latihan dan panel pengelolaan.
            </p>
          </div>

          {/* Error message */}
          {error && (
            <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 flex items-start gap-3 text-sm text-red-300">
              <AlertCircle className="w-5 h-5 shrink-0 mt-0.5 text-red-400" />
              <span>{error}</span>
            </div>
          )}

          {/* Google One-Click Login Box */}
          <div className="p-6 rounded-2xl bg-[#141a24] border border-[#273549] space-y-5">
            <div className="flex items-center gap-3 text-xs text-slate-300 font-medium">
              <div className="w-7 h-7 rounded-lg bg-[#c1ff72]/15 flex items-center justify-center text-[#c1ff72] shrink-0 font-bold">
                <Lock className="w-3.5 h-3.5" />
              </div>
              <span>Satu akun untuk seluruh akses video dan materi latihan</span>
            </div>

            <div className="w-full flex justify-center [&>div]:!w-full [&>div>iframe]:!w-full [&>div>div]:!w-full shadow-lg rounded-full overflow-hidden">
              <GoogleLogin
                onSuccess={(res) => {
                  if (res.credential) handleGoogleSuccess(res.credential);
                }}
                onError={() => setError('Gagal melakukan login dengan Google.')}
                theme="filled_black"
                shape="pill"
                size="large"
                width="100%"
                text="continue_with"
              />
            </div>

            {isLoading && (
              <p className="text-center text-xs text-[#c1ff72] font-semibold animate-pulse">
                Memverifikasi kredensial Google & menyiapkan sesi...
              </p>
            )}

            <div className="pt-3 border-t border-white/5 flex items-center justify-center gap-2 text-slate-400 text-[11px]">
              <ShieldCheck className="w-3.5 h-3.5 text-[#c1ff72]" />
              <span>Otentikasi resmi Google OAuth 2.0 (Tanpa Kata Sandi)</span>
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
