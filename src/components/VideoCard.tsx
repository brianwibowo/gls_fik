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
}

export function VideoCard({ video, categoryName }: VideoCardProps) {
  const { isLoggedIn } = useAuth();
  const canWatch = video.isFree || isLoggedIn;

  const href = canWatch ? `/watch/${video.id}` : `/login?redirect=/watch/${video.id}`;

  return (
    <Link
      href={href}
      className="group relative bg-[#181818] rounded-xl overflow-hidden border border-white/5 hover:border-white/20 hover:ring-1 hover:ring-blue-500/30 transition-all duration-300 flex flex-col h-full"
    >
      {/* Thumbnail */}
      <div className="relative aspect-video w-full bg-[#111] overflow-hidden">
        <Image
          src={video.thumbnail}
          alt={video.title}
          fill
          className="object-cover object-center group-hover:scale-105 transition-transform duration-500 opacity-85 group-hover:opacity-100"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />

        {/* Play / Lock icon center */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          {canWatch ? (
            <div className="w-14 h-14 rounded-full bg-blue-600/90 backdrop-blur-sm flex items-center justify-center shadow-xl shadow-blue-600/40 border border-white/20">
              <Play className="w-6 h-6 text-white fill-white ml-0.5" />
            </div>
          ) : (
            <div className="w-14 h-14 rounded-full bg-slate-800/90 backdrop-blur-sm flex items-center justify-center shadow-xl border border-white/20">
              <Lock className="w-5 h-5 text-slate-300" />
            </div>
          )}
        </div>

        {/* Badges on thumbnail */}
        <div className="absolute top-2.5 left-2.5 flex items-center gap-2">
          {video.isFree && (
            <span className="px-2.5 py-1 rounded-md bg-emerald-600/90 backdrop-blur-sm text-[11px] font-bold text-white tracking-wider uppercase">
              Gratis
            </span>
          )}
          {!video.isFree && !isLoggedIn && (
            <span className="px-2.5 py-1 rounded-md bg-slate-700/80 backdrop-blur-sm text-[11px] font-bold text-slate-200 flex items-center gap-1">
              <Lock className="w-3 h-3" />
              <span>Login</span>
            </span>
          )}
        </div>

        {/* Duration badge */}
        <div className="absolute bottom-2.5 right-2.5">
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-black/70 backdrop-blur-sm text-[11px] font-semibold text-slate-200">
            <Clock className="w-3 h-3 text-slate-400" />
            {video.duration}
          </span>
        </div>

        {/* Episode number */}
        <div className="absolute bottom-2.5 left-2.5">
          <span className="text-[11px] font-bold text-slate-300">
            EP {video.episodeNum}
          </span>
        </div>
      </div>

      {/* Card body */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          <h3 className="text-sm font-bold text-white group-hover:text-blue-400 transition-colors leading-snug line-clamp-2">
            {video.title}
          </h3>
          {categoryName && (
            <p className="text-[11px] text-slate-500 font-medium mt-1">{categoryName}</p>
          )}
        </div>
        <div className="mt-3 flex items-center justify-between">
          <span className="px-2 py-0.5 rounded bg-white/8 text-[10px] font-semibold text-slate-400 border border-white/5">
            {video.level}
          </span>
        </div>
      </div>
    </Link>
  );
}
