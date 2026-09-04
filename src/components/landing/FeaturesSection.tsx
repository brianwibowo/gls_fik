'use client';

import React from 'react';
import Image from 'next/image';
import {
  Video,
  TrendingUp,
  Award,
  CheckCircle2,
  Sparkles,
  Smartphone,
  Eye,
  Sliders,
} from 'lucide-react';
import { ScrollReveal, StaggerContainer, StaggerItem } from '../ui/ScrollReveal';

export function FeaturesSection() {
  const features = [
    {
      id: 'video',
      title: 'Video Pembelajaran HD',
      tagline: 'Presisi Sudut & Slow-Motion',
      desc: 'Atlet dapat melihat setiap sudut teknik gerakan senam dengan rekaman video berkualitas tinggi dan tips koreksi langsung dari pelatih.',
      image: '/images/feature-video.webp',
      icon: Video,
      accentColor: 'text-blue-600',
      badgeColor: 'bg-blue-50 text-blue-700 border-blue-200/80',
      highlights: [
        'Playback slow-motion untuk analisa sudut sendi',
        'Demonstrasi langkah demi langkah per fase gerak',
        'Koreksi kesalahan umum langsung dari pelatih',
      ],
      badgeText: 'Video HD & Slow-Mo',
      badgeIcon: Video,
    },
    {
      id: 'progress',
      title: 'Progress Belajar Transparan',
      tagline: 'Visual & Mudah Dipahami',
      desc: 'Pantau perkembangan atlet secara sederhana tanpa grafik rumit. Mengetahui persentase ketuntasan modul dan materi yang sedang dipelajari.',
      image: '/images/feature-progress.webp',
      icon: TrendingUp,
      accentColor: 'text-emerald-600',
      badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200/80',
      highlights: [
        'Ringkasan persentase tuntas per nomor alat',
        'Status materi yang sedang dipelajari saat ini',
        'Catatan perkembangan teknik oleh tim pelatih',
      ],
      badgeText: 'Monitoring Real-Time',
      badgeIcon: TrendingUp,
    },
    {
      id: 'structured',
      title: 'Kurikulum Berjenjang',
      tagline: 'Sesuai Standar Federasi',
      desc: 'Materi disusun runut mulai dari pemanasan, penguatan fisik, hingga variasi gerakan lanjutan di setiap kategori alat senam.',
      image: '/images/feature-structured.webp',
      icon: Award,
      accentColor: 'text-indigo-600',
      badgeColor: 'bg-indigo-50 text-indigo-700 border-indigo-200/80',
      highlights: [
        'Cakupan 6 nomor alat senam artistik lengkap',
        'Tahapan level dari Pemula hingga Mahir',
        'Materi tersusun rapi tanpa ada yang tercecer',
      ],
      badgeText: 'Kurikulum Terstandar',
      badgeIcon: Award,
    },
  ];

  return (
    <section id="fitur" className="py-20 md:py-28 bg-white border-t border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto">
          <ScrollReveal direction="up">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 border border-blue-200/60 px-3.5 py-1.5 rounded-full">
              Fitur Unggulan
            </span>
            <h2 className="mt-3 text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Tiga Pilar Utama Pembelajaran GLS
            </h2>
            <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed">
              Dirancang dengan filosofi <strong className="text-slate-800 font-semibold">Simple First</strong> agar
              pelatih, atlet muda, dan orang tua dapat berinteraksi secara mulus tanpa kerumitan teknis.
            </p>
          </ScrollReveal>
        </div>

        {/* 3 Main Cards Grid */}
        <div className="mt-16">
          <StaggerContainer className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
            {features.map((feature) => {
              const Icon = feature.icon;
              const BadgeIcon = feature.badgeIcon;
              return (
                <StaggerItem key={feature.id} className="h-full">
                  <div className="bg-white rounded-3xl overflow-hidden border border-slate-200/90 shadow-sm hover:shadow-xl hover:border-blue-200 transition-all duration-300 flex flex-col h-full group">
                    {/* Visual WebP Header */}
                    <div className="relative h-60 w-full overflow-hidden bg-slate-100">
                      <Image
                        src={feature.image}
                        alt={feature.title}
                        fill
                        className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 400px"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 via-transparent to-transparent pointer-events-none" />

                      {/* SVG Badge Pill (Zero Emojis) */}
                      <div className="absolute top-4 left-4">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full backdrop-blur-md text-xs font-bold border shadow-xs ${feature.badgeColor}`}>
                          <BadgeIcon className="w-3.5 h-3.5" />
                          <span>{feature.badgeText}</span>
                        </span>
                      </div>
                    </div>

                    {/* Card Content */}
                    <div className="p-7 flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center gap-3.5 mb-3.5">
                          <div className={`w-10 h-10 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center font-bold shrink-0 ${feature.accentColor}`}>
                            <Icon className="w-5 h-5 stroke-[2.2]" />
                          </div>
                          <div>
                            <span className="text-[11px] font-bold text-slate-400 tracking-wider uppercase">
                              {feature.tagline}
                            </span>
                            <h3 className="text-xl font-extrabold text-slate-900 leading-snug">
                              {feature.title}
                            </h3>
                          </div>
                        </div>

                        <p className="text-sm text-slate-600 leading-relaxed mt-2 mb-6">
                          {feature.desc}
                        </p>
                      </div>

                      {/* Highlights with Clean SVG Icons */}
                      <div className="pt-5 border-t border-slate-100 space-y-3">
                        {feature.highlights.map((item, idx) => (
                          <div key={idx} className="flex items-start gap-2.5">
                            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                            <span className="text-xs font-medium text-slate-700 leading-relaxed">{item}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </StaggerItem>
              );
            })}
          </StaggerContainer>
        </div>

        {/* Feature Spotlight: Tablet Coaching & Video Analysis */}
        <div className="mt-16 bg-gradient-to-br from-slate-900 via-slate-900 to-blue-950 rounded-3xl p-8 sm:p-12 text-white border border-slate-800 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative">
            <div className="lg:col-span-7">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-200 text-xs font-semibold uppercase tracking-wider mb-4">
                <Sparkles className="w-3.5 h-3.5 text-blue-400" />
                <span>Interaksi Pembelajaran Langsung</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-snug">
                Review Gerakan dengan Video Replay Bersama Pelatih
              </h3>
              <p className="mt-4 text-sm sm:text-base text-slate-300 leading-relaxed">
                Di gymnasium, atlet dapat merekam percobaan gerakan lalu membandingkannya langsung
                dengan video contoh master di GLS. Pelatih memberikan koreksi titik tumpu, sudut lecutan,
                dan pendaratan secara real-time.
              </p>

              <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-medium text-slate-200">
                <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
                  <Eye className="w-5 h-5 text-blue-400 shrink-0" />
                  <span>Koreksi Posisi Tubuh Seketika</span>
                </div>
                <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
                  <Sliders className="w-5 h-5 text-emerald-400 shrink-0" />
                  <span>Catatan Khusus Sesuai Karakter Atlet</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 relative">
              <div className="rounded-2xl overflow-hidden shadow-2xl border-2 border-white/20 relative group">
                <Image
                  src="/images/feature-coaching.webp"
                  alt="Pelatih Menjelaskan Biomekanika Senam Menggunakan Tablet"
                  width={600}
                  height={450}
                  className="w-full h-auto object-cover object-center group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
                <div className="absolute bottom-4 left-4 right-4 text-xs text-white">
                  <p className="font-bold">Analisis Tablet di Gelanggang Latihan</p>
                  <p className="text-slate-300 text-[11px]">Sinergi praktis pelatih dan atlet muda</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
