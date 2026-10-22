'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, CheckCircle2 } from 'lucide-react';

interface LevelStep {
  level: string;
  label: string;
  description: string;
  color: string;
  skills: string[];
}

const LEVELS: LevelStep[] = [
  {
    level: 'Level 1',
    label: 'Foundation',
    description:
      'Core movement patterns, apparatus-specific conditioning, body shapes (tuck, pike, hollow, arch), and balance control.',
    color: '#22c55e',
    skills: [
      'Specific physical conditioning and joint mobility',
      'Fundamental body positions and static holds (2s)',
      'Basic rolling, support holds, and controlled landings',
    ],
  },
  {
    level: 'Level 2',
    label: 'Intermediate',
    description:
      'Dynamic transitions, momentum generation, swinging elements, handstand alignment, and consecutive technical combinations.',
    color: '#eab308',
    skills: [
      'Apparatus-specific swing amplitude and kip progressions',
      'Consecutive circle drills and inverted holds',
      'Controlled stuck landing absorption techniques',
    ],
  },
  {
    level: 'Level 3',
    label: 'Advanced Competition',
    description:
      'High-amplitude acrobatics, flight elements, releases, press handstands, and competition routines judged under FIG scoring criteria.',
    color: '#ef4444',
    skills: [
      'Combination passes (Round-off to back handspring)',
      'High-velocity bar releases and pirouette turns',
      'Maximum execution score (E-Score) stuck dismounts',
    ],
  },
];

export function LevelProgression() {
  return (
    <section
      id="level-progression"
      className="py-16 sm:py-20 bg-[#1F2A2E] border-b border-[#2D3A3F] relative overflow-hidden text-white scroll-mt-16"
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
              06
            </div>
            <div className="w-8 h-[1px] bg-white/20" />
            <div className="px-3.5 py-1 rounded-full bg-white/10 border border-white/15 text-[#C1FF72] text-xs font-bold shadow-sm">
              Curriculum Pathway
            </div>
          </div>

          <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
            Standardized 3-Level Progression Path
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-1.5 max-w-xl">
            Each apparatus curriculum features three tiers of structured technical mastery from foundation movements to competition-ready routines.
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
                    <p className="text-xs font-bold text-slate-400 mt-0.5">
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
                      <CheckCircle2
                        className="w-4 h-4 shrink-0 mt-0.5"
                        style={{ color: level.color }}
                      />
                      <span>{skill}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Progress bar visual */}
              <div className="mt-6 pt-4 border-t border-white/10">
                <div className="flex items-center justify-between text-xs mb-2">
                  <span className="font-semibold text-slate-400">Technical Difficulty</span>
                  <span className="font-bold" style={{ color: level.color }}>
                    {idx === 0 ? 'Foundation' : idx === 1 ? 'Intermediate' : 'Advanced'}
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
      </div>
    </section>
  );
}
