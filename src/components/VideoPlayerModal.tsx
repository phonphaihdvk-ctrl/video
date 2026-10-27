import React from 'react';
import { VideoModal } from './VideoModal';

export interface VideoPlayerModalProps {
  videoId?: string;
  video?: { id?: string; driveId?: string; [key: string]: any } | null;
  onClose: () => void;
  lang?: any;
  onDownload?: any;
}

export const VideoPlayerModal: React.FC<VideoPlayerModalProps> = ({
  videoId,
  video,
  onClose,
}) => {
  const resolvedId = videoId || video?.driveId || video?.id || '';

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

  if (!finalVideoId) return null;

  return <VideoModal videoId={finalVideoId} onClose={onClose} />;
};

export { VideoModal };
export default VideoPlayerModal;
