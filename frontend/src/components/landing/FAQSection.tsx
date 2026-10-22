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
    question: 'Do I need an account to watch curriculum videos?',
    answer:
      'Videos labeled with the green FREE badge are accessible to any visitor without logging in. Full routines, advanced drill breakdowns, technique checklists, and evaluation logs require an authenticated athlete or coach account.',
  },
  {
    question: 'How do athlete accounts work on GCL?',
    answer:
      'Each athlete has an individual account with their personal profile, assigned apparatus level, interactive technique checklist, and permanent record of coach evaluations.',
  },
  {
    question: 'What are the 6 apparatus covered in the MAG curriculum?',
    answer:
      'All 6 official Men&apos;s Artistic Gymnastics apparatus are covered: Floor Exercise (FX), Pommel Horse (PH), Still Rings (SR), Vault (VT), Parallel Bars (PB), and Horizontal Bar (HB).',
  },
  {
    question: 'How does the Checklist Tracker calculate completion percentage?',
    answer:
      'Each technique has an itemized movement standard. When an athlete or coach checks off a mastered technique, the completion percentage updates in real time on both the video player and athlete profile.',
  },
  {
    question: 'Can coaches submit evaluations and technical notes?',
    answer:
      'Yes. Users with Coach or Administrator roles have an evaluation panel under each technique to assign mastery statuses (Mastered, Developing, Needs Work) and write specific biomechanical notes.',
  },
  {
    question: 'What domain is the official platform hosted on?',
    answer:
      'The official platform operates at https://gymnasticcomplevel.com, engineered for mobile smartphones, tablets, and desktop workstations.',
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
        className="w-full flex items-center justify-between gap-4 p-5 sm:p-6 text-left cursor-pointer group min-h-[44px]"
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
      className="py-16 sm:py-20 bg-white border-b border-slate-200 relative overflow-hidden text-[#1F2A2E] scroll-mt-16"
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
              08
            </div>
            <div className="w-8 h-[1px] bg-slate-300" />
            <div className="px-3.5 py-1 rounded-full bg-[#1F2A2E] text-white text-xs font-bold shadow-sm">
              FAQ
            </div>
          </div>

          <h2 className="text-2xl sm:text-4xl font-black text-[#1F2A2E] tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="text-xs sm:text-sm text-[#52636A] mt-1.5 max-w-lg mx-auto">
            Find answers regarding video access, athlete accounts, technique checklists, and coaching evaluations.
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
            Need assistance or account access? Contact your technical director or GCL administrator.
          </span>
        </motion.div>
      </div>
    </section>
  );
}
