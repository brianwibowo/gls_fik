'use client';

import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/lib/auth';
import { apiGetCategories, apiGetVideos } from '@/lib/api';
import type { Category, Video } from '@/lib/types';
import {
  Activity,
  LogOut,
  ChevronDown,
  Shield,
  Menu,
  X,
  User as UserIcon,
  CheckCircle,
} from 'lucide-react';

export function Navbar() {
  const pathname = usePathname();
  const isHome = pathname === '/';
  const { user, isLoggedIn, isAdmin, logout, isReady } = useAuth();
  const [categories, setCategories] = useState<Category[]>([]);
  const [videos, setVideos] = useState<Video[]>([]);
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [apparatusOpen, setApparatusOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const apparatusRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let isMounted = true;
    async function loadData() {
      try {
        const [cats, vids] = await Promise.all([apiGetCategories(), apiGetVideos()]);
        if (isMounted) {
          setCategories(cats);
          setVideos(vids);
        }
      } catch (err) {
        console.error('Navbar failed to load data:', err);
      }
    }
    loadData();
    return () => {
      isMounted = false;
    };
  }, []);

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
      if (apparatusRef.current && !apparatusRef.current.contains(e.target as Node)) setApparatusOpen(false);
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) setProfileOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const getFirstVideoForCategory = useCallback(
    (categoryId: string) => {
      return videos.find((v) => v.categoryId === categoryId);
    },
    [videos]
  );

  const isSolid = !isHome || scrolled || menuOpen;

  const headerClass = isHome
    ? `fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isSolid
          ? 'bg-[#172124]/95 backdrop-blur-md border-b border-[#29363B] shadow-xl py-0 text-white'
          : 'bg-transparent border-b border-transparent py-2 text-white'
      }`
    : 'sticky top-0 z-50 bg-[#172124] border-b border-[#29363B] shadow-md text-white';

  const linkClass = (active?: boolean) =>
    `text-sm font-semibold transition-colors relative min-h-[44px] inline-flex items-center px-2 ${
      active
        ? 'text-[#c1ff72] font-bold'
        : 'text-slate-300 hover:text-white'
    }`;

  return (
    <header className={headerClass}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand */}
          <Link href="/" className="flex items-center gap-2.5 sm:gap-3 group min-h-[44px]">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center font-black text-sm bg-[#c1ff72] text-[#1f2a2e] shadow-md group-hover:scale-105 transition-transform">
              <Activity className="w-4 h-4 stroke-[2.5]" />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="text-base font-black tracking-tight text-white leading-tight">
                  GCL
                </span>
                <span className="text-[10px] font-black uppercase px-1.5 py-0.2 rounded bg-[#c1ff72]/20 text-[#c1ff72] border border-[#c1ff72]/40">
                  MAG
                </span>
              </div>
              <span className="text-[10px] font-medium text-slate-300">
                Gymnastics Competition Level
              </span>
            </div>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-4">
            <Link href="/" className={linkClass(isHome)}>
              Home
            </Link>

            {/* Apparatus Dropdown */}
            <div className="relative" ref={apparatusRef}>
              <button
                type="button"
                onClick={() => setApparatusOpen(!apparatusOpen)}
                className="flex items-center gap-1 text-sm font-semibold text-slate-300 hover:text-white transition-colors cursor-pointer min-h-[44px] px-2"
                aria-expanded={apparatusOpen}
              >
                <span>Apparatus</span>
                <ChevronDown
                  className={`w-3.5 h-3.5 transition-transform ${apparatusOpen ? 'rotate-180' : ''}`}
                />
              </button>

              {apparatusOpen && (
                <div className="absolute top-full left-0 mt-2 w-64 bg-[#141b1e] border border-white/10 rounded-2xl shadow-2xl overflow-hidden z-50 p-2">
                  <div className="px-3 py-1.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    All 6 MAG Apparatus
                  </div>
                  {categories.map((item) => {
                    const firstVid = getFirstVideoForCategory(item.id);
                    const href = firstVid ? `/watch/${firstVid.id}` : `/#katalog-video`;
                    return (
                      <Link
                        key={item.id}
                        href={href}
                        onClick={() => setApparatusOpen(false)}
                        className="block px-3 py-2 rounded-xl text-xs font-semibold text-slate-200 hover:bg-[#c1ff72]/15 hover:text-[#c1ff72] transition-colors"
                      >
                        {item.name}
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>

            <Link href="/#katalog-video" className={linkClass(pathname === '/watch')}>
              Curriculum Videos
            </Link>

            <Link href="/profiles" className={linkClass(pathname === '/profiles')}>
              Profiles & Progress
            </Link>

            {/* Admin link if user is admin */}
            {isLoggedIn && isAdmin && (
              <Link
                href="/admin"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-bold flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-all shadow-sm text-white bg-white/10 hover:bg-white/20 border border-white/15 min-h-[38px]"
              >
                <Shield className="w-3.5 h-3.5 text-[#c1ff72]" />
                <span>Admin Console</span>
              </Link>
            )}

            {/* Auth Area */}
            {isReady && (
              <>
                {isLoggedIn ? (
                  <div className="relative" ref={profileRef}>
                    <button
                      type="button"
                      onClick={() => setProfileOpen(!profileOpen)}
                      className="flex items-center gap-2.5 px-3 py-1.5 min-h-[44px] rounded-xl transition-all cursor-pointer bg-white/10 hover:bg-white/15 border border-white/15 text-white"
                      aria-expanded={profileOpen}
                    >
                      <div className="w-7 h-7 rounded-lg bg-[#c1ff72] text-[#1f2a2e] flex items-center justify-center font-black text-xs">
                        {user?.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="text-left hidden xl:block">
                        <span className="text-xs font-bold block leading-tight truncate max-w-[120px]">
                          {user?.name}
                        </span>
                        <span className="text-[10px] text-[#c1ff72] capitalize font-medium">
                          {user?.role}
                        </span>
                      </div>
                      <ChevronDown
                        className={`w-3.5 h-3.5 text-slate-400 transition-transform ${profileOpen ? 'rotate-180' : ''}`}
                      />
                    </button>

                    {profileOpen && (
                      <div className="absolute right-0 mt-2 w-60 bg-[#141b1e] border border-white/10 rounded-2xl shadow-2xl overflow-hidden z-50 p-2">
                        <div className="px-3 py-2.5 border-b border-white/10">
                          <p className="text-xs font-bold text-white">{user?.name}</p>
                          <p className="text-[11px] text-slate-400 truncate">{user?.email}</p>
                          <span className="inline-block mt-1.5 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-[#c1ff72]/20 text-[#c1ff72] border border-[#c1ff72]/30">
                            Role: {user?.role}
                          </span>
                        </div>

                        <Link
                          href="/profiles"
                          onClick={() => setProfileOpen(false)}
                          className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-slate-200 hover:bg-white/5 transition-colors mt-1"
                        >
                          <UserIcon className="w-3.5 h-3.5 text-[#c1ff72]" />
                          <span>View Profiles & Progress</span>
                        </Link>

                        <button
                          type="button"
                          onClick={() => {
                            logout();
                            setProfileOpen(false);
                          }}
                          className="w-full mt-1 px-3 py-2 text-left text-xs text-red-400 hover:bg-red-500/10 rounded-xl transition-colors flex items-center gap-2 cursor-pointer font-semibold min-h-[40px]"
                        >
                          <LogOut className="w-3.5 h-3.5" />
                          <span>Sign Out</span>
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <Link
                    href="/login"
                    className="inline-flex items-center gap-2 px-4 py-2 min-h-[44px] rounded-xl text-xs sm:text-sm font-black transition-all bg-[#c1ff72] text-[#1f2a2e] hover:bg-[#b0f555] shadow-md hover:scale-[1.02] active:scale-95"
                  >
                    <UserIcon className="w-4 h-4 stroke-[2.5]" />
                    <span>Sign In</span>
                  </Link>
                )}
              </>
            )}
          </nav>

          {/* Mobile controls */}
          <div className="flex lg:hidden items-center gap-2">
            {isReady && !isLoggedIn && (
              <Link
                href="/login"
                className="min-h-[44px] px-3.5 py-2 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all bg-[#c1ff72] text-[#1f2a2e] hover:bg-[#b0f555]"
              >
                <UserIcon className="w-3.5 h-3.5" />
                <span>Sign In</span>
              </Link>
            )}
            <button
              type="button"
              onClick={() => setMenuOpen(!menuOpen)}
              className="w-11 h-11 min-w-[44px] min-h-[44px] rounded-xl active:scale-95 flex items-center justify-center transition-all cursor-pointer text-white hover:bg-white/10 border border-white/20 bg-black/40 backdrop-blur-md"
              aria-label={menuOpen ? 'Close Navigation Menu' : 'Open Navigation Menu'}
              aria-expanded={menuOpen}
            >
              {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile drawer */}
      {menuOpen && (
        <div className="lg:hidden bg-[#141b1e] border-t border-white/10 px-4 py-4 space-y-1 shadow-2xl animate-in fade-in duration-150">
          <Link
            href="/"
            onClick={() => setMenuOpen(false)}
            className="min-h-[44px] px-3.5 py-2.5 rounded-xl text-sm font-bold text-white hover:bg-white/10 flex items-center transition-colors"
          >
            Home
          </Link>

          <Link
            href="/#katalog-video"
            onClick={() => setMenuOpen(false)}
            className="min-h-[44px] px-3.5 py-2.5 rounded-xl text-sm font-bold text-white hover:bg-white/10 flex items-center transition-colors"
          >
            Curriculum Videos
          </Link>

          <Link
            href="/profiles"
            onClick={() => setMenuOpen(false)}
            className="min-h-[44px] px-3.5 py-2.5 rounded-xl text-sm font-bold text-white hover:bg-white/10 flex items-center transition-colors"
          >
            Profiles & Progress
          </Link>

          {/* Apparatus section list in mobile */}
          <div className="pt-2 border-t border-white/10 space-y-1">
            <p className="px-3.5 pt-1 pb-0.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              6 MAG Apparatus
            </p>
            {categories.map((item) => {
              const firstVid = getFirstVideoForCategory(item.id);
              const href = firstVid ? `/watch/${firstVid.id}` : `/#katalog-video`;
              return (
                <Link
                  key={item.id}
                  href={href}
                  onClick={() => setMenuOpen(false)}
                  className="min-h-[44px] px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:bg-white/10 hover:text-[#c1ff72] flex items-center transition-colors"
                >
                  {item.name}
                </Link>
              );
            })}
          </div>

          {/* Admin link if admin */}
          {isLoggedIn && isAdmin && (
            <Link
              href="/admin"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setMenuOpen(false)}
              className="min-h-[44px] px-3.5 py-2.5 rounded-xl text-sm font-bold text-white bg-white/10 hover:bg-white/15 flex items-center gap-2 transition-colors mt-2"
            >
              <Shield className="w-4 h-4 text-[#c1ff72]" />
              <span>Admin Console</span>
            </Link>
          )}

          {/* Logged in state */}
          {isLoggedIn ? (
            <div className="pt-3 border-t border-white/10 mt-2 space-y-2">
              <div className="px-3.5 py-1.5 text-xs text-slate-300">
                Signed in as <span className="font-bold text-white">{user?.name}</span> ({user?.role})
              </div>
              <button
                type="button"
                onClick={() => {
                  logout();
                  setMenuOpen(false);
                }}
                className="w-full min-h-[44px] px-3.5 py-2.5 text-left text-sm text-red-400 font-bold hover:bg-red-500/10 rounded-xl flex items-center gap-2 cursor-pointer transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              onClick={() => setMenuOpen(false)}
              className="min-h-[44px] px-3.5 py-2.5 rounded-xl text-sm font-black text-[#1f2a2e] bg-[#c1ff72] hover:bg-[#b0f555] flex items-center justify-center gap-2 transition-colors mt-2"
            >
              <UserIcon className="w-4 h-4" />
              <span>Sign In to GCL</span>
            </Link>
          )}
        </div>
      )}
    </header>
  );
}
