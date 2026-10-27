import React from 'react';
import { VideoModal } from './VideoModal';

export interface VideoPlayerModalProps {
  videoId?: string;
  videoUrl?: string;
  video?: { id?: string; driveId?: string; url?: string; [key: string]: any } | null;
  onClose: () => void;
  lang?: any;
  onDownload?: any;
  [key: string]: any;
}

export const VideoPlayerModal: React.FC<VideoPlayerModalProps> = ({
  videoId,
  videoUrl,
  video,
  onClose,
  ...rest
}) => {
  const resolvedId = videoId || video?.driveId || video?.id;
  const resolvedUrl = videoUrl || video?.url;

  return (
    <VideoModal
      videoId={resolvedId}
      videoUrl={resolvedUrl}
      onClose={onClose}
      {...rest}
    />
  );
};

export { VideoModal };
export default VideoPlayerModal;
