'use client';

import React, { useRef } from 'react';
import Image from 'next/image';
import {
  ChevronLeft,
  ChevronRight,
  Compass,
  ArrowDown,
  ShieldCheck,
  Target,
} from 'lucide-react';

export interface ApparatusInfo {
  id: string;
  code: string;
  name: string;
  categoryTag: 'Putra & Putri' | 'Khusus Putri (WAG)' | 'Khusus Putra (MAG)';
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
  },
];

interface ApparatusSectionProps {
  activeId: string;
  onSelectApparatus: (id: string) => void;
}

export function ApparatusSection({ activeId, onSelectApparatus }: ApparatusSectionProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

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
    <section id="nomor-alat" className="py-12 border-b border-[#262626] bg-[#0c0c0c] scroll-mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-6 gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
              <Compass className="w-3.5 h-3.5 text-blue-500" />
              <span>Disiplin Senam Artistik</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              6 Nomor Alat Resmi FIG
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Pilih nomor alat untuk melihat fokus drill latihan dan daftar materi videonya.
            </p>
          </div>

          {/* Scroll Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => scroll('left')}
              aria-label="Geser kiri"
              className="w-8 h-8 rounded-lg bg-[#1a1a1a] border border-[#333] hover:border-slate-400 text-slate-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => scroll('right')}
              aria-label="Geser kanan"
              className="w-8 h-8 rounded-lg bg-[#1a1a1a] border border-[#333] hover:border-slate-400 text-slate-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* ── Horizontal Scrollable Apparatus Cards ── */}
        <div
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto pb-4 pt-1 snap-x snap-mandatory scroll-smooth no-scrollbar"
        >
          {APPARATUS_DATA.map((item) => {
            const isSelected = item.id === activeId;
            return (
              <button
                key={item.id}
                onClick={() => onSelectApparatus(item.id)}
                className={`w-[240px] sm:w-[270px] shrink-0 snap-start text-left rounded-xl border p-3 transition-colors cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? 'bg-[#1a202c] border-blue-500 ring-1 ring-blue-500'
                    : 'bg-[#141414] border-[#262626] hover:border-[#444]'
                }`}
              >
                <div>
                  <div className="relative h-28 sm:h-32 w-full rounded-lg overflow-hidden bg-[#1f1f1f] mb-3">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover object-center"
                      sizes="270px"
                    />
                    <div className="absolute top-2 left-2 flex items-center gap-1.5">
                      <span className="px-2 py-0.5 rounded bg-blue-600 font-bold text-xs text-white">
                        {item.code}
                      </span>
                    </div>
                  </div>

                  <h3 className={`text-sm font-bold leading-tight ${isSelected ? 'text-blue-300' : 'text-white'}`}>
                    {item.name}
                  </h3>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    {item.categoryTag}
                  </p>
                </div>

                <p className="text-[11px] text-slate-400 mt-2 line-clamp-2 leading-relaxed">
                  {item.drillSummary}
                </p>
              </button>
            );
          })}
        </div>

        {/* ── Active Apparatus Practical Coaching Card (No modal popup slop) ── */}
        <div className="mt-6 p-5 sm:p-6 rounded-xl bg-[#141414] border border-[#2a2a2a]">
          <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
            {/* Left: Specs & Drills */}
            <div className="flex-1 space-y-4">
              <div className="flex flex-wrap items-center gap-3">
                <span className="px-2.5 py-1 rounded bg-blue-600 font-black text-xs text-white">
                  {selectedApparatus.code}
                </span>
                <h3 className="text-lg font-bold text-white">
                  Panduan Latihan: {selectedApparatus.name}
                </h3>
                <span className="text-xs text-slate-400 font-mono bg-[#222] px-2 py-0.5 rounded">
                  {selectedApparatus.dimensions}
                </span>
              </div>

              {/* Key drills */}
              <div className="space-y-1.5">
                <p className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                  <Target className="w-3.5 h-3.5 text-blue-400" />
                  <span>Drill Teknik Utama:</span>
                </p>
                <ul className="space-y-1 text-xs text-slate-300">
                  {selectedApparatus.keyDrills.map((drill, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-blue-400 font-bold">•</span>
                      <span>{drill}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Safety note */}
              <div className="flex items-start gap-2 p-3 rounded-lg bg-[#1a1811] border border-[#423115] text-xs text-amber-200/90">
                <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span>
                  <strong className="text-amber-300">Keselamatan: </strong>
                  {selectedApparatus.safetyTip}
                </span>
              </div>
            </div>

            {/* Right: Scroll to Video button */}
            <div className="lg:w-64 shrink-0 flex flex-col justify-center">
              <a
                href={`#section-${selectedApparatus.id}`}
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition-colors cursor-pointer shadow-sm"
              >
                <span>Lihat Video {selectedApparatus.code}</span>
                <ArrowDown className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
