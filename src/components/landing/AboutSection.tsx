'use client';

import React from 'react';
import {
  AlertTriangle,
  CheckCircle2,
  Layers,
  Users,
  BookOpen,
  Clock,
  UserCheck,
  XCircle,
} from 'lucide-react';
import { ScrollReveal, StaggerContainer, StaggerItem } from '../ui/ScrollReveal';

export function AboutSection() {
  const problems = [
    'Materi tercecer di grup chat WhatsApp, Google Drive tidak terstruktur, & video acak',
    'Sulit mencari kembali video contoh gerakan yang pernah diajarkan minggu lalu',
    'Tidak ada urutan tahapan belajar (progresi fisik, drill dasar, hingga teknik utuh)',
    'Pelatih harus mengirim ulang rekaman gerakan berkali-kali secara manual ke setiap atlet',
    'Orang tua kesulitan memantau apakah anak sudah mempelajari materi sebelum jadwal latihan',
  ];

  const solutions = [
    {
      title: 'Pusat Materi Satu Pintu',
      desc: 'Semua video dan penjelasan teknik tersimpan rapi dalam satu platform yang mudah diakses kapan saja.',
      icon: BookOpen,
      iconBg: 'bg-blue-50 text-blue-600',
    },
    {
      title: 'Kurikulum Berjenjang',
      desc: 'Materi disusun berurutan dari drill dasar, penguatan otot, hingga rangkaian eksekusi akhir per alat.',
      icon: Layers,
      iconBg: 'bg-indigo-50 text-indigo-600',
    },
    {
      title: 'Sinergi Pelatih & Keluarga',
      desc: 'Pelatih menetapkan modul latihan, dan orang tua dapat mendampingi pemahaman anak dari rumah.',
      icon: Users,
      iconBg: 'bg-emerald-50 text-emerald-600',
    },
    {
      title: 'Akses Ulang 24/7',
      desc: 'Atlet dapat mengulang detail gerakan sebelum sesi gym dimulai demi mencegah cedera latihan.',
      icon: Clock,
      iconBg: 'bg-amber-50 text-amber-600',
    },
  ];

  return (
    <section id="tentang" className="py-20 md:py-28 bg-[#F8FAFC] border-t border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto">
          <ScrollReveal direction="up">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 border border-blue-200/60 px-3.5 py-1.5 rounded-full">
              Transformasi Pembelajaran
            </span>
            <h2 className="mt-3 text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Mengapa Senam Membutuhkan Sistem Pembelajaran Khusus?
            </h2>
            <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed">
              Senam artistik menuntut presisi biomekanika tinggi. GLS hadir bukan sebagai sistem penilaian kompetisi,
              melainkan sebagai <strong className="text-slate-900 font-semibold">Educational Hub</strong> yang
              menjembatani pelatih, atlet muda, dan orang tua.
            </p>
          </ScrollReveal>
        </div>

        {/* Comparison Grid */}
        <div className="mt-16 grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Left: Dark Contrast Card for Challenges */}
          <div className="lg:col-span-5 bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 rounded-3xl p-7 sm:p-9 border border-slate-800 shadow-xl flex flex-col justify-between text-white">
            <ScrollReveal direction="right" delay={0.1}>
              <div>
                <div className="flex items-center gap-3.5 mb-7 pb-5 border-b border-slate-800">
                  <div className="w-11 h-11 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center font-bold">
                    <XCircle className="w-6 h-6 stroke-[2.2]" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">Metode Konvensional</h3>
                    <p className="text-xs text-slate-400">Kendala yang sering dialami klub senam</p>
                  </div>
                </div>

                <ul className="space-y-4">
                  {problems.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <div className="w-5 h-5 rounded-full bg-rose-500/15 text-rose-400 flex items-center justify-center shrink-0 mt-0.5">
                        <XCircle className="w-3.5 h-3.5" />
                      </div>
                      <span className="text-xs sm:text-sm text-slate-300 leading-snug">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Consequence Box with Clean SVG Alert */}
              <div className="mt-8 p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-start gap-3 text-xs text-rose-200 leading-relaxed font-medium">
                <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                <span>
                  <strong>Dampak Negatif:</strong> Pemahaman teknik senam tidak konsisten dan atlet
                  kesulitan mengingat koreksi sudut tubuh dari pelatih saat tiba di sesi berikutnya.
                </span>
              </div>
            </ScrollReveal>
          </div>

          {/* Right: Modern Light/Blue Card for GLS Solution */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-7 sm:p-9 border border-blue-100 shadow-xl shadow-blue-500/5 flex flex-col justify-between">
            <ScrollReveal direction="left" delay={0.1}>
              <div>
                <div className="flex items-center gap-3.5 mb-7 pb-5 border-b border-slate-100">
                  <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center font-bold shadow-md shadow-blue-600/20">
                    <CheckCircle2 className="w-6 h-6 stroke-[2.2]" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">Solusi GLS (Versi 2.0)</h3>
                    <p className="text-xs text-slate-500">Prinsip Simple First — Cepat dipahami semua usia</p>
                  </div>
                </div>

                {/* 4 Pillars Grid with Distributed Colors */}
                <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {solutions.map((item, idx) => {
                    const Icon = item.icon;
                    return (
                      <StaggerItem key={idx}>
                        <div className="bg-slate-50/70 p-5 rounded-2xl border border-slate-100 hover:border-blue-200 hover:bg-white transition-all duration-200 h-full flex flex-col">
                          <div className={`w-10 h-10 rounded-xl ${item.iconBg} flex items-center justify-center mb-3 shadow-xs`}>
                            <Icon className="w-5 h-5 stroke-[2.2]" />
                          </div>
                          <h4 className="text-sm font-bold text-slate-900 mb-1.5">{item.title}</h4>
                          <p className="text-xs text-slate-600 leading-relaxed">{item.desc}</p>
                        </div>
                      </StaggerItem>
                    );
                  })}
                </StaggerContainer>
              </div>

              {/* Bottom Target Demographic Strip */}
              <div className="mt-8 p-4 bg-gradient-to-r from-blue-50/80 to-indigo-50/80 rounded-2xl border border-blue-100/80 flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center shrink-0">
                  <UserCheck className="w-4 h-4" />
                </div>
                <p className="text-xs font-medium text-slate-700 leading-snug">
                  Optimal untuk kelompok umur <span className="font-bold text-blue-700">8–22 tahun (Atlet)</span> didampingi{' '}
                  <span className="font-bold text-blue-700">Pelatih &amp; Orang Tua</span> dengan antarmuka yang intuitif.
                </p>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </div>
    </section>
  );
}
