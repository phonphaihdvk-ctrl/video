import React, { useRef, useState, useEffect } from 'react';
import {
  X,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize2,
  Minimize2,
  RotateCcw,
  RotateCw,
  Download,
  Info,
  Sliders,
  Check,
} from 'lucide-react';
import { StoredVideo, Language } from '../types/video';
import { translations, formatBytes, formatDuration, formatDate } from '../utils/translations';

interface VideoPlayerModalProps {
  video: StoredVideo | null;
  lang: Language;
  onClose: () => void;
  onDownload: (video: StoredVideo) => void;
}

export const VideoPlayerModal: React.FC<VideoPlayerModalProps> = ({
  video,
  lang,
  onClose,
  onDownload,
}) => {
  const t = translations[lang];
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const [showSpeedMenu, setShowSpeedMenu] = useState(false);
  const [controlsVisible, setControlsVisible] = useState(true);

  const speeds = [0.5, 0.75, 1.0, 1.25, 1.5, 2.0];

  useEffect(() => {
    if (!video) return;
    setIsPlaying(false);
    setCurrentTime(0);
  }, [video]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!video) return;
      if (e.key === 'Escape') {
        if (isFullscreen) {
          document.exitFullscreen?.();
        } else {
          onClose();
        }
      } else if (e.key === ' ' || e.key === 'k') {
        e.preventDefault();
        togglePlay();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        seekRelative(-5);
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        seekRelative(5);
      } else if (e.key === 'm') {
        toggleMute();
      } else if (e.key === 'f') {
        toggleFullscreen();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [video, isPlaying, isMuted, isFullscreen]);

  if (!video) return null;

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play();
    }
  };

  const handleTimeUpdate = () => {
    if (!videoRef.current) return;
    setCurrentTime(videoRef.current.currentTime);
  };

  const handleLoadedMetadata = () => {
    if (!videoRef.current) return;
    setDuration(videoRef.current.duration || video.duration);
    videoRef.current.playbackRate = playbackSpeed;
    videoRef.current.play().catch(() => {
      // Auto-play was prevented by browser policy
      setIsPlaying(false);
    });
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    setCurrentTime(time);
    if (videoRef.current) {
      videoRef.current.currentTime = time;
    }
  };

  const seekRelative = (delta: number) => {
    if (!videoRef.current) return;
    const target = Math.min(Math.max(videoRef.current.currentTime + delta, 0), duration);
    videoRef.current.currentTime = target;
    setCurrentTime(target);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    if (videoRef.current) {
      videoRef.current.volume = val;
      videoRef.current.muted = val === 0;
      setIsMuted(val === 0);
    }
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    videoRef.current.muted = nextMuted;
  };

  const handleSpeedSelect = (speed: number) => {
    setPlaybackSpeed(speed);
    if (videoRef.current) {
      videoRef.current.playbackRate = speed;
    }
    setShowSpeedMenu(false);
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().then(() => setIsFullscreen(true)).catch(console.warn);
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false)).catch(console.warn);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-xs p-2 sm:p-4 lg:p-6 animate-in fade-in duration-200">
      <div
        ref={containerRef}
        onMouseMove={() => setControlsVisible(true)}
        className="relative w-full max-w-5xl bg-black rounded-2xl overflow-hidden shadow-2xl flex flex-col border border-slate-800"
      >
        {/* Top Control Bar */}
        <div
          className={`absolute top-0 inset-x-0 z-30 p-4 bg-gradient-to-b from-black/80 via-black/40 to-transparent flex items-center justify-between transition-opacity duration-200 ${
            controlsVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
        >
          <div className="flex items-center gap-2.5 max-w-[70%]">
            <span className="text-xs font-bold text-white bg-blue-600 px-2 py-0.5 rounded">
              {video.quality}
            </span>
            <h3 className="text-sm sm:text-base font-semibold text-white truncate" title={video.title}>
              {video.title}
            </h3>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowInfo(!showInfo)}
              className="p-2 rounded-full text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
              title={t.details}
            >
              <Info className="w-5 h-5" />
            </button>
            <button
              onClick={() => onDownload(video)}
              className="p-2 rounded-full text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
              title={t.download}
            >
              <Download className="w-5 h-5" />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-full text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
              title="Close (Esc)"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Video or Image Canvas Container */}
        <div
          className="relative w-full aspect-video flex items-center justify-center bg-black select-none cursor-pointer overflow-hidden"
          onClick={video.type === 'video' ? togglePlay : undefined}
        >
          {video.type === 'image' ? (
            <img
              src={video.url}
              alt={video.title}
              className="max-h-full max-w-full object-contain"
            />
          ) : (
            <>
              <video
                ref={videoRef}
                src={video.url}
                playsInline
                onTimeUpdate={handleTimeUpdate}
                onLoadedMetadata={handleLoadedMetadata}
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
                onEnded={() => setIsPlaying(false)}
                className="w-full h-full object-contain"
              />

              {/* Big Center Play/Pause Indicator when paused */}
              {!isPlaying && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/30 pointer-events-none">
                  <div className="w-16 h-16 rounded-full bg-blue-600/90 text-white flex items-center justify-center shadow-2xl backdrop-blur-xs">
                    <Play className="w-7 h-7 ml-1 fill-current" />
                  </div>
                </div>
              )}
            </>
          )}

          {/* Details Sidebar overlay */}
          {showInfo && (
            <div
              className="absolute top-16 right-4 z-40 w-72 bg-slate-900/95 border border-slate-700/80 rounded-xl p-4 text-xs text-slate-200 shadow-2xl backdrop-blur-md"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between pb-2 border-b border-slate-800 font-semibold text-white">
                <span>{t.details}</span>
                <button
                  onClick={() => setShowInfo(false)}
                  className="text-slate-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="mt-3 space-y-2 text-slate-300">
                <div className="flex justify-between">
                  <span className="text-slate-400">{t.quality}:</span>
                  <span className="font-semibold text-white">{video.quality}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">{t.duration}:</span>
                  <span className="font-mono tabular-nums">{formatDuration(duration || video.duration)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">{t.size}:</span>
                  <span className="font-mono tabular-nums">{formatBytes(video.size)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">{t.stored}:</span>
                  <span>{formatDate(video.createdAt, lang)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">{t.category}:</span>
                  <span className="capitalize">{video.category}</span>
                </div>
                {video.tags && video.tags.length > 0 && (
                  <div className="pt-2 border-t border-slate-800 text-[11px]">
                    <span className="text-slate-400">{lang === 'km' ? 'ស្លាកសម្គាល់' : 'Tags'}: </span>
                    <span className="text-slate-300">{video.tags.join(', ')}</span>
                  </div>
                )}
                <div className="pt-2 border-t border-slate-800 text-[11px] text-emerald-400 flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5" />
                  <span>Google Cloud Connected Vault</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Bottom Custom Playback Bar (Videos only) */}
        {video.type === 'video' && (
          <div
            className={`p-3 sm:p-4 bg-gradient-to-t from-black via-black/95 to-black/80 transition-opacity duration-200 ${
              controlsVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'
            }`}
            onClick={(e) => e.stopPropagation()}
          >
          {/* Progress Seekbar */}
          <div className="relative group w-full flex items-center mb-2.5">
            <input
              type="range"
              min={0}
              max={duration || 100}
              step={0.1}
              value={currentTime}
              onChange={handleSeek}
              className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-600 hover:h-2 transition-all"
            />
          </div>

          <div className="flex items-center justify-between text-white text-xs sm:text-sm">
            {/* Left Controls: Play, Skip, Volume, Time */}
            <div className="flex items-center gap-2 sm:gap-4">
              <button
                onClick={togglePlay}
                className="w-8 h-8 rounded-full bg-white text-slate-900 flex items-center justify-center hover:bg-slate-200 transition-colors"
              >
                {isPlaying ? (
                  <Pause className="w-4 h-4 fill-current" />
                ) : (
                  <Play className="w-4 h-4 fill-current ml-0.5" />
                )}
              </button>

              <button
                onClick={() => seekRelative(-10)}
                className="p-1 text-slate-300 hover:text-white transition-colors"
                title="Rewind 10s"
              >
                <RotateCcw className="w-4 h-4" />
              </button>

              <button
                onClick={() => seekRelative(10)}
                className="p-1 text-slate-300 hover:text-white transition-colors"
                title="Forward 10s"
              >
                <RotateCw className="w-4 h-4" />
              </button>

              {/* Volume control */}
              <div className="flex items-center gap-1.5 group">
                <button
                  onClick={toggleMute}
                  className="p-1 text-slate-300 hover:text-white transition-colors"
                >
                  {isMuted || volume === 0 ? (
                    <VolumeX className="w-4 h-4 text-red-400" />
                  ) : (
                    <Volume2 className="w-4 h-4" />
                  )}
                </button>
                <input
                  type="range"
                  min={0}
                  max={1}
                  step={0.05}
                  value={isMuted ? 0 : volume}
                  onChange={handleVolumeChange}
                  className="w-16 h-1 bg-slate-700 rounded appearance-none cursor-pointer accent-blue-600"
                />
              </div>

              {/* Timestamp */}
              <div className="text-[11px] sm:text-xs text-slate-300 font-mono tabular-nums">
                <span>{formatDuration(currentTime)}</span>
                <span className="mx-1 text-slate-500">/</span>
                <span>{formatDuration(duration || video.duration)}</span>
              </div>
            </div>

            {/* Right Controls: Speed, Fullscreen */}
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Speed Menu */}
              <div className="relative">
                <button
                  onClick={() => setShowSpeedMenu(!showSpeedMenu)}
                  className="px-2 py-1 rounded bg-slate-800 text-slate-300 hover:text-white text-xs font-semibold"
                >
                  {playbackSpeed}x
                </button>

                {showSpeedMenu && (
                  <div className="absolute bottom-8 right-0 bg-slate-900 border border-slate-700 rounded-lg shadow-xl p-1 text-xs z-50 min-w-[70px]">
                    {speeds.map((s) => (
                      <button
                        key={s}
                        onClick={() => handleSpeedSelect(s)}
                        className={`w-full px-2 py-1 text-left rounded hover:bg-slate-800 ${
                          playbackSpeed === s ? 'text-blue-400 font-bold' : 'text-slate-300'
                        }`}
                      >
                        {s}x
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Fullscreen Button */}
              <button
                onClick={toggleFullscreen}
                className="p-1.5 text-slate-300 hover:text-white transition-colors"
                title="Fullscreen (f)"
              >
                {isFullscreen ? (
                  <Minimize2 className="w-4 h-4" />
                ) : (
                  <Maximize2 className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  </div>
);
};
