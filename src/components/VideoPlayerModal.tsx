import React from 'react';
import { StoredVideo } from '../types/video';

export interface VideoPlayerModalProps {
  videoId?: string;
  video?: (StoredVideo & { driveId?: string }) | null;
  onClose: () => void;
  // Optional legacy props maintained for type compatibility
  lang?: any;
  onDownload?: any;
}

export const VideoPlayerModal: React.FC<VideoPlayerModalProps> = ({
  videoId,
  video,
  onClose,
}) => {
  if (!videoId && !video) return null;

  // Resolve videoId from prop or video object
  const resolvedId = videoId || video?.driveId || video?.id || '';

  // Extract ID if a full Google Drive URL was passed
  let finalVideoId = resolvedId;
  const match = resolvedId.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
  if (match) {
    finalVideoId = match[1];
  } else {
    const idMatch = resolvedId.match(/[?&]id=([a-zA-Z0-9_-]+)/);
    if (idMatch) {
      finalVideoId = idMatch[1];
    }
  }

  return (
    <div className="fixed inset-0 z-50 bg-black w-screen h-[100dvh] flex items-center justify-center p-0 m-0 overflow-hidden">
      <button
        type="button"
        onClick={onClose}
        className="absolute top-4 right-4 z-50 p-2.5 rounded-full bg-black/70 text-white border border-white/20 hover:bg-black/90 active:scale-95 transition cursor-pointer"
        title="Close"
        aria-label="Close"
      >
        ✕
      </button>
      <iframe
        src={`https://drive.google.com/file/d/${finalVideoId}/preview`}
        className="w-full h-full border-0"
        allow="autoplay; fullscreen"
        allowFullScreen
      />
    </div>
  );
};

export default VideoPlayerModal;
