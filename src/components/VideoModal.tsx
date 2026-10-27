import React from 'react';

interface VideoModalProps {
  videoId?: string;
  videoUrl?: string;
  onClose: () => void;
  [key: string]: any;
}

export const VideoModal: React.FC<VideoModalProps> = ({ videoId, videoUrl, onClose }) => {
  // ទាញយក ID វីដេអូ Drive ឱ្យបានត្រឹមត្រូវ
  const id = videoId || (videoUrl ? videoUrl.match(/[-\w]{25,}/)?.[0] : '');

  return (
    <div className="fixed inset-0 z-[99999] bg-black w-screen h-[100dvh] flex items-center justify-center p-0 m-0 overflow-hidden">
      {/* ប៊ូតុងបិទ ✕ មួយគត់នៅជ្រុងខាងស្ដាំលើ */}
      <button
        onClick={onClose}
        aria-label="Close"
        className="absolute top-4 right-4 z-50 p-2.5 rounded-full bg-black/70 text-white border border-white/20 hover:bg-black transition-all cursor-pointer"
      >
        ✕
      </button>

      {/* ផ្ទាំងចាក់វីដេអូ Drive ដើមសុទ្ធសាធ (គ្មានប៊ូតុងបាំងពីលើ) */}
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
