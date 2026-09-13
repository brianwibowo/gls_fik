'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { Navbar } from '@/components/Navbar';
import { useAuth } from '@/lib/auth';
import {
  getVideos,
  getCategories,
  createVideo,
  updateVideo,
  deleteVideo,
  createCategory,
  deleteCategory,
  extractDriveFileId,
} from '@/lib/data';
import type { Video, Category } from '@/lib/types';
import {
  ArrowLeft,
  Plus,
  Pencil,
  Trash2,
  X,
  Save,
  Video as VideoIcon,
  CheckCircle2,
  ExternalLink,
  Layers,
  PlusCircle,
  HelpCircle,
  Lock,
  Eye,
} from 'lucide-react';

function AdminVideosContent() {
  const { isAdmin, isReady, isLoggedIn } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [videos, setVideos] = useState<Video[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedFilterCat, setSelectedFilterCat] = useState<string>('all');
  const [activeTab, setActiveTab] = useState<'videos' | 'categories'>('videos');

  // Video Form state
  const [showVideoForm, setShowVideoForm] = useState(false);
  const [editingVideoId, setEditingVideoId] = useState<string | null>(null);
  const [videoForm, setVideoForm] = useState({
    categoryId: '',
    title: '',
    description: '',
    driveLink: '',
    duration: '04:00',
    level: 'Dasar',
    episodeNum: 1,
    isFree: false,
    thumbnail: '',
  });

  // Inline Category Form state
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [newCatName, setNewCatName] = useState('');
  const [newCatDesc, setNewCatDesc] = useState('');

  // Initial load
  useEffect(() => {
    if (isReady && (!isLoggedIn || !isAdmin)) {
      router.push('/login');
      return;
    }
    const cats = getCategories();
    const vids = getVideos();
    setCategories(cats);
    setVideos(vids);

    // If query ?action=new is set, open form automatically
    if (searchParams.get('action') === 'new') {
      setShowVideoForm(true);
      if (cats.length > 0) {
        setVideoForm((f) => ({ ...f, categoryId: cats[0].id }));
      }
    }
  }, [isReady, isLoggedIn, isAdmin, router, searchParams]);

  // Detected Drive File ID
  const detectedDriveId = extractDriveFileId(videoForm.driveLink);

  const resetVideoForm = () => {
    setShowVideoForm(false);
    setEditingVideoId(null);
    setVideoForm({
      categoryId: categories[0]?.id || '',
      title: '',
      description: '',
      driveLink: '',
      duration: '04:00',
      level: 'Dasar',
      episodeNum: videos.length + 1,
      isFree: false,
      thumbnail: '',
    });
  };

  const handleEditVideo = (v: Video) => {
    setVideoForm({
      categoryId: v.categoryId,
      title: v.title,
      description: v.description,
      driveLink: v.driveLink,
      duration: v.duration,
      level: v.level,
      episodeNum: v.episodeNum,
      isFree: v.isFree,
      thumbnail: v.thumbnail,
    });
    setEditingVideoId(v.id);
    setShowVideoForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmitVideo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!detectedDriveId) {
      alert('Mohon masukkan Link atau File ID Google Drive yang valid.');
      return;
    }

    // Auto thumbnail from category if empty
    const cat = categories.find((c) => c.id === videoForm.categoryId);
    const chosenThumbnail = videoForm.thumbnail.trim() || cat?.thumbnail || '/images/apparatus-floor.webp';

    const payload = {
      categoryId: videoForm.categoryId || categories[0]?.id || 'cat-fx',
      title: videoForm.title,
      description: videoForm.description || 'Drill latihan teknik gerakan.',
      driveFileId: detectedDriveId,
      driveLink: videoForm.driveLink.startsWith('http')
        ? videoForm.driveLink
        : `https://drive.google.com/file/d/${detectedDriveId}/view`,
      duration: videoForm.duration || '04:00',
      level: videoForm.level,
      episodeNum: Number(videoForm.episodeNum) || 1,
      isFree: Boolean(videoForm.isFree),
      thumbnail: chosenThumbnail,
    };

    if (editingVideoId) {
      updateVideo(editingVideoId, payload);
    } else {
      createVideo(payload);
    }

    setVideos(getVideos());
    resetVideoForm();
  };

  const handleDeleteVideo = (id: string, title: string) => {
    if (!confirm(`Hapus video "${title}"?`)) return;
    deleteVideo(id);
    setVideos(getVideos());
  };

  // Inline Category Creator
  const handleCreateCategoryInline = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName.trim()) return;

    const newCat = createCategory({
      name: newCatName.trim(),
      description: newCatDesc.trim() || `Materi dan drill teknik ${newCatName.trim()}.`,
      thumbnail: '/images/apparatus-floor.webp',
      order: categories.length + 1,
    });

    const updated = getCategories();
    setCategories(updated);
    setVideoForm((f) => ({ ...f, categoryId: newCat.id }));
    setNewCatName('');
    setNewCatDesc('');
    setShowCategoryModal(false);
  };

  const handleDeleteCategory = (id: string, name: string) => {
    if (!confirm(`Hapus kategori "${name}"? Semua video di dalamnya juga akan terhapus!`)) return;
    deleteCategory(id);
    setCategories(getCategories());
    setVideos(getVideos());
  };

  if (!isReady || !isAdmin) return null;

  const filteredVideos =
    selectedFilterCat === 'all'
      ? videos
      : videos.filter((v) => v.categoryId === selectedFilterCat);

  return (
    <div className="min-h-screen bg-[#0f172a] text-white">
      <Navbar />

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tombol Kembali ke Dashboard Admin */}
        <Link
          href="/admin"
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-300 hover:text-white mb-6 group transition-colors"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span>Kembali ke Menu Utama Admin</span>
        </Link>

        {/* Header Halaman */}
        <div className="bg-[#1e293b] border border-[#334155] rounded-2xl p-6 mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-600 flex items-center justify-center text-white shrink-0 shadow-md">
              <VideoIcon className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-white">Kelola Video & Kategori Alat</h1>
              <p className="text-xs sm:text-sm text-slate-300 mt-0.5">
                Semua pengaturan video dan nomor alat senam dikelola di sini.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {!showVideoForm && (
              <button
                onClick={() => {
                  resetVideoForm();
                  setShowVideoForm(true);
                }}
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md transition-colors cursor-pointer"
              >
                <Plus className="w-4 h-4 stroke-[3]" />
                <span>+ Tambah Video Baru</span>
              </button>
            )}
          </div>
        </div>

        {/* ── MODAL INLINE TAMBAH KATEGORI BARU ── */}
        {showCategoryModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <div className="bg-[#1e293b] border border-[#475569] rounded-2xl max-w-md w-full p-6 shadow-2xl">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Layers className="w-5 h-5 text-blue-400" />
                  <span>Tambah Nomor Alat / Kategori</span>
                </h3>
                <button
                  onClick={() => setShowCategoryModal(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCreateCategoryInline} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase mb-1">
                    Nama Nomor Alat / Kategori *
                  </label>
                  <input
                    type="text"
                    required
                    value={newCatName}
                    onChange={(e) => setNewCatName(e.target.value)}
                    placeholder="Contoh: Trampoline, Akrobatik Putri, dll"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#0f172a] border border-[#475569] text-white text-sm focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase mb-1">
                    Keterangan Singkat
                  </label>
                  <input
                    type="text"
                    value={newCatDesc}
                    onChange={(e) => setNewCatDesc(e.target.value)}
                    placeholder="Contoh: Seri latihan khusus persiapan kejuaraan"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#0f172a] border border-[#475569] text-white text-sm focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#334155]">
                  <button
                    type="button"
                    onClick={() => setShowCategoryModal(false)}
                    className="px-4 py-2 rounded-xl bg-[#334155] hover:bg-[#475569] text-slate-200 text-xs font-semibold cursor-pointer"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold cursor-pointer shadow-md"
                  >
                    Simpan Kategori
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ── FORMULIR TAMBAH / EDIT VIDEO (RAMAH BAPAK-BAPAK) ── */}
        {showVideoForm && (
          <div className="mb-10 bg-[#1e293b] border-2 border-blue-500/80 rounded-2xl p-6 sm:p-8 shadow-xl">
            <div className="flex items-center justify-between pb-4 mb-6 border-b border-[#334155]">
              <div>
                <h2 className="text-xl font-black text-white">
                  {editingVideoId ? '✏️ Ubah Data Video' : '📹 Tambah Video Materi Baru'}
                </h2>
                <p className="text-xs sm:text-sm text-slate-300 mt-0.5">
                  Isi informasi di bawah. Sistem otomatis mendeteksi ID Google Drive saat Anda menempelkan link.
                </p>
              </div>
              <button
                onClick={resetVideoForm}
                className="p-2 rounded-xl bg-[#0f172a] border border-[#334155] text-slate-300 hover:text-white hover:border-slate-400 cursor-pointer"
                title="Tutup formulir"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitVideo} className="space-y-6">
              {/* Baris 1: Kategori & Tambah Kategori Baru */}
              <div>
                <label className="block text-sm font-bold text-white mb-1.5">
                  1. Pilih Nomor Alat / Kategori *
                </label>
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                  <select
                    value={videoForm.categoryId}
                    onChange={(e) => setVideoForm({ ...videoForm, categoryId: e.target.value })}
                    required
                    className="flex-1 px-4 py-3 rounded-xl bg-[#0f172a] border border-[#475569] text-white text-sm font-medium focus:outline-none focus:border-blue-500"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>

                  <button
                    type="button"
                    onClick={() => setShowCategoryModal(true)}
                    className="px-4 py-3 rounded-xl bg-[#334155] hover:bg-[#475569] text-blue-300 hover:text-white text-xs font-bold border border-[#475569] flex items-center justify-center gap-1.5 cursor-pointer shrink-0"
                  >
                    <PlusCircle className="w-4 h-4 text-blue-400" />
                    <span>+ Buat Nomor Alat Baru</span>
                  </button>
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  Pilih nomor alat senam tempat video ini akan ditampilkan.
                </p>
              </div>

              {/* Baris 2: Judul Video */}
              <div>
                <label className="block text-sm font-bold text-white mb-1.5">
                  2. Judul Video Latihan *
                </label>
                <input
                  type="text"
                  required
                  value={videoForm.title}
                  onChange={(e) => setVideoForm({ ...videoForm, title: e.target.value })}
                  placeholder="Contoh: Drill Awalan & Langkah Hurdle Senam Lantai"
                  className="w-full px-4 py-3 rounded-xl bg-[#0f172a] border border-[#475569] text-white text-sm focus:outline-none focus:border-blue-500"
                />
              </div>

              {/* Baris 3: Link Google Drive */}
              <div className="bg-[#0f172a] p-4 sm:p-5 rounded-xl border border-[#334155] space-y-2">
                <label className="block text-sm font-bold text-white">
                  3. Link Video dari Google Drive *
                </label>
                <input
                  type="text"
                  required
                  value={videoForm.driveLink}
                  onChange={(e) => setVideoForm({ ...videoForm, driveLink: e.target.value })}
                  placeholder="Tempel link Google Drive di sini (misal: https://drive.google.com/file/d/12JG_YaH.../view)"
                  className="w-full px-4 py-3 rounded-xl bg-[#1e293b] border border-[#475569] text-white text-sm font-mono focus:outline-none focus:border-blue-500"
                />

                {/* Feedback Real-time untuk Bapak-bapak */}
                {detectedDriveId ? (
                  <div className="flex items-center gap-2 p-2.5 rounded-lg bg-emerald-950/40 border border-emerald-500/40 text-xs text-emerald-300 font-medium">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>
                      <strong>Bagus!</strong> ID Video terdeteksi: <code className="font-mono text-emerald-200">{detectedDriveId}</code>
                    </span>
                  </div>
                ) : (
                  <div className="flex items-start gap-2 text-xs text-amber-300/90 pt-1">
                    <HelpCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <span>
                      Cara ambil link: Di Google Drive, klik kanan video &rarr; pilih <strong>Bagikan (Share)</strong> &rarr; klik <strong>Salin link (Copy link)</strong> &rarr; lalu tempelkan di kotak ini.
                    </span>
                  </div>
                )}
              </div>

              {/* Baris 4: Pengaturan Detail (Level, Episode, Durasi) */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* Level */}
                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase mb-1.5">
                    Tingkat Kesulitan
                  </label>
                  <select
                    value={videoForm.level}
                    onChange={(e) => setVideoForm({ ...videoForm, level: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#0f172a] border border-[#475569] text-white text-sm focus:outline-none focus:border-blue-500"
                  >
                    <option value="Dasar">Dasar (Pemula)</option>
                    <option value="Menengah">Menengah</option>
                    <option value="Mahir">Mahir (Lanjutan)</option>
                  </select>
                </div>

                {/* Nomor Episode */}
                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase mb-1.5">
                    Urutan Episode
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={videoForm.episodeNum}
                    onChange={(e) => setVideoForm({ ...videoForm, episodeNum: Number(e.target.value) })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#0f172a] border border-[#475569] text-white text-sm focus:outline-none focus:border-blue-500"
                  />
                </div>

                {/* Durasi */}
                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase mb-1.5">
                    Durasi Video
                  </label>
                  <input
                    type="text"
                    value={videoForm.duration}
                    onChange={(e) => setVideoForm({ ...videoForm, duration: e.target.value })}
                    placeholder="Contoh: 04:15"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#0f172a] border border-[#475569] text-white text-sm focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Baris 5: Hak Akses Gratis (Besar & Jelas) */}
              <div className="p-4 rounded-xl bg-[#0f172a] border border-[#334155] flex items-start gap-3">
                <input
                  type="checkbox"
                  id="isFreeCheckbox"
                  checked={videoForm.isFree}
                  onChange={(e) => setVideoForm({ ...videoForm, isFree: e.target.checked })}
                  className="w-5 h-5 mt-0.5 rounded text-blue-600 focus:ring-blue-500 cursor-pointer"
                />
                <label htmlFor="isFreeCheckbox" className="text-sm cursor-pointer select-none">
                  <span className="font-bold text-white block">
                    Boleh Ditonton GRATIS Tanpa Perlu Login
                  </span>
                  <span className="text-xs text-slate-400 block mt-0.5">
                    Centang jika video ini dijadikan contoh/materi pengantar gratis. Jika tidak dicentang, atlet harus login terlebih dahulu untuk menonton.
                  </span>
                </label>
              </div>

              {/* Baris 6: Keterangan / Deskripsi Latihan */}
              <div>
                <label className="block text-sm font-bold text-white mb-1.5">
                  Catatan Latihan / Deskripsi Video
                </label>
                <textarea
                  rows={3}
                  value={videoForm.description}
                  onChange={(e) => setVideoForm({ ...videoForm, description: e.target.value })}
                  placeholder="Jelaskan gerakan apa saja yang dilatih, fokus pendaratan, dan tips pelatih..."
                  className="w-full px-4 py-3 rounded-xl bg-[#0f172a] border border-[#475569] text-white text-sm focus:outline-none focus:border-blue-500"
                />
              </div>

              {/* Tombol Simpan & Batal */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#334155]">
                <button
                  type="button"
                  onClick={resetVideoForm}
                  className="px-5 py-3 rounded-xl bg-[#334155] hover:bg-[#475569] text-slate-200 font-semibold text-sm cursor-pointer transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 px-7 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-base shadow-lg transition-colors cursor-pointer"
                >
                  <Save className="w-5 h-5" />
                  <span>Simpan Video Ini</span>
                </button>
              </div>
            </form>
          </div>
        )}

        {/* ── TAB PILIHAN: DAFTAR VIDEO VS ATUR KATEGORI ── */}
        <div className="flex items-center gap-3 border-b border-[#334155] mb-6">
          <button
            onClick={() => setActiveTab('videos')}
            className={`pb-3 px-2 text-sm font-bold transition-colors cursor-pointer border-b-2 ${
              activeTab === 'videos'
                ? 'text-blue-400 border-blue-500'
                : 'text-slate-400 border-transparent hover:text-white'
            }`}
          >
            Daftar Semua Video ({videos.length})
          </button>
          <button
            onClick={() => setActiveTab('categories')}
            className={`pb-3 px-2 text-sm font-bold transition-colors cursor-pointer border-b-2 flex items-center gap-1.5 ${
              activeTab === 'categories'
                ? 'text-blue-400 border-blue-500'
                : 'text-slate-400 border-transparent hover:text-white'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Atur Kategori / Nomor Alat ({categories.length})</span>
          </button>
        </div>

        {/* ── TAMPILAN 1: DAFTAR SEMUA VIDEO ── */}
        {activeTab === 'videos' && (
          <div className="space-y-4">
            {/* Filter Nomor Alat */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
              <span className="text-xs text-slate-400 font-semibold whitespace-nowrap">Filter Alat:</span>
              <button
                onClick={() => setSelectedFilterCat('all')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                  selectedFilterCat === 'all'
                    ? 'bg-blue-600 text-white'
                    : 'bg-[#1e293b] text-slate-300 hover:text-white border border-[#334155]'
                }`}
              >
                Semua ({videos.length})
              </button>
              {categories.map((c) => {
                const count = videos.filter((v) => v.categoryId === c.id).length;
                return (
                  <button
                    key={c.id}
                    onClick={() => setSelectedFilterCat(c.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                      selectedFilterCat === c.id
                        ? 'bg-blue-600 text-white'
                        : 'bg-[#1e293b] text-slate-300 hover:text-white border border-[#334155]'
                    }`}
                  >
                    {c.name.split(' ')[0]} ({count})
                  </button>
                );
              })}
            </div>

            {/* List Kartu Video */}
            <div className="space-y-3">
              {filteredVideos.map((video) => {
                const cat = categories.find((c) => c.id === video.categoryId);
                return (
                  <div
                    key={video.id}
                    className="bg-[#1e293b] border border-[#334155] rounded-xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm hover:border-slate-500 transition-colors"
                  >
                    {/* Thumbnail + Info */}
                    <div className="flex items-start gap-4 min-w-0">
                      <div className="relative w-28 h-18 rounded-lg overflow-hidden bg-black shrink-0 border border-[#475569]">
                        <Image
                          src={video.thumbnail}
                          alt={video.title}
                          fill
                          className="object-cover object-center"
                          sizes="112px"
                        />
                        <div className="absolute top-1 left-1">
                          <span className="px-1.5 py-0.5 rounded bg-black/80 text-[10px] font-bold text-slate-200">
                            EP {video.episodeNum}
                          </span>
                        </div>
                      </div>

                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2 mb-1">
                          <span className="px-2 py-0.5 rounded bg-blue-900/60 text-blue-200 border border-blue-700/60 text-xs font-bold">
                            {cat?.name || 'Nomor Alat'}
                          </span>
                          <span className="px-2 py-0.5 rounded bg-[#334155] text-slate-300 text-xs font-medium">
                            Level {video.level}
                          </span>
                          {video.isFree ? (
                            <span className="px-2 py-0.5 rounded bg-emerald-600 text-white text-[10px] font-bold uppercase tracking-wider">
                              Gratis
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded bg-[#334155] text-slate-300 text-[10px] font-semibold flex items-center gap-1">
                              <Lock className="w-3 h-3 text-slate-400" />
                              <span>Perlu Login</span>
                            </span>
                          )}
                        </div>

                        <h3 className="text-base font-bold text-white truncate">
                          {video.title}
                        </h3>

                        <p className="text-xs text-slate-400 mt-1 line-clamp-1">
                          {video.description}
                        </p>
                      </div>
                    </div>

                    {/* Tombol Aksi */}
                    <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                      <Link
                        href={`/watch/${video.id}`}
                        target="_blank"
                        className="p-2 rounded-lg bg-[#0f172a] hover:bg-[#162032] text-slate-300 hover:text-white border border-[#334155] transition-colors"
                        title="Lihat Pratinjau Video"
                      >
                        <Eye className="w-4 h-4" />
                      </Link>
                      <button
                        onClick={() => handleEditVideo(video)}
                        className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-blue-600/30 hover:bg-blue-600 text-blue-200 hover:text-white border border-blue-500/50 text-xs font-bold transition-colors cursor-pointer"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                        <span>Edit</span>
                      </button>
                      <button
                        onClick={() => handleDeleteVideo(video.id, video.title)}
                        className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-red-600/20 hover:bg-red-600 text-red-300 hover:text-white border border-red-500/40 text-xs font-bold transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Hapus</span>
                      </button>
                    </div>
                  </div>
                );
              })}

              {filteredVideos.length === 0 && (
                <div className="p-8 text-center bg-[#1e293b] rounded-xl border border-[#334155]">
                  <p className="text-sm font-semibold text-slate-300">
                    Belum ada video pada kategori ini.
                  </p>
                  <button
                    onClick={() => {
                      resetVideoForm();
                      setShowVideoForm(true);
                      if (selectedFilterCat !== 'all') {
                        setVideoForm((f) => ({ ...f, categoryId: selectedFilterCat }));
                      }
                    }}
                    className="mt-3 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Tambah Video Untuk Kategori Ini</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── TAMPILAN 2: ATUR KATEGORI / NOMOR ALAT ── */}
        {activeTab === 'categories' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between bg-[#1e293b] p-4 rounded-xl border border-[#334155]">
              <div>
                <h3 className="text-sm font-bold text-white">Daftar Nomor Alat Senam</h3>
                <p className="text-xs text-slate-300">
                  Kategori mengelompokkan video pada katalog utama.
                </p>
              </div>
              <button
                onClick={() => setShowCategoryModal(true)}
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold cursor-pointer flex items-center gap-1.5 shadow-sm"
              >
                <Plus className="w-4 h-4" />
                <span>+ Buat Nomor Alat Baru</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {categories.map((c) => {
                const count = videos.filter((v) => v.categoryId === c.id).length;
                return (
                  <div
                    key={c.id}
                    className="bg-[#1e293b] border border-[#334155] rounded-xl p-4 flex items-start justify-between gap-3"
                  >
                    <div className="flex items-start gap-3">
                      <div className="relative w-14 h-14 rounded-lg overflow-hidden bg-black shrink-0 border border-[#475569]">
                        <Image
                          src={c.thumbnail}
                          alt={c.name}
                          fill
                          className="object-cover object-center"
                          sizes="56px"
                        />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-white">{c.name}</h4>
                        <p className="text-xs text-slate-400 mt-0.5 line-clamp-2">{c.description}</p>
                        <span className="inline-block mt-2 text-[11px] font-semibold text-blue-400">
                          {count} video materi terdaftar
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => handleDeleteCategory(c.id, c.name)}
                      className="p-2 rounded-lg bg-red-600/10 hover:bg-red-600 text-red-400 hover:text-white border border-red-500/20 transition-colors cursor-pointer shrink-0"
                      title="Hapus Kategori"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default function AdminVideosPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#0f172a]" />}>
      <AdminVideosContent />
    </Suspense>
  );
}
