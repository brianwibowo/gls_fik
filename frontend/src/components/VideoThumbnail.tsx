'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Film } from 'lucide-react';
import type { Video } from '@/lib/types';

export function getDriveThumbnailUrl(fileId?: string): string {
  return fileId && /^[a-zA-Z0-9_-]+$/.test(fileId)
    ? `https://drive.google.com/thumbnail?id=${encodeURIComponent(fileId)}&sz=w640`
    : '';
}

export function isVideoThumbnailOverride(value?: string): boolean {
  if (!value || value.startsWith('/images/apparatus-')) return false;
  return /^(https?:\/\/|\/(?!\/))/.test(value);
}

interface VideoThumbnailProps {
  video: Pick<Video, 'thumbnail' | 'title'> & Partial<Pick<Video, 'driveFileId'>>;
  className?: string;
  sizes?: string;
}

export function VideoThumbnail({ video, className = '', sizes = '640px' }: VideoThumbnailProps) {
  const [failedSources, setFailedSources] = useState<string[]>([]);
  const sources = [
    isVideoThumbnailOverride(video.thumbnail) ? video.thumbnail : '',
    getDriveThumbnailUrl(video.driveFileId),
  ].filter(Boolean);
  const source = sources.find((candidate) => !failedSources.includes(candidate));

  if (!source) {
    return (
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-1.5 bg-slate-100 px-2 text-center text-slate-600" role="img" aria-label={`Thumbnail belum tersedia untuk ${video.title}`}>
        <Film className="h-6 w-6" aria-hidden="true" />
        <span className="text-[10px] leading-tight">Thumbnail belum tersedia</span>
      </div>
    );
  }

  return (
    <Image
      key={source}
      src={source}
      alt={`Cuplikan video ${video.title}`}
      fill
      unoptimized
      referrerPolicy="no-referrer"
      className={`object-cover object-center ${className}`}
      sizes={sizes}
      onError={() => setFailedSources((previous) => [...previous, source])}
    />
  );
}
