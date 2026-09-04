'use client';

import React from 'react';
import { Star, Quote, ShieldCheck, UserCheck, HeartHandshake } from 'lucide-react';
import { ScrollReveal, StaggerContainer, StaggerItem } from '../ui/ScrollReveal';

export function TestimonialsSection() {
  const testimonials = [
    {
      role: 'Pelatih Kepala',
      roleBadge: 'bg-blue-50 text-blue-700 border-blue-200',
      roleIcon: ShieldCheck,
      name: 'Budi Santoso, M.Pd.',
      club: 'Pelatih Senam Artistik FIK UNJ',
      quote:
        'GLS memangkas waktu coaching di gymnasium hingga 40%. Atlet datang ke arena sudah memahami visual biomekanika gerakan melalui video HD, sehingga sesi latihan fokus pada eksekusi fisik.',
    },
    {
      role: 'Atlet Muda',
      roleBadge: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      roleIcon: UserCheck,
      name: 'Alisha Rahma (12 Tahun)',
      club: 'Atlet Kejurda Senam Lantai & Balok',
      quote:
        'Sebelum ada GLS, saya sering lupa urutan gerakan setelah pulang latihan. Sekarang saya bisa memutar ulang video gerakan perlahan (slow-motion) di rumah sebelum jadwal latihan besok.',
    },
    {
      role: 'Orang Tua Atlet',
      roleBadge: 'bg-indigo-50 text-indigo-700 border-indigo-200',
      roleIcon: HeartHandshake,
      name: 'Ibu Ratna Dewi',
      club: 'Orang Tua Siswa Kelas Prestasi',
      quote:
        'Tampilan GLS sangat simpel dan mudah dipahami. Saya bisa mendampingi anak dan mengetahui dengan jelas sejauh mana progres modul yang sudah diselesaikan tanpa perlu bingung.',
    },
  ];

  return (
    <section id="testimoni" className="py-20 md:py-28 bg-[#F8FAFC] border-t border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <div className="text-center max-w-3xl mx-auto">
          <ScrollReveal direction="up">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 border border-blue-200/60 px-3.5 py-1.5 rounded-full">
              Dampak Nyata
            </span>
            <h2 className="mt-3 text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Dipercaya oleh Pelatih, Atlet, dan Orang Tua
            </h2>
            <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed">
              Membangun sinergi tiga pilar demi mencetak atlet senam berbakat dengan fondasi teknik yang aman dan teruji.
            </p>
          </ScrollReveal>
        </div>

        {/* Testimonial Cards */}
        <div className="mt-16">
          <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
            {testimonials.map((item, idx) => {
              const RoleIcon = item.roleIcon;
              return (
                <StaggerItem key={idx} className="h-full">
                  <div className="bg-white rounded-3xl p-8 border border-slate-200/90 shadow-sm hover:shadow-xl hover:border-blue-200 transition-all duration-300 flex flex-col justify-between h-full group">
                    <div>
                      {/* Top Row: Stars and Quote Mark */}
                      <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-1">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className="w-4 h-4 text-amber-400 fill-amber-400" />
                          ))}
                        </div>
                        <Quote className="w-8 h-8 text-slate-200 group-hover:text-blue-200 transition-colors" />
                      </div>

                      {/* Quote text */}
                      <p className="text-sm text-slate-700 leading-relaxed italic mb-8">
                        &ldquo;{item.quote}&rdquo;
                      </p>
                    </div>

                    {/* Author Footer */}
                    <div className="pt-6 border-t border-slate-100 flex items-center gap-3.5">
                      <div className="w-11 h-11 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center font-bold text-slate-700 text-sm">
                        {item.name.charAt(0)}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-bold text-slate-900">{item.name}</h4>
                        </div>
                        <p className="text-xs text-slate-500 mt-0.5">{item.club}</p>
                        <span className={`inline-flex items-center gap-1 mt-1.5 px-2 py-0.5 rounded text-[10px] font-bold border ${item.roleBadge}`}>
                          <RoleIcon className="w-3 h-3" />
                          <span>{item.role}</span>
                        </span>
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
