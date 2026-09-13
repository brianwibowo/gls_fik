'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth';
import {
  Activity,
  LogIn,
  LogOut,
  ChevronDown,
  Settings,
  Menu,
  X,
} from 'lucide-react';

export function Navbar() {
  const { user, isLoggedIn, isAdmin, logout, isReady } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-[#0e0e0e] border-b border-[#262626]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand */}
          <Link href="/" className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-black text-sm">
              <Activity className="w-4 h-4 stroke-[2.5]" />
            </div>
            <div className="flex flex-col">
              <span className="text-base font-black tracking-tight text-white leading-tight">
                GLS FIK
              </span>
              <span className="text-[10px] text-slate-400 font-medium">
                Gymnastics Learning System
              </span>
            </div>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-6">
            <Link
              href="/"
              className="text-sm font-medium text-slate-200 hover:text-white transition-colors"
            >
              Katalog Video
            </Link>

            {isLoggedIn && isAdmin && (
              <Link
                href="/admin"
                className="text-sm font-medium text-slate-300 hover:text-white transition-colors flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#1a1a1a] border border-[#333]"
              >
                <Settings className="w-3.5 h-3.5 text-blue-400" />
                <span>Admin Panel</span>
              </Link>
            )}

            {/* Auth area */}
            {isReady && (
              <>
                {isLoggedIn ? (
                  <div className="relative">
                    <button
                      onClick={() => setProfileOpen(!profileOpen)}
                      className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg hover:bg-[#1a1a1a] text-slate-200 hover:text-white transition-colors cursor-pointer border border-transparent hover:border-[#333]"
                    >
                      <div className="w-7 h-7 rounded-md bg-blue-700 flex items-center justify-center font-bold text-xs text-white">
                        {user?.name.charAt(0).toUpperCase()}
                      </div>
                      <span className="text-sm font-semibold hidden lg:inline">
                        {user?.name}
                      </span>
                      <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${profileOpen ? 'rotate-180' : ''}`} />
                    </button>

                    {profileOpen && (
                      <div className="absolute right-0 mt-2 w-52 bg-[#181818] border border-[#333] rounded-xl shadow-2xl overflow-hidden z-50">
                        <div className="px-4 py-3 border-b border-[#2a2a2a]">
                          <p className="text-sm font-bold text-white">{user?.name}</p>
                          <p className="text-xs text-slate-400 truncate">{user?.email}</p>
                          <span className="inline-block mt-1.5 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-blue-900/60 text-blue-200 border border-blue-700/50">
                            {user?.role}
                          </span>
                        </div>
                        <button
                          onClick={() => {
                            logout();
                            setProfileOpen(false);
                          }}
                          className="w-full px-4 py-2.5 text-left text-sm text-slate-300 hover:bg-[#222] hover:text-red-400 transition-colors flex items-center gap-2 cursor-pointer"
                        >
                          <LogOut className="w-4 h-4" />
                          <span>Keluar</span>
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <Link
                    href="/login"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition-colors"
                  >
                    <LogIn className="w-4 h-4" />
                    <span>Masuk</span>
                  </Link>
                )}
              </>
            )}
          </div>

          {/* Mobile hamburger */}
          <div className="flex md:hidden items-center gap-2">
            {isReady && !isLoggedIn && (
              <Link
                href="/login"
                className="px-3 py-1.5 rounded-lg bg-blue-600 text-white text-xs font-semibold"
              >
                Masuk
              </Link>
            )}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="p-2 rounded-lg text-slate-300 hover:text-white hover:bg-[#1a1a1a] transition-colors"
              aria-label="Menu"
            >
              {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-[#141414] border-t border-[#262626] px-4 py-4 space-y-2">
          <Link
            href="/"
            onClick={() => setMenuOpen(false)}
            className="block py-2 text-sm font-semibold text-slate-200 hover:text-white"
          >
            Katalog Video
          </Link>
          {isLoggedIn && isAdmin && (
            <Link
              href="/admin"
              onClick={() => setMenuOpen(false)}
              className="block py-2 text-sm font-semibold text-slate-200 hover:text-white"
            >
              Admin Panel
            </Link>
          )}
          {isLoggedIn && (
            <div className="pt-2 border-t border-[#262626]">
              <div className="py-1 text-xs text-slate-400">
                Masuk sebagai <span className="text-white font-semibold">{user?.name}</span> ({user?.role})
              </div>
              <button
                onClick={() => {
                  logout();
                  setMenuOpen(false);
                }}
                className="w-full text-left py-2 text-sm text-red-400 font-semibold"
              >
                Keluar
              </button>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
