'use client';

import React from 'react';
import { XCircle, CheckCircle2, Layers, Users, BookOpen, Clock } from 'lucide-react';
import { ScrollReveal, StaggerContainer, StaggerItem } from '../ui/ScrollReveal';

export function AboutSection() {
  const problems = [
    'Materi tercecer di grup WhatsApp, Google Drive, & YouTube',
    'Sulit mencari kembali video gerakan yang pernah diajarkan',
    'Tidak ada urutan tahapan belajar yang jelas',
    'Pelatih harus mengirim video ulang berkali-kali ke atlet',
    'Orang tua kesulitan memantau apakah anak sudah mempelajari materi',
  ];

  const solutions = [
    {
      title: 'Pusat Materi Satu Pintu',
      desc: 'Semua video dan penjelasan teknik tersimpan rapi dalam satu platform yang mudah dibuka kapan saja.',
      icon: BookOpen,
    },
    {
      title: 'Kurikulum Berjenjang',
      desc: 'Materi disusun berurutan dari level dasar, menengah, hingga mahir per alat senam.',
      icon: Layers,
    },
    {
      title: 'Kolaborasi Pelatih & Orang Tua',
      desc: 'Pelatih mudah membagikan modul, dan orang tua dapat mendampingi anak berlatih di rumah.',
      icon: Users,
    },
    {
      title: 'Akses Mandiri Kapan Saja',
      desc: 'Atlet dapat mengulang kembali detail gerakan sebelum dan sesudah sesi latihan di gymnasium.',
      icon: Clock,
    },
  ];

  return (
    <section id="tentang" className="py-20 md:py-28 bg-white border-y border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto">
          <ScrollReveal direction="up">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-3 py-1.5 rounded-md">
              Tentang Platform
            </span>
            <h2 className="mt-3 text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Mengapa Senam Membutuhkan Sistem Pembelajaran Khusus?
            </h2>
            <p className="mt-4 text-base sm:text-lg text-slate-600">
              GLS hadir bukan sebagai aplikasi kompetisi atau sistem penilaian, melainkan sebagai{' '}
              <strong className="text-slate-800 font-semibold">Pusat Pembelajaran (Learning Hub)</strong>{' '}
              yang menghubungkan pelatih, atlet, dan orang tua.
            </p>
          </ScrollReveal>
        </div>

        {/* Problem vs Solution Grid */}
        <div className="mt-16 grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Left: Cara Lama (Masalah) */}
          <div className="lg:col-span-5 bg-slate-50 rounded-2xl p-6 sm:p-8 border border-slate-200/80 flex flex-col justify-between">
            <ScrollReveal direction="right" delay={0.1}>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-red-100 text-red-600 flex items-center justify-center font-bold">
                  <XCircle className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">Sebelum Ada GLS</h3>
                  <p className="text-xs text-slate-500">Metode konvensional yang sering kendala</p>
                </div>
              </div>

              <ul className="space-y-4">
                {problems.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <XCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                    <span className="text-sm font-medium text-slate-700 leading-snug">{item}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-8 p-4 bg-red-50/70 rounded-xl border border-red-100 text-xs text-red-800 leading-relaxed font-medium">
                ⚠️ Akibatnya: Pembelajaran teknik senam tidak konsisten dan atlet kesulitan mengingat koreksi pelatih.
              </div>
            </ScrollReveal>
          </div>

          {/* Right: Solusi GLS */}
          <div className="lg:col-span-7 bg-blue-50/60 rounded-2xl p-6 sm:p-8 border border-blue-100 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold shadow-sm">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">Solusi GLS (Versi 2.0)</h3>
                  <p className="text-xs text-slate-500">Prinsip Simple First — Cepat dipahami semua usia</p>
                </div>
              </div>

              <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {solutions.map((item, idx) => {
                  const Icon = item.icon;
                  return (
                    <StaggerItem key={idx}>
                      <div className="bg-white p-5 rounded-xl border border-blue-100/80 shadow-xs hover:border-blue-300 transition-colors h-full flex flex-col">
                        <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center mb-3">
                          <Icon className="w-5 h-5" />
                        </div>
                        <h4 className="text-sm font-bold text-slate-800 mb-1.5">{item.title}</h4>
                        <p className="text-xs text-slate-600 leading-relaxed">{item.desc}</p>
                      </div>
                    </StaggerItem>
                  );
                })}
              </StaggerContainer>
            </div>

            <div className="mt-6 p-4 bg-white rounded-xl border border-blue-200/80 flex items-center justify-between gap-4">
              <div className="text-xs font-semibold text-slate-700">
                Dirancang khusus untuk usia <span className="text-blue-600 font-bold">8–22 tahun (Atlet)</span> &amp; <span className="text-blue-600 font-bold">25–60 tahun (Pelatih)</span>.
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
