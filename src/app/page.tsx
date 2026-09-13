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
  Heart,
  Layers,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  ShieldCheck,
  Compass,
  ArrowRight,
  BookOpen,
  Film,
} from 'lucide-react';
import { ScrollReveal } from '@/components/ui/ScrollReveal';

// ── Horizontal Scrollable Category Row Component ──────────────
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
      const scrollAmount = 340;
      rowRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  return (
    <div id={`section-${category.id}`} className="space-y-4 scroll-mt-24">
      {/* Row Header */}
      <div className="flex items-end justify-between">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-pulse" />
            <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
              {category.name}
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">{category.description}</p>
        </div>

        {/* Action / Controls */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500 font-semibold hidden sm:inline mr-2">
            {videos.length} materi
          </span>
          <button
            onClick={() => scroll('left')}
            aria-label={`Scroll kiri ${category.name}`}
            className="w-8 h-8 rounded-lg bg-[#181818] border border-white/10 hover:border-white/30 text-slate-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer active:scale-95"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => scroll('right')}
            aria-label={`Scroll kanan ${category.name}`}
            className="w-8 h-8 rounded-lg bg-[#181818] border border-white/10 hover:border-white/30 text-slate-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer active:scale-95"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* ── Scrollable Video Row ── */}
      {videos.length > 0 ? (
        <div
          ref={rowRef}
          className="flex gap-4 overflow-x-auto pb-3 pt-1 snap-x snap-mandatory scroll-smooth no-scrollbar"
        >
          {videos.map((video) => (
            <div key={video.id} className="w-[280px] sm:w-[320px] shrink-0 snap-start">
              <VideoCard video={video} categoryName={category.name} />
            </div>
          ))}
        </div>
      ) : (
        /* Empty / Coming Soon State */
        <div className="p-6 rounded-2xl bg-[#141414] border border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 shrink-0">
              <Film className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-bold text-white">Materi Video Sedang Dipersiapkan</p>
              <p className="text-xs text-slate-400">
                Tim instruktur FIK sedang menyusun kurikulum drill biomekanika untuk nomor ini.
              </p>
            </div>
          </div>
          <Link
            href="/login"
            className="text-xs font-bold text-blue-400 hover:text-blue-300 transition-colors whitespace-nowrap"
          >
            Masuk untuk notifikasi rilis &rarr;
          </Link>
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
  const [activeTab, setActiveTab] = useState<string>('all');

  useEffect(() => {
    initializeData();
    const cats = getCategories();
    setCategories(cats);

    const vbc: Record<string, Video[]> = {};
    for (const cat of cats) {
      vbc[cat.id] = getVideosByCategory(cat.id);
    }
    setVideosByCategory(vbc);

    // Pick first free video as featured
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
    activeTab === 'all' ? categories : categories.filter((c) => c.id === activeTab);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white selection:bg-blue-600 selection:text-white">
      <Navbar />

      {/* ── Refined Hero Section ── */}
      <section className="relative w-full border-b border-white/5 bg-gradient-to-b from-[#111] via-[#0d0d0d] to-[#0a0a0a] overflow-hidden pt-10 pb-14 sm:py-16">
        {/* Glow ambient */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 left-10 w-80 h-80 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Left Col: Platform Overview */}
            <div className="lg:col-span-7 space-y-5">
              <ScrollReveal direction="up" delay={0.05}>
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/15 border border-blue-500/30 text-blue-300 text-xs font-bold tracking-wide">
                  <Activity className="w-3.5 h-3.5 text-blue-400" />
                  <span>Gymnastics Learning System &bull; FIK</span>
                </div>
              </ScrollReveal>

              <ScrollReveal direction="up" delay={0.1}>
                <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-[1.15]">
                  Pelajari Teknik Senam Artistik Sesuai Standar Biomekanika
                </h1>
              </ScrollReveal>

              <ScrollReveal direction="up" delay={0.15}>
                <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-xl">
                  Platform video terstruktur untuk pelatih dan atlet. Pahami fondasi gerak, eksekusi akrobatik, hingga koreksi pendaratan (stick landing) nomor alat resmi FIG.
                </p>
              </ScrollReveal>

              {/* Stats Highlights */}
              <ScrollReveal direction="up" delay={0.2}>
                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-xs font-semibold text-slate-300">
                    <Layers className="w-4 h-4 text-blue-400" />
                    <span>6 Nomor Alat Lengkap</span>
                  </div>
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-xs font-semibold text-slate-300">
                    <Sparkles className="w-4 h-4 text-emerald-400" />
                    <span>Episode 1 Bebas Tonton (Gratis)</span>
                  </div>
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-xs font-semibold text-slate-300">
                    <ShieldCheck className="w-4 h-4 text-amber-400" />
                    <span>Kurikulum Bertingkat</span>
                  </div>
                </div>
              </ScrollReveal>

              {/* CTA Actions */}
              <ScrollReveal direction="up" delay={0.25}>
                <div className="flex flex-wrap items-center gap-3 pt-3">
                  {featuredVideo && (
                    <Link
                      href={`/watch/${featuredVideo.id}`}
                      className="inline-flex items-center gap-2.5 px-6 py-3 rounded-xl bg-white text-black font-extrabold text-sm hover:bg-slate-100 active:scale-[0.98] transition-all shadow-xl shadow-white/10"
                    >
                      <Play className="w-4 h-4 fill-black" />
                      <span>Tonton Episode Gratis</span>
                    </Link>
                  )}
                  <a
                    href="#nomor-alat"
                    className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-200 text-sm font-bold transition-all"
                  >
                    <Compass className="w-4 h-4 text-blue-400" />
                    <span>Mengenal 6 Nomor Alat</span>
                  </a>
                </div>
              </ScrollReveal>
            </div>

            {/* Right Col: Featured Spotlight Preview Card */}
            {featuredVideo && (
              <div className="lg:col-span-5">
                <ScrollReveal direction="left" delay={0.15}>
                  <div className="bg-[#161616] rounded-2xl border border-white/10 overflow-hidden shadow-2xl p-4 group relative">
                    <div className="relative aspect-video w-full rounded-xl overflow-hidden bg-black">
                      <Image
                        src={featuredVideo.thumbnail}
                        alt={featuredVideo.title}
                        fill
                        className="object-cover object-center group-hover:scale-105 transition-transform duration-500 opacity-90 group-hover:opacity-100"
                        sizes="(max-width: 1024px) 100vw, 500px"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />

                      {/* Top Badges */}
                      <div className="absolute top-3 left-3 flex items-center gap-2">
                        <span className="px-2.5 py-1 rounded-md bg-emerald-600 text-white font-extrabold text-[11px] uppercase tracking-wider shadow-lg">
                          Gratis Ditonton
                        </span>
                        {featuredCategory && (
                          <span className="px-2.5 py-1 rounded-md bg-black/60 backdrop-blur-md border border-white/15 text-slate-300 font-bold text-[10px]">
                            {featuredCategory.name.split(' ')[0]}
                          </span>
                        )}
                      </div>

                      {/* Play Button Icon */}
                      <Link
                        href={`/watch/${featuredVideo.id}`}
                        className="absolute inset-0 flex items-center justify-center cursor-pointer"
                      >
                        <div className="w-14 h-14 rounded-full bg-blue-600/90 backdrop-blur-sm flex items-center justify-center text-white shadow-xl shadow-blue-600/40 group-hover:scale-110 transition-transform">
                          <Play className="w-6 h-6 fill-white ml-0.5" />
                        </div>
                      </Link>

                      <div className="absolute bottom-3 right-3">
                        <span className="px-2 py-0.5 rounded bg-black/70 backdrop-blur-md text-[11px] font-semibold text-slate-200">
                          {featuredVideo.duration}
                        </span>
                      </div>
                    </div>

                    <div className="mt-4 px-1">
                      <div className="flex items-center gap-2 text-xs text-slate-400 font-semibold mb-1">
                        <span>Episode {featuredVideo.episodeNum}</span>
                        <span>&bull;</span>
                        <span>Level {featuredVideo.level}</span>
                      </div>
                      <h3 className="text-base font-extrabold text-white group-hover:text-blue-400 transition-colors line-clamp-1">
                        {featuredVideo.title}
                      </h3>
                      <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                        {featuredVideo.description}
                      </p>

                      <div className="mt-3 pt-3 border-t border-white/5 flex items-center justify-between">
                        <span className="text-xs font-bold text-blue-400 flex items-center gap-1 group-hover:underline">
                          <span>Mulai Menonton Sekarang</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </span>
                      </div>
                    </div>
                  </div>
                </ScrollReveal>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ── Apparatus Explanations (Scrollable Carousel Section) ── */}
      <ApparatusSection
        onSelectCategory={(categoryId) => {
          setActiveTab(categoryId);
          const el = document.getElementById(`section-${categoryId}`);
          if (el) {
            el.scrollIntoView({ behavior: 'smooth' });
          } else {
            const catHeader = document.getElementById('katalog-video');
            if (catHeader) catHeader.scrollIntoView({ behavior: 'smooth' });
          }
        }}
      />

      {/* ── Video Catalog by Category (Horizontal Scrollable Rows) ── */}
      <main id="katalog-video" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12">
        {/* Catalog Header & Filter Tabs */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/10 pb-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
              <BookOpen className="w-3.5 h-3.5 text-blue-400" />
              <span>Koleksi Pembelajaran</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Katalog Materi Video Terstruktur
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Geser ke samping pada setiap baris untuk melihat seluruh daftar episode.
            </p>
          </div>

          {/* Quick Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 max-w-full no-scrollbar">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                activeTab === 'all'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                  : 'bg-[#181818] text-slate-400 hover:text-white border border-white/5'
              }`}
            >
              Semua Alat
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveTab(cat.id)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                  activeTab === cat.id
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                    : 'bg-[#181818] text-slate-400 hover:text-white border border-white/5'
                }`}
              >
                {cat.name.split(' ')[0]}
              </button>
            ))}
          </div>
        </div>

        {/* Categories Video Rows */}
        <div className="space-y-14">
          {filteredCategories.map((cat) => (
            <CategoryVideoRow
              key={cat.id}
              category={cat}
              videos={videosByCategory[cat.id] || []}
            />
          ))}
        </div>

        {categories.length === 0 && (
          <div className="text-center py-20">
            <Activity className="w-12 h-12 text-slate-600 mx-auto mb-4 animate-bounce" />
            <p className="text-slate-400 text-sm font-semibold">Memuat kategori pembelajaran...</p>
          </div>
        )}
      </main>

      {/* ── Minimal Footer ── */}
      <footer className="border-t border-white/10 bg-[#080808] py-12 text-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          <div className="flex items-center justify-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center text-white">
              <Activity className="w-4 h-4 stroke-[2.5]" />
            </div>
            <span className="font-extrabold text-sm text-white tracking-tight">GLS FIK</span>
            <span className="text-slate-600">|</span>
            <span className="text-xs text-slate-400">Gymnastics Learning System</span>
          </div>

          <p className="text-xs text-slate-500 max-w-md mx-auto">
            Dikembangkan untuk standardisasi kurikulum kepelatihan senam artistik, peningkatan biomekanika teknik gerak, dan keselamatan atlet.
          </p>

          <div className="pt-2 text-[11px] text-slate-600 flex items-center justify-center gap-1">
            <span>&copy; {new Date().getFullYear()} GLS FIK. All rights reserved.</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
