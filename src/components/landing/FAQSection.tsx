'use client';

import React, { useState } from 'react';
import { ChevronDown, HelpCircle, MessageCircleQuestion } from 'lucide-react';
import { ScrollReveal, StaggerContainer, StaggerItem } from '../ui/ScrollReveal';

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      q: 'Apa itu Gymnastics Learning System (GLS)?',
      a: 'GLS adalah platform pembelajaran digital (Learning Hub) berbasis web yang dirancang khusus untuk mempermudah pelatih menyusun dan membagikan materi latihan senam, serta membantu atlet dan orang tua mempelajari teknik senam secara terstruktur kapan saja.',
    },
    {
      q: 'Apakah GLS menggantikan peran pelatih di gymnasium?',
      a: 'Sama sekali tidak. GLS adalah alat bantu (support system) bagi pelatih agar materi tidak tercecer di grup chat. Atlet dapat mengulang video teknik sebelum atau setelah sesi latihan tatap muka sehingga proses koreksi di gym menjadi jauh lebih efektif.',
    },
    {
      q: 'Bagaimana peran orang tua dalam platform GLS?',
      a: 'Orang tua dapat melihat modul yang sedang dipelajari anak, memeriksa panduan teknik yang diberikan pelatih, dan memantau persentase ketuntasan materi tanpa perlu memahami istilah teknis senam yang rumit.',
    },
    {
      q: 'Apakah platform ini mudah digunakan oleh pelatih yang kurang familiar dengan teknologi?',
      a: 'Sangat mudah! GLS dibangun dengan prinsip "Simple First" — tanpa istilah teknis yang rumit, navigasi maksimal 5 menu, dan tombol yang jelas sehingga pelatih dapat langsung mengunggah materi dan mengelola atlet dalam hitungan menit.',
    },
    {
      q: 'Perangkat apa saja yang bisa digunakan untuk mengakses GLS?',
      a: 'GLS adalah web application responsif yang dapat dibuka melalui browser di smartphone (Android & iPhone), tablet/iPad, maupun laptop/komputer tanpa perlu instalasi aplikasi yang memberatkan memori.',
    },
    {
      q: 'Bagaimana cara mendapatkan akun GLS untuk klub atau atlet?',
      a: 'Akun atlet dan orang tua didaftarkan langsung oleh Pelatih atau Manajemen Klub Senam yang terdaftar di GLS agar materi latihan yang diterima sesuai dengan nomor alat dan tingkatan kelas atlet.',
    },
  ];

  const toggleAccordion = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section id="faq" className="py-20 md:py-28 bg-white border-t border-slate-200/80">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center">
          <ScrollReveal direction="up">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 border border-blue-200/60 px-3.5 py-1.5 rounded-full">
              Pusat Bantuan
            </span>
            <h2 className="mt-3 text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Pertanyaan yang Kerap Ditanyakan (FAQ)
            </h2>
            <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed">
              Jawaban lengkap seputar cara kerja, aksesibilitas, dan manfaat ekosistem GLS untuk klub senam Anda.
            </p>
          </ScrollReveal>
        </div>

        {/* FAQ Accordion List */}
        <div className="mt-14 space-y-4">
          <StaggerContainer>
            {faqs.map((item, idx) => {
              const isOpen = openIndex === idx;
              return (
                <StaggerItem key={idx}>
                  <div
                    className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
                      isOpen
                        ? 'border-blue-300 bg-blue-50/20 shadow-xs'
                        : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}
                  >
                    <button
                      onClick={() => toggleAccordion(idx)}
                      className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 cursor-pointer"
                      aria-expanded={isOpen}
                    >
                      <span className="text-base font-bold text-slate-900 flex items-center gap-3.5">
                        <MessageCircleQuestion
                          className={`w-5 h-5 shrink-0 ${isOpen ? 'text-blue-600' : 'text-slate-400'}`}
                        />
                        <span>{item.q}</span>
                      </span>
                      <div
                        className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 transition-transform duration-200 ${
                          isOpen ? 'bg-blue-600 text-white rotate-180 shadow-xs' : 'bg-slate-100 text-slate-500'
                        }`}
                      >
                        <ChevronDown className="w-4 h-4" />
                      </div>
                    </button>

                    {isOpen && (
                      <div className="px-5 pb-6 pt-1 sm:px-6 text-sm text-slate-600 leading-relaxed border-t border-blue-100/60 mt-1">
                        <p>{item.a}</p>
                      </div>
                    )}
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
