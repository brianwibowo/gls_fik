'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth';
import {
  Video,
  Users,
  LogOut,
  ExternalLink,
  Menu,
  X,
  Activity,
  ShieldCheck,
} from 'lucide-react';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isLoggedIn, isAdmin, isReady, logout } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    if (isReady && (!isLoggedIn || !isAdmin)) {
      router.push('/login');
    }
  }, [isReady, isLoggedIn, isAdmin, router]);

  if (!isReady) return null;
  if (!isLoggedIn || !isAdmin) return null;

  const navItems = [
    {
      name: 'Video Materi',
      href: '/admin',
      icon: Video,
      isActive: pathname === '/admin' || pathname.startsWith('/admin/videos') || pathname.startsWith('/admin/categories'),
    },
    {
      name: 'Data Pengguna',
      href: '/admin/users',
      icon: Users,
      isActive: pathname.startsWith('/admin/users'),
    },
  ];

  return (
    <div className="min-h-screen bg-[#0b0f19] text-white flex flex-col md:flex-row">
      {/* ── SIDEBAR DESKTOP ── */}
      <aside className="hidden md:flex md:w-64 flex-col justify-between bg-[#111827] border-r border-[#1f2937] shrink-0 sticky top-0 h-screen p-5">
        <div>
          {/* Logo Brand */}
          <Link href="/admin" className="flex items-center gap-3 pb-6 border-b border-[#1f2937]">
            <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white font-black text-base shadow-sm">
              <Activity className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <span className="text-base font-black text-white tracking-tight block leading-none">
                GLS FIK
              </span>
              <span className="text-[11px] font-bold text-blue-400 uppercase tracking-wider">
                Admin Panel
              </span>
            </div>
          </Link>

          {/* Navigation Menu (HANYA DUA MENU) */}
          <div className="mt-6 space-y-1.5">
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-3 mb-2">
              Menu Pengelola
            </p>
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center gap-3 px-3.5 py-3 rounded-xl text-sm font-bold transition-colors ${
                    item.isActive
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'text-slate-300 hover:bg-[#1f2937] hover:text-white'
                  }`}
                >
                  <Icon className={`w-5 h-5 ${item.isActive ? 'text-white' : 'text-slate-400'}`} />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Sidebar Bottom Footer */}
        <div className="pt-5 border-t border-[#1f2937] space-y-3">
          {/* User Profile */}
          <div className="flex items-center gap-3 px-2">
            <div className="w-8 h-8 rounded-lg bg-blue-700 flex items-center justify-center font-bold text-xs text-white shrink-0">
              {user?.name.charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-bold text-white truncate">{user?.name}</p>
              <span className="inline-block text-[10px] font-semibold text-emerald-400">
                ● Administrator
              </span>
            </div>
          </div>

          <Link
            href="/"
            target="_blank"
            className="flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold text-slate-400 hover:text-white hover:bg-[#1f2937] transition-colors"
          >
            <span>Buka Website Utama</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>

          <button
            onClick={() => logout()}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-bold text-red-400 hover:bg-red-950/40 hover:text-red-300 transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>Keluar Akun (Logout)</span>
          </button>
        </div>
      </aside>

      {/* ── MOBILE NAVBAR ── */}
      <div className="md:hidden bg-[#111827] border-b border-[#1f2937] p-4 flex items-center justify-between sticky top-0 z-40">
        <Link href="/admin" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-black">
            <Activity className="w-4 h-4" />
          </div>
          <span className="font-black text-white text-base">GLS Admin</span>
        </Link>

        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="p-2 rounded-lg bg-[#1f2937] text-white cursor-pointer"
          aria-label="Menu"
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="md:hidden bg-[#111827] border-b border-[#1f2937] p-4 space-y-2">
          {navItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-bold ${
                item.isActive ? 'bg-blue-600 text-white' : 'text-slate-300 hover:bg-[#1f2937]'
              }`}
            >
              <item.icon className="w-4 h-4" />
              <span>{item.name}</span>
            </Link>
          ))}
          <div className="pt-2 border-t border-[#1f2937] flex items-center justify-between text-xs">
            <Link href="/" className="text-slate-400">
              Lihat Web Utama &rarr;
            </Link>
            <button onClick={() => logout()} className="text-red-400 font-bold">
              Keluar
            </button>
          </div>
        </div>
      )}

      {/* ── MAIN CONTENT AREA ── */}
      <div className="flex-1 flex flex-col min-w-0 bg-[#0b0f19]">
        {children}
      </div>
    </div>
  );
}
