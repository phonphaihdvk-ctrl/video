import React, { useRef, useState } from 'react';
import { UploadCloud, Sparkles, Loader2 } from 'lucide-react';
import { Language } from '../types/video';
import { translations } from '../utils/translations';

interface UploadSectionProps {
  lang: Language;
  isUploading: boolean;
  uploadProgress: number;
  uploadStatusText: string;
  onFilesSelected: (files: FileList | File[]) => void;
  onLoadSamples: () => void;
  totalVideosCount: number;
}

export const UploadSection: React.FC<UploadSectionProps> = ({
  lang,
  isUploading,
  uploadProgress,
  uploadStatusText,
  onFilesSelected,
  onLoadSamples,
  totalVideosCount,
}) => {
  const t = translations[lang];
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      onFilesSelected(e.dataTransfer.files);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onFilesSelected(e.target.files);
      e.target.value = '';
    }
  };

  return (
    <div className="w-full">
      <div
        onClick={() => !isUploading && fileInputRef.current?.click()}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            fileInputRef.current?.click();
          }
        }}
        className={`relative w-full rounded-2xl border-2 border-dashed transition-all duration-200 cursor-pointer p-6 sm:p-8 text-center flex flex-col items-center justify-center ${
          isDragOver
            ? 'border-blue-600 bg-blue-50/80 dark:bg-blue-950/30 scale-[1.005]'
            : 'border-blue-500/70 hover:border-blue-600 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-750 shadow-xs'
        } ${isUploading ? 'pointer-events-none opacity-90' : ''}`}
      >
        <input
          ref={fileInputRef}
          type="file"
          id="videoFile"
          accept="video/*,.mp4,.webm,.mov,.mkv,.m4v"
          multiple
          className="hidden"
          onChange={handleFileChange}
        />

        {/* Central Icon */}
        <div className="w-12 h-12 mb-3 rounded-2xl bg-blue-50 dark:bg-slate-700 text-blue-600 dark:text-blue-400 flex items-center justify-center border border-blue-100 dark:border-slate-600 shadow-xs">
          {isUploading ? (
            <Loader2 className="w-6 h-6 animate-spin text-blue-600 dark:text-blue-400" />
          ) : (
            <UploadCloud className="w-6 h-6 text-blue-600 dark:text-blue-400" />
          )}
        </div>

        {/* Primary Prompt Text matching user specification */}
        <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100 mb-1 tracking-tight">
          {t.uploadTitle}
        </h3>

        {/* Secondary Subtitle matching user specification */}
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-xl mb-2">
          {t.uploadSubtitle}
        </p>

        {/* Drag Hint */}
        <p className="text-xs text-slate-400 dark:text-slate-500 max-w-md mb-4">
          {t.uploadDropHint}
        </p>

        {/* Progress Bar when uploading */}
        {isUploading && (
          <div className="w-full max-w-md mt-2">
            <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-300 mb-1.5 font-medium">
              <span>{uploadStatusText || t.uploading}</span>
              <span className="font-mono tabular-nums">{uploadProgress}%</span>
            </div>
            <div className="w-full bg-slate-100 dark:bg-slate-700 rounded-full h-2 overflow-hidden border border-slate-200 dark:border-slate-600">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
          </div>
        )}

        {/* Action Buttons */}
        {!isUploading && (
          <div
            className="flex flex-wrap items-center justify-center gap-3 mt-1"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="px-5 py-2 text-xs sm:text-sm font-semibold text-white bg-blue-600 rounded-xl hover:bg-blue-700 active:bg-blue-800 transition-colors shadow-xs"
            >
              {t.upload}
            </button>

            {totalVideosCount === 0 && (
              <button
                type="button"
                onClick={onLoadSamples}
                className="flex items-center gap-1.5 px-4 py-2 text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 rounded-xl transition-colors"
              >
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span>{lang === 'km' ? 'បញ្ចូលវីដេអូគំរូ HD' : 'Load Sample Videos'}</span>
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
