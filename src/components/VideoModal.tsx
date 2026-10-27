import React from 'react';

export interface VideoModalProps {
  videoId?: string;
  videoUrl?: string;
  onClose: () => void;
  [key: string]: any;
}

export const VideoModal: React.FC<VideoModalProps> = ({ videoId, videoUrl, onClose }) => {
  const id = videoId || (videoUrl ? videoUrl.match(/[-\w]{25,}/)?.[0] : '');

  return (
    <div className="fixed inset-0 z-[99999] bg-black w-screen h-[100dvh] flex items-center justify-center p-0 m-0 overflow-hidden">
      {/* ប៊ូតុងបិទ ✕ មួយគត់ */}
      <button
        onClick={onClose}
        aria-label="Close"
        className="absolute top-4 right-4 z-50 p-3 rounded-full bg-black/70 text-white border border-white/20 text-xl cursor-pointer"
      >
        ✕
      </button>

      {/* ទុកតែ Iframe Drive សុទ្ធ ១០០% (ព្រោះវាចាក់វីដេអូដើរស្រាប់ហើយ) */}
      <iframe
        src={`https://drive.google.com/file/d/${id}/preview`}
        className="w-full h-full border-0 pointer-events-auto"
        allow="autoplay; fullscreen; encrypted-media"
        allowFullScreen
      />
    </div>
  );
};

export default VideoModal;
