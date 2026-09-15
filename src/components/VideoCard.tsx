'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Play, Lock, Clock, ArrowUpRight } from 'lucide-react';
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

  const href = `/watch/${video.id}`;

  return (
    <Link
      href={href}
      className={`group relative bg-white rounded-2xl overflow-hidden border border-slate-200/90 hover:border-[#1F2A2E]/40 hover:shadow-lg transition-all duration-200 flex flex-col h-full shadow-sm ${className}`}
    >
      {/* Thumbnail */}
      <div className="relative aspect-video w-full bg-slate-100 overflow-hidden">
        <Image
          src={video.thumbnail}
          alt={video.title}
          fill
          className="object-cover object-center group-hover:scale-105 transition-transform duration-300"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 320px"
        />

        {/* Play / Lock center indicator */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-black/35 backdrop-blur-[2px]">
          {canWatch ? (
            <div className="w-12 h-12 rounded-full bg-[#C1FF72] flex items-center justify-center text-[#1F2A2E] shadow-xl group-hover:scale-110 transition-transform">
              <Play className="w-5 h-5 fill-[#1F2A2E] ml-0.5" />
            </div>
          ) : (
            <div className="w-12 h-12 rounded-full bg-[#1F2A2E] text-white flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform">
              <Lock className="w-5 h-5 text-[#C1FF72]" />
            </div>
          )}
        </div>

        {/* Top Badges */}
        <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
          {video.isFree ? (
            <span className="px-2.5 py-0.5 rounded-full bg-[#C1FF72] text-[10px] font-black text-[#1F2A2E] uppercase tracking-wider shadow-sm border border-[#a8ed4b]">
              Gratis
            </span>
          ) : !isLoggedIn ? (
            <span className="px-2.5 py-0.5 rounded-full bg-[#1F2A2E] text-[10px] font-bold text-white shadow-sm flex items-center gap-1">
              <Lock className="w-2.5 h-2.5 text-[#C1FF72]" />
              <span>Login</span>
            </span>
          ) : null}
        </div>

        {/* Bottom meta */}
        <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between pointer-events-none">
          <span className="px-2 py-0.5 rounded-md bg-black/80 text-[10px] font-black text-white">
            EP {video.episodeNum}
          </span>
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-black/80 text-[10px] font-medium text-slate-200">
            <Clock className="w-3 h-3 text-[#C1FF72]" />
            {video.duration}
          </span>
        </div>
      </div>

      {/* Card body */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          {categoryName && (
            <p className="text-[11px] font-bold text-[#52636A] uppercase tracking-wider mb-1">
              {categoryName}
            </p>
          )}
          <h3 className="text-sm sm:text-base font-bold text-[#1F2A2E] group-hover:text-slate-700 transition-colors leading-snug line-clamp-2">
            {video.title}
          </h3>
        </div>

        <div className="mt-4 flex items-center justify-between pt-3 border-t border-slate-100">
          <span className="px-2.5 py-0.5 rounded-md bg-[#F4F8FA] border border-slate-200 text-[11px] font-bold text-[#1F2A2E]">
            Level {video.level}
          </span>

          <span className="text-xs font-black text-[#1F2A2E] group-hover:text-slate-900 inline-flex items-center gap-1">
            <span>{canWatch ? 'Tonton' : 'Masuk Akun'}</span>
            <ArrowUpRight className="w-3.5 h-3.5 text-[#1F2A2E] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </span>
        </div>
      </div>
    </Link>
  );
}
