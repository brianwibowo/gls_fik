'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Play, Clock, User, Sparkles, Layers } from 'lucide-react';
import { ScrollReveal, StaggerContainer, StaggerItem } from '../ui/ScrollReveal';

export function ApparatusSection({ onOpenLogin }: { onOpenLogin?: () => void }) {
  const [activeCategory, setActiveCategory] = useState('Semua');

  const categories = [
    'Semua',
    'Floor (Lantai)',
    'Balance Beam (Balok)',
    'Vault (Meja Lompat)',
    'Uneven Bars (Palang)',
    'Still Rings (Gelang)',
    'Pommel Horse (Kuda)',
  ];

  const sampleSkills = [
    {
      id: 1,
      name: 'Fondasi Awalan & Rangkaian Senam Lantai',
      category: 'Floor (Lantai)',
      level: 'Dasar',
      levelColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      duration: '03:45',
      image: '/images/apparatus-floor.webp',
      coach: 'Pelatih Budi S.',
      views: '1.2k views',
    },
    {
      id: 2,
      name: 'Grand Jeté Split Leap & Eksekusi FX',
      category: 'Floor (Lantai)',
      level: 'Menengah',
      levelColor: 'bg-blue-50 text-blue-700 border-blue-200',
      duration: '04:15',
      image: '/images/hero-gymnast-elite.webp',
      coach: 'Pelatih Budi S.',
      views: '980 views',
    },
    {
      id: 3,
      name: 'Koreksi Pendaratan Sempurna (Stick Landing)',
      category: 'Floor (Lantai)',
      level: 'Mahir',
      levelColor: 'bg-indigo-50 text-indigo-700 border-indigo-200',
      duration: '05:08',
      image: '/images/hero-gymnast.webp',
      coach: 'Pelatih Budi S.',
      views: '1.5k views',
    },
    {
      id: 4,
      name: 'Split Leap & Postur Keseimbangan di Atas Balok',
      category: 'Balance Beam (Balok)',
      level: 'Dasar',
      levelColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      duration: '04:30',
      image: '/images/apparatus-beam.webp',
      coach: 'Pelatih Sarah M.',
      views: '840 views',
    },
    {
      id: 5,
      name: 'Lari Awalan & Entri Springboard Meja Lompat',
      category: 'Vault (Meja Lompat)',
      level: 'Dasar',
      levelColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      duration: '03:50',
      image: '/images/apparatus-vault.webp',
      coach: 'Pelatih Hendra P.',
      views: '1.1k views',
    },
    {
      id: 6,
      name: 'Handspring Vault & Dorongan Meja Lompat',
      category: 'Vault (Meja Lompat)',
      level: 'Menengah',
      levelColor: 'bg-blue-50 text-blue-700 border-blue-200',
      duration: '05:20',
      image: '/images/apparatus-vault.webp',
      coach: 'Pelatih Hendra P.',
      views: '760 views',
    },
    {
      id: 7,
      name: 'Ayunan Poros & Transisi Palang Bertingkat',
      category: 'Uneven Bars (Palang)',
      level: 'Menengah',
      levelColor: 'bg-blue-50 text-blue-700 border-blue-200',
      duration: '04:45',
      image: '/images/apparatus-bars.webp',
      coach: 'Pelatih Sarah M.',
      views: '920 views',
    },
    {
      id: 8,
      name: 'Kekuatan Bahu & Hold Statis Gelang-Gelang',
      category: 'Still Rings (Gelang)',
      level: 'Mahir',
      levelColor: 'bg-indigo-50 text-indigo-700 border-indigo-200',
      duration: '06:10',
      image: '/images/apparatus-rings.webp',
      coach: 'Pelatih Agus R.',
      views: '650 views',
    },
    {
      id: 9,
      name: 'Single Leg Circle Kuda-Kuda Pelana',
      category: 'Pommel Horse (Kuda)',
      level: 'Menengah',
      levelColor: 'bg-blue-50 text-blue-700 border-blue-200',
      duration: '04:12',
      image: '/images/apparatus-pommel.webp',
      coach: 'Pelatih Agus R.',
      views: '540 views',
    },
  ];

  const filteredSkills =
    activeCategory === 'Semua'
      ? sampleSkills
      : sampleSkills.filter((s) => s.category.toLowerCase().includes(activeCategory.split(' ')[0].toLowerCase()));

  return (
    <section id="alat" className="py-20 md:py-28 bg-[#F8FAFC] border-t border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header and Filter */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-12 gap-6">
          <ScrollReveal direction="right">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 border border-blue-200/60 px-3.5 py-1.5 rounded-full">
                Perpustakaan Gerakan
              </span>
              <h2 className="mt-3 text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                Materi Latihan Terstruktur Sesuai Nomor Alat
              </h2>
              <p className="mt-3 text-base text-slate-600 max-w-xl leading-relaxed">
                Pilih nomor alat yang sedang dilatih di gym untuk mempelajari panduan biomekanika langkah demi langkah.
              </p>
            </div>
          </ScrollReveal>

          {/* Filter Pills */}
          <ScrollReveal direction="left">
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    activeCategory === cat
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                      : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200/80'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </ScrollReveal>
        </div>

        {/* Movement Cards Grid */}
        <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSkills.map((skill) => (
            <StaggerItem key={skill.id}>
              <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden hover:shadow-xl hover:border-blue-300 transition-all duration-300 flex flex-col group h-full">
                {/* Visual Thumbnail */}
                <div className="relative h-48 sm:h-52 w-full bg-slate-100 overflow-hidden">
                  <Image
                    src={skill.image}
                    alt={skill.name}
                    fill
                    className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-slate-950/10 to-transparent pointer-events-none" />

                  {/* Badges on Thumbnail */}
                  <div className="absolute top-3 left-3 flex items-center gap-2">
                    <span className="px-2.5 py-1 rounded-lg bg-black/50 backdrop-blur-md border border-white/20 text-[11px] font-bold text-white">
                      {skill.category.split(' ')[0]}
                    </span>
                    <span className={`px-2.5 py-1 rounded-lg backdrop-blur-md text-[11px] font-bold border ${skill.levelColor}`}>
                      {skill.level}
                    </span>
                  </div>

                  <div className="absolute bottom-3 right-3">
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-black/60 backdrop-blur-md text-[11px] font-semibold text-white">
                      <Clock className="w-3 h-3 text-slate-300" />
                      <span>{skill.duration}</span>
                    </span>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-base font-bold text-slate-900 group-hover:text-blue-600 transition-colors leading-snug line-clamp-2">
                      {skill.name}
                    </h3>

                    <div className="mt-3 flex items-center justify-between text-xs text-slate-500">
                      <div className="flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5 text-slate-400" />
                        <span>{skill.coach}</span>
                      </div>
                      <span className="text-[11px] font-medium text-slate-400">{skill.views}</span>
                    </div>
                  </div>

                  {/* Action Link */}
                  <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-xs font-semibold text-blue-600 group-hover:underline flex items-center gap-1">
                      <span>Buka Modul</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </span>

                    <Link
                      href="/login"
                      target="_blank"
                      className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center hover:bg-blue-600 hover:text-white transition-colors"
                      aria-label="Tonton video gerakan"
                    >
                      <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                    </Link>
                  </div>
                </div>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>

        {/* Explore All Apparatus Strip */}
        <div className="mt-12 text-center">
          <Link
            href="/login"
            target="_blank"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white border border-slate-200 text-slate-700 text-xs sm:text-sm font-bold hover:bg-slate-50 hover:text-blue-600 hover:border-blue-200 transition-all shadow-xs"
          >
            <Layers className="w-4 h-4 text-blue-600" />
            <span>Lihat Seluruh 50+ Modul Gerakan di Platform GLS</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
