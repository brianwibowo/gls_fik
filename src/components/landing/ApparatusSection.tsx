'use client';

import React, { useRef, useState } from 'react';
import Image from 'next/image';
import {
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Layers,
  Award,
  ShieldAlert,
  Compass,
  ArrowRight,
  Info,
  CheckCircle2,
} from 'lucide-react';
import { ScrollReveal } from '../ui/ScrollReveal';

export interface ApparatusInfo {
  id: string;
  code: string;
  name: string;
  subtitle: string;
  categoryTag: 'Putra & Putri' | 'Khusus Putri (WAG)' | 'Khusus Putra (MAG)';
  dimensions: string;
  image: string;
  overview: string;
  keySkills: string[];
  biomechanicsFocus: string;
  safetyTip: string;
}

export const APPARATUS_DATA: ApparatusInfo[] = [
  {
    id: 'cat-fx',
    code: 'FX',
    name: 'Floor Exercise (Senam Lantai)',
    subtitle: 'Rangkaian Akrobatik, Dinamika Salto & Fleksibilitas',
    categoryTag: 'Putra & Putri',
    dimensions: 'Matras pegas 12 × 12 meter',
    image: '/images/apparatus-floor.webp',
    overview:
      'Nomor senam lantai memadukan rentetan gerakan akrobatik eksplosif (salto maju/mundur, twist rotasi longitudinal), elemen keseimbangan, kelenturan dinamis, serta ketepatan stick landing tanpa goyangan tambahan.',
    keySkills: [
      'Awalan lari berirama & hurdle step',
      'Round-off & back handspring (flic-flac)',
      'Salto bertingkat (tuck, pike, layout, twist)',
      'Stick landing dengan redaman fleksi lutut 120°',
    ],
    biomechanicsFocus: 'Konversi momentum linear lari awalan menjadi daya lenting vertikal dan torsi sudut rotasi di udara.',
    safetyTip: 'Gunakan matras bantu pendaratan busa tebal saat melatih variasi rotasi salto baru.',
  },
  {
    id: 'cat-beam',
    code: 'BB',
    name: 'Balance Beam (Balok Keseimbangan)',
    subtitle: 'Presisi Keseimbangan Titik Tumpu Sempit & Salto Akrobatik',
    categoryTag: 'Khusus Putri (WAG)',
    dimensions: 'Tinggi 1.25 m | Lebar 10 cm | Panjang 5 m',
    image: '/images/apparatus-beam.webp',
    overview:
      'Nomor balok menuntut konsentrasi mental dan kontrol postural tertinggi. Atlet mengeksekusi lompatan leap sudut 180°, putaran pirouette pada satu ujung kaki, rangkaian akrobatik balik, hingga dismount akrobatik pendaratan.',
    keySkills: [
      'Koreksi garis pandang mata (focal gaze fixation)',
      'Split leap 180° & wolf jump',
      'Pirouette 360°–720° dengan stabilitas engkel',
      'Back handspring step-out di balok sempit',
    ],
    biomechanicsFocus: 'Penjagaan garis gravitasi tubuh (center of mass) tepat berada di dalam basis penopang (base of support) selebar 10 cm.',
    safetyTip: 'Awali drill di garis lantai (floor line), naik ke balok rendah busa (low beam), baru ke balok kompetisi standar.',
  },
  {
    id: 'cat-vault',
    code: 'VT',
    name: 'Vault (Meja Lompat)',
    subtitle: 'Kecepatan Sprint Eksplosif & Dorongan Tangan Repulse',
    categoryTag: 'Putra & Putri',
    dimensions: 'Tinggi meja 1.25m (putri) / 1.35m (putra) | Runway 25 m',
    image: '/images/apparatus-vault.webp',
    overview:
      'Nomor meja lompat adalah aksi berkecepatan tinggi dalam hitungan detik. Dimulai dari lari sprint maksimal 25 meter, entri ke papan pegas (springboard), dorongan cepat tangan ke permukaan meja (repulsion), terbang akrobatik di udara (post-flight), dan pendaratan kokoh.',
    keySkills: [
      'Sprint akselerasi konstan & entri hurdle springboard',
      'Sudut serang telapak kaki ke pegas papan pantul',
      'Dorongan blocking bahu instan (< 0.2 detik)',
      'Orientasi visual rotasi udara & stick landing',
    ],
    biomechanicsFocus: 'Efisiensi tolakan elastis papan pegas dikombinasikan blocking impuls gaya vertikal pada meja lompat.',
    safetyTip: 'Pastikan jarak springboard dan tingkat kekencangan pegas disesuaikan dengan berat badan serta power atlet.',
  },
  {
    id: 'cat-bars',
    code: 'UB',
    name: 'Uneven Bars (Palang Bertingkat)',
    subtitle: 'Transisi Ayunan Dinamis & Pelepasan Pegangan (Release Move)',
    categoryTag: 'Khusus Putri (WAG)',
    dimensions: 'Palang atas 2.50 m | Palang bawah 1.70 m | Fiberglass bar',
    image: '/images/apparatus-bars.webp',
    overview:
      'Palang bertingkat menguji kehalusan ayunan dan keberanian atlet saat berpindah dari palang rendah ke palang tinggi. Menggabungkan putaran raksasa (giant swing), cast handstand, manuver lepas pegangan (release and catch), dan dismount salto ganda.',
    keySkills: [
      'Cast handstand dengan garis tubuh lurus rapat',
      'Clear hip circle & giant swing ritmis',
      'Transisi shaposhnikova & perpindahan palang',
      'Flyaway double salto dismount',
    ],
    biomechanicsFocus: 'Pemanfaatan kelenturan batang palang (bar flex & whip) untuk menghasilkan momentum lontar pada timing tepat.',
    safetyTip: 'Gunakan kapur magnesium (chalk) dan pelindung telapak tangan (grips) yang terpasang kokoh.',
  },
  {
    id: 'cat-rings',
    code: 'SR',
    name: 'Still Rings (Gelang-Gelang)',
    subtitle: 'Kekuatan Otot Statis Superior & Ayunan Tanpa Goyangan Tali',
    categoryTag: 'Khusus Putra (MAG)',
    dimensions: 'Tinggi 2.80 m dari matras | Diameter cincin 18 cm',
    image: '/images/apparatus-rings.webp',
    overview:
      'Alat paling menuntut kekuatan isometrik murni pada ekstremitas atas. Atlet harus menahan posisi statis tanpa gemetar seperti Iron Cross, Maltese, dan Inverted Cross selama minimal 2 detik, diselingi ayunan dinamis tanpa membiarkan tali kabel bergoyang.',
    keySkills: [
      'Hold statis Iron Cross & Planche horizontal',
      'Kip to handstand dengan ring turn-out',
      'Dislocate & inlocate ayunan dinamis',
      'Double layout twist pendaratan',
    ],
    biomechanicsFocus: 'Stabilitas sendi bahu (glenohumeral joint) dan kontraksi isometrik latissimus dorsi melawan gaya torsi tali lentur.',
    safetyTip: 'Wajib pemanasan rotator cuff mendalam sebelum memulai latihan statis berbeban tinggi.',
  },
  {
    id: 'cat-pommel',
    code: 'PH',
    name: 'Pommel Horse (Kuda-Kuda Pelana)',
    subtitle: 'Putaran Melingkar Berkelanjutan & Ketangkasan Pergelangan Tangan',
    categoryTag: 'Khusus Putra (MAG)',
    dimensions: 'Tinggi 1.15 m | Panjang 1.60 m | 2 Pommels (pelana)',
    image: '/images/apparatus-pommel.webp',
    overview:
      'Nomor kuda pelana menuntut ritme konstan tanpa jeda. Atlet melakukan putaran melingkar satu atau dua kaki (circles, flairs, spindles) berpindah ke berbagai sisi kuda pelana, hanya bertumpu pada kedua pergelangan tangan tanpa kaki menyentuh bodi kuda.',
    keySkills: [
      'Double leg circles pada kedua pelana (pommels)',
      'Scissor hop dengan ekstensi pinggul tinggi',
      'Travel lintas pelana (magyar / sivado travel)',
      'Handstand pirouette dismount dari ujung kuda',
    ],
    biomechanicsFocus: 'Pergeseran titik berat badan lateral secara ritmis untuk membebaskan satu tangan bergantian menumpu putaran.',
    safetyTip: 'Lakukan penguatan sendi pergelangan tangan (wrist conditioning) secara teratur guna mencegah cedera regangan.',
  },
];

interface ApparatusSectionProps {
  onSelectCategory?: (categoryId: string) => void;
}

export function ApparatusSection({ onSelectCategory }: ApparatusSectionProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [selectedApparatus, setSelectedApparatus] = useState<ApparatusInfo | null>(null);
  const [filterTag, setFilterTag] = useState<string>('Semua');

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 360;
      scrollContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  const filteredData =
    filterTag === 'Semua'
      ? APPARATUS_DATA
      : APPARATUS_DATA.filter((item) => item.categoryTag.includes(filterTag));

  return (
    <section id="nomor-alat" className="py-16 bg-[#0e0e0e] border-y border-white/5 relative overflow-hidden">
      {/* Subtle background glow */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-96 h-96 bg-blue-600/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-indigo-600/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-6">
          <ScrollReveal direction="right">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold uppercase tracking-wider mb-3">
              <Compass className="w-3.5 h-3.5" />
              <span>Panduan Nomor Alat Resmi FIG</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight leading-tight">
              Mengenal 6 Nomor Alat Senam Artistik
            </h2>
            <p className="mt-2 text-sm text-slate-400 max-w-2xl leading-relaxed">
              Setiap nomor alat memiliki biomekanika, tuntutan fisik, dan kurikulum teknik yang unik.
              Geser horizontal untuk mempelajari karakteristik dan panduan latihannya.
            </p>
          </ScrollReveal>

          {/* Controls & Filter */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
            {/* Tag Filter */}
            <div className="flex items-center bg-[#181818] border border-white/10 rounded-xl p-1 text-xs">
              {['Semua', 'Putra', 'Putri'].map((tag) => (
                <button
                  key={tag}
                  onClick={() => setFilterTag(tag)}
                  className={`px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
                    filterTag === tag
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>

            {/* Scroll Buttons */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => scroll('left')}
                aria-label="Scroll Kiri"
                className="w-9 h-9 rounded-xl bg-[#1a1a1a] border border-white/10 hover:border-white/30 text-slate-300 hover:text-white flex items-center justify-center transition-all cursor-pointer active:scale-95 shadow-md"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={() => scroll('right')}
                aria-label="Scroll Kanan"
                className="w-9 h-9 rounded-xl bg-[#1a1a1a] border border-white/10 hover:border-white/30 text-slate-300 hover:text-white flex items-center justify-center transition-all cursor-pointer active:scale-95 shadow-md"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* ── Scrollable Horizontal Carousel ── */}
        <div
          ref={scrollContainerRef}
          className="flex gap-5 overflow-x-auto pb-4 pt-1 snap-x snap-mandatory scroll-smooth no-scrollbar"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {filteredData.map((item) => (
            <div
              key={item.id}
              className="w-[300px] sm:w-[350px] shrink-0 snap-start bg-[#141414] rounded-2xl border border-white/10 hover:border-blue-500/40 hover:ring-1 hover:ring-blue-500/30 transition-all duration-300 flex flex-col group overflow-hidden shadow-xl"
            >
              {/* Card Image */}
              <div className="relative h-44 sm:h-48 w-full bg-[#1c1c1c] overflow-hidden">
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  className="object-cover object-center group-hover:scale-105 transition-transform duration-500 opacity-90 group-hover:opacity-100"
                  sizes="350px"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#141414] via-black/40 to-transparent" />

                {/* Badges on Image */}
                <div className="absolute top-3 left-3 flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded-lg bg-blue-600 font-black text-xs text-white shadow-md">
                    {item.code}
                  </span>
                  <span className="px-2 py-1 rounded-lg bg-black/70 backdrop-blur-md border border-white/15 text-[10px] font-semibold text-slate-200">
                    {item.categoryTag}
                  </span>
                </div>

                <div className="absolute bottom-3 left-3 right-3">
                  <p className="text-[11px] font-mono text-blue-300 bg-black/60 backdrop-blur-sm px-2 py-0.5 rounded inline-block">
                    {item.dimensions}
                  </p>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-base font-extrabold text-white group-hover:text-blue-400 transition-colors leading-snug">
                    {item.name}
                  </h3>
                  <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                    {item.subtitle}
                  </p>

                  <div className="mt-4 pt-3 border-t border-white/5 space-y-1.5">
                    <p className="text-[11px] font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                      <Sparkles className="w-3 h-3 text-amber-400" />
                      <span>Fokus Biomekanika:</span>
                    </p>
                    <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                      {item.biomechanicsFocus}
                    </p>
                  </div>
                </div>

                {/* Actions */}
                <div className="mt-5 pt-4 border-t border-white/10 flex items-center justify-between gap-2">
                  <button
                    onClick={() => setSelectedApparatus(item)}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-300 hover:text-white transition-colors cursor-pointer py-1"
                  >
                    <Info className="w-3.5 h-3.5 text-blue-400" />
                    <span>Detail & Tips</span>
                  </button>

                  <button
                    onClick={() => {
                      if (onSelectCategory) {
                        onSelectCategory(item.id);
                      } else {
                        const el = document.getElementById(`section-${item.id}`);
                        if (el) el.scrollIntoView({ behavior: 'smooth' });
                      }
                    }}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-blue-600/20 border border-blue-500/30 hover:bg-blue-600 hover:text-white text-blue-300 text-xs font-semibold transition-all cursor-pointer"
                  >
                    <span>Materi Video</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Scroll hint on mobile */}
        <div className="flex items-center justify-center gap-2 mt-4 text-xs text-slate-500 sm:hidden">
          <ChevronLeft className="w-3.5 h-3.5 animate-pulse" />
          <span>Geser ke samping untuk nomor alat lainnya</span>
          <ChevronRight className="w-3.5 h-3.5 animate-pulse" />
        </div>
      </div>

      {/* ── Modal Detail Apparatus ── */}
      {selectedApparatus && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-[#181818] border border-white/10 rounded-2xl max-w-xl w-full max-h-[90vh] overflow-y-auto p-6 shadow-2xl relative text-left">
            {/* Close Button */}
            <button
              onClick={() => setSelectedApparatus(null)}
              className="absolute top-4 right-4 p-2 rounded-xl bg-white/5 hover:bg-white/15 text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              ✕
            </button>

            <div className="flex items-center gap-3 mb-4">
              <span className="px-3 py-1 rounded-lg bg-blue-600 font-extrabold text-sm text-white">
                {selectedApparatus.code}
              </span>
              <div>
                <h3 className="text-xl font-black text-white">{selectedApparatus.name}</h3>
                <span className="text-xs text-blue-400 font-semibold">
                  {selectedApparatus.categoryTag} &bull; {selectedApparatus.dimensions}
                </span>
              </div>
            </div>

            <p className="text-sm text-slate-300 leading-relaxed mb-5">
              {selectedApparatus.overview}
            </p>

            <div className="space-y-4 mb-6">
              <div className="bg-[#111] p-4 rounded-xl border border-white/5">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Award className="w-3.5 h-3.5 text-blue-400" />
                  <span>Elemen Keterampilan Utama:</span>
                </h4>
                <ul className="space-y-1.5 text-xs text-slate-300">
                  {selectedApparatus.keySkills.map((skill, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{skill}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-blue-950/20 border border-blue-500/20 p-4 rounded-xl">
                <h4 className="text-xs font-bold text-blue-300 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                  <Compass className="w-3.5 h-3.5 text-blue-400" />
                  <span>Kunci Biomekanika:</span>
                </h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {selectedApparatus.biomechanicsFocus}
                </p>
              </div>

              <div className="bg-amber-950/20 border border-amber-500/20 p-4 rounded-xl">
                <h4 className="text-xs font-bold text-amber-300 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                  <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
                  <span>Petunjuk Keselamatan (Safety First):</span>
                </h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {selectedApparatus.safetyTip}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
              <button
                onClick={() => setSelectedApparatus(null)}
                className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-sm font-semibold text-slate-300 cursor-pointer"
              >
                Tutup
              </button>
              <button
                onClick={() => {
                  const id = selectedApparatus.id;
                  setSelectedApparatus(null);
                  if (onSelectCategory) {
                    onSelectCategory(id);
                  } else {
                    const el = document.getElementById(`section-${id}`);
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
                className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-sm font-bold text-white transition-colors cursor-pointer flex items-center gap-2"
              >
                <span>Lihat Materi Video</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
