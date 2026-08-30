'use client';

import React from 'react';
import Image from 'next/image';
import { Video, TrendingUp, Award, Check } from 'lucide-react';
import { ScrollReveal, StaggerContainer, StaggerItem } from '../ui/ScrollReveal';

export function FeaturesSection() {
  const features = [
    {
      id: 'video',
      title: 'Video Pembelajaran',
      tagline: 'Detail Sudut & Slow Motion',
      desc: 'Atlet dapat melihat setiap sudut teknik gerakan senam dengan rekaman video berkualitas tinggi dan tips koreksi langsung dari pelatih.',
      image: '/images/feature-video.webp',
      icon: Video,
      highlights: [
        'Playback slow-motion untuk analisa gerakan',
        'Penjelasan langkah demi langkah',
        'Koreksi kesalahan umum dari pelatih',
      ],
      badge: '📹 Video HD',
    },
    {
      id: 'progress',
      title: 'Progress Belajar',
      tagline: 'Visual & Mudah Dipahami',
      desc: 'Pantau perkembangan atlet secara sederhana tanpa grafik rumit. Mengetahui persentase ketuntasan modul dan materi yang sedang dipelajari.',
      image: '/images/feature-progress.webp',
      icon: TrendingUp,
      highlights: [
        'Ringkasan progres (contoh: 68% tuntas)',
        'Daftar modul yang sedang dipelajari',
        'Catatan jam latihan atlet',
      ],
      badge: '📈 Progres Realtime',
    },
    {
      id: 'structured',
      title: 'Materi Terstruktur',
      tagline: 'Kurikulum Senam Berjenjang',
      desc: 'Materi disusun runut mulai dari pemanasan, penguatan fisik, hingga variasi gerakan lanjutan di setiap kategori alat senam.',
      image: '/images/feature-structured.webp',
      icon: Award,
      highlights: [
        'Kategori alat lengkap (Floor, Beam, Vault, dll)',
        'Tingkatan level dari Pemula hingga Mahir',
        'Modul teratur tanpa materi tercecer',
      ],
      badge: '🏅 Terstandarisasi',
    },
  ];

  return (
    <section id="fitur" className="py-20 md:py-28 bg-[#F8FAFC]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto">
          <ScrollReveal direction="up">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-3 py-1.5 rounded-md border border-blue-100">
              Fitur Utama
            </span>
            <h2 className="mt-3 text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Mengapa Memilih GLS?
            </h2>
            <p className="mt-4 text-base sm:text-lg text-slate-600">
              Tiga pilar utama yang dirancang dengan prinsip <span className="font-semibold text-slate-800">Simple First</span> agar pelatih, atlet muda, dan orang tua dapat menggunakannya tanpa kendala teknis.
            </p>
          </ScrollReveal>
        </div>

        {/* 3 Main Cards Grid */}
        <div className="mt-16">
          <StaggerContainer className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <StaggerItem key={feature.id} className="h-full">
                  <div className="bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-gls hover:shadow-gls-hover hover:border-blue-300 transition-all duration-300 flex flex-col h-full group">
                    {/* Visual WebP Header */}
                    <div className="relative h-56 sm:h-64 w-full overflow-hidden bg-slate-100">
                      <Image
                        src={feature.image}
                        alt={feature.title}
                        fill
                        className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 400px"
                      />
                      <div className="absolute top-4 left-4">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/90 backdrop-blur-md text-xs font-bold text-slate-800 shadow-xs">
                          {feature.badge}
                        </span>
                      </div>
                    </div>

                    {/* Card Content */}
                    <div className="p-6 sm:p-7 flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold shrink-0">
                            <Icon className="w-5 h-5 stroke-[2.2]" />
                          </div>
                          <div>
                            <span className="text-[11px] font-bold text-blue-600 tracking-wide uppercase">
                              {feature.tagline}
                            </span>
                            <h3 className="text-xl font-extrabold text-slate-900">
                              {feature.title}
                            </h3>
                          </div>
                        </div>

                        <p className="text-sm text-slate-600 leading-relaxed mt-2 mb-6">
                          {feature.desc}
                        </p>
                      </div>

                      {/* Bullet Highlights */}
                      <div className="pt-4 border-t border-slate-100 space-y-2.5">
                        {feature.highlights.map((item, idx) => (
                          <div key={idx} className="flex items-start gap-2.5">
                            <div className="w-4 h-4 rounded-full bg-green-100 text-green-700 flex items-center justify-center shrink-0 mt-0.5">
                              <Check className="w-2.5 h-2.5 stroke-[3]" />
                            </div>
                            <span className="text-xs font-medium text-slate-700">{item}</span>
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
      </div>
    </section>
  );
}
