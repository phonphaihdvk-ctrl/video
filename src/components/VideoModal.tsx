import React from 'react';

export interface VideoModalProps {
  videoId: string;
  onClose: () => void;
}

export const VideoModal: React.FC<VideoModalProps> = ({ videoId, onClose }) => {
  return (
    <div className="fixed inset-0 z-[99999] bg-black w-screen h-[100dvh] flex items-center justify-center p-0 m-0 overflow-hidden">
      {/* ប៊ូតុងបិទ ✕ មួយគត់នៅជ្រុងខាងស្ដាំលើ */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-50 p-3 rounded-full bg-black/70 text-white border border-white/20 hover:bg-black transition-all cursor-pointer"
      >
        ✕
      </button>

      {/* ផ្ទាំង Google Drive ដើមសុទ្ធ ១០០% គ្មានប៊ូតុងក្លែងក្លាយណាមកបាំងឡើយ */}
      <iframe
        src={`https://drive.google.com/file/d/${videoId}/preview`}
        className="w-full h-full border-0 pointer-events-auto"
        allow="autoplay; fullscreen; encrypted-media"
        allowFullScreen
      />
    </div>
  );
};

export default VideoModal;
