'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, HelpCircle } from 'lucide-react';

interface FAQItem {
  question: string;
  answer: string;
}

const FAQ_ITEMS: FAQItem[] = [
  {
    question: 'Apakah saya perlu login untuk menonton video?',
    answer:
      'Tidak semua video memerlukan login. Video yang ditandai badge "GRATIS" bisa langsung ditonton tanpa akun. Untuk mengakses seluruh koleksi video termasuk materi lanjutan, Anda perlu login dengan akun yang sudah didaftarkan oleh admin.',
  },
  {
    question: 'Bagaimana cara mendapatkan akun GLS FIK?',
    answer:
      'Akun dibuat oleh admin atau dosen pengampu mata kuliah senam. Hubungi dosen pembimbing Anda untuk didaftarkan ke dalam sistem. Setelah akun dibuat, Anda bisa login menggunakan email dan password yang diberikan.',
  },
  {
    question: 'Apakah video bisa diunduh untuk ditonton offline?',
    answer:
      'Saat ini video hanya bisa diputar secara streaming melalui platform. Video disimpan di Google Drive dan diputar langsung di halaman pemutar GLS FIK. Pastikan koneksi internet Anda stabil untuk pengalaman menonton yang lancar.',
  },
  {
    question: 'Browser apa yang direkomendasikan?',
    answer:
      'GLS FIK bekerja optimal di Google Chrome, Mozilla Firefox, Microsoft Edge, dan Safari versi terbaru. Pastikan browser Anda sudah diperbarui ke versi terakhir untuk kompatibilitas pemutar video yang terbaik.',
  },
  {
    question: 'Berapa jumlah kategori alat yang tersedia?',
    answer:
      'Tersedia 6 kategori alat senam artistik putra (MAG): Floor Exercise (Senam Lantai), Pommel Horse (Kuda-Kuda Pelana), Vault (Meja Lompat), Still Rings (Gelang-Gelang), Parallel Bars (Palang Sejajar), dan Horizontal Bar (Palang Tunggal).',
  },
  {
    question: 'Apakah platform ini bisa diakses dari handphone?',
    answer:
      'Ya, GLS FIK dirancang responsif dan bisa diakses dari perangkat apa pun — laptop, tablet, maupun handphone. Tampilan akan menyesuaikan ukuran layar Anda secara otomatis.',
  },
];

function AccordionItem({
  item,
  isOpen,
  onToggle,
  index,
}: {
  item: FAQItem;
  isOpen: boolean;
  onToggle: () => void;
  index: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-30px' }}
      transition={{
        duration: 0.4,
        delay: index * 0.06,
        ease: [0.16, 1, 0.3, 1],
      }}
      className={`border rounded-2xl transition-all ${
        isOpen
          ? 'border-[#1F2A2E]/30 bg-white shadow-md'
          : 'border-slate-200 bg-white hover:border-slate-300 shadow-sm'
      }`}
    >
      <button
        type="button"
        onClick={onToggle}
        className="w-full flex items-center justify-between gap-4 p-5 sm:p-6 text-left cursor-pointer group"
        aria-expanded={isOpen}
      >
        <span className="text-sm sm:text-base font-bold text-[#1F2A2E] leading-snug pr-2">
          {item.question}
        </span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          className="shrink-0"
        >
          <ChevronDown
            className={`w-5 h-5 transition-colors ${
              isOpen ? 'text-[#1F2A2E]' : 'text-slate-400 group-hover:text-slate-600'
            }`}
          />
        </motion.div>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            <div className="px-5 sm:px-6 pb-5 sm:pb-6 pt-0">
              <div className="border-t border-slate-100 pt-4">
                <p className="text-xs sm:text-sm text-[#52636A] leading-relaxed">
                  {item.answer}
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section
      id="faq"
      className="py-20 bg-white border-b border-slate-200 relative overflow-hidden text-[#1F2A2E] scroll-mt-16"
    >
      <div className="absolute bottom-10 right-10 w-[400px] h-[300px] bg-[radial-gradient(circle,rgba(193,255,114,0.08)_0%,transparent_70%)] pointer-events-none blur-3xl -z-0" />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="mb-12 text-center"
        >
          <div className="flex items-center justify-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-full bg-[#C1FF72] flex items-center justify-center text-[#1F2A2E] font-black text-xs shadow-sm">
              07
            </div>
            <div className="w-8 h-[1px] bg-slate-300" />
            <div className="px-3.5 py-1 rounded-full bg-[#1F2A2E] text-white text-xs font-bold shadow-sm">
              FAQ
            </div>
          </div>

          <h2 className="text-2xl sm:text-4xl font-black text-[#1F2A2E] tracking-tight">
            Pertanyaan yang Sering Ditanyakan
          </h2>
          <p className="text-xs sm:text-sm text-[#52636A] mt-1.5 max-w-lg mx-auto">
            Temukan jawaban untuk pertanyaan umum seputar penggunaan platform GLS FIK.
          </p>
        </motion.div>

        <div className="space-y-3">
          {FAQ_ITEMS.map((item, idx) => (
            <AccordionItem
              key={item.question}
              item={item}
              index={idx}
              isOpen={openIndex === idx}
              onToggle={() =>
                setOpenIndex(openIndex === idx ? null : idx)
              }
            />
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-8 flex items-center justify-center gap-2 text-xs text-[#52636A]"
        >
          <HelpCircle className="w-4 h-4" />
          <span>
            Masih ada pertanyaan? Hubungi dosen pengampu atau admin GLS FIK.
          </span>
        </motion.div>
      </div>
    </section>
  );
}
