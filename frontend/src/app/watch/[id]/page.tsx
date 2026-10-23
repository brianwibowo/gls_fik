'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Clock, Lock, Play } from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { LoginModal } from '@/components/LoginModal';
import { LearningTracker } from '@/components/LearningTracker';
import { VideoThumbnail } from '@/components/VideoThumbnail';
import { useAuth } from '@/lib/auth';
import { ApiError, apiGetCategories, apiGetVideoById, apiGetVideoPlayback, apiGetVideos } from '@/lib/api';
import type { Category, Video, VideoPlayback } from '@/lib/types';

const actionClass = 'inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-[#c1ff72] px-4 py-2.5 text-sm font-bold text-[#1f2a2e] hover:bg-[#afe963] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#c1ff72]';

function VideoPlayer({ video, onLogin }: { video: Video; onLogin: () => void }) {
  const { isLoggedIn } = useAuth();
  const [playback, setPlayback] = useState<VideoPlayback | null>(null);
  const [error, setError] = useState('');
  const [attempt, setAttempt] = useState(0);
  const canWatch = video.isFree || isLoggedIn;

  useEffect(() => {
    if (!canWatch) return;
    let current = true;
    apiGetVideoPlayback(video.id).then(data => {
      if (!data.driveFileId) throw new Error('Video ini belum memiliki sumber pemutaran.');
      if (current) setPlayback(data);
    }).catch(reason => {
      if (current) setError(reason instanceof Error ? reason.message : 'Video belum dapat dimuat.');
    });
    return () => { current = false; };
  }, [video.id, canWatch, attempt]);

  if (!canWatch) return (
    <section aria-label="Video memerlukan login" className="flex min-h-72 flex-col items-center justify-center gap-4 rounded-2xl border border-white/15 bg-[#141b1e] px-6 py-12 text-center sm:aspect-video">
      <Lock className="h-7 w-7 text-[#c1ff72]" aria-hidden="true" />
      <h2 className="text-xl font-bold">Masuk untuk menonton materi ini</h2>
      <p className="max-w-md text-sm leading-relaxed text-slate-300">Semua video dan checklist belajar pribadi tersedia setelah kamu masuk.</p>
      <button type="button" onClick={onLogin} className={actionClass}>Masuk ke akun GCL</button>
    </section>
  );

  if (error) return (
    <section role="alert" className="flex min-h-64 flex-col items-center justify-center gap-4 rounded-2xl border border-white/15 bg-[#141b1e] p-8 text-center">
      <h2 className="text-lg font-bold">Video belum dapat dimuat</h2>
      <p className="max-w-lg text-sm text-slate-300">{error}</p>
      <button type="button" className={actionClass} onClick={() => { setError(''); setAttempt(value => value + 1); }}>Coba lagi</button>
    </section>
  );

  if (!playback) return (
    <div role="status" className="flex min-h-64 items-center justify-center rounded-2xl border border-white/15 bg-[#141b1e] text-sm text-slate-300 sm:aspect-video">Memuat video...</div>
  );

  return (
    <section aria-label="Pemutar video materi">
      <div className="aspect-video overflow-hidden rounded-2xl border border-white/15 bg-black">
        <iframe src={`https://drive.google.com/file/d/${encodeURIComponent(playback.driveFileId)}/preview`} className="h-full w-full border-0" allow="autoplay; fullscreen" allowFullScreen title={video.title} />
      </div>
      {playback.driveLink && <a href={playback.driveLink} target="_blank" rel="noopener noreferrer" className="mt-2 inline-flex min-h-11 items-center text-xs text-slate-300 underline underline-offset-4 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#c1ff72]">Buka video di Google Drive</a>}
    </section>
  );
}

function WatchContent({ videoId }: { videoId: string }) {
  const { user, isLoggedIn, isReady } = useAuth();
  const [video, setVideo] = useState<Video | null>(null);
  const [category, setCategory] = useState<Category | null>(null);
  const [siblings, setSiblings] = useState<Video[]>([]);
  const [error, setError] = useState('');
  const [notFound, setNotFound] = useState(false);
  const [attempt, setAttempt] = useState(0);
  const [showLogin, setShowLogin] = useState(false);

  useEffect(() => {
    let current = true;
    async function load() {
      try {
        const selected = await apiGetVideoById(videoId);
        const [categories, related] = await Promise.all([apiGetCategories(), apiGetVideos(selected.categoryId)]);
        if (!current) return;
        setVideo(selected);
        setCategory(categories.find(item => item.id === selected.categoryId) || null);
        setSiblings(related);
      } catch (reason) {
        if (!current) return;
        setNotFound(reason instanceof ApiError && reason.status === 404);
        setError(reason instanceof Error ? reason.message : 'Materi belum dapat dimuat.');
      }
    }
    void load();
    return () => { current = false; };
  }, [videoId, attempt]);

  return (
    <div className="min-h-screen bg-[#0b1012] text-[#f2f6f4]">
      <Navbar />
      <main lang="id" className="mx-auto max-w-7xl px-4 pb-16 pt-6 sm:px-6 lg:px-8">
        <Link href="/#katalog-video" className="mb-5 inline-flex min-h-11 items-center gap-2 text-sm text-slate-300 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#c1ff72]"><ArrowLeft className="h-4 w-4" aria-hidden="true" />Kembali ke katalog</Link>

        {error ? <div role="alert" className="rounded-xl border border-white/15 bg-[#172023] p-8 text-center">
          <h1 className="text-xl font-bold">{notFound ? 'Video tidak ditemukan' : 'Materi belum dapat dimuat'}</h1>
          <p className="mx-auto mt-3 max-w-lg text-sm text-slate-300">{error}</p>
          {!notFound && <button type="button" className={`${actionClass} mt-5`} onClick={() => { setError(''); setAttempt(value => value + 1); }}>Coba lagi</button>}
        </div> : !video || !isReady ? <p role="status" className="py-24 text-center text-sm text-slate-300">Memuat materi GCL...</p> : <>
          <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
            <div className="min-w-0">
              {category && <p className="mb-2 text-sm text-slate-300">{category.name}</p>}
              <h1 className="break-words text-2xl font-extrabold leading-tight tracking-tight sm:text-3xl">{video.title}</h1>
            </div>
            <div className="flex flex-wrap items-center gap-3 text-xs text-slate-300"><span>{video.level}</span>{video.duration && <span className="inline-flex items-center gap-1.5"><Clock className="h-3.5 w-3.5" aria-hidden="true" />{video.duration}</span>}<span>{video.isFree ? 'Materi gratis' : 'Materi akun'}</span></div>
          </div>

          <VideoPlayer key={`${video.id}:${user?.id || 'guest'}`} video={video} onLogin={() => setShowLogin(true)} />

          <div className="mt-5 grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_320px]">
            <section aria-labelledby="video-description-title" className="min-w-0">
              <h2 id="video-description-title" className="text-base font-bold">Tentang materi</h2>
              <p className="mt-3 whitespace-pre-line text-sm leading-7 text-slate-300">{video.description || 'Deskripsi materi belum ditambahkan.'}</p>
            </section>
            <nav aria-label="Video lain pada alat ini" className="min-w-0">
              <h2 className="mb-3 text-base font-bold">Materi {category?.name || 'lainnya'}</h2>
              <div className="space-y-2">
                {siblings.map(episode => <Link key={episode.id} href={`/watch/${episode.id}`} aria-current={episode.id === video.id ? 'page' : undefined} className={`flex min-h-20 items-center gap-3 rounded-lg border p-2.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#c1ff72] ${episode.id === video.id ? 'border-[#c1ff72] bg-[#202c1c]' : 'border-white/20 bg-[#172023] hover:bg-[#253034]'}`}>
                  <div className="relative aspect-video w-24 shrink-0 overflow-hidden rounded bg-[#263438]"><VideoThumbnail video={episode} className="object-cover" /></div>
                  <div className="min-w-0"><p className="break-words text-sm font-semibold">{episode.title}</p><p className="mt-1 flex items-center gap-1.5 text-xs text-slate-300">{!episode.isFree && !isLoggedIn ? <><Lock className="h-3 w-3" aria-hidden="true" />Masuk untuk menonton</> : episode.id === video.id ? <><Play className="h-3 w-3" aria-hidden="true" />Sedang dibuka</> : episode.level}</p></div>
                </Link>)}
              </div>
            </nav>
          </div>

          <div className="mt-10 border-t border-white/15 pt-8"><LearningTracker videoId={video.id} onLogin={() => setShowLogin(true)} /></div>
        </>}
      </main>
      {showLogin && <LoginModal isOpen={showLogin} onClose={() => setShowLogin(false)} />}
    </div>
  );
}

export default function WatchPage() {
  const params = useParams<{ id: string }>();
  return <WatchContent key={params.id} videoId={params.id} />;
}
