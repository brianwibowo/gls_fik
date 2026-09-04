'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Sparkles,
  Search,
  BookOpen,
  Clock,
  CheckCircle,
  Play,
  TrendingUp,
  LayoutGrid,
  ShieldCheck,
  UserCheck,
  ArrowRight,
  Plus,
  Filter,
} from 'lucide-react';
import { ScrollReveal } from '../ui/ScrollReveal';

export function PreviewSection({ onOpenLogin }: { onOpenLogin?: () => void }) {
  const [activeTab, setActiveTab] = useState<'athlete' | 'coach'>('athlete');

  return (
    <section id="preview" className="py-20 md:py-28 bg-white border-t border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto">
          <ScrollReveal direction="up">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 border border-blue-200/60 px-3.5 py-1.5 rounded-full">
              Preview Sistem
            </span>
            <h2 className="mt-3 text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Antarmuka Elegan, Fokus Pada Pembelajaran
            </h2>
            <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed">
              GLS mengusung arsitektur <strong className="text-slate-900 font-semibold">Educational Hub</strong> yang
              terorganisir rapi dengan grid layout, bebas dari kebingungan navigasi bagi atlet muda maupun pelatih senior.
            </p>
          </ScrollReveal>

          {/* Role Switcher Pill */}
          <ScrollReveal direction="up" delay={0.15} className="mt-8 flex justify-center">
            <div className="inline-flex p-1.5 bg-slate-100 rounded-2xl border border-slate-200/80">
              <button
                onClick={() => setActiveTab('athlete')}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                  activeTab === 'athlete'
                    ? 'bg-white text-blue-600 shadow-md shadow-slate-200/50'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <UserCheck className="w-4 h-4" />
                <span>Dashboard Atlet &amp; Orang Tua</span>
              </button>

              <button
                onClick={() => setActiveTab('coach')}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                  activeTab === 'coach'
                    ? 'bg-white text-blue-600 shadow-md shadow-slate-200/50'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Dashboard Pelatih (Coach)</span>
              </button>
            </div>
          </ScrollReveal>
        </div>

        {/* Dashboard Mockup Display */}
        <div className="mt-12">
          <ScrollReveal direction="up" delay={0.25}>
            <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl overflow-hidden ring-1 ring-slate-900/5">
              {/* Browser/OS Window Frame */}
              <div className="bg-slate-100/90 px-5 py-3.5 border-b border-slate-200 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-rose-400" />
                  <div className="w-3 h-3 rounded-full bg-amber-400" />
                  <div className="w-3 h-3 rounded-full bg-emerald-400" />
                  <span className="ml-3 text-xs font-semibold text-slate-500 hidden sm:inline">
                    glsfik.vercel.app / {activeTab === 'athlete' ? 'dashboard-atlet' : 'dashboard-pelatih'}
                  </span>
                </div>

                <div className="flex items-center gap-2 text-xs text-blue-700 font-bold bg-blue-50/80 px-3 py-1 rounded-lg border border-blue-200/70">
                  <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                  <span>{activeTab === 'athlete' ? 'Mode Siswa / Atlet' : 'Mode Administrator Pelatih'}</span>
                </div>
              </div>

              {/* Mockup Content Area */}
              {activeTab === 'athlete' ? (
                <div className="p-6 sm:p-9 bg-[#F8FAFC]">
                  {/* Top Bar inside Dashboard */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200/80">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-xl sm:text-2xl font-black text-slate-900">
                          Selamat Datang, Alisha Rahma
                        </h3>
                        <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold">
                          Atlet Junior
                        </span>
                      </div>
                      <p className="text-xs sm:text-sm text-slate-500 mt-1">
                        Lanjutkan latihan senam lantai hari ini bersama arahan Pelatih Budi Santoso.
                      </p>
                    </div>

                    {/* Search Bar */}
                    <div className="relative max-w-xs w-full">
                      <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        readOnly
                        placeholder="Cari gerakan, drill, atau nomor alat..."
                        className="w-full pl-9 pr-4 py-2 bg-white rounded-xl border border-slate-200 text-xs text-slate-700 pointer-events-none shadow-xs"
                      />
                    </div>
                  </div>

                  {/* Progress Overview Cards */}
                  <div className="mt-6 grid grid-cols-1 sm:grid-cols-4 gap-4">
                    <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-4 sm:col-span-1">
                      <div className="relative w-14 h-14 rounded-full border-4 border-blue-100 flex items-center justify-center shrink-0">
                        <div className="absolute inset-0 rounded-full border-4 border-blue-600 border-t-transparent -rotate-45" />
                        <span className="text-sm font-black text-blue-700">68%</span>
                      </div>
                      <div>
                        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                          Total Progres
                        </p>
                        <p className="text-sm font-extrabold text-slate-800">Level 2 Mahir</p>
                      </div>
                    </div>

                    <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-3.5">
                      <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                        <CheckCircle className="w-5 h-5" />
                      </div>
                      <div>
                        <span className="text-xl font-black text-slate-900">12</span>
                        <p className="text-xs text-slate-500">Modul Tuntas</p>
                      </div>
                    </div>

                    <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-3.5">
                      <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                        <BookOpen className="w-5 h-5" />
                      </div>
                      <div>
                        <span className="text-xl font-black text-slate-900">3</span>
                        <p className="text-xs text-slate-500">Sedang Dipelajari</p>
                      </div>
                    </div>

                    <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-3.5">
                      <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                        <Clock className="w-5 h-5" />
                      </div>
                      <div>
                        <span className="text-xl font-black text-slate-900">24 Jam</span>
                        <p className="text-xs text-slate-500">Total Belajar</p>
                      </div>
                    </div>
                  </div>

                  {/* Lanjutkan Belajar Section */}
                  <div className="mt-8">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-base font-bold text-slate-900 flex items-center gap-2">
                        <Play className="w-4 h-4 text-blue-600 fill-blue-600" />
                        <span>Lanjutkan Sesi Belajar</span>
                      </h4>
                      <Link
                        href="/login"
                        target="_blank"
                        className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1"
                      >
                        <span>Lihat Semua 15 Modul</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                      {/* Card 1 */}
                      <div className="bg-white rounded-2xl border border-slate-200/90 overflow-hidden shadow-xs p-5 flex flex-col justify-between hover:border-blue-300 transition-colors">
                        <div>
                          <div className="flex items-start justify-between gap-2 mb-3">
                            <span className="px-2.5 py-1 rounded-md bg-blue-50 text-blue-700 text-[11px] font-bold">
                              Floor Exercise
                            </span>
                            <span className="text-[11px] text-slate-400">12 Menit</span>
                          </div>
                          <h5 className="font-bold text-sm text-slate-900 mb-3 leading-snug">
                            Variasi Putaran Poros &amp; Keseimbangan
                          </h5>
                          <div className="w-full bg-slate-100 rounded-full h-2 mb-2 overflow-hidden">
                            <div className="bg-blue-600 h-2 rounded-full w-3/4" />
                          </div>
                          <p className="text-[11px] text-slate-500 mb-4">Progres: 75% selesai</p>
                        </div>
                        <Link
                          href="/login"
                          target="_blank"
                          className="w-full text-center py-2.5 rounded-xl bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 transition-colors block shadow-xs"
                        >
                          Lanjut Tonton
                        </Link>
                      </div>

                      {/* Card 2 */}
                      <div className="bg-white rounded-2xl border border-slate-200/90 overflow-hidden shadow-xs p-5 flex flex-col justify-between hover:border-blue-300 transition-colors">
                        <div>
                          <div className="flex items-start justify-between gap-2 mb-3">
                            <span className="px-2.5 py-1 rounded-md bg-indigo-50 text-indigo-700 text-[11px] font-bold">
                              Balance Beam
                            </span>
                            <span className="text-[11px] text-slate-400">8 Menit</span>
                          </div>
                          <h5 className="font-bold text-sm text-slate-900 mb-3 leading-snug">
                            Lompatan Split Leap &amp; Postur Mendarat
                          </h5>
                          <div className="w-full bg-slate-100 rounded-full h-2 mb-2 overflow-hidden">
                            <div className="bg-indigo-600 h-2 rounded-full w-1/2" />
                          </div>
                          <p className="text-[11px] text-slate-500 mb-4">Progres: 50% selesai</p>
                        </div>
                        <Link
                          href="/login"
                          target="_blank"
                          className="w-full text-center py-2.5 rounded-xl bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-700 transition-colors block shadow-xs"
                        >
                          Lanjut Tonton
                        </Link>
                      </div>

                      {/* Card 3 */}
                      <div className="bg-white rounded-2xl border border-slate-200/90 overflow-hidden shadow-xs p-5 flex flex-col justify-between hover:border-blue-300 transition-colors">
                        <div>
                          <div className="flex items-start justify-between gap-2 mb-3">
                            <span className="px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-700 text-[11px] font-bold">
                              Vault (Meja Lompat)
                            </span>
                            <span className="text-[11px] text-slate-400">15 Menit</span>
                          </div>
                          <h5 className="font-bold text-sm text-slate-900 mb-3 leading-snug">
                            Teknik Awalan Lari &amp; Entri Springboard
                          </h5>
                          <div className="w-full bg-slate-100 rounded-full h-2 mb-2 overflow-hidden">
                            <div className="bg-emerald-600 h-2 rounded-full w-1/4" />
                          </div>
                          <p className="text-[11px] text-slate-500 mb-4">Progres: 25% selesai</p>
                        </div>
                        <Link
                          href="/login"
                          target="_blank"
                          className="w-full text-center py-2.5 rounded-xl bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 transition-colors block shadow-xs"
                        >
                          Lanjut Tonton
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                /* Coach Dashboard Preview */
                <div className="p-6 sm:p-9 bg-[#F8FAFC]">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200/80">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-xl sm:text-2xl font-black text-slate-900">
                          Panel Pelatih: Coach Budi Santoso
                        </h3>
                        <span className="px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 border border-blue-200 text-[10px] font-bold">
                          Pelatih Utama FIK
                        </span>
                      </div>
                      <p className="text-xs sm:text-sm text-slate-500 mt-1">
                        Kelola modul video latihan dan pantau evaluasi 24 atlet binaan aktif.
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      <Link
                        href="/login"
                        target="_blank"
                        className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-blue-600 text-white text-xs font-bold rounded-xl hover:bg-blue-700 shadow-md shadow-blue-600/20"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Tambah Modul Baru</span>
                      </Link>
                    </div>
                  </div>

                  {/* Coach Athlete Roster Table */}
                  <div className="mt-6 bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-xs">
                    <div className="p-4 border-b border-slate-100 flex items-center justify-between">
                      <span className="text-sm font-bold text-slate-800">
                        Monitoring Progres Atlet Binaan
                      </span>
                      <span className="text-xs text-slate-500">Total: 24 Atlet Terdaftar</span>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs">
                        <thead className="bg-slate-50 text-slate-500 uppercase font-bold tracking-wider">
                          <tr>
                            <th className="p-3.5">Nama Atlet</th>
                            <th className="p-3.5">Disiplin Senam</th>
                            <th className="p-3.5">Modul Terakhir</th>
                            <th className="p-3.5">Progres</th>
                            <th className="p-3.5">Status Evaluasi</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
                          <tr>
                            <td className="p-3.5 font-bold text-slate-900">Alisha Rahma (12 th)</td>
                            <td className="p-3.5">Artistik Putri</td>
                            <td className="p-3.5">Split Leap on Beam</td>
                            <td className="p-3.5 font-bold text-blue-600">85%</td>
                            <td className="p-3.5">
                              <span className="px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-700 font-bold">
                                Sesuai Target
                              </span>
                            </td>
                          </tr>
                          <tr>
                            <td className="p-3.5 font-bold text-slate-900">Rian Pratama (15 th)</td>
                            <td className="p-3.5">Artistik Putra</td>
                            <td className="p-3.5">Iron Cross on Rings</td>
                            <td className="p-3.5 font-bold text-blue-600">60%</td>
                            <td className="p-3.5">
                              <span className="px-2.5 py-1 rounded-md bg-blue-50 text-blue-700 font-bold">
                                Sedang Latihan
                              </span>
                            </td>
                          </tr>
                          <tr>
                            <td className="p-3.5 font-bold text-slate-900">Nadira Zahrani (10 th)</td>
                            <td className="p-3.5">Artistik Putri</td>
                            <td className="p-3.5">Handspring Vault Entry</td>
                            <td className="p-3.5 font-bold text-amber-600">40%</td>
                            <td className="p-3.5">
                              <span className="px-2.5 py-1 rounded-md bg-amber-50 text-amber-700 font-bold">
                                Perlu Koreksi Sudut
                              </span>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
