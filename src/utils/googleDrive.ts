import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  onAuthStateChanged,
  User,
  signOut,
} from 'firebase/auth';
import firebaseConfig from '../../firebase-applet-config.json';

// Initialize Firebase App
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
export const auth = getAuth(app);

const createProvider = (forceConsent = false) => {
  const p = new GoogleAuthProvider();
  p.addScope('https://www.googleapis.com/auth/drive.readonly');
  p.addScope('https://www.googleapis.com/auth/drive.file');
  p.setCustomParameters({
    prompt: forceConsent ? 'consent select_account' : 'select_account',
    access_type: 'offline',
  });
  return p;
};

let cachedAccessToken: string | null = null;
let isSigningIn = false;

export interface DriveVideoFile {
  id: string;
  name: string;
  size: string;
  sizeBytes?: number;
  date: string;
  url: string; // Stream embed URL (Google Drive preview iframe)
  previewUrl: string;
  directUrl?: string; // Direct play HTML5 URL (bypasses "Video is still processing" error)
  thumbnailLink?: string;
  category?: string;
  fav: boolean;
  type?: 'video' | 'image';
  isTSFile?: boolean;
  mimeType?: string;
  driveId?: string;
}

export interface FetchDriveResult {
  success: boolean;
  files: DriveVideoFile[];
  insufficientScopes?: boolean;
  errorMessage?: string;
}

export interface UploadProgressInfo {
  percent: number;
  loadedBytes: number;
  totalBytes: number;
  loadedMB: string;
  totalMB: string;
}

export interface UploadController {
  abort: () => void;
}

// Local cache helpers to enable instant cross-device sync display
export const saveDriveCache = (email: string, files: DriveVideoFile[]) => {
  try {
    const key = `vault_drive_cache_${email.trim().toLowerCase()}`;
    localStorage.setItem(key, JSON.stringify(files));
  } catch (e) {
    console.warn('Failed to save drive cache:', e);
  }
};

export const getDriveCache = (email: string): DriveVideoFile[] => {
  try {
    const key = `vault_drive_cache_${email.trim().toLowerCase()}`;
    const raw = localStorage.getItem(key);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (e) {
    console.warn('Failed to load drive cache:', e);
  }
  return [];
};

export const initAuth = (
  onAuthSuccess?: (user: User, token: string) => void,
  onAuthFailure?: () => void
) => {
  return onAuthStateChanged(auth, async (user: User | null) => {
    if (user && cachedAccessToken) {
      if (onAuthSuccess) onAuthSuccess(user, cachedAccessToken);
    } else if (!isSigningIn) {
      if (onAuthFailure) onAuthFailure();
    }
  });
};

export const googleSignIn = async (
  forceConsent = true
): Promise<{ user: User; accessToken: string } | null> => {
  try {
    isSigningIn = true;
    const provider = createProvider(forceConsent);
    const result = await signInWithPopup(auth, provider);
    const credential = GoogleAuthProvider.credentialFromResult(result);
    if (!credential?.accessToken) {
      throw new Error('Failed to obtain Google access token');
    }
    cachedAccessToken = credential.accessToken;
    return { user: result.user, accessToken: cachedAccessToken };
  } catch (err: any) {
    if (err.code === 'auth/popup-closed-by-user') {
      return null;
    }
    console.warn('Google Sign In warning:', err.message || err);
    throw err;
  } finally {
    isSigningIn = false;
  }
};

export const googleSignOut = async (): Promise<void> => {
  await signOut(auth);
  cachedAccessToken = null;
};

export const getAccessToken = (): string | null => {
  return cachedAccessToken;
};

export const setAccessTokenInMemory = (token: string | null) => {
  cachedAccessToken = token;
};

/**
 * Fetch real files directly from Google Drive API v3 (drive.files.list)
 * Searches for all videos, MPEG-TS streams, and photos in the user's 5TB Drive.
 */
export const fetchDriveVideos = async (token?: string): Promise<FetchDriveResult> => {
  const authToken = token || cachedAccessToken;
  if (!authToken) {
    return {
      success: false,
      files: [],
      errorMessage: 'Not authenticated with Google Drive',
    };
  }

  try {
    const query = encodeURIComponent(
      "trashed = false and (mimeType contains 'video/' or mimeType contains 'image/' or mimeType = 'application/octet-stream' or mimeType = 'video/mp2t')"
    );
    const fields = encodeURIComponent(
      'files(id,name,size,mimeType,createdTime,thumbnailLink,webContentLink,webViewLink,appProperties,properties)'
    );
    const url = `https://www.googleapis.com/drive/v3/files?q=${query}&fields=${fields}&pageSize=100&orderBy=createdTime desc`;

    const res = await fetch(url, {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });

    if (res.status === 403) {
      return {
        success: false,
        files: [],
        insufficientScopes: true,
        errorMessage: 'Google Drive permissions not granted yet. Please re-authenticate.',
      };
    }

    if (!res.ok) {
      const errText = await res.text();
      return {
        success: false,
        files: [],
        errorMessage: `Drive API returned ${res.status}: ${errText}`,
      };
    }

    const data = await res.json();
    const rawFiles: any[] = data.files || [];

    const files: DriveVideoFile[] = rawFiles.map((f) => {
      const sizeNumber = f.size ? parseInt(f.size, 10) : 0;
      const sizeStr = sizeNumber > 0 ? (sizeNumber / (1024 * 1024)).toFixed(1) + ' MB' : 'Cloud File';
      const dateStr = f.createdTime
        ? new Date(f.createdTime).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
          })
        : 'Recent';

      const isImage =
        (f.mimeType && f.mimeType.startsWith('image/')) ||
        /\.(jpg|jpeg|png|webp|gif|svg)$/i.test(f.name);
      const isTS =
        (f.mimeType && f.mimeType.includes('mp2t')) || /\.ts$/i.test(f.name);

      const streamUrl = `https://drive.google.com/file/d/${f.id}/preview`;
      const directDownloadUrl = `https://drive.google.com/uc?export=download&id=${f.id}`;
      const imageDirectUrl = `https://drive.google.com/uc?export=view&id=${f.id}`;

      const formattedThumb = f.thumbnailLink
        ? f.thumbnailLink.replace(/=s\d+.*$/, '=s640')
        : undefined;

      let preview = isImage
        ? f.thumbnailLink
          ? f.thumbnailLink.replace(/=s\d+.*$/, '=s1600')
          : imageDirectUrl
        : formattedThumb || '';

      // Read persistent cross-device folder category from Drive metadata
      const assignedCategory =
        f.appProperties?.category ||
        f.appProperties?.folderId ||
        f.properties?.category ||
        (isImage ? 'Travel & Trips' : 'Work Videos');

      return {
        id: f.id,
        name: f.name || (isImage ? 'Untitled Photo' : 'Untitled Video'),
        size: sizeStr,
        sizeBytes: sizeNumber,
        date: dateStr,
        url: streamUrl,
        previewUrl: preview,
        directUrl: isImage ? imageDirectUrl : directDownloadUrl,
        thumbnailLink: formattedThumb,
        category: assignedCategory,
        fav: false,
        type: isImage ? 'image' : 'video',
        isTSFile: isTS,
        mimeType: f.mimeType,
        driveId: f.id,
      };
    });

    return {
      success: true,
      files,
    };
  } catch (err: any) {
    return {
      success: false,
      files: [],
      errorMessage: err.message || 'Network error fetching Drive files',
    };
  }
};

/**
 * Real-time XMLHttpRequest upload to Google Drive 5TB.
 * Uses Resumable Upload protocol (ideal for large videos up to several GBs)
 * with multipart/related fallback.
 * Emits exact percentage (0% to 100%) and loaded MBs.
 */
export const uploadMediaToDriveXHR = (
  file: File,
  token: string,
  targetCategory: string = 'General',
  onProgress: (info: UploadProgressInfo) => void,
  onSuccess: (file: DriveVideoFile) => void,
  onError: (error: Error) => void
): UploadController => {
  let isAborted = false;
  let activeXhr: XMLHttpRequest | null = null;

  let mimeType = file.type || 'video/mp4';
  const isTS = file.name.toLowerCase().endsWith('.ts');
  const isImage =
    file.type.startsWith('image/') || /\.(jpg|jpeg|png|webp|gif)$/i.test(file.name);

  if (isTS) {
    mimeType = 'video/mp2t';
  } else if (!file.type && isImage) {
    mimeType = 'image/jpeg';
  }

  // Attempt Resumable Upload (preferred for media up to 5TB)
  (async () => {
    try {
      const initRes = await fetch(
        'https://www.googleapis.com/upload/drive/v3/files?uploadType=resumable',
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json; charset=UTF-8',
            'X-Upload-Content-Type': mimeType,
            'X-Upload-Content-Length': file.size.toString(),
          },
          body: JSON.stringify({
            name: file.name,
            mimeType: mimeType,
            appProperties: {
              folderId: targetCategory,
              category: targetCategory,
            },
            properties: {
              category: targetCategory,
            },
          }),
        }
      );

      const sessionUrl = initRes.headers.get('Location');

      if (initRes.ok && sessionUrl && !isAborted) {
        // Upload binary chunk to sessionUrl via XMLHttpRequest
        const xhr = new XMLHttpRequest();
        activeXhr = xhr;

        xhr.upload.onprogress = (e) => {
          if (e.lengthComputable) {
            const percent = Math.min(100, Math.max(0, Math.round((e.loaded / e.total) * 100)));
            const loadedMB = (e.loaded / (1024 * 1024)).toFixed(1);
            const totalMB = (e.total / (1024 * 1024)).toFixed(1);
            onProgress({
              percent,
              loadedBytes: e.loaded,
              totalBytes: e.total,
              loadedMB,
              totalMB,
            });
          }
        };

        xhr.onload = () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            try {
              const data = JSON.parse(xhr.responseText);
              const streamUrl = `https://drive.google.com/file/d/${data.id}/preview`;
              const directDownloadUrl = `https://drive.google.com/uc?export=download&id=${data.id}`;
              const imageDirectUrl = `https://drive.google.com/uc?export=view&id=${data.id}`;

              const uploadedFile: DriveVideoFile = {
                id: data.id,
                name: data.name || file.name,
                size: (file.size / (1024 * 1024)).toFixed(1) + ' MB',
                sizeBytes: file.size,
                date: 'Just now',
                url: streamUrl,
                previewUrl: isImage ? imageDirectUrl : streamUrl,
                directUrl: isImage ? imageDirectUrl : directDownloadUrl,
                category: targetCategory,
                fav: false,
                type: isImage ? 'image' : 'video',
                isTSFile: isTS,
              };
              onSuccess(uploadedFile);
            } catch (err) {
              onError(new Error('Invalid response received from Google Drive'));
            }
          } else {
            onError(new Error(`Google Drive upload failed with status ${xhr.status}`));
          }
        };

        xhr.onerror = () => {
          if (!isAborted) onError(new Error('Network error during Google Drive upload'));
        };

        xhr.ontimeout = () => {
          if (!isAborted) onError(new Error('Upload timed out. Please check your connection.'));
        };

        xhr.timeout = 30 * 60 * 1000; // 30 mins
        xhr.open('PUT', sessionUrl);
        xhr.setRequestHeader('Content-Type', mimeType);
        xhr.send(file);
        return;
      }
    } catch (e) {
      console.warn('Resumable init failed or restricted by CORS, falling back to multipart/related:', e);
    }

    if (isAborted) return;

    // Fallback: Standard RFC 2387 multipart/related upload via XMLHttpRequest
    const boundary = '-------314159265358979323846';
    const delimiter = '\r\n--' + boundary + '\r\n';
    const closeDelim = '\r\n--' + boundary + '--';

    const metadata = {
      name: file.name,
      mimeType: mimeType,
      appProperties: {
        folderId: targetCategory,
        category: targetCategory,
      },
      properties: {
        category: targetCategory,
      },
    };

    const multipartBlob = new Blob(
      [
        delimiter,
        'Content-Type: application/json; charset=UTF-8\r\n\r\n',
        JSON.stringify(metadata),
        delimiter,
        `Content-Type: ${mimeType}\r\n\r\n`,
        file,
        closeDelim,
      ],
      { type: `multipart/related; boundary=${boundary}` }
    );

    const xhr = new XMLHttpRequest();
    activeXhr = xhr;

    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable) {
        const percent = Math.min(100, Math.max(0, Math.round((e.loaded / e.total) * 100)));
        const loadedMB = (e.loaded / (1024 * 1024)).toFixed(1);
        const totalMB = (e.total / (1024 * 1024)).toFixed(1);
        onProgress({
          percent,
          loadedBytes: e.loaded,
          totalBytes: e.total,
          loadedMB,
          totalMB,
        });
      }
    };

    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          const data = JSON.parse(xhr.responseText);
          const streamUrl = `https://drive.google.com/file/d/${data.id}/preview`;
          const directDownloadUrl = `https://drive.google.com/uc?export=download&id=${data.id}`;
          const imageDirectUrl = `https://drive.google.com/uc?export=view&id=${data.id}`;

          const uploadedFile: DriveVideoFile = {
            id: data.id,
            name: data.name || file.name,
            size: (file.size / (1024 * 1024)).toFixed(1) + ' MB',
            sizeBytes: file.size,
            date: 'Just now',
            url: streamUrl,
            previewUrl: isImage ? imageDirectUrl : streamUrl,
            directUrl: isImage ? imageDirectUrl : directDownloadUrl,
            category: targetCategory,
            fav: false,
            type: isImage ? 'image' : 'video',
            isTSFile: isTS,
          };
          onSuccess(uploadedFile);
        } catch (err) {
          onError(new Error('Invalid response received from Google Drive'));
        }
      } else {
        onError(new Error(`Google Drive upload failed with status ${xhr.status}`));
      }
    };

    xhr.onerror = () => {
      if (!isAborted) onError(new Error('Network error during Google Drive upload'));
    };

    xhr.ontimeout = () => {
      if (!isAborted) onError(new Error('Upload timed out. Please check your connection.'));
    };

    xhr.timeout = 30 * 60 * 1000;
    xhr.open('POST', 'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart');
    xhr.setRequestHeader('Authorization', `Bearer ${token}`);
    xhr.setRequestHeader('Content-Type', `multipart/related; boundary=${boundary}`);
    xhr.send(multipartBlob);
  })();

  return {
    abort: () => {
      isAborted = true;
      if (activeXhr) {
        try {
          activeXhr.abort();
        } catch (e) {
          // ignore
        }
      }
    },
  };
};

/**
 * Permanently deletes or trashes a file from the user's real Google Drive.
 * Executes: DELETE https://www.googleapis.com/drive/v3/files/{fileId}
 */
export const deleteDriveFile = async (
  fileId: string,
  token?: string
): Promise<{ success: boolean; errorMessage?: string }> => {
  const authToken = token || cachedAccessToken;
  if (!authToken) {
    return {
      success: false,
      errorMessage: 'No active Google Drive session. Please sign in with Google.',
    };
  }

  try {
    const res = await fetch(`https://www.googleapis.com/drive/v3/files/${fileId}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });

    if (res.status === 204 || res.status === 200 || res.ok) {
      return { success: true };
    }

    // If 404, file might already be deleted or not found in Drive
    if (res.status === 404) {
      return { success: true };
    }

    const errorText = await res.text();
    console.warn(`Drive API DELETE returned HTTP ${res.status}:`, errorText);
    return {
      success: false,
      errorMessage: `Google Drive deletion returned HTTP ${res.status}`,
    };
  } catch (err: any) {
    console.error('Failed to execute Google Drive deletion:', err);
    return {
      success: false,
      errorMessage: err.message || 'Network error deleting file from Google Drive',
    };
  }
};

export interface DriveStorageInfo {
  limit?: number; // total quota in bytes, undefined if unlimited
  usage: number; // total bytes used
  usageInDrive: number;
  usageInDriveTrash: number;
}

export const fetchDriveStorageAbout = async (token?: string): Promise<DriveStorageInfo | null> => {
  const authToken = token || cachedAccessToken;
  if (!authToken) return null;

  try {
    const res = await fetch('https://www.googleapis.com/drive/v3/about?fields=storageQuota', {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });
    if (!res.ok) return null;
    const data = await res.json();
    if (data.storageQuota) {
      return {
        limit: data.storageQuota.limit ? parseInt(data.storageQuota.limit, 10) : undefined,
        usage: data.storageQuota.usage ? parseInt(data.storageQuota.usage, 10) : 0,
        usageInDrive: data.storageQuota.usageInDrive ? parseInt(data.storageQuota.usageInDrive, 10) : 0,
        usageInDriveTrash: data.storageQuota.usageInDriveTrash ? parseInt(data.storageQuota.usageInDriveTrash, 10) : 0,
      };
    }
  } catch (e) {
    console.warn('Could not fetch real Drive storage quota:', e);
  }
  return null;
};

/**
 * Updates a file's assigned folder/category in real-time in Google Drive metadata.
 * Persists appProperties: { folderId, category } and properties: { category }
 * so the file stays in the designated folder across all devices.
 */
export const updateDriveFileCategory = async (
  fileId: string,
  category: string,
  token?: string
): Promise<boolean> => {
  const authToken = token || cachedAccessToken;
  if (!authToken) return false;

  try {
    const res = await fetch(`https://www.googleapis.com/drive/v3/files/${fileId}`, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${authToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        appProperties: {
          folderId: category,
          category: category,
        },
        properties: {
          category: category,
        },
      }),
    });
    return res.ok;
  } catch (err) {
    console.warn('Failed to update Google Drive file category metadata:', err);
    return false;
  }
};

// In-memory cache for loaded Google Drive video blobs to avoid re-fetching
const mediaBlobMemoryCache = new Map<string, string>();

/**
 * Streams media file directly from Google Drive API v3 (?alt=media) with Bearer token.
 * Creates an in-memory HTML5-playable Object URL (blob:).
 * Completely bypasses Google Drive iframe and avoids external redirects.
 */
export const getDriveMediaBlobUrl = async (
  fileId: string,
  token?: string,
  onProgress?: (loadedMB: string, percent: number) => void
): Promise<string> => {
  if (mediaBlobMemoryCache.has(fileId)) {
    return mediaBlobMemoryCache.get(fileId)!;
  }

  const authToken = token || cachedAccessToken;
  if (!authToken) {
    throw new Error('Not authenticated with Google Drive');
  }

  const res = await fetch(`https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`, {
    headers: {
      Authorization: `Bearer ${authToken}`,
    },
  });

  if (!res.ok) {
    throw new Error(`Failed to stream Google Drive file: ${res.statusText}`);
  }

  const contentLength = res.headers.get('content-length');
  const total = contentLength ? parseInt(contentLength, 10) : 0;

  if (res.body && total > 0 && onProgress) {
    const reader = res.body.getReader();
    let received = 0;
    const chunks: Uint8Array[] = [];

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      if (value) {
        chunks.push(value);
        received += value.length;
        const percent = Math.min(100, Math.round((received / total) * 100));
        const loadedMB = (received / (1024 * 1024)).toFixed(1);
        onProgress(loadedMB, percent);
      }
    }

    const contentType = res.headers.get('content-type') || 'video/mp4';
    const blob = new Blob(chunks as any[], { type: contentType });
    const blobUrl = URL.createObjectURL(blob);
    mediaBlobMemoryCache.set(fileId, blobUrl);
    return blobUrl;
  } else {
    const blob = await res.blob();
    const blobUrl = URL.createObjectURL(blob);
    mediaBlobMemoryCache.set(fileId, blobUrl);
    return blobUrl;
  }
};

/**
 * Extracts a representative frame from a video file using HTML5 canvas.
 * Returns a base64 JPEG data URL for instant cover preview.
 */
export const generateVideoThumbnail = (fileOrBlobUrl: File | string): Promise<string> => {
  return new Promise((resolve) => {
    try {
      const video = document.createElement('video');
      video.preload = 'metadata';
      video.muted = true;
      video.playsInline = true;
      video.crossOrigin = 'anonymous';

      const isFile = typeof fileOrBlobUrl !== 'string';
      const videoSrc = isFile ? URL.createObjectURL(fileOrBlobUrl) : fileOrBlobUrl;
      video.src = videoSrc;

      let resolved = false;
      const cleanup = () => {
        if (isFile) {
          URL.revokeObjectURL(videoSrc);
        }
      };

      video.onloadeddata = () => {
        // Seek to 1s or midpoint
        video.currentTime = Math.min(1.0, Math.max(0.1, (video.duration || 2) * 0.2));
      };

      video.onseeked = () => {
        if (resolved) return;
        try {
          const canvas = document.createElement('canvas');
          const width = Math.min(video.videoWidth || 640, 640);
          const height = video.videoHeight && video.videoWidth
            ? Math.round((width / video.videoWidth) * video.videoHeight)
            : 360;
          canvas.width = width;
          canvas.height = height;

          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(video, 0, 0, width, height);
            const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
            resolved = true;
            cleanup();
            resolve(dataUrl);
            return;
          }
        } catch {
          // ignore error
        }
        resolved = true;
        cleanup();
        resolve('');
      };

      video.onerror = () => {
        if (resolved) return;
        resolved = true;
        cleanup();
        resolve('');
      };

      // 3.5s timeout safety fallback
      setTimeout(() => {
        if (resolved) return;
        resolved = true;
        cleanup();
        resolve('');
      }, 3500);
    } catch {
      resolve('');
    }
  });
};


