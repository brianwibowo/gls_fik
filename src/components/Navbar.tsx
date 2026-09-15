'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/lib/auth';
import { getCategories, getFirstVideoByCategory } from '@/lib/data';
import { APPARATUS_DATA } from '@/components/landing/ApparatusSection';
import {
  Activity,
  LogOut,
  ChevronDown,
  Shield,
  Menu,
  X,
} from 'lucide-react';

const PRIMARY_IDS = ['cat-fx', 'cat-ph', 'cat-vt'];

export function Navbar() {
  const pathname = usePathname();
  const isHome = pathname === '/';
  const { user, isLoggedIn, isAdmin, logout, isReady } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const moreRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isHome) return;
    const handleScroll = () => setScrolled(window.scrollY > 30);
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isHome]);

  // Close dropdowns on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (moreRef.current && !moreRef.current.contains(e.target as Node)) setMoreOpen(false);
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) setProfileOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // Build primary category links with first video URL
  const primaryLinks = useMemo(() => {
    const items = [
      { id: 'cat-fx', label: 'Senam Lantai' },
      { id: 'cat-ph', label: 'Kuda-Kuda Pelana' },
      { id: 'cat-vt', label: 'Meja Lompat' },
    ];
    return items.map((item) => {
      const firstVid = getFirstVideoByCategory(item.id);
      return {
        ...item,
        href: firstVid ? `/watch/${firstVid.id}` : `/#katalog-video`,
      };
    });
  }, []);

  // Build dynamic "Lainnya" items from DB categories NOT in the 3 primary
  const extraCategories = useMemo(() => {
    const dbCats = getCategories();
    const apparatusMap = new Map(APPARATUS_DATA.map((a) => [a.id, a]));
    return dbCats
      .filter((c) => !PRIMARY_IDS.includes(c.id))
      .map((c) => {
        const firstVid = getFirstVideoByCategory(c.id);
        return {
          id: c.id,
          label: apparatusMap.get(c.id)?.name?.split('(')[0]?.trim() || c.name,
          href: firstVid ? `/watch/${firstVid.id}` : `/#katalog-video`,
        };
      });
  }, []);

  const isSolid = !isHome || scrolled || menuOpen;

  const headerClass = isHome
    ? `fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isSolid
          ? 'bg-[#c1ff72]/95 backdrop-blur-md border-b border-[#a8ed4b] shadow-xl py-0 text-[#1f2a2e]'
          : 'bg-transparent border-b border-transparent py-2 text-white'
      }`
    : 'sticky top-0 z-50 bg-[#c1ff72] border-b border-[#a8ed4b] shadow-md text-[#1f2a2e]';

  const linkClass = (active?: boolean) =>
    `text-sm font-bold transition-colors relative ${
      active
        ? isSolid
          ? 'text-[#1f2a2e]'
          : 'text-white'
        : isSolid
          ? 'text-[#1f2a2e]/80 hover:text-[#1f2a2e]'
          : 'text-slate-300 hover:text-white'
    }`;

  return (
    <header className={headerClass}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand */}
          <Link href="/" className="flex items-center gap-2.5 sm:gap-3">
            <div
              className={`w-8 h-8 rounded-xl flex items-center justify-center font-black text-sm transition-all shadow-xs ${
                isSolid
                  ? 'bg-[#1f2a2e] text-[#c1ff72] border border-[#1f2a2e]'
                  : 'bg-[#c1ff72] text-[#1f2a2e] shadow-md'
              }`}
            >
              <Activity className="w-4 h-4 stroke-[2.5]" />
            </div>
            <div className="flex flex-col">
              <span
                className={`text-base font-black tracking-tight leading-tight transition-colors ${
                  isSolid ? 'text-[#1f2a2e]' : 'text-white drop-shadow-xs'
                }`}
              >
                GLS FIK
              </span>
              <span
                className={`text-[10px] font-bold transition-colors ${
                  isSolid ? 'text-[#1f2a2e]/70' : 'text-slate-300'
                }`}
              >
                Gymnastics Learning System
              </span>
            </div>
          </Link>

          {/* Desktop nav */}
          <div className="hidden lg:flex items-center gap-5">
            <Link href="/" className={linkClass(isHome)}>
              Beranda
            </Link>

            {primaryLinks.map((item) => (
              <Link key={item.id} href={item.href} className={linkClass()}>
                {item.label}
              </Link>
            ))}

            {/* Dynamic "Lainnya" dropdown */}
            {extraCategories.length > 0 && (
              <div className="relative" ref={moreRef}>
                <button
                  type="button"
                  onClick={() => setMoreOpen(!moreOpen)}
                  className={`flex items-center gap-1 text-sm font-bold transition-colors cursor-pointer ${
                    isSolid
                      ? 'text-[#1f2a2e]/80 hover:text-[#1f2a2e]'
                      : 'text-slate-300 hover:text-white'
                  }`}
                >
                  <span>Lainnya</span>
                  <ChevronDown
                    className={`w-3.5 h-3.5 transition-transform ${moreOpen ? 'rotate-180' : ''}`}
                  />
                </button>

                {moreOpen && (
                  <div className="absolute top-full left-0 mt-2 w-56 bg-white border border-slate-200 rounded-xl shadow-2xl overflow-hidden z-50">
                    {extraCategories.map((item) => (
                      <Link
                        key={item.id}
                        href={item.href}
                        onClick={() => setMoreOpen(false)}
                        className="block px-4 py-3 text-sm font-bold text-slate-700 hover:bg-[#c1ff72]/20 hover:text-[#1f2a2e] transition-colors border-b border-slate-100 last:border-b-0"
                      >
                        {item.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Admin link */}
            {isLoggedIn && isAdmin && (
              <Link
                href="/admin"
                target="_blank"
                rel="noopener noreferrer"
                className={`text-xs font-black flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-colors shadow-xs ${
                  isSolid
                    ? 'text-white bg-[#1f2a2e] hover:bg-black'
                    : 'text-white bg-white/15 hover:bg-white/25 border border-white/20 backdrop-blur-md'
                }`}
              >
                <Shield className="w-3.5 h-3.5 text-[#c1ff72]" />
                <span>Masuk Admin</span>
              </Link>
            )}

            {/* Auth area */}
            {isReady && (
              <>
                {isLoggedIn ? (
                  <div className="relative" ref={profileRef}>
                    <button
                      type="button"
                      onClick={() => setProfileOpen(!profileOpen)}
                      className={`flex items-center gap-2 px-2.5 py-1.5 rounded-xl transition-colors cursor-pointer ${
                        isSolid
                          ? 'bg-[#1f2a2e] text-white hover:bg-black border border-[#1f2a2e]'
                          : 'bg-black/40 text-white hover:bg-black/60 border border-white/20 backdrop-blur-md'
                      }`}
                    >
                      <div className="w-7 h-7 rounded-lg bg-white/20 text-[#c1ff72] flex items-center justify-center font-black text-xs">
                        {user?.name.charAt(0).toUpperCase()}
                      </div>
                      <span className="text-xs font-bold hidden xl:inline">
                        {user?.name}
                      </span>
                      <ChevronDown
                        className={`w-3.5 h-3.5 text-slate-300 transition-transform ${profileOpen ? 'rotate-180' : ''}`}
                      />
                    </button>

                    {profileOpen && (
                      <div className="absolute right-0 mt-2 w-52 bg-white border border-slate-200 rounded-xl shadow-2xl overflow-hidden z-50">
                        <div className="px-4 py-3 border-b border-slate-100">
                          <p className="text-sm font-bold text-slate-900">{user?.name}</p>
                          <p className="text-xs text-slate-500 truncate">{user?.email}</p>
                          <span className="inline-block mt-1.5 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-[#c1ff72]/20 text-[#1f2a2e] border border-[#c1ff72]/40">
                            {user?.role}
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            logout();
                            setProfileOpen(false);
                          }}
                          className="w-full px-4 py-2.5 text-left text-sm text-red-600 hover:bg-red-50 transition-colors flex items-center gap-2 cursor-pointer font-bold"
                        >
                          <LogOut className="w-4 h-4" />
                          <span>Keluar Akun</span>
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <Link
                    href="/login?redirect=/admin"
                    className={`inline-flex items-center gap-2 px-4 py-2 min-h-[38px] rounded-xl text-xs sm:text-sm font-black transition-all shadow-sm active:scale-95 ${
                      isSolid
                        ? 'bg-[#1f2a2e] text-white hover:bg-black'
                        : 'bg-[#c1ff72] text-[#1f2a2e] hover:bg-[#b0f555] shadow-lg'
                    }`}
                  >
                    <Shield className="w-4 h-4 stroke-[2.5]" />
                    <span>Login Admin</span>
                  </Link>
                )}
              </>
            )}
          </div>

          {/* Mobile/Tablet controls */}
          <div className="flex lg:hidden items-center gap-2">
            {isReady && !isLoggedIn && (
              <Link
                href="/login?redirect=/admin"
                className={`min-h-[40px] px-3 py-2 rounded-xl font-black text-xs flex items-center gap-1.5 active:scale-95 transition-all shadow-sm ${
                  isSolid
                    ? 'bg-[#1f2a2e] text-white hover:bg-black'
                    : 'bg-[#c1ff72] text-[#1f2a2e] hover:bg-[#b0f555]'
                }`}
              >
                <Shield className="w-3.5 h-3.5" />
                <span>Login Admin</span>
              </Link>
            )}
            <button
              type="button"
              onClick={() => setMenuOpen(!menuOpen)}
              className={`w-11 h-11 min-w-[44px] min-h-[44px] rounded-xl active:scale-95 flex items-center justify-center transition-all cursor-pointer ${
                isSolid
                  ? 'text-[#1f2a2e] hover:bg-black/10 border border-[#1f2a2e]/20'
                  : 'text-white hover:bg-white/15 border border-white/25 bg-black/30 backdrop-blur-xs'
              }`}
              aria-label={menuOpen ? 'Tutup Menu Navigasi' : 'Buka Menu Navigasi'}
              aria-expanded={menuOpen}
            >
              {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile drawer */}
      {menuOpen && (
        <div className="lg:hidden bg-[#c1ff72] border-t border-[#a8ed4b] px-4 py-4 space-y-1 shadow-2xl animate-in fade-in duration-150">
          <Link
            href="/"
            onClick={() => setMenuOpen(false)}
            className="min-h-[44px] px-3.5 py-2.5 rounded-xl text-sm font-black text-[#1f2a2e] hover:bg-black/10 flex items-center transition-colors"
          >
            Beranda
          </Link>
          {primaryLinks.map((item) => (
            <Link
              key={item.id}
              href={item.href}
              onClick={() => setMenuOpen(false)}
              className="min-h-[44px] px-3.5 py-2.5 rounded-xl text-sm font-black text-[#1f2a2e] hover:bg-black/10 flex items-center transition-colors"
            >
              {item.label}
            </Link>
          ))}

          {/* Extra categories inline on mobile */}
          {extraCategories.length > 0 && (
            <div className="pt-2 border-t border-black/10 space-y-1">
              <p className="px-3.5 pt-1 pb-0.5 text-[11px] font-bold text-[#1f2a2e]/60 uppercase tracking-wider">
                Alat Lainnya
              </p>
              {extraCategories.map((item) => (
                <Link
                  key={item.id}
                  href={item.href}
                  onClick={() => setMenuOpen(false)}
                  className="min-h-[44px] px-3.5 py-2.5 rounded-xl text-sm font-bold text-[#1f2a2e]/90 hover:bg-black/10 flex items-center transition-colors"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          )}

          {/* Admin link / Login Admin */}
          {isLoggedIn && isAdmin ? (
            <Link
              href="/admin"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setMenuOpen(false)}
              className="min-h-[44px] px-3.5 py-2.5 rounded-xl text-sm font-black text-white bg-[#1f2a2e] hover:bg-black flex items-center gap-2 transition-colors"
            >
              <Shield className="w-4 h-4 text-[#c1ff72]" />
              <span>Masuk Admin</span>
            </Link>
          ) : !isLoggedIn ? (
            <Link
              href="/login?redirect=/admin"
              onClick={() => setMenuOpen(false)}
              className="min-h-[44px] px-3.5 py-2.5 rounded-xl text-sm font-black text-white bg-[#1f2a2e] hover:bg-black flex items-center gap-2 transition-colors"
            >
              <Shield className="w-4 h-4 text-[#c1ff72]" />
              <span>Login Admin</span>
            </Link>
          ) : null}

          {/* Logged-in user info */}
          {isLoggedIn && (
            <div className="pt-3 border-t border-black/10 mt-2 space-y-2">
              <div className="px-3.5 py-1.5 text-xs text-[#1f2a2e]/80">
                Masuk sebagai <span className="font-bold text-[#1f2a2e]">{user?.name}</span> ({user?.role})
              </div>
              <button
                type="button"
                onClick={() => {
                  logout();
                  setMenuOpen(false);
                }}
                className="w-full min-h-[44px] px-3.5 py-2.5 text-left text-sm text-red-800 font-bold hover:bg-red-500/10 rounded-xl flex items-center gap-2 cursor-pointer transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span>Keluar Akun</span>
              </button>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
