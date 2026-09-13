'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/Navbar';
import { useAuth } from '@/lib/auth';
import { getCategories, getVideos, getUsers } from '@/lib/data';
import {
  Video,
  Users,
  ArrowRight,
  PlusCircle,
  HelpCircle,
} from 'lucide-react';

export default function AdminDashboard() {
  const { isAdmin, isReady, isLoggedIn, user } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState({ categories: 0, videos: 0, users: 0 });

  useEffect(() => {
    if (isReady && (!isLoggedIn || !isAdmin)) {
      router.push('/login');
      return;
    }
    setStats({
      categories: getCategories().length,
      videos: getVideos().length,
      users: getUsers().length,
    });
  }, [isReady, isLoggedIn, isAdmin, router]);

  if (!isReady || !isAdmin) return null;

  return (
    <div className="min-h-screen bg-[#0f172a] text-white">
      <Navbar />

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Header Ramah & Jelas */}
        <div className="bg-[#1e293b] border border-[#334155] rounded-2xl p-6 sm:p-8 mb-8 shadow-md">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="inline-block px-3 py-1 rounded-md bg-blue-600/30 text-blue-300 border border-blue-500/40 text-xs font-bold uppercase tracking-wider mb-2">
                Panel Pengelola GLS
              </span>
              <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                Selamat Datang, {user?.name || 'Bapak Pengelola'}
              </h1>
              <p className="text-sm sm:text-base text-slate-300 mt-1">
                Silakan pilih menu di bawah untuk menambah video latihan atau mengelola akun pengguna.
              </p>
            </div>

            <Link
              href="/"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#334155] hover:bg-[#475569] text-white text-sm font-semibold transition-colors shrink-0 self-start sm:self-auto border border-[#475569]"
            >
              <span>Lihat Tampilan Depan Web</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* ── HANYA DUA MENU UTAMA (Video & Pengguna) ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* KARTU 1: KELOLA VIDEO (Termasuk Kategori di dalamnya) */}
          <div className="bg-[#1e293b] border border-[#334155] hover:border-blue-500/70 rounded-2xl p-6 sm:p-7 flex flex-col justify-between transition-all shadow-md">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-14 h-14 rounded-2xl bg-blue-600 flex items-center justify-center text-white shadow-md">
                  <Video className="w-7 h-7" />
                </div>
                <div className="text-right">
                  <span className="text-4xl font-black text-white block">{stats.videos}</span>
                  <span className="text-xs text-slate-400 font-medium">Total Video Materi</span>
                </div>
              </div>

              <h2 className="text-xl font-extrabold text-white mb-2">
                1. Video Materi Latihan
              </h2>
              <p className="text-sm text-slate-300 leading-relaxed mb-4">
                Upload video dari Google Drive, atur nomor alat senam (Lantai, Balok, dll), tentukan level latihan, dan atur video gratis atau terkunci.
              </p>

              <div className="p-3 rounded-xl bg-[#0f172a] border border-[#334155] text-xs text-slate-300 mb-6 space-y-1">
                <p className="font-semibold text-blue-400">• Termasuk {stats.categories} Nomor Alat / Kategori</p>
                <p className="text-slate-400">• Tambah nomor alat baru bisa langsung di formulir video</p>
              </div>
            </div>

            <div className="space-y-2.5 pt-4 border-t border-[#334155]">
              <Link
                href="/admin/videos?action=new"
                className="w-full inline-flex items-center justify-center gap-2.5 px-5 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-[0.99] text-white font-bold text-base transition-colors shadow-md"
              >
                <PlusCircle className="w-5 h-5" />
                <span>+ Tambah Video Baru</span>
              </Link>
              <Link
                href="/admin/videos"
                className="w-full inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[#0f172a] hover:bg-[#162032] text-slate-200 hover:text-white font-semibold text-sm border border-[#334155] transition-colors"
              >
                <span>Lihat & Kelola Semua Video ({stats.videos})</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* KARTU 2: KELOLA PENGGUNA */}
          <div className="bg-[#1e293b] border border-[#334155] hover:border-emerald-500/70 rounded-2xl p-6 sm:p-7 flex flex-col justify-between transition-all shadow-md">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-14 h-14 rounded-2xl bg-emerald-600 flex items-center justify-center text-white shadow-md">
                  <Users className="w-7 h-7" />
                </div>
                <div className="text-right">
                  <span className="text-4xl font-black text-white block">{stats.users}</span>
                  <span className="text-xs text-slate-400 font-medium">Pengguna Terdaftar</span>
                </div>
              </div>

              <h2 className="text-xl font-extrabold text-white mb-2">
                2. Data Pengguna & Hak Akses
              </h2>
              <p className="text-sm text-slate-300 leading-relaxed mb-4">
                Lihat daftar nama pelatih dan atlet yang terdaftar, buat akun baru, atau berikan hak akses pengelola (Admin).
              </p>

              <div className="p-3 rounded-xl bg-[#0f172a] border border-[#334155] text-xs text-slate-300 mb-6 space-y-1">
                <p className="font-semibold text-emerald-400">• Hak Akses: User Biasa vs Admin</p>
                <p className="text-slate-400">• Pengguna biasa hanya bisa nonton setelah login</p>
              </div>
            </div>

            <div className="space-y-2.5 pt-4 border-t border-[#334155]">
              <Link
                href="/admin/users?action=new"
                className="w-full inline-flex items-center justify-center gap-2.5 px-5 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-[0.99] text-white font-bold text-base transition-colors shadow-md"
              >
                <PlusCircle className="w-5 h-5" />
                <span>+ Tambah Pengguna Baru</span>
              </Link>
              <Link
                href="/admin/users"
                className="w-full inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[#0f172a] hover:bg-[#162032] text-slate-200 hover:text-white font-semibold text-sm border border-[#334155] transition-colors"
              >
                <span>Lihat Daftar Pengguna ({stats.users})</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>

        {/* Bantuan Praktis untuk Bapak-bapak */}
        <div className="bg-[#1e293b]/70 border border-[#334155] rounded-xl p-5 flex items-start gap-4 text-slate-300">
          <HelpCircle className="w-6 h-6 text-blue-400 shrink-0 mt-0.5" />
          <div className="text-xs sm:text-sm space-y-1">
            <p className="font-bold text-white">Panduan Singkat Menambah Video:</p>
            <p className="text-slate-300">
              Cukup salin link video dari Google Drive (tombol Bagikan &rarr; Salin Link), lalu tempelkan langsung di formulir Tambah Video. Sistem otomatis membaca video tanpa perlu utak-atik teknis.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
