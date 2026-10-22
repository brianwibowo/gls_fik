// Centralized API Client for Gymnastics Competition Level (GCL)

import type { Category, Video, User, Technique, ProgressTrackerResponse, TechniqueEvaluation, UserProfile } from './types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';

export { extractDriveFileId } from './utils';

// Helper for auth token in localStorage
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

// Internal fetcher with automatic Authorization header
async function fetchApi<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = getAuthToken();
  const headers = new Headers(options.headers || {});
  headers.set('Content-Type', 'application/json');
  if (token) {
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
  const data = await fetchApi<{ token: string; user: User }>('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
  setAuthToken(data.token);
  return data;
}

export async function apiGetMe(): Promise<User> {
  return fetchApi<User>('/auth/me');
}

export async function apiUpdateMyProfile(data: { name?: string; bio?: string; avatar?: string }): Promise<User> {
  return fetchApi<User>('/auth/profile', {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

// ── Categories API ──
export async function apiGetCategories(): Promise<Category[]> {
  return fetchApi<Category[]>('/categories');
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

// ── Videos API ──
export async function apiGetVideos(categoryId?: string): Promise<Video[]> {
  const query = categoryId ? `?categoryId=${encodeURIComponent(categoryId)}` : '';
  return fetchApi<Video[]>(`/videos${query}`);
}

export async function apiGetVideoById(id: string): Promise<Video> {
  return fetchApi<Video>(`/videos/${id}`);
}

export async function apiCreateVideo(data: Partial<Video>): Promise<Video> {
  return fetchApi<Video>('/videos', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function apiUpdateVideo(id: string, data: Partial<Video>): Promise<Video> {
  return fetchApi<Video>(`/videos/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export async function apiDeleteVideo(id: string): Promise<{ message: string }> {
  return fetchApi<{ message: string }>(`/videos/${id}`, {
    method: 'DELETE',
  });
}

// ── Techniques & Checklist Tracker API ──
export async function apiGetTechniques(categoryId?: string, level?: number): Promise<Technique[]> {
  const params = new URLSearchParams();
  if (categoryId) params.append('categoryId', categoryId);
  if (level) params.append('level', level.toString());
  const queryString = params.toString() ? `?${params.toString()}` : '';
  return fetchApi<Technique[]>(`/techniques${queryString}`);
}

export async function apiGetTracker(athleteId?: string, categoryId?: string, level?: number): Promise<ProgressTrackerResponse> {
  const params = new URLSearchParams();
  if (athleteId) params.append('athleteId', athleteId);
  if (categoryId) params.append('categoryId', categoryId);
  if (level) params.append('level', level.toString());
  const queryString = params.toString() ? `?${params.toString()}` : '';
  return fetchApi<ProgressTrackerResponse>(`/tracker${queryString}`);
}

export async function apiToggleProgress(techniqueId: string, isCompleted: boolean, athleteId?: string): Promise<any> {
  return fetchApi<any>('/tracker/toggle', {
    method: 'POST',
    body: JSON.stringify({
      techniqueId,
      isCompleted,
      athleteId,
    }),
  });
}

export async function apiSaveEvaluation(data: {
  athleteId: string;
  techniqueId: string;
  notes: string;
  score?: string;
}): Promise<TechniqueEvaluation> {
  return fetchApi<TechniqueEvaluation>('/tracker/evaluations', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

// ── Profiles API ──
export async function apiGetProfiles(): Promise<UserProfile[]> {
  return fetchApi<UserProfile[]>('/profiles');
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
