import React, { useState, useEffect, useRef } from 'react';

export interface VideoModalProps {
  videoId?: string;
  videoUrl?: string;
  onClose: () => void;
  [key: string]: any;
}

export const VideoModal: React.FC<VideoModalProps> = ({ videoId, videoUrl, onClose }) => {
  const id = videoId || (videoUrl ? videoUrl.match(/[-\w]{25,}/)?.[0] : '');

  // YouTube Mobile Style 3-Second Auto-Hide
  const [showControls, setShowControls] = useState(true);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const resetTimer = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    timerRef.current = setTimeout(() => {
      setShowControls(false);
    }, 3000);
  };

  const handleUserActivity = () => {
    setShowControls(true);
    resetTimer();
  };

  const handleScreenTap = (e: React.MouseEvent | React.TouchEvent) => {
    // If clicking close button directly, let the button handle it
    if ((e.target as HTMLElement).closest('button')) {
      return;
    }

    setShowControls((prev) => {
      const next = !prev;
      if (next) {
        resetTimer();
      } else if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
      return next;
    });
  };

  useEffect(() => {
    resetTimer();
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  return (
    <div
      onClick={handleScreenTap}
      onMouseMove={handleUserActivity}
      onTouchStart={handleUserActivity}
      className="fixed inset-0 z-[99999] bg-black w-screen h-[100dvh] flex items-center justify-center p-0 m-0 overflow-hidden select-none"
    >
      {/* Sleek Floating Close Button (✕) with 3s Auto-Hide & Fade-Out */}
      <button
        onClick={onClose}
        aria-label="Close"
        className={`absolute top-4 right-4 z-50 p-3 rounded-full bg-black/75 hover:bg-black text-white border border-white/20 text-xl cursor-pointer shadow-2xl backdrop-blur-md active:scale-95 transition-opacity duration-300 ${
          showControls ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        ✕
      </button>

      {/* Pure Native Google Drive Player: 100vw x 100vh Edge-to-Edge */}
      <iframe
        src={`https://drive.google.com/file/d/${id}/preview`}
        className="w-full h-full border-0 pointer-events-auto"
        allow="autoplay; fullscreen; encrypted-media; picture-in-picture"
        allowFullScreen
      />
    </div>
  );
};

export default VideoModal;
