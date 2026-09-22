'use client';

import React, { useState, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { getFirstVideoByCategory } from '@/lib/data';
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
  categoryTag: 'Khusus Putra (MAG)' | 'Khusus Putri (WAG)' | 'Putra & Putri';
  dimensions: string;
  image: string;
  drillSummary: string;
  keyDrills: string[];
  safetyTip: string;
  isPrimary?: boolean;
}

export const APPARATUS_DATA: ApparatusInfo[] = [
  {
    id: 'cat-fx',
    code: 'FX',
    name: 'Floor Exercise (Senam Lantai)',
    categoryTag: 'Khusus Putra (MAG)',
    dimensions: 'Matras pegas 12 × 12 m',
    image: '/images/apparatus-floor.webp',
    drillSummary: 'Rangkaian akrobatik lari awalan, variasi salto, dan teknik stick landing di atas matras.',
    keyDrills: [
      'Drill awalan lari berirama dan entri hurdle',
      'Tolakan round-off dan flic-flac (back handspring)',
      'Teknik stick landing tanpa langkah tambahan (fleksi lutut peredam)',
    ],
    safetyTip: 'Gunakan matras bantu pendaratan busa tambahan untuk latihan salto rotasi baru.',
    isPrimary: true,
  },
  {
    id: 'cat-ph',
    code: 'PH',
    name: 'Pommel Horse (Kuda-Kuda Pelana)',
    categoryTag: 'Khusus Putra (MAG)',
    dimensions: 'Tinggi 1.15 m | 2 Pelana',
    image: '/images/apparatus-pommel.webp',
    drillSummary: 'Putaran melingkar kontinyu dua kaki dan satu kaki bertumpu pada pergelangan tangan.',
    keyDrills: [
      'Double leg circles konstan di atas pelana (pommels)',
      'Scissor hop dengan pinggul terangkat tinggi',
      'Perpindahan titik berat lateral untuk membebaskan tumpuan tangan',
    ],
    safetyTip: 'Lakukan penguatan pergelangan tangan (wrist conditioning) secara teratur untuk mencegah cedera.',
    isPrimary: true,
  },
  {
    id: 'cat-vt',
    code: 'VT',
    name: 'Vault (Meja Lompat)',
    categoryTag: 'Khusus Putra (MAG)',
    dimensions: 'Tinggi meja 1.35 m (MAG)',
    image: '/images/apparatus-vault.webp',
    drillSummary: 'Akselerasi sprint 25 meter, entri papan pegas (springboard), dan tolakan bahu instan.',
    keyDrills: [
      'Akselerasi sprint konstan tanpa melambat di 5 langkah akhir',
      'Sudut serang telapak kaki saat menghantam papan pegas',
      'Blocking tolakan tangan cepat pada meja lompat (< 0.2 detik)',
    ],
    safetyTip: 'Sesuaikan jarak papan pegas dan jumlah per pegas dengan berat serta power atlet.',
    isPrimary: true,
  },
  {
    id: 'cat-sr',
    code: 'SR',
    name: 'Still Rings (Gelang-Gelang)',
    categoryTag: 'Khusus Putra (MAG)',
    dimensions: 'Tinggi 2.8 m dari matras',
    image: '/images/apparatus-rings.webp',
    drillSummary: 'Ujian kekuatan statis bahu (hold position) diselingi ayunan tanpa goyangan kabel.',
    keyDrills: [
      'Hold statis (Cross, L-sit, Planche) tahan minimal 2 detik',
      'Kip to handstand dengan ring turn-out',
      'Ayunan dinamis tanpa membiarkan tali kabel bergetar',
    ],
    safetyTip: 'Lakukan pemanasan sendi rotator cuff bahu secara menyeluruh sebelum melatih hold statis.',
    isPrimary: false,
  },
  {
    id: 'cat-pb',
    code: 'PB',
    name: 'Parallel Bars (Palang Sejajar)',
    categoryTag: 'Khusus Putra (MAG)',
    dimensions: 'Tinggi 2.0 m | Panjang 3.5 m',
    image: '/images/apparatus-bars.webp',
    drillSummary: 'Kombinasi ayunan, tumpuan tangan, gerakan di bawah palang, dan dismount salto pendaratan.',
    keyDrills: [
      'Ayunan bahu (shoulder swing) di antara dua palang',
      'Cast to handstand dan pirouette di atas palang',
      'Salto dismount samping dengan posisi stick landing kokoh',
    ],
    safetyTip: 'Pastikan lebar jarak kedua palang diatur tepat sesuai lebar bahu atlet.',
    isPrimary: false,
  },
  {
    id: 'cat-hb',
    code: 'HB',
    name: 'Horizontal Bar (Palang Tunggal)',
    categoryTag: 'Khusus Putra (MAG)',
    dimensions: 'Tinggi 2.8 m | Palang baja elastis',
    image: '/images/apparatus-highbar.jpg',
    drillSummary: 'Gerakan ayunan dinamis kecepatan tinggi, giant swing terus-menerus, dan pelepasan pegangan salto spektakuler.',
    keyDrills: [
      'Tap swing pembentukan bentuk arch-to-hollow fleksibel',
      'Giant swing rotasi 360° penuh dan perubahan posisi cengkeraman (grip)',
      'Flyaway release move dan pendaratan terfiksasi di matras tebal',
    ],
    safetyTip: 'Wajib gunakan handgrip pelindung kulit telapak tangan dan chalk sebelum naik palang.',
    isPrimary: false,
  },
];

interface ApparatusSectionProps {
  activeId: string;
  onSelectApparatus: (id: string) => void;
}

export function ApparatusSection({ activeId, onSelectApparatus }: ApparatusSectionProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showAllApparatus, setShowAllApparatus] = useState(false);

  const displayedApparatus = showAllApparatus
    ? APPARATUS_DATA
    : APPARATUS_DATA.filter((item) => item.isPrimary);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 300;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  const selectedApparatus =
    APPARATUS_DATA.find((item) => item.id === activeId) || APPARATUS_DATA[0];

  return (
    <section id="nomor-alat" className="py-16 border-b border-slate-200 bg-white scroll-mt-16 text-[#1F2A2E] relative overflow-hidden">
      {/* Scroll anchor compatibility */}
      <div id="kategori-senam" className="sr-only" />
      {/* Subtle ambient lighting blend */}
      <div className="absolute top-0 right-1/4 w-[500px] h-[350px] bg-[radial-gradient(circle,rgba(193,255,114,0.12)_0%,transparent_70%)] pointer-events-none blur-3xl -z-0" />
      <div className="absolute bottom-0 left-10 w-[400px] h-[300px] bg-[radial-gradient(circle,rgba(193,255,114,0.06)_0%,transparent_70%)] pointer-events-none blur-3xl -z-0" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header with Reference Motif */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-6 sm:mb-8 gap-4">
          <div>
            {/* Signature Motif: [03] --- [Kategori Senam] */}
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 rounded-full bg-[#C1FF72] flex items-center justify-center text-[#1F2A2E] font-black text-xs shadow-sm">
                03
              </div>
              <div className="w-8 h-[1px] bg-slate-300" />
              <div className="px-3.5 py-1 rounded-full bg-[#1F2A2E] text-white text-xs font-bold shadow-sm">
                Kategori Senam
              </div>
            </div>

            <h2 className="text-2xl sm:text-4xl font-black text-[#1F2A2E] tracking-tight">
              Kategori Senam Terpilih
            </h2>
            <p className="text-xs sm:text-sm text-[#52636A] mt-1.5 max-w-xl">
              Menampilkan 3 kategori materi inti perkuliahan: Senam Lantai, Kuda-Kuda Pelana, dan Meja Lompat.
            </p>
          </div>

          {/* Toggle & Scroll Buttons: Mobile wrap cleanly with 40px+ touch targets */}
          <div className="flex flex-wrap items-center justify-between sm:justify-end gap-2 w-full sm:w-auto">
            <button
              type="button"
              onClick={() => setShowAllApparatus(!showAllApparatus)}
              className="min-h-[40px] inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-xs font-bold text-[#1F2A2E] transition-all cursor-pointer shadow-sm active:scale-95"
            >
              <Layers className="w-4 h-4 text-emerald-700" />
              <span>{showAllApparatus ? 'Tampilkan 3 Alat Inti' : 'Tampilkan Semua 6 Alat (+3)'}</span>
            </button>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => scroll('left')}
                aria-label="Geser kiri"
                className="w-10 h-10 min-w-[40px] min-h-[40px] rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-[#1F2A2E] flex items-center justify-center transition-colors cursor-pointer shadow-sm active:scale-95"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => scroll('right')}
                aria-label="Geser kanan"
                className="w-10 h-10 min-w-[40px] min-h-[40px] rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-[#1F2A2E] flex items-center justify-center transition-colors cursor-pointer shadow-sm active:scale-95"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Horizontal scrollable apparatus cards - Edge-to-edge swipe on phones */}
        <div
          ref={scrollRef}
          className="-mx-4 px-4 sm:mx-0 sm:px-0 flex gap-3.5 sm:gap-5 overflow-x-auto pb-4 pt-1 snap-x snap-mandatory scroll-smooth no-scrollbar"
        >
          {displayedApparatus.map((item) => {
            const isSelected = item.id === activeId;
            return (
              <button
                type="button"
                key={item.id}
                onClick={() => onSelectApparatus(item.id)}
                className={`w-[260px] xs:w-[285px] sm:w-[310px] shrink-0 snap-start text-left rounded-2xl border p-4 transition-all cursor-pointer flex flex-col justify-between active:scale-[0.99] ${
                  isSelected
                    ? 'bg-white border-2 border-[#1F2A2E] ring-4 ring-[#C1FF72]/50 shadow-md'
                    : 'bg-white border-slate-200 hover:border-slate-400 shadow-sm'
                }`}
              >
                <div>
                  <div className="relative h-36 sm:h-40 w-full rounded-xl overflow-hidden bg-slate-100 mb-3.5 shadow-inner">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover object-center"
                      sizes="310px"
                    />
                    <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                      <span className="px-2.5 py-0.5 rounded-full bg-[#C1FF72] font-black text-xs text-[#1F2A2E] shadow-sm border border-[#a8ed4b]">
                        {item.code}
                      </span>
                    </div>
                  </div>

                  <h3 className="text-base font-black leading-snug text-[#1F2A2E]">
                    {item.name}
                  </h3>
                  <p className="text-[11px] font-bold text-[#52636A] mt-0.5">
                    {item.categoryTag}
                  </p>
                </div>

                <p className="text-xs text-[#52636A] mt-3 line-clamp-2 leading-relaxed">
                  {item.drillSummary}
                </p>
              </button>
            );
          })}
        </div>

        {/* Active apparatus coaching card */}
        <div className="mt-8 p-4 sm:p-6 lg:p-8 rounded-3xl bg-[#F4F8FA] border border-slate-200/90 shadow-sm">
          <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-5 sm:gap-6">
            {/* Left: Specs & Drills */}
            <div className="flex-1 space-y-3.5 sm:space-y-4">
              <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
                <span className="px-3 py-1 rounded-full bg-[#C1FF72] font-black text-xs text-[#1F2A2E] shadow-sm border border-[#a8ed4b]">
                  {selectedApparatus.code}
                </span>
                <h3 className="text-lg sm:text-xl font-black text-[#1F2A2E]">
                  Panduan Latihan: {selectedApparatus.name}
                </h3>
                <span className="text-xs text-[#1F2A2E] font-bold bg-white border border-slate-200 px-3 py-1 rounded-lg">
                  {selectedApparatus.dimensions}
                </span>
              </div>

              {/* Key drills */}
              <div className="space-y-2 pt-1">
                <p className="text-xs font-black text-[#1F2A2E] uppercase tracking-wider flex items-center gap-2">
                  <Target className="w-4 h-4 text-emerald-700" />
                  <span>Drill Teknik Utama:</span>
                </p>
                <ul className="space-y-1.5 text-xs sm:text-sm text-[#1F2A2E]">
                  {selectedApparatus.keyDrills.map((drill, idx) => (
                    <li key={idx} className="flex items-start gap-2.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#C1FF72] mt-1.5 shrink-0 border border-slate-600" />
                      <span>{drill}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Safety note */}
              <div className="flex items-start gap-3 p-3.5 sm:p-4 rounded-2xl bg-amber-50/80 border border-amber-200 text-xs text-amber-950">
                <ShieldCheck className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-amber-900 block font-bold mb-0.5">Protokol Keselamatan:</strong>
                  <span>{selectedApparatus.safetyTip}</span>
                </div>
              </div>
            </div>

            {/* Right: Direct Watch Video button */}
            <div className="w-full lg:w-64 shrink-0 flex flex-col justify-center pt-2 lg:pt-0">
              <Link
                href={getFirstVideoByCategory(selectedApparatus.id) ? `/watch/${getFirstVideoByCategory(selectedApparatus.id)?.id}` : `#section-${selectedApparatus.id}`}
                className="w-full min-h-[48px] inline-flex items-center justify-center gap-2 px-6 py-3.5 sm:py-4 rounded-full bg-[#C1FF72] hover:bg-[#b0f555] text-[#1F2A2E] font-black text-sm transition-all cursor-pointer shadow-md hover:scale-[1.02] active:scale-95 border border-[#a8ed4b]"
              >
                <span>Putar Video {selectedApparatus.code}</span>
                <ArrowUpRight className="w-4 h-4 stroke-[2.5]" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
