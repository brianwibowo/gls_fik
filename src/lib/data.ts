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

export const SEED_CATEGORIES: Category[] = [
  {
    id: 'cat-fx',
    name: 'Floor Exercise (Senam Lantai)',
    description: 'Rangkaian gerakan akrobatik, putaran, dan kelenturan di atas matras pegas berukuran 12x12 meter.',
    thumbnail: '/images/apparatus-floor.webp',
    order: 1,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'cat-ph',
    name: 'Pommel Horse (Kuda-Kuda Pelana)',
    description: 'Rangkaian putaran melingkar satu dan dua kaki secara kontinyu di atas bodi kuda berpelana.',
    thumbnail: '/images/apparatus-pommel.webp',
    order: 2,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'cat-sr',
    name: 'Still Rings (Gelang-Gelang)',
    description: 'Ujian kekuatan statis dan ayunan dinamis pada dua gelang kabel tanpa getaran tali.',
    thumbnail: '/images/apparatus-rings.webp',
    order: 3,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'cat-vt',
    name: 'Vault (Meja Lompat)',
    description: 'Lompatan eksplosif melintasi meja lompat dengan fase lari cepat, tolakan pegas, dan pendaratan stabil.',
    thumbnail: '/images/apparatus-vault.webp',
    order: 4,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'cat-pb',
    name: 'Parallel Bars (Palang Sejajar)',
    description: 'Kombinasi ayunan, posisi tumpuan tangan, manuver di bawah palang, dan dismount pendaratan.',
    thumbnail: '/images/apparatus-bars.webp',
    order: 5,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'cat-hb',
    name: 'Horizontal Bar (Palang Tunggal)',
    description: 'Gerakan ayunan berkecepatan tinggi, giant swing terus-menerus, dan pelepasan pegangan salto spektakuler.',
    thumbnail: '/images/apparatus-highbar.jpg',
    order: 6,
    createdAt: new Date().toISOString(),
  },
];

export const SEED_VIDEOS: Video[] = [
  // ── 1. FX (Floor Exercise - Lantai) ──────────────────────
  {
    id: 'vid-fx-1',
    categoryId: 'cat-fx',
    title: 'Postur, Tumpuan Kaki & Awalan Senam Lantai',
    description:
      'Fondasi awal atlet senam artistik: koreksi postur tubuh lurus, tumpuan ujung kaki (toe point), serta ritme langkah akselerasi awalan.',
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
    title: 'Rangkaian Eksekusi & Dinamika Rotasi FX',
    description:
      'Pembahasan teknik tolakan tangan ke matras pegas, perpindahan momentum linier menjadi rotasi sudut, serta menjaga sumbu putar di udara.',
    driveFileId: '10pPKxlH8e6GKSI79bTbiCQ7d_YQP3xkD',
    driveLink: 'https://drive.google.com/file/d/10pPKxlH8e6GKSI79bTbiCQ7d_YQP3xkD/view?usp=share_link',
    thumbnail: '/images/apparatus-floor.webp',
    duration: '04:12',
    level: 'Menengah',
    episodeNum: 2,
    isFree: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'vid-fx-3',
    categoryId: 'cat-fx',
    title: 'Koreksi Pendaratan (Stick Landing) Senam Lantai',
    description:
      'Fase peredaman hentakan sendi lutut dan tumit saat menyentuh matras tanpa langkah ekstra, stabilitas inti tubuh, dan salam pendaratan.',
    driveFileId: '1saHh0xfJRT3tuIKyByGCbAzsMnoa2HXI',
    driveLink: 'https://drive.google.com/file/d/1saHh0xfJRT3tuIKyByGCbAzsMnoa2HXI/view?usp=share_link',
    thumbnail: '/images/apparatus-floor.webp',
    duration: '05:08',
    level: 'Mahir',
    episodeNum: 3,
    isFree: false,
    createdAt: new Date().toISOString(),
  },

  // ── 2. PH (Pommel Horse - Pelana) ─────────────────────────
  {
    id: 'vid-ph-1',
    categoryId: 'cat-ph',
    title: 'Pengenalan Tumpuan & Ayunan Pelana (PH)',
    description:
      'Dasar penguatan pergelangan tangan, posisi tumpuan telapak di atas bodi pelana, dan ayunan dasar satu kaki (single leg work).',
    driveFileId: '1bWbwPWd0GQ_AiX9i4tQ-kFpBKX1mEiLv',
    driveLink: 'https://drive.google.com/file/d/1bWbwPWd0GQ_AiX9i4tQ-kFpBKX1mEiLv/view?usp=share_link',
    thumbnail: '/images/apparatus-pommel.webp',
    duration: '03:30',
    level: 'Dasar',
    episodeNum: 1,
    isFree: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'vid-ph-2',
    categoryId: 'cat-ph',
    title: 'Teknik Circle & Scissors Kuda-Kuda Pelana',
    description:
      'Drill putaran dua kaki melingkar (double leg circles) kontinu, perpindahan tumpuan tangan ritmis, dan elevasi pinggul pada gerakan scissors.',
    driveFileId: '1V2mwHNlh2jbpzQz6XwFSvr_OOKb-Hsxk',
    driveLink: 'https://drive.google.com/file/d/1V2mwHNlh2jbpzQz6XwFSvr_OOKb-Hsxk/view?usp=share_link',
    thumbnail: '/images/apparatus-pommel.webp',
    duration: '04:45',
    level: 'Menengah',
    episodeNum: 2,
    isFree: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'vid-ph-3',
    categoryId: 'cat-ph',
    title: 'Dismount & Kombinasi Rangkaian Pelana',
    description:
      'Transisi rangkaian antar bagian pelana hingga gerakan pelepasan/pendaratan dismount handstand travel yang bersih.',
    driveFileId: '1OSxlH3hgtuHZ4j25LihLlaKqZtZ5nBq4',
    driveLink: 'https://drive.google.com/file/d/1OSxlH3hgtuHZ4j25LihLlaKqZtZ5nBq4/view?usp=share_link',
    thumbnail: '/images/apparatus-pommel.webp',
    duration: '04:15',
    level: 'Mahir',
    episodeNum: 3,
    isFree: false,
    createdAt: new Date().toISOString(),
  },

  // ── 3. SR (Still Rings - Gelang-Gelang) ────────────────────
  {
    id: 'vid-sr-1',
    categoryId: 'cat-sr',
    title: 'Grip, False Grip & Ayunan Dasar Gelang-Gelang',
    description:
      'Teknik false grip untuk memudahkan transisi tumpuan di atas ring, ayunan lurus ritmis tanpa getaran kabel gantungan.',
    driveFileId: '1jQ5WvB3Xc0CNCBqv_remyZ70VFkB6qhJ',
    driveLink: 'https://drive.google.com/file/d/1jQ5WvB3Xc0CNCBqv_remyZ70VFkB6qhJ/view?usp=share_link',
    thumbnail: '/images/apparatus-rings.webp',
    duration: '03:50',
    level: 'Dasar',
    episodeNum: 1,
    isFree: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'vid-sr-2',
    categoryId: 'cat-sr',
    title: 'Kekuatan Statis (Hold: L-Sit, Planche & Cross)',
    description:
      'Penguncian bahu (turnout ring), aktivasi otot inti dan latissimus dorsi saat melakukan tahanan statis 2 detik sesuai standar FIG.',
    driveFileId: '1ZEnFVQLnIVuIvNBIVC6H1KruGF-j5nfq',
    driveLink: 'https://drive.google.com/file/d/1ZEnFVQLnIVuIvNBIVC6H1KruGF-j5nfq/view?usp=share_link',
    thumbnail: '/images/apparatus-rings.webp',
    duration: '05:10',
    level: 'Menengah',
    episodeNum: 2,
    isFree: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'vid-sr-3',
    categoryId: 'cat-sr',
    title: 'Salto Dismount & Pendaratan Stabil Gelang-Gelang',
    description:
      'Pelepasan pegangan ring saat puncak ayunan belakang untuk eksekusi salto ganda dan penyerapan hentakan kaki di matras.',
    driveFileId: '1SgYz3kwxfeKpJTHhCIBae9zVHbhmWl0D',
    driveLink: 'https://drive.google.com/file/d/1SgYz3kwxfeKpJTHhCIBae9zVHbhmWl0D/view?usp=share_link',
    thumbnail: '/images/apparatus-rings.webp',
    duration: '04:30',
    level: 'Mahir',
    episodeNum: 3,
    isFree: false,
    createdAt: new Date().toISOString(),
  },

  // ── 4. VT (Vault - Meja Lompat) ───────────────────────────
  {
    id: 'vid-vt-1',
    categoryId: 'cat-vt',
    title: 'Akselerasi Sprint 25m & Entri Papan Pegas',
    description:
      'Membangun kecepatan lari maksimal yang stabil dan transisi hurdle loncatan ke papan pegas (springboard) dengan sudut kontak optimal.',
    driveFileId: '1jBhnPPDZb_l21NPCsCZh_DBymNo8sy-x',
    driveLink: 'https://drive.google.com/file/d/1jBhnPPDZb_l21NPCsCZh_DBymNo8sy-x/view?usp=share_link',
    thumbnail: '/images/apparatus-vault.webp',
    duration: '03:25',
    level: 'Dasar',
    episodeNum: 1,
    isFree: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'vid-vt-2',
    categoryId: 'cat-vt',
    title: 'Fase Tolakan Bahu (Blocking) di Atas Meja Lompat',
    description:
      'Koreksi kontak tangan secepat mungkin (<0.2 detik) pada permukaan meja lompat untuk menghasilkan daya tolak vertikal maksimal.',
    driveFileId: '1AQSqHJtOuUbcGDtsESAolbdJJggOwQog',
    driveLink: 'https://drive.google.com/file/d/1AQSqHJtOuUbcGDtsESAolbdJJggOwQog/view?usp=share_link',
    thumbnail: '/images/apparatus-vault.webp',
    duration: '04:05',
    level: 'Menengah',
    episodeNum: 2,
    isFree: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'vid-vt-3',
    categoryId: 'cat-vt',
    title: 'Fase Layang Kedua (Post-Flight) & Stick Landing VT',
    description:
      'Kontrol rotasi tubuh saat melayang di udara, spotting visual matras pendaratan, dan penguncian pendaratan tanpa langkah geser.',
    driveFileId: '1OXqNUWjXE9UTn9kJ6qiaO92GqID00Q88',
    driveLink: 'https://drive.google.com/file/d/1OXqNUWjXE9UTn9kJ6qiaO92GqID00Q88/view?usp=share_link',
    thumbnail: '/images/apparatus-vault.webp',
    duration: '04:55',
    level: 'Mahir',
    episodeNum: 3,
    isFree: false,
    createdAt: new Date().toISOString(),
  },

  // ── 5. PB (Parallel Bars - Palang Sejajar) ────────────────
  {
    id: 'vid-pb-1',
    categoryId: 'cat-pb',
    title: 'Tumpuan Lengan, Ayunan Bahu & Cast Palang Sejajar',
    description:
      'Fondasi posisi tumpu lurus di antara dua palang, ayunan gantung dari bahu tanpa tekukan siku, serta gerakan cast awal.',
    driveFileId: '1FvXTZ4MqmqljRd4755-ypHuelNVELBg_',
    driveLink: 'https://drive.google.com/file/d/1FvXTZ4MqmqljRd4755-ypHuelNVELBg_/view?usp=share_link',
    thumbnail: '/images/apparatus-bars.webp',
    duration: '03:40',
    level: 'Dasar',
    episodeNum: 1,
    isFree: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'vid-pb-2',
    categoryId: 'cat-pb',
    title: 'Handstand, Pirouette & Transisi Atas Palang Sejajar',
    description:
      'Penguasaan handstand tegak di atas palang kayu, penguncian bahu, dan perpindahan ayunan melewati palang dengan aman.',
    driveFileId: '1YNXqIPZmhA_AQzV-ALGDyZK0K4oBXPR2',
    driveLink: 'https://drive.google.com/file/d/1YNXqIPZmhA_AQzV-ALGDyZK0K4oBXPR2/view?usp=share_link',
    thumbnail: '/images/apparatus-bars.webp',
    duration: '04:35',
    level: 'Menengah',
    episodeNum: 2,
    isFree: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'vid-pb-3',
    categoryId: 'cat-pb',
    title: 'Variasi Dismount Salto & Evaluasi Palang Sejajar',
    description:
      'Teknik ayunan kuat dari bawah palang menuju salto pendaratan di samping matras dengan kontrol postur sempurna.',
    driveFileId: '1QMNvrTb2fqRn8vOZ5vTebeCNQUrL0x0v',
    driveLink: 'https://drive.google.com/file/d/1QMNvrTb2fqRn8vOZ5vTebeCNQUrL0x0v/view?usp=share_link',
    thumbnail: '/images/apparatus-bars.webp',
    duration: '04:50',
    level: 'Mahir',
    episodeNum: 3,
    isFree: false,
    createdAt: new Date().toISOString(),
  },

  // ── 6. HB (Horizontal Bar - Palang Tunggal) ───────────────
  {
    id: 'vid-hb-1',
    categoryId: 'cat-hb',
    title: 'Grip, Tap Swing & Ayunan Irama Palang Tunggal (HB)',
    description:
      'Penggunaan handgrip pelindung telapak tangan, pembentukan lengkungan arch-to-hollow saat ayunan tap swing di palang baja elastis.',
    driveFileId: '18pOQa_V3FKDNSSkiWMNzfdxxvgry9izS',
    driveLink: 'https://drive.google.com/file/d/18pOQa_V3FKDNSSkiWMNzfdxxvgry9izS/view?usp=share_link',
    thumbnail: '/images/apparatus-highbar.jpg',
    duration: '03:55',
    level: 'Dasar',
    episodeNum: 1,
    isFree: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'vid-hb-2',
    categoryId: 'cat-hb',
    title: 'Putaran Raksasa (Giant Swing) & Transisi Pegangan',
    description:
      'Pemanfaatan percepatan gravitasi pada rotasi penuh 360 derajat di sekitar palang, cast to handstand, dan perubahan posisi grip.',
    driveFileId: '1BANvdbvr-0UVVoVoLqJN0Hy3MqEW69fQ',
    driveLink: 'https://drive.google.com/file/d/1BANvdbvr-0UVVoVoLqJN0Hy3MqEW69fQ/view?usp=share_link',
    thumbnail: '/images/apparatus-highbar.jpg',
    duration: '05:05',
    level: 'Menengah',
    episodeNum: 2,
    isFree: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'vid-hb-3',
    categoryId: 'cat-hb',
    title: 'Release Move & Flyaway Salto Dismount HB',
    description:
      'Momen krusial pelepasan pegangan tangan di puncak putaran untuk manuver layang dan pendaratan terfiksasi di matras tebal.',
    driveFileId: '1SXsHg1lSSP184HLB5BcrI9ux34VMhgVb',
    driveLink: 'https://drive.google.com/file/d/1SXsHg1lSSP184HLB5BcrI9ux34VMhgVb/view?usp=share_link',
    thumbnail: '/images/apparatus-highbar.jpg',
    duration: '04:40',
    level: 'Mahir',
    episodeNum: 3,
    isFree: false,
    createdAt: new Date().toISOString(),
  },
];

// ── Seed Version Flag ─────────────────────────────────────────
export const SEED_VERSION = 'v3_mag_6apparatus_18videos';

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

// ── Initialization (seed on first visit or version change) ────
export function initializeData(forceReset = false): void {
  if (typeof window === 'undefined') return;
  const currentVer = localStorage.getItem(KEYS.initialized);
  if (!currentVer || currentVer !== SEED_VERSION || forceReset) {
    setStore(KEYS.users, SEED_USERS);
    setStore(KEYS.categories, SEED_CATEGORIES);
    setStore(KEYS.videos, SEED_VIDEOS);
    localStorage.setItem(KEYS.initialized, SEED_VERSION);
    return;
  }
}

// ── Reset to Seed Data (accessible via admin UI) ──────────────
export function resetToSeedData(): void {
  initializeData(true);
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
