'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/Navbar';
import { useAuth } from '@/lib/auth';
import { getCategories, createCategory, updateCategory, deleteCategory } from '@/lib/data';
import type { Category } from '@/lib/types';
import { ArrowLeft, Plus, Pencil, Trash2, X, Save, Layers } from 'lucide-react';

export default function AdminCategoriesPage() {
  const { isAdmin, isReady, isLoggedIn } = useAuth();
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({ name: '', description: '', thumbnail: '', order: 1 });

  useEffect(() => {
    if (isReady && (!isLoggedIn || !isAdmin)) { router.push('/login'); return; }
    setCategories(getCategories());
  }, [isReady, isLoggedIn, isAdmin, router]);

  const resetForm = () => {
    setForm({ name: '', description: '', thumbnail: '', order: categories.length + 1 });
    setEditingId(null);
    setShowForm(false);
  };

  const handleEdit = (cat: Category) => {
    setForm({ name: cat.name, description: cat.description, thumbnail: cat.thumbnail, order: cat.order });
    setEditingId(cat.id);
    setShowForm(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      updateCategory(editingId, form);
    } else {
      createCategory(form);
    }
    setCategories(getCategories());
    resetForm();
  };

  const handleDelete = (id: string) => {
    if (!confirm('Hapus kategori ini? Semua video dalam kategori ini juga akan dihapus.')) return;
    deleteCategory(id);
    setCategories(getCategories());
  };

  if (!isReady || !isAdmin) return null;

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <Navbar />
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <Link href="/admin" className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white mb-6 group">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span>Admin Panel</span>
        </Link>

        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <Layers className="w-6 h-6 text-blue-500" />
            <h1 className="text-2xl font-extrabold text-white">Kategori Pembelajaran</h1>
          </div>
          <button
            onClick={() => { resetForm(); setShowForm(true); }}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah</span>
          </button>
        </div>

        {/* Form Modal */}
        {showForm && (
          <div className="mb-8 p-6 rounded-2xl bg-[#141414] border border-white/10">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-bold text-white">
                {editingId ? 'Edit Kategori' : 'Tambah Kategori Baru'}
              </h2>
              <button onClick={resetForm} className="text-slate-400 hover:text-white cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-400 mb-1.5 uppercase tracking-wider">Nama Kategori</label>
                <input
                  type="text" required value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Floor Exercise (Senam Lantai)"
                  className="w-full px-4 py-2.5 rounded-xl bg-[#1a1a1a] border border-white/10 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-600/40"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 mb-1.5 uppercase tracking-wider">Deskripsi</label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="Deskripsi singkat tentang kategori ini..."
                  rows={3}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#1a1a1a] border border-white/10 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-600/40 resize-none"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-1.5 uppercase tracking-wider">Thumbnail (path/URL)</label>
                  <input
                    type="text" value={form.thumbnail}
                    onChange={(e) => setForm({ ...form, thumbnail: e.target.value })}
                    placeholder="/images/apparatus-floor.webp"
                    className="w-full px-4 py-2.5 rounded-xl bg-[#1a1a1a] border border-white/10 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-600/40"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-1.5 uppercase tracking-wider">Urutan</label>
                  <input
                    type="number" value={form.order} min={1}
                    onChange={(e) => setForm({ ...form, order: parseInt(e.target.value) || 1 })}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#1a1a1a] border border-white/10 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-600/40"
                  />
                </div>
              </div>
              <button
                type="submit"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-bold hover:bg-blue-700 transition-colors cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>{editingId ? 'Simpan Perubahan' : 'Tambah Kategori'}</span>
              </button>
            </form>
          </div>
        )}

        {/* Table */}
        <div className="bg-[#141414] rounded-2xl border border-white/5 overflow-hidden">
          <table className="w-full text-left text-sm">
            <thead className="bg-white/5 text-slate-400 text-xs uppercase tracking-wider font-bold">
              <tr>
                <th className="p-4">#</th>
                <th className="p-4">Nama</th>
                <th className="p-4 hidden sm:table-cell">Deskripsi</th>
                <th className="p-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {categories.map((cat) => (
                <tr key={cat.id} className="hover:bg-white/3 transition-colors">
                  <td className="p-4 font-bold text-slate-500">{cat.order}</td>
                  <td className="p-4 font-semibold text-white">{cat.name}</td>
                  <td className="p-4 text-slate-400 text-xs hidden sm:table-cell truncate max-w-xs">{cat.description}</td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => handleEdit(cat)} className="p-2 rounded-lg hover:bg-white/10 text-slate-400 hover:text-blue-400 transition-colors cursor-pointer">
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDelete(cat.id)} className="p-2 rounded-lg hover:bg-white/10 text-slate-400 hover:text-red-400 transition-colors cursor-pointer">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {categories.length === 0 && (
                <tr><td colSpan={4} className="p-8 text-center text-slate-500 text-sm">Belum ada kategori.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
