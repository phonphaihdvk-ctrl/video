import React, { useState, useEffect, useRef } from 'react';
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  Minimize,
  X,
} from 'lucide-react';
import { StoredVideo } from '../types/video';

export interface VideoPlayerModalProps {
  videoId?: string;
  video?: (StoredVideo & { driveId?: string; name?: string; directUrl?: string }) | null;
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
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const hideTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Auto-hide controls state
  const [showControls, setShowControls] = useState(true);
  const [isPlaying, setIsPlaying] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(video?.duration || 0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Extract ID if a full Google Drive URL was passed
  const rawId = videoId || video?.driveId || video?.id || '';
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

  const videoTitle = video?.title || video?.name || 'Video Player';

  // Direct video stream support for HTML5 element
  const isDirectVideo = !!(
    (video?.id?.startsWith('demo_') || video?.id?.startsWith('local_')) ||
    video?.directUrl
  );
  const directSrc = video?.directUrl || (isDirectVideo ? video?.url : '');

  // Reset 2.5s inactivity timer
  const resetControlsTimer = () => {
    if (hideTimeoutRef.current) {
      clearTimeout(hideTimeoutRef.current);
    }
    if (isPlaying) {
      hideTimeoutRef.current = setTimeout(() => {
        setShowControls(false);
      }, 2500);
    }
  };

  // User activity on screen: wake up controls & restart timer
  const handleUserActivity = () => {
    setShowControls(true);
    resetControlsTimer();
  };

  // Screen tap to toggle controls
  const handleScreenTap = (e: React.MouseEvent | React.TouchEvent) => {
    // Prevent toggling if user tapped a control element
    if (e.target !== e.currentTarget && (e.target as HTMLElement).closest('button, input, a')) {
      return;
    }
    setShowControls((prev) => {
      const next = !prev;
      if (next) {
        resetControlsTimer();
      } else if (hideTimeoutRef.current) {
        clearTimeout(hideTimeoutRef.current);
      }
      return next;
    });
  };

  // Effect to manage inactivity timer based on playing state
  useEffect(() => {
    if (isPlaying) {
      resetControlsTimer();
    } else {
      setShowControls(true);
      if (hideTimeoutRef.current) {
        clearTimeout(hideTimeoutRef.current);
      }
    }
    return () => {
      if (hideTimeoutRef.current) {
        clearTimeout(hideTimeoutRef.current);
      }
    };
  }, [isPlaying]);

  // Fullscreen change listener to sync isFullscreen state
  useEffect(() => {
    const onFullscreenChange = () => {
      const doc = document as any;
      const isFull = !!(doc.fullscreenElement || doc.webkitFullscreenElement);
      setIsFullscreen(isFull);
    };

    document.addEventListener('fullscreenchange', onFullscreenChange);
    document.addEventListener('webkitfullscreenchange', onFullscreenChange);

    return () => {
      document.removeEventListener('fullscreenchange', onFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', onFullscreenChange);
    };
  }, []);

  // Keyboard navigation & body scroll lock
  useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (e: KeyboardEvent) => {
      handleUserActivity();
      if (e.key === 'Escape') {
        const doc = document as any;
        if (doc.fullscreenElement || doc.webkitFullscreenElement) {
          toggleFullscreen();
        } else {
          onClose();
        }
      } else if (e.key === ' ' || e.key === 'k') {
        e.preventDefault();
        togglePlayPause();
      } else if (e.key === 'f') {
        e.preventDefault();
        toggleFullscreen();
      } else if (e.key === 'm') {
        e.preventDefault();
        toggleMute();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose, isPlaying, isMuted, isFullscreen]);

  if (!videoId && !video) return null;

  // HTML5 Fullscreen API with vendor prefix support
  const toggleFullscreen = () => {
    const container = containerRef.current;
    if (!container) return;
    const doc = document as any;

    if (!doc.fullscreenElement && !doc.webkitFullscreenElement) {
      if (container.requestFullscreen) {
        container.requestFullscreen().catch(() => {});
      } else if ((container as any).webkitRequestFullscreen) {
        (container as any).webkitRequestFullscreen();
      }
    } else {
      if (doc.exitFullscreen) {
        doc.exitFullscreen().catch(() => {});
      } else if (doc.webkitExitFullscreen) {
        doc.webkitExitFullscreen();
      }
    }
  };

  // Play / Pause toggle
  const togglePlayPause = () => {
    if (isDirectVideo && videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play().catch(() => {});
      }
    } else {
      // Toggle simulated playback state for iframe
      setIsPlaying((prev) => !prev);
    }
    handleUserActivity();
  };

  // Volume / Mute toggle
  const toggleMute = () => {
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    if (videoRef.current) {
      videoRef.current.muted = nextMuted;
    }
    handleUserActivity();
  };

  // Volume slider
  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = parseFloat(e.target.value);
    setVolume(v);
    setIsMuted(v === 0);
    if (videoRef.current) {
      videoRef.current.volume = v;
      videoRef.current.muted = v === 0;
    }
    handleUserActivity();
  };

  // Timeline seek handler
  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const target = parseFloat(e.target.value);
    setCurrentTime(target);
    if (videoRef.current) {
      videoRef.current.currentTime = target;
    }
    handleUserActivity();
  };

  // Time format helper (e.g. 0:00 / 9:14)
  const formatDuration = (seconds: number): string => {
    if (!seconds || isNaN(seconds) || seconds < 0) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    const hours = Math.floor(mins / 60);
    if (hours > 0) {
      const remMins = mins % 60;
      return `${hours}:${remMins < 10 ? '0' : ''}${remMins}:${secs < 10 ? '0' : ''}${secs}`;
    }
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-50 bg-black w-screen h-screen overflow-hidden flex items-center justify-center select-none"
      onMouseMove={handleUserActivity}
      onTouchStart={handleUserActivity}
      onClick={handleScreenTap}
    >
      {/* Responsive Video Viewport */}
      <div className="relative w-full h-full flex items-center justify-center bg-black overflow-hidden">
        {isDirectVideo && directSrc ? (
          <video
            ref={videoRef}
            src={directSrc}
            autoPlay
            playsInline
            onTimeUpdate={() => {
              if (videoRef.current) setCurrentTime(videoRef.current.currentTime);
            }}
            onLoadedMetadata={() => {
              if (videoRef.current) {
                setDuration(videoRef.current.duration || video?.duration || 0);
                videoRef.current.play().catch(() => setIsPlaying(false));
              }
            }}
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
            onEnded={() => setIsPlaying(false)}
            className="w-full h-full object-contain pointer-events-auto"
          />
        ) : (
          <iframe
            src={`https://drive.google.com/file/d/${finalVideoId}/preview`}
            className="w-full h-full border-0 pointer-events-auto"
            allow="autoplay; fullscreen"
            allowFullScreen
            title={videoTitle}
          />
        )}
      </div>

      {/* Top Header Bar: Clean floating gradient with title & sleek Close button (✕) */}
      <div
        className={`absolute top-0 inset-x-0 z-40 p-4 sm:p-6 bg-gradient-to-b from-black/85 via-black/40 to-transparent flex items-center justify-between transition-opacity duration-300 ${
          showControls ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex-1 mr-4 min-w-0">
          <h2
            className="text-sm sm:text-base font-semibold text-white drop-shadow-md truncate"
            title={videoTitle}
          >
            {videoTitle}
          </h2>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="p-2 sm:p-2.5 rounded-full bg-black/60 hover:bg-black/80 text-white backdrop-blur-md transition cursor-pointer active:scale-95 border border-white/20 shadow-lg shrink-0 flex items-center justify-center"
          title="Close Player"
          aria-label="Close Player"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Center Big Play/Pause Touch Target (visible when paused or toggling) */}
      {!isPlaying && (
        <div
          className={`absolute inset-0 flex items-center justify-center pointer-events-none transition-opacity duration-300 ${
            showControls ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <button
            type="button"
            onClick={togglePlayPause}
            className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-black/60 backdrop-blur-md text-white border border-white/30 flex items-center justify-center shadow-2xl pointer-events-auto cursor-pointer hover:scale-105 active:scale-95 transition-transform"
            aria-label="Play video"
          >
            <Play className="w-8 h-8 sm:w-10 sm:h-10 fill-current ml-1" />
          </button>
        </div>
      )}

      {/* Bottom Unified Mobile Control Bar */}
      <div
        className={`absolute bottom-0 inset-x-0 z-40 p-4 sm:p-6 bg-gradient-to-t from-black/95 via-black/70 to-transparent flex flex-col gap-2.5 transition-opacity duration-300 ${
          showControls ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Interactive Timeline / Progress Slider */}
        <div className="relative group w-full flex items-center">
          <input
            type="range"
            min={0}
            max={duration || 100}
            step={0.1}
            value={currentTime}
            onChange={handleSeek}
            onMouseDown={() => {
              if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current);
            }}
            onMouseUp={() => resetControlsTimer()}
            onTouchStart={() => {
              if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current);
            }}
            onTouchEnd={() => resetControlsTimer()}
            className="w-full h-1.5 sm:h-2 bg-white/25 hover:bg-white/40 rounded-lg appearance-none cursor-pointer accent-sky-500 focus:outline-hidden transition-all"
            aria-label="Video timeline slider"
          />
        </div>

        {/* Controls Row */}
        <div className="flex items-center justify-between text-white text-xs sm:text-sm">
          {/* Left Controls: Play/Pause, Volume, Time */}
          <div className="flex items-center gap-3 sm:gap-4">
            <button
              type="button"
              onClick={togglePlayPause}
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white text-black flex items-center justify-center hover:bg-slate-200 transition active:scale-95 cursor-pointer shadow-md"
              aria-label={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying ? (
                <Pause className="w-4 h-4 sm:w-5 sm:h-5 fill-current" />
              ) : (
                <Play className="w-4 h-4 sm:w-5 sm:h-5 fill-current ml-0.5" />
              )}
            </button>

            {/* Volume / Mute Toggle */}
            <div className="flex items-center gap-1.5 group">
              <button
                type="button"
                onClick={toggleMute}
                className="p-1.5 text-slate-200 hover:text-white transition cursor-pointer active:scale-95"
                aria-label={isMuted ? 'Unmute' : 'Mute'}
              >
                {isMuted || volume === 0 ? (
                  <VolumeX className="w-5 h-5 text-rose-400" />
                ) : (
                  <Volume2 className="w-5 h-5" />
                )}
              </button>
              <input
                type="range"
                min={0}
                max={1}
                step={0.05}
                value={isMuted ? 0 : volume}
                onChange={handleVolumeChange}
                className="w-14 sm:w-20 h-1 bg-white/25 rounded-lg appearance-none cursor-pointer accent-sky-500 hidden sm:block"
                aria-label="Volume slider"
              />
            </div>

            {/* Current Time / Total Duration */}
            <div className="text-[11px] sm:text-xs text-slate-200 font-mono tracking-tight tabular-nums select-none">
              <span>{formatDuration(currentTime)}</span>
              <span className="mx-1 text-slate-400">/</span>
              <span>{formatDuration(duration)}</span>
            </div>
          </div>

          {/* Right Controls: True Native Fullscreen Button (⛶) */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={toggleFullscreen}
              className="p-2 sm:p-2.5 rounded-lg hover:bg-white/10 text-slate-200 hover:text-white transition cursor-pointer active:scale-95 flex items-center justify-center"
              title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen (⛶)'}
              aria-label="Toggle Fullscreen"
            >
              {isFullscreen ? (
                <Minimize className="w-5 h-5" />
              ) : (
                <Maximize className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoPlayerModal;
