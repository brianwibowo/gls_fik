import type { Category, Video, User, LearningTrackerData, LearningItem, LearningStatus, VideoPlayback } from './types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8088/api';

export { extractDriveFileId } from './utils';

export class ApiError extends Error {
  constructor(message: string, public readonly status: number) {
    super(message);
    this.name = 'ApiError';
  }
}

export function getAuthToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('gls_token');
}

export function setAuthToken(token: string): void {
  if (typeof window !== 'undefined') localStorage.setItem('gls_token', token);
}

export function removeAuthToken(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('gls_token');
  localStorage.removeItem('gls_user');
}

async function fetchApi<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = getAuthToken();
  const headers = new Headers(options.headers);
  if (options.body) headers.set('Content-Type', 'application/json');
  if (token) headers.set('Authorization', `Bearer ${token}`);

  let response: Response;
  try {
    response = await fetch(`${API_BASE_URL}${endpoint}`, { ...options, headers, cache: 'no-store' });
  } catch {
    throw new ApiError('Server GCL belum dapat dihubungi. Periksa koneksi lalu coba lagi.', 0);
  }

  if (!response.ok) {
    let message = `Permintaan gagal (${response.status}). Silakan coba lagi.`;
    try {
      const body = await response.json();
      if (typeof body.error === 'string') message = body.error;
    } catch {
      // A proxy can return a non-JSON error page.
    }
    if (response.status === 401 && token && getAuthToken() === token && !endpoint.startsWith('/auth/login') && !endpoint.startsWith('/auth/google')) {
      window.dispatchEvent(new Event('gcl:unauthorized'));
    }
    throw new ApiError(message, response.status);
  }

  return response.json() as Promise<T>;
}

function validateAuthenticatedSession(session: { token: string; user: User }) {
  if (!session.token || !session.user?.id) throw new ApiError('Server tidak mengembalikan sesi yang valid.', 502);
  return session;
}

export async function apiLogin(email: string, password: string): Promise<{ token: string; user: User }> {
  return validateAuthenticatedSession(await fetchApi('/auth/login', {
    method: 'POST', body: JSON.stringify({ email, password }),
  }));
}

export async function apiLoginGoogle(credential: string): Promise<{ token: string; user: User }> {
  return validateAuthenticatedSession(await fetchApi('/auth/google', {
    method: 'POST', body: JSON.stringify({ credential }),
  }));
}

export function apiGetMe(): Promise<User> {
  return fetchApi('/auth/me');
}

export function apiGetCategories(): Promise<Category[]> {
  return fetchApi('/categories');
}

export function apiCreateCategory(data: Partial<Category>): Promise<Category> {
  return fetchApi('/categories', { method: 'POST', body: JSON.stringify(data) });
}

export function apiUpdateCategory(id: string, data: Partial<Category>): Promise<Category> {
  return fetchApi(`/categories/${encodeURIComponent(id)}`, { method: 'PUT', body: JSON.stringify(data) });
}

export function apiDeleteCategory(id: string): Promise<{ message: string }> {
  return fetchApi(`/categories/${encodeURIComponent(id)}`, { method: 'DELETE' });
}

export function apiGetVideos(categoryId?: string): Promise<Video[]> {
  const query = categoryId ? `?categoryId=${encodeURIComponent(categoryId)}` : '';
  return fetchApi(`/videos${query}`);
}

export function apiGetVideoById(id: string): Promise<Video> {
  return fetchApi(`/videos/${encodeURIComponent(id)}`);
}

export function apiGetVideoPlayback(id: string): Promise<VideoPlayback> {
  return fetchApi(`/videos/${encodeURIComponent(id)}/playback`);
}

export function apiCreateVideo(data: Partial<Video>): Promise<Video> {
  return fetchApi('/videos', { method: 'POST', body: JSON.stringify(data) });
}

export function apiUpdateVideo(id: string, data: Partial<Video>): Promise<Video> {
  return fetchApi(`/videos/${encodeURIComponent(id)}`, { method: 'PUT', body: JSON.stringify(data) });
}

export function apiDeleteVideo(id: string): Promise<{ message: string }> {
  return fetchApi(`/videos/${encodeURIComponent(id)}`, { method: 'DELETE' });
}

export function apiGetLearningTracker(videoId: string): Promise<LearningTrackerData> {
  return fetchApi(`/videos/${encodeURIComponent(videoId)}/tracker`);
}

export function apiUpdateLearningItem(videoId: string, itemId: string, data: { status: LearningStatus; note: string }): Promise<LearningItem> {
  return fetchApi(`/videos/${encodeURIComponent(videoId)}/tracker/items/${encodeURIComponent(itemId)}`, {
    method: 'PUT', body: JSON.stringify(data),
  });
}

export function apiUpdateLearningNote(videoId: string, note: string): Promise<{ note: string }> {
  return fetchApi(`/videos/${encodeURIComponent(videoId)}/tracker/note`, {
    method: 'PUT', body: JSON.stringify({ note }),
  });
}

export function apiGetUsers(): Promise<User[]> {
  return fetchApi('/users');
}

export function apiCreateUser(data: { name: string; email: string; password?: string; role: string }): Promise<User> {
  return fetchApi('/users', { method: 'POST', body: JSON.stringify(data) });
}

export function apiUpdateUser(id: string, data: Partial<User>): Promise<User> {
  return fetchApi(`/users/${encodeURIComponent(id)}`, { method: 'PUT', body: JSON.stringify(data) });
}

export function apiDeleteUser(id: string): Promise<{ message: string }> {
  return fetchApi(`/users/${encodeURIComponent(id)}`, { method: 'DELETE' });
}
