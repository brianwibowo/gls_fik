// Shared TypeScript interfaces for GLS FIK data layer.

export interface User {
  id: string;
  name: string;
  email: string;
  password: string; // Plain text mock in localStorage (hashed on Go backend in production)
  role: 'user' | 'admin';
  createdAt: string;
}

export interface Category {
  id: string;
  name: string;
  description: string;
  thumbnail: string; // path to webp or URL
  order: number;
  createdAt: string;
}

export interface Video {
  id: string;
  categoryId: string;
  title: string;
  description: string;
  driveFileId: string; // Google Drive file ID for embed
  driveLink: string;   // Full shareable link
  thumbnail: string;
  duration: string;
  level: string;
  episodeNum: number;
  isFree: boolean;     // true = watchable without login
  createdAt: string;
}

export interface AuthSession {
  user: Omit<User, 'password'>;
  loginAt: string;
}
