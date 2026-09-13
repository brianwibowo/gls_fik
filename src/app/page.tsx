'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Navbar } from '@/components/Navbar';
import { VideoCard } from '@/components/VideoCard';
import { ApparatusSection } from '@/components/landing/ApparatusSection';
import { useAuth } from '@/lib/auth';
import { getCategories, getVideosByCategory, getVideos, initializeData } from '@/lib/data';
import type { Category, Video } from '@/lib/types';
import {
  Play,
  Activity,
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  ArrowUpRight,
  ArrowDown,
  Film,
} from 'lucide-react';

// ── Horizontal Scrollable Category Video Row ──────────────────
function CategoryVideoRow({
  category,
  videos,
}: {
  category: Category;
  videos: Video[];
}) {
  const rowRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (rowRef.current) {
      const scrollAmount = 320;
      rowRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  return (
    <div id={`section-${category.id}`} className="space-y-3 scroll-mt-20">
      {/* Row Header */}
      <div className="flex items-end justify-between border-b border-[#222] pb-3">
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight">
            {category.name}
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">{category.description}</p>
        </div>

        {/* Scroll Controls */}
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-xs text-slate-500 font-medium hidden sm:inline mr-1">
            {videos.length} video
          </span>
          <button
            onClick={() => scroll('left')}
            aria-label={`Scroll kiri ${category.name}`}
            className="w-7 h-7 rounded-md bg-[#181818] border border-[#333] hover:border-slate-400 text-slate-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => scroll('right')}
            aria-label={`Scroll kanan ${category.name}`}
            className="w-7 h-7 rounded-md bg-[#181818] border border-[#333] hover:border-slate-400 text-slate-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Video Row */}
      {videos.length > 0 ? (
        <div
          ref={rowRef}
          className="flex gap-4 overflow-x-auto pb-3 pt-1 snap-x snap-mandatory scroll-smooth no-scrollbar"
        >
          {videos.map((video) => (
            <div key={video.id} className="w-[270px] sm:w-[310px] shrink-0 snap-start">
              <VideoCard video={video} categoryName={category.name} />
            </div>
          ))}
        </div>
      ) : (
        <div className="p-4 rounded-lg bg-[#141414] border border-[#222] flex items-center gap-3 text-xs text-slate-400">
          <Film className="w-4 h-4 text-slate-500 shrink-0" />
          <span>Materi video untuk nomor alat ini belum diunggah. Admin dapat menambahkannya via Admin Panel.</span>
        </div>
      )}
    </div>
  );
}

// ── Main Page Component ───────────────────────────────────────
export default function HomePage() {
  const { isReady } = useAuth();
  const [categories, setCategories] = useState<Category[]>([]);
  const [videosByCategory, setVideosByCategory] = useState<Record<string, Video[]>>({});
  const [featuredVideo, setFeaturedVideo] = useState<Video | null>(null);
  const [featuredCategory, setFeaturedCategory] = useState<Category | null>(null);
  const [activeApparatusId, setActiveApparatusId] = useState<string>('cat-fx');
  const [activeFilter, setActiveFilter] = useState<string>('all');

  useEffect(() => {
    initializeData();
    const cats = getCategories();
    setCategories(cats);

    const vbc: Record<string, Video[]> = {};
    for (const cat of cats) {
      vbc[cat.id] = getVideosByCategory(cat.id);
    }
    setVideosByCategory(vbc);

    const allVids = getVideos();
    const free = allVids.find((v) => v.isFree);
    if (free) {
      setFeaturedVideo(free);
      const fc = cats.find((c) => c.id === free.categoryId);
      if (fc) setFeaturedCategory(fc);
    }
  }, []);

  if (!isReady) return null;

  const filteredCategories =
    activeFilter === 'all'
      ? categories
      : categories.filter((c) => c.id === activeFilter);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <Navbar />

      {/* ── Fullscreen Cinematic Video Hero (Studiova Style) ── */}
      <section className="relative w-full h-screen min-h-[640px] flex flex-col justify-between overflow-hidden bg-black">
        {/* Background Video */}
        <video
          src="/images/gymnastic.mp4"
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover pointer-events-none"
        />

        {/* Ambient Dark Overlays for Readability & Cinematic Mood */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/50 to-transparent pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-transparent to-transparent pointer-events-none" />
        <div className="absolute inset-0 bg-black/25 pointer-events-none" />

        {/* Top spacer so header content is not overlapped */}
        <div className="h-20" />

        {/* Bottom Hero Editorial Typography (Studiova Style) */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pb-12 sm:pb-16 mt-auto">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
            {/* Left: Tagline + Giant Title with Pill Button */}
            <div className="max-w-3xl space-y-4">
              {/* Star Icon + Editorial Tagline */}
              <div className="flex items-start gap-3">
                <svg
                  className="w-5 h-5 sm:w-6 sm:h-6 text-[#c1ff72] shrink-0 mt-0.5"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path d="M12 2L13.8 8.2L20 6.5L16.2 12L20 17.5L13.8 15.8L12 22L10.2 15.8L4 17.5L7.8 12L4 6.5L10.2 8.2L12 2Z" />
                </svg>
                <p className="text-xs sm:text-sm text-slate-200 font-medium leading-relaxed max-w-md">
                  Sistem Pembelajaran Senam Artistik{' '}
                  <span className="text-[#c1ff72] font-bold">Fakultas Ilmu Keolahragaan</span> untuk
                  kurikulum peragaan gerak, teknik awalan, hingga stick landing.
                </p>
              </div>

              {/* Giant Brand Typography + Accent Arrow Pill */}
              <div className="flex flex-wrap items-baseline gap-3 sm:gap-5 pt-1">
                <h1 className="text-6xl sm:text-8xl md:text-9xl font-black text-white tracking-tighter leading-none select-none">
                  GLS FIK.
                </h1>
                <a
                  href="#nomor-alat"
                  aria-label="Jelajahi 6 nomor alat senam"
                  className="inline-flex items-center justify-center w-14 sm:w-20 h-8 sm:h-11 rounded-full bg-[#c1ff72] hover:bg-[#b0f555] hover:scale-105 active:scale-95 transition-all text-[#1f2a2e] shadow-xl group cursor-pointer"
                  title="Jelajahi Nomor Alat"
                >
                  <ArrowUpRight className="w-5 sm:w-6 h-5 sm:h-6 stroke-[2.5] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </a>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-3">
                {featuredVideo && (
                  <Link
                    href={`/watch/${featuredVideo.id}`}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-white font-bold text-xs sm:text-sm transition-all"
                  >
                    <Play className="w-3.5 h-3.5 fill-white" />
                    <span>Tonton Video Gratis ({featuredVideo.title})</span>
                  </Link>
                )}
                <a
                  href="#nomor-alat"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-black/40 hover:bg-black/60 backdrop-blur-md border border-white/15 text-slate-300 hover:text-white text-xs sm:text-sm font-medium transition-all"
                >
                  <span>Daftar 6 Alat MAG</span>
                  <ArrowRight className="w-4 h-4" />
                </a>
              </div>
            </div>

            {/* Right: Round Scroll Down Button */}
            <div className="hidden lg:flex flex-col items-center gap-2">
              <a
                href="#nomor-alat"
                className="w-14 h-14 rounded-full bg-[#c1ff72] hover:bg-[#b0f555] text-[#1f2a2e] flex items-center justify-center shadow-2xl hover:scale-110 active:scale-95 transition-all cursor-pointer group"
                aria-label="Scroll ke Nomor Alat"
              >
                <ArrowDown className="w-6 h-6 stroke-[2.5] group-hover:translate-y-0.5 transition-transform" />
              </a>
              <span className="text-[11px] font-bold text-slate-400 tracking-wider uppercase">
                Nomor Alat
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ── Apparatus Section (Scrollable & Clean Coaching Guide) ── */}
      <ApparatusSection
        activeId={activeApparatusId}
        onSelectApparatus={(id) => {
          setActiveApparatusId(id);
          setActiveFilter(id);
          const el = document.getElementById(`section-${id}`);
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }}
      />

      {/* ── Video Catalog (Horizontal Scrollable Rows) ── */}
      <main id="katalog-video" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
        {/* Catalog Header & Filter Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#222] pb-4">
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight">
              Katalog Materi Video
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Geser ke samping untuk melihat seluruh daftar episode.
            </p>
          </div>

          {/* Quick Filter Buttons */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
            <button
              onClick={() => setActiveFilter('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                activeFilter === 'all'
                  ? 'bg-blue-600 text-white'
                  : 'bg-[#181818] text-slate-300 hover:text-white border border-[#2a2a2a]'
              }`}
            >
              Semua
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => {
                  setActiveFilter(cat.id);
                  setActiveApparatusId(cat.id);
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                  activeFilter === cat.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-[#181818] text-slate-300 hover:text-white border border-[#2a2a2a]'
                }`}
              >
                {cat.name.split(' ')[0]}
              </button>
            ))}
          </div>
        </div>

        {/* Video Rows */}
        <div className="space-y-12">
          {filteredCategories.map((cat) => (
            <CategoryVideoRow
              key={cat.id}
              category={cat}
              videos={videosByCategory[cat.id] || []}
            />
          ))}
        </div>
      </main>

      {/* ── Footer ── */}
      <footer className="border-t border-[#222] bg-[#0c0c0c] py-8 text-center text-xs text-slate-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-2">
          <div className="flex items-center justify-center gap-2">
            <div className="w-5 h-5 rounded bg-blue-600 flex items-center justify-center text-white">
              <Activity className="w-3 h-3 stroke-[2.5]" />
            </div>
            <span className="font-bold text-white">GLS FIK</span>
            <span>—</span>
            <span>Gymnastics Learning System</span>
          </div>
          <p className="text-[11px] text-slate-400">
            Platform kurikulum senam digital untuk pelatih, atlet, dan mahasiswa Fakultas Ilmu Keolahragaan.
          </p>
          <p className="text-[10px] text-slate-400 pt-2">
            &copy; {new Date().getFullYear()} GLS FIK.
          </p>
        </div>
      </footer>
    </div>
  );
}
