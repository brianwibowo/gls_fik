'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Navbar } from '@/components/Navbar';
import { useAuth } from '@/lib/auth';
import { getVideoById, getVideosByCategory, getCategoryById, initializeData } from '@/lib/data';
import type { Video, Category } from '@/lib/types';
import {
  Play,
  ArrowLeft,
  ChevronRight,
  Clock,
  Lock,
  Layers,
  ExternalLink,
  FolderOpen,
} from 'lucide-react';

export default function WatchPage() {
  const params = useParams();
  const router = useRouter();
  const { isLoggedIn, isReady } = useAuth();
  const [video, setVideo] = useState<Video | null>(null);
  const [category, setCategory] = useState<Category | null>(null);
  const [siblingVideos, setSiblingVideos] = useState<Video[]>([]);
  const [notFound, setNotFound] = useState(false);

  const videoId = params.id as string;

  useEffect(() => {
    initializeData();
    const vid = getVideoById(videoId);
    if (!vid) {
      setNotFound(true);
      return;
    }
    setVideo(vid);
    const cat = getCategoryById(vid.categoryId);
    setCategory(cat || null);
    const siblings = getVideosByCategory(vid.categoryId);
    setSiblingVideos(siblings);
  }, [videoId]);

  // Wait for hydration
  if (!isReady) return null;

  // Auth gate: if not free and not logged in, redirect to login
  if (video && !video.isFree && !isLoggedIn) {
    router.push(`/login?redirect=/watch/${video.id}`);
    return null;
  }

  if (notFound) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] text-white">
        <Navbar />
        <div className="flex flex-col items-center justify-center py-32 px-4">
          <h1 className="text-2xl font-bold text-white mb-2">Video Tidak Ditemukan</h1>
          <p className="text-sm text-slate-400 mb-6">Video yang kamu cari mungkin telah dihapus atau ID tidak valid.</p>
          <Link href="/" className="px-5 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700">
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

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-20">
        {/* Back link */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white font-medium mb-5 group transition-colors"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span>Kembali ke Katalog</span>
        </Link>

        {/* Video player */}
        <div className="relative w-full aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl border border-white/10 ring-1 ring-white/5">
          <iframe
            src={`https://drive.google.com/file/d/${video.driveFileId}/preview`}
            className="w-full h-full border-0"
            allow="autoplay; fullscreen"
            allowFullScreen
            title={video.title}
          />
        </div>

        {/* Video info bar */}
        <div className="mt-6 flex flex-col lg:flex-row lg:items-start gap-8">
          {/* Left: video details */}
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-3">
              {category && (
                <span className="px-2.5 py-1 rounded-lg bg-blue-500/15 border border-blue-500/25 text-blue-300 text-[11px] font-bold uppercase tracking-wider flex items-center gap-1.5">
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

            {/* Drive link */}
            <a
              href={video.driveLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 mt-5 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm text-slate-300 hover:bg-white/10 hover:text-white transition-colors font-medium"
            >
              <FolderOpen className="w-4 h-4 text-amber-400" />
              <span>Buka di Google Drive</span>
              <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
            </a>
          </div>

          {/* Right: episode list sidebar */}
          <div className="lg:w-96 shrink-0">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
              <Play className="w-4 h-4 text-blue-500 fill-blue-500" />
              Episode Lainnya
            </h3>

            <div className="space-y-3">
              {siblingVideos.map((ep) => {
                const isCurrent = ep.id === video.id;
                const canWatch = ep.isFree || isLoggedIn;

                return (
                  <button
                    key={ep.id}
                    onClick={() => canWatch ? handlePlayEpisode(ep) : router.push(`/login?redirect=/watch/${ep.id}`)}
                    className={`w-full text-left p-3.5 rounded-xl border transition-all flex items-center gap-4 cursor-pointer ${
                      isCurrent
                        ? 'bg-blue-600/10 border-blue-500/40 ring-1 ring-blue-500/20'
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
                          <Play className={`w-5 h-5 ${isCurrent ? 'text-blue-400 fill-blue-400' : 'text-white/80 fill-white/80'}`} />
                        ) : (
                          <Lock className="w-4 h-4 text-slate-400" />
                        )}
                      </div>
                      {isCurrent && (
                        <div className="absolute bottom-0 inset-x-0 h-1 bg-blue-600" />
                      )}
                    </div>

                    {/* Episode info */}
                    <div className="flex-1 min-w-0">
                      <p className={`text-xs font-bold ${isCurrent ? 'text-blue-400' : 'text-white'} truncate`}>
                        EP {ep.episodeNum}. {ep.title}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[10px] text-slate-500">{ep.duration}</span>
                        {ep.isFree && (
                          <span className="text-[10px] font-bold text-emerald-400">GRATIS</span>
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
    </div>
  );
}
