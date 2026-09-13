import { useState, useRef, useEffect, useCallback, type TouchEvent, type MouseEvent } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { Project } from '../types';
import { getOptimizedVideoUrl, getOptimizedPosterUrl } from '../utils/cloudinary';

interface MobileCardDeckProps {
  projects: Project[];
  activeIndex: number;
  onIndexChange: (newIndex: number) => void;
  onSelectProject: (project: Project) => void;
  isModalOpen?: boolean;
}

interface TouchSample {
  x: number;
  time: number;
}

export function MobileCardDeck({
  projects,
  activeIndex,
  onIndexChange,
  onSelectProject,
  isModalOpen = false
}: MobileCardDeckProps) {
  const total = projects.length;
  const deckContainerRef = useRef<HTMLDivElement>(null);
  const [isDeckInViewport, setIsDeckInViewport] = useState(true);
  const [failedVideos, setFailedVideos] = useState<{ [key: string]: boolean }>({});

  // Continuous float representing real-time visual center position
  const [virtualIndex, setVirtualIndex] = useState<number>(activeIndex);
  const virtualIndexRef = useRef<number>(activeIndex);
  virtualIndexRef.current = virtualIndex;

  const [isDragging, setIsDragging] = useState(false);
  const isDraggingRef = useRef(false);
  isDraggingRef.current = isDragging;

  const touchStartX = useRef(0);
  const touchStartY = useRef(0);
  const startVirtualIndex = useRef(activeIndex);
  const isHorizontalSwipe = useRef<boolean | null>(null);
  const touchSamples = useRef<TouchSample[]>([]);
  const animFrameId = useRef<number | null>(null);
  const targetIndexRef = useRef<number>(activeIndex);
  const videoRefs = useRef<{ [key: string]: HTMLVideoElement | null }>({});

  // Viewport observer: pause videos when mobile gallery is off-screen
  useEffect(() => {
    const el = deckContainerRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsDeckInViewport(entry.isIntersecting && entry.intersectionRatio > 0.15);
      },
      { threshold: [0, 0.15, 0.5] }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Helper to calculate cyclic shortest difference between an item and the current float position
  const getCyclicDiff = useCallback(
    (itemIndex: number, centerFloat: number) => {
      if (!Number.isFinite(centerFloat) || total === 0) return 0;
      let diff = (itemIndex - ((centerFloat % total) + total) % total);
      if (diff > total / 2) diff -= total;
      if (diff < -total / 2) diff += total;
      return Number.isFinite(diff) ? diff : 0;
    },
    [total]
  );

  // Smooth animation driver toward target virtual index with spring easing
  const animateTo = useCallback(
    (target: number) => {
      if (!Number.isFinite(target)) return;
      if (animFrameId.current) {
        cancelAnimationFrame(animFrameId.current);
        animFrameId.current = null;
      }

      targetIndexRef.current = target;

      const step = () => {
        const current = Number.isFinite(virtualIndexRef.current) ? virtualIndexRef.current : 0;
        const dist = targetIndexRef.current - current;

        // Damped spring interpolation for buttery smooth glide
        if (Math.abs(dist) < 0.003) {
          virtualIndexRef.current = targetIndexRef.current;
          setVirtualIndex(targetIndexRef.current);
          const normalized = ((Math.round(targetIndexRef.current) % total) + total) % total;
          onIndexChange(normalized);
          animFrameId.current = null;
          return;
        }

        const nextVal = current + dist * 0.16;
        if (!Number.isFinite(nextVal)) {
          animFrameId.current = null;
          return;
        }
        virtualIndexRef.current = nextVal;
        setVirtualIndex(nextVal);
        animFrameId.current = requestAnimationFrame(step);
      };

      animFrameId.current = requestAnimationFrame(step);
    },
    [onIndexChange, total]
  );

  // Synchronize when activeIndex prop changes from parent (e.g., header arrows)
  useEffect(() => {
    if (isDraggingRef.current) return;
    const currentRounded = Math.round(virtualIndexRef.current);
    const diff = getCyclicDiff(activeIndex, currentRounded);
    if (Math.abs(diff) > 0.001) {
      animateTo(virtualIndexRef.current + diff);
    }
  }, [activeIndex, animateTo, getCyclicDiff]);

  // Clean up RAF on unmount
  useEffect(() => {
    return () => {
      if (animFrameId.current) cancelAnimationFrame(animFrameId.current);
    };
  }, []);

  // Play center card video and pause others (only when deck is in viewport)
  useEffect(() => {
    projects.forEach((p, idx) => {
      const vid = videoRefs.current[p.id];
      if (!vid) return;

      const diff = Math.abs(getCyclicDiff(idx, virtualIndex));
      const isCenter = diff < 0.4 && !isModalOpen && isDeckInViewport;

      if (isCenter) {
        const playPromise = vid.play();
        if (playPromise !== undefined) {
          playPromise.catch(() => {});
        }
      } else {
        vid.pause();
      }
    });
  }, [virtualIndex, isModalOpen, isDeckInViewport, projects, getCyclicDiff]);

  // Touch Handlers: High-responsiveness, free-flowing momentum gesture physics
  const handleTouchStart = (e: TouchEvent) => {
    if (animFrameId.current) {
      cancelAnimationFrame(animFrameId.current);
      animFrameId.current = null;
    }

    const touch = e.touches[0];
    touchStartX.current = touch.clientX;
    touchStartY.current = touch.clientY;
    startVirtualIndex.current = Number.isFinite(virtualIndexRef.current) ? virtualIndexRef.current : 0;
    isHorizontalSwipe.current = null;
    touchSamples.current = [{ x: touch.clientX, time: performance.now() }];
    setIsDragging(true);
  };

  const handleTouchMove = (e: TouchEvent) => {
    if (!isDraggingRef.current) return;
    const touch = e.touches[0];
    const dx = touch.clientX - touchStartX.current;
    const dy = touch.clientY - touchStartY.current;

    // Detect gesture intent quickly
    if (isHorizontalSwipe.current === null) {
      if (Math.abs(dx) > 6 || Math.abs(dy) > 6) {
        isHorizontalSwipe.current = Math.abs(dx) > Math.abs(dy);
      }
    }

    if (isHorizontalSwipe.current) {
      if (e.cancelable) e.preventDefault();

      // Card sensitivity (pixels required to travel 1 card unit - fluid & responsive)
      const cardSpacingPx = 180;
      const baseVal = Number.isFinite(startVirtualIndex.current) ? startVirtualIndex.current : 0;
      const nextIndex = baseVal - dx / cardSpacingPx;
      if (Number.isFinite(nextIndex)) {
        virtualIndexRef.current = nextIndex;
        setVirtualIndex(nextIndex);
      }

      // Record recent touch samples for velocity calculation
      const now = performance.now();
      touchSamples.current.push({ x: touch.clientX, time: now });
      // Keep only recent samples within last 120ms
      touchSamples.current = touchSamples.current.filter((s) => now - s.time <= 120);
    }
  };

  const handleTouchEnd = () => {
    if (!isDraggingRef.current) return;
    setIsDragging(false);

    // Calculate instantaneous release velocity
    const samples = touchSamples.current;
    let velocity = 0; // px/ms
    if (samples.length >= 2) {
      const first = samples[0];
      const last = samples[samples.length - 1];
      const dt = last.time - first.time;
      if (dt > 10) {
        velocity = (last.x - first.x) / dt;
      }
    }

    // Convert velocity to card momentum projection
    // A fast flick glides smoothly across 1, 2, or 3 cards freely
    const flickMomentum = -velocity * 0.38;
    const baseVal = Number.isFinite(virtualIndexRef.current) ? virtualIndexRef.current : 0;
    const target = Number.isFinite(flickMomentum) ? Math.round(baseVal + flickMomentum) : Math.round(baseVal);

    animateTo(target);
  };

  // Mouse Handlers for Desktop Touch Emulation
  const isMouseDown = useRef(false);

  const handleMouseDown = (e: MouseEvent) => {
    if (animFrameId.current) {
      cancelAnimationFrame(animFrameId.current);
      animFrameId.current = null;
    }
    isMouseDown.current = true;
    touchStartX.current = e.clientX;
    startVirtualIndex.current = Number.isFinite(virtualIndexRef.current) ? virtualIndexRef.current : 0;
    touchSamples.current = [{ x: e.clientX, time: performance.now() }];
    setIsDragging(true);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isMouseDown.current) return;
    const dx = e.clientX - touchStartX.current;
    const cardSpacingPx = 180;
    const baseVal = Number.isFinite(startVirtualIndex.current) ? startVirtualIndex.current : 0;
    const nextIndex = baseVal - dx / cardSpacingPx;
    if (Number.isFinite(nextIndex)) {
      virtualIndexRef.current = nextIndex;
      setVirtualIndex(nextIndex);
    }

    const now = performance.now();
    touchSamples.current.push({ x: e.clientX, time: now });
    touchSamples.current = touchSamples.current.filter((s) => now - s.time <= 120);
  };

  const handleMouseUp = () => {
    if (!isMouseDown.current) return;
    isMouseDown.current = false;
    setIsDragging(false);

    const samples = touchSamples.current;
    let velocity = 0;
    if (samples.length >= 2) {
      const first = samples[0];
      const last = samples[samples.length - 1];
      const dt = last.time - first.time;
      if (dt > 10) {
        velocity = (last.x - first.x) / dt;
      }
    }

    const flickMomentum = -velocity * 0.38;
    const baseVal = Number.isFinite(virtualIndexRef.current) ? virtualIndexRef.current : 0;
    const target = Number.isFinite(flickMomentum) ? Math.round(baseVal + flickMomentum) : Math.round(baseVal);
    animateTo(target);
  };

  const activeProject = projects[((Math.round(virtualIndex) % total) + total) % total];

  return (
    <div
      ref={deckContainerRef}
      className="w-full flex flex-col items-center justify-center px-4 pt-1 pb-4 select-none relative overflow-hidden"
    >
      {/* Ambient warm backlight glow matching cinematic atmosphere */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[340px] h-[340px] rounded-full pointer-events-none transition-colors duration-700 blur-[85px] -z-10 opacity-35"
        style={{
          background:
            'radial-gradient(circle, rgba(234, 150, 60, 0.45) 0%, rgba(190, 80, 20, 0.25) 45%, transparent 75%)'
        }}
      />

      {/* 3D Arc Stage (Free-flowing Coverflow Curved Display) */}
      <div
        className="relative w-full max-w-[390px] h-[360px] flex items-center justify-center cursor-grab active:cursor-grabbing touch-pan-y"
        style={{
          perspective: '1000px',
          perspectiveOrigin: '50% 50%'
        }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        {projects.map((project, idx) => {
          const diff = getCyclicDiff(idx, virtualIndex);
          const absDiff = Math.abs(diff);
          const sign = diff < 0 ? -1 : 1;

          // Render visible cards within the arc
          const isVisible = Number.isFinite(absDiff) && absDiff <= 2.6;
          if (!isVisible) return null;

          // Fluid 3D Arc Mathematics
          const xOffset = sign * (Math.pow(absDiff, 0.86) * 114);
          const rotateY = -sign * Math.min(42, Math.pow(absDiff, 0.82) * 29);
          const translateZ = -Math.pow(absDiff, 0.9) * 85;
          const scale = Math.max(0.68, 1 - absDiff * 0.15);
          const rawOpacity =
            absDiff > 2.1
              ? Math.max(0, ((2.6 - absDiff) / 0.5) * 0.4)
              : Math.max(0.42, 1 - absDiff * 0.28);
          const opacity = Number.isFinite(rawOpacity) ? rawOpacity : 1;
          const rawBrightness = Math.max(0.48, 1 - absDiff * 0.32);
          const brightness = Number.isFinite(rawBrightness) ? rawBrightness : 1;
          const zIndex = Math.round(50 - absDiff * 10);

          const isCenter = absDiff < 0.45;
          const isNearCenter = absDiff < 1.35;
          const hasVideoError = !!failedVideos[project.id];
          const posterUrl = getOptimizedPosterUrl(project.posterUrl, true);
          const videoUrl = getOptimizedVideoUrl(project.videoUrl, true);

          return (
            <div
              key={project.id}
              onClick={(e) => {
                e.stopPropagation();
                // Prevent trigger if dragging
                if (isDraggingRef.current) return;
                if (isCenter) {
                  onSelectProject(project);
                } else {
                  // Tapping a flanking card smoothly animates it directly to center
                  animateTo(virtualIndex + diff);
                }
              }}
              style={{
                position: 'absolute',
                left: '50%',
                top: '50%',
                transform: `translate(-50%, -50%) translate3d(${xOffset}px, 0px, ${translateZ}px) rotateY(${rotateY}deg) scale(${scale})`,
                zIndex,
                opacity,
                filter: `brightness(${brightness})`,
                transformStyle: 'preserve-3d',
                willChange: 'transform, opacity'
              }}
              className="w-[230px] h-[320px] rounded-2xl sm:rounded-3xl overflow-hidden bg-[#08080c] border border-white/20 shadow-[0_20px_50px_rgba(0,0,0,0.9),0_0_15px_rgba(255,255,255,0.04)] cursor-pointer select-none group"
            >
              {/* Poster Image */}
              <img
                src={posterUrl}
                alt={project.title}
                className="absolute inset-0 w-full h-full object-cover pointer-events-none"
                loading="eager"
              />

              {/* Video Element for Motion Previews (only attached for near-center cards to conserve mobile bandwidth) */}
              {isNearCenter && !hasVideoError && (
                <video
                  ref={(el) => {
                    videoRefs.current[project.id] = el;
                  }}
                  src={videoUrl}
                  poster={posterUrl}
                  muted
                  loop
                  playsInline
                  autoPlay={isCenter && isDeckInViewport}
                  preload={isCenter ? 'metadata' : 'none'}
                  onError={() => {
                    setFailedVideos((prev) => ({ ...prev, [project.id]: true }));
                  }}
                  className={`absolute inset-0 w-full h-full object-cover pointer-events-none transition-opacity duration-300 ${
                    isCenter && !isDragging && isDeckInViewport ? 'opacity-100' : 'opacity-0'
                  }`}
                />
              )}

              {/* Inner Film Shadow / Vignette */}
              <div className="absolute inset-0 shadow-[inset_0_0_40px_rgba(0,0,0,0.6)] pointer-events-none" />

              {/* Center Tap Icon Indicator */}
              {isCenter && (
                <div className="absolute top-3 right-3 z-10 pointer-events-none">
                  <span className="p-1.5 rounded-full bg-black/70 backdrop-blur-md border border-white/20 text-white flex items-center justify-center shadow-md">
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              )}

              {/* Bottom Frosted Glass Title Overlay */}
              <div className="absolute bottom-0 left-0 right-0 p-3.5 pt-8 bg-gradient-to-t from-black/95 via-black/70 to-transparent backdrop-blur-[1.5px] pointer-events-none flex flex-col gap-0.5">
                <h3 className="font-display text-base sm:text-lg font-bold tracking-tight text-white line-clamp-1">
                  {project.title}
                </h3>
                <div className="flex items-center justify-between text-[10px] sm:text-[11px] text-zinc-400 font-mono">
                  <span className="truncate">{project.client || 'Commercial Motion'}</span>
                  <span className="text-zinc-500 font-bold ml-1">{project.year}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Progress Bar / Indicator Dot Bar Underneath */}
      <div className="flex items-center gap-1.5 mt-5">
        {projects.map((p, idx) => {
          const isActive = idx === ((Math.round(virtualIndex) % total) + total) % total;
          return (
            <button
              key={p.id}
              onClick={() => animateTo(virtualIndex + getCyclicDiff(idx, Math.round(virtualIndex)))}
              aria-label={`Jump to video ${idx + 1}`}
              className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                isActive ? 'w-6 bg-white' : 'w-1.5 bg-white/25 hover:bg-white/50'
              }`}
            />
          );
        })}
      </div>
    </div>
  );
}
