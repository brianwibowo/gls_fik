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
} from 'lucide-react';
import { ScrollReveal } from '../ui/ScrollReveal';

export function PreviewSection({ onOpenLogin }: { onOpenLogin?: () => void }) {
  const [activeTab, setActiveTab] = useState<'athlete' | 'coach'>('athlete');

  return (
    <section id="preview" className="py-20 md:py-28 bg-[#F8FAFC]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto">
          <ScrollReveal direction="up">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-3 py-1.5 rounded-md border border-blue-100">
              Preview Antarmuka
            </span>
            <h2 className="mt-3 text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Tampilan Sederhana &amp; Bebas Kerumitan
            </h2>
            <p className="mt-4 text-base sm:text-lg text-slate-600">
              Bukan seperti Netflix yang membingungkan dengan banyak carousel. GLS mengusung konsep{' '}
              <strong className="text-slate-800 font-semibold">Educational Hub (Grid Layout)</strong> yang ramah bagi atlet muda dan orang tua.
            </p>
          </ScrollReveal>

          {/* Role Switcher Tab */}
          <ScrollReveal direction="up" delay={0.15} className="mt-8 flex justify-center">
            <div className="inline-flex p-1.5 bg-slate-200/80 rounded-xl">
              <button
                onClick={() => setActiveTab('athlete')}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-xs sm:text-sm font-bold transition-all ${
                  activeTab === 'athlete'
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <UserCheck className="w-4 h-4" />
                <span>Dashboard Atlet &amp; Orang Tua</span>
              </button>

              <button
                onClick={() => setActiveTab('coach')}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-xs sm:text-sm font-bold transition-all ${
                  activeTab === 'coach'
                    ? 'bg-white text-blue-600 shadow-sm'
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
            <div className="bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden">
              {/* Browser/App Header Bar */}
              <div className="bg-slate-100/90 px-4 py-3 border-b border-slate-200 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-400" />
                  <div className="w-3 h-3 rounded-full bg-amber-400" />
                  <div className="w-3 h-3 rounded-full bg-green-400" />
                  <span className="ml-2 text-xs font-semibold text-slate-500 hidden sm:inline">
                    app.gls-senam.id / {activeTab === 'athlete' ? 'dashboard-atlet' : 'dashboard-pelatih'}
                  </span>
                </div>

                <div className="flex items-center gap-2 text-xs text-slate-600 font-medium bg-white px-3 py-1 rounded-md border border-slate-200">
                  <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                  <span>{activeTab === 'athlete' ? 'Mode Atlet' : 'Mode Pelatih'}</span>
                </div>
              </div>

              {/* Mockup Content Area */}
              {activeTab === 'athlete' ? (
                <div className="p-6 sm:p-8 bg-[#F8FAFC]">
                  {/* Top Bar inside Dashboard */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
                    <div>
                      <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900">
                        Selamat Datang, Alisha! 👋
                      </h3>
                      <p className="text-xs sm:text-sm text-slate-500">
                        Lanjutkan latihan senam lantai hari ini bersama Pelatih Budi.
                      </p>
                    </div>

                    {/* Search Bar */}
                    <div className="relative max-w-xs w-full">
                      <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        readOnly
                        placeholder="Cari materi atau teknik gerakan..."
                        className="w-full pl-9 pr-4 py-2 bg-white rounded-lg border border-slate-200 text-xs text-slate-700 pointer-events-none"
                      />
                    </div>
                  </div>

                  {/* Progress Overview */}
                  <div className="mt-6 grid grid-cols-1 sm:grid-cols-4 gap-4">
                    <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-gls flex items-center gap-4 sm:col-span-1">
                      <div className="relative w-16 h-16 rounded-full border-4 border-blue-100 flex items-center justify-center">
                        <div className="absolute inset-0 rounded-full border-4 border-blue-600 border-t-transparent -rotate-45" />
                        <span className="text-base font-extrabold text-blue-700">68%</span>
                      </div>
                      <div>
                        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                          Total Progres
                        </p>
                        <p className="text-sm font-bold text-slate-800">Menuju Level 3</p>
                      </div>
                    </div>

                    <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-gls flex items-center gap-3.5">
                      <div className="w-10 h-10 rounded-lg bg-green-50 text-green-600 flex items-center justify-center shrink-0">
                        <CheckCircle className="w-5 h-5" />
                      </div>
                      <div>
                        <span className="text-xl font-extrabold text-slate-900">12</span>
                        <p className="text-xs text-slate-500">Modul Selesai</p>
                      </div>
                    </div>

                    <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-gls flex items-center gap-3.5">
                      <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                        <BookOpen className="w-5 h-5" />
                      </div>
                      <div>
                        <span className="text-xl font-extrabold text-slate-900">3</span>
                        <p className="text-xs text-slate-500">Sedang Dipelajari</p>
                      </div>
                    </div>

                    <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-gls flex items-center gap-3.5">
                      <div className="w-10 h-10 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                        <Clock className="w-5 h-5" />
                      </div>
                      <div>
                        <span className="text-xl font-extrabold text-slate-900">24 Jam</span>
                        <p className="text-xs text-slate-500">Waktu Belajar</p>
                      </div>
                    </div>
                  </div>

                  {/* Lanjutkan Belajar Section */}
                  <div className="mt-8">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-base font-bold text-slate-900 flex items-center gap-2">
                        <Play className="w-4 h-4 text-blue-600 fill-blue-600" />
                        <span>Lanjutkan Belajar</span>
                      </h4>
                      <Link href="/login" target="_blank" className="text-xs font-semibold text-blue-600 hover:underline">
                        Semua Modul (15) →
                      </Link>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                      {/* Card 1 */}
                      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-gls p-4 flex flex-col justify-between">
                        <div className="flex items-start justify-between gap-2 mb-3">
                          <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-700 text-[10px] font-bold">
                            Floor Exercise
                          </span>
                          <span className="text-[11px] text-slate-400">Durasi: 12 Menit</span>
                        </div>
                        <h5 className="font-bold text-sm text-slate-800 mb-2">
                          Variasi Putaran Poros &amp; Keseimbangan
                        </h5>
                        <div className="w-full bg-slate-100 rounded-full h-2 mb-3 overflow-hidden">
                          <div className="bg-blue-600 h-2 rounded-full w-3/4" />
                        </div>
                        <Link
                          href="/login"
                          target="_blank"
                          className="w-full text-center py-2 rounded-lg bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 transition-colors block"
                        >
                          Lanjut Belajar
                        </Link>
                      </div>

                      {/* Card 2 */}
                      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-gls p-4 flex flex-col justify-between">
                        <div className="flex items-start justify-between gap-2 mb-3">
                          <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-700 text-[10px] font-bold">
                            Balance Beam
                          </span>
                          <span className="text-[11px] text-slate-400">Durasi: 8 Menit</span>
                        </div>
                        <h5 className="font-bold text-sm text-slate-800 mb-2">
                          Lompatan Split &amp; Postur Mendarat
                        </h5>
                        <div className="w-full bg-slate-100 rounded-full h-2 mb-3 overflow-hidden">
                          <div className="bg-blue-600 h-2 rounded-full w-1/2" />
                        </div>
                        <Link
                          href="/login"
                          target="_blank"
                          className="w-full text-center py-2 rounded-lg bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 transition-colors block"
                        >
                          Lanjut Belajar
                        </Link>
                      </div>

                      {/* Card 3 */}
                      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-gls p-4 flex flex-col justify-between">
                        <div className="flex items-start justify-between gap-2 mb-3">
                          <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-700 text-[10px] font-bold">
                            Vault
                          </span>
                          <span className="text-[11px] text-slate-400">Durasi: 15 Menit</span>
                        </div>
                        <h5 className="font-bold text-sm text-slate-800 mb-2">
                          Teknik Awalan Lari &amp; Springboard
                        </h5>
                        <div className="w-full bg-slate-100 rounded-full h-2 mb-3 overflow-hidden">
                          <div className="bg-blue-600 h-2 rounded-full w-1/4" />
                        </div>
                        <Link
                          href="/login"
                          target="_blank"
                          className="w-full text-center py-2 rounded-lg bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 transition-colors block"
                        >
                          Lanjut Belajar
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                /* Coach Dashboard Preview */
                <div className="p-6 sm:p-8 bg-[#F8FAFC]">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
                    <div>
                      <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900">
                        Panel Pelatih: Coach Budi 🏅
                      </h3>
                      <p className="text-xs sm:text-sm text-slate-500">
                        Kelola modul video, pantau progres 24 atlet binaan dengan mudah.
                      </p>
                    </div>

                    <Link
                      href="/login"
                      target="_blank"
                      className="px-4 py-2 bg-blue-600 text-white text-xs font-bold rounded-lg hover:bg-blue-700"
                    >
                      + Tambah Modul Baru
                    </Link>
                  </div>

                  {/* Coach Simple Table */}
                  <div className="mt-6 bg-white rounded-xl border border-slate-200 overflow-hidden shadow-gls">
                    <div className="p-4 border-b border-slate-100 flex items-center justify-between">
                      <span className="text-sm font-bold text-slate-800">
                        Monitoring Atlet Terbaru
                      </span>
                      <span className="text-xs text-slate-500">Total: 24 Atlet Aktif</span>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs">
                        <thead className="bg-slate-50 text-slate-600 uppercase font-semibold">
                          <tr>
                            <th className="p-3">Nama Atlet</th>
                            <th className="p-3">Kategori Latihan</th>
                            <th className="p-3">Modul Terakhir</th>
                            <th className="p-3">Progres</th>
                            <th className="p-3">Status</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
                          <tr>
                            <td className="p-3 font-bold text-slate-900">Alisha Rahma (12 th)</td>
                            <td className="p-3">Artistik Putri</td>
                            <td className="p-3">Split Leap on Beam</td>
                            <td className="p-3">
                              <span className="text-blue-600 font-bold">85%</span>
                            </td>
                            <td className="p-3">
                              <span className="px-2 py-0.5 rounded bg-green-50 text-green-700 font-bold">
                                Aktif Latihan
                              </span>
                            </td>
                          </tr>
                          <tr>
                            <td className="p-3 font-bold text-slate-900">Bima Pratama (15 th)</td>
                            <td className="p-3">Artistik Putra</td>
                            <td className="p-3">Handstand on Floor</td>
                            <td className="p-3">
                              <span className="text-blue-600 font-bold">60%</span>
                            </td>
                            <td className="p-3">
                              <span className="px-2 py-0.5 rounded bg-green-50 text-green-700 font-bold">
                                Aktif Latihan
                              </span>
                            </td>
                          </tr>
                          <tr>
                            <td className="p-3 font-bold text-slate-900">Clarissa Putri (9 th)</td>
                            <td className="p-3">Dasar Pemula</td>
                            <td className="p-3">Forward &amp; Backward Roll</td>
                            <td className="p-3">
                              <span className="text-blue-600 font-bold">95%</span>
                            </td>
                            <td className="p-3">
                              <span className="px-2 py-0.5 rounded bg-amber-50 text-amber-700 font-bold">
                                Siap Uji Level
                              </span>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {/* 3D Perspective Graphic Illustration Footer in Mockup */}
              <div className="relative h-48 sm:h-64 w-full bg-slate-900 overflow-hidden">
                <Image
                  src="/images/dashboard-preview.webp"
                  alt="GLS Dashboard Preview"
                  fill
                  className="object-cover object-center opacity-80"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent flex items-end justify-between p-6">
                  <div>
                    <span className="text-xs font-bold text-blue-400 uppercase tracking-wider">
                      Desain Edukasi Modern
                    </span>
                    <h5 className="text-white text-base sm:text-lg font-bold">
                      Akses fleksibel di Laptop, Tablet, dan Smartphone
                    </h5>
                  </div>
                  <Link
                    href="/login"
                    target="_blank"
                    className="px-5 py-2.5 rounded-xl bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 shadow-md"
                  >
                    Buka Versi Lengkap
                  </Link>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
