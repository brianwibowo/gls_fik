'use client';

import React from 'react';
import Link from 'next/link';
import { Activity, ShieldCheck, Heart } from 'lucide-react';

export function Footer({ onOpenLogin }: { onOpenLogin?: () => void }) {
  return (
    <footer className="bg-slate-900 text-slate-400 py-16 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
          {/* Col 1: Brand & Description */}
          <div className="md:col-span-5 flex flex-col items-start">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-sm">
                <Activity className="w-5 h-5 stroke-[2.5]" />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-extrabold tracking-tight text-white leading-tight">
                  GLS<span className="text-blue-500">.</span>
                </span>
                <span className="text-[10px] font-semibold text-slate-400 tracking-wider uppercase">
                  Gymnastics Learning System
                </span>
              </div>
            </Link>

            <p className="mt-4 text-xs sm:text-sm text-slate-400 leading-relaxed max-w-sm">
              Platform pembelajaran digital senam berbasis web (Learning Hub) yang membantu pelatih menyusun kurikulum dan memudahkan atlet mempelajari teknik senam secara terarah.
            </p>

            <div className="mt-6 flex items-center gap-2 text-xs text-slate-500">
              <ShieldCheck className="w-4 h-4 text-green-400" />
              <span>Versi 2.0 — UX First Education Architecture</span>
            </div>
          </div>

          {/* Col 2: Navigasi */}
          <div className="md:col-span-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">
              Navigasi Halaman
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm">
              <li>
                <a href="#tentang" className="hover:text-white transition-colors">
                  Tentang GLS
                </a>
              </li>
              <li>
                <a href="#fitur" className="hover:text-white transition-colors">
                  Fitur Unggulan
                </a>
              </li>
              <li>
                <a href="#preview" className="hover:text-white transition-colors">
                  Preview Dashboard
                </a>
              </li>
              <li>
                <a href="#faq" className="hover:text-white transition-colors">
                  Pertanyaan Umum (FAQ)
                </a>
              </li>
              <li>
                <Link
                  href="/login"
                  target="_blank"
                  className="text-blue-400 hover:text-blue-300 font-semibold transition-colors"
                >
                  Masuk ke Akun
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Kategori Nomor Alat Senam */}
          <div className="md:col-span-4">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">
              Nomor Alat Senam
            </h4>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <span className="p-2 rounded-lg bg-slate-800/80 border border-slate-700/50 text-slate-300">
                Floor Exercise (Lantai)
              </span>
              <span className="p-2 rounded-lg bg-slate-800/80 border border-slate-700/50 text-slate-300">
                Balance Beam (Balok)
              </span>
              <span className="p-2 rounded-lg bg-slate-800/80 border border-slate-700/50 text-slate-300">
                Vault (Meja Lompat)
              </span>
              <span className="p-2 rounded-lg bg-slate-800/80 border border-slate-700/50 text-slate-300">
                Uneven &amp; Parallel Bars
              </span>
              <span className="p-2 rounded-lg bg-slate-800/80 border border-slate-700/50 text-slate-300">
                Still Rings (Gelang-Gelang)
              </span>
              <span className="p-2 rounded-lg bg-slate-800/80 border border-slate-700/50 text-slate-300">
                Pommel Horse (Kuda-Kuda)
              </span>
            </div>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="mt-12 pt-8 border-t border-slate-800 text-center flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} Gymnastics Learning System (GLS). Hak Cipta Dilindungi.</p>
          <p className="flex items-center gap-1.5">
            <span>Didesain untuk ekosistem senam Indonesia</span>
            <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500" />
          </p>
        </div>
      </div>
    </footer>
  );
}
