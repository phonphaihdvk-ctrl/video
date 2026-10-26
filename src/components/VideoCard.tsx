import React, { useState } from 'react';
import { Play, Download, Trash2, Edit3, Heart, MoreVertical, Image as ImageIcon, Video as VideoIcon } from 'lucide-react';
import { StoredVideo, Language, LearningCategory } from '../types/video';
import { translations, formatBytes, formatDuration, formatDate } from '../utils/translations';

interface VideoCardProps {
  video: StoredVideo;
  categories: LearningCategory[];
  lang: Language;
  viewMode?: 'list' | 'grid';
  onPlay: (video: StoredVideo) => void;
  onDownload: (video: StoredVideo) => void;
  onEdit: (video: StoredVideo) => void;
  onDelete: (id: string) => void;
  onToggleFavorite: (id: string) => void;
}

export const VideoCard: React.FC<VideoCardProps> = ({
  video,
  categories,
  lang,
  viewMode = 'list',
  onPlay,
  onDownload,
  onEdit,
  onDelete,
  onToggleFavorite,
}) => {
  const t = translations[lang];
  const [menuOpen, setMenuOpen] = useState(false);
  const [imgError, setImgError] = useState(false);

  const catObj = categories.find((c) => c.id === video.category);
  const catName = catObj
    ? lang === 'km'
      ? catObj.nameKm
      : catObj.nameEn
    : video.category;

  const isImage = video.type === 'image';

  if (viewMode === 'list') {
    return (
      <div className="p-2.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 flex gap-3 items-center shadow-xs hover:border-blue-500 transition-colors group">
        {/* Preview Thumbnail */}
        <div
          onClick={() => onPlay(video)}
          className="w-16 h-12 shrink-0 rounded-xl overflow-hidden bg-slate-900 cursor-pointer relative flex items-center justify-center border border-slate-200 dark:border-slate-700/60"
        >
          {(video.thumbnailUrl || (isImage && video.url)) && !imgError ? (
            <img
              src={video.thumbnailUrl || video.url}
              alt={video.title}
              onError={() => setImgError(true)}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform"
            />
          ) : (
            <div className="w-full h-full bg-slate-800 flex items-center justify-center">
              {isImage ? (
                <ImageIcon className="w-5 h-5 text-emerald-400" />
              ) : (
                <Play className="w-5 h-5 text-blue-400 ml-0.5" />
              )}
            </div>
          )}
          <div className="absolute inset-0 bg-black/25 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            {isImage ? (
              <ImageIcon className="w-4 h-4 text-white" />
            ) : (
              <Play className="w-4 h-4 text-white ml-0.5 fill-current" />
            )}
          </div>
        </div>

        {/* Info */}
        <div className="flex-1 overflow-hidden min-w-0" onClick={() => onPlay(video)}>
          <h4
            className="font-bold text-xs truncate text-slate-900 dark:text-white cursor-pointer hover:text-blue-500 transition-colors"
            title={video.title}
          >
            {video.title}
          </h4>
          <div className="text-[10px] text-slate-400 dark:text-slate-400 mt-1 flex items-center gap-1.5 truncate">
            <span>{formatDate(video.createdAt, lang)}</span>
            <span>•</span>
            <span className="font-mono">{formatBytes(video.size)}</span>
            {catName && (
              <>
                <span>•</span>
                <span className="text-blue-500 dark:text-blue-400 font-medium truncate max-w-[100px]">
                  {catName}
                </span>
              </>
            )}
          </div>
        </div>

        {/* Favorite Heart Button */}
        <button
          type="button"
          onClick={() => onToggleFavorite(video.id)}
          className="p-2 text-base transition-transform active:scale-125 shrink-0"
          title={video.favorite ? 'Favorited' : 'Add to favorites'}
        >
          <Heart
            className={`w-4 h-4 transition-colors ${
              video.favorite
                ? 'text-rose-500 fill-rose-500'
                : 'text-slate-400 hover:text-rose-400'
            }`}
          />
        </button>

        {/* Quick Menu Button */}
        <div className="relative shrink-0">
          <button
            type="button"
            onClick={() => setMenuOpen(!menuOpen)}
            className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
          >
            <MoreVertical className="w-3.5 h-3.5" />
          </button>
          {menuOpen && (
            <>
              <div
                className="fixed inset-0 z-20"
                onClick={() => setMenuOpen(false)}
              />
              <div className="absolute right-0 top-8 w-36 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-lg z-30 py-1 text-xs text-slate-700 dark:text-slate-200">
                <button
                  onClick={() => {
                    setMenuOpen(false);
                    onPlay(video);
                  }}
                  className="w-full px-3 py-1.5 text-left hover:bg-slate-50 dark:hover:bg-slate-700 flex items-center gap-2"
                >
                  {isImage ? (
                    <ImageIcon className="w-3.5 h-3.5 text-emerald-500" />
                  ) : (
                    <Play className="w-3.5 h-3.5 text-blue-500" />
                  )}
                  <span>{t.play}</span>
                </button>
                <button
                  onClick={() => {
                    setMenuOpen(false);
                    onDownload(video);
                  }}
                  className="w-full px-3 py-1.5 text-left hover:bg-slate-50 dark:hover:bg-slate-700 flex items-center gap-2"
                >
                  <Download className="w-3.5 h-3.5 text-slate-500" />
                  <span>{t.download}</span>
                </button>
                <button
                  onClick={() => {
                    setMenuOpen(false);
                    onEdit(video);
                  }}
                  className="w-full px-3 py-1.5 text-left hover:bg-slate-50 dark:hover:bg-slate-700 flex items-center gap-2"
                >
                  <Edit3 className="w-3.5 h-3.5 text-slate-500" />
                  <span>{t.edit}</span>
                </button>
                <div className="h-px bg-slate-100 dark:bg-slate-700 my-1" />
                <button
                  onClick={() => {
                    setMenuOpen(false);
                    onDelete(video.id);
                  }}
                  className="w-full px-3 py-1.5 text-left hover:bg-red-50 dark:hover:bg-red-950/40 text-red-600 flex items-center gap-2"
                >
                  <Trash2 className="w-3.5 h-3.5 text-red-500" />
                  <span>{t.delete}</span>
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="group relative bg-white dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700/80 rounded-2xl overflow-hidden shadow-xs hover:shadow-md transition-all duration-200 flex flex-col">
      {/* Media Thumbnail Area */}
      <div
        className="relative w-full aspect-video bg-slate-900 cursor-pointer overflow-hidden flex items-center justify-center"
        onClick={() => onPlay(video)}
      >
        {(video.thumbnailUrl || (isImage && video.url)) && !imgError ? (
          <img
            src={video.thumbnailUrl || video.url}
            alt={video.title}
            referrerPolicy="no-referrer"
            onError={() => setImgError(true)}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 text-white p-4">
            <div className="w-12 h-12 rounded-full bg-blue-600/30 border border-blue-400/40 flex items-center justify-center mb-2">
              {isImage ? (
                <ImageIcon className="w-6 h-6 text-emerald-400" />
              ) : (
                <Play className="w-6 h-6 text-blue-400 ml-0.5" />
              )}
            </div>
            <span className="text-xs text-slate-300 font-medium text-center line-clamp-1">
              {video.title}
            </span>
          </div>
        )}

        {/* Top Quality Badge */}
        <div className="absolute top-2.5 left-2.5 bg-black/70 backdrop-blur-xs text-white text-[10px] font-bold px-2 py-0.5 rounded border border-white/20 flex items-center gap-1">
          {isImage ? (
            <ImageIcon className="w-2.5 h-2.5 text-emerald-400" />
          ) : (
            <VideoIcon className="w-2.5 h-2.5 text-blue-400" />
          )}
          <span>{video.quality}</span>
        </div>

        {/* Center Action Overlay */}
        <div className="w-11 h-11 rounded-full bg-blue-600/90 text-white flex items-center justify-center text-lg shadow-lg group-hover:scale-110 transition-transform">
          {isImage ? (
            <ImageIcon className="w-5 h-5" />
          ) : (
            <Play className="w-5 h-5 ml-0.5 fill-current" />
          )}
        </div>

        {/* Bottom Duration Badge (Videos only) */}
        {!isImage && video.duration > 0 && (
          <div className="absolute bottom-2 right-2 bg-black/75 text-white text-[10px] font-mono tabular-nums px-1.5 py-0.5 rounded">
            {formatDuration(video.duration)}
          </div>
        )}
      </div>

      {/* Media Details */}
      <div className="p-3.5 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-start justify-between gap-2 mb-1">
            <h4
              onClick={() => onPlay(video)}
              className="font-bold text-xs sm:text-sm text-slate-800 dark:text-slate-100 line-clamp-1 cursor-pointer hover:text-blue-600 dark:hover:text-blue-400 transition-colors leading-snug"
              title={video.title}
            >
              {video.title}
            </h4>

            {/* Context Menu Button */}
            <div className="relative shrink-0">
              <button
                type="button"
                onClick={() => setMenuOpen(!menuOpen)}
                className="w-6 h-6 rounded flex items-center justify-center text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
              >
                <MoreVertical className="w-4 h-4" />
              </button>

              {menuOpen && (
                <>
                  <div
                    className="fixed inset-0 z-20"
                    onClick={() => setMenuOpen(false)}
                  />
                  <div className="absolute right-0 top-7 w-40 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-lg z-30 py-1 text-xs text-slate-700 dark:text-slate-200">
                    <button
                      onClick={() => {
                        setMenuOpen(false);
                        onPlay(video);
                      }}
                      className="w-full px-3 py-2 text-left hover:bg-slate-50 dark:hover:bg-slate-700 flex items-center gap-2"
                    >
                      {isImage ? <ImageIcon className="w-3.5 h-3.5 text-emerald-600" /> : <Play className="w-3.5 h-3.5 text-blue-600" />}
                      <span>{t.play}</span>
                    </button>
                    <button
                      onClick={() => {
                        setMenuOpen(false);
                        onDownload(video);
                      }}
                      className="w-full px-3 py-2 text-left hover:bg-slate-50 dark:hover:bg-slate-700 flex items-center gap-2"
                    >
                      <Download className="w-3.5 h-3.5 text-slate-600 dark:text-slate-300" />
                      <span>{t.download}</span>
                    </button>
                    <button
                      onClick={() => {
                        setMenuOpen(false);
                        onEdit(video);
                      }}
                      className="w-full px-3 py-2 text-left hover:bg-slate-50 dark:hover:bg-slate-700 flex items-center gap-2"
                    >
                      <Edit3 className="w-3.5 h-3.5 text-slate-600 dark:text-slate-300" />
                      <span>{t.edit}</span>
                    </button>
                    <div className="h-px bg-slate-100 dark:bg-slate-700 my-1" />
                    <button
                      onClick={() => {
                        setMenuOpen(false);
                        onDelete(video.id);
                      }}
                      className="w-full px-3 py-2 text-left hover:bg-red-50 dark:hover:bg-red-950/40 text-red-600 flex items-center gap-2"
                    >
                      <Trash2 className="w-3.5 h-3.5 text-red-500" />
                      <span>{t.delete}</span>
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Unboxed Metadata line */}
          <div className="flex items-center flex-wrap gap-1.5 text-[11px] text-slate-400 dark:text-slate-400 mb-2.5 font-normal">
            <span>{formatDate(video.createdAt, lang)}</span>
            <span aria-hidden="true">•</span>
            <span className="font-mono tabular-nums">{formatBytes(video.size)}</span>
            <span aria-hidden="true">•</span>
            <span className="text-blue-500 dark:text-blue-400 font-medium truncate max-w-[120px]">
              {catName}
            </span>
          </div>
        </div>

        {/* Footer Favorite & Cloud Sync Bar */}
        <div className="flex items-center justify-between pt-2.5 border-t border-slate-100 dark:border-slate-700/60 text-xs">
          <span className="inline-flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-medium text-[11px]">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>Google Drive</span>
          </span>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onDownload(video)}
              className="p-1.5 text-slate-400 hover:text-blue-600 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
              title={t.download}
            >
              <Download className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => onToggleFavorite(video.id)}
              className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
              title={video.favorite ? 'Favorited' : 'Add to favorites'}
            >
              <Heart
                className={`w-4 h-4 transition-colors ${
                  video.favorite
                    ? 'text-rose-500 fill-rose-500'
                    : 'text-slate-400 hover:text-rose-400'
                }`}
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
