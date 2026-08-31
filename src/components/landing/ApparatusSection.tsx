'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Play, Eye } from 'lucide-react';
import { ScrollReveal, StaggerContainer, StaggerItem } from '../ui/ScrollReveal';

export function ApparatusSection({ onOpenLogin }: { onOpenLogin?: () => void }) {
  const [activeCategory, setActiveCategory] = useState('Semua');

  const categories = ['Semua', 'Floor (Lantai)', 'Balance Beam (Balok)', 'Vault (Meja Lompat)', 'Bars & Rings'];

  const sampleSkills = [
    {
      id: 1,
      name: 'Fondasi & Awalan Senam Lantai',
      category: 'Floor (Lantai)',
      level: 'Dasar',
      duration: '03:45',
      image: '/images/apparatus-floor.webp',
      coach: 'Pelatih Budi S.',
    },
    {
      id: 2,
      name: 'Rangkaian Eksekusi & Dinamika FX',
      category: 'Floor (Lantai)',
      level: 'Menengah',
      duration: '04:12',
      image: '/images/hero-gymnast.webp',
      coach: 'Pelatih Budi S.',
    },
    {
      id: 3,
      name: 'Koreksi Pendaratan (Stick Landing)',
      category: 'Floor (Lantai)',
      level: 'Mahir',
      duration: '05:08',
      image: '/images/feature-progress.webp',
      coach: 'Pelatih Budi S.',
    },
    {
      id: 4,
      name: 'Split Leap & Full Turn',
      category: 'Balance Beam (Balok)',
      level: 'Dasar',
      duration: '05:00',
      image: '/images/apparatus-beam.webp',
      coach: 'Pelatih Sarah M.',
    },
  ];

  const filteredSkills = activeCategory === 'Semua'
    ? sampleSkills
    : sampleSkills.filter((s) => s.category.toLowerCase().includes(activeCategory.split(' ')[0].toLowerCase()));

  return (
    <section className="py-20 bg-white border-t border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <ScrollReveal direction="right">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-3 py-1.5 rounded-md">
                Perpustakaan Gerakan
              </span>
              <h2 className="mt-3 text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                Materi Latihan Terstruktur Sesuai Alat
              </h2>
              <p className="mt-2 text-base text-slate-600 max-w-xl">
                Atlet dapat memilih nomor alat yang sedang dilatih dan mempelajari panduan teknik langkah demi langkah.
              </p>
            </div>
          </ScrollReveal>

          {/* Category Filter Pills */}
          <ScrollReveal direction="left" className="mt-6 md:mt-0">
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                    activeCategory === cat
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </ScrollReveal>
        </div>

        {/* Movement Cards Grid */}
        <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredSkills.map((skill) => (
            <StaggerItem key={skill.id}>
              <div className="bg-white rounded-xl border border-slate-200 shadow-gls overflow-hidden hover:shadow-md hover:border-blue-300 transition-all duration-300 flex flex-col group">
                <div className="relative h-44 w-full bg-slate-100 overflow-hidden">
                  <Image
                    src={skill.image}
                    alt={skill.name}
                    fill
                    className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 300px"
                  />
                  <div className="absolute inset-0 bg-slate-900/20 group-hover:bg-slate-900/30 transition-colors flex items-center justify-center">
                    <div className="w-10 h-10 rounded-full bg-white/90 backdrop-blur-xs text-blue-600 flex items-center justify-center shadow-md transform scale-90 group-hover:scale-100 transition-transform">
                      <Play className="w-5 h-5 fill-current ml-0.5" />
                    </div>
                  </div>

                  <div className="absolute top-3 left-3">
                    <span className="px-2.5 py-1 rounded-md bg-slate-900/75 backdrop-blur-xs text-[10px] font-bold text-white uppercase">
                      {skill.level}
                    </span>
                  </div>

                  <div className="absolute bottom-3 right-3">
                    <span className="px-2 py-0.5 rounded bg-black/60 text-[10px] font-medium text-white">
                      {skill.duration}
                    </span>
                  </div>
                </div>

                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <span className="text-[11px] font-semibold text-blue-600 block mb-1">
                      {skill.category}
                    </span>
                    <h4 className="text-sm font-bold text-slate-800 line-clamp-1 group-hover:text-blue-600 transition-colors">
                      {skill.name}
                    </h4>
                    <p className="text-xs text-slate-500 mt-1">Dipandu {skill.coach}</p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-[11px] font-medium text-slate-400">Step-by-step video</span>
                    <Link
                      href="/login"
                      target="_blank"
                      className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 group/btn"
                    >
                      <span>Buka Modul</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 transition-transform" />
                    </Link>
                  </div>
                </div>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>

        {/* View All Callout */}
        <ScrollReveal direction="up" delay={0.2} className="mt-10 text-center">
          <p className="text-xs sm:text-sm text-slate-500 mb-3">
            Tersedia puluhan modul gerakan senam artistik putra &amp; putri yang siap dipelajari.
          </p>
          <Link
            href="/login"
            target="_blank"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-slate-900 text-white text-xs sm:text-sm font-bold hover:bg-slate-800 transition-all shadow-xs"
          >
            <Eye className="w-4 h-4" />
            <span>Lihat Seluruh Perpustakaan Gerakan di Dashboard</span>
          </Link>
        </ScrollReveal>
      </div>
    </section>
  );
}
