import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { Navbar } from '@/components/Navbar';
import photoCredits from '@/lib/photo-credits.json';

export const metadata: Metadata = {
  title: 'Photo Credits | Gymnastics Competition Level (GCL)',
  description: 'Sumber, fotografer, dan lisensi foto dokumentasi senam putra pada website GCL.',
};

export default function PhotoCreditsPage() {
  return (
    <div className="min-h-screen bg-[#f7f5ee] text-[#1f2a2e]">
      <Navbar />
      <main lang="id" className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
        <Link href="/" className="inline-flex min-h-11 items-center text-sm font-semibold underline underline-offset-4">Kembali ke GCL</Link>
        <h1 className="mt-5 text-3xl font-extrabold tracking-tight">Photo credits</h1>
        <p className="mt-4 max-w-2xl text-sm leading-7 text-[#52636a]">Foto dokumentasi senam putra pada website GCL bersumber dari Wikimedia Commons. Foto diperkecil dengan mempertahankan proporsinya dan dikonversi ke WebP tanpa generasi atau retouching AI. Lisensi sumber pada setiap foto juga berlaku untuk versi WebP yang ditampilkan.</p>

        <ul className="mt-8 divide-y divide-[#7b8583]/40">
          {photoCredits.map(photo => (
            <li key={photo.file} className="grid min-w-0 gap-5 py-6 sm:grid-cols-[180px_minmax(0,1fr)]">
              <div className="relative aspect-[3/2] overflow-hidden rounded-lg bg-white">
                <Image src={photo.file} alt={photo.label} fill sizes="(max-width: 640px) 100vw, 180px" className="object-contain" />
              </div>
              <div className="min-w-0 break-words">
                <h2 className="text-base font-bold">{photo.label}</h2>
                <p className="mt-2 text-sm leading-6">{photo.title}</p>
                <p className="mt-1 text-sm leading-6 text-[#52636a]">Foto: {photo.author}</p>
                <div className="mt-2 flex flex-wrap gap-x-6 gap-y-1 text-sm font-semibold">
                  <a href={photo.source} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center underline underline-offset-4">Sumber foto</a>
                  <a href={photo.licenseUrl} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center underline underline-offset-4">{photo.license}</a>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </main>
    </div>
  );
}
