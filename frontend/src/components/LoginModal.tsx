'use client';

import React, { useState, useEffect, useRef, useId } from 'react';
import { useAuth } from '@/lib/auth';
import { GoogleLogin } from '@react-oauth/google';
import { useRouter } from 'next/navigation';
import {
  Lock,
  X,
  AlertCircle,
  ShieldCheck,
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
  subtitle = 'Sign in to access this GCL lesson and save your personal learning progress.',
}: LoginModalProps) {
  const { loginWithGoogle } = useAuth();
  const router = useRouter();
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const titleId = useId();
  const descriptionId = useId();

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!isOpen || !dialog) return;
    const trigger = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    dialog.showModal();
    closeRef.current?.focus();
    return () => {
      if (dialog.open) dialog.close();
      document.body.style.overflow = previousOverflow;
      if (trigger?.isConnected) trigger.focus();
    };
  }, [isOpen]);

  const dismiss = () => {
    setError('');
    onClose();
  };

  if (!isOpen) return null;

  const handleGoogleSuccess = async (credential: string) => {
    setError('');
    setIsLoading(true);
    const result = await loginWithGoogle(credential);
    if (result.success) {
      setIsLoading(false);
      if (onSuccess) onSuccess();
      onClose();
      router.replace(result.user.role === 'admin' ? '/admin' : '/#katalog-video');
    } else {
      setError(result.error || 'Google sign-in failed. Please try again.');
      setIsLoading(false);
    }
  };

  return (
    <dialog
      ref={dialogRef}
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      aria-describedby={descriptionId}
      onCancel={(event) => { event.preventDefault(); dismiss(); }}
      onClick={(event) => { if (event.target === event.currentTarget) dismiss(); }}
      className="fixed inset-0 z-50 m-0 flex h-dvh max-h-none w-screen max-w-none items-center justify-center border-0 p-3 sm:p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200 overflow-y-auto"
    >
      <div className="bg-[#121721] border border-white/10 rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl relative text-white my-auto">
        {/* Close Button */}
        <button
          type="button"
          ref={closeRef}
          onClick={dismiss}
          className="absolute top-4 right-4 sm:top-5 sm:right-5 w-11 h-11 rounded-xl text-slate-300 hover:text-white hover:bg-white/10 active:scale-95 transition-all cursor-pointer flex items-center justify-center focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#c1ff72]"
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
            <h2 id={titleId} className="text-lg sm:text-xl font-black text-white tracking-tight leading-tight pr-8">
              {title}
            </h2>
          </div>
        </div>

        <p id={descriptionId} className="text-xs sm:text-sm text-slate-300 mb-6 leading-relaxed">
          {subtitle} Sign in with your Google account to unlock all instructional training videos.
        </p>

        {/* Error notification */}
        {error && (
          <div role="alert" className="p-3.5 mb-5 rounded-xl bg-red-500/15 border border-red-500/30 flex items-start gap-2.5 text-xs text-red-300">
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
              text="continue_with"
            />
          </div>

          {isLoading && (
            <p role="status" className="text-center text-xs text-[#c1ff72] font-semibold">
              Verifying Google account & unlocking video...
            </p>
          )}

          <div className="pt-3 border-t border-white/10 flex items-center justify-center gap-2 text-slate-400 text-[11px]">
            <ShieldCheck className="w-3.5 h-3.5 text-[#c1ff72]" />
            <span>Continue with your Google account</span>
          </div>
        </div>
      </div>
    </dialog>
  );
}
