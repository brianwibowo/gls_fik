'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth';
import {
  Lock,
  Mail,
  X,
  LogIn,
  AlertCircle,
} from 'lucide-react';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  title?: string;
  subtitle?: string;
}

export function LoginModal({
  isOpen,
  onClose,
  onSuccess,
  title = 'Akses Video Terkunci',
  subtitle = 'Materi ini membutuhkan akses akun atlet, pelatih, atau mahasiswa GLS FIK.',
}: LoginModalProps) {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Keyboard accessibility: Escape to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    const result = await login(email, password);
    if (result.success) {
      setIsLoading(false);
      if (onSuccess) onSuccess();
      onClose();
    } else {
      setError(result.error || 'Login gagal. Periksa kembali email dan kata sandi Anda.');
      setIsLoading(false);
    }
  };

  const handleFillDemo = (demoEmail: string, demoPass: string) => {
    setEmail(demoEmail);
    setPassword(demoPass);
    setError('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200 overflow-y-auto">
      <div className="bg-[#121721] border border-white/10 rounded-3xl max-w-md w-full max-h-[90dvh] overflow-y-auto p-5 sm:p-8 shadow-2xl relative text-white my-auto">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 sm:top-5 sm:right-5 w-10 h-10 min-w-[40px] min-h-[40px] rounded-xl text-slate-400 hover:text-white hover:bg-white/10 active:scale-95 transition-all cursor-pointer flex items-center justify-center"
          aria-label="Tutup pop-up login"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Icon & Title */}
        <div className="flex items-center gap-3 mb-3.5 sm:mb-4">
          <div className="w-11 h-11 rounded-2xl bg-[#c1ff72] flex items-center justify-center text-[#1f2a2e] font-black shadow-md shrink-0">
            <Lock className="w-5 h-5 stroke-[2.5]" />
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-black text-white tracking-tight leading-tight">
              {title}
            </h2>
            <span className="text-[11px] font-bold text-[#c1ff72] uppercase tracking-wider">
              Login Diperlukan
            </span>
          </div>
        </div>

        <p className="text-xs sm:text-sm text-slate-300 mb-4 sm:mb-5 leading-relaxed">
          {subtitle}
        </p>

        {/* Error notification */}
        {error && (
          <div className="p-3.5 mb-4 rounded-xl bg-red-500/15 border border-red-500/30 flex items-start gap-2.5 text-xs text-red-300">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5 sm:space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
              Alamat Email
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nama@gls.id"
                className="w-full min-h-[42px] pl-10 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-base sm:text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-[#c1ff72] focus:ring-1 focus:ring-[#c1ff72] transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
              Kata Sandi
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full min-h-[42px] pl-10 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-base sm:text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-[#c1ff72] focus:ring-1 focus:ring-[#c1ff72] transition-colors"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full min-h-[44px] py-3 rounded-xl bg-[#c1ff72] hover:bg-[#b0f555] active:scale-95 text-[#1f2a2e] font-black text-sm tracking-wide shadow-md transition-all cursor-pointer flex items-center justify-center gap-2 mt-2 disabled:opacity-50"
          >
            <LogIn className="w-4 h-4 stroke-[2.5]" />
            <span>{isLoading ? 'Memverifikasi...' : 'Masuk & Buka Video'}</span>
          </button>
        </form>

        {/* Quick Demo Credentials */}
        <div className="mt-5 pt-4 border-t border-white/10 text-center">
          <p className="text-[11px] text-slate-400 mb-2.5 font-medium">
            Atau gunakan akun demo untuk akses instan:
          </p>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleFillDemo('alisha@gls.id', 'user123')}
              className="min-h-[38px] px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 active:scale-95 border border-white/10 text-xs font-semibold text-slate-200 transition-colors cursor-pointer flex items-center justify-center text-center"
            >
              Akun Atlet (Alisha)
            </button>
            <button
              type="button"
              onClick={() => handleFillDemo('admin@gls.id', 'admin123')}
              className="min-h-[38px] px-3 py-2 rounded-xl bg-[#c1ff72]/10 hover:bg-[#c1ff72]/20 active:scale-95 border border-[#c1ff72]/30 text-xs font-bold text-[#c1ff72] transition-colors cursor-pointer flex items-center justify-center text-center"
            >
              Akun Admin (Dosen)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
