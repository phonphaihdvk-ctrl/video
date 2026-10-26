export type VideoResolution = '4K UHD' | '1080p FHD' | '720p HD' | 'SD';

export type MediaType = 'video' | 'image';

export interface LearningCategory {
  id: string;
  nameKm: string;
  nameEn: string;
  badge: string;
  color: string;
  icon?: string;
  img?: string;
  descriptionKm?: string;
  descriptionEn?: string;
}

export interface StoredVideo {
  id: string;
  type: MediaType;
  title: string;
  description?: string;
  url: string;
  blob?: Blob;
  thumbnailUrl?: string;
  size: number; // bytes
  duration: number; // seconds
  quality: VideoResolution;
  width?: number;
  height?: number;
  mimeType: string;
  createdAt: number;
  category: string; // matches LearningCategory.id or 'all'
  tags: string[];
  favorite: boolean;
  source: 'upload' | 'google_drive' | 'sample';
  cloudSynced: boolean;
  views?: number;
  viewedAt?: number;
}

export type UserApprovalStatus = 'approved' | 'pending' | 'rejected';

export interface AppUser {
  id: string;
  name: string;
  email: string;
  password?: string;
  avatarUrl?: string;
  initial?: string;
  status: UserApprovalStatus;
  role: 'user' | 'developer';
  registeredAt: number;
  approvedAt?: number;
}

export interface UserAccount {
  name: string;
  email: string;
  avatarUrl?: string;
  initial: string;
  connectedSince: string;
  storageUsedBytes: number;
  storageQuotaBytes: number;
  googleDriveLinked: boolean;
  status?: UserApprovalStatus;
  role?: 'user' | 'developer';
}

export interface QuizQuestion {
  id: string;
  categoryId: string;
  questionKm: string;
  questionEn: string;
  options: { id: string; text: string; isCorrect: boolean }[];
  explanation: string;
}

export interface VocabItem {
  id: string;
  word: string;
  phonetic: string;
  partOfSpeech: string;
  meaningKm: string;
  meaningEn: string;
  exampleSentence: string;
  exampleKhmer: string;
  category: string;
  learned: boolean;
}

export type Language = 'km' | 'en';
export type AppTab = 'categories' | 'videos' | 'photos' | 'favorites' | 'history' | 'quiz' | 'vocab' | 'analytics';
export type DriveView = 'all' | 'my_drive' | 'shared' | 'recent' | 'starred';
