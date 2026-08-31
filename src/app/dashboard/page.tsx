'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Activity,
  Play,
  CheckCircle2,
  Clock,
  BookOpen,
  ChevronRight,
  ExternalLink,
  Search,
  Sparkles,
  Award,
  ShieldCheck,
  LogOut,
  FolderOpen,
  Share2,
  Maximize2,
  Check,
  AlertCircle,
  HelpCircle,
} from 'lucide-react';

// Data Seri Video Senam Lantai (FX) dari Google Drive
const fxEpisodes = [
  {
    id: 1,
    episodeNumber: 'EP 01',
    title: 'Fondasi, Postur & Awalan Senam Lantai (FX)',
    subtitle: 'Koreksi postur tubuh, ayunan tangan, dan kelenturan dasar sebelum rangkaian.',
    duration: '03:45',
    level: 'Dasar (Beginner)',
    driveFileId: '12JG_YaH6ADE4xVqgskKQY-rx79Dht7KM',
    driveLink: 'https://drive.google.com/file/d/12JG_YaH6ADE4xVqgskKQY-rx79Dht7KM/view?usp=share_link',
    thumbnail: '/images/apparatus-floor.webp',
    keyPoints: [
      'Posisi ujung jari kaki wajib meruncing (point) saat awalan',
      'Tarik perut ke dalam dan jaga posisi tulang belakang netral',
      'Fokus pandangan lurus 45 derajat ke depan matras',
    ],
    coachNote:
      'Pastikan pemanasan pergelangan tangan dan pergelangan kaki minimal 10 menit sebelum mencoba gerakan di episode ini.',
  },
  {
    id: 2,
    episodeNumber: 'EP 02',
    title: 'Rangkaian Eksekusi & Dinamika Gerak FX',
    subtitle: 'Transisi antar gerakan akrobatik, dorongan bahu, dan rotasi poros matras.',
    duration: '04:12',
    level: 'Menengah (Intermediate)',
    driveFileId: '10pPKxlH8e6GKSI79bTbiCQ7d_YQP3xkD',
    driveLink: 'https://drive.google.com/file/d/10pPKxlH8e6GKSI79bTbiCQ7d_YQP3xkD/view?usp=share_link',
    thumbnail: '/images/hero-gymnast.webp',
    keyPoints: [
      'Tolakan kuat pada telapak tangan saat menyentuh lantai',
      'Kunci otot inti (core) saat melakukan rotasi poros udara',
      'Jaga ritme dan kecepatan langkah agar tidak kehilangan momentum',
    ],
    coachNote:
      'Gunakan matras pengaman tambahan (landing mat) jika atlet baru pertama kali mempelajari variasi putaran poros.',
  },
  {
    id: 3,
    episodeNumber: 'EP 03',
    title: 'Koreksi Pendaratan (Stick Landing) & Evaluasi Pelatih',
    subtitle: 'Peredaman lutut saat mendarat, penyeimbangan badan, dan pencegahan cedera.',
    duration: '05:08',
    level: 'Mahir (Advanced)',
    driveFileId: '1saHh0xfJRT3tuIKyByGCbAzsMnoa2HXI',
    driveLink: 'https://drive.google.com/file/d/1saHh0xfJRT3tuIKyByGCbAzsMnoa2HXI/view?usp=share_link',
    thumbnail: '/images/feature-progress.webp',
    keyPoints: [
      'Tekuk lutut maksimal 45 derajat untuk meredam gaya gravitasi',
      'Kedua kaki dibuka selebar bahu dan tidak boleh melangkah tambahan',
      'Kedua tangan direntangkan ke atas membentuk huruf V sempurna',
    ],
    coachNote:
      'Pendaratan yang kokoh tanpa goyang (stick landing) menyumbang poin tertinggi dalam penilaian artistik.',
  },
];

// Seri Alat Lainnya (Netflix Rows)
const otherSeries = [
  {
    id: 'beam',
    title: 'Balance Beam (Balok Keseimbangan)',
    episodesCount: '4 Episode',
    level: 'Semua Level',
    thumbnail: '/images/apparatus-beam.webp',
    status: 'Segera Hadir',
  },
  {
    id: 'vault',
    title: 'Vault Table (Meja Lompat)',
    episodesCount: '3 Episode',
    level: 'Menengah',
    thumbnail: '/images/feature-structured.webp',
    status: 'Segera Hadir',
  },
  {
    id: 'bars',
    title: 'Uneven & Parallel Bars',
    episodesCount: '5 Episode',
    level: 'Mahir',
    thumbnail: '/images/feature-video.webp',
    status: 'Segera Hadir',
  },
];

export default function DashboardPage() {
  const [selectedEpisode, setSelectedEpisode] = useState(fxEpisodes[0]);
  const [completedEpisodes, setCompletedEpisodes] = useState<number[]>([1]);
  const [activeTab, setActiveTab] = useState<'notes' | 'mistakes' | 'checklist'>('notes');

  const isCompleted = (id: number) => completedEpisodes.includes(id);

  const toggleComplete = (id: number) => {
    if (completedEpisodes.includes(id)) {
      setCompletedEpisodes(completedEpisodes.filter((item) => item !== id));
    } else {
      setCompletedEpisodes([...completedEpisodes, id]);
    }
  };

  const progressPercent = Math.round((completedEpisodes.length / fxEpisodes.length) * 100);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans flex flex-col">
      {/* 1. TOP NETFLIX-STYLE STREAMING NAVBAR */}
      <header className="sticky top-0 z-50 bg-slate-950/90 backdrop-blur-md border-b border-slate-800/80 px-4 sm:px-8 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-6">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-sm shadow-blue-500/20">
              <Activity className="w-5 h-5" />
            </div>
            <span className="text-lg font-extrabold tracking-tight text-white">
              GLS<span className="text-blue-500">.</span>
              <span className="text-[11px] font-normal text-slate-400 ml-1.5 hidden sm:inline">
                Learning Hub
              </span>
            </span>
          </Link>

          {/* Series Navigation Menu */}
          <nav className="hidden md:flex items-center gap-5 text-xs font-semibold text-slate-300">
            <span className="text-white font-bold bg-blue-600/20 text-blue-400 px-3 py-1 rounded-full border border-blue-500/30">
              Floor Exercise (FX)
            </span>
            <span className="hover:text-white cursor-pointer opacity-70 hover:opacity-100 transition-opacity">
              Balance Beam
            </span>
            <span className="hover:text-white cursor-pointer opacity-70 hover:opacity-100 transition-opacity">
              Vault
            </span>
            <span className="hover:text-white cursor-pointer opacity-70 hover:opacity-100 transition-opacity">
              Bars &amp; Rings
            </span>
          </nav>
        </div>

        {/* Right Nav: Coach Profile & Logout */}
        <div className="flex items-center gap-4">
          <a
            href="https://drive.google.com/drive/folders/1HLcaJkufKFwbiUcttAa-XqNic-NbBNtX?usp=share_link"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white text-xs font-semibold border border-slate-800 transition-all"
            title="Buka Folder Google Drive Materi"
          >
            <FolderOpen className="w-3.5 h-3.5 text-amber-400" />
            <span>Folder Drive FX</span>
            <ExternalLink className="w-3 h-3 text-slate-500" />
          </a>

          {/* Coach Avatar Chip */}
          <div className="flex items-center gap-2.5 bg-slate-900/80 px-3 py-1.5 rounded-full border border-slate-800">
            <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center font-bold text-xs text-white">
              CB
            </div>
            <div className="flex flex-col text-left">
              <span className="text-xs font-bold text-slate-200 leading-none">
                Coach Budi
              </span>
              <span className="text-[10px] text-green-400 font-semibold leading-none mt-0.5">
                ● Pelatih Utama
              </span>
            </div>
          </div>

          <Link
            href="/login"
            className="p-2 rounded-lg text-slate-400 hover:text-red-400 hover:bg-slate-900 transition-colors"
            title="Keluar"
          >
            <LogOut className="w-4 h-4" />
          </Link>
        </div>
      </header>

      {/* 2. THEATER VIDEO PLAYER SECTION */}
      <section className="bg-slate-950 pt-4 pb-8 px-4 sm:px-8 border-b border-slate-900">
        <div className="max-w-7xl mx-auto">
          {/* Breadcrumb & Series Badge */}
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4 text-xs">
            <div className="flex items-center gap-2 text-slate-400">
              <span className="font-semibold text-blue-400">Senam Artistik</span>
              <ChevronRight className="w-3.5 h-3.5" />
              <span className="font-semibold text-slate-200">Floor Exercise (FX)</span>
              <ChevronRight className="w-3.5 h-3.5" />
              <span className="text-white font-bold">{selectedEpisode.episodeNumber}</span>
            </div>

            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 font-bold text-[11px] border border-blue-500/30">
                {selectedEpisode.level}
              </span>
              <span className="text-slate-400 font-medium flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                {selectedEpisode.duration}
              </span>
            </div>
          </div>

          {/* MAIN VIDEO EMBED (Google Drive Stream) */}
          <div className="relative w-full aspect-video md:aspect-[21/9] lg:aspect-[16/8] bg-black rounded-2xl overflow-hidden shadow-2xl border border-slate-800">
            <iframe
              src={`https://drive.google.com/file/d/${selectedEpisode.driveFileId}/preview`}
              className="w-full h-full border-0"
              allow="autoplay; fullscreen"
              allowFullScreen
              title={selectedEpisode.title}
            />
          </div>

          {/* Video Control & Action Bar */}
          <div className="mt-5 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/60 p-4 sm:p-6 rounded-2xl border border-slate-800/80">
            <div>
              <div className="flex items-center gap-2.5 mb-1.5">
                <span className="px-2 py-0.5 rounded bg-blue-600 text-white font-extrabold text-[11px]">
                  {selectedEpisode.episodeNumber}
                </span>
                <h1 className="text-lg sm:text-2xl font-extrabold text-white tracking-tight">
                  {selectedEpisode.title}
                </h1>
              </div>
              <p className="text-xs sm:text-sm text-slate-400 max-w-3xl">
                {selectedEpisode.subtitle}
              </p>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              {/* Mark Complete Button */}
              <button
                onClick={() => toggleComplete(selectedEpisode.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all cursor-pointer ${
                  isCompleted(selectedEpisode.id)
                    ? 'bg-green-600/20 text-green-300 border border-green-500/40 hover:bg-green-600/30'
                    : 'bg-white text-slate-900 hover:bg-slate-200 shadow-sm'
                }`}
              >
                <Check className="w-4 h-4" />
                <span>
                  {isCompleted(selectedEpisode.id) ? 'Selesai Dipelajari' : 'Tandai Selesai'}
                </span>
              </button>

              {/* Open in Drive Fullscreen Link */}
              <a
                href={selectedEpisode.driveLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white font-bold text-xs border border-slate-700 transition-all"
                title="Buka langsung di Google Drive"
              >
                <FolderOpen className="w-4 h-4 text-amber-400" />
                <span className="hidden sm:inline">Buka di Drive</span>
                <ExternalLink className="w-3 h-3 text-slate-400" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* 3. EPISODES SELECTOR (NETFLIX PLAYLIST ROW) */}
      <section className="py-8 px-4 sm:px-8 bg-slate-950">
        <div className="max-w-7xl mx-auto">
          {/* Section Heading & Progress */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h2 className="text-xl font-extrabold text-white flex items-center gap-2">
                <span>Daftar Episode Seri FX (Senam Lantai)</span>
                <span className="text-xs px-2 py-0.5 rounded bg-slate-800 text-slate-400 font-normal">
                  3 Video Pembelajaran
                </span>
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Pilih episode di bawah ini untuk mengganti video yang sedang diputar.
              </p>
            </div>

            {/* Total Series Progress Bar */}
            <div className="flex items-center gap-3 bg-slate-900 px-4 py-2 rounded-xl border border-slate-800">
              <span className="text-xs font-bold text-slate-300">
                Progres Seri: <strong className="text-blue-400">{progressPercent}%</strong>
              </span>
              <div className="w-24 h-2 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
          </div>

          {/* Episode Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {fxEpisodes.map((ep) => {
              const isSelected = selectedEpisode.id === ep.id;
              const completed = isCompleted(ep.id);

              return (
                <div
                  key={ep.id}
                  onClick={() => setSelectedEpisode(ep)}
                  className={`group relative rounded-2xl overflow-hidden border transition-all duration-200 cursor-pointer flex flex-col justify-between ${
                    isSelected
                      ? 'bg-slate-900 border-blue-500 ring-2 ring-blue-500/20 shadow-lg shadow-blue-500/10'
                      : 'bg-slate-900/60 border-slate-800/80 hover:bg-slate-900 hover:border-slate-700'
                  }`}
                >
                  {/* Thumbnail & Video Badge */}
                  <div className="relative h-44 w-full bg-slate-800 overflow-hidden">
                    <Image
                      src={ep.thumbnail}
                      alt={ep.title}
                      fill
                      className="object-cover object-center group-hover:scale-105 transition-transform duration-500 opacity-80 group-hover:opacity-100"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />

                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent" />

                    {/* Active Play Icon Overlay */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div
                        className={`w-11 h-11 rounded-full flex items-center justify-center transition-all ${
                          isSelected
                            ? 'bg-blue-600 text-white scale-110 shadow-lg shadow-blue-600/40'
                            : 'bg-slate-900/80 text-slate-300 group-hover:scale-105 group-hover:bg-blue-600 group-hover:text-white'
                        }`}
                      >
                        <Play className="w-5 h-5 fill-current ml-0.5" />
                      </div>
                    </div>

                    {/* Top Episode Number Pill */}
                    <div className="absolute top-3 left-3 flex items-center gap-2">
                      <span className="px-2.5 py-1 rounded-md bg-black/80 backdrop-blur-xs text-xs font-black text-white">
                        {ep.episodeNumber}
                      </span>
                      {completed && (
                        <span className="px-2 py-0.5 rounded-md bg-green-500 text-black text-[10px] font-extrabold flex items-center gap-1">
                          <Check className="w-3 h-3 stroke-[3]" />
                          <span>TUNTAS</span>
                        </span>
                      )}
                    </div>

                    {/* Duration Badge */}
                    <div className="absolute bottom-3 right-3">
                      <span className="px-2 py-0.5 rounded bg-black/70 text-[11px] font-semibold text-slate-300">
                        {ep.duration}
                      </span>
                    </div>
                  </div>

                  {/* Card Content Info */}
                  <div className="p-4 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-1.5">
                        <span className="text-[11px] font-bold text-blue-400 uppercase tracking-wider">
                          {ep.level}
                        </span>
                        {isSelected && (
                          <span className="text-[10px] font-bold text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded">
                            ● SEDANG DIPUTAR
                          </span>
                        )}
                      </div>

                      <h3
                        className={`text-sm font-bold leading-snug line-clamp-2 ${
                          isSelected ? 'text-white' : 'text-slate-200 group-hover:text-white'
                        }`}
                      >
                        {ep.title}
                      </h3>
                      <p className="text-xs text-slate-400 line-clamp-2 mt-1.5 leading-relaxed">
                        {ep.subtitle}
                      </p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
                      <span className="text-slate-500 font-medium">Google Drive Video</span>
                      <span className="text-blue-400 font-bold group-hover:underline flex items-center gap-1">
                        <span>{isSelected ? 'Memutar' : 'Pilih Video'}</span>
                        <ChevronRight className="w-3 h-3" />
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 4. COACH TECHNIQUE & MISTAKES BREAKDOWN (PRD Section 13 & 15) */}
      <section className="py-8 px-4 sm:px-8 bg-slate-900/40 border-t border-slate-900">
        <div className="max-w-7xl mx-auto">
          {/* Sub Navigation Tabs */}
          <div className="flex items-center gap-3 border-b border-slate-800 pb-4 mb-6">
            <button
              onClick={() => setActiveTab('notes')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'notes'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-slate-900 text-slate-400 hover:text-white'
              }`}
            >
              Tips Pelatih &amp; Poin Kunci
            </button>

            <button
              onClick={() => setActiveTab('mistakes')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'mistakes'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-slate-900 text-slate-400 hover:text-white'
              }`}
            >
              Koreksi Kesalahan Umum
            </button>

            <button
              onClick={() => setActiveTab('checklist')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'checklist'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-slate-900 text-slate-400 hover:text-white'
              }`}
            >
              Checklist Penguasaan Gerakan
            </button>
          </div>

          {/* Tab Content 1: Key Points & Coach Notes */}
          {activeTab === 'notes' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
              <div className="lg:col-span-7 bg-slate-900 p-6 rounded-2xl border border-slate-800">
                <h4 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <span>Poin Kunci yang Harus Diperhatikan:</span>
                </h4>
                <ul className="space-y-3">
                  {selectedEpisode.keyPoints.map((point, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-xs sm:text-sm text-slate-300">
                      <div className="w-5 h-5 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center shrink-0 mt-0.5">
                        <Check className="w-3 h-3 stroke-[3]" />
                      </div>
                      <span className="leading-relaxed">{point}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="lg:col-span-5 bg-gradient-to-br from-blue-950/60 to-slate-900 p-6 rounded-2xl border border-blue-900/40 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider mb-2">
                    <ShieldCheck className="w-4 h-4" />
                    <span>Catatan Langsung dari Pelatih</span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-200 leading-relaxed italic">
                    &quot;{selectedEpisode.coachNote}&quot;
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-blue-900/40 flex items-center justify-between">
                  <span className="text-[11px] text-slate-400">Coach Budi S. • Pelatih Utama</span>
                  <span className="px-2 py-0.5 rounded bg-blue-600/30 text-blue-300 text-[10px] font-bold">
                    Lisensi Nasional
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Tab Content 2: Mistakes */}
          {activeTab === 'mistakes' && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-slate-900 p-5 rounded-xl border border-red-900/30">
                <div className="flex items-center gap-2 text-red-400 font-bold text-xs mb-2">
                  <AlertCircle className="w-4 h-4" />
                  <span>Kesalahan 1: Lutut Longgar</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Lutut ditekuk terlalu dini sebelum fase rotasi selesai, mengakibatkan pendaratan tidak stabil.
                </p>
              </div>

              <div className="bg-slate-900 p-5 rounded-xl border border-red-900/30">
                <div className="flex items-center gap-2 text-red-400 font-bold text-xs mb-2">
                  <AlertCircle className="w-4 h-4" />
                  <span>Kesalahan 2: Tumpuan Lemah</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Bahu tidak ditekan mengunci saat tangan menyentuh matras sehingga dorongan tubuh berkurang.
                </p>
              </div>

              <div className="bg-slate-900 p-5 rounded-xl border border-red-900/30">
                <div className="flex items-center gap-2 text-red-400 font-bold text-xs mb-2">
                  <AlertCircle className="w-4 h-4" />
                  <span>Kesalahan 3: Pendaratan Geser</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Kaki melangkah ekstra setelah mendarat karena titik pusat massa badan terlalu condong ke depan.
                </p>
              </div>
            </div>
          )}

          {/* Tab Content 3: Checklist */}
          {activeTab === 'checklist' && (
            <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800">
              <h4 className="text-sm font-bold text-white mb-3">
                Kriteria Atlet Boleh Melanjutkan ke Modul Berikutnya:
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-300">
                <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-green-400 shrink-0" />
                  <span>Mampu melakukan gerakan 5x berturut-turut tanpa jatuh</span>
                </div>
                <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-green-400 shrink-0" />
                  <span>Posisi pendaratan kokoh (stick landing) minimal 3 detik</span>
                </div>
                <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-green-400 shrink-0" />
                  <span>Kelenturan bahu dan pergelangan tangan terverifikasi</span>
                </div>
                <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-green-400 shrink-0" />
                  <span>Mendapatkan persetujuan verbal/tertulis dari Pelatih</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* 5. NETFLIX-STYLE "MORE LIKE THIS" SERIES ROW */}
      <section className="py-10 px-4 sm:px-8 bg-slate-950 border-t border-slate-900 mt-auto">
        <div className="max-w-7xl mx-auto">
          <h3 className="text-base font-extrabold text-white mb-4 flex items-center justify-between">
            <span>Seri Pembelajaran Alat Lainnya</span>
            <span className="text-xs font-semibold text-slate-500">Katalog Lengkap Senam</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {otherSeries.map((s) => (
              <div
                key={s.id}
                className="group relative rounded-2xl overflow-hidden border border-slate-800/80 bg-slate-900/40 hover:border-slate-700 transition-all flex flex-col"
              >
                <div className="relative h-36 w-full bg-slate-800 overflow-hidden">
                  <Image
                    src={s.thumbnail}
                    alt={s.title}
                    fill
                    className="object-cover object-center group-hover:scale-105 transition-transform duration-500 opacity-60 group-hover:opacity-80"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
                  <div className="absolute top-3 right-3">
                    <span className="px-2 py-0.5 rounded bg-blue-600/30 border border-blue-500/30 text-blue-300 text-[10px] font-bold">
                      {s.status}
                    </span>
                  </div>
                </div>

                <div className="p-4">
                  <h4 className="text-sm font-bold text-white group-hover:text-blue-400 transition-colors">
                    {s.title}
                  </h4>
                  <div className="mt-1 flex items-center justify-between text-xs text-slate-400">
                    <span>{s.episodesCount}</span>
                    <span>{s.level}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-6 px-4 sm:px-8 bg-black text-center text-xs text-slate-500 border-t border-slate-900">
        <p>
          Gymnastics Learning System (GLS 2.0) • Educational Series Player • Video Hosted via Google Drive
        </p>
      </footer>
    </div>
  );
}
