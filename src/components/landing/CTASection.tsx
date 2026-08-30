'use client';

import React from 'react';
import { ArrowRight, CheckCircle2, Trophy } from 'lucide-react';
import { ScrollReveal } from '../ui/ScrollReveal';

export function CTASection({ onOpenLogin }: { onOpenLogin: () => void }) {
  return (
    <section className="py-20 bg-blue-600 relative overflow-hidden text-white">
      {/* Decorative background circles */}
      <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/3 w-96 h-96 bg-blue-500/40 rounded-full blur-2xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/3 w-96 h-96 bg-blue-700/60 rounded-full blur-2xl pointer-events-none" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative text-center">
        <ScrollReveal direction="up">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/40 border border-blue-400/40 text-blue-100 text-xs font-bold uppercase tracking-wider mb-6">
            <Trophy className="w-3.5 h-3.5" />
            <span>Mulai Pembelajaran Terarah</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight">
            Tingkatkan Kualitas Pembelajaran Senam Bersama GLS
          </h2>

          <p className="mt-5 text-base sm:text-lg text-blue-100 max-w-2xl mx-auto leading-relaxed">
            Platform praktis untuk pelatih menyusun kurikulum senam, atlet berlatih dengan video teknik teruji, dan orang tua memantau tumbuh kembang anak secara transparan.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={onOpenLogin}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 rounded-xl bg-white text-blue-600 text-base font-extrabold hover:bg-blue-50 active:scale-[0.98] transition-all shadow-lg shadow-blue-900/20"
            >
              <span>Masuk ke Platform GLS</span>
              <ArrowRight className="w-5 h-5" />
            </button>

            <a
              href="#fitur"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-4 rounded-xl bg-blue-700/60 text-white text-base font-bold hover:bg-blue-700 border border-blue-400/40 transition-all"
            >
              <span>Pelajari Fitur</span>
            </a>
          </div>

          {/* Quick checklist */}
          <div className="mt-10 pt-8 border-t border-blue-500/60 flex flex-wrap items-center justify-center gap-6 text-xs sm:text-sm text-blue-100">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-green-300" />
              <span>Bebas ribet kirim file WhatsApp</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-green-300" />
              <span>Akses video latihan 24/7</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-green-300" />
              <span>Dukungan Pelatih &amp; Klub Senam</span>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
