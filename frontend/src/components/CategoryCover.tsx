'use client';

import Image from 'next/image';
import { useState } from 'react';

export function CategoryCover({ src, name }: { src?: string; name: string }) {
  const [failedSource, setFailedSource] = useState('');
  if (!src || failedSource === src) return <span role="img" aria-label={`Sampul ${name} belum tersedia`} className="flex h-full w-full items-center justify-center bg-[#f7f5ee] text-3xl font-bold text-[#52636a]">?</span>;
  return <Image src={src} alt={`Sampul ${name}`} fill unoptimized sizes="80px" className="object-cover" onError={() => setFailedSource(src)} />;
}
