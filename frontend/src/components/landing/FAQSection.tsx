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
    question: 'Do I need to sign in to watch videos?',
    answer:
      'Not all videos require signing in. Videos marked with the "FREE" badge can be watched immediately without an account. To unlock the full curriculum and advanced drills, simply sign in with your Google account.',
  },
  {
    question: 'How do I get access to GCL?',
    answer:
      'Sign in with Google to create a user account and access all videos. Your account appears in admin user management. An existing admin can grant the admin role.',
  },
  {
    question: 'Can videos be downloaded for offline viewing?',
    answer:
      'Videos are streamed directly through the platform from Google Drive. Ensure you have an active internet connection for the best playback experience.',
  },
  {
    question: 'Which web browsers are recommended?',
    answer:
      'Use a current version of Google Chrome, Safari, Mozilla Firefox, or Microsoft Edge to watch GCL videos.',
  },
  {
    question: 'How many apparatus categories are covered?',
    answer:
      'There are 6 Men’s Artistic Gymnastics (MAG) categories available: Floor Exercise, Pommel Horse, Vault, Still Rings, Parallel Bars, and Horizontal Bar.',
  },
  {
    question: 'Is this platform accessible on mobile devices?',
    answer:
      'GCL can be opened on phones, tablets, and laptops. Your saved checklist is linked to your account.',
  },
  {
    question: 'How is my learning progress recorded?',
    answer:
      'Open a video and mark its checklist items as Belum dipelajari, Perlu diulang, or Sudah dipahami. Your notes and progress are saved privately to your account. The summary describes your self-reported understanding of the material.',
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
          ? 'border-[#c1ff72]/40 bg-[#1f2b30] shadow-lg'
          : 'border-white/10 bg-[#192327] hover:border-white/20 hover:bg-[#1d292e] shadow-sm'
      }`}
    >
      <button
        type="button"
        onClick={onToggle}
        className="w-full flex items-center justify-between gap-4 p-5 sm:p-6 text-left cursor-pointer group"
        aria-expanded={isOpen}
      >
        <span className={`text-sm sm:text-base font-bold leading-snug pr-2 transition-colors ${
          isOpen ? 'text-[#c1ff72]' : 'text-white group-hover:text-slate-100'
        }`}>
          {item.question}
        </span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          className="shrink-0"
        >
          <ChevronDown
            className={`w-5 h-5 transition-colors ${
              isOpen ? 'text-[#c1ff72]' : 'text-slate-400 group-hover:text-white'
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
              <div className="border-t border-white/10 pt-4">
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
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
      className="py-20 bg-[#162125] relative overflow-hidden text-white scroll-mt-16"
    >
      {/* Subtle ambient lighting */}
      <div className="absolute top-1/2 left-1/4 w-[500px] h-[350px] bg-[radial-gradient(circle,rgba(193,255,114,0.06)_0%,transparent_70%)] pointer-events-none blur-3xl -z-0" />
      <div className="absolute bottom-0 right-10 w-[400px] h-[300px] bg-[radial-gradient(circle,rgba(193,255,114,0.05)_0%,transparent_70%)] pointer-events-none blur-3xl -z-0" />

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
            <div className="w-8 h-[1px] bg-white/20" />
            <div className="px-3.5 py-1 rounded-full bg-white/10 text-white text-xs font-bold shadow-sm border border-white/15">
              FAQ
            </div>
          </div>

          <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-1.5 max-w-lg mx-auto">
            Find answers to common questions about using Gymnastics Competition Level (GCL).
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
          className="mt-8 flex items-center justify-center gap-2 text-xs text-slate-400"
        >
          <HelpCircle className="w-4 h-4 text-[#c1ff72]" />
          <span>
            Still have questions? Contact your course instructor or GCL administrator.
          </span>
        </motion.div>
      </div>
    </section>
  );
}
