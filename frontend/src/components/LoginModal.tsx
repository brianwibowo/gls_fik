'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth';
import { GoogleLogin } from '@react-oauth/google';
import {
  Lock,
  X,
  AlertCircle,
  ShieldCheck,
  Sparkles,
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
  title = 'Access Locked Video',
  subtitle = 'This content requires a student, coach, or member account.',
}: LoginModalProps) {
  const { loginWithGoogle } = useAuth();
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

  const handleGoogleSuccess = async (credential: string) => {
    setError('');
    setIsLoading(true);
    const result = await loginWithGoogle(credential);
    if (result.success) {
      setIsLoading(false);
      if (onSuccess) onSuccess();
      onClose();
    } else {
      setError(result.error || 'Google sign-in failed. Please try again.');
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200 overflow-y-auto">
      <div className="bg-[#121721] border border-white/10 rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl relative text-white my-auto">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 sm:top-5 sm:right-5 w-10 h-10 min-w-[40px] min-h-[40px] rounded-xl text-slate-400 hover:text-white hover:bg-white/10 active:scale-95 transition-all cursor-pointer flex items-center justify-center"
          aria-label="Close login dialog"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Icon & Title */}
        <div className="flex items-center gap-3.5 mb-3 sm:mb-4">
          <div className="w-12 h-12 rounded-2xl bg-[#c1ff72] flex items-center justify-center text-[#1f2a2e] font-black shadow-lg shadow-[#c1ff72]/20 shrink-0">
            <Lock className="w-6 h-6 stroke-[2.5]" />
          </div>
          <div>
            <span className="text-[11px] font-black text-[#c1ff72] uppercase tracking-wider block">
              Sign In Required
            </span>
            <h2 className="text-lg sm:text-xl font-black text-white tracking-tight leading-tight">
              {title}
            </h2>
          </div>
        </div>

        <p className="text-xs sm:text-sm text-slate-300 mb-6 leading-relaxed">
          {subtitle} Sign in with your Google account to unlock all instructional training videos.
        </p>

        {/* Error notification */}
        {error && (
          <div className="p-3.5 mb-5 rounded-xl bg-red-500/15 border border-red-500/30 flex items-start gap-2.5 text-xs text-red-300">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {/* Google One-Click Login Button */}
        <div className="space-y-4">
          <div className="w-full flex justify-center [&>div]:!w-full [&>div>iframe]:!w-full [&>div>div]:!w-full shadow-lg rounded-full overflow-hidden">
            <GoogleLogin
              onSuccess={(res) => {
                if (res.credential) handleGoogleSuccess(res.credential);
              }}
              onError={() => setError('Failed to sign in with Google.')}
              theme="filled_black"
              shape="pill"
              size="large"
              width="100%"
              text="continue_with"
            />
          </div>

          {isLoading && (
            <p className="text-center text-xs text-[#c1ff72] font-semibold animate-pulse">
              Verifying Google account & unlocking video...
            </p>
          )}

          <div className="pt-3 border-t border-white/10 flex items-center justify-center gap-2 text-slate-400 text-[11px]">
            <ShieldCheck className="w-3.5 h-3.5 text-[#c1ff72]" />
            <span>Encrypted authentication via Google OAuth 2.0</span>
          </div>
        </div>
      </div>
    </div>
  );
}
