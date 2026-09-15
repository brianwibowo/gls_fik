'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Navbar } from '@/components/Navbar';
import { useAuth } from '@/lib/auth';
import { getVideoById, getVideosByCategory, getCategoryById, initializeData } from '@/lib/data';
import type { Video, Category } from '@/lib/types';
import { LoginModal } from '@/components/LoginModal';
import {
  Play,
  ArrowLeft,
  Clock,
  Lock,
  Layers,
} from 'lucide-react';

export default function WatchPage() {
  const params = useParams();
  const router = useRouter();
  const { isLoggedIn, isReady } = useAuth();
  const [video, setVideo] = useState<Video | null>(null);
  const [category, setCategory] = useState<Category | null>(null);
  const [siblingVideos, setSiblingVideos] = useState<Video[]>([]);
  const [notFound, setNotFound] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);

  const videoId = params.id as string;

  useEffect(() => {
    initializeData();
    const vid = getVideoById(videoId);
    if (!vid) {
      setNotFound(true);
      return;
    }
    setNotFound(false);
    setVideo(vid);
    const cat = getCategoryById(vid.categoryId);
    setCategory(cat || null);
    const siblings = getVideosByCategory(vid.categoryId);
    setSiblingVideos(siblings);
  }, [videoId]);

  // Wait for hydration
  if (!isReady) return null;

  if (notFound) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] text-white">
        <Navbar />
        <div className="flex flex-col items-center justify-center py-32 px-4">
          <h1 className="text-2xl font-bold text-white mb-2">Video Tidak Ditemukan</h1>
          <p className="text-sm text-slate-400 mb-6">Video yang kamu cari mungkin telah dihapus atau ID tidak valid.</p>
          <Link href="/" className="px-5 py-2.5 rounded-xl bg-[#c1ff72] text-[#1f2a2e] text-sm font-bold hover:bg-[#b0f555] transition-colors">
            Kembali ke Katalog
          </Link>
        </div>
      </div>
    );
  }

  if (!video) return null;

  const handlePlayEpisode = (ep: Video) => {
    router.push(`/watch/${ep.id}`);
  };

  const getCategoryBadge = (name?: string) => {
    if (!name) return '';
    const match = name.match(/\((.*?)\)/);
    return match ? match[1] : name;
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-20">
        {/* Top bar: Back link + Judul Video (Berlaku untuk semua video) */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 bg-[#121721] border border-[#243044] rounded-2xl px-3.5 sm:px-4 py-3 shadow-lg">
          <div className="flex flex-wrap sm:flex-nowrap items-center gap-2.5 sm:gap-3 min-w-0 flex-1">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-xs sm:text-sm text-slate-200 hover:text-white font-bold group transition-all shrink-0 bg-white/5 hover:bg-white/10 px-3.5 py-2 min-h-[40px] rounded-xl border border-white/10 hover:border-[#c1ff72]/40 active:scale-95"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform text-[#c1ff72]" />
              <span>Kembali ke Katalog</span>
            </Link>

            <span className="text-slate-600 hidden sm:inline font-bold">|</span>

            <div className="flex items-center gap-2 min-w-0 flex-1">
              {category && (
                <span className="px-2 py-0.5 rounded-lg bg-[#c1ff72]/15 border border-[#c1ff72]/30 text-[#c1ff72] text-[11px] sm:text-xs font-black shrink-0 uppercase tracking-wide">
                  {getCategoryBadge(category.name)}
                </span>
              )}
              <h1 className="text-xs sm:text-base font-bold text-white truncate" title={video.title}>
                {video.title}
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0 self-start sm:self-center text-xs">
            <span className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-slate-300 font-bold">
              Episode {video.episodeNum}
            </span>
            <span className="px-2.5 py-1 rounded-lg bg-[#c1ff72] text-[#1f2a2e] font-black shadow-sm">
              Level {video.level}
            </span>
          </div>
        </div>

        {/* Video player */}
        {video.isFree || isLoggedIn ? (
          <div className="relative w-full aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl border border-white/10 ring-1 ring-white/5">
            <iframe
              src={`https://drive.google.com/file/d/${video.driveFileId}/preview`}
              className="w-full h-full border-0"
              allow="autoplay; fullscreen"
              allowFullScreen
              title={video.title}
            />
          </div>
        ) : (
          <div className="relative w-full min-h-[340px] sm:min-h-0 sm:aspect-video bg-gradient-to-br from-[#12161f] via-[#0d1017] to-black rounded-2xl overflow-hidden shadow-2xl border border-white/10 ring-1 ring-white/5 flex flex-col items-center justify-center p-5 sm:p-6 text-center">
            <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-2xl sm:rounded-3xl bg-[#c1ff72]/15 border border-[#c1ff72]/40 flex items-center justify-center text-[#c1ff72] mb-3 sm:mb-4 shadow-[0_0_20px_rgba(193,255,114,0.15)]">
              <Lock className="w-6 h-6 sm:w-8 sm:h-8" />
            </div>

            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-[11px] sm:text-xs font-bold mb-2.5 sm:mb-3">
              <span>Akses Khusus Akun Terdaftar</span>
            </div>

            <h2 className="text-lg sm:text-2xl font-black text-white max-w-lg mb-2 leading-tight">
              Video Episode Ini Membutuhkan Akses Login
            </h2>

            <p className="text-xs sm:text-sm text-slate-300 max-w-md mb-5 sm:mb-6 leading-relaxed">
              Silakan masuk dengan akun atlet, pelatih, atau mahasiswa GLS FIK untuk memutar materi latihan ini.
            </p>

            <button
              type="button"
              onClick={() => setShowLoginModal(true)}
              className="px-5 sm:px-6 py-3 min-h-[44px] rounded-xl bg-[#c1ff72] hover:bg-[#b0f555] text-[#1f2a2e] font-black text-xs sm:text-sm shadow-md transition-all cursor-pointer inline-flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-95 border border-[#a8ed4b]"
            >
              <Lock className="w-4 h-4 stroke-[2.5]" />
              <span>Masuk Akun Sekarang & Buka Video</span>
            </button>
          </div>
        )}

        {/* Video info bar */}
        <div className="mt-6 flex flex-col lg:flex-row lg:items-start gap-8">
          {/* Left: video details */}
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-3">
              {category && (
                <span className="px-2.5 py-1 rounded-lg bg-[#c1ff72]/15 border border-[#c1ff72]/30 text-[#c1ff72] text-[11px] font-bold uppercase tracking-wider flex items-center gap-1.5">
                  <Layers className="w-3 h-3" />
                  {category.name}
                </span>
              )}
              <span className="px-2 py-0.5 rounded bg-white/10 text-[11px] font-semibold text-slate-300">
                {video.level}
              </span>
              <span className="text-[11px] text-slate-500 flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {video.duration}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Episode {video.episodeNum}: {video.title}
            </h1>

            <p className="mt-3 text-sm text-slate-300 leading-relaxed max-w-3xl">
              {video.description}
            </p>
          </div>

          {/* Right: episode list sidebar */}
          <div className="lg:w-96 shrink-0">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
              <Play className="w-4 h-4 text-[#c1ff72] fill-[#c1ff72]" />
              Episode Lainnya
            </h3>

            <div className="space-y-3">
              {siblingVideos.map((ep) => {
                const isCurrent = ep.id === video.id;
                const canWatch = ep.isFree || isLoggedIn;

                return (
                  <button
                    key={ep.id}
                    onClick={() => {
                      if (canWatch) {
                        handlePlayEpisode(ep);
                      } else {
                        setShowLoginModal(true);
                      }
                    }}
                    className={`w-full text-left p-3.5 rounded-xl border transition-all flex items-center gap-4 cursor-pointer ${
                      isCurrent
                        ? 'bg-[#c1ff72]/10 border-[#c1ff72]/40 ring-1 ring-[#c1ff72]/20'
                        : 'bg-[#141414] border-white/5 hover:border-white/20 hover:bg-[#1a1a1a]'
                    }`}
                  >
                    {/* Episode thumbnail */}
                    <div className="relative w-24 h-14 rounded-lg overflow-hidden bg-[#111] shrink-0">
                      <Image
                        src={ep.thumbnail}
                        alt={ep.title}
                        fill
                        className="object-cover object-center"
                        sizes="96px"
                      />
                      <div className="absolute inset-0 flex items-center justify-center">
                        {canWatch ? (
                          <Play className={`w-5 h-5 ${isCurrent ? 'text-[#c1ff72] fill-[#c1ff72]' : 'text-white/80 fill-white/80'}`} />
                        ) : (
                          <Lock className="w-4 h-4 text-slate-400" />
                        )}
                      </div>
                      {isCurrent && (
                        <div className="absolute bottom-0 inset-x-0 h-1 bg-[#c1ff72]" />
                      )}
                    </div>

                    {/* Episode info */}
                    <div className="flex-1 min-w-0">
                      <p className={`text-xs font-bold ${isCurrent ? 'text-[#c1ff72]' : 'text-white'} truncate`}>
                        EP {ep.episodeNum}. {ep.title}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[10px] text-slate-500">{ep.duration}</span>
                        {ep.isFree && (
                          <span className="text-[10px] font-bold text-[#c1ff72]">GRATIS</span>
                        )}
                        {!ep.isFree && !isLoggedIn && (
                          <span className="text-[10px] text-slate-500 flex items-center gap-0.5">
                            <Lock className="w-2.5 h-2.5" /> Login
                          </span>
                        )}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </main>

      {/* Pop-up Login Modal */}
      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        title="Akses Video Terkunci"
        subtitle={`Episode "${video.title}" dikhususkan untuk atlet, pelatih, atau mahasiswa yang telah masuk akun GLS FIK.`}
      />
    </div>
  );
}
