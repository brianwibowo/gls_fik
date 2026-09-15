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
  ChevronLeft,
  ChevronRight,
  Shield,
  AlertTriangle,
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
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  useEffect(() => {
    if (isReady && (!isLoggedIn || !isAdmin)) {
      router.push('/login?redirect=/admin');
    }
  }, [isReady, isLoggedIn, isAdmin, router]);

  // Keyboard accessibility: dismiss logout modal on Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && showLogoutConfirm) {
        setShowLogoutConfirm(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showLogoutConfirm]);

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
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 flex flex-col md:flex-row">
      {/* Desktop sidebar */}
      <aside
        className={`hidden md:flex flex-col justify-between bg-white border-r border-slate-200 shrink-0 sticky top-0 h-screen transition-all duration-300 z-30 shadow-sm ${
          isCollapsed ? 'w-20 px-3 py-5' : 'w-64 p-5'
        }`}
      >
        <div>
          {/* Top Logo Brand + Collapse Toggle */}
          <div className="flex items-center justify-between pb-5 border-b border-slate-100">
            <Link
              href="/admin"
              className={`flex items-center gap-3 overflow-hidden ${isCollapsed ? 'justify-center w-full' : ''}`}
              title="GLS FIK Admin"
            >
              <div className="w-10 h-10 rounded-xl bg-[#c1ff72] flex items-center justify-center text-[#1f2a2e] font-black text-base shadow-sm shrink-0">
                <Activity className="w-5 h-5 stroke-[2.5]" />
              </div>
              {!isCollapsed && (
                <div className="min-w-0">
                  <span className="text-base font-black text-slate-900 tracking-tight block leading-tight">
                    GLS FIK
                  </span>
                  <span className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider">
                    Admin Panel
                  </span>
                </div>
              )}
            </Link>

            {!isCollapsed && (
              <button
                type="button"
                onClick={() => setIsCollapsed(true)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
                title="Kecilkan Sidebar (Collapse)"
                aria-label="Kecilkan Sidebar"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
            )}
          </div>

          {/* Expand Button when Collapsed */}
          {isCollapsed && (
            <div className="pt-3 flex justify-center">
              <button
                type="button"
                onClick={() => setIsCollapsed(false)}
                className="p-2 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
                title="Perlebar Sidebar (Expand)"
                aria-label="Perlebar Sidebar"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          )}

          {/* Navigation Menu */}
          <div className="mt-6 space-y-1.5">
            {!isCollapsed && (
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-3 mb-2">
                Menu Pengelola
              </p>
            )}
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  title={item.name}
                  className={`flex items-center gap-3 py-3 rounded-xl text-sm font-bold transition-all ${
                    isCollapsed ? 'justify-center px-0' : 'px-3.5'
                  } ${
                    item.isActive
                      ? 'bg-[#c1ff72] text-[#1f2a2e] shadow-sm font-black border border-[#a8ed4b]'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  <Icon className={`w-5 h-5 shrink-0 ${item.isActive ? 'text-[#1f2a2e]' : 'text-slate-500'}`} />
                  {!isCollapsed && <span>{item.name}</span>}
                </Link>
              );
            })}
          </div>
        </div>

        {/* Sidebar Bottom Profile & Controls */}
        <div className="pt-5 border-t border-slate-100 space-y-3">
          {/* User Profile Info */}
          <div className={`flex items-center gap-3 ${isCollapsed ? 'justify-center' : 'px-2'}`}>
            <div
              className="w-9 h-9 rounded-xl bg-slate-900 flex items-center justify-center font-black text-xs text-[#c1ff72] shrink-0 shadow-sm"
              title={user?.name}
            >
              {user?.name.charAt(0).toUpperCase()}
            </div>
            {!isCollapsed && (
              <div className="min-w-0">
                <p className="text-xs sm:text-sm font-bold text-slate-900 truncate">{user?.name}</p>
                <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-600">
                  <Shield className="w-3 h-3" />
                  <span>Admin Pengelola</span>
                </span>
              </div>
            )}
          </div>

          {/* External Link to Website */}
          <Link
            href="/"
            target="_blank"
            className={`flex items-center rounded-lg text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors ${
              isCollapsed ? 'justify-center p-2.5' : 'justify-between px-3 py-2'
            }`}
            title="Buka Website Utama (Tab Baru)"
          >
            {!isCollapsed && <span>Lihat Web Utama</span>}
            <ExternalLink className="w-4 h-4 text-slate-400 shrink-0" />
          </Link>

          {/* Logout Button */}
          <button
            type="button"
            onClick={() => setShowLogoutConfirm(true)}
            className={`w-full flex items-center rounded-lg text-xs font-bold text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors cursor-pointer ${
              isCollapsed ? 'justify-center p-2.5' : 'gap-2 px-3 py-2'
            }`}
            title="Keluar Akun (Logout)"
          >
            <LogOut className="w-4 h-4 shrink-0" />
            {!isCollapsed && <span>Keluar Akun</span>}
          </button>
        </div>
      </aside>

      {/* Mobile top navigation */}
      <div className="md:hidden bg-white border-b border-slate-200 px-4 py-3 flex items-center justify-between sticky top-0 z-40 shadow-sm">
        <Link href="/admin" className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-[#c1ff72] flex items-center justify-center text-[#1f2a2e] font-black shadow-sm">
            <Activity className="w-4 h-4 stroke-[2.5]" />
          </div>
          <div>
            <span className="font-black text-slate-900 text-base leading-none block">GLS FIK</span>
            <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider">Admin Panel</span>
          </div>
        </Link>

        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="w-11 h-11 min-w-[44px] min-h-[44px] rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 active:scale-95 flex items-center justify-center cursor-pointer transition-all border border-slate-200"
          aria-label={mobileOpen ? 'Tutup Menu Admin' : 'Buka Menu Admin'}
          aria-expanded={mobileOpen}
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Drawer with spacious touch targets */}
      {mobileOpen && (
        <div className="md:hidden bg-white border-b border-slate-200 p-4 space-y-2 shadow-lg animate-in fade-in duration-150">
          {navItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className={`min-h-[44px] flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                item.isActive
                  ? 'bg-[#c1ff72] text-[#1f2a2e] font-black border border-[#a8ed4b] shadow-sm'
                  : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              <item.icon className="w-5 h-5 shrink-0" />
              <span>{item.name}</span>
            </Link>
          ))}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs px-1">
            <Link href="/" target="_blank" className="min-h-[40px] px-2 py-1 text-slate-600 font-semibold flex items-center gap-1.5 hover:text-slate-900">
              <span>Web Utama</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
            <button
              type="button"
              onClick={() => {
                setMobileOpen(false);
                setShowLogoutConfirm(true);
              }}
              className="min-h-[40px] px-3 py-1 text-red-600 font-bold hover:bg-red-50 rounded-lg cursor-pointer transition-colors"
            >
              Keluar Akun
            </button>
          </div>
        </div>
      )}

      {/* Main content area */}
      <div className="flex-1 flex flex-col min-w-0 bg-[#f8fafc] text-slate-900 overflow-x-hidden">
        {children}
      </div>

      {/* Pop-up Peringatan Konfirmasi Keluar Akun */}
      {showLogoutConfirm && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="logout-confirm-title"
          aria-describedby="logout-confirm-desc"
          className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-in fade-in duration-150"
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowLogoutConfirm(false);
          }}
        >
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 border border-slate-200 shadow-2xl animate-in zoom-in-95 text-left">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 border border-amber-200 text-amber-800 flex items-center justify-center mb-4 shadow-xs">
              <AlertTriangle className="w-6 h-6 stroke-[2.5]" />
            </div>

            <h3 id="logout-confirm-title" className="text-base font-black text-slate-900 leading-tight">
              Konfirmasi Keluar Akun
            </h3>

            <p id="logout-confirm-desc" className="text-xs text-slate-600 mt-2 leading-relaxed">
              Apakah Anda yakin ingin keluar dari sesi Admin GLS FIK? Pastikan semua perubahan data materi atau pengguna telah disimpan sebelum keluar.
            </p>

            <div className="flex items-center justify-end gap-2.5 mt-6 pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setShowLogoutConfirm(false)}
                className="min-h-[40px] px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 active:scale-95 text-slate-700 font-bold text-xs cursor-pointer transition-all"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowLogoutConfirm(false);
                  logout();
                  router.push('/login');
                }}
                className="min-h-[40px] inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 active:scale-95 text-white font-bold text-xs cursor-pointer shadow-sm transition-all"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Ya, Keluar Akun</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
