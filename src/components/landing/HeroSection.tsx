'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  ArrowRight,
  Sparkles,
  CheckCircle2,
  ShieldCheck,
  Video,
  Compass,
  Layers,
  Award,
  Users,
} from 'lucide-react';
import { ScrollReveal } from '../ui/ScrollReveal';

export function HeroSection({ onOpenLogin }: { onOpenLogin?: () => void }) {
  const heroStats = [
    {
      value: '6',
      label: 'Nomor Alat Senam',
      desc: 'Floor, Beam, Vault, Bars, Rings, Pommel',
      icon: Layers,
    },
    {
      value: '50+',
      label: 'Video Panduan HD',
      desc: 'Slow-motion & sudut teknis detail',
      icon: Video,
    },
    {
      value: '100%',
      label: 'Terverifikasi Pelatih',
      desc: 'Kurikulum standar FIK & PB Persani',
      icon: Award,
    },
    {
      value: '3 Sisi',
      label: 'Ekosistem Terintegrasi',
      desc: 'Pelatih, atlet muda, dan orang tua',
      icon: Users,
    },
  ];

  return (
    <section className="relative pt-32 pb-16 md:pt-40 md:pb-24 overflow-hidden bg-gradient-to-b from-blue-50/70 via-[#F8FAFC] to-[#F8FAFC]">
      {/* Radiant Gradient Background Blurs */}
      <div className="absolute top-12 left-1/2 -translate-x-1/2 w-[850px] h-[450px] bg-gradient-to-tr from-blue-400/15 via-indigo-300/15 to-transparent rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute top-1/3 right-0 w-[400px] h-[400px] bg-blue-500/10 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-10 items-center">
          {/* Left Column: Copywriting */}
          <div className="lg:col-span-7 flex flex-col items-start text-left">
            <ScrollReveal direction="up" delay={0.05}>
              <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-white/90 border border-blue-200/80 shadow-xs text-blue-800 text-xs font-semibold uppercase tracking-wider mb-6 backdrop-blur-sm">
                <span className="flex h-2 w-2 rounded-full bg-blue-600 animate-pulse" />
                <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                <span>Gymnastics Learning System 2.0</span>
              </div>
            </ScrollReveal>

            <ScrollReveal direction="up" delay={0.15}>
              <h1 className="text-4xl sm:text-5xl lg:text-[56px] font-black text-slate-900 tracking-tight leading-[1.12]">
                Pembelajaran Senam Artistik Terstruktur Bersama{' '}
                <span className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-600 bg-clip-text text-transparent">
                  Pelatih Anda
                </span>
              </h1>
            </ScrollReveal>

            <ScrollReveal direction="up" delay={0.25}>
              <p className="mt-6 text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl">
                Learning Hub terintegrasi untuk pelatih menyusun kurikulum berjenjang, atlet
                memahami biomekanika gerakan melalui video slow-motion, serta orang tua memantau
                ketuntasan teknik secara transparan.
              </p>
            </ScrollReveal>

            {/* Action Buttons */}
            <ScrollReveal direction="up" delay={0.35} className="w-full sm:w-auto">
              <div className="mt-8 flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full">
                <Link
                  href="/login"
                  target="_blank"
                  className="inline-flex items-center justify-center gap-3 px-8 py-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-base font-bold hover:from-blue-700 hover:to-indigo-700 active:scale-[0.98] transition-all shadow-lg shadow-blue-600/25 group cursor-pointer"
                >
                  <span>Mulai Akses Platform</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>

                <a
                  href="#alat"
                  className="inline-flex items-center justify-center gap-2.5 px-7 py-4 rounded-xl bg-white text-slate-700 text-base font-bold border border-slate-200/90 hover:bg-slate-50 hover:text-blue-600 hover:border-blue-200 active:scale-[0.98] transition-all shadow-xs"
                >
                  <Compass className="w-5 h-5 text-blue-600" />
                  <span>Jelajahi Nomor Alat</span>
                </a>
              </div>
            </ScrollReveal>

            {/* Trust Badges */}
            <ScrollReveal direction="up" delay={0.45}>
              <div className="mt-10 pt-6 border-t border-slate-200/80 flex flex-wrap items-center gap-y-3 gap-x-6 text-xs sm:text-sm font-medium text-slate-600">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Sesuai Kurikulum FIG &amp; FIK</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Koreksi Sudut Gerakan Detail</span>
                </div>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0" />
                  <span>Antarmuka Edukatif Bebas Iklan</span>
                </div>
              </div>
            </ScrollReveal>
          </div>

          {/* Right Column: Hero Visual with Dynamic Badges */}
          <div className="lg:col-span-5 relative flex justify-center">
            <ScrollReveal direction="left" delay={0.2} className="w-full max-w-lg lg:max-w-none">
              <div className="relative">
                {/* Main Image Frame */}
                <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-slate-900 ring-1 ring-slate-900/10">
                  <Image
                    src="/images/hero-gymnast-elite.webp"
                    alt="Atlet Senam Artistik Melakukan Lompatan Split Leap di Gymnasium"
                    width={700}
                    height={525}
                    priority
                    className="w-full h-auto object-cover object-center transform hover:scale-[1.02] transition-transform duration-700"
                  />
                  {/* Subtle Gradient Shadow */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent pointer-events-none" />

                  {/* Bottom Image Caption */}
                  <div className="absolute bottom-5 left-5 right-5 text-white flex items-center justify-between">
                    <div>
                      <p className="text-xs font-semibold text-blue-200 uppercase tracking-wider">
                        Floor Exercise (FX)
                      </p>
                      <p className="text-sm font-bold text-white">Grand Jeté Split Leap</p>
                    </div>
                    <span className="px-2.5 py-1 rounded-full bg-black/40 backdrop-blur-md border border-white/20 text-[11px] font-medium text-slate-200">
                      Slow-Mo 120 FPS
                    </span>
                  </div>
                </div>

                {/* Floating Metric Card 1: Progress Circle */}
                <div className="absolute -bottom-6 -left-6 bg-white/95 backdrop-blur-md p-4 rounded-2xl shadow-xl border border-slate-100 flex items-center gap-3.5 animate-bounce-subtle">
                  <div className="relative w-12 h-12 flex items-center justify-center">
                    <svg className="w-12 h-12 -rotate-90" viewBox="0 0 36 36">
                      <path
                        className="text-slate-100"
                        strokeWidth="3.5"
                        stroke="currentColor"
                        fill="none"
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      />
                      <path
                        className="text-blue-600"
                        strokeDasharray="85, 100"
                        strokeWidth="3.5"
                        strokeLinecap="round"
                        stroke="currentColor"
                        fill="none"
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      />
                    </svg>
                    <span className="absolute font-extrabold text-blue-700 text-xs">85%</span>
                  </div>
                  <div>
                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                      Ketuntasan Modul
                    </p>
                    <p className="text-sm font-extrabold text-slate-800">Senam Lantai (FX)</p>
                  </div>
                </div>

                {/* Floating Metric Card 2: Coach Verification */}
                <div className="absolute -top-4 -right-4 bg-white/95 backdrop-blur-md px-4 py-3 rounded-2xl shadow-xl border border-slate-100 flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                    <ShieldCheck className="w-5 h-5 stroke-[2.2]" />
                  </div>
                  <div>
                    <p className="text-xs font-extrabold text-slate-900">Teknik Terverifikasi</p>
                    <p className="text-[11px] text-slate-500">Pelatih Senam Berlisensi</p>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>

        {/* Bottom Metric Strip */}
        <div className="mt-16 pt-10 border-t border-slate-200/80">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {heroStats.map((stat, idx) => {
              const Icon = stat.icon;
              return (
                <div
                  key={idx}
                  className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:border-blue-300 transition-colors flex flex-col justify-between"
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                      {stat.value}
                    </span>
                    <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                      <Icon className="w-4 h-4 stroke-[2.2]" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-800">{stat.label}</h3>
                    <p className="text-xs text-slate-500 mt-0.5">{stat.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
