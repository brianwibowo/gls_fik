'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Play,
  Check,
  Plus,
  ThumbsUp,
  ChevronDown,
  Volume2,
  VolumeX,
  Info,
  ArrowLeft,
  Search,
  Bell,
  Sparkles,
  Award,
  Clock,
  FolderOpen,
  ExternalLink,
  ChevronRight,
  RotateCcw,
  Share2,
  Sliders,
  CheckCircle2,
  Layers,
  AlertTriangle,
} from 'lucide-react';

// Data Seri FX Floor Exercise dari Google Drive
const episodes = [
  {
    id: 1,
    episodeNum: 1,
    title: 'Fondasi, Postur & Awalan Senam Lantai',
    synopsis:
      'Langkah pertama atlet dalam menguasai senam lantai. Mempelajari koreksi postur tubuh lurus, tumpuan ujung kaki (toe point), ayunan lengan ritmis, serta konsentrasi sebelum melakukan rangkaian lari.',
    duration: '03:45',
    level: 'Dasar (Beginner)',
    driveFileId: '12JG_YaH6ADE4xVqgskKQY-rx79Dht7KM',
    driveLink: 'https://drive.google.com/file/d/12JG_YaH6ADE4xVqgskKQY-rx79Dht7KM/view?usp=share_link',
    thumbnail: '/images/apparatus-floor.webp',
    progress: 100, // 100% watched
    coachAdvice: 'Fokus pada kekuatan pergelangan kaki dan pastikan pandangan mata selalu terkunci 45 derajat ke depan.',
    commonMistake: 'Bahu terlalu tegang dan lutut tidak dikunci lurus saat awalan.',
  },
  {
    id: 2,
    episodeNum: 2,
    title: 'Rangkaian Eksekusi & Dinamika Gerak FX',
    synopsis:
      'Memasuki inti gerakan akrobatik senam lantai. Pembahasan mendalam mengenai tolakan tangan ke matras, transisi rotasi poros tubuh di udara, serta menjaga ritme kecepatan agar tidak kehilangan daya dorong.',
    duration: '04:12',
    level: 'Menengah (Intermediate)',
    driveFileId: '10pPKxlH8e6GKSI79bTbiCQ7d_YQP3xkD',
    driveLink: 'https://drive.google.com/file/d/10pPKxlH8e6GKSI79bTbiCQ7d_YQP3xkD/view?usp=share_link',
    thumbnail: '/images/hero-gymnast.webp',
    progress: 45, // 45% watched
    coachAdvice: 'Kunci otot perut (core) dan jangan ragu saat melakukan dorongan tangan ke matras lantai.',
    commonMistake: 'Kepala ditekuk terlalu cepat sehingga merusak poros putaran badan.',
  },
  {
    id: 3,
    episodeNum: 3,
    title: 'Koreksi Pendaratan (Stick Landing) & Evaluasi Pelatih',
    synopsis:
      'Fase krusial penentu poin tertinggi senam. Teknik peredaman hentakan lutut saat mendarat di matras tanpa langkah tambahan, keseimbangan lengan V, dan salam penutup artistik.',
    duration: '05:08',
    level: 'Mahir (Advanced)',
    driveFileId: '1saHh0xfJRT3tuIKyByGCbAzsMnoa2HXI',
    driveLink: 'https://drive.google.com/file/d/1saHh0xfJRT3tuIKyByGCbAzsMnoa2HXI/view?usp=share_link',
    thumbnail: '/images/feature-progress.webp',
    progress: 0, // not watched
    coachAdvice: 'Tahan posisi mendarat minimal 3 detik untuk melatih daya ingat otot (muscle memory).',
    commonMistake: 'Lutut ditekuk melebihi 90 derajat atau badan condong ke depan.',
  },
];

// Seri Rekomendasi (More Like This)
const moreLikeThis = [
  {
    id: 'beam',
    title: 'Balance Beam: Acro & Dance Series',
    match: '98% Cocok',
    rating: '13+',
    episodes: '4 Episode',
    tags: ['Keseimbangan', 'Balok 10cm', 'Putaran'],
    thumbnail: '/images/apparatus-beam.webp',
  },
  {
    id: 'vault',
    title: 'Vault Table: Yurchenko Progression',
    match: '95% Cocok',
    rating: '13+',
    episodes: '3 Episode',
    tags: ['Kecepatan', 'Meja Lompat', 'Tolakan'],
    thumbnail: '/images/feature-structured.webp',
  },
  {
    id: 'bars',
    title: 'Uneven Bars: Release & Catch Moves',
    match: '92% Cocok',
    rating: '16+',
    episodes: '5 Episode',
    tags: ['Kekuatan Bahu', 'Palang Bertingkat'],
    thumbnail: '/images/feature-video.webp',
  },
];

export default function NetflixDashboard() {
  const [activeEpisode, setActiveEpisode] = useState(episodes[0]);
  const [isPlayingCinema, setIsPlayingCinema] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeTab, setActiveTab] = useState<'episodes' | 'details' | 'more'>('episodes');
  const [myList, setMyList] = useState(false);
  const [isLiked, setIsLiked] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handlePlayEpisode = (ep: typeof episodes[0]) => {
    setActiveEpisode(ep);
    setIsPlayingCinema(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNextEpisode = () => {
    const nextIdx = (activeEpisode.episodeNum % episodes.length);
    setActiveEpisode(episodes[nextIdx]);
  };

  return (
    <div className="min-h-screen bg-[#141414] text-white font-sans selection:bg-red-600 selection:text-white pb-20">
      {/* 1. NETFLIX SIGNATURE TOP NAVIGATION */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-300 px-4 sm:px-12 py-4 flex items-center justify-between ${
          isScrolled || isPlayingCinema
            ? 'bg-[#141414]/95 backdrop-blur-md shadow-2xl border-b border-white/10'
            : 'bg-gradient-to-b from-black/90 via-black/50 to-transparent'
        }`}
      >
        <div className="flex items-center gap-8 sm:gap-10">
          {/* Netflix Style Brand Logo */}
          <Link href="/" className="flex items-center gap-1.5 group">
            <span className="text-2xl sm:text-3xl font-black tracking-tighter text-[#E50914] group-hover:scale-105 transition-transform drop-shadow-[0_2px_8px_rgba(229,9,20,0.6)]">
              GLS
            </span>
            <span className="text-[10px] font-bold tracking-widest text-slate-400 uppercase ml-1 hidden sm:inline">
              SERIES
            </span>
          </Link>

          {/* Nav Menu Links */}
          <div className="hidden md:flex items-center gap-6 text-sm text-slate-300 font-medium">
            <button
              onClick={() => {
                setIsPlayingCinema(false);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="text-white font-bold hover:text-white transition-colors"
            >
              Beranda
            </button>
            <span className="text-white font-semibold flex items-center gap-1">
              Floor Exercise (FX)
              <span className="w-1.5 h-1.5 rounded-full bg-[#E50914]" />
            </span>
            <span className="text-slate-400 hover:text-white transition-colors cursor-pointer">
              Balance Beam
            </span>
            <span className="text-slate-400 hover:text-white transition-colors cursor-pointer">
              Vault
            </span>
            <span className="text-slate-400 hover:text-white transition-colors cursor-pointer">
              Daftar Latihan Saya
            </span>
          </div>
        </div>

        {/* Right Nav: Drive Folder, Search, Notification, Coach Profile */}
        <div className="flex items-center gap-4 sm:gap-6 text-slate-300">
          <a
            href="https://drive.google.com/drive/folders/1HLcaJkufKFwbiUcttAa-XqNic-NbBNtX?usp=share_link"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-md bg-white/10 hover:bg-white/20 text-xs font-semibold text-white border border-white/10 transition-colors"
          >
            <FolderOpen className="w-4 h-4 text-amber-400" />
            <span>Folder Drive FX</span>
            <ExternalLink className="w-3 h-3 opacity-60" />
          </a>

          <Search className="w-5 h-5 hover:text-white cursor-pointer transition-colors" />
          <Bell className="w-5 h-5 hover:text-white cursor-pointer transition-colors hidden sm:block" />

          {/* Profile Dropdown (Netflix Square Avatar) */}
          <div className="flex items-center gap-2 group cursor-pointer">
            <div className="w-8 h-8 rounded bg-gradient-to-tr from-blue-700 to-indigo-500 flex items-center justify-center font-black text-xs text-white shadow-md border border-white/20">
              CB
            </div>
            <div className="hidden sm:flex flex-col text-left">
              <span className="text-xs font-bold text-white leading-none">Coach Budi</span>
              <span className="text-[10px] text-green-400 font-semibold leading-none mt-0.5">
                ● Pelatih
              </span>
            </div>
            <ChevronDown className="w-3.5 h-3.5 group-hover:rotate-180 transition-transform" />
          </div>
        </div>
      </nav>

      {/* 2. MAIN VIEW: THEATER CINEMA PLAYER (IF PLAYING) OR CINEMATIC BILLBOARD HERO */}
      {isPlayingCinema ? (
        /* NETFLIX THEATER VIDEO PLAYER VIEW */
        <section className="pt-20 px-4 sm:px-12 max-w-7xl mx-auto">
          {/* Back to Browse Bar */}
          <div className="flex items-center justify-between py-4 text-sm text-slate-400">
            <button
              onClick={() => setIsPlayingCinema(false)}
              className="flex items-center gap-2 text-white hover:text-[#E50914] font-bold transition-colors cursor-pointer group"
            >
              <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
              <span>Kembali ke Ringkasan Seri</span>
            </button>

            <div className="flex items-center gap-3 text-xs">
              <span className="text-slate-400">Sedang Memutar:</span>
              <span className="bg-[#E50914] text-white px-2.5 py-0.5 rounded font-extrabold text-[11px]">
                EPISODE {activeEpisode.episodeNum}
              </span>
            </div>
          </div>

          {/* Big Cinema Google Drive Player Frame */}
          <div className="relative w-full aspect-video md:aspect-[21/9] lg:aspect-[16/8.5] bg-black rounded-xl overflow-hidden shadow-2xl border border-white/15">
            <iframe
              src={`https://drive.google.com/file/d/${activeEpisode.driveFileId}/preview`}
              className="w-full h-full border-0"
              allow="autoplay; fullscreen"
              allowFullScreen
              title={activeEpisode.title}
            />
          </div>

          {/* Netflix Player Under-bar Info */}
          <div className="mt-6 flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 bg-[#181818] rounded-xl border border-white/10">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className="text-xs font-black text-[#E50914] tracking-wider uppercase">
                  GLS ORIGINAL • SENAM LANTAI (FX)
                </span>
                <span className="text-xs px-2 py-0.5 rounded bg-white/10 text-slate-300 font-semibold">
                  {activeEpisode.duration}
                </span>
                <span className="text-xs text-green-400 font-bold">99% Cocok untuk Latihan</span>
              </div>
              <h1 className="text-xl sm:text-3xl font-extrabold text-white tracking-tight">
                Episode {activeEpisode.episodeNum}: {activeEpisode.title}
              </h1>
              <p className="text-sm text-slate-300 mt-2 max-w-4xl leading-relaxed font-normal">
                {activeEpisode.synopsis}
              </p>
            </div>

            {/* Quick Next Episode Action */}
            <div className="flex items-center gap-3 shrink-0">
              <button
                onClick={handleNextEpisode}
                className="flex items-center gap-2 px-5 py-3 rounded-lg bg-white text-black font-bold text-sm hover:bg-white/90 active:scale-95 transition-all shadow-md cursor-pointer"
              >
                <span>Episode Berikutnya</span>
                <ChevronRight className="w-4 h-4" />
              </button>

              <a
                href={activeEpisode.driveLink}
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 rounded-lg bg-white/10 hover:bg-white/20 text-white border border-white/10 transition-colors"
                title="Buka File di Google Drive"
              >
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>
        </section>
      ) : (
        /* NETFLIX SIGNATURE BILLBOARD HERO BANNER */
        <section className="relative w-full h-[80vh] min-h-[580px] max-h-[750px] overflow-hidden flex items-end">
          {/* Hero Backdrop Image with Authentic Netflix Vignette Gradients */}
          <div className="absolute inset-0 z-0">
            <Image
              src="/images/apparatus-floor.webp"
              alt="Floor Exercise Gymnastics Learning System"
              fill
              priority
              className="object-cover object-top brightness-90 transform scale-105"
            />
            {/* Multi-layered Netflix dark gradients */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#141414] via-[#141414]/60 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#141414] via-[#141414]/30 to-transparent" />
            <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-[#141414]/90 to-transparent" />
          </div>

          {/* Hero Content Information */}
          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-12 pb-16 w-full">
            <div className="max-w-2xl">
              {/* N SERIES Badge */}
              <div className="flex items-center gap-2.5 mb-3">
                <span className="text-xl font-black text-[#E50914] tracking-tighter">N</span>
                <span className="text-xs font-black tracking-[0.25em] text-slate-300 uppercase">
                  SERI PEMBELAJARAN SENAM
                </span>
              </div>

              {/* Big Cinematic Title */}
              <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight leading-[1.05] drop-shadow-lg">
                FLOOR EXERCISE
                <span className="block text-2xl sm:text-4xl font-extrabold text-blue-400 mt-1">
                  Modul Senam Lantai (FX)
                </span>
              </h1>

              {/* Meta tags: Top 10, Rating, Episodes, HD */}
              <div className="flex flex-wrap items-center gap-3 my-4 text-xs sm:text-sm font-semibold">
                <span className="px-2 py-0.5 bg-[#E50914] text-white font-extrabold rounded text-xs flex items-center gap-1">
                  TOP 1
                </span>
                <span className="text-green-400 font-bold">99% Cocok</span>
                <span className="border border-white/40 px-1.5 py-0.5 rounded text-xs">U/ 8-22 Th</span>
                <span className="text-slate-300">3 Episode Video</span>
                <span className="border border-white/40 px-1.5 py-0.5 rounded text-xs text-slate-300">
                  Full HD
                </span>
                <span className="text-amber-400 font-bold">Google Drive Host</span>
              </div>

              {/* Description */}
              <p className="text-sm sm:text-base text-slate-200 line-clamp-3 leading-relaxed drop-shadow">
                Panduan komprehensif pembelajaran teknik senam lantai (FX) dipandu langsung oleh Pelatih Berlisensi. Dari sikap awalan, tolakan tangan, dinamika rotasi poros di matras, hingga pendaratan sempurna tanpa cedera.
              </p>

              {/* Action Buttons: Play & More Info */}
              <div className="flex items-center gap-4 mt-6">
                <button
                  onClick={() => handlePlayEpisode(episodes[0])}
                  className="flex items-center gap-3 px-7 sm:px-9 py-3.5 rounded-lg bg-white text-black font-black text-base hover:bg-white/90 active:scale-95 transition-all shadow-xl cursor-pointer"
                >
                  <Play className="w-6 h-6 fill-black" />
                  <span>Putar Sekarang</span>
                </button>

                <button
                  onClick={() => {
                    const el = document.getElementById('episodes-section');
                    el?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="flex items-center gap-2.5 px-6 sm:px-8 py-3.5 rounded-lg bg-white/20 hover:bg-white/30 text-white font-bold text-base backdrop-blur-md border border-white/20 transition-all cursor-pointer"
                >
                  <Info className="w-5 h-5" />
                  <span>Daftar Episode</span>
                </button>

                <button
                  onClick={() => setMyList(!myList)}
                  className="w-12 h-12 rounded-full border-2 border-white/50 hover:border-white flex items-center justify-center text-white bg-black/40 backdrop-blur-md transition-colors"
                  title="Simpan ke Daftar Saya"
                >
                  {myList ? <Check className="w-6 h-6 text-green-400" /> : <Plus className="w-6 h-6" />}
                </button>

                <button
                  onClick={() => setIsLiked(!isLiked)}
                  className="w-12 h-12 rounded-full border-2 border-white/50 hover:border-white flex items-center justify-center text-white bg-black/40 backdrop-blur-md transition-colors"
                  title="Sukai Seri Ini"
                >
                  <ThumbsUp className={`w-5 h-5 ${isLiked ? 'text-blue-400 fill-blue-400' : ''}`} />
                </button>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 3. NETFLIX EPISODES & SERIES CONTENT SECTION */}
      <section id="episodes-section" className="max-w-7xl mx-auto px-4 sm:px-12 mt-8">
        {/* Navigation Tabs (Episodes, Details, More Like This) */}
        <div className="flex items-center gap-8 border-b border-white/15 pb-4 mb-8 text-base sm:text-lg font-bold">
          <button
            onClick={() => setActiveTab('episodes')}
            className={`relative pb-4 transition-colors cursor-pointer ${
              activeTab === 'episodes'
                ? 'text-white after:absolute after:bottom-0 after:left-0 after:right-0 after:h-1 after:bg-[#E50914]'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Episode Seri FX
          </button>

          <button
            onClick={() => setActiveTab('details')}
            className={`relative pb-4 transition-colors cursor-pointer ${
              activeTab === 'details'
                ? 'text-white after:absolute after:bottom-0 after:left-0 after:right-0 after:h-1 after:bg-[#E50914]'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Tips Pelatih &amp; Catatan Teknik
          </button>

          <button
            onClick={() => setActiveTab('more')}
            className={`relative pb-4 transition-colors cursor-pointer ${
              activeTab === 'more'
                ? 'text-white after:absolute after:bottom-0 after:left-0 after:right-0 after:h-1 after:bg-[#E50914]'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Seri Alat Lainnya
          </button>
        </div>

        {/* TAB 1: NETFLIX EPISODE LIST ROWS */}
        {activeTab === 'episodes' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <span className="text-lg font-extrabold text-white">Season 1: Floor Exercise</span>
                <span className="text-xs px-2 py-0.5 rounded bg-white/10 text-slate-400 font-semibold">
                  3 Video Lengkap
                </span>
              </div>
              <span className="text-xs text-slate-400 hidden sm:inline">
                Sumber Video: Google Drive Cloud Stream
              </span>
            </div>

            {episodes.map((ep) => {
              const isCurrent = activeEpisode.id === ep.id;

              return (
                <div
                  key={ep.id}
                  onClick={() => handlePlayEpisode(ep)}
                  className={`group relative p-4 sm:p-6 rounded-xl transition-all duration-200 cursor-pointer border flex flex-col md:flex-row md:items-center gap-6 ${
                    isCurrent && isPlayingCinema
                      ? 'bg-[#222222] border-[#E50914] ring-1 ring-[#E50914]'
                      : 'bg-[#181818] border-white/5 hover:bg-[#202020] hover:border-white/20'
                  }`}
                >
                  {/* Big Netflix Episode Number */}
                  <div className="hidden sm:flex text-2xl sm:text-3xl font-black text-slate-500 group-hover:text-white w-8 shrink-0 justify-center">
                    {ep.episodeNum}
                  </div>

                  {/* Video Thumbnail with Play Overlay & Progress Bar */}
                  <div className="relative w-full md:w-60 h-36 rounded-lg overflow-hidden bg-slate-800 shrink-0">
                    <Image
                      src={ep.thumbnail}
                      alt={ep.title}
                      fill
                      className="object-cover object-center group-hover:scale-105 transition-transform duration-500 opacity-80 group-hover:opacity-100"
                      sizes="(max-width: 768px) 100vw, 240px"
                    />

                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

                    {/* Centered Netflix Play Icon */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div
                        className={`w-12 h-12 rounded-full flex items-center justify-center border-2 border-white/80 transition-all ${
                          isCurrent && isPlayingCinema
                            ? 'bg-[#E50914] text-white scale-110 border-[#E50914]'
                            : 'bg-black/60 text-white group-hover:scale-110 group-hover:bg-[#E50914] group-hover:border-[#E50914]'
                        }`}
                      >
                        <Play className="w-5 h-5 fill-current ml-0.5" />
                      </div>
                    </div>

                    {/* Duration Badge */}
                    <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded bg-black/80 text-[10px] font-bold text-slate-300">
                      {ep.duration}
                    </div>

                    {/* Red Netflix Progress Bar at bottom */}
                    {ep.progress > 0 && (
                      <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20">
                        <div
                          className="h-full bg-[#E50914]"
                          style={{ width: `${ep.progress}%` }}
                        />
                      </div>
                    )}
                  </div>

                  {/* Episode Description & Details */}
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex flex-wrap items-center justify-between gap-2 mb-1.5">
                        <h3 className="text-base sm:text-lg font-bold text-white group-hover:text-red-400 transition-colors">
                          {ep.episodeNum}. {ep.title}
                        </h3>
                        <span className="text-xs font-bold text-slate-400">{ep.duration}</span>
                      </div>

                      <p className="text-xs sm:text-sm text-slate-400 leading-relaxed line-clamp-2 sm:line-clamp-3">
                        {ep.synopsis}
                      </p>
                    </div>

                    {/* Footer tags */}
                    <div className="mt-3 flex items-center gap-3 text-xs">
                      <span className="px-2 py-0.5 rounded bg-white/10 text-slate-300 font-semibold text-[11px]">
                        {ep.level}
                      </span>
                      <span className="text-blue-400 font-semibold flex items-center gap-1 group-hover:underline">
                        <span>▶ Tonton Sekarang</span>
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* TAB 2: COACH TECHNIQUE & MISTAKES DETAILS */}
        {activeTab === 'details' && (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 bg-[#181818] p-6 sm:p-10 rounded-2xl border border-white/10">
            <div className="md:col-span-7 space-y-6">
              <div>
                <span className="text-xs font-bold text-[#E50914] uppercase tracking-wider">
                  Evaluasi Materi
                </span>
                <h3 className="text-xl font-bold text-white mt-1">
                  Catatan Pelatih &amp; Panduan Gerakan
                </h3>
              </div>

              <div className="p-4 rounded-xl bg-blue-950/40 border border-blue-900/50">
                <div className="flex items-center gap-2 text-blue-400 font-bold text-xs uppercase tracking-wider mb-1.5">
                  <Sparkles className="w-4 h-4" />
                  <span>Tips Coach Budi Santoso</span>
                </div>
                <p className="text-sm text-slate-200 leading-relaxed italic">
                  &quot;{activeEpisode.coachAdvice}&quot;
                </p>
              </div>

              <div className="p-4 rounded-xl bg-red-950/30 border border-red-900/40">
                <div className="flex items-center gap-2 text-red-400 font-bold text-xs uppercase tracking-wider mb-1.5">
                  <AlertTriangle className="w-4 h-4" />
                  <span>Kesalahan Umum yang Harus Dihindari</span>
                </div>
                <p className="text-sm text-slate-200 leading-relaxed">
                  {activeEpisode.commonMistake}
                </p>
              </div>
            </div>

            <div className="md:col-span-5 border-t md:border-t-0 md:border-l border-white/10 pt-6 md:pt-0 md:pl-8 flex flex-col justify-between">
              <div>
                <h4 className="text-sm font-bold text-slate-300 uppercase tracking-wider mb-4">
                  Tentang Modul Ini
                </h4>
                <div className="space-y-3 text-xs text-slate-400">
                  <p>
                    <span className="text-white font-semibold">Pelatih Utama:</span> Coach Budi Santoso (Lisensi Nasional)
                  </p>
                  <p>
                    <span className="text-white font-semibold">Nomor Alat:</span> Floor Exercise (Senam Lantai)
                  </p>
                  <p>
                    <span className="text-white font-semibold">Target Atlet:</span> Usia 8 - 22 Tahun
                  </p>
                  <p>
                    <span className="text-white font-semibold">Kategori:</span> Rangkaian Akrobatik &amp; Keseimbangan
                  </p>
                  <p>
                    <span className="text-white font-semibold">Sumber File:</span> Google Drive Shared Directory
                  </p>
                </div>
              </div>

              <div className="mt-8 pt-4 border-t border-white/10">
                <a
                  href="https://drive.google.com/drive/folders/1HLcaJkufKFwbiUcttAa-XqNic-NbBNtX?usp=share_link"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-lg bg-[#E50914] text-white font-bold text-xs hover:bg-red-700 transition-colors"
                >
                  <FolderOpen className="w-4 h-4" />
                  <span>Buka Folder Drive Materi FX</span>
                </a>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: MORE LIKE THIS (NETFLIX TILES) */}
        {activeTab === 'more' && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {moreLikeThis.map((item) => (
              <div
                key={item.id}
                className="group relative rounded-xl overflow-hidden bg-[#181818] border border-white/10 hover:scale-[1.03] transition-all duration-300 cursor-pointer flex flex-col justify-between"
              >
                <div className="relative h-44 w-full bg-slate-800">
                  <Image
                    src={item.thumbnail}
                    alt={item.title}
                    fill
                    className="object-cover object-center group-hover:brightness-110"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#181818] via-transparent to-transparent" />
                  <div className="absolute top-3 right-3 px-2 py-0.5 rounded bg-black/80 text-[11px] font-bold text-white">
                    {item.episodes}
                  </div>
                </div>

                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-green-400 font-bold text-xs">{item.match}</span>
                      <span className="border border-white/40 px-1 py-0.2 rounded text-[10px] text-slate-300">
                        {item.rating}
                      </span>
                    </div>

                    <h4 className="text-base font-bold text-white group-hover:text-red-400 transition-colors">
                      {item.title}
                    </h4>

                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {item.tags.map((t, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 rounded bg-white/10 text-[10px] text-slate-300"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="mt-5 pt-3 border-t border-white/10 flex items-center justify-between text-xs text-slate-400">
                    <span>Segera Tayang</span>
                    <button className="text-white font-bold group-hover:text-[#E50914] flex items-center gap-1">
                      <span>Detail</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* 4. NETFLIX FOOTER */}
      <footer className="max-w-7xl mx-auto px-4 sm:px-12 mt-20 pt-10 border-t border-white/10 text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <span className="font-bold text-slate-400">Gymnastics Learning System (GLS)</span>
          <span>•</span>
          <span>LMS Video Education Series</span>
        </div>
        <p>© {new Date().getFullYear()} GLS FIK. All rights reserved.</p>
      </footer>
    </div>
  );
}
