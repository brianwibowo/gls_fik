'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, CheckCircle2, Trophy, Sparkles } from 'lucide-react';
import { ScrollReveal } from '../ui/ScrollReveal';

export function CTASection({ onOpenLogin }: { onOpenLogin?: () => void }) {
  return (
    <section className="py-24 bg-gradient-to-br from-slate-950 via-blue-950 to-indigo-950 relative overflow-hidden text-white border-t border-slate-800">
      {/* Radiant Background Accents */}
      <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-[500px] h-[500px] bg-indigo-500/15 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative text-center">
        <ScrollReveal direction="up">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 text-blue-200 text-xs font-semibold uppercase tracking-wider mb-6 backdrop-blur-md">
            <Trophy className="w-3.5 h-3.5 text-amber-400" />
            <span>Mulai Pembelajaran Terarah</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight max-w-3xl mx-auto">
            Tingkatkan Kualitas Pembelajaran Senam Artistik Bersama GLS
          </h2>

          <p className="mt-6 text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Platform modern untuk pelatih menyusun kurikulum berjenjang, atlet berlatih dengan video teknik teruji,
            dan orang tua memantau perkembangan anak secara transparan.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/login"
              target="_blank"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 rounded-xl bg-white text-slate-950 text-base font-extrabold hover:bg-blue-50 active:scale-[0.98] transition-all shadow-xl shadow-blue-950/50 group"
            >
              <span>Masuk ke Platform GLS</span>
              <ArrowRight className="w-5 h-5 text-blue-600 group-hover:translate-x-1 transition-transform" />
            </Link>

            <a
              href="#alat"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-7 py-4 rounded-xl bg-white/10 hover:bg-white/15 text-white text-base font-bold border border-white/20 backdrop-blur-md active:scale-[0.98] transition-all"
            >
              <span>Eksplorasi Modul Alat</span>
            </a>
          </div>

          {/* Quick checklist */}
          <div className="mt-12 pt-8 border-t border-white/10 flex flex-wrap items-center justify-center gap-y-3 gap-x-8 text-xs sm:text-sm text-slate-300">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Bebas dari file tercecer di chat</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Akses video latihan mandiri 24/7</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Dukungan penuh tim pelatih FIK</span>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
