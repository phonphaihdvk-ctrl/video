import { StoredVideo } from '../types/video';

const DB_NAME = 'CloudHDVideoVaultDB';
const DB_VERSION = 1;
const STORE_NAME = 'videos';

function openDatabase(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (!('indexedDB' in window)) {
      reject(new Error('IndexedDB not supported'));
      return;
    }

    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        const store = db.createObjectStore(STORE_NAME, { keyPath: 'id' });
        store.createIndex('createdAt', 'createdAt', { unique: false });
        store.createIndex('category', 'category', { unique: false });
      }
    };

    request.onsuccess = () => {
      resolve(request.result);
    };

    request.onerror = () => {
      reject(request.error);
    };
  });
}

export async function getAllVideosFromDb(): Promise<StoredVideo[]> {
  try {
    const db = await openDatabase();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const request = store.getAll();

      request.onsuccess = () => {
        const list: StoredVideo[] = request.result || [];
        // Recreate Blob URLs for videos stored as Blobs
        const videosWithUrls = list.map((item) => {
          if (item.blob && !item.url.startsWith('http')) {
            const objectUrl = URL.createObjectURL(item.blob);
            return { ...item, url: objectUrl };
          }
          return item;
        });
        resolve(videosWithUrls.sort((a, b) => b.createdAt - a.createdAt));
      };

      request.onerror = () => reject(request.error);
    });
  } catch (err) {
    console.error('Failed to get videos from IndexedDB', err);
    return [];
  }
}

export async function saveVideoToDb(video: StoredVideo): Promise<void> {
  const db = await openDatabase();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    const request = store.put(video);

    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}

export async function updateVideoInDb(video: StoredVideo): Promise<void> {
  return saveVideoToDb(video);
}

export async function deleteVideoFromDb(id: string): Promise<void> {
  const db = await openDatabase();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    const request = store.delete(id);

    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}

/**
 * Migrates any legacy videos saved in localStorage 'hd_videos'
 */
export async function migrateLegacyLocalStorage(): Promise<StoredVideo[]> {
  try {
    const raw = localStorage.getItem('hd_videos');
    if (!raw) return [];

    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.length === 0) return [];

    const migrated: StoredVideo[] = [];
    for (const item of parsed) {
      if (item && item.url) {
        // Convert base64 data url or string to StoredVideo
        const newVideo: StoredVideo = {
          id: 'migrated_' + Date.now() + '_' + Math.random().toString(36).substring(2, 9),
          type: 'video',
          title: item.name || item.title || 'Untitled Video',
          url: item.url,
          size: item.url.length * 0.75, // approximate base64 bytes
          duration: 15,
          quality: '1080p FHD',
          mimeType: 'video/mp4',
          createdAt: item.date ? new Date(item.date).getTime() || Date.now() : Date.now(),
          category: 'beginner',
          tags: ['Migrated'],
          favorite: false,
          source: 'upload',
          cloudSynced: true,
        };
        await saveVideoToDb(newVideo);
        migrated.push(newVideo);
      }
    }
    localStorage.removeItem('hd_videos');
    return migrated;
  } catch (err) {
    console.warn('Migration error:', err);
    return [];
  }
}

export async function loadSavedCategories(defaults: any[]): Promise<any[]> {
  try {
    const raw = localStorage.getItem('angkor_categories');
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (e) {
    console.warn('Failed to load categories', e);
  }
  return defaults;
}

export async function saveCategoriesToStorage(categories: any[]): Promise<void> {
  try {
    localStorage.setItem('angkor_categories', JSON.stringify(categories));
  } catch (e) {
    console.warn('Failed to save categories', e);
  }
}

