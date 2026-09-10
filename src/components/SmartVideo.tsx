import { useEffect, useRef, useState, type MouseEvent } from 'react';
import { Volume2, VolumeX, Play, Pause, Maximize2 } from 'lucide-react';

interface SmartVideoProps {
  src: string;
  poster?: string;
  aspectRatio?: string;
  className?: string;
  autoPlay?: boolean;
  loop?: boolean;
  mutedDefault?: boolean;
  showControlsOverlay?: boolean;
  title?: string;
  priority?: boolean;
}

export function SmartVideo({
  src,
  poster,
  aspectRatio = '16/9',
  className = '',
  autoPlay = true,
  loop = true,
  mutedDefault = true,
  showControlsOverlay = true,
  title,
  priority = false
}: SmartVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(mutedDefault);
  const [isBuffering, setIsBuffering] = useState(true);
  const [isInViewport, setIsInViewport] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [showOverlay, setShowOverlay] = useState(false);

  // Viewport intersection observer to pause video when offscreen (bandwidth saving)
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          setIsInViewport(entry.isIntersecting);
        });
      },
      {
        root: null,
        rootMargin: '160px 0px', // start preloading/playing slightly before entering viewport
        threshold: 0.1
      }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Control video playback based on viewport visibility
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (isInViewport && autoPlay) {
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            setIsPlaying(true);
            setIsBuffering(false);
          })
          .catch(() => {
            // Autoplay policy fallback: ensure muted and retry
            video.muted = true;
            setIsMuted(true);
            video.play().catch(() => {
              setIsPlaying(false);
            });
          });
      }
    } else {
      if (!video.paused) {
        video.pause();
        setIsPlaying(false);
      }
    }
  }, [isInViewport, autoPlay]);

  const togglePlay = (e: MouseEvent) => {
    e.stopPropagation();
    const video = videoRef.current;
    if (!video) return;

    if (video.paused) {
      video.play().then(() => setIsPlaying(true)).catch(() => {});
    } else {
      video.pause();
      setIsPlaying(false);
    }
  };

  const toggleMute = (e: MouseEvent) => {
    e.stopPropagation();
    const video = videoRef.current;
    if (!video) return;

    video.muted = !video.muted;
    setIsMuted(video.muted);
  };

  const toggleFullscreen = (e: MouseEvent) => {
    e.stopPropagation();
    const video = videoRef.current;
    if (!video) return;

    if (document.fullscreenElement) {
      document.exitFullscreen().catch(() => {});
    } else {
      if (video.requestFullscreen) {
        video.requestFullscreen().catch(() => {});
      }
    }
  };

  return (
    <div
      ref={containerRef}
      id={`video-container-${title ? title.toLowerCase().replace(/\s+/g, '-') : 'player'}`}
      className={`relative overflow-hidden bg-[#0c0c0e] group select-none ${className}`}
      style={{ aspectRatio }}
      onMouseEnter={() => setShowOverlay(true)}
      onMouseLeave={() => setShowOverlay(false)}
    >
      {/* HTML5 Direct Video Element */}
      <video
        ref={videoRef}
        src={src}
        poster={poster}
        autoPlay={autoPlay}
        loop={loop}
        muted={isMuted}
        playsInline
        preload={priority ? 'auto' : 'metadata'}
        onWaiting={() => setIsBuffering(true)}
        onPlaying={() => {
          setIsBuffering(false);
          setIsPlaying(true);
        }}
        onPause={() => setIsPlaying(false)}
        onError={() => {
          setHasError(true);
          setIsBuffering(false);
        }}
        className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-[1.015]"
      />

      {/* Error fallback display */}
      {hasError && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#09090b]/90 p-4 text-center z-20">
          <p className="text-xs font-mono uppercase tracking-wider text-zinc-400">Direct Video Feed</p>
          <p className="text-sm text-zinc-300 mt-1 max-w-sm">Video stream placeholder is loading or awaiting custom direct MP4 file.</p>
          <button
            onClick={() => {
              setHasError(false);
              videoRef.current?.load();
            }}
            className="mt-3 px-3 py-1.5 text-xs font-mono tracking-widest uppercase bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded transition-colors"
          >
            Retry Feed
          </button>
        </div>
      )}

      {/* Subtle Loading Pulse when buffering */}
      {isBuffering && !hasError && (
        <div className="absolute top-4 right-4 z-10 pointer-events-none flex items-center gap-2 px-2 py-1 rounded bg-black/40 backdrop-blur-xs text-[10px] font-mono tracking-widest text-zinc-400 uppercase">
          <span className="w-1.5 h-1.5 rounded-full bg-zinc-400 animate-pulse" />
          <span>SYNCING</span>
        </div>
      )}

      {/* Discrete Motion Studio Controls Overlay */}
      {showControlsOverlay && (
        <div
          className={`absolute bottom-3 right-3 z-20 flex items-center gap-1.5 transition-opacity duration-300 ${
            showOverlay || !isPlaying ? 'opacity-100' : 'opacity-0 md:group-hover:opacity-100'
          }`}
        >
          <button
            type="button"
            id={`play-toggle-${title ? title.toLowerCase().replace(/\s+/g, '-') : 'btn'}`}
            onClick={togglePlay}
            aria-label={isPlaying ? 'Pause video' : 'Play video'}
            className="w-8 h-8 rounded-full bg-black/60 hover:bg-black/90 text-zinc-200 hover:text-white flex items-center justify-center backdrop-blur-xs transition-colors border border-white/10"
          >
            {isPlaying ? <Pause size={13} /> : <Play size={13} className="translate-x-[0.5px]" />}
          </button>

          <button
            type="button"
            id={`mute-toggle-${title ? title.toLowerCase().replace(/\s+/g, '-') : 'btn'}`}
            onClick={toggleMute}
            aria-label={isMuted ? 'Unmute video sound' : 'Mute video sound'}
            className="w-8 h-8 rounded-full bg-black/60 hover:bg-black/90 text-zinc-200 hover:text-white flex items-center justify-center backdrop-blur-xs transition-colors border border-white/10"
          >
            {isMuted ? <VolumeX size={13} /> : <Volume2 size={13} />}
          </button>

          <button
            type="button"
            id={`fullscreen-toggle-${title ? title.toLowerCase().replace(/\s+/g, '-') : 'btn'}`}
            onClick={toggleFullscreen}
            aria-label="Toggle fullscreen"
            className="w-8 h-8 rounded-full bg-black/60 hover:bg-black/90 text-zinc-200 hover:text-white hidden sm:flex items-center justify-center backdrop-blur-xs transition-colors border border-white/10"
          >
            <Maximize2 size={12} />
          </button>
        </div>
      )}

      {/* Cinematic subtle edge vignette */}
      <div className="absolute inset-0 pointer-events-none shadow-[inset_0_0_80px_rgba(0,0,0,0.45)]" />
    </div>
  );
}
