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

      {/* ── Direct, Functional Hero Section (No AI slop glows or buzzwords) ── */}
      <section className="border-b border-[#262626] bg-[#0e0e0e] py-10 sm:py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left: Real Project Mission */}
            <div className="lg:col-span-7 space-y-4">
              <span className="text-xs font-bold text-blue-400 tracking-wider uppercase">
                Platform Video Senam Artistik FIK
              </span>

              <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight leading-tight">
                Modul Pembelajaran & Video Drill Senam Artistik
              </h1>

              <p className="text-sm text-slate-300 leading-relaxed max-w-xl">
                Kurikulum terstruktur untuk pelatih, atlet, dan mahasiswa Fakultas Ilmu Keolahragaan.
                Tonton video peragaan teknik gerak nomor alat dari awalan, eksekusi, hingga pendaratan matras.
              </p>

              <div className="flex flex-wrap items-center gap-3 pt-2">
                {featuredVideo && (
                  <Link
                    href={`/watch/${featuredVideo.id}`}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm transition-colors"
                  >
                    <Play className="w-4 h-4 fill-white" />
                    <span>Tonton Video Gratis</span>
                  </Link>
                )}
                <a
                  href="#katalog-video"
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#1a1a1a] hover:bg-[#252525] border border-[#333] text-slate-200 font-semibold text-sm transition-colors"
                >
                  <span>Daftar Materi</span>
                  <ArrowRight className="w-4 h-4" />
                </a>
              </div>
            </div>

            {/* Right: Featured Video Preview Card */}
            {featuredVideo && (
              <div className="lg:col-span-5">
                <div className="bg-[#141414] rounded-xl border border-[#2a2a2a] p-3.5">
                  <div className="relative aspect-video w-full rounded-lg overflow-hidden bg-black mb-3">
                    <Image
                      src={featuredVideo.thumbnail}
                      alt={featuredVideo.title}
                      fill
                      className="object-cover object-center"
                      sizes="480px"
                    />
                    <div className="absolute top-2 left-2">
                      <span className="px-2 py-0.5 rounded bg-emerald-600 text-[10px] font-bold text-white uppercase tracking-wider">
                        Gratis Ditonton
                      </span>
                    </div>
                    <Link
                      href={`/watch/${featuredVideo.id}`}
                      className="absolute inset-0 flex items-center justify-center bg-black/30 hover:bg-black/15 transition-colors cursor-pointer group"
                    >
                      <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-transform">
                        <Play className="w-5 h-5 fill-white ml-0.5" />
                      </div>
                    </Link>
                  </div>

                  <div>
                    <div className="flex items-center gap-2 text-[11px] text-slate-400 font-medium mb-1">
                      <span>Episode {featuredVideo.episodeNum}</span>
                      <span>•</span>
                      <span>Level {featuredVideo.level}</span>
                      <span>•</span>
                      <span>{featuredVideo.duration}</span>
                    </div>
                    <h3 className="text-sm font-bold text-white line-clamp-1">
                      {featuredVideo.title}
                    </h3>
                    <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                      {featuredVideo.description}
                    </p>
                  </div>
                </div>
              </div>
            )}
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
