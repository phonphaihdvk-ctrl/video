import React, { useEffect } from 'react';
import { StoredVideo } from '../types/video';

export interface VideoPlayerModalProps {
  videoId?: string;
  video?: (StoredVideo & { driveId?: string; name?: string }) | null;
  onClose: () => void;
  // Optional legacy props maintained for interface compatibility
  lang?: any;
  onDownload?: any;
}

export const VideoPlayerModal: React.FC<VideoPlayerModalProps> = ({
  videoId,
  video,
  onClose,
}) => {
  // Prevent background scroll while video modal is active
  useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);

  if (!videoId && !video) return null;

  // Resolve video ID from prop or video object
  const rawId = videoId || video?.driveId || video?.id || '';

  // Extract ID if a full Google Drive URL was passed
  let finalVideoId = rawId;
  const match = rawId.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
  if (match) {
    finalVideoId = match[1];
  } else {
    const idMatch = rawId.match(/[?&]id=([a-zA-Z0-9_-]+)/);
    if (idMatch) {
      finalVideoId = idMatch[1];
    }
  }

  return (
    <div className="fixed inset-0 z-50 bg-black w-screen h-[100dvh] flex items-center justify-center p-0 m-0 overflow-hidden">
      {/* Minimal Floating Close Button (✕) only */}
      <button
        type="button"
        onClick={onClose}
        className="absolute top-4 right-4 z-50 p-2.5 rounded-full bg-black/70 hover:bg-black/90 text-white border border-white/20 transition cursor-pointer active:scale-95 flex items-center justify-center shadow-lg"
        title="Close"
        aria-label="Close"
      >
        ✕
      </button>

      {/* Pure Google Drive Preview Iframe (Handles >25MB files and .ts videos natively) */}
      <iframe
        src={`https://drive.google.com/file/d/${finalVideoId}/preview`}
        className="w-full h-full border-0 pointer-events-auto"
        allow="autoplay; fullscreen; encrypted-media"
        allowFullScreen
      />
    </div>
  );
};

export default VideoPlayerModal;
