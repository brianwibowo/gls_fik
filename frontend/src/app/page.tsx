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
  CheckCircle2,
  Trophy,
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
            {videos.length} {videos.length === 1 ? 'routine' : 'routines'}
          </span>
          <button
            type="button"
            onClick={() => scroll('left')}
            aria-label={`Scroll left ${category.name}`}
            className="w-10 h-10 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-[#1F2A2E] flex items-center justify-center transition-colors cursor-pointer shadow-sm active:scale-95"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => scroll('right')}
            aria-label={`Scroll right ${category.name}`}
            className="w-10 h-10 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-[#1F2A2E] flex items-center justify-center transition-colors cursor-pointer shadow-sm active:scale-95"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Video Row */}
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
          <span>Curriculum videos for this apparatus are being synchronized by technical coaches.</span>
        </div>
      )}
    </motion.div>
  );
}

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
        console.error('Failed to load GCL curriculum data:', err);
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
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-slate-700 border-t-[#c1ff72] rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <Navbar />

      {/* ── Cinematic Video Hero Section ── */}
      <section className="relative w-full h-[100dvh] min-h-[580px] flex flex-col justify-between overflow-hidden bg-black">
        {/* Real artistic gymnastics competition video background */}
        <video
          src="/images/gymnastic.mp4"
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover pointer-events-none"
        />

        {/* Ambient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/50 to-transparent pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-transparent to-transparent pointer-events-none" />
        <div className="absolute inset-0 bg-black/25 pointer-events-none" />

        {/* Top Spacer for Navbar */}
        <div className="h-16 sm:h-20" />

        {/* Bottom Hero Editorial Typography */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pb-8 sm:pb-12 lg:pb-16 mt-auto">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 sm:gap-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="max-w-3xl space-y-3 sm:space-y-4"
            >
              {/* Star Badge & Tagline */}
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="flex items-start gap-2.5 sm:gap-3"
              >
                <Trophy className="w-5 h-5 text-[#c1ff72] shrink-0 mt-0.5" />
                <p className="text-xs sm:text-sm text-slate-200 font-medium leading-relaxed max-w-lg">
                  Official Technical Platform for{' '}
                  <span className="text-[#c1ff72] font-bold">Gymnastics Competition Level (GCL)</span>. Authentic competition analysis, apparatus checklists, and FIG coach scoring.
                </p>
              </motion.div>

              {/* Giant Brand Typography */}
              <motion.div
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                className="flex flex-wrap items-baseline gap-2.5 sm:gap-5 pt-1"
              >
                <h1 className="text-5xl xs:text-6xl sm:text-8xl md:text-9xl font-black text-white tracking-tighter leading-none select-none">
                  GCL.
                </h1>
                <motion.a
                  whileHover={{ scale: 1.08 }}
                  whileTap={{ scale: 0.94 }}
                  href="#katalog-video"
                  aria-label="Explore competition curriculum videos"
                  className="inline-flex items-center justify-center w-12 xs:w-14 sm:w-20 h-9 sm:h-11 min-h-[38px] rounded-full bg-[#c1ff72] hover:bg-[#b0f555] transition-colors text-[#1f2a2e] shadow-xl group cursor-pointer"
                  title="Explore Competition Curriculum"
                >
                  <ArrowUpRight className="w-5 sm:w-6 h-5 sm:h-6 stroke-[2.5] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </motion.a>
              </motion.div>

              {/* Hero Action Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.35 }}
                className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 sm:gap-3 pt-2 sm:pt-3 w-full sm:w-auto"
              >
                {featuredVideo && (
                  <Link
                    href={`/watch/${featuredVideo.id}`}
                    className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full bg-[#c1ff72] hover:bg-[#b0f555] active:scale-95 text-[#1f2a2e] font-black text-xs sm:text-sm transition-all min-h-[44px] shadow-lg"
                  >
                    <Play className="w-3.5 h-3.5 fill-[#1f2a2e]" />
                    <span>Watch Featured Routine: {featuredVideo.title.split('-')[0]}</span>
                  </Link>
                )}
                <a
                  href="#apparatus"
                  className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full bg-white/10 hover:bg-white/20 active:scale-95 backdrop-blur-md border border-white/20 text-white text-xs sm:text-sm font-semibold transition-all min-h-[44px]"
                >
                  <span>Explore 6 Apparatus</span>
                  <ArrowRight className="w-4 h-4" />
                </a>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Section 02: About GCL ── */}
      <section id="about" className="py-16 sm:py-20 bg-white border-b border-slate-200 relative overflow-hidden text-[#1F2A2E] scroll-mt-16">
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
                Platform Standards
              </div>
            </div>

            <h2 className="text-2xl sm:text-4xl font-black text-[#1F2A2E] tracking-tight">
              What is Gymnastics Competition Level (GCL)?
            </h2>
            <p className="text-xs sm:text-sm text-[#52636A] mt-2 leading-relaxed">
              Gymnastics Competition Level (GCL) is the technical curriculum and performance tracking platform for Men&apos;s Artistic Gymnastics. Built for competing gymnasts, certified coaches, and technical evaluators, GCL unifies authentic video analysis with individual technique checklists and scoring feedback.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Feature 1 */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.5, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              whileHover={{ y: -6, transition: { duration: 0.25 } }}
              className="group bg-[#F4F8FA] border border-slate-200/90 rounded-3xl overflow-hidden hover:border-[#1F2A2E]/30 hover:shadow-xl transition-all shadow-sm"
            >
              <div className="relative w-full h-48 overflow-hidden">
                <Image
                  src="/images/feature-video.webp"
                  alt="Authentic gymnastics competition routine analysis"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-6">
                <h3 className="text-base font-black text-[#1F2A2E] mb-2">Authentic Competition Footage</h3>
                <p className="text-xs text-[#52636A] leading-relaxed">
                  Real competition footage and high-definition video demonstrations organized across all 6 apparatus. Each routine showcases technical precision, entry hurdles, and stuck dismount landings.
                </p>
              </div>
            </motion.div>

            {/* Feature 2 */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.5, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              whileHover={{ y: -6, transition: { duration: 0.25 } }}
              className="group bg-[#F4F8FA] border border-slate-200/90 rounded-3xl overflow-hidden hover:border-[#1F2A2E]/30 hover:shadow-xl transition-all shadow-sm"
            >
              <div className="relative w-full h-48 overflow-hidden">
                <Image
                  src="/images/feature-structured.webp"
                  alt="Itemized apparatus technique checklists"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-6">
                <h3 className="text-base font-black text-[#1F2A2E] mb-2">Technique Checklists &amp; % Mastery</h3>
                <p className="text-xs text-[#52636A] leading-relaxed">
                  Every technique features a dedicated checklist item. As athletes demonstrate proficiency, completion percentages update in real time to visualize progression from Level 1 to Level 3.
                </p>
              </div>
            </motion.div>

            {/* Feature 3 */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.5, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
              whileHover={{ y: -6, transition: { duration: 0.25 } }}
              className="group bg-[#F4F8FA] border border-slate-200/90 rounded-3xl overflow-hidden hover:border-[#1F2A2E]/30 hover:shadow-xl transition-all shadow-sm"
            >
              <div className="relative w-full h-48 overflow-hidden">
                <Image
                  src="/images/feature-coaching.webp"
                  alt="Coach technical evaluations and scoring notes"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-6">
                <h3 className="text-base font-black text-[#1F2A2E] mb-2">Dedicated Coach Evaluations</h3>
                <p className="text-xs text-[#52636A] leading-relaxed">
                  Certified coaches evaluate movement execution directly on each technique, logging constructive notes on body alignment, amplitude, and landing stick accuracy.
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

      {/* ── Section 04: How GCL Works ── */}
      <section id="how-it-works" className="py-16 sm:py-20 bg-[#1F2A2E] border-b border-[#2D3A3F] relative overflow-hidden text-white scroll-mt-16">
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
                Workflow
              </div>
            </div>

            <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
              How Gymnasts &amp; Coaches Train on GCL
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-1.5 max-w-xl">
              Four systematic steps from fundamental video study to verified technical proficiency.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                num: '01',
                title: 'Select Apparatus',
                desc: 'Browse all 6 Men&apos;s Artistic Gymnastics apparatus. Choose an apparatus category to focus on specific movement requirements.',
                sub: 'Floor, Pommel Horse, Rings, Vault, etc.',
              },
              {
                num: '02',
                title: 'Watch Technical Videos',
                desc: 'Study high-definition competition video routines. Free sample episodes allow immediate access to foundational movement drills.',
                sub: 'Free preview routines available',
              },
              {
                num: '03',
                title: 'Track Skill Checklists',
                desc: 'Sign in to your athlete account to check off completed techniques and monitor your real-time mastery percentage.',
                sub: 'Individual progress metrics',
              },
              {
                num: '04',
                title: 'Review Coach Evaluations',
                desc: 'Coaches provide written feedback and status ratings on each technique to prepare gymnasts for competition execution.',
                sub: 'Dedicated coaching notes column',
              },
            ].map((step, idx) => (
              <motion.div
                key={step.num}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.5, delay: idx * 0.1, ease: [0.16, 1, 0.3, 1] }}
                whileHover={{ y: -6, transition: { duration: 0.25 } }}
                className="bg-[#172124] border border-white/10 rounded-3xl p-6 relative flex flex-col justify-between hover:border-[#C1FF72]/50 hover:bg-[#1B272B] hover:shadow-xl transition-all shadow-sm group"
              >
                <div>
                  <span className="text-3xl font-black text-[#C1FF72] block leading-none mb-3 group-hover:scale-105 transition-transform">
                    {step.num}
                  </span>
                  <h3 className="text-base font-black text-white mb-2">{step.title}</h3>
                  <p className="text-xs text-slate-300 leading-relaxed">{step.desc}</p>
                </div>
                <div className="mt-5 pt-3 border-t border-white/10 text-xs font-bold text-[#C1FF72]">
                  {step.sub}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Section 05: Video Curriculum Catalog ── */}
      <section id="katalog-video" className="bg-[#F4F8FA] border-b border-slate-200/90 relative overflow-hidden scroll-mt-16">
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
                  Video Curriculum
                </div>
              </div>

              <h2 className="text-2xl sm:text-4xl font-black text-[#1F2A2E] tracking-tight">
                Complete Apparatus Video Curriculum
              </h2>
              <p className="text-xs sm:text-sm text-[#52636A] mt-1">
                Scroll horizontally to explore technical routine demonstrations by apparatus and difficulty level.
              </p>
            </div>

            {/* Quick Filter Buttons */}
            <div className="-mx-4 px-4 sm:mx-0 sm:px-0 flex items-center gap-2 overflow-x-auto pb-2 pt-0.5 no-scrollbar scroll-smooth">
              <button
                type="button"
                onClick={() => setActiveFilter('all')}
                className={`min-h-[44px] px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-colors cursor-pointer active:scale-95 ${
                  activeFilter === 'all'
                    ? 'bg-[#1F2A2E] text-white shadow-sm'
                    : 'bg-white text-[#1F2A2E] hover:bg-slate-50 border border-slate-200 shadow-xs'
                }`}
              >
                All 6 Apparatus
              </button>
              {categories.map((cat) => (
                <button
                  type="button"
                  key={cat.id}
                  onClick={() => setActiveFilter(cat.id)}
                  className={`min-h-[44px] px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-colors cursor-pointer active:scale-95 ${
                    activeFilter === cat.id
                      ? 'bg-[#1F2A2E] text-white shadow-sm'
                      : 'bg-white text-[#1F2A2E] hover:bg-slate-50 border border-slate-200 shadow-xs'
                  }`}
                >
                  {cat.name.split('(')[0].trim()}
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

      {/* ── Section 07: Testimonials ── */}
      <TestimoniSection />

      {/* ── Section 08: FAQ ── */}
      <FAQSection />

      {/* ── Section 09: CTA Banner ── */}
      <CTABanner />

      {/* Footer */}
      <footer className="border-t border-[#29363B] bg-[#172124] py-12 text-center text-xs text-slate-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-3">
          <div className="flex items-center justify-center gap-2.5">
            <div className="w-7 h-7 rounded-xl bg-[#C1FF72] flex items-center justify-center text-[#1F2A2E] shadow-sm">
              <Activity className="w-4 h-4 stroke-[3]" />
            </div>
            <span className="font-black text-sm text-white">GCL</span>
            <span className="text-slate-600">•</span>
            <span className="font-semibold text-xs text-slate-300">Gymnastics Competition Level</span>
          </div>
          <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed">
            Official technical platform for Men&apos;s Artistic Gymnastics apparatus curriculum, movement checklists, and coach performance evaluations.
          </p>
          <p className="text-xs text-slate-500 pt-1">
            Official Domain: <a href="https://gymnasticcomplevel.com" className="text-slate-400 hover:text-[#C1FF72] transition-colors underline">gymnasticcomplevel.com</a>
          </p>
          <p className="text-[11px] text-slate-500 pt-2">
            &copy; {new Date().getFullYear()} Gymnastics Competition Level (GCL). All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
