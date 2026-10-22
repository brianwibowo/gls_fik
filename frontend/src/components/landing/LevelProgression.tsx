'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp } from 'lucide-react';

interface LevelStep {
  level: string;
  label: string;
  description: string;
  color: string;
  skills: string[];
}

const LEVELS: LevelStep[] = [
  {
    level: 'Beginner',
    label: 'Dasar',
    description:
      'Pengenalan gerakan dasar, pemanasan spesifik alat, dan penguatan pondasi fisik yang diperlukan sebelum latihan teknik.',
    color: '#22c55e',
    skills: [
      'Pemanasan dan conditioning khusus senam',
      'Posisi tubuh dasar (tuck, pike, layout)',
      'Keseimbangan dan koordinasi fundamental',
    ],
  },
  {
    level: 'Intermediate',
    label: 'Menengah',
    description:
      'Penguasaan teknik inti setiap alat dengan penekanan pada bentuk tubuh, timing, dan konsistensi gerakan.',
    color: '#eab308',
    skills: [
      'Teknik spesifik per alat (ayunan, tolakan, hold)',
      'Rangkaian gerak 2-3 elemen berurutan',
      'Pendaratan terkontrol dan stick landing',
    ],
  },
  {
    level: 'Advanced',
    label: 'Lanjutan',
    description:
      'Kombinasi elemen sulit, variasi salto dan putaran, serta persiapan rutinitas kompetisi dengan nilai kesulitan tinggi.',
    color: '#ef4444',
    skills: [
      'Elemen akrobatik kombinasi (salto + twist)',
      'Rutinitas kompetisi dengan D-score tinggi',
      'Dismount kompleks dan pendaratan presisi',
    ],
  },
];

export function LevelProgression() {
  return (
    <section
      id="level-belajar"
      className="py-20 bg-[#1F2A2E] border-b border-[#2D3A3F] relative overflow-hidden text-white scroll-mt-16"
    >
      <div className="absolute top-20 left-10 w-[500px] h-[400px] bg-[radial-gradient(circle,rgba(193,255,114,0.10)_0%,transparent_70%)] pointer-events-none blur-3xl -z-0" />

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
              05
            </div>
            <div className="w-8 h-[1px] bg-white/20" />
            <div className="px-3.5 py-1 rounded-full bg-white/10 border border-white/15 text-[#C1FF72] text-xs font-bold shadow-sm">
              Alur Belajar
            </div>
          </div>

          <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
            Progression Path Tiap Alat
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-1.5 max-w-xl">
            Setiap kategori alat memiliki 3 tingkat kesulitan. Mulai dari dasar, naik ke
            menengah, hingga level lanjutan.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {LEVELS.map((level, idx) => (
            <motion.div
              key={level.level}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{
                duration: 0.5,
                delay: idx * 0.12,
                ease: [0.16, 1, 0.3, 1],
              }}
              whileHover={{ y: -6, transition: { duration: 0.25 } }}
              className="bg-[#172124] border border-white/10 rounded-3xl p-6 flex flex-col justify-between hover:border-[#C1FF72]/40 hover:bg-[#1B272B] hover:shadow-xl transition-all shadow-sm group"
            >
              <div>
                {/* Level indicator */}
                <div className="flex items-center gap-3 mb-4">
                  <div
                    className="w-10 h-10 rounded-2xl flex items-center justify-center shadow-sm"
                    style={{ backgroundColor: `${level.color}20`, border: `1px solid ${level.color}40` }}
                  >
                    <TrendingUp className="w-5 h-5" style={{ color: level.color }} />
                  </div>
                  <div>
                    <p className="text-lg font-black text-white leading-none">
                      {level.level}
                    </p>
                    <p className="text-[11px] font-bold text-slate-400 mt-0.5">
                      {level.label}
                    </p>
                  </div>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed mb-4">
                  {level.description}
                </p>

                {/* Skills */}
                <ul className="space-y-2">
                  {level.skills.map((skill) => (
                    <li key={skill} className="flex items-start gap-2.5 text-xs text-slate-200">
                      <span
                        className="w-1.5 h-1.5 rounded-full mt-1.5 shrink-0"
                        style={{ backgroundColor: level.color }}
                      />
                      <span>{skill}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Progress bar visual */}
              <div className="mt-6 pt-4 border-t border-white/10">
                <div className="flex items-center justify-between text-[11px] mb-2">
                  <span className="font-bold text-slate-400">Tingkat Kesulitan</span>
                  <span className="font-black" style={{ color: level.color }}>
                    {idx === 0 ? 'Rendah' : idx === 1 ? 'Sedang' : 'Tinggi'}
                  </span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-white/10 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: `${(idx + 1) * 33.33}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.3 + idx * 0.15, ease: [0.16, 1, 0.3, 1] }}
                    className="h-full rounded-full"
                    style={{ backgroundColor: level.color }}
                  />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Connector line between cards (desktop only) */}
        <div className="hidden lg:flex items-center justify-center mt-8 gap-4">
          {['Beginner', '', 'Intermediate', '', 'Advanced'].map((label, i) =>
            label ? (
              <span
                key={label}
                className="text-xs font-bold text-slate-500"
              >
                {label}
              </span>
            ) : (
              <div key={`arrow-${i}`} className="w-16 h-[1px] bg-gradient-to-r from-white/20 to-[#C1FF72]/40" />
            )
          )}
        </div>
      </div>
    </section>
  );
}
