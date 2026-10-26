/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { AppUser, UserApprovalStatus } from '../types/video';

const USERS_STORAGE_KEY = 'vault_users_db_v2';
const CURRENT_USER_ID_KEY = 'vault_current_user_id_v2';

export const initialDefaultUsers: AppUser[] = [
  {
    id: 'usr_dev_phon_phal',
    name: 'Phon Phal',
    email: 'phonphaihdvk@gmail.com',
    password: 'password123',
    avatarUrl: 'https://ui-avatars.com/api/?name=Phon+Phal&background=2563eb&color=fff',
    status: 'approved',
    role: 'developer',
    registeredAt: Date.now() - 86400000 * 5,
    approvedAt: Date.now() - 86400000 * 5,
  },
  {
    id: 'usr_sokh_chea',
    name: 'សុខ ជា',
    email: 'sokhchea@gmail.com',
    password: 'password123',
    avatarUrl: 'https://ui-avatars.com/api/?name=Sokh+Chea&background=10b981&color=fff',
    status: 'pending',
    role: 'user',
    registeredAt: Date.now() - 3600000 * 2,
  },
  {
    id: 'usr_kiri_vong',
    name: 'គិរី វង្ស',
    email: 'kirivong.media@gmail.com',
    password: 'password123',
    avatarUrl: 'https://ui-avatars.com/api/?name=Kiri+Vong&background=f59e0b&color=fff',
    status: 'pending',
    role: 'user',
    registeredAt: Date.now() - 3600000 * 6,
  },
];

export function getAllUsers(): AppUser[] {
  try {
    const raw = localStorage.getItem(USERS_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(initialDefaultUsers));
      return initialDefaultUsers;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(initialDefaultUsers));
    return initialDefaultUsers;
  } catch (err) {
    console.error('Error getting users from localStorage:', err);
    return initialDefaultUsers;
  }
}

export function saveUsers(users: AppUser[]): void {
  try {
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
  } catch (err) {
    console.error('Error saving users to localStorage:', err);
  }
}

export function getCurrentUser(): AppUser | null {
  try {
    const currentId = localStorage.getItem(CURRENT_USER_ID_KEY);
    if (currentId === 'null' || currentId === '') {
      return null;
    }
    const users = getAllUsers();
    if (!currentId) {
      // Default initial session is Phon Phal
      const dev = users.find((u) => u.email === 'phonphaihdvk@gmail.com') || users[0];
      if (dev) {
        localStorage.setItem(CURRENT_USER_ID_KEY, dev.id);
        return dev;
      }
      return null;
    }
    const found = users.find((u) => u.id === currentId || u.email === currentId);
    return found || null;
  } catch (err) {
    console.error('Error getting current user:', err);
    return null;
  }
}

export function setCurrentUser(user: AppUser | null): void {
  try {
    if (user) {
      localStorage.setItem(CURRENT_USER_ID_KEY, user.id);
    } else {
      localStorage.setItem(CURRENT_USER_ID_KEY, 'null');
    }
  } catch (err) {
    console.error('Error setting current user:', err);
  }
}

export function registerOrLoginUser(name: string, email: string, password?: string): AppUser {
  const users = getAllUsers();
  const trimmedEmail = email.trim().toLowerCase();
  const trimmedName = name.trim() || trimmedEmail.split('@')[0];

  const existing = users.find((u) => u.email.toLowerCase() === trimmedEmail);
  if (existing) {
    // If name was updated
    if (trimmedName && existing.name !== trimmedName) {
      existing.name = trimmedName;
      saveUsers(users);
    }
    return existing;
  }

  // Developer email auto-approves
  const isDevEmail = trimmedEmail === 'phonphaihdvk@gmail.com' || trimmedEmail.includes('admin') || trimmedEmail.includes('dev');
  const newUser: AppUser = {
    id: 'usr_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
    name: trimmedName,
    email: trimmedEmail,
    password: password || '123456',
    avatarUrl: `https://ui-avatars.com/api/?name=${encodeURIComponent(trimmedName)}&background=2563eb&color=fff`,
    status: isDevEmail ? 'approved' : 'pending',
    role: isDevEmail ? 'developer' : 'user',
    registeredAt: Date.now(),
    approvedAt: isDevEmail ? Date.now() : undefined,
  };

  users.push(newUser);
  saveUsers(users);
  return newUser;
}

export function updateUserStatus(userIdOrEmail: string, status: UserApprovalStatus): AppUser | null {
  const users = getAllUsers();
  const user = users.find((u) => u.id === userIdOrEmail || u.email.toLowerCase() === userIdOrEmail.toLowerCase());
  if (user) {
    user.status = status;
    if (status === 'approved' && !user.approvedAt) {
      user.approvedAt = Date.now();
    }
    saveUsers(users);
    return user;
  }
  return null;
}

export function updateUserAvatar(userId: string, avatarUrl: string): AppUser | null {
  const users = getAllUsers();
  const user = users.find((u) => u.id === userId);
  if (user) {
    user.avatarUrl = avatarUrl;
    saveUsers(users);
    return user;
  }
  return null;
}

export function deleteUser(userId: string): void {
  const users = getAllUsers().filter((u) => u.id !== userId);
  saveUsers(users);
}

export function approveAllPending(): number {
  const users = getAllUsers();
  let count = 0;
  users.forEach((u) => {
    if (u.status === 'pending') {
      u.status = 'approved';
      u.approvedAt = Date.now();
      count++;
    }
  });
  saveUsers(users);
  return count;
}
