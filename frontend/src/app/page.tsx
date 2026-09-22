'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Navbar } from '@/components/Navbar';
import { VideoCard } from '@/components/VideoCard';
import { ApparatusSection } from '@/components/landing/ApparatusSection';
import { LevelProgression } from '@/components/landing/LevelProgression';
import { TestimoniSection } from '@/components/landing/TestimoniSection';
import { FAQSection } from '@/components/landing/FAQSection';
import { CTABanner } from '@/components/landing/CTABanner';
import { useAuth } from '@/lib/auth';
import { apiGetCategories, apiGetVideos } from '@/lib/api';
import type { Category, Video } from '@/lib/types';
import {
  Play,
  Activity,
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  ArrowUpRight,
  Film,
} from 'lucide-react';

// Horizontal scrollable category video row
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
    <motion.div
      id={`section-${category.id}`}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="space-y-4 scroll-mt-24"
    >
      {/* Row Header */}
      <div className="flex items-end justify-between border-b border-slate-200 pb-3">
        <div className="min-w-0 pr-2">
          <h3 className="text-xl sm:text-2xl font-black text-[#1F2A2E] tracking-tight truncate">
            {category.name}
          </h3>
          <p className="text-xs sm:text-sm text-[#52636A] mt-0.5 line-clamp-1">{category.description}</p>
        </div>

        {/* Scroll Controls */}
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-xs text-[#52636A] font-bold hidden sm:inline mr-1">
            {videos.length} episode
          </span>
          <button
            type="button"
            onClick={() => scroll('left')}
            aria-label={`Scroll kiri ${category.name}`}
            className="w-9 h-9 sm:w-8 sm:h-8 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-[#1F2A2E] flex items-center justify-center transition-colors cursor-pointer shadow-sm active:scale-95"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => scroll('right')}
            aria-label={`Scroll kanan ${category.name}`}
            className="w-9 h-9 sm:w-8 sm:h-8 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-[#1F2A2E] flex items-center justify-center transition-colors cursor-pointer shadow-sm active:scale-95"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Video Row - Edge-to-edge swipe on mobile */}
      {videos.length > 0 ? (
        <div
          ref={rowRef}
          data-lenis-prevent
          className="-mx-4 px-4 sm:mx-0 sm:px-0 flex gap-3.5 sm:gap-5 overflow-x-auto pb-4 pt-1 snap-x snap-mandatory scroll-smooth no-scrollbar"
        >
          {videos.map((video) => (
            <div key={video.id} className="w-[260px] xs:w-[285px] sm:w-[320px] shrink-0 snap-start">
              <VideoCard video={video} categoryName={category.name} />
            </div>
          ))}
        </div>
      ) : (
        <div className="p-6 rounded-2xl bg-[#F4F8FA] border border-slate-200 flex items-center gap-3 text-xs text-[#52636A]">
          <Film className="w-5 h-5 text-slate-500 shrink-0" />
          <span>Materi video untuk kategori ini belum diunggah. Dosen atau admin dapat menambahkannya via Panel Admin.</span>
        </div>
      )}
    </motion.div>
  );
}

// Main homepage component
export default function HomePage() {
  const { isReady } = useAuth();
  const [categories, setCategories] = useState<Category[]>([]);
  const [videos, setVideos] = useState<Video[]>([]);
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [activeApparatus, setActiveApparatus] = useState<string>('cat-fx');

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
        console.error('Gagal memuat data:', err);
      }
    }
    loadData();
    return () => {
      isMounted = false;
    };
  }, []);

  const videosByCategory = useMemo(() => {
    const map: Record<string, Video[]> = {};
    for (const cat of categories) {
      map[cat.id] = videos.filter((v) => v.categoryId === cat.id);
    }
    return map;
  }, [categories, videos]);

  const featuredVideo = useMemo(() => {
    return videos.find((v) => v.isFree) || videos[0] || null;
  }, [videos]);

  const filteredCategories = useMemo(() => {
    if (activeFilter === 'all') return categories;
    return categories.filter((c) => c.id === activeFilter);
  }, [categories, activeFilter]);

  if (!isReady) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-slate-300 border-t-[#1F2A2E] rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <Navbar />

      {/* ── Fullscreen Cinematic Video Hero (Studiova Style) ── */}
      <section className="relative w-full h-[100dvh] min-h-[580px] flex flex-col justify-between overflow-hidden bg-black">
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
        <div className="h-16 sm:h-20" />

        {/* Bottom Hero Editorial Typography (Studiova Style) */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pb-8 sm:pb-12 lg:pb-16 mt-auto">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 sm:gap-8">
            {/* Left: Tagline + Giant Title with Pill Button */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="max-w-3xl space-y-3 sm:space-y-4"
            >
              {/* Star Icon + Editorial Tagline */}
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="flex items-start gap-2.5 sm:gap-3"
              >
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
              </motion.div>

              {/* Giant Brand Typography + Accent Arrow Pill */}
              <motion.div
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                className="flex flex-wrap items-baseline gap-2.5 sm:gap-5 pt-1"
              >
                <h1 className="text-5xl xs:text-6xl sm:text-8xl md:text-9xl font-black text-white tracking-tighter leading-none select-none">
                  GLS FIK.
                </h1>
                <motion.a
                  whileHover={{ scale: 1.08 }}
                  whileTap={{ scale: 0.94 }}
                  href="#katalog-video"
                  aria-label="Jelajahi katalog video senam"
                  className="inline-flex items-center justify-center w-12 xs:w-14 sm:w-20 h-9 sm:h-11 min-h-[38px] rounded-full bg-[#c1ff72] hover:bg-[#b0f555] transition-colors text-[#1f2a2e] shadow-xl group cursor-pointer"
                  title="Jelajahi Katalog Video"
                >
                  <ArrowUpRight className="w-5 sm:w-6 h-5 sm:h-6 stroke-[2.5] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </motion.a>
              </motion.div>

              {/* Action Buttons: Stack on small phones, side-by-side on sm+ */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.35 }}
                className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 sm:gap-3 pt-2 sm:pt-3 w-full sm:w-auto"
              >
                {featuredVideo && (
                  <Link
                    href={`/watch/${featuredVideo.id}`}
                    className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full bg-white/15 hover:bg-white/25 active:scale-95 backdrop-blur-md border border-white/25 text-white font-bold text-xs sm:text-sm transition-all min-h-[44px] shadow-sm hover:scale-[1.02]"
                  >
                    <Play className="w-3.5 h-3.5 fill-white" />
                    <span>Tonton Video Gratis ({featuredVideo.title})</span>
                  </Link>
                )}
                <a
                  href="#katalog-video"
                  className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full bg-black/40 hover:bg-black/60 active:scale-95 backdrop-blur-md border border-white/15 text-slate-200 hover:text-white text-xs sm:text-sm font-semibold transition-all min-h-[44px] hover:scale-[1.02]"
                >
                  <span>Lihat Katalog Video</span>
                  <ArrowRight className="w-4 h-4" />
                </a>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Section 02: Tentang Platform ── */}
      <section id="tentang-platform" className="py-20 bg-white border-b border-slate-200 relative overflow-hidden text-[#1F2A2E] scroll-mt-16">
        <div className="absolute top-10 right-1/4 w-[500px] h-[350px] bg-[radial-gradient(circle,rgba(193,255,114,0.12)_0%,transparent_70%)] pointer-events-none blur-3xl -z-0" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="mb-14 max-w-2xl"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 rounded-full bg-[#C1FF72] flex items-center justify-center text-[#1F2A2E] font-black text-xs shadow-sm">
                02
              </div>
              <div className="w-8 h-[1px] bg-slate-300" />
              <div className="px-3.5 py-1 rounded-full bg-[#1F2A2E] text-white text-xs font-bold shadow-sm">
                Tentang Platform
              </div>
            </div>

            <h2 className="text-2xl sm:text-4xl font-black text-[#1F2A2E] tracking-tight">
              Apa itu GLS FIK?
            </h2>
            <p className="text-xs sm:text-sm text-[#52636A] mt-2 leading-relaxed">
              Gymnastics Learning System (GLS) adalah platform pembelajaran senam digital yang dikembangkan oleh Fakultas Ilmu Keolahragaan. Dirancang untuk membantu mahasiswa, pelatih, dan atlet mempelajari teknik senam artistik melalui video peragaan berkualitas tinggi yang tersusun secara sistematis berdasarkan kategori alat.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Feature 1: Video Pembelajaran */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.5, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              whileHover={{ y: -6, transition: { duration: 0.25 } }}
              className="group bg-[#F4F8FA] border border-slate-200/90 rounded-3xl overflow-hidden hover:border-[#1F2A2E]/30 hover:shadow-xl transition-all shadow-sm cursor-pointer"
            >
              <div className="relative w-full h-48 overflow-hidden">
                <Image
                  src="/images/feature-video.webp"
                  alt="Video pembelajaran senam"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-6">
                <h3 className="text-base font-black text-[#1F2A2E] mb-2">Video Peragaan Teknik</h3>
                <p className="text-xs text-[#52636A] leading-relaxed">
                  Koleksi video demonstrasi gerak senam artistik dari Google Drive yang diorganisir per kategori alat. Setiap video dilengkapi informasi level kesulitan dan durasi latihan.
                </p>
              </div>
            </motion.div>

            {/* Feature 2: Struktur Kategori */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.5, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              whileHover={{ y: -6, transition: { duration: 0.25 } }}
              className="group bg-[#F4F8FA] border border-slate-200/90 rounded-3xl overflow-hidden hover:border-[#1F2A2E]/30 hover:shadow-xl transition-all shadow-sm cursor-pointer"
            >
              <div className="relative w-full h-48 overflow-hidden">
                <Image
                  src="/images/feature-structured.webp"
                  alt="Struktur kategori alat senam"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-6">
                <h3 className="text-base font-black text-[#1F2A2E] mb-2">6 Kategori Alat MAG</h3>
                <p className="text-xs text-[#52636A] leading-relaxed">
                  Materi disusun berdasarkan 6 kategori alat senam artistik putra: Floor Exercise, Pommel Horse, Vault, Still Rings, Parallel Bars, dan Horizontal Bar.
                </p>
              </div>
            </motion.div>

            {/* Feature 3: Evaluasi Pelatih */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.5, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
              whileHover={{ y: -6, transition: { duration: 0.25 } }}
              className="group bg-[#F4F8FA] border border-slate-200/90 rounded-3xl overflow-hidden hover:border-[#1F2A2E]/30 hover:shadow-xl transition-all shadow-sm cursor-pointer"
            >
              <div className="relative w-full h-48 overflow-hidden">
                <Image
                  src="/images/feature-coaching.webp"
                  alt="Evaluasi dan pendampingan pelatih"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-6">
                <h3 className="text-base font-black text-[#1F2A2E] mb-2">Pendampingan Pelatih</h3>
                <p className="text-xs text-[#52636A] leading-relaxed">
                  Platform ini mendukung pelatih dalam mengevaluasi teknik atlet melalui video peragaan yang bisa diulang-ulang. Admin dapat menambah, mengubah, dan mengelola seluruh konten materi.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Section 03: Apparatus Gallery ── */}
      <ApparatusSection
        activeId={activeApparatus}
        onSelectApparatus={setActiveApparatus}
        videos={videos}
      />

      {/* ── Section 04: Cara Belajar di GLS FIK ── */}
      <section id="cara-belajar" className="py-20 bg-[#1F2A2E] border-b border-[#2D3A3F] relative overflow-hidden text-white scroll-mt-16">
        <div className="absolute top-10 right-10 w-[500px] h-[350px] bg-[radial-gradient(circle,rgba(193,255,114,0.12)_0%,transparent_70%)] pointer-events-none blur-3xl -z-0" />
        <div className="absolute bottom-10 left-10 w-[400px] h-[300px] bg-[radial-gradient(circle,rgba(193,255,114,0.06)_0%,transparent_70%)] pointer-events-none blur-3xl -z-0" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="mb-12"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 rounded-full bg-[#C1FF72] flex items-center justify-center text-[#1F2A2E] font-black text-xs shadow-sm">
                04
              </div>
              <div className="w-8 h-[1px] bg-white/20" />
              <div className="px-3.5 py-1 rounded-full bg-white/10 border border-white/15 text-[#C1FF72] text-xs font-bold shadow-sm">
                Cara Menggunakan
              </div>
            </div>

            <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
              Cara Belajar di GLS FIK
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-1.5 max-w-xl">
              Empat langkah untuk mulai belajar senam artistik melalui platform ini.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                num: '01',
                title: 'Pilih Kategori Video',
                desc: 'Telusuri 6 kategori alat senam artistik putra yang tersedia di beranda. Pilih alat yang ingin dipelajari melalui menu navigasi atau katalog video.',
                sub: 'Senam Lantai, Kuda Pelana, Meja Lompat, dll.',
              },
              {
                num: '02',
                title: 'Tonton Video Gratis',
                desc: 'Beberapa video ditandai GRATIS dan bisa ditonton langsung tanpa login. Cari badge hijau pada kartu video untuk menemukan materi yang terbuka untuk umum.',
                sub: 'Akses langsung tanpa mendaftar',
              },
              {
                num: '03',
                title: 'Masuk untuk Akses Penuh',
                desc: 'Login dengan akun yang telah didaftarkan oleh admin untuk membuka seluruh koleksi video pembelajaran termasuk materi lanjutan dan drill spesifik.',
                sub: 'Video premium terkunci sampai login',
              },
              {
                num: '04',
                title: 'Putar dan Pelajari',
                desc: 'Buka halaman pemutar video untuk menonton peragaan teknik. Gunakan sidebar playlist untuk berpindah antar episode dalam satu kategori alat.',
                sub: 'Player video dengan daftar episode',
              },
            ].map((step, idx) => (
              <motion.div
                key={step.num}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.5, delay: idx * 0.1, ease: [0.16, 1, 0.3, 1] }}
                whileHover={{ y: -6, transition: { duration: 0.25 } }}
                className="bg-[#172124] border border-white/10 rounded-3xl p-6 relative flex flex-col justify-between hover:border-[#C1FF72]/50 hover:bg-[#1B272B] hover:shadow-xl transition-all shadow-sm group cursor-pointer"
              >
                <div>
                  <span className="text-3xl font-black text-[#C1FF72] block leading-none mb-3 group-hover:scale-105 transition-transform">
                    {step.num}
                  </span>
                  <h3 className="text-base font-black text-white mb-2">{step.title}</h3>
                  <p className="text-xs text-slate-300 leading-relaxed">{step.desc}</p>
                </div>
                <div className="mt-5 pt-3 border-t border-white/10 text-[11px] font-bold text-[#C1FF72]">
                  {step.sub}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Section 05: Katalog materi video ── */}
      <section id="katalog-video" className="bg-[#F4F8FA] border-b border-slate-200/90 relative overflow-hidden scroll-mt-16">
        <div id="kategori-senam" className="scroll-mt-16" />
        {/* Soft ambient lighting blend */}
        <div className="absolute top-20 right-10 w-[500px] h-[400px] bg-[radial-gradient(circle,rgba(193,255,114,0.12)_0%,transparent_70%)] pointer-events-none blur-3xl -z-0" />
        <div className="absolute bottom-10 left-10 w-[400px] h-[300px] bg-[radial-gradient(circle,rgba(193,255,114,0.06)_0%,transparent_70%)] pointer-events-none blur-3xl -z-0" />

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-10 sm:space-y-12 relative z-10">
          {/* Catalog Header & Filter Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-slate-200 pb-5"
          >
            <div>
              {/* Signature Motif: [04] --- [Katalog Video] */}
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 rounded-full bg-[#C1FF72] flex items-center justify-center text-[#1F2A2E] font-black text-xs shadow-sm">
                  05
                </div>
                <div className="w-8 h-[1px] bg-slate-300" />
                <div className="px-3.5 py-1 rounded-full bg-[#1F2A2E] text-white text-xs font-bold shadow-sm">
                  Katalog Video
                </div>
              </div>

              <h2 className="text-2xl sm:text-4xl font-black text-[#1F2A2E] tracking-tight">
                Katalog Materi Video Lengkap
              </h2>
              <p className="text-xs sm:text-sm text-[#52636A] mt-1">
                Geser ke samping untuk melihat seluruh episode peraga gerak per kategori.
              </p>
            </div>

            {/* Quick Filter Buttons - Edge-to-edge scroll on mobile */}
            <div className="-mx-4 px-4 sm:mx-0 sm:px-0 flex items-center gap-2 overflow-x-auto pb-2 pt-0.5 no-scrollbar scroll-smooth">
              <button
                type="button"
                onClick={() => setActiveFilter('all')}
                className={`min-h-[38px] px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-colors cursor-pointer active:scale-95 ${activeFilter === 'all'
                    ? 'bg-[#1F2A2E] text-white shadow-sm'
                    : 'bg-white text-[#1F2A2E] hover:bg-slate-50 border border-slate-200 shadow-xs'
                  }`}
              >
                Semua Kategori
              </button>
              {categories.map((cat) => (
                <button
                  type="button"
                  key={cat.id}
                  onClick={() => {
                    setActiveFilter(cat.id);
                  }}
                  className={`min-h-[38px] px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-colors cursor-pointer active:scale-95 ${activeFilter === cat.id
                      ? 'bg-[#1F2A2E] text-white shadow-sm'
                      : 'bg-white text-[#1F2A2E] hover:bg-slate-50 border border-slate-200 shadow-xs'
                    }`}
                >
                  {cat.name.split(' ')[0]}
                </button>
              ))}
            </div>
          </motion.div>

          {/* Video Rows */}
          <div className="space-y-14">
            {filteredCategories.map((cat) => (
              <CategoryVideoRow
                key={cat.id}
                category={cat}
                videos={videosByCategory[cat.id] || []}
              />
            ))}
          </div>
        </main>
      </section>

      {/* ── Section 06: Level Progression ── */}
      <LevelProgression />

      {/* ── Section 07: Testimoni ── */}
      <TestimoniSection />

      {/* ── Section 08: FAQ ── */}
      <FAQSection />

      {/* ── Section 09: CTA Banner ── */}
      <CTABanner />

      {/* Footer (Dark Anchoring Footer) */}
      <footer className="border-t border-[#29363B] bg-[#172124] py-12 text-center text-xs text-slate-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-3">
          <div className="flex items-center justify-center gap-2.5">
            <div className="w-7 h-7 rounded-xl bg-[#C1FF72] flex items-center justify-center text-[#1F2A2E] shadow-sm">
              <Activity className="w-4 h-4 stroke-[3]" />
            </div>
            <span className="font-black text-sm text-white">GLS FIK</span>
            <span className="text-slate-600">•</span>
            <span className="font-semibold text-xs text-slate-400">Gymnastics Learning System</span>
          </div>
          <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed">
            Platform kurikulum senam digital untuk pelatih, atlet, dan mahasiswa Fakultas Ilmu Keolahragaan dalam mempelajari berbagai kategori senam artistik.
          </p>
          <p className="text-[11px] text-slate-500 pt-2">
            &copy; {new Date().getFullYear()} GLS FIK. Seluruh hak cipta dilindungi undang-undang.
          </p>
        </div>
      </footer>
    </div>
  );
}
