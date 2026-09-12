'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/Navbar';
import { useAuth } from '@/lib/auth';
import { getCategories, getVideos, getUsers } from '@/lib/data';
import { Layers, Video, Users, ArrowRight, ShieldCheck } from 'lucide-react';

export default function AdminDashboard() {
  const { isAdmin, isReady, isLoggedIn } = useAuth();
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

  const cards = [
    {
      title: 'Kategori Pembelajaran',
      count: stats.categories,
      desc: 'Kelola nomor alat senam',
      icon: Layers,
      href: '/admin/categories',
      color: 'from-blue-600 to-indigo-600',
      shadow: 'shadow-blue-600/20',
    },
    {
      title: 'Video Materi',
      count: stats.videos,
      desc: 'CRUD video Google Drive',
      icon: Video,
      href: '/admin/videos',
      color: 'from-emerald-600 to-teal-600',
      shadow: 'shadow-emerald-600/20',
    },
    {
      title: 'Pengguna Terdaftar',
      count: stats.users,
      desc: 'Manajemen user & role',
      icon: Users,
      href: '/admin/users',
      color: 'from-amber-600 to-orange-600',
      shadow: 'shadow-amber-600/20',
    },
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <Navbar />
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-white">Admin Panel</h1>
            <p className="text-xs text-slate-500">Kelola konten dan pengguna GLS</p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-10">
          {cards.map((card) => {
            const Icon = card.icon;
            return (
              <Link
                key={card.href}
                href={card.href}
                className={`p-6 rounded-2xl bg-[#141414] border border-white/5 hover:border-white/20 transition-all group`}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-11 h-11 rounded-xl bg-gradient-to-tr ${card.color} flex items-center justify-center text-white shadow-lg ${card.shadow}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-600 group-hover:text-white group-hover:translate-x-1 transition-all" />
                </div>
                <p className="text-3xl font-black text-white">{card.count}</p>
                <p className="text-sm font-bold text-slate-300 mt-1">{card.title}</p>
                <p className="text-xs text-slate-500 mt-0.5">{card.desc}</p>
              </Link>
            );
          })}
        </div>

        {/* Quick links */}
        <div className="p-5 rounded-2xl bg-[#141414] border border-white/5">
          <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">Aksi Cepat</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <Link href="/admin/categories" className="px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-sm font-semibold text-slate-300 hover:bg-white/10 hover:text-white transition-colors text-center">
              + Tambah Kategori
            </Link>
            <Link href="/admin/videos" className="px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-sm font-semibold text-slate-300 hover:bg-white/10 hover:text-white transition-colors text-center">
              + Tambah Video
            </Link>
            <Link href="/admin/users" className="px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-sm font-semibold text-slate-300 hover:bg-white/10 hover:text-white transition-colors text-center">
              + Tambah User
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
