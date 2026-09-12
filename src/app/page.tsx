'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Navbar } from '@/components/Navbar';
import { VideoCard } from '@/components/VideoCard';
import { useAuth } from '@/lib/auth';
import { getCategories, getVideosByCategory, getVideos, initializeData } from '@/lib/data';
import type { Category, Video } from '@/lib/types';
import { Play, Activity, Heart, Layers, ChevronRight } from 'lucide-react';

export default function HomePage() {
  const { isReady } = useAuth();
  const [categories, setCategories] = useState<Category[]>([]);
  const [videosByCategory, setVideosByCategory] = useState<Record<string, Video[]>>({});
  const [featuredVideo, setFeaturedVideo] = useState<Video | null>(null);
  const [featuredCategory, setFeaturedCategory] = useState<Category | null>(null);

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

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <Navbar />

      {/* ── Hero / Featured Video Banner ── */}
      {featuredVideo && (
        <section className="relative w-full h-[70vh] min-h-[450px] max-h-[650px] overflow-hidden flex items-end">
          {/* Background image */}
          <div className="absolute inset-0 z-0">
            <Image
              src={featuredVideo.thumbnail}
              alt={featuredVideo.title}
              fill
              priority
              className="object-cover object-center brightness-75 scale-105"
              sizes="100vw"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0a] via-[#0a0a0a]/50 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/20 to-transparent" />
            <div className="absolute top-0 inset-x-0 h-24 bg-gradient-to-b from-[#0a0a0a]/80 to-transparent" />
          </div>

          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 w-full">
            <div className="max-w-2xl">
              {featuredCategory && (
                <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 text-xs font-bold uppercase tracking-wider mb-4 backdrop-blur-sm">
                  <Layers className="w-3.5 h-3.5" />
                  <span>{featuredCategory.name}</span>
                </span>
              )}

              <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight drop-shadow-xl">
                {featuredVideo.title}
              </h1>

              <div className="flex flex-wrap items-center gap-3 my-4 text-sm font-semibold">
                <span className="px-2.5 py-0.5 bg-emerald-600 text-white font-extrabold rounded text-xs">
                  GRATIS
                </span>
                <span className="text-slate-300">{featuredVideo.duration}</span>
                <span className="text-slate-400">Episode {featuredVideo.episodeNum}</span>
                <span className="px-2 py-0.5 rounded border border-white/30 text-xs text-slate-300">
                  {featuredVideo.level}
                </span>
              </div>

              <p className="text-sm sm:text-base text-slate-200 line-clamp-3 leading-relaxed max-w-xl">
                {featuredVideo.description}
              </p>

              <div className="flex items-center gap-4 mt-6">
                <Link
                  href={`/watch/${featuredVideo.id}`}
                  className="inline-flex items-center gap-3 px-8 py-3.5 rounded-xl bg-white text-black font-black text-base hover:bg-slate-100 active:scale-[0.98] transition-all shadow-xl"
                >
                  <Play className="w-6 h-6 fill-black" />
                  <span>Tonton Gratis</span>
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ── Video Catalog by Category ── */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-14">
        {categories.map((cat) => {
          const videos = videosByCategory[cat.id] || [];
          if (videos.length === 0) return null;

          return (
            <section key={cat.id}>
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
                    {cat.name}
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">{cat.description}</p>
                </div>
                <span className="text-xs text-slate-500 font-semibold">
                  {videos.length} video
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {videos.map((video) => (
                  <VideoCard
                    key={video.id}
                    video={video}
                    categoryName={cat.name}
                  />
                ))}
              </div>
            </section>
          );
        })}

        {categories.length === 0 && (
          <div className="text-center py-20">
            <Activity className="w-12 h-12 text-slate-600 mx-auto mb-4" />
            <p className="text-slate-500 text-sm">Belum ada kategori atau video. Admin dapat menambahkan melalui panel admin.</p>
          </div>
        )}
      </main>

      {/* ── Minimal Footer ── */}
      <footer className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 border-t border-white/10 text-center">
        <div className="flex items-center justify-center gap-2 text-xs text-slate-500">
          <Activity className="w-3.5 h-3.5 text-blue-600" />
          <span className="font-semibold text-slate-400">Gymnastics Learning System (GLS)</span>
          <span className="text-slate-600">|</span>
          <span>Platform Pembelajaran Senam Digital</span>
        </div>
        <p className="text-[11px] text-slate-600 mt-2 flex items-center justify-center gap-1">
          <span>&copy; {new Date().getFullYear()} GLS FIK</span>
          <Heart className="w-3 h-3 text-rose-600 fill-rose-600" />
        </p>
      </footer>
    </div>
  );
}
