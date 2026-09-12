'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/Navbar';
import { useAuth } from '@/lib/auth';
import { getUsers, createUser, updateUser, deleteUser } from '@/lib/data';
import type { User } from '@/lib/types';
import { ArrowLeft, Plus, Pencil, Trash2, X, Save, Users, ShieldCheck, UserCircle } from 'lucide-react';

export default function AdminUsersPage() {
  const { isAdmin, isReady, isLoggedIn, user: currentUser } = useAuth();
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'user' as 'user' | 'admin' });

  useEffect(() => {
    if (isReady && (!isLoggedIn || !isAdmin)) { router.push('/login'); return; }
    setUsers(getUsers());
  }, [isReady, isLoggedIn, isAdmin, router]);

  const resetForm = () => {
    setForm({ name: '', email: '', password: '', role: 'user' });
    setEditingId(null);
    setShowForm(false);
  };

  const handleEdit = (u: User) => {
    setForm({ name: u.name, email: u.email, password: '', role: u.role });
    setEditingId(u.id);
    setShowForm(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      const updateData: Partial<Omit<User, 'id' | 'createdAt'>> = {
        name: form.name,
        email: form.email,
        role: form.role,
      };
      if (form.password) updateData.password = form.password;
      updateUser(editingId, updateData);
    } else {
      createUser(form);
    }
    setUsers(getUsers());
    resetForm();
  };

  const handleDelete = (id: string) => {
    if (id === currentUser?.id) { alert('Tidak bisa menghapus akun sendiri.'); return; }
    if (!confirm('Hapus user ini?')) return;
    deleteUser(id);
    setUsers(getUsers());
  };

  const handleToggleRole = (u: User) => {
    if (u.id === currentUser?.id) { alert('Tidak bisa mengubah role sendiri.'); return; }
    updateUser(u.id, { role: u.role === 'admin' ? 'user' : 'admin' });
    setUsers(getUsers());
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
            <Users className="w-6 h-6 text-amber-500" />
            <h1 className="text-2xl font-extrabold text-white">Manajemen Pengguna</h1>
          </div>
          <button
            onClick={() => { resetForm(); setShowForm(true); }}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-600 text-white text-sm font-semibold hover:bg-amber-700 transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah User</span>
          </button>
        </div>

        {/* Form */}
        {showForm && (
          <div className="mb-8 p-6 rounded-2xl bg-[#141414] border border-white/10">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-bold text-white">{editingId ? 'Edit User' : 'Tambah User Baru'}</h2>
              <button onClick={resetForm} className="text-slate-400 hover:text-white cursor-pointer"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-1.5 uppercase tracking-wider">Nama</label>
                  <input type="text" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="Alisha Rahma"
                    className="w-full px-4 py-2.5 rounded-xl bg-[#1a1a1a] border border-white/10 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-600/40"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-1.5 uppercase tracking-wider">Email</label>
                  <input type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="user@gls.id"
                    className="w-full px-4 py-2.5 rounded-xl bg-[#1a1a1a] border border-white/10 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-600/40"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-1.5 uppercase tracking-wider">
                    Kata Sandi {editingId && <span className="text-slate-600 normal-case">(kosongkan jika tidak diubah)</span>}
                  </label>
                  <input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })}
                    placeholder={editingId ? '••••••••' : 'Buat kata sandi'}
                    required={!editingId}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#1a1a1a] border border-white/10 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-600/40"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-1.5 uppercase tracking-wider">Role</label>
                  <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value as 'user' | 'admin' })}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#1a1a1a] border border-white/10 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-600/40"
                  >
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
              </div>
              <button type="submit" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-600 text-white text-sm font-bold hover:bg-amber-700 transition-colors cursor-pointer">
                <Save className="w-4 h-4" />
                <span>{editingId ? 'Simpan Perubahan' : 'Tambah User'}</span>
              </button>
            </form>
          </div>
        )}

        {/* Table */}
        <div className="bg-[#141414] rounded-2xl border border-white/5 overflow-hidden">
          <table className="w-full text-left text-sm">
            <thead className="bg-white/5 text-slate-400 text-xs uppercase tracking-wider font-bold">
              <tr>
                <th className="p-4">Nama</th>
                <th className="p-4 hidden sm:table-cell">Email</th>
                <th className="p-4">Role</th>
                <th className="p-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {users.map((u) => (
                <tr key={u.id} className="hover:bg-white/3 transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-700 to-indigo-500 flex items-center justify-center text-white text-xs font-bold border border-white/10">
                        {u.name.charAt(0)}
                      </div>
                      <span className="font-semibold text-white">{u.name}</span>
                    </div>
                  </td>
                  <td className="p-4 text-slate-400 text-xs hidden sm:table-cell">{u.email}</td>
                  <td className="p-4">
                    <button
                      onClick={() => handleToggleRole(u)}
                      className="cursor-pointer"
                      title={u.id === currentUser?.id ? 'Tidak bisa mengubah role sendiri' : 'Klik untuk toggle role'}
                    >
                      {u.role === 'admin' ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-blue-500/15 text-blue-300 text-[11px] font-bold border border-blue-500/25">
                          <ShieldCheck className="w-3 h-3" /> Admin
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-700/40 text-slate-400 text-[11px] font-bold border border-white/5">
                          <UserCircle className="w-3 h-3" /> User
                        </span>
                      )}
                    </button>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => handleEdit(u)} className="p-2 rounded-lg hover:bg-white/10 text-slate-400 hover:text-blue-400 transition-colors cursor-pointer">
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDelete(u.id)} className="p-2 rounded-lg hover:bg-white/10 text-slate-400 hover:text-red-400 transition-colors cursor-pointer"
                        disabled={u.id === currentUser?.id}
                      >
                        <Trash2 className={`w-4 h-4 ${u.id === currentUser?.id ? 'opacity-20' : ''}`} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
