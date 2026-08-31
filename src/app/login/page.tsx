'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import {
  Activity,
  ArrowRight,
  ShieldCheck,
  Trophy,
  User,
  Zap,
  ArrowLeft,
  CheckCircle2,
  Lock,
  Mail,
} from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [role, setRole] = useState<'coach' | 'athlete' | 'parent'>('coach');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Handle Quick Login as Coach (Bypass)
  const handleCoachBypass = () => {
    setIsLoading(true);
    setTimeout(() => {
      router.push('/dashboard');
    }, 400);
  };

  // Handle Regular Form Submit
  const handleRegularSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      router.push('/dashboard');
    }, 400);
  };

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-12 bg-white font-sans text-slate-800">
      {/* LEFT COLUMN: 50% Login Form */}
      <div className="lg:col-span-6 flex flex-col justify-between p-6 sm:p-10 lg:p-14 bg-white relative z-10">
        {/* Top Header & Back Button */}
        <div className="flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-500 hover:text-blue-600 transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span>Kembali ke Beranda</span>
          </Link>

          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-xs">
              <Activity className="w-4 h-4" />
            </div>
            <span className="font-extrabold text-sm text-slate-900">
              GLS<span className="text-blue-600">.</span>
            </span>
          </div>
        </div>

        {/* Center: Form Area */}
        <div className="max-w-md w-full mx-auto my-8">
          <div className="mb-6">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold uppercase tracking-wider mb-2">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Portal Masuk Sistem</span>
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Selamat Datang Kembali
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Pilih peran Anda dan masuk untuk mengakses modul &amp; video senam.
            </p>
          </div>

          {/* STANDOUT COACH BYPASS BUTTON */}
          <div className="mb-6 p-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-600/20">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-100 flex items-center gap-1.5">
                <Zap className="w-4 h-4 text-amber-300 fill-amber-300" />
                <span>Autentikasi Cepat (Bypass)</span>
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/20 font-semibold">
                Mode Pelatih
              </span>
            </div>
            <p className="text-xs text-blue-100 mb-3">
              Langsung masuk ke Dashboard Pelatih dan akses seri video senam lantai tanpa perlu input password.
            </p>
            <button
              type="button"
              onClick={handleCoachBypass}
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-lg bg-white text-blue-700 font-bold text-sm hover:bg-blue-50 active:scale-[0.99] transition-all shadow-sm cursor-pointer"
            >
              {isLoading ? (
                <span>Memuat Dashboard...</span>
              ) : (
                <>
                  <span>Masuk Cepat sebagai Pelatih (Coach)</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>

          {/* Divider */}
          <div className="relative flex items-center justify-center my-6">
            <div className="border-t border-slate-200 w-full" />
            <span className="bg-white px-3 text-xs font-semibold text-slate-400 uppercase">
              atau masuk dengan akun
            </span>
            <div className="border-t border-slate-200 w-full" />
          </div>

          {/* Role Selector Tabs */}
          <div className="grid grid-cols-3 gap-2 mb-5">
            <button
              type="button"
              onClick={() => setRole('coach')}
              className={`flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-lg border text-xs font-bold transition-all ${
                role === 'coach'
                  ? 'border-blue-600 bg-blue-50 text-blue-700 shadow-xs'
                  : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
              <span>Pelatih</span>
            </button>

            <button
              type="button"
              onClick={() => setRole('athlete')}
              className={`flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-lg border text-xs font-bold transition-all ${
                role === 'athlete'
                  ? 'border-blue-600 bg-blue-50 text-blue-700 shadow-xs'
                  : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100'
              }`}
            >
              <Trophy className="w-3.5 h-3.5 text-blue-600" />
              <span>Atlet</span>
            </button>

            <button
              type="button"
              onClick={() => setRole('parent')}
              className={`flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-lg border text-xs font-bold transition-all ${
                role === 'parent'
                  ? 'border-blue-600 bg-blue-50 text-blue-700 shadow-xs'
                  : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100'
              }`}
            >
              <User className="w-3.5 h-3.5 text-blue-600" />
              <span>Orang Tua</span>
            </button>
          </div>

          {/* Regular Login Form */}
          <form onSubmit={handleRegularSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Nomor WhatsApp / Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="contoh: 08123456789 atau pelatih@gls.id"
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all placeholder:text-slate-400"
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="block text-xs font-bold text-slate-700">
                  Kata Sandi
                </label>
                <a href="#help" className="text-xs text-blue-600 hover:underline">
                  Lupa sandi?
                </a>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all placeholder:text-slate-400"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 rounded-lg bg-slate-900 text-white font-bold text-sm hover:bg-slate-800 active:scale-[0.99] transition-all shadow-xs cursor-pointer"
            >
              <span>Masuk dengan Kredensial</span>
            </button>
          </form>

          {/* Help Footer */}
          <div className="mt-6 p-3 bg-slate-50 rounded-lg border border-slate-100 text-center">
            <p className="text-xs text-slate-500">
              Belum terdaftar? Hubungi <span className="font-semibold text-slate-700">Admin Klub Senam</span> Anda untuk aktivasi akun.
            </p>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="text-xs text-slate-400 text-center sm:text-left">
          © {new Date().getFullYear()} Gymnastics Learning System (GLS 2.0).
        </div>
      </div>

      {/* RIGHT COLUMN: 50% Visual Showcase & Testimonial */}
      <div className="hidden lg:col-span-6 lg:flex flex-col justify-between p-12 bg-slate-900 text-white relative overflow-hidden">
        {/* Background Image with Dark Overlay */}
        <Image
          src="/images/hero-gymnast.webp"
          alt="Gymnastics Learning System"
          fill
          priority
          className="object-cover object-center opacity-30"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/60 to-slate-950/80 pointer-events-none" />

        {/* Top Badge */}
        <div className="relative z-10 flex items-center justify-between">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 text-xs font-bold uppercase tracking-wider backdrop-blur-md">
            <Trophy className="w-3.5 h-3.5 text-blue-400" />
            <span>Platform Pembelajaran Senam</span>
          </div>

          <span className="text-xs font-bold text-slate-400">Versi 2.0 — UX First</span>
        </div>

        {/* Center Content & Quote */}
        <div className="relative z-10 max-w-lg my-auto py-12">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-snug">
            Pembelajaran Senam yang Lebih Terarah &amp; Terstruktur
          </h2>
          <p className="mt-4 text-base text-slate-300 leading-relaxed font-normal">
            Akses seluruh rangkaian video pembelajaran teknik senam lantai (FX), balok keseimbangan, dan meja lompat langsung dalam format seri edukasi modern.
          </p>

          {/* 3 Pillars in Right Column */}
          <div className="mt-8 space-y-3 pt-6 border-t border-slate-800/80">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-green-400 shrink-0" />
              <span className="text-sm font-semibold text-slate-200">
                Pusat Video Latihan Google Drive Terintegrasi
              </span>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-green-400 shrink-0" />
              <span className="text-sm font-semibold text-slate-200">
                Format Seri &amp; Episode seperti Streaming Video
              </span>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-green-400 shrink-0" />
              <span className="text-sm font-semibold text-slate-200">
                Monitoring Progres Belajar Atlet &amp; Catatan Pelatih
              </span>
            </div>
          </div>
        </div>

        {/* Bottom Coach Profile Card */}
        <div className="relative z-10 p-4 rounded-xl bg-white/10 backdrop-blur-md border border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center font-extrabold text-white text-sm">
              CB
            </div>
            <div>
              <p className="text-xs font-bold text-white">Coach Budi Santoso</p>
              <p className="text-[11px] text-slate-400">Head Coach Senam Artistik</p>
            </div>
          </div>
          <span className="px-2.5 py-1 rounded bg-green-500/20 text-green-300 text-[11px] font-bold border border-green-500/30">
            Verified Coach
          </span>
        </div>
      </div>
    </div>
  );
}
