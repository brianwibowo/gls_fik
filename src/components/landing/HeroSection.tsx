'use client';

import React from 'react';
import Image from 'next/image';
import { ArrowRight, Sparkles, CheckCircle2, PlayCircle, Shield } from 'lucide-react';
import { ScrollReveal } from '../ui/ScrollReveal';

interface HeroSectionProps {
  onOpenLogin: () => void;
}

export function HeroSection({ onOpenLogin }: HeroSectionProps) {
  return (
    <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden bg-gradient-to-b from-blue-50/60 via-[#F8FAFC] to-[#F8FAFC]">
      {/* Background Soft Glow Accents */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-blue-400/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Copywriting & CTA */}
          <div className="lg:col-span-7 flex flex-col items-start text-left">
            <ScrollReveal direction="up" delay={0.1}>
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-100/80 border border-blue-200 text-blue-800 text-xs font-bold uppercase tracking-wider mb-6">
                <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                <span>Gymnastics Learning System 2.0</span>
              </div>
            </ScrollReveal>

            <ScrollReveal direction="up" delay={0.2}>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.15]">
                Belajar Senam Lebih Terarah Bersama{' '}
                <span className="text-blue-600 relative inline-block">
                  Pelatih Anda
                  <svg
                    className="absolute -bottom-2 left-0 w-full h-3 text-blue-200 -z-10"
                    viewBox="0 0 100 20"
                    preserveAspectRatio="none"
                  >
                    <path
                      d="M0 15 Q50 0 100 15"
                      stroke="currentColor"
                      strokeWidth="6"
                      fill="transparent"
                      strokeLinecap="round"
                    />
                  </svg>
                </span>
              </h1>
            </ScrollReveal>

            <ScrollReveal direction="up" delay={0.3}>
              <p className="mt-6 text-lg sm:text-xl text-slate-600 leading-relaxed max-w-2xl font-normal">
                Platform pembelajaran digital yang membantu pelatih menyusun materi latihan dan
                memudahkan atlet belajar teknik senam kapan saja.
              </p>
            </ScrollReveal>

            {/* CTA Buttons */}
            <ScrollReveal direction="up" delay={0.4} className="w-full sm:w-auto">
              <div className="mt-8 flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full">
                <button
                  onClick={onOpenLogin}
                  className="inline-flex items-center justify-center gap-3 px-8 py-4 rounded-xl bg-blue-600 text-white text-base font-bold hover:bg-blue-700 active:scale-[0.98] transition-all shadow-md shadow-blue-600/25 group cursor-pointer"
                >
                  <span>Masuk Sekarang</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>

                <a
                  href="#tentang"
                  className="inline-flex items-center justify-center gap-2 px-7 py-4 rounded-xl bg-white text-slate-700 text-base font-bold border border-slate-200 hover:bg-slate-50 hover:text-blue-600 active:scale-[0.98] transition-all shadow-xs"
                >
                  <PlayCircle className="w-5 h-5 text-blue-600" />
                  <span>Pelajari Selengkapnya</span>
                </a>
              </div>
            </ScrollReveal>

            {/* Trust Badges */}
            <ScrollReveal direction="up" delay={0.5}>
              <div className="mt-10 pt-8 border-t border-slate-200/80 grid grid-cols-3 gap-4 sm:gap-6 w-full">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-600 shrink-0" />
                  <span className="text-xs sm:text-sm font-semibold text-slate-700">Materi Terstruktur</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-600 shrink-0" />
                  <span className="text-xs sm:text-sm font-semibold text-slate-700">Video Gerakan Detail</span>
                </div>
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-blue-600 shrink-0" />
                  <span className="text-xs sm:text-sm font-semibold text-slate-700">Ramah Orang Tua</span>
                </div>
              </div>
            </ScrollReveal>
          </div>

          {/* Right Column: Hero Visual WebP */}
          <div className="lg:col-span-5 relative flex justify-center">
            <ScrollReveal direction="left" delay={0.3} className="w-full max-w-lg lg:max-w-none">
              <div className="relative">
                {/* Decorative border frame */}
                <div className="relative rounded-2xl overflow-hidden shadow-xl border-4 border-white bg-white">
                  <Image
                    src="/images/hero-gymnast.webp"
                    alt="Pelatihan Senam GLS bersama Pelatih dan Atlet"
                    width={700}
                    height={500}
                    priority
                    className="w-full h-auto object-cover object-center transform hover:scale-[1.02] transition-transform duration-500"
                  />
                  {/* Overlay Gradient for readability */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 via-transparent to-transparent pointer-events-none" />
                </div>

                {/* Floating Quick Card 1: Progress Circle */}
                <div className="absolute -bottom-6 -left-6 bg-white p-4 rounded-xl shadow-lg border border-slate-100 flex items-center gap-3 animate-bounce-subtle">
                  <div className="w-12 h-12 rounded-full bg-blue-50 border-2 border-blue-600 flex items-center justify-center font-bold text-blue-700 text-sm">
                    85%
                  </div>
                  <div>
                    <p className="text-[11px] font-medium text-slate-500 uppercase tracking-wider">
                      Progres Atlet
                    </p>
                    <p className="text-sm font-bold text-slate-800">Senam Lantai (Floor)</p>
                  </div>
                </div>

                {/* Floating Quick Card 2: Coach Verified */}
                <div className="absolute -top-4 -right-4 bg-white px-4 py-3 rounded-xl shadow-lg border border-slate-100 flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-green-50 text-green-600 flex items-center justify-center">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-800">Teknik Terverifikasi</p>
                    <p className="text-[11px] text-slate-500">Oleh Pelatih Berlisensi</p>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </div>
    </section>
  );
}
