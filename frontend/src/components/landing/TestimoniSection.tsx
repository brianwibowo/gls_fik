'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Quote } from 'lucide-react';

interface Testimonial {
  quote: string;
  name: string;
  role: string;
  initials: string;
}

const TESTIMONIALS: Testimonial[] = [
  {
    quote:
      'The GLS platform allows me to visually demonstrate proper gymnastics techniques to students. They can review videos anytime outside lecture hours, making gym practice time significantly more productive.',
    name: 'Dr. Budi Santoso, M.Pd.',
    role: 'Artistic Gymnastics Course Lecturer',
    initials: 'BS',
  },
  {
    quote:
      'Before GLS, I constantly had to ask my coach to re-explain vault sequences. Now I can just watch the video, pause at crucial phases, and train independently with confidence.',
    name: 'Andi Pratama',
    role: 'Sports Science Student, Class of 2024',
    initials: 'AP',
  },
  {
    quote:
      'As a gymnastics coach, I regularly reference GLS videos to illustrate the difference between correct mechanics and common faults. The material is neatly organized by apparatus.',
    name: 'Coach Rina Wulandari',
    role: 'Regional Gymnastics Club Coach',
    initials: 'RW',
  },
];

export function TestimoniSection() {
  return (
    <section
      id="testimoni"
      className="py-20 bg-[#F4F8FA] border-b border-slate-200 relative overflow-hidden text-[#1F2A2E] scroll-mt-16"
    >
      <div className="absolute top-10 left-1/4 w-[500px] h-[350px] bg-[radial-gradient(circle,rgba(193,255,114,0.10)_0%,transparent_70%)] pointer-events-none blur-3xl -z-0" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="mb-12"
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-full bg-[#C1FF72] flex items-center justify-center text-[#1F2A2E] font-black text-xs shadow-sm">
              07
            </div>
            <div className="w-8 h-[1px] bg-slate-300" />
            <div className="px-3.5 py-1 rounded-full bg-[#1F2A2E] text-white text-xs font-bold shadow-sm">
              Testimonials
            </div>
          </div>

          <h2 className="text-2xl sm:text-4xl font-black text-[#1F2A2E] tracking-tight">
            What Users Say About GLS
          </h2>
          <p className="text-xs sm:text-sm text-[#52636A] mt-1.5 max-w-xl">
            Feedback from lecturers, students, and coaches utilizing this platform.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {TESTIMONIALS.map((t, idx) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{
                duration: 0.5,
                delay: idx * 0.1,
                ease: [0.16, 1, 0.3, 1],
              }}
              whileHover={{ y: -6, transition: { duration: 0.25 } }}
              className="bg-white border border-slate-200/90 rounded-3xl p-6 flex flex-col justify-between hover:border-[#1F2A2E]/30 hover:shadow-xl transition-all shadow-sm"
            >
              <div>
                <Quote className="w-8 h-8 text-[#C1FF72] mb-4 -scale-x-100" />
                <p className="text-sm text-[#1F2A2E] leading-relaxed">
                  &ldquo;{t.quote}&rdquo;
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#1F2A2E] flex items-center justify-center text-[#C1FF72] font-black text-xs shrink-0">
                  {t.initials}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-black text-[#1F2A2E] truncate">
                    {t.name}
                  </p>
                  <p className="text-[11px] text-[#52636A] font-medium truncate">
                    {t.role}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
