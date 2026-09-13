'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Navbar } from '@/components/Navbar';
import { useAuth } from '@/lib/auth';
import { getUsers, createUser, updateUser, deleteUser } from '@/lib/data';
import type { User } from '@/lib/types';
import {
  ArrowLeft,
  Plus,
  Pencil,
  Trash2,
  X,
  Save,
  Users,
  ShieldCheck,
  UserCheck,
} from 'lucide-react';

function AdminUsersContent() {
  const { isAdmin, isReady, isLoggedIn, user: currentUser } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [users, setUsers] = useState<User[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    role: 'user' as 'user' | 'admin',
  });

  useEffect(() => {
    if (isReady && (!isLoggedIn || !isAdmin)) {
      router.push('/login');
      return;
    }
    setUsers(getUsers());

    if (searchParams.get('action') === 'new') {
      setShowForm(true);
    }
  }, [isReady, isLoggedIn, isAdmin, router, searchParams]);

  const resetForm = () => {
    setForm({ name: '', email: '', password: '', role: 'user' });
    setEditingId(null);
    setShowForm(false);
  };

  const handleEdit = (u: User) => {
    setForm({ name: u.name, email: u.email, password: '', role: u.role });
    setEditingId(u.id);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      const updateData: Partial<Omit<User, 'id' | 'createdAt'>> = {
        name: form.name.trim(),
        email: form.email.trim(),
        role: form.role,
      };
      if (form.password.trim()) updateData.password = form.password.trim();
      updateUser(editingId, updateData);
    } else {
      if (!form.password.trim()) {
        alert('Mohon masukkan kata sandi untuk akun baru.');
        return;
      }
      createUser({
        name: form.name.trim(),
        email: form.email.trim(),
        password: form.password.trim(),
        role: form.role,
      });
    }
    setUsers(getUsers());
    resetForm();
  };

  const handleDelete = (id: string, name: string) => {
    if (id === currentUser?.id) {
      alert('Anda tidak dapat menghapus akun Anda sendiri yang sedang aktif.');
      return;
    }
    if (!confirm(`Hapus akun pengguna "${name}"?`)) return;
    deleteUser(id);
    setUsers(getUsers());
  };

  const handleToggleRole = (u: User) => {
    if (u.id === currentUser?.id) {
      alert('Anda tidak dapat mengubah hak akses akun Anda sendiri.');
      return;
    }
    const newRole = u.role === 'admin' ? 'user' : 'admin';
    updateUser(u.id, { role: newRole });
    setUsers(getUsers());
  };

  if (!isReady || !isAdmin) return null;

  return (
    <div className="min-h-screen bg-[#0f172a] text-white">
      <Navbar />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tombol Kembali */}
        <Link
          href="/admin"
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-300 hover:text-white mb-6 group transition-colors"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span>Kembali ke Menu Utama Admin</span>
        </Link>

        {/* Header */}
        <div className="bg-[#1e293b] border border-[#334155] rounded-2xl p-6 mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-600 flex items-center justify-center text-white shrink-0 shadow-md">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-white">Kelola Data Pengguna</h1>
              <p className="text-xs sm:text-sm text-slate-300 mt-0.5">
                Daftar akun pelatih, atlet, dan pengelola web GLS.
              </p>
            </div>
          </div>

          {!showForm && (
            <button
              onClick={() => {
                resetForm();
                setShowForm(true);
              }}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md transition-colors cursor-pointer shrink-0"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>+ Tambah Pengguna Baru</span>
            </button>
          )}
        </div>

        {/* ── FORM TAMBAH / EDIT USER ── */}
        {showForm && (
          <div className="mb-8 bg-[#1e293b] border-2 border-emerald-500/80 rounded-2xl p-6 sm:p-8 shadow-xl">
            <div className="flex items-center justify-between pb-4 mb-6 border-b border-[#334155]">
              <div>
                <h2 className="text-xl font-black text-white">
                  {editingId ? '✏️ Ubah Data Pengguna' : '👤 Tambah Pengguna Baru'}
                </h2>
                <p className="text-xs sm:text-sm text-slate-300 mt-0.5">
                  Lengkapi nama, email, dan kata sandi untuk akun pengguna.
                </p>
              </div>
              <button
                onClick={resetForm}
                className="p-2 rounded-xl bg-[#0f172a] border border-[#334155] text-slate-300 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-white mb-1.5">
                    Nama Lengkap *
                  </label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="Contoh: Budi Santoso"
                    className="w-full px-4 py-3 rounded-xl bg-[#0f172a] border border-[#475569] text-white text-sm focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-white mb-1.5">
                    Alamat Email *
                  </label>
                  <input
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="Contoh: pelatih@gls.id"
                    className="w-full px-4 py-3 rounded-xl bg-[#0f172a] border border-[#475569] text-white text-sm focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-white mb-1.5">
                    Kata Sandi {editingId ? '(Kosongkan bila tidak diubah)' : '*'}
                  </label>
                  <input
                    type="password"
                    required={!editingId}
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    placeholder={editingId ? '••••••••' : 'Minimal 6 karakter'}
                    className="w-full px-4 py-3 rounded-xl bg-[#0f172a] border border-[#475569] text-white text-sm focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-white mb-1.5">
                    Peran / Hak Akses
                  </label>
                  <select
                    value={form.role}
                    onChange={(e) => setForm({ ...form, role: e.target.value as 'user' | 'admin' })}
                    className="w-full px-4 py-3 rounded-xl bg-[#0f172a] border border-[#475569] text-white text-sm font-medium focus:outline-none focus:border-emerald-500"
                  >
                    <option value="user">User Biasa (Hanya Nonton Video)</option>
                    <option value="admin">Admin / Pengelola (Bisa Tambah & Hapus Video)</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#334155]">
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-5 py-3 rounded-xl bg-[#334155] hover:bg-[#475569] text-slate-200 font-semibold text-sm cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 px-7 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-base shadow-lg cursor-pointer"
                >
                  <Save className="w-5 h-5" />
                  <span>Simpan Pengguna</span>
                </button>
              </div>
            </form>
          </div>
        )}

        {/* ── DAFTAR TABEL PENGGUNA ── */}
        <div className="bg-[#1e293b] border border-[#334155] rounded-2xl overflow-hidden shadow-md">
          <div className="p-4 sm:p-5 border-b border-[#334155] flex items-center justify-between">
            <h3 className="text-base font-bold text-white">
              Daftar Semua Pengguna ({users.length})
            </h3>
            <span className="text-xs text-slate-400">
              Admin: {users.filter((u) => u.role === 'admin').length} | User: {users.filter((u) => u.role === 'user').length}
            </span>
          </div>

          <div className="divide-y divide-[#334155]">
            {users.map((u) => {
              const isMe = u.id === currentUser?.id;
              const isAdminRole = u.role === 'admin';

              return (
                <div
                  key={u.id}
                  className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-[#24334a] transition-colors"
                >
                  <div className="flex items-center gap-3.5">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm text-white shrink-0 ${
                        isAdminRole ? 'bg-blue-600' : 'bg-slate-700'
                      }`}
                    >
                      {u.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white text-base">{u.name}</span>
                        {isMe && (
                          <span className="px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 text-[10px] font-bold border border-blue-500/30">
                            Akun Anda
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-400 mt-0.5">{u.email}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2.5 self-end sm:self-center">
                    {/* Badge / Tombol Peran */}
                    <button
                      onClick={() => handleToggleRole(u)}
                      disabled={isMe}
                      title={isMe ? 'Tidak bisa mengubah akun sendiri' : 'Klik untuk ganti peran'}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-colors cursor-pointer disabled:cursor-not-allowed ${
                        isAdminRole
                          ? 'bg-blue-900/60 text-blue-200 border-blue-700 hover:bg-blue-800'
                          : 'bg-[#334155] text-slate-300 border-[#475569] hover:bg-[#475569]'
                      }`}
                    >
                      {isAdminRole ? '🛡️ Admin Pengelola' : '👤 User Biasa'}
                    </button>

                    {/* Edit */}
                    <button
                      onClick={() => handleEdit(u)}
                      className="p-2 rounded-lg bg-[#334155] hover:bg-[#475569] text-slate-200 hover:text-white border border-[#475569] transition-colors cursor-pointer"
                      title="Ubah Data"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>

                    {/* Hapus */}
                    {!isMe && (
                      <button
                        onClick={() => handleDelete(u.id, u.name)}
                        className="p-2 rounded-lg bg-red-950/40 hover:bg-red-600 text-red-400 hover:text-white border border-red-800/50 transition-colors cursor-pointer"
                        title="Hapus Akun"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
}

export default function AdminUsersPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#0f172a]" />}>
      <AdminUsersContent />
    </Suspense>
  );
}
