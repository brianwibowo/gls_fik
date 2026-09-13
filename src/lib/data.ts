// ============================================================
// GLS Data Layer — localStorage CRUD operations
// Swap this file's implementation to fetch() when Go API ready.
// ============================================================

import type { User, Category, Video } from './types';

// ── Storage Keys ──────────────────────────────────────────────
const KEYS = {
  users: 'gls_users',
  categories: 'gls_categories',
  videos: 'gls_videos',
  initialized: 'gls_data_initialized',
} as const;

// ── Seed Data ─────────────────────────────────────────────────
const SEED_USERS: User[] = [
  {
    id: 'admin-1',
    name: 'Admin GLS',
    email: 'admin@gls.id',
    password: 'admin123',
    role: 'admin',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'user-1',
    name: 'Alisha Rahma',
    email: 'alisha@gls.id',
    password: 'user123',
    role: 'user',
    createdAt: new Date().toISOString(),
  },
];

const SEED_CATEGORIES: Category[] = [
  {
    id: 'cat-fx',
    name: 'Floor Exercise (Senam Lantai)',
    description: 'Rangkaian gerakan akrobatik, putaran, dan kelenturan di atas matras pegas berukuran 12x12 meter.',
    thumbnail: '/images/apparatus-floor.webp',
    order: 1,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'cat-beam',
    name: 'Balance Beam (Balok Keseimbangan)',
    description: 'Gerakan artistik dan akrobatik presisi di atas balok setinggi 125 cm dengan lebar hanya 10 cm.',
    thumbnail: '/images/apparatus-beam.webp',
    order: 2,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'cat-vault',
    name: 'Vault (Meja Lompat)',
    description: 'Lompatan eksplosif melintasi meja lompat dengan fase lari cepat, tolakan pegas, dan pendaratan stabil.',
    thumbnail: '/images/apparatus-vault.webp',
    order: 3,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'cat-bars',
    name: 'Uneven Bars (Palang Bertingkat)',
    description: 'Transisi dinamis antara dua palang berketinggian beda, perpindahan pegangan, dan salto pendaratan.',
    thumbnail: '/images/apparatus-bars.webp',
    order: 4,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'cat-rings',
    name: 'Still Rings (Gelang-Gelang)',
    description: 'Ujian kekuatan statis dan ayunan dinamis pada dua gelang kabel tanpa getaran tali.',
    thumbnail: '/images/apparatus-rings.webp',
    order: 5,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'cat-pommel',
    name: 'Pommel Horse (Kuda-Kuda Pelana)',
    description: 'Rangkaian putaran melingkar satu dan dua kaki secara kontinyu di atas bodi kuda berpelana.',
    thumbnail: '/images/apparatus-pommel.webp',
    order: 6,
    createdAt: new Date().toISOString(),
  },
];

const SEED_VIDEOS: Video[] = [
  {
    id: 'vid-fx-1',
    categoryId: 'cat-fx',
    title: 'Fondasi, Postur & Awalan Senam Lantai',
    description:
      'Langkah pertama atlet dalam menguasai senam lantai. Mempelajari koreksi postur tubuh lurus, tumpuan ujung kaki (toe point), ayunan lengan ritmis, serta konsentrasi sebelum melakukan rangkaian lari.',
    driveFileId: '12JG_YaH6ADE4xVqgskKQY-rx79Dht7KM',
    driveLink: 'https://drive.google.com/file/d/12JG_YaH6ADE4xVqgskKQY-rx79Dht7KM/view?usp=share_link',
    thumbnail: '/images/apparatus-floor.webp',
    duration: '03:45',
    level: 'Dasar',
    episodeNum: 1,
    isFree: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'vid-fx-2',
    categoryId: 'cat-fx',
    title: 'Rangkaian Eksekusi & Dinamika Gerak FX',
    description:
      'Memasuki inti gerakan akrobatik senam lantai. Pembahasan mendalam mengenai tolakan tangan ke matras, transisi rotasi poros tubuh di udara, serta menjaga ritme kecepatan.',
    driveFileId: '10pPKxlH8e6GKSI79bTbiCQ7d_YQP3xkD',
    driveLink: 'https://drive.google.com/file/d/10pPKxlH8e6GKSI79bTbiCQ7d_YQP3xkD/view?usp=share_link',
    thumbnail: '/images/hero-gymnast.webp',
    duration: '04:12',
    level: 'Menengah',
    episodeNum: 2,
    isFree: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'vid-fx-3',
    categoryId: 'cat-fx',
    title: 'Koreksi Pendaratan (Stick Landing) & Evaluasi',
    description:
      'Fase krusial penentu poin tertinggi senam. Teknik peredaman hentakan lutut saat mendarat di matras tanpa langkah tambahan, keseimbangan lengan V, dan salam penutup artistik.',
    driveFileId: '1saHh0xfJRT3tuIKyByGCbAzsMnoa2HXI',
    driveLink: 'https://drive.google.com/file/d/1saHh0xfJRT3tuIKyByGCbAzsMnoa2HXI/view?usp=share_link',
    thumbnail: '/images/feature-progress.webp',
    duration: '05:08',
    level: 'Mahir',
    episodeNum: 3,
    isFree: false,
    createdAt: new Date().toISOString(),
  },
];

// ── Helpers ───────────────────────────────────────────────────
function getStore<T>(key: string): T[] {
  if (typeof window === 'undefined') return [];
  const raw = localStorage.getItem(key);
  if (!raw) return [];
  try {
    return JSON.parse(raw) as T[];
  } catch {
    return [];
  }
}

function setStore<T>(key: string, data: T[]): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(key, JSON.stringify(data));
}

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

// ── Initialization (seed on first visit) ──────────────────────
export function initializeData(): void {
  if (typeof window === 'undefined') return;
  if (!localStorage.getItem(KEYS.initialized)) {
    setStore(KEYS.users, SEED_USERS);
    setStore(KEYS.categories, SEED_CATEGORIES);
    setStore(KEYS.videos, SEED_VIDEOS);
    localStorage.setItem(KEYS.initialized, 'v2');
    return;
  }

  // Ensure all 6 apparatus categories are present even if seeded previously
  const existingCats = getStore<Category>(KEYS.categories);
  if (existingCats.length < SEED_CATEGORIES.length) {
    const existingIds = new Set(existingCats.map((c) => c.id));
    const missing = SEED_CATEGORIES.filter((c) => !existingIds.has(c.id));
    if (missing.length > 0) {
      setStore(KEYS.categories, [...existingCats, ...missing]);
    }
  }
}

// ── Users CRUD ────────────────────────────────────────────────
export function getUsers(): User[] {
  return getStore<User>(KEYS.users);
}

export function getUserById(id: string): User | undefined {
  return getUsers().find((u) => u.id === id);
}

export function getUserByEmail(email: string): User | undefined {
  return getUsers().find((u) => u.email === email);
}

export function createUser(data: Omit<User, 'id' | 'createdAt'>): User {
  const users = getUsers();
  const newUser: User = { ...data, id: generateId(), createdAt: new Date().toISOString() };
  users.push(newUser);
  setStore(KEYS.users, users);
  return newUser;
}

export function updateUser(id: string, data: Partial<Omit<User, 'id' | 'createdAt'>>): User | undefined {
  const users = getUsers();
  const idx = users.findIndex((u) => u.id === id);
  if (idx === -1) return undefined;
  users[idx] = { ...users[idx], ...data };
  setStore(KEYS.users, users);
  return users[idx];
}

export function deleteUser(id: string): boolean {
  const users = getUsers();
  const filtered = users.filter((u) => u.id !== id);
  if (filtered.length === users.length) return false;
  setStore(KEYS.users, filtered);
  return true;
}

// ── Drive link extractor (friendly for non-tech users) ───────
export function extractDriveFileId(input: string): string {
  if (!input) return '';
  const trimmed = input.trim();
  if (!trimmed.includes('/') && !trimmed.includes('http')) {
    return trimmed;
  }
  const fileMatch = trimmed.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
  if (fileMatch && fileMatch[1]) return fileMatch[1];
  const idParamMatch = trimmed.match(/[?&]id=([a-zA-Z0-9_-]+)/);
  if (idParamMatch && idParamMatch[1]) return idParamMatch[1];
  const dMatch = trimmed.match(/\/d\/([a-zA-Z0-9_-]+)/);
  if (dMatch && dMatch[1]) return dMatch[1];
  return trimmed;
}

// ── Categories CRUD ───────────────────────────────────────────
export function getCategories(): Category[] {
  return getStore<Category>(KEYS.categories).sort((a, b) => a.order - b.order);
}

export function getCategoryById(id: string): Category | undefined {
  return getCategories().find((c) => c.id === id);
}

export function createCategory(data: Omit<Category, 'id' | 'createdAt'>): Category {
  const cats = getStore<Category>(KEYS.categories);
  const newCat: Category = { ...data, id: generateId(), createdAt: new Date().toISOString() };
  cats.push(newCat);
  setStore(KEYS.categories, cats);
  return newCat;
}

export function updateCategory(id: string, data: Partial<Omit<Category, 'id' | 'createdAt'>>): Category | undefined {
  const cats = getStore<Category>(KEYS.categories);
  const idx = cats.findIndex((c) => c.id === id);
  if (idx === -1) return undefined;
  cats[idx] = { ...cats[idx], ...data };
  setStore(KEYS.categories, cats);
  return cats[idx];
}

export function deleteCategory(id: string): boolean {
  const cats = getStore<Category>(KEYS.categories);
  const filtered = cats.filter((c) => c.id !== id);
  if (filtered.length === cats.length) return false;
  setStore(KEYS.categories, filtered);
  // Also delete all videos in this category
  const videos = getStore<Video>(KEYS.videos).filter((v) => v.categoryId !== id);
  setStore(KEYS.videos, videos);
  return true;
}

// ── Videos CRUD ───────────────────────────────────────────────
export function getVideos(): Video[] {
  return getStore<Video>(KEYS.videos).sort((a, b) => a.episodeNum - b.episodeNum);
}

export function getVideoById(id: string): Video | undefined {
  return getVideos().find((v) => v.id === id);
}

export function getVideosByCategory(categoryId: string): Video[] {
  return getVideos().filter((v) => v.categoryId === categoryId);
}

export function createVideo(data: Omit<Video, 'id' | 'createdAt'>): Video {
  const videos = getStore<Video>(KEYS.videos);
  const newVid: Video = { ...data, id: generateId(), createdAt: new Date().toISOString() };
  videos.push(newVid);
  setStore(KEYS.videos, videos);
  return newVid;
}

export function updateVideo(id: string, data: Partial<Omit<Video, 'id' | 'createdAt'>>): Video | undefined {
  const videos = getStore<Video>(KEYS.videos);
  const idx = videos.findIndex((v) => v.id === id);
  if (idx === -1) return undefined;
  videos[idx] = { ...videos[idx], ...data };
  setStore(KEYS.videos, videos);
  return videos[idx];
}

export function deleteVideo(id: string): boolean {
  const videos = getStore<Video>(KEYS.videos);
  const filtered = videos.filter((v) => v.id !== id);
  if (filtered.length === videos.length) return false;
  setStore(KEYS.videos, filtered);
  return true;
}

// ── Auth helpers ──────────────────────────────────────────────
export function authenticateUser(email: string, password: string): User | null {
  const user = getUserByEmail(email);
  if (!user) return null;
  if (user.password !== password) return null;
  return user;
}
