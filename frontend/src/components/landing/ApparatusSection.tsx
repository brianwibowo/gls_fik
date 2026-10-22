'use client';

import React, { useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import type { Video } from '@/lib/types';
import {
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Target,
  Layers,
  ArrowUpRight,
} from 'lucide-react';

export interface ApparatusInfo {
  id: string;
  code: string;
  name: string;
  categoryTag: string;
  dimensions: string;
  image: string;
  drillSummary: string;
  keyDrills: string[];
  safetyTip: string;
}

export const APPARATUS_DATA: ApparatusInfo[] = [
  {
    id: 'cat-fx',
    code: 'FX',
    name: 'Floor Exercise (FX)',
    categoryTag: "Men's Artistic Gymnastics",
    dimensions: '12 × 12 m Spring Mat',
    image: '/images/apparatus-floor.webp',
    drillSummary: 'Acrobatic passes, rhythm hurdles, rotational tumbling sequences, and stuck landings.',
    keyDrills: [
      'Accelerating approach run and hurdle entry drills',
      'Round-off rebound into back handspring (flic-flac)',
      'Controlled stick landings with knees absorbing impact',
    ],
    safetyTip: 'Use supplemental resi-mats for high-revolution rotational flip progressions.',
  },
  {
    id: 'cat-ph',
    code: 'PH',
    name: 'Pommel Horse (PH)',
    categoryTag: "Men's Artistic Gymnastics",
    dimensions: 'Height: 1.15 m | 2 Pommels',
    image: '/images/apparatus-pommel.webp',
    drillSummary: 'Continuous circular and scissor leg routines executed across the length of the apparatus.',
    keyDrills: [
      'Single and double leg circles on mushroom trainers',
      'High-hip scissor transitions across pommel handles',
      'Lateral center-of-mass shifts to unweight hands smoothly',
    ],
    safetyTip: 'Incorporate dedicated wrist conditioning and mobility drills before each session.',
  },
  {
    id: 'cat-vt',
    code: 'VT',
    name: 'Vault (VT)',
    categoryTag: "Men's Artistic Gymnastics",
    dimensions: 'Table Height: 1.35 m (MAG)',
    image: '/images/apparatus-vault.webp',
    drillSummary: 'Sprint acceleration, explosive springboard contact, rapid shoulder block, and post-flight landing.',
    keyDrills: [
      'Constant sprint acceleration maintaining velocity into final hurdle',
      'Aggressive board strike angle transferring horizontal power to lift',
      'Sub-0.2 second shoulder repulsion block on vault table',
    ],
    safetyTip: 'Calibrate springboard distance and spring tension to athlete weight and approach power.',
  },
  {
    id: 'cat-sr',
    code: 'SR',
    name: 'Still Rings (SR)',
    categoryTag: "Men's Artistic Gymnastics",
    dimensions: 'Ring Height: 2.80 m',
    image: '/images/apparatus-rings.webp',
    drillSummary: 'Static shoulder strength holds combined with dynamic swings without cable vibration.',
    keyDrills: [
      'Isometric holds (Support hold, L-sit, Inverted hang) held for at least 2 seconds',
      'Kip to straight-arm support with ring turn-out (RTO)',
      'Smooth amplitude swings maintaining still cables',
    ],
    safetyTip: 'Warm up the rotator cuff and shoulder capsule thoroughly before training strength holds.',
  },
  {
    id: 'cat-pb',
    code: 'PB',
    name: 'Parallel Bars (PB)',
    categoryTag: "Men's Artistic Gymnastics",
    dimensions: 'Height: 2.00 m | Length: 3.50 m',
    image: '/images/apparatus-bars.webp',
    drillSummary: 'Support swings, upper arm holds, transitions below and above the bars, and stuck dismounts.',
    keyDrills: [
      'Shoulder swings in straight-arm support between bars',
      'Upper-arm support to straddle and swing to handstand',
      'Side swing flank dismount with secure landing absorption',
    ],
    safetyTip: 'Ensure bar width is individually adjusted to the athlete shoulder span.',
  },
  {
    id: 'cat-hb',
    code: 'HB',
    name: 'Horizontal Bar (HB)',
    categoryTag: "Men's Artistic Gymnastics",
    dimensions: 'Height: 2.80 m | Elastic Steel Bar',
    image: '/images/apparatus-highbar.jpg',
    drillSummary: 'High-speed rhythm swings, giant rotations, bar flight releases, and aerial dismounts.',
    keyDrills: [
      'Tap swing hollow-to-arch rhythm timing',
      '360-degree giant swings with grip changes and kip elements',
      'Release trajectory and high-amplitude flyaway dismount to landing mat',
    ],
    safetyTip: 'Gymnastics handguards (dowel grips) and magnesium chalk are mandatory on high bar.',
  },
];

interface ApparatusSectionProps {
  activeId: string;
  onSelectApparatus: (id: string) => void;
  videos?: Video[];
}

export function ApparatusSection({ activeId, onSelectApparatus, videos = [] }: ApparatusSectionProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 340;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  const getFirstVideoForCategory = (categoryId: string) => {
    return videos.find((v) => v.categoryId === categoryId);
  };

  return (
    <section
      id="apparatus"
      className="py-16 sm:py-20 bg-[#F4F8FA] border-b border-slate-200/90 relative overflow-hidden text-[#1F2A2E] scroll-mt-16"
    >
      <div className="absolute top-10 left-10 w-[500px] h-[350px] bg-[radial-gradient(circle,rgba(193,255,114,0.12)_0%,transparent_70%)] pointer-events-none blur-3xl -z-0" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10 border-b border-slate-200 pb-5">
          <div className="max-w-2xl">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 rounded-full bg-[#C1FF72] flex items-center justify-center text-[#1F2A2E] font-black text-xs shadow-sm">
                03
              </div>
              <div className="w-8 h-[1px] bg-slate-300" />
              <div className="px-3.5 py-1 rounded-full bg-[#1F2A2E] text-white text-xs font-bold shadow-sm">
                Apparatus Standards
              </div>
            </div>

            <h2 className="text-2xl sm:text-4xl font-black text-[#1F2A2E] tracking-tight">
              All 6 Men&apos;s Artistic Gymnastics Apparatus
            </h2>
            <p className="text-xs sm:text-sm text-[#52636A] mt-1.5 leading-relaxed">
              Explore equipment specifications, FIG safety guidelines, key technical drills, and curriculum video breakdowns.
            </p>
          </div>

          {/* Desktop scroll buttons */}
          <div className="hidden sm:flex items-center gap-2 shrink-0">
            <span className="text-xs text-[#52636A] font-bold mr-1">
              6 Disciplines
            </span>
            <button
              type="button"
              onClick={() => scroll('left')}
              aria-label="Scroll left apparatus list"
              className="w-10 h-10 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-[#1F2A2E] flex items-center justify-center transition-colors cursor-pointer shadow-sm active:scale-95"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              type="button"
              onClick={() => scroll('right')}
              aria-label="Scroll right apparatus list"
              className="w-10 h-10 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-[#1F2A2E] flex items-center justify-center transition-colors cursor-pointer shadow-sm active:scale-95"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* 6 Apparatus Cards Grid / Horizontal Scroll */}
        <div
          ref={scrollRef}
          data-lenis-prevent
          className="-mx-4 px-4 sm:mx-0 sm:px-0 flex sm:grid sm:grid-cols-2 lg:grid-cols-3 gap-5 overflow-x-auto sm:overflow-visible pb-4 pt-1 snap-x snap-mandatory no-scrollbar"
        >
          {APPARATUS_DATA.map((item) => {
            const firstVideo = getFirstVideoForCategory(item.id);
            const watchUrl = firstVideo ? `/watch/${firstVideo.id}` : `/#katalog-video`;
            const isActive = activeId === item.id;

            return (
              <div
                key={item.id}
                onClick={() => onSelectApparatus(item.id)}
                className={`w-[290px] xs:w-[320px] sm:w-auto shrink-0 snap-start bg-white border rounded-3xl overflow-hidden flex flex-col justify-between transition-all duration-300 shadow-sm hover:shadow-xl group cursor-pointer ${
                  isActive
                    ? 'border-[#1F2A2E] ring-2 ring-[#C1FF72]'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div>
                  {/* Apparatus Photo */}
                  <div className="relative w-full h-44 overflow-hidden bg-slate-100">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      sizes="(max-width: 768px) 320px, (max-width: 1200px) 50vw, 33vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent pointer-events-none" />

                    {/* Code badge */}
                    <div className="absolute top-3 left-3 px-2.5 py-1 rounded-lg bg-[#1F2A2E]/90 text-[#C1FF72] text-xs font-black backdrop-blur-xs shadow-sm border border-white/10">
                      {item.code}
                    </div>

                    {/* Dimensions Pill */}
                    <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white text-[11px] font-bold">
                      <span className="truncate">{item.dimensions}</span>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-5 space-y-3.5">
                    <div>
                      <span className="text-[10px] font-bold text-[#52636A] uppercase tracking-wider block mb-1">
                        {item.categoryTag}
                      </span>
                      <h3 className="text-lg font-black text-[#1F2A2E] leading-snug group-hover:text-black transition-colors">
                        {item.name}
                      </h3>
                      <p className="text-xs text-[#52636A] mt-1.5 leading-relaxed line-clamp-2">
                        {item.drillSummary}
                      </p>
                    </div>

                    {/* Key Drills */}
                    <div className="pt-2 border-t border-slate-100 space-y-1.5">
                      <div className="flex items-center gap-1.5 text-[11px] font-bold text-[#1F2A2E]">
                        <Target className="w-3.5 h-3.5 text-[#1F2A2E]" />
                        <span>Key Training Drills:</span>
                      </div>
                      <ul className="space-y-1 text-xs text-[#52636A]">
                        {item.keyDrills.slice(0, 2).map((drill, idx) => (
                          <li key={idx} className="flex items-start gap-1.5 line-clamp-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#C1FF72] mt-1.5 shrink-0 border border-[#1F2A2E]/30" />
                            <span>{drill}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Safety Tip */}
                    <div className="p-2.5 rounded-xl bg-[#F4F8FA] border border-slate-200/80 flex items-start gap-2 text-[11px] text-[#52636A]">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                      <span className="line-clamp-2">{item.safetyTip}</span>
                    </div>
                  </div>
                </div>

                {/* Bottom Action Button */}
                <div className="p-5 pt-0">
                  <Link
                    href={watchUrl}
                    className="w-full min-h-[44px] py-2.5 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all bg-[#1F2A2E] hover:bg-black text-[#C1FF72] shadow-sm group-hover:scale-[1.01]"
                  >
                    <span>Watch Curriculum Videos</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
