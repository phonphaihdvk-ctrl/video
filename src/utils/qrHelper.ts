/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import jsQR from 'jsqr';
import QRCode from 'qrcode';

export interface QRPayload {
  type: 'vault_login';
  email: string;
  name?: string;
  timestamp: number;
}

/**
 * Generate a high-resolution QR code data URL (PNG)
 */
export async function generateQrDataUrl(payload: string | QRPayload): Promise<string> {
  const content = typeof payload === 'string' ? payload : JSON.stringify(payload);
  return QRCode.toDataURL(content, {
    width: 400,
    margin: 2,
    color: {
      dark: '#000000',
      light: '#ffffff',
    },
    errorCorrectionLevel: 'M',
  });
}

/**
 * Download a data URL as an image file
 */
export function downloadQrImage(dataUrl: string, filename = 'vault-login-qr.png'): void {
  const a = document.createElement('a');
  a.href = dataUrl;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

/**
 * Parse a scanned string into an email or session info
 */
export function extractEmailFromQrString(qrString: string): string | null {
  const trimmed = qrString.trim();

  // 1. Try parsing JSON
  try {
    const parsed = JSON.parse(trimmed);
    if (parsed && typeof parsed.email === 'string' && parsed.email.includes('@')) {
      return parsed.email.trim().toLowerCase();
    }
  } catch {
    // Not JSON, continue
  }

  // 2. Check if string is directly a valid email
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (emailRegex.test(trimmed)) {
    return trimmed.toLowerCase();
  }

  // 3. Check if email is embedded in query string or URL (e.g. vault://login?email=user@gmail.com)
  const emailMatch = trimmed.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
  if (emailMatch && emailMatch[0]) {
    return emailMatch[0].toLowerCase();
  }

  return null;
}

/**
 * Decode QR Code from an uploaded Image file using HTML Canvas & jsQR
 */
export async function decodeQrFromImageFile(file: File): Promise<{ text: string; email: string | null }> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('READ_FILE_ERROR'));
    reader.onload = (e) => {
      const img = new Image();
      img.onerror = () => reject(new Error('IMAGE_LOAD_ERROR'));
      img.onload = () => {
        try {
          const canvas = document.createElement('canvas');
          const maxDim = 1200;
          let width = img.width;
          let height = img.height;

          // Scale down if extremely large to speed up QR recognition
          if (width > maxDim || height > maxDim) {
            if (width > height) {
              height = Math.round((height * maxDim) / width);
              width = maxDim;
            } else {
              width = Math.round((width * maxDim) / height);
              height = maxDim;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d', { willReadFrequently: true });
          if (!ctx) {
            reject(new Error('CANVAS_CONTEXT_ERROR'));
            return;
          }

          ctx.drawImage(img, 0, 0, width, height);
          const imageData = ctx.getImageData(0, 0, width, height);
          const code = jsQR(imageData.data, imageData.width, imageData.height, {
            inversionAttempts: 'attemptBoth',
          });

          if (code && code.data) {
            const email = extractEmailFromQrString(code.data);
            resolve({ text: code.data, email });
          } else {
            reject(new Error('NO_QR_DETECTED'));
          }
        } catch (err) {
          reject(err);
        }
      };

      img.src = e.target?.result as string;
    };

    reader.readAsDataURL(file);
  });
}

/**
 * Scan a single video frame from an active camera feed using canvas + jsQR
 */
export function scanVideoFrameForQr(
  video: HTMLVideoElement,
  canvas: HTMLCanvasElement
): { text: string; email: string | null } | null {
  if (!video || video.readyState < 2 || video.videoWidth === 0 || video.videoHeight === 0) {
    return null;
  }

  const width = video.videoWidth;
  const height = video.videoHeight;

  if (canvas.width !== width || canvas.height !== height) {
    canvas.width = width;
    canvas.height = height;
  }

  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  if (!ctx) return null;

  ctx.drawImage(video, 0, 0, width, height);
  const imageData = ctx.getImageData(0, 0, width, height);
  const code = jsQR(imageData.data, imageData.width, imageData.height, {
    inversionAttempts: 'attemptBoth',
  });

  if (code && code.data) {
    const email = extractEmailFromQrString(code.data);
    return { text: code.data, email };
  }

  return null;
}
