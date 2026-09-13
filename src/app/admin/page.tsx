'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
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

function AdminVideoManagement() {
  const searchParams = useSearchParams();

  const [videos, setVideos] = useState<Video[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedFilterCat, setSelectedFilterCat] = useState<string>('all');
  const [activeView, setActiveView] = useState<'videos' | 'categories'>('videos');

  // Video Form
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

  // Category Modal Form
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [newCatName, setNewCatName] = useState('');
  const [newCatDesc, setNewCatDesc] = useState('');

  useEffect(() => {
    const cats = getCategories();
    const vids = getVideos();
    setCategories(cats);
    setVideos(vids);

    if (searchParams.get('action') === 'new') {
      setShowVideoForm(true);
      if (cats.length > 0) {
        setVideoForm((f) => ({ ...f, categoryId: cats[0].id }));
      }
    }
  }, [searchParams]);

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

    const cat = categories.find((c) => c.id === videoForm.categoryId);
    const chosenThumbnail =
      videoForm.thumbnail.trim() || cat?.thumbnail || '/images/apparatus-floor.webp';

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

  const filteredVideos =
    selectedFilterCat === 'all'
      ? videos
      : videos.filter((v) => v.categoryId === selectedFilterCat);

  return (
    <div className="p-6 sm:p-8 max-w-6xl mx-auto w-full">
      {/* ── TOP HEADER ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 mb-6 border-b border-[#1f2937] gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Video Materi & Kategori
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Kelola seluruh video latihan dari Google Drive dan nomor alat senam di satu tempat.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {!showVideoForm && (
            <button
              onClick={() => {
                resetVideoForm();
                setShowVideoForm(true);
              }}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md transition-colors cursor-pointer"
            >
              <Plus className="w-5 h-5 stroke-[2.5]" />
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
                <span>Tambah Nomor Alat / Kategori Baru</span>
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
                  Nama Nomor Alat *
                </label>
                <input
                  type="text"
                  required
                  value={newCatName}
                  onChange={(e) => setNewCatName(e.target.value)}
                  placeholder="Contoh: Trampoline, Akrobatik, dll"
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
                  placeholder="Contoh: Rangkaian gerakan akrobatik khusus"
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

      {/* ── FORM TAMBAH / EDIT VIDEO (RAMAH & LENGKAP) ── */}
      {showVideoForm && (
        <div className="mb-8 bg-[#1e293b] border-2 border-blue-500/80 rounded-2xl p-6 sm:p-8 shadow-xl">
          <div className="flex items-center justify-between pb-4 mb-6 border-b border-[#334155]">
            <div>
              <h2 className="text-xl font-black text-white">
                {editingVideoId ? '✏️ Ubah Data Video' : '📹 Formulir Tambah Video Baru'}
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 mt-0.5">
                Pilih nomor alat dan tempelkan link dari Google Drive.
              </p>
            </div>
            <button
              onClick={resetVideoForm}
              className="p-2 rounded-xl bg-[#0f172a] border border-[#334155] text-slate-300 hover:text-white cursor-pointer"
              title="Tutup formulir"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmitVideo} className="space-y-6">
            {/* 1. Pilih Nomor Alat + Tombol Tambah Kategori */}
            <div>
              <label className="block text-sm font-bold text-white mb-1.5">
                1. Nomor Alat / Kategori Senam *
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
                  <span>+ Tambah Kategori Baru</span>
                </button>
              </div>
            </div>

            {/* 2. Judul Video */}
            <div>
              <label className="block text-sm font-bold text-white mb-1.5">
                2. Judul Video *
              </label>
              <input
                type="text"
                required
                value={videoForm.title}
                onChange={(e) => setVideoForm({ ...videoForm, title: e.target.value })}
                placeholder="Contoh: Drill Awalan Lari & Langkah Hurdle"
                className="w-full px-4 py-3 rounded-xl bg-[#0f172a] border border-[#475569] text-white text-sm focus:outline-none focus:border-blue-500"
              />
            </div>

            {/* 3. Link Google Drive */}
            <div className="bg-[#0f172a] p-5 rounded-xl border border-[#334155] space-y-2">
              <label className="block text-sm font-bold text-white">
                3. Link Google Drive Video *
              </label>
              <input
                type="text"
                required
                value={videoForm.driveLink}
                onChange={(e) => setVideoForm({ ...videoForm, driveLink: e.target.value })}
                placeholder="Tempel link Google Drive di sini (misal: https://drive.google.com/file/d/12JG_YaH.../view)"
                className="w-full px-4 py-3 rounded-xl bg-[#1e293b] border border-[#475569] text-white text-sm font-mono focus:outline-none focus:border-blue-500"
              />

              {detectedDriveId ? (
                <div className="flex items-center gap-2 p-2.5 rounded-lg bg-emerald-950/40 border border-emerald-500/40 text-xs text-emerald-300 font-medium">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>
                    <strong>Bagus!</strong> ID Video terdeteksi: <code className="font-mono text-emerald-200">{detectedDriveId}</code>
                  </span>
                </div>
              ) : (
                <div className="flex items-start gap-2 text-xs text-slate-400 pt-1">
                  <HelpCircle className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                  <span>
                    Buka video di Google Drive &rarr; Klik Bagikan (Share) &rarr; Salin link &rarr; Tempel di kotak ini.
                  </span>
                </div>
              )}
            </div>

            {/* 4. Level, Episode, Durasi */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase mb-1.5">
                  Tingkat Latihan
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

            {/* 5. Hak Akses Gratis */}
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
                  Centang untuk video pengantar gratis. Jika tidak dicentang, atlet harus login terlebih dahulu.
                </span>
              </label>
            </div>

            {/* 6. Deskripsi */}
            <div>
              <label className="block text-sm font-bold text-white mb-1.5">
                Catatan Gerakan / Deskripsi Latihan
              </label>
              <textarea
                rows={3}
                value={videoForm.description}
                onChange={(e) => setVideoForm({ ...videoForm, description: e.target.value })}
                placeholder="Tuliskan petunjuk teknis gerakan, fokus awalan, atau evaluasi pendaratan..."
                className="w-full px-4 py-3 rounded-xl bg-[#0f172a] border border-[#475569] text-white text-sm focus:outline-none focus:border-blue-500"
              />
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#334155]">
              <button
                type="button"
                onClick={resetVideoForm}
                className="px-5 py-3 rounded-xl bg-[#334155] hover:bg-[#475569] text-slate-200 font-semibold text-sm cursor-pointer"
              >
                Batal
              </button>
              <button
                type="submit"
                className="inline-flex items-center gap-2 px-7 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-base shadow-lg cursor-pointer"
              >
                <Save className="w-5 h-5" />
                <span>Simpan Video</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ── SUB-TABS: DAFTAR VIDEO VS ATUR NOMOR ALAT ── */}
      <div className="flex items-center gap-4 border-b border-[#1f2937] mb-6">
        <button
          onClick={() => setActiveView('videos')}
          className={`pb-3 text-sm font-bold transition-colors cursor-pointer border-b-2 ${
            activeView === 'videos'
              ? 'text-blue-400 border-blue-500'
              : 'text-slate-400 border-transparent hover:text-white'
          }`}
        >
          Daftar Video ({videos.length})
        </button>
        <button
          onClick={() => setActiveView('categories')}
          className={`pb-3 text-sm font-bold transition-colors cursor-pointer border-b-2 flex items-center gap-1.5 ${
            activeView === 'categories'
              ? 'text-blue-400 border-blue-500'
              : 'text-slate-400 border-transparent hover:text-white'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Nomor Alat / Kategori ({categories.length})</span>
        </button>
      </div>

      {/* ── TAMPILAN 1: DAFTAR VIDEO ── */}
      {activeView === 'videos' && (
        <div className="space-y-4">
          {/* Filter Bar */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
            <span className="text-xs text-slate-400 font-semibold whitespace-nowrap">Filter:</span>
            <button
              onClick={() => setSelectedFilterCat('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                selectedFilterCat === 'all'
                  ? 'bg-blue-600 text-white'
                  : 'bg-[#111827] text-slate-300 hover:text-white border border-[#1f2937]'
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
                      : 'bg-[#111827] text-slate-300 hover:text-white border border-[#1f2937]'
                  }`}
                >
                  {c.name.split(' ')[0]} ({count})
                </button>
              );
            })}
          </div>

          {/* Table / List */}
          <div className="bg-[#111827] border border-[#1f2937] rounded-xl overflow-hidden shadow-sm divide-y divide-[#1f2937]">
            {filteredVideos.map((video) => {
              const cat = categories.find((c) => c.id === video.categoryId);
              return (
                <div
                  key={video.id}
                  className="p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:bg-[#162032] transition-colors"
                >
                  <div className="flex items-start gap-4 min-w-0">
                    <div className="relative w-28 h-18 rounded-lg overflow-hidden bg-black shrink-0 border border-[#334155]">
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
                        <span className="px-2 py-0.5 rounded bg-[#1e293b] text-slate-300 text-xs font-medium">
                          Level {video.level}
                        </span>
                        {video.isFree ? (
                          <span className="px-2 py-0.5 rounded bg-emerald-600 text-white text-[10px] font-bold uppercase tracking-wider">
                            Gratis
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded bg-[#1e293b] text-slate-300 text-[10px] font-semibold flex items-center gap-1">
                            <Lock className="w-3 h-3 text-slate-400" />
                            <span>Perlu Login</span>
                          </span>
                        )}
                        <span className="text-xs text-slate-400 font-mono">
                          {video.duration}
                        </span>
                      </div>

                      <h3 className="text-base font-bold text-white truncate">
                        {video.title}
                      </h3>

                      <p className="text-xs text-slate-400 mt-1 line-clamp-1">
                        {video.description}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                    <Link
                      href={`/watch/${video.id}`}
                      target="_blank"
                      className="p-2.5 rounded-lg bg-[#1e293b] hover:bg-[#334155] text-slate-300 hover:text-white border border-[#334155] transition-colors"
                      title="Lihat Pratinjau Video"
                    >
                      <Eye className="w-4 h-4" />
                    </Link>
                    <button
                      onClick={() => handleEditVideo(video)}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-blue-600/20 hover:bg-blue-600 text-blue-300 hover:text-white border border-blue-500/40 text-xs font-bold transition-colors cursor-pointer"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                      <span>Edit</span>
                    </button>
                    <button
                      onClick={() => handleDeleteVideo(video.id, video.title)}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-red-600/20 hover:bg-red-600 text-red-300 hover:text-white border border-red-500/30 text-xs font-bold transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Hapus</span>
                    </button>
                  </div>
                </div>
              );
            })}

            {filteredVideos.length === 0 && (
              <div className="p-10 text-center text-slate-400">
                <VideoIcon className="w-8 h-8 mx-auto mb-2 text-slate-500 opacity-60" />
                <p className="text-sm font-semibold">Belum ada video di kategori ini.</p>
                <button
                  onClick={() => {
                    resetVideoForm();
                    setShowVideoForm(true);
                  }}
                  className="mt-3 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold cursor-pointer inline-flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" />
                  <span>Tambah Video Sekarang</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── TAMPILAN 2: ATUR NOMOR ALAT / KATEGORI ── */}
      {activeView === 'categories' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between bg-[#111827] p-4 rounded-xl border border-[#1f2937]">
            <div>
              <h3 className="text-sm font-bold text-white">Daftar Nomor Alat Senam</h3>
              <p className="text-xs text-slate-400">
                Nomor alat digunakan untuk mengelompokkan video pada katalog utama.
              </p>
            </div>
            <button
              onClick={() => setShowCategoryModal(true)}
              className="px-4 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold cursor-pointer flex items-center gap-1.5 shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>+ Tambah Nomor Alat Baru</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {categories.map((c) => {
              const count = videos.filter((v) => v.categoryId === c.id).length;
              return (
                <div
                  key={c.id}
                  className="bg-[#111827] border border-[#1f2937] rounded-xl p-4 flex items-start justify-between gap-3"
                >
                  <div className="flex items-start gap-3">
                    <div className="relative w-14 h-14 rounded-lg overflow-hidden bg-black shrink-0 border border-[#334155]">
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
    </div>
  );
}

export default function AdminPage() {
  return (
    <Suspense fallback={<div className="p-8 text-white">Memuat...</div>}>
      <AdminVideoManagement />
    </Suspense>
  );
}
