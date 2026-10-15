'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Project } from '@/types';
import { 
  X, 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  Maximize, 
  Film, 
  CheckCircle, 
  ArrowRight,
  AlertCircle
} from 'lucide-react';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';

interface VideoPlayerModalProps {
  project: Project | null;
  isOpen: boolean;
  onClose: () => void;
}

interface VideoPlayerModalContentProps {
  project: Project;
  onClose: () => void;
}

const VideoPlayerModalContent: React.FC<VideoPlayerModalContentProps> = ({
  project,
  onClose,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [videoError, setVideoError] = useState(false);

  // Close on ESC key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play().catch(() => {
          setVideoError(true);
        });
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const targetTime = parseFloat(e.target.value);
    if (videoRef.current) {
      videoRef.current.currentTime = targetTime;
      setCurrentTime(targetTime);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleFullscreen = () => {
    if (videoRef.current) {
      if (videoRef.current.requestFullscreen) {
        videoRef.current.requestFullscreen();
      }
    }
  };

  const isVertical = project.aspectRatio === '9:16';

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={project.title}
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 md:p-8 bg-black/90 backdrop-blur-xl animate-in fade-in duration-200"
    >
      {/* Backdrop click handler */}
      <div 
        className="absolute inset-0" 
        onClick={onClose}
        aria-hidden="true" 
      />

      {/* Modal Dialog Card */}
      <div className="relative z-10 w-full max-w-5xl max-h-[92vh] flex flex-col bg-[#121217] border border-white/10 rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden">
        {/* Top Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/10 bg-[#15151D]/80">
          <div className="flex items-center gap-3 overflow-hidden">
            <span className="p-1.5 rounded-lg bg-violet-600/20 text-violet-400">
              <Film className="w-4 h-4" />
            </span>
            <div className="truncate">
              <div className="flex items-center gap-2">
                <span className="text-xs text-violet-400 font-medium tracking-wide uppercase">
                  {project.categoryLabel}
                </span>
                <span className="text-xs text-gray-500">•</span>
                <span className="text-xs text-gray-400">{project.client}</span>
              </div>
              <h3 className="text-base sm:text-lg font-semibold text-white truncate">
                {project.title}
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Badge variant="sample" size="sm">Staged Project</Badge>
            <button
              onClick={onClose}
              aria-label="Close modal"
              className="p-2 rounded-xl text-gray-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Media / Video Stage */}
        <div className="relative flex-1 min-h-[280px] sm:min-h-[420px] max-h-[58vh] bg-black flex items-center justify-center overflow-hidden">
          {project.hasPlayableMedia && project.videoUrl && !videoError ? (
            <div className={`relative w-full h-full flex items-center justify-center ${isVertical ? 'max-w-xs sm:max-w-sm mx-auto' : ''}`}>
              <video
                ref={videoRef}
                src={project.videoUrl}
                poster={project.thumbnailUrl}
                onTimeUpdate={handleTimeUpdate}
                onLoadedMetadata={handleLoadedMetadata}
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
                onError={() => setVideoError(true)}
                playsInline
                className="w-full h-full object-contain max-h-[54vh]"
              />

              {/* Big Center Play Overlay Button */}
              {!isPlaying && (
                <button
                  onClick={togglePlay}
                  aria-label="Play video"
                  className="absolute inset-0 m-auto w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-violet-600/90 text-white flex items-center justify-center shadow-xl shadow-violet-900/60 hover:scale-110 active:scale-95 transition-all cursor-pointer backdrop-blur-sm"
                >
                  <Play className="w-7 h-7 sm:w-8 sm:h-8 fill-current ml-1" />
                </button>
              )}

              {/* Bottom Custom Playbar */}
              <div className="absolute bottom-0 inset-x-0 p-3 sm:p-4 bg-gradient-to-t from-black/90 via-black/50 to-transparent flex flex-col gap-2">
                <input
                  type="range"
                  min="0"
                  max={duration || 100}
                  value={currentTime}
                  onChange={handleSeek}
                  aria-label="Video timeline scrubber"
                  className="w-full h-1 bg-white/20 rounded-lg appearance-none cursor-pointer accent-violet-500 hover:h-1.5 transition-all"
                />

                <div className="flex items-center justify-between text-xs text-gray-300">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={togglePlay}
                      aria-label={isPlaying ? 'Pause' : 'Play'}
                      className="p-1.5 rounded-lg hover:bg-white/10 text-white"
                    >
                      {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current" />}
                    </button>

                    <button
                      onClick={toggleMute}
                      aria-label={isMuted ? 'Unmute' : 'Mute'}
                      className="p-1.5 rounded-lg hover:bg-white/10 text-white"
                    >
                      {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                    </button>

                    <span className="font-mono text-gray-400">
                      {formatTime(currentTime)} / {formatTime(duration || 0)}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-white/10 text-[11px] font-mono text-violet-300">
                      {project.aspectRatio}
                    </span>
                    <button
                      onClick={handleFullscreen}
                      aria-label="Fullscreen"
                      className="p-1.5 rounded-lg hover:bg-white/10 text-white"
                    >
                      <Maximize className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* Dedicated Empty/Placeholder State */
            <div className="relative w-full h-full flex flex-col items-center justify-center p-8 sm:p-12 text-center bg-gradient-to-b from-[#181822] to-[#0D0D11]">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-violet-950/50 border border-violet-500/30 flex items-center justify-center text-violet-400 mb-5 shadow-lg shadow-violet-950/50">
                <Film className="w-8 h-8 sm:w-10 sm:h-10 opacity-90" />
              </div>

              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-950/40 border border-amber-500/30 text-amber-300 text-xs font-medium mb-3">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>Media Staged For Production</span>
              </div>

              <h4 className="text-xl sm:text-2xl font-bold text-white max-w-lg mb-2">
                Sample Showcase Asset
              </h4>
              <p className="text-sm sm:text-base text-gray-400 max-w-md mx-auto mb-6 leading-relaxed">
                This project demonstrates agency portfolio structuring and metadata. The full 4K master playback file will be linked via the Supabase admin CMS.
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-lg w-full mb-6 text-left">
                <div className="p-3 rounded-xl bg-white/5 border border-white/5">
                  <div className="text-[10px] text-gray-400 uppercase tracking-wider">Format</div>
                  <div className="text-xs font-semibold text-white mt-0.5">4K UHD ProRes</div>
                </div>
                <div className="p-3 rounded-xl bg-white/5 border border-white/5">
                  <div className="text-[10px] text-gray-400 uppercase tracking-wider">Aspect</div>
                  <div className="text-xs font-semibold text-white mt-0.5">{project.aspectRatio}</div>
                </div>
                <div className="p-3 rounded-xl bg-white/5 border border-white/5">
                  <div className="text-[10px] text-gray-400 uppercase tracking-wider">Runtime</div>
                  <div className="text-xs font-semibold text-white mt-0.5">{project.duration}</div>
                </div>
                <div className="p-3 rounded-xl bg-white/5 border border-white/5">
                  <div className="text-[10px] text-gray-400 uppercase tracking-wider">Year</div>
                  <div className="text-xs font-semibold text-white mt-0.5">{project.year}</div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Info Bottom Drawer */}
        <div className="p-5 sm:p-6 bg-[#15151D] border-t border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-4 overflow-y-auto max-h-[30vh]">
          <div className="space-y-2 max-w-2xl">
            <p className="text-sm text-gray-300 leading-relaxed">
              {project.longDescription || project.description}
            </p>

            <div className="flex flex-wrap items-center gap-2 pt-1">
              <span className="text-xs text-gray-500 font-medium">Deliverables:</span>
              {project.deliverables.map((item, i) => (
                <span
                  key={i}
                  className="inline-flex items-center gap-1 text-[11px] px-2.5 py-0.5 rounded-md bg-white/5 border border-white/10 text-gray-300"
                >
                  <CheckCircle className="w-3 h-3 text-violet-400" />
                  {item}
                </span>
              ))}
            </div>

            {project.toolsUsed && project.toolsUsed.length > 0 && (
              <div className="flex flex-wrap items-center gap-2 pt-1 text-xs text-gray-400">
                <span className="text-gray-500 font-medium">Tools:</span>
                {project.toolsUsed.map((tool, idx) => (
                  <span key={idx} className="text-violet-300 font-mono text-[11px]">
                    {tool}{idx < project.toolsUsed.length - 1 ? ' • ' : ''}
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-white/10">
            {project.metrics?.views && (
              <div className="px-3.5 py-2 rounded-xl bg-violet-950/40 border border-violet-500/20 text-center">
                <div className="text-[10px] uppercase tracking-wider text-violet-300/80">Performance</div>
                <div className="text-xs font-bold text-white">{project.metrics.views}</div>
              </div>
            )}
            <Button
              href="/contact"
              variant="primary"
              size="sm"
              icon={<ArrowRight className="w-4 h-4" />}
            >
              Request Similar Project
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export const VideoPlayerModal: React.FC<VideoPlayerModalProps> = ({
  project,
  isOpen,
  onClose,
}) => {
  if (!isOpen || !project) return null;

  return (
    <VideoPlayerModalContent
      key={project.id}
      project={project}
      onClose={onClose}
    />
  );
};
