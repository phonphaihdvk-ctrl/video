import React from 'react';
import { X, Video, Image as ImageIcon } from 'lucide-react';
import { Language, MediaType } from '../types/video';
import { translations } from '../utils/translations';

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectType: (type: MediaType) => void;
  lang: Language;
}

export const UploadModal: React.FC<UploadModalProps> = ({
  isOpen,
  onClose,
  onSelectType,
  lang,
}) => {
  const t = translations[lang];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-t-3xl sm:rounded-2xl max-w-sm w-full p-5 shadow-2xl space-y-4 text-slate-900 dark:text-slate-100">
        <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-3">
          <h3 className="font-bold text-sm">
            {t.selectUploadType}
          </h3>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-3 pt-1">
          {/* Upload Video Option */}
          <button
            type="button"
            onClick={() => onSelectType('video')}
            className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 hover:border-blue-500 dark:hover:border-blue-500 text-center flex flex-col items-center gap-2.5 transition-all hover:scale-[1.02] shadow-2xs group"
          >
            <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Video className="w-6 h-6" />
            </div>
            <span className="text-xs font-semibold">
              {t.uploadVideo}
            </span>
            <span className="text-[10px] text-slate-400">
              MP4, WebM, MOV, MKV
            </span>
          </button>

          {/* Upload Photo Option */}
          <button
            type="button"
            onClick={() => onSelectType('image')}
            className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 hover:border-emerald-500 dark:hover:border-emerald-500 text-center flex flex-col items-center gap-2.5 transition-all hover:scale-[1.02] shadow-2xs group"
          >
            <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <ImageIcon className="w-6 h-6" />
            </div>
            <span className="text-xs font-semibold">
              {t.uploadPhoto}
            </span>
            <span className="text-[10px] text-slate-400">
              JPG, PNG, WEBP, GIF
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};
