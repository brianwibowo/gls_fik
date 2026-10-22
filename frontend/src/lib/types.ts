// Shared TypeScript interfaces for Gymnastics Competition Level (GCL)

export interface User {
  id: string;
  name: string;
  email: string;
  password?: string;
  role: 'athlete' | 'coach' | 'admin' | 'user';
  avatar?: string;
  bio?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface Category {
  id: string;
  name: string;
  description: string;
  thumbnail: string; // path to webp or URL
  order: number;
  createdAt: string;
  updatedAt?: string;
  videos?: Video[];
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
  level: string;       // 'Level 1 (Foundation)', 'Level 2 (Intermediate)', 'Level 3 (Advanced)'
  episodeNum: number;
  isFree: boolean;     // true = watchable without login
  createdAt: string;
  updatedAt?: string;
}

export interface Technique {
  id: string;
  categoryId: string;
  level: number;
  name: string;
  description?: string;
  order: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface TechniqueEvaluation {
  id: string;
  athleteId: string;
  techniqueId: string;
  coachId: string;
  coachName?: string;
  notes: string;
  score?: string; // 'Mastered' | 'Developing' | 'Needs Work'
  createdAt: string;
  updatedAt?: string;
}

export interface ProgressItem {
  technique: Technique;
  isCompleted: boolean;
  evaluation?: TechniqueEvaluation;
}

export interface ProgressTrackerResponse {
  athleteId: string;
  totalTechniques: number;
  completedCount: number;
  percentage: number;
  items: ProgressItem[];
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: 'athlete' | 'coach' | 'admin' | 'user';
  avatar?: string;
  bio?: string;
  completedCount?: number;
  totalCount?: number;
}

export interface AuthSession {
  user: Omit<User, 'password'>;
  loginAt: string;
}
