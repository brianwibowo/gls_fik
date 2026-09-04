'use client';

import React from 'react';
import Link from 'next/link';
import { Activity, ShieldCheck, Heart, Sparkles } from 'lucide-react';

export function Footer({ onOpenLogin }: { onOpenLogin?: () => void }) {
  const apparatusList = [
    'Floor Exercise (Lantai)',
    'Balance Beam (Balok)',
    'Vault (Meja Lompat)',
    'Uneven Bars (Palang Bertingkat)',
    'Still Rings (Gelang-Gelang)',
    'Pommel Horse (Kuda Pelana)',
  ];

  return (
    <footer className="bg-slate-950 text-slate-400 py-16 border-t border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
          {/* Col 1: Brand & Description */}
          <div className="md:col-span-5 flex flex-col items-start">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
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
              Platform pembelajaran digital senam berbasis web (Educational Learning Hub) yang membantu pelatih menyusun kurikulum berjenjang dan memudahkan atlet mempelajari teknik senam secara terarah.
            </p>

            <div className="mt-6 flex items-center gap-2 text-xs text-slate-400 bg-slate-900 px-3.5 py-2 rounded-xl border border-slate-800">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
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
                  Tentang Platform
                </a>
              </li>
              <li>
                <a href="#fitur" className="hover:text-white transition-colors">
                  Fitur Unggulan
                </a>
              </li>
              <li>
                <a href="#alat" className="hover:text-white transition-colors">
                  Perpustakaan Gerakan Alat
                </a>
              </li>
              <li>
                <a href="#preview" className="hover:text-white transition-colors">
                  Preview Sistem
                </a>
              </li>
              <li>
                <a href="#testimoni" className="hover:text-white transition-colors">
                  Testimoni Pelatih &amp; Atlet
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
                  Portal Masuk Akun
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Kategori Nomor Alat Senam */}
          <div className="md:col-span-4">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">
              Nomor Alat Senam Artistik
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              {apparatusList.map((app, idx) => (
                <span
                  key={idx}
                  className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:border-slate-700 transition-colors"
                >
                  {app}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="mt-12 pt-8 border-t border-slate-800 text-center flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} Gymnastics Learning System (GLS). Hak Cipta Dilindungi.</p>
          <p className="flex items-center gap-1.5">
            <span>Didesain untuk kemajuan ekosistem senam Indonesia</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
          </p>
        </div>
      </div>
    </footer>
  );
}
