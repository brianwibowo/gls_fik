'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, LogIn } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth';

export function CTABanner() {
  const { isLoggedIn } = useAuth();

  return (
    <section className="py-20 bg-[#1F2A2E] relative overflow-hidden text-white">
      {/* Ambient glow effects */}
      <div className="absolute top-0 left-1/3 w-[600px] h-[400px] bg-[radial-gradient(circle,rgba(193,255,114,0.15)_0%,transparent_65%)] pointer-events-none blur-3xl -z-0" />
      <div className="absolute bottom-0 right-1/4 w-[400px] h-[300px] bg-[radial-gradient(circle,rgba(193,255,114,0.08)_0%,transparent_70%)] pointer-events-none blur-3xl -z-0" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="space-y-6"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/15 text-[#C1FF72] text-xs font-bold">
            <span className="w-1.5 h-1.5 rounded-full bg-[#C1FF72] animate-pulse" />
            Platform Aktif &amp; Siap Digunakan
          </div>

          <h2 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
            Siap Mempelajari{' '}
            <span className="text-[#C1FF72]">Teknik Senam Artistik?</span>
          </h2>

          <p className="text-sm sm:text-base text-slate-300 max-w-xl mx-auto leading-relaxed">
            Akses koleksi video peragaan gerak dari 6 kategori alat MAG. Mulai
            dari video gratis, atau login untuk membuka seluruh materi
            pembelajaran.
          </p>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2"
          >
            <a
              href="#katalog-video"
              className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full bg-[#C1FF72] hover:bg-[#b0f555] text-[#1F2A2E] font-black text-sm transition-all min-h-[48px] shadow-lg hover:shadow-xl hover:scale-[1.03] active:scale-95 border border-[#a8ed4b]"
            >
              <span>Jelajahi Katalog Video</span>
              <ArrowRight className="w-4 h-4 stroke-[2.5]" />
            </a>

            {!isLoggedIn && (
              <Link
                href="/login"
                className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-white font-bold text-sm transition-all min-h-[48px] hover:scale-[1.02] active:scale-95"
              >
                <LogIn className="w-4 h-4" />
                <span>Masuk ke Akun</span>
              </Link>
            )}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
