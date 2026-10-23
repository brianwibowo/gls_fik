'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useAuth } from '@/lib/auth';
import { apiGetUsers, apiCreateUser, apiUpdateUser, apiDeleteUser } from '@/lib/api';
import type { User } from '@/lib/types';
import {
  Plus,
  Pencil,
  Trash2,
  X,
  Save,
} from 'lucide-react';

function AdminUsersContent() {
  const { user: currentUser, refreshUser } = useAuth();
  const searchParams = useSearchParams();

  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [pendingUserId, setPendingUserId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({
    name: '',
    email: '',
    role: 'user' as 'user' | 'admin',
  });

  const refreshUsers = async () => {
    setIsLoading(true);
    setLoadError('');
    try {
      const data = await apiGetUsers();
      setUsers(data);
    } catch (err) {
      setLoadError(err instanceof Error ? err.message : 'Daftar akun gagal dimuat. Coba lagi.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshUsers();
    if (searchParams.get('action') === 'new') {
      setShowForm(true);
    }
  }, [searchParams]);

  const resetForm = () => {
    setForm({ name: '', email: '', role: 'user' });
    setEditingId(null);
    setShowForm(false);
    setSaveError('');
  };

  const handleEdit = (u: User) => {
    setSaveError('');
    setForm({ name: u.name, email: u.email, role: u.role });
    setEditingId(u.id);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSaving) return;
    setIsSaving(true);
    setSaveError('');
    try {
      if (editingId) {
        const updateData: Partial<User> = {
          name: form.name.trim(),
          email: form.email.trim(),
          role: form.role,
        };
        await apiUpdateUser(editingId, updateData);
        if (editingId === currentUser?.id) await refreshUser();
      } else {
        await apiCreateUser({
          name: form.name.trim(),
          email: form.email.trim(),
          role: form.role,
        });
      }
      await refreshUsers();
      resetForm();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to save user';
      setSaveError(msg);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (id === currentUser?.id) {
      alert('You cannot delete your own active account.');
      return;
    }
    if (!confirm(`Delete user account "${name}"?`)) return;
    try {
      await apiDeleteUser(id);
      await refreshUsers();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to delete user';
      alert(msg);
    }
  };

  const handleToggleRole = async (u: User) => {
    if (pendingUserId) return;
    if (u.id === currentUser?.id) {
      alert('You cannot modify your own account role.');
      return;
    }
    const newRole = u.role === 'admin' ? 'user' : 'admin';
    try {
      setPendingUserId(u.id);
      await apiUpdateUser(u.id, { role: newRole });
      await refreshUsers();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to change user role';
      alert(msg);
    } finally {
      setPendingUserId(null);
    }
  };

  return (
    <div className="p-3.5 sm:p-6 lg:p-8 max-w-5xl mx-auto w-full text-slate-900">
      {/* Top header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-5 sm:pb-6 mb-5 sm:mb-6 border-b border-slate-200 gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Users &amp; Roles
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Akun yang berhasil login otomatis tercatat sebagai user GCL. Admin dapat mengangkat user menjadi admin dari daftar ini.
          </p>
        </div>

        <div>
          {!showForm && (
            <button
              onClick={() => {
                resetForm();
                setShowForm(true);
              }}
              className="w-full sm:w-auto min-h-[44px] inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[#c1ff72] hover:bg-[#b0f555] active:scale-95 text-[#1f2a2e] font-black text-sm shadow-sm transition-all cursor-pointer border border-[#a8ed4b]"
            >
              <Plus className="w-5 h-5 stroke-[2.5]" />
              <span>Add New User</span>
            </button>
          )}
        </div>
      </div>

      {/* User form */}
      {showForm && (
        <div className="mb-6 sm:mb-8 bg-white border border-slate-200 rounded-2xl p-4 sm:p-7 shadow-sm animate-in fade-in duration-150">
          <div className="flex items-center justify-between pb-3 sm:pb-4 mb-5 border-b border-slate-200">
            <div>
              <h2 className="text-lg sm:text-xl font-black text-slate-900">
                {editingId ? 'Edit User Details' : 'Add New User'}
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                Register a Google account and assign account permissions (Admin or User).
              </p>
            </div>
            <button
              onClick={resetForm}
              className="w-10 h-10 min-w-[40px] min-h-[40px] rounded-xl bg-slate-100 border border-slate-200 text-slate-600 hover:text-slate-900 flex items-center justify-center cursor-pointer active:scale-95 transition-all"
              aria-label="Close form"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
            {saveError && <p role="alert" className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-800">{saveError}</p>}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4">
              <div>
                <label className="block text-xs sm:text-sm font-bold text-slate-900 mb-1.5">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Nama lengkap akun Google"
                  className="w-full min-h-[42px] px-4 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-900 text-base sm:text-sm focus:outline-none focus:border-slate-800 focus:ring-1 focus:ring-slate-800 transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-bold text-slate-900 mb-1.5">
                  Email Address (Google Account) *
                </label>
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="Alamat email akun Google"
                  className="w-full min-h-[42px] px-4 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-900 text-base sm:text-sm focus:outline-none focus:border-slate-800 focus:ring-1 focus:ring-slate-800 transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-bold text-slate-900 mb-1.5">
                Account Role *
              </label>
              <select
                value={form.role}
                onChange={(e) => setForm({ ...form, role: e.target.value as 'user' | 'admin' })}
                className="w-full min-h-[42px] px-4 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-900 text-base sm:text-sm font-medium focus:outline-none focus:border-slate-800 focus:ring-1 focus:ring-slate-800 transition-colors cursor-pointer"
              >
                <option value="user">Standard User (Athlete / Coach - Video Access)</option>
                <option value="admin">Administrator (Can Add, Edit &amp; Delete Content)</option>
              </select>
              <p className="text-xs text-slate-500 mt-1.5">
                Centralized Google OAuth authentication. Users sign in with their Google account without a separate password.
              </p>
            </div>

            <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-2.5 sm:gap-3 pt-3 sm:pt-4 border-t border-slate-200">
              <button
                type="button"
                onClick={resetForm}
                className="min-h-[44px] px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-sm cursor-pointer border border-slate-200 flex items-center justify-center active:scale-95 transition-all"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSaving}
                className="min-h-[44px] inline-flex items-center justify-center gap-2 px-7 py-2.5 rounded-xl bg-[#c1ff72] hover:bg-[#b0f555] active:scale-95 text-[#1f2a2e] font-black text-sm sm:text-base shadow-sm cursor-pointer border border-[#a8ed4b] transition-all disabled:opacity-60 disabled:cursor-wait"
              >
                <Save className="w-5 h-5" />
                <span>{isSaving ? 'Menyimpan…' : 'Save User'}</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* User table list */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
        <div className="p-3.5 sm:p-5 border-b border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-1 sm:gap-4">
          <h3 className="text-sm sm:text-base font-bold text-slate-900">
            Registered Users ({users.length})
          </h3>
          <span className="text-xs text-slate-500 font-medium">
            Admin: {users.filter((u) => u.role === 'admin').length} &bull; User: {users.filter((u) => u.role === 'user').length}
          </span>
        </div>

        <div className="divide-y divide-slate-100">
          {isLoading && <p role="status" className="p-5 text-sm text-slate-600">Memuat akun terdaftar…</p>}
          {loadError && <div role="alert" className="p-5 text-sm text-red-800"><p>{loadError}</p><button type="button" onClick={refreshUsers} className="mt-2 min-h-11 rounded-lg bg-red-800 px-4 py-2 font-bold text-white">Coba lagi</button></div>}
          {!isLoading && !loadError && users.length === 0 && <p className="p-5 text-sm text-slate-600">Belum ada akun terdaftar. Akun akan tercatat setelah login Google berhasil.</p>}
          {users.map((u) => {
            const isMe = u.id === currentUser?.id;
            const isAdminRole = u.role === 'admin';

            return (
              <div
                key={u.id}
                className="p-3.5 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 hover:bg-slate-50/80 transition-colors"
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  {u.avatar ? (
                    <img
                      src={u.avatar}
                      alt={u.name}
                      referrerPolicy="no-referrer"
                      className="w-10 h-10 rounded-xl object-cover shrink-0 border border-slate-200"
                    />
                  ) : (
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-sm shrink-0 ${
                        isAdminRole
                          ? 'bg-[#c1ff72] text-[#1f2a2e] border border-[#a8ed4b]'
                          : 'bg-slate-100 text-slate-700 border border-slate-200'
                      }`}
                    >
                      {u.name.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 text-sm sm:text-base truncate">{u.name}</span>
                      {isMe && (
                        <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-bold border border-emerald-200 shrink-0">
                          Your Account
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5 truncate">{u.email}</p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-between sm:justify-end gap-2 w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                  <button
                    onClick={() => handleToggleRole(u)}
                    disabled={isMe || pendingUserId !== null}
                    title={isMe ? 'Cannot modify your own account' : isAdminRole ? 'Ubah menjadi user' : 'Angkat menjadi admin'}
                    className={`min-h-[44px] px-3.5 py-1.5 rounded-xl text-xs font-bold border transition-colors cursor-pointer disabled:cursor-not-allowed active:scale-95 ${
                      isAdminRole
                        ? 'bg-[#c1ff72]/25 text-[#213506] border-[#a8ed4b] hover:bg-[#c1ff72]/40'
                        : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'
                    }`}
                  >
                    {pendingUserId === u.id ? 'Menyimpan…' : isAdminRole ? 'Admin · ubah ke user' : 'User · angkat jadi admin'}
                  </button>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => handleEdit(u)}
                      className="w-10 h-10 min-w-[38px] min-h-[38px] rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 transition-colors cursor-pointer flex items-center justify-center active:scale-95"
                      title="Edit User"
                      aria-label={`Edit ${u.name}`}
                    >
                      <Pencil className="w-4 h-4" />
                    </button>

                    {!isMe && (
                      <button
                        onClick={() => handleDelete(u.id, u.name)}
                        className="w-10 h-10 min-w-[38px] min-h-[38px] rounded-xl bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 transition-colors cursor-pointer flex items-center justify-center active:scale-95"
                        title="Delete User"
                        aria-label={`Delete ${u.name}`}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default function AdminUsersPage() {
  return (
    <Suspense fallback={<div className="p-8 text-slate-800">Loading user data...</div>}>
      <AdminUsersContent />
    </Suspense>
  );
}
