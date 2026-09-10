import { useEffect, useRef, useState, type MouseEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Volume2, VolumeX, Play, Pause, Maximize } from 'lucide-react';

interface ShowreelModalProps {
  isOpen: boolean;
  onClose: () => void;
  videoUrl: string;
  posterUrl: string;
  designerName: string;
}

export function ShowreelModal({
  isOpen,
  onClose,
  videoUrl,
  posterUrl,
  designerName
}: ShowreelModalProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState('00:00');
  const [duration, setDuration] = useState('00:00');

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === ' ') {
        e.preventDefault();
        togglePlay();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      video.play().then(() => setIsPlaying(true)).catch(() => {});
    } else {
      video.pause();
      setIsPlaying(false);
    }
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = !video.muted;
    setIsMuted(video.muted);
  };

  const handleTimeUpdate = () => {
    const video = videoRef.current;
    if (!video || !video.duration) return;
    setProgress((video.currentTime / video.duration) * 100);

    const curM = Math.floor(video.currentTime / 60);
    const curS = Math.floor(video.currentTime % 60);
    setCurrentTime(`${String(curM).padStart(2, '0')}:${String(curS).padStart(2, '0')}`);

    const durM = Math.floor(video.duration / 60);
    const durS = Math.floor(video.duration % 60);
    setDuration(`${String(durM).padStart(2, '0')}:${String(durS).padStart(2, '0')}`);
  };

  const handleSeek = (e: MouseEvent<HTMLDivElement>) => {
    const video = videoRef.current;
    const rect = e.currentTarget.getBoundingClientRect();
    const pos = (e.clientX - rect.left) / rect.width;
    if (video && video.duration) {
      video.currentTime = pos * video.duration;
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[200] bg-black/95 backdrop-blur-md flex flex-col justify-between p-4 sm:p-8"
        >
          {/* Top Bar */}
          <div className="flex items-center justify-between text-xs font-mono tracking-widest text-zinc-400 uppercase z-10">
            <div className="flex items-center gap-3">
              <span className="text-white font-bold">{designerName}</span>
              <span>//</span>
              <span>FULL SHOWREEL CUT (DIRECT MP4)</span>
            </div>

            <button
              id="close-reel-modal-btn"
              onClick={onClose}
              className="p-2.5 rounded-full border border-white/20 text-zinc-300 hover:text-white hover:bg-white/10 transition-colors flex items-center gap-2 cursor-pointer"
            >
              <span>CLOSE [ESC]</span>
              <X size={16} />
            </button>
          </div>

          {/* Center Stage Video */}
          <div className="relative flex-1 flex items-center justify-center my-4 overflow-hidden max-w-6xl mx-auto w-full">
            <video
              ref={videoRef}
              src={videoUrl}
              poster={posterUrl}
              autoPlay
              playsInline
              loop
              muted={isMuted}
              onTimeUpdate={handleTimeUpdate}
              onClick={togglePlay}
              className="w-full h-full max-h-[75vh] object-contain rounded-xl shadow-2xl cursor-pointer"
            />
          </div>

          {/* Bottom Timeline & Controls */}
          <div className="max-w-6xl mx-auto w-full flex flex-col gap-3 font-mono text-xs z-10">
            {/* Scrubber Bar */}
            <div
              onClick={handleSeek}
              className="h-1.5 bg-white/20 hover:h-2.5 transition-all rounded-full cursor-pointer overflow-hidden relative"
            >
              <div
                className="h-full bg-white transition-all duration-100"
                style={{ width: `${progress}%` }}
              />
            </div>

            <div className="flex items-center justify-between text-zinc-400">
              <div className="flex items-center gap-4">
                <button
                  onClick={togglePlay}
                  className="flex items-center gap-1.5 text-zinc-200 hover:text-white"
                >
                  {isPlaying ? <Pause size={14} /> : <Play size={14} />}
                  <span>{isPlaying ? 'PAUSE' : 'PLAY'}</span>
                </button>

                <button
                  onClick={toggleMute}
                  className="flex items-center gap-1.5 text-zinc-200 hover:text-white"
                >
                  {isMuted ? <VolumeX size={14} /> : <Volume2 size={14} />}
                  <span>{isMuted ? 'UNMUTE' : 'MUTE'}</span>
                </button>

                <span className="text-zinc-600">|</span>
                <span className="text-zinc-300">
                  {currentTime} / {duration}
                </span>
              </div>

              <div className="flex items-center gap-2 text-zinc-500">
                <Maximize size={12} />
                <span>HTML5 NATIVE PLAYBACK</span>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
