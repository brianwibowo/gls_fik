'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, User, Trophy, ShieldCheck, ArrowRight } from 'lucide-react';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function LoginModal({ isOpen, onClose }: LoginModalProps) {
  const [selectedRole, setSelectedRole] = useState<'athlete' | 'coach' | 'parent'>('athlete');

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs"
          />

          {/* Modal Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="relative w-full max-w-md bg-white rounded-xl shadow-xl border border-slate-200 p-6 z-10 overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <h3 className="text-xl font-bold text-slate-800">Masuk ke GLS</h3>
                <p className="text-xs text-slate-500 mt-0.5">Gymnastics Learning System</p>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
                aria-label="Tutup modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Role Selection */}
            <div className="mt-5">
              <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2">
                Pilih Peran Anda
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedRole('athlete')}
                  className={`flex flex-col items-center justify-center p-3 rounded-lg border text-xs font-medium transition-all ${
                    selectedRole === 'athlete'
                      ? 'border-blue-600 bg-blue-50 text-blue-700 shadow-xs'
                      : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <Trophy className="w-5 h-5 mb-1 text-blue-600" />
                  <span>Atlet</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedRole('coach')}
                  className={`flex flex-col items-center justify-center p-3 rounded-lg border text-xs font-medium transition-all ${
                    selectedRole === 'coach'
                      ? 'border-blue-600 bg-blue-50 text-blue-700 shadow-xs'
                      : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <ShieldCheck className="w-5 h-5 mb-1 text-blue-600" />
                  <span>Pelatih</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedRole('parent')}
                  className={`flex flex-col items-center justify-center p-3 rounded-lg border text-xs font-medium transition-all ${
                    selectedRole === 'parent'
                      ? 'border-blue-600 bg-blue-50 text-blue-700 shadow-xs'
                      : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <User className="w-5 h-5 mb-1 text-blue-600" />
                  <span>Orang Tua</span>
                </button>
              </div>
            </div>

            {/* Form */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                alert(`Login simulasi untuk peran: ${selectedRole.toUpperCase()}. Backend Supabase akan disambungkan pada fase berikutnya!`);
                onClose();
              }}
              className="mt-5 space-y-4"
            >
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Nomor HP / Email
                </label>
                <input
                  type="text"
                  required
                  placeholder="contoh: 08123456789 atau nama@email.com"
                  className="w-full px-3.5 py-2.5 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all placeholder:text-slate-400"
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="block text-xs font-medium text-slate-700">
                    Kata Sandi
                  </label>
                  <a href="#faq" onClick={onClose} className="text-xs text-blue-600 hover:underline">
                    Lupa sandi?
                  </a>
                </div>
                <input
                  type="password"
                  required
                  placeholder="Masukkan kata sandi"
                  className="w-full px-3.5 py-2.5 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all placeholder:text-slate-400"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-lg bg-blue-600 text-white font-medium text-sm hover:bg-blue-700 active:scale-[0.99] transition-all shadow-xs"
                >
                  <span>Masuk Sekarang</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>

            {/* Info note */}
            <div className="mt-4 p-3 bg-slate-50 rounded-lg border border-slate-100 text-center">
              <p className="text-xs text-slate-500">
                Belum punya akun? Hubungi <span className="font-semibold text-slate-700">Pelatih Senam</span> Anda untuk didaftarkan ke sistem GLS.
              </p>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
