'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Play, Lock, Clock } from 'lucide-react';
import type { Video } from '@/lib/types';
import { useAuth } from '@/lib/auth';

interface VideoCardProps {
  video: Video;
  categoryName?: string;
  className?: string;
}

export function VideoCard({ video, categoryName, className = '' }: VideoCardProps) {
  const { isLoggedIn } = useAuth();
  const canWatch = video.isFree || isLoggedIn;

  const href = canWatch ? `/watch/${video.id}` : `/login?redirect=/watch/${video.id}`;

  return (
    <Link
      href={href}
      className={`group relative bg-[#141414] rounded-xl overflow-hidden border border-[#262626] hover:border-slate-500 transition-colors duration-200 flex flex-col h-full ${className}`}
    >
      {/* Thumbnail */}
      <div className="relative aspect-video w-full bg-[#111] overflow-hidden">
        <Image
          src={video.thumbnail}
          alt={video.title}
          fill
          className="object-cover object-center group-hover:scale-102 transition-transform duration-300 opacity-90 group-hover:opacity-100"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 320px"
        />

        {/* Play / Lock center indicator */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-black/40">
          {canWatch ? (
            <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center text-white shadow-lg">
              <Play className="w-5 h-5 fill-white ml-0.5" />
            </div>
          ) : (
            <div className="w-12 h-12 rounded-full bg-[#222] border border-white/20 flex items-center justify-center text-slate-300 shadow-lg">
              <Lock className="w-5 h-5" />
            </div>
          )}
        </div>

        {/* Top Badges */}
        <div className="absolute top-2 left-2 flex items-center gap-1.5">
          {video.isFree ? (
            <span className="px-2 py-0.5 rounded bg-emerald-600 text-[11px] font-bold text-white uppercase tracking-wider">
              Gratis
            </span>
          ) : !isLoggedIn ? (
            <span className="px-2 py-0.5 rounded bg-[#1f2937] text-[11px] font-semibold text-slate-200 border border-slate-700 flex items-center gap-1">
              <Lock className="w-3 h-3 text-slate-400" />
              <span>Login</span>
            </span>
          ) : null}
        </div>

        {/* Bottom meta */}
        <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between pointer-events-none">
          <span className="px-1.5 py-0.5 rounded bg-black/80 text-[10px] font-bold text-slate-300">
            EP {video.episodeNum}
          </span>
          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-black/80 text-[10px] font-medium text-slate-300">
            <Clock className="w-3 h-3 text-slate-400" />
            {video.duration}
          </span>
        </div>
      </div>

      {/* Card body */}
      <div className="p-3.5 flex-1 flex flex-col justify-between">
        <div>
          <h3 className="text-sm font-bold text-white group-hover:text-blue-400 transition-colors leading-snug line-clamp-2">
            {video.title}
          </h3>
          {categoryName && (
            <p className="text-[11px] text-slate-400 font-medium mt-1">{categoryName}</p>
          )}
        </div>
        <div className="mt-3 flex items-center justify-between pt-2 border-t border-[#222]">
          <span className="px-2 py-0.5 rounded bg-[#1e293b] text-[10px] font-medium text-slate-300">
            Level {video.level}
          </span>
          <span className="text-[11px] font-semibold text-blue-400 group-hover:underline">
            {canWatch ? 'Tonton' : 'Masuk Akun'} &rarr;
          </span>
        </div>
      </div>
    </Link>
  );
}
