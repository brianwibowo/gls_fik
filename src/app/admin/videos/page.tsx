'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/Navbar';
import { useAuth } from '@/lib/auth';
import { getVideos, getCategories, createVideo, updateVideo, deleteVideo } from '@/lib/data';
import type { Video, Category } from '@/lib/types';
import { ArrowLeft, Plus, Pencil, Trash2, X, Save, Video as VideoIcon, ExternalLink } from 'lucide-react';

export default function AdminVideosPage() {
  const { isAdmin, isReady, isLoggedIn } = useAuth();
  const router = useRouter();
  const [videos, setVideos] = useState<Video[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({
    categoryId: '', title: '', description: '', driveFileId: '', driveLink: '',
    thumbnail: '', duration: '', level: 'Dasar', episodeNum: 1, isFree: false,
  });

  useEffect(() => {
    if (isReady && (!isLoggedIn || !isAdmin)) { router.push('/login'); return; }
    setVideos(getVideos());
    setCategories(getCategories());
  }, [isReady, isLoggedIn, isAdmin, router]);

  const resetForm = () => {
    setForm({
      categoryId: categories[0]?.id || '', title: '', description: '', driveFileId: '', driveLink: '',
      thumbnail: '', duration: '', level: 'Dasar', episodeNum: 1, isFree: false,
    });
    setEditingId(null);
    setShowForm(false);
  };

  const handleEdit = (v: Video) => {
    setForm({
      categoryId: v.categoryId, title: v.title, description: v.description,
      driveFileId: v.driveFileId, driveLink: v.driveLink, thumbnail: v.thumbnail,
      duration: v.duration, level: v.level, episodeNum: v.episodeNum, isFree: v.isFree,
    });
    setEditingId(v.id);
    setShowForm(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      updateVideo(editingId, form);
    } else {
      createVideo(form);
    }
    setVideos(getVideos());
    resetForm();
  };

  const handleDelete = (id: string) => {
    if (!confirm('Hapus video ini?')) return;
    deleteVideo(id);
    setVideos(getVideos());
  };

  const getCategoryName = (catId: string) => categories.find((c) => c.id === catId)?.name || '-';

  if (!isReady || !isAdmin) return null;

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <Navbar />
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <Link href="/admin" className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white mb-6 group">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span>Admin Panel</span>
        </Link>

        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <VideoIcon className="w-6 h-6 text-emerald-500" />
            <h1 className="text-2xl font-extrabold text-white">Video Materi</h1>
          </div>
          <button
            onClick={() => { resetForm(); setShowForm(true); setForm((f) => ({ ...f, categoryId: categories[0]?.id || '' })); }}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 text-white text-sm font-semibold hover:bg-emerald-700 transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Video</span>
          </button>
        </div>

        {/* Form */}
        {showForm && (
          <div className="mb-8 p-6 rounded-2xl bg-[#141414] border border-white/10">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-bold text-white">{editingId ? 'Edit Video' : 'Tambah Video Baru'}</h2>
              <button onClick={resetForm} className="text-slate-400 hover:text-white cursor-pointer"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-1.5 uppercase tracking-wider">Kategori</label>
                  <select
                    value={form.categoryId} required
                    onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#1a1a1a] border border-white/10 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-600/40"
                  >
                    <option value="">Pilih kategori...</option>
                    {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-1.5 uppercase tracking-wider">Judul Video</label>
                  <input type="text" required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })}
                    placeholder="Fondasi & Awalan Senam Lantai"
                    className="w-full px-4 py-2.5 rounded-xl bg-[#1a1a1a] border border-white/10 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-600/40"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 mb-1.5 uppercase tracking-wider">Deskripsi</label>
                <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={2}
                  placeholder="Deskripsi singkat video..."
                  className="w-full px-4 py-2.5 rounded-xl bg-[#1a1a1a] border border-white/10 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-600/40 resize-none"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-1.5 uppercase tracking-wider">Google Drive File ID</label>
                  <input type="text" required value={form.driveFileId} onChange={(e) => setForm({ ...form, driveFileId: e.target.value })}
                    placeholder="12JG_YaH6ADE4xVqgskKQY-rx79Dht7KM"
                    className="w-full px-4 py-2.5 rounded-xl bg-[#1a1a1a] border border-white/10 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-600/40"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-1.5 uppercase tracking-wider">Google Drive Link (Share)</label>
                  <input type="text" value={form.driveLink} onChange={(e) => setForm({ ...form, driveLink: e.target.value })}
                    placeholder="https://drive.google.com/file/d/.../view"
                    className="w-full px-4 py-2.5 rounded-xl bg-[#1a1a1a] border border-white/10 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-600/40"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-1.5 uppercase tracking-wider">Thumbnail</label>
                  <input type="text" value={form.thumbnail} onChange={(e) => setForm({ ...form, thumbnail: e.target.value })}
                    placeholder="/images/..."
                    className="w-full px-4 py-2.5 rounded-xl bg-[#1a1a1a] border border-white/10 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-600/40"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-1.5 uppercase tracking-wider">Durasi</label>
                  <input type="text" value={form.duration} onChange={(e) => setForm({ ...form, duration: e.target.value })}
                    placeholder="03:45"
                    className="w-full px-4 py-2.5 rounded-xl bg-[#1a1a1a] border border-white/10 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-600/40"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-1.5 uppercase tracking-wider">Level</label>
                  <select value={form.level} onChange={(e) => setForm({ ...form, level: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#1a1a1a] border border-white/10 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-600/40"
                  >
                    <option value="Dasar">Dasar</option>
                    <option value="Menengah">Menengah</option>
                    <option value="Mahir">Mahir</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-1.5 uppercase tracking-wider">Episode #</label>
                  <input type="number" min={1} value={form.episodeNum} onChange={(e) => setForm({ ...form, episodeNum: parseInt(e.target.value) || 1 })}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#1a1a1a] border border-white/10 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-600/40"
                  />
                </div>
              </div>
              <div className="flex items-center gap-3">
                <input type="checkbox" id="isFree" checked={form.isFree} onChange={(e) => setForm({ ...form, isFree: e.target.checked })}
                  className="w-4 h-4 rounded accent-emerald-600"
                />
                <label htmlFor="isFree" className="text-sm text-slate-300 font-medium cursor-pointer">Video ini GRATIS (bisa ditonton tanpa login)</label>
              </div>
              <button type="submit" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 text-white text-sm font-bold hover:bg-emerald-700 transition-colors cursor-pointer">
                <Save className="w-4 h-4" />
                <span>{editingId ? 'Simpan Perubahan' : 'Tambah Video'}</span>
              </button>
            </form>
          </div>
        )}

        {/* Table */}
        <div className="bg-[#141414] rounded-2xl border border-white/5 overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-white/5 text-slate-400 text-xs uppercase tracking-wider font-bold">
              <tr>
                <th className="p-4">EP</th>
                <th className="p-4">Judul</th>
                <th className="p-4 hidden md:table-cell">Kategori</th>
                <th className="p-4 hidden sm:table-cell">Level</th>
                <th className="p-4 hidden sm:table-cell">Status</th>
                <th className="p-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {videos.map((v) => (
                <tr key={v.id} className="hover:bg-white/3 transition-colors">
                  <td className="p-4 font-bold text-slate-500">{v.episodeNum}</td>
                  <td className="p-4 font-semibold text-white max-w-xs truncate">{v.title}</td>
                  <td className="p-4 text-slate-400 text-xs hidden md:table-cell">{getCategoryName(v.categoryId)}</td>
                  <td className="p-4 hidden sm:table-cell">
                    <span className="px-2 py-0.5 rounded bg-white/10 text-[11px] font-semibold text-slate-300">{v.level}</span>
                  </td>
                  <td className="p-4 hidden sm:table-cell">
                    {v.isFree ? (
                      <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[11px] font-bold">GRATIS</span>
                    ) : (
                      <span className="px-2 py-0.5 rounded bg-slate-700/50 text-slate-400 text-[11px] font-bold">LOGIN</span>
                    )}
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => handleEdit(v)} className="p-2 rounded-lg hover:bg-white/10 text-slate-400 hover:text-blue-400 transition-colors cursor-pointer">
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDelete(v.id)} className="p-2 rounded-lg hover:bg-white/10 text-slate-400 hover:text-red-400 transition-colors cursor-pointer">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {videos.length === 0 && (
                <tr><td colSpan={6} className="p-8 text-center text-slate-500 text-sm">Belum ada video.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
