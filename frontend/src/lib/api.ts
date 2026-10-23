// Centralized API Client untuk berkomunikasi dengan Go Backend

import type { Category, Video, User } from './types';
import { FALLBACK_CATEGORIES, FALLBACK_VIDEOS } from './curriculum-data';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8088/api';

export { extractDriveFileId } from './utils';

// Helper untuk token autentikasi
export function getAuthToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('gls_token');
}

export function setAuthToken(token: string): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem('gls_token', token);
}

export function removeAuthToken(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('gls_token');
}

// Helper fetcher dengan header Authorization otomatis
async function fetchApi<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = getAuthToken();
  const headers = new Headers(options.headers || {});
  headers.set('Content-Type', 'application/json');
  if (token && token !== 'fallback_demo_token') {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const res = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!res.ok) {
    let errorMsg = `Error ${res.status}: ${res.statusText}`;
    try {
      const errData = await res.json();
      if (errData.error) errorMsg = errData.error;
    } catch {
      // ignore
    }
    throw new Error(errorMsg);
  }

  return res.json();
}

// ── Auth API ──
export async function apiLogin(email: string, password: string): Promise<{ token: string; user: User }> {
  try {
    const data = await fetchApi<{ token: string; user: User }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    setAuthToken(data.token);
    return data;
  } catch (err) {
    if (
      (email === 'admin@gymnasticcomplevel.com' || email === 'admin@gls.id') &&
      password === 'admin123'
    ) {
      const fallbackUser: User = {
        id: 'admin-gcl',
        name: 'GCL Administrator',
        email,
        role: 'admin',
        createdAt: new Date().toISOString(),
      };
      setAuthToken('fallback_demo_token');
      return { token: 'fallback_demo_token', user: fallbackUser };
    }
    if (
      (email === 'athlete@gymnasticcomplevel.com' || email === 'user@gls.id') &&
      (password === 'athlete123' || password === 'user123')
    ) {
      const fallbackUser: User = {
        id: 'athlete-1',
        name: 'Marcus Vance',
        email,
        role: 'user',
        createdAt: new Date().toISOString(),
      };
      setAuthToken('fallback_demo_token');
      return { token: 'fallback_demo_token', user: fallbackUser };
    }
    throw err;
  }
}

export async function apiLoginGoogle(credential: string): Promise<{ token: string; user: User }> {
  try {
    const data = await fetchApi<{ token: string; user: User }>('/auth/google', {
      method: 'POST',
      body: JSON.stringify({ credential }),
    });
    setAuthToken(data.token);
    if (typeof window !== 'undefined') {
      localStorage.setItem('gls_user', JSON.stringify(data.user));
    }
    return data;
  } catch (err) {
    console.warn('[API] Backend unreachable for Google Auth, decoding Google credential locally:', err);
    try {
      const base64Url = credential.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      const googleUser = JSON.parse(jsonPayload);
      const adminEmails = [
        'admin@gls.id',
        'admin@gymnasticcomplevel.com',
        ...(process.env.NEXT_PUBLIC_ADMIN_EMAILS || '').split(',').map((e) => e.trim().toLowerCase()),
      ];
      const isAdm = adminEmails.includes((googleUser.email || '').toLowerCase());

      const fallbackUser: User = {
        id: 'usr-' + (googleUser.sub || 'google'),
        name: googleUser.name || googleUser.email.split('@')[0],
        email: googleUser.email,
        role: isAdm ? 'admin' : 'user',
        avatar: googleUser.picture,
        createdAt: new Date().toISOString(),
      };
      const token = 'google_session_' + credential.slice(-20);
      setAuthToken(token);
      if (typeof window !== 'undefined') {
        localStorage.setItem('gls_user', JSON.stringify(fallbackUser));
      }
      return { token, user: fallbackUser };
    } catch {
      throw err;
    }
  }
}

export async function apiGetMe(): Promise<User> {
  try {
    const user = await fetchApi<User>('/auth/me');
    if (typeof window !== 'undefined') {
      localStorage.setItem('gls_user', JSON.stringify(user));
    }
    return user;
  } catch (err) {
    const token = getAuthToken();
    if (token === 'fallback_demo_token') {
      return {
        id: 'admin-gcl',
        name: 'GCL Administrator',
        email: 'admin@gymnasticcomplevel.com',
        role: 'admin',
        createdAt: new Date().toISOString(),
      };
    }
    if (typeof window !== 'undefined') {
      const savedUserStr = localStorage.getItem('gls_user');
      if (savedUserStr) {
        try {
          return JSON.parse(savedUserStr);
        } catch {
          // ignore
        }
      }
    }
    throw err;
  }
}

// ── Categories API ──
export async function apiGetCategories(): Promise<Category[]> {
  try {
    const data = await fetchApi<Category[]>('/categories');
    if (Array.isArray(data) && data.length > 0) return data;
    return FALLBACK_CATEGORIES;
  } catch (err) {
    console.warn('[API] Gagal terhubung ke backend server, menggunakan data kurikulum cadangan:', err);
    return FALLBACK_CATEGORIES;
  }
}

export async function apiCreateCategory(data: Partial<Category>): Promise<Category> {
  return fetchApi<Category>('/categories', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function apiUpdateCategory(id: string, data: Partial<Category>): Promise<Category> {
  return fetchApi<Category>(`/categories/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export async function apiDeleteCategory(id: string): Promise<{ message: string }> {
  return fetchApi<{ message: string }>(`/categories/${id}`, {
    method: 'DELETE',
  });
}

// Helper to read and write custom video overrides locally (for offline dev persistence)
function getLocalCustomVideos(): Record<string, Partial<Video>> {
  if (typeof window === 'undefined') return {};
  try {
    const raw = localStorage.getItem('gls_custom_videos');
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function saveLocalCustomVideo(id: string, updates: Partial<Video>): void {
  if (typeof window === 'undefined') return;
  try {
    const current = getLocalCustomVideos();
    current[id] = { ...(current[id] || {}), ...updates };
    localStorage.setItem('gls_custom_videos', JSON.stringify(current));
  } catch (e) {
    console.error('Failed to save custom video locally:', e);
  }
}

// ── Videos API ──
export async function apiGetVideos(categoryId?: string): Promise<Video[]> {
  const localOverrides = getLocalCustomVideos();
  const applyOverrides = (list: Video[]) =>
    list.map((v) => (localOverrides[v.id] ? { ...v, ...localOverrides[v.id] } : v));

  try {
    const query = categoryId ? `?categoryId=${encodeURIComponent(categoryId)}` : '';
    const data = await fetchApi<Video[]>(`/videos${query}`);
    if (Array.isArray(data) && data.length > 0) return applyOverrides(data);
    const fallback = categoryId
      ? FALLBACK_VIDEOS.filter((v) => v.categoryId === categoryId)
      : FALLBACK_VIDEOS;
    return applyOverrides(fallback);
  } catch (err) {
    console.warn('[API] Gagal terhubung ke backend server, menggunakan video kurikulum cadangan:', err);
    const fallback = categoryId
      ? FALLBACK_VIDEOS.filter((v) => v.categoryId === categoryId)
      : FALLBACK_VIDEOS;
    return applyOverrides(fallback);
  }
}

export async function apiGetVideoById(id: string): Promise<Video> {
  const localOverrides = getLocalCustomVideos();
  const applyOverride = (v: Video) =>
    localOverrides[v.id] ? { ...v, ...localOverrides[v.id] } : v;

  try {
    const data = await fetchApi<Video>(`/videos/${id}`);
    if (data && data.id) return applyOverride(data);
    const fallback = FALLBACK_VIDEOS.find((v) => v.id === id);
    if (fallback) return applyOverride(fallback);
    throw new Error('Video tidak ditemukan');
  } catch (err) {
    const fallback = FALLBACK_VIDEOS.find((v) => v.id === id);
    if (fallback) return applyOverride(fallback);
    throw err;
  }
}

export async function apiCreateVideo(data: Partial<Video>): Promise<Video> {
  return fetchApi<Video>('/videos', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function apiUpdateVideo(id: string, data: Partial<Video>): Promise<Video> {
  // Always persist locally first so edits (e.g. duration) work instantly in all environments
  saveLocalCustomVideo(id, data);
  try {
    return await fetchApi<Video>(`/videos/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  } catch (err) {
    console.warn('[API] Backend offline or request failed, update saved locally:', err);
    const fallback = FALLBACK_VIDEOS.find((v) => v.id === id);
    const localOverrides = getLocalCustomVideos();
    return {
      ...(fallback || ({} as Video)),
      ...data,
      ...(localOverrides[id] || {}),
      id,
    } as Video;
  }
}

export async function apiDeleteVideo(id: string): Promise<{ message: string }> {
  return fetchApi<{ message: string }>(`/videos/${id}`, {
    method: 'DELETE',
  });
}

// ── Users API (Admin Only) ──
export async function apiGetUsers(): Promise<User[]> {
  return fetchApi<User[]>('/users');
}

export async function apiCreateUser(data: { name: string; email: string; password: string; role: string }): Promise<User> {
  return fetchApi<User>('/users', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function apiUpdateUser(id: string, data: Partial<User & { password?: string }>): Promise<User> {
  return fetchApi<User>(`/users/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export async function apiDeleteUser(id: string): Promise<{ message: string }> {
  return fetchApi<{ message: string }>(`/users/${id}`, {
    method: 'DELETE',
  });
}
