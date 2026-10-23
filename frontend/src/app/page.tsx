'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
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
  Activity,
  ChevronLeft,
  ChevronRight,
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
            {videos.length} {videos.length === 1 ? 'episode' : 'episodes'}
          </span>
          <button
            type="button"
            onClick={() => scroll('left')}
            aria-label={`Scroll left ${category.name}`}
            className="w-9 h-9 sm:w-8 sm:h-8 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-[#1F2A2E] flex items-center justify-center transition-colors cursor-pointer shadow-sm active:scale-95"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => scroll('right')}
            aria-label={`Scroll right ${category.name}`}
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
          <span>No video lessons uploaded for this category yet. Instructors can add them via the Admin Panel.</span>
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
        console.error('Failed to load data:', err);
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
        {/* Background Video looping VT_Level 3.mp4 */}
        <video
          src="/videos/VT_Level 3.mp4"
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover pointer-events-none"
        >
          <source src="/videos/VT_Level 3.mp4" type="video/mp4" />
          <source src="/videos/VT_Level%203.mp4" type="video/mp4" />
        </video>

        {/* Ambient Dark Overlays / Vignette for Readability & Cinematic Mood */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/50 to-transparent pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-transparent to-transparent pointer-events-none" />
        <div className="absolute inset-0 bg-black/25 pointer-events-none" />

        {/* Top spacer so header content is not overlapped */}
        <div className="h-16 sm:h-20" />

        {/* Bottom Hero Editorial Typography (Studiova Style) */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pb-5 sm:pb-7 lg:pb-9 mt-auto">
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
                  Artistic Gymnastics Learning System{' '}
                  <span className="text-[#c1ff72] font-bold">Faculty of Sports Science</span> for
                  movement technique, vault routines, and stick landings.
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
                  aria-label="Explore gymnastics video catalog"
                  className="inline-flex items-center justify-center w-12 xs:w-14 sm:w-20 h-9 sm:h-11 min-h-[38px] rounded-full bg-[#c1ff72] hover:bg-[#b0f555] transition-colors text-[#1f2a2e] shadow-xl group cursor-pointer"
                  title="Explore Video Catalog"
                >
                  <ArrowUpRight className="w-5 sm:w-6 h-5 sm:h-6 stroke-[2.5] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </motion.a>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Section 02: About Platform ── */}
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
                About Platform
              </div>
            </div>

            <h2 className="text-2xl sm:text-4xl font-black text-[#1F2A2E] tracking-tight">
              What is GLS FIK?
            </h2>
            <p className="text-xs sm:text-sm text-[#52636A] mt-2 leading-relaxed">
              Gymnastics Learning System (GLS) is a digital learning platform developed by the Faculty of Sports Science. Designed to help students, coaches, and athletes master artistic gymnastics techniques through high-quality instructional videos organized systematically by apparatus.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Feature 1: Movement Demonstrations */}
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
                  alt="Instructional gymnastics videos"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-6">
                <h3 className="text-base font-black text-[#1F2A2E] mb-2">Technique Demonstrations</h3>
                <p className="text-xs text-[#52636A] leading-relaxed">
                  A structured video library showing proper movement mechanics, form, and landings. Each lesson includes difficulty levels and exercise durations.
                </p>
              </div>
            </motion.div>

            {/* Feature 2: 6 MAG Apparatus Categories */}
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
                  alt="Apparatus categories structure"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-6">
                <h3 className="text-base font-black text-[#1F2A2E] mb-2">6 MAG Apparatus Events</h3>
                <p className="text-xs text-[#52636A] leading-relaxed">
                  Materials are systematically organized across 6 men&apos;s artistic gymnastics apparatuses: Floor Exercise, Pommel Horse, Vault, Still Rings, Parallel Bars, and Horizontal Bar.
                </p>
              </div>
            </motion.div>

            {/* Feature 3: Coach Guidance */}
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
                  alt="Coaching and evaluation"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-6">
                <h3 className="text-base font-black text-[#1F2A2E] mb-2">Coach Guidance & Review</h3>
                <p className="text-xs text-[#52636A] leading-relaxed">
                  Empowers coaches and athletes to review movement execution repeatedly with clear frame-by-frame clarity. Curriculum content can be managed via the admin panel.
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

      {/* ── Section 04: How to Learn on GLS FIK ── */}
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
                How It Works
              </div>
            </div>

            <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
              Learning with GLS FIK
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-1.5 max-w-xl">
              Four simple steps to start learning artistic gymnastics with this platform.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                num: '01',
                title: 'Choose an Apparatus',
                desc: 'Browse the 6 men’s artistic gymnastics apparatus categories available on the homepage. Pick the event you want to learn.',
                sub: 'Floor Exercise, Pommel Horse, Vault, etc.',
              },
              {
                num: '02',
                title: 'Watch Free Videos',
                desc: 'Select episodes are labeled FREE and can be played directly without signing in. Look for the green badge to preview.',
                sub: 'Instant access without signing in',
              },
              {
                num: '03',
                title: 'Sign In for Full Access',
                desc: 'Sign in with your Google account to unlock all lessons, progression drills, and full curriculum modules.',
                sub: 'Full curriculum unlocked upon sign in',
              },
              {
                num: '04',
                title: 'Practice & Master',
                desc: 'Open the video player to study form and landing execution. Use the episode sidebar to navigate through lessons.',
                sub: 'HD player with episode playlist',
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

      {/* ── Section 05: Video Catalog ── */}
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
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 rounded-full bg-[#C1FF72] flex items-center justify-center text-[#1F2A2E] font-black text-xs shadow-sm">
                  05
                </div>
                <div className="w-8 h-[1px] bg-slate-300" />
                <div className="px-3.5 py-1 rounded-full bg-[#1F2A2E] text-white text-xs font-bold shadow-sm">
                  Video Catalog
                </div>
              </div>

              <h2 className="text-2xl sm:text-4xl font-black text-[#1F2A2E] tracking-tight">
                Complete Learning Videos
              </h2>
              <p className="text-xs sm:text-sm text-[#52636A] mt-1">
                Scroll horizontally to browse all instructional episodes across categories.
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
                All Categories
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
            Digital gymnastics curriculum platform for coaches, athletes, and students of the Faculty of Sports Science.
          </p>
          <p className="text-[11px] text-slate-500 pt-2">
            &copy; {new Date().getFullYear()} GLS FIK. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
