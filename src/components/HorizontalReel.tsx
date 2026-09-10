import {
  useRef,
  useEffect,
  useState,
  useCallback,
  useMemo,
  memo,
  type MouseEvent,
  type SyntheticEvent
} from 'react';
import { ChevronLeft, ChevronRight, ArrowUpRight } from 'lucide-react';
import { Project } from '../types';
import { getOptimizedVideoUrl, getOptimizedPosterUrl } from '../utils/cloudinary';
import { MobileCardDeck } from './MobileCardDeck';

interface HorizontalReelProps {
  projects: Project[];
  onSelectProject: (project: Project) => void;
  isModalOpen?: boolean;
}

interface ReelProjectCardProps {
  project: Project;
  index: number;
  isActive: boolean;
  style: { scale: number; opacity: number; zIndex: number };
  isDragging: boolean;
  hasDragged: boolean;
  isTouch: boolean;
  isModalOpen?: boolean;
  onCardClick: (project: Project) => void;
  setCardRef: (el: HTMLDivElement | null) => void;
}

function getCardWidthClass(aspect: string) {
  const parts = aspect.split('/').map((p) => parseFloat(p.trim()));
  const num = parts.length === 2 && parts[1] ? parts[0] / parts[1] : parseFloat(aspect);
  if (isNaN(num)) return 'w-[82vw] sm:w-[62vw] md:w-[50vw] lg:w-[44vw] max-w-[920px]';

  if (num < 0.8) {
    // Portrait (e.g. 9/16 vertical)
    return 'w-[58vw] sm:w-[38vw] md:w-[28vw] lg:w-[21vw] max-w-[340px]';
  }
  if (num < 1.3) {
    // Square (e.g. 1/1 square)
    return 'w-[72vw] sm:w-[48vw] md:w-[38vw] lg:w-[30vw] max-w-[540px]';
  }
  // Landscape (e.g. 16/9 widescreen)
  return 'w-[82vw] sm:w-[62vw] md:w-[50vw] lg:w-[44vw] max-w-[920px]';
}

const ReelProjectCard = memo(function ReelProjectCard({
  project,
  index,
  isActive,
  style,
  isDragging,
  hasDragged,
  isTouch,
  isModalOpen,
  onCardClick,
  setCardRef
}: ReelProjectCardProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const cardContainerRef = useRef<HTMLDivElement>(null);

  // Proximity: true if card is in or approaching viewport (< 1-2 viewports away)
  // First 2 cards default to true on initial render so immediate visible screen is instant
  const [isNearViewport, setIsNearViewport] = useState<boolean>(index <= 1);

  // Visibility: true if card is currently on screen
  const [isInViewport, setIsInViewport] = useState<boolean>(index === 0);

  const [isHovered, setIsHovered] = useState<boolean>(false);
  const [isBuffering, setIsBuffering] = useState<boolean>(false);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [hasVideoError, setHasVideoError] = useState<boolean>(false);
  const [aspectRatio, setAspectRatio] = useState<string>(project.aspectRatio || '16/9');

  const optimizedPoster = getOptimizedPosterUrl(project.posterUrl, isTouch);
  const optimizedVideo = getOptimizedVideoUrl(project.videoUrl, isTouch);

  // Combine local ref with parent cardRefs for LERP and geometry calculations
  const combinedRef = useCallback(
    (el: HTMLDivElement | null) => {
      cardContainerRef.current = el;
      setCardRef(el);
    },
    [setCardRef]
  );

  // Handle dynamic aspect ratio detection from video stream metadata
  const handleLoadedMetadata = (e: SyntheticEvent<HTMLVideoElement>) => {
    const { videoWidth, videoHeight } = e.currentTarget;
    if (videoWidth && videoHeight) {
      setAspectRatio(`${videoWidth} / ${videoHeight}`);
    }
  };

  // 1. Proximity & Viewport IntersectionObserver
  useEffect(() => {
    const container = cardContainerRef.current;
    if (!container) return;

    // Proximity observer: loads video when approaching viewport, unloads when far away
    const proximityObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsNearViewport(true);
          } else {
            // Far outside the viewport: unload source completely to free hardware decoders
            setIsNearViewport(false);
            if (videoRef.current) {
              videoRef.current.pause();
              videoRef.current.removeAttribute('src');
              videoRef.current.load();
            }
          }
        });
      },
      {
        rootMargin: isTouch ? '200px 300px 200px 300px' : '300px 500px 300px 500px'
      }
    );

    // Visibility observer: detects when card is actively visible on screen
    const visibilityObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio >= 0.4) {
            setIsInViewport(true);
          } else if (!entry.isIntersecting || entry.intersectionRatio < 0.2) {
            setIsInViewport(false);
            if (videoRef.current) {
              videoRef.current.pause();
            }
          }
        });
      },
      { threshold: [0, 0.4, 0.7] }
    );

    proximityObserver.observe(container);
    visibilityObserver.observe(container);

    return () => {
      proximityObserver.disconnect();
      visibilityObserver.disconnect();
    };
  }, [isTouch]);

  // 2. Playback Controller
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !isNearViewport) return;

    if (isModalOpen) {
      video.pause();
      return;
    }

    if (isTouch) {
      // Mobile / Touch Devices:
      // Only the single active centered card plays, never all at once!
      if (isActive && isInViewport && !isDragging) {
        const playPromise = video.play();
        if (playPromise !== undefined) {
          playPromise.catch(() => {});
        }
      } else {
        video.pause();
      }
    } else {
      // Desktop:
      // Plays on hover when visible in viewport and not dragging
      if (isHovered && isInViewport && !isDragging) {
        const playPromise = video.play();
        if (playPromise !== undefined) {
          playPromise.catch(() => {});
        }
      } else {
        video.pause();
      }
    }
  }, [isActive, isInViewport, isHovered, isDragging, isTouch, isNearViewport, isModalOpen]);

  // Desktop hover triggers
  const handleMouseEnter = () => {
    if (isTouch || isDragging) return;
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    if (isTouch) return;
    setIsHovered(false);
  };

  // Card click / tap handler
  const handleCardClick = () => {
    if (hasDragged) return;

    if (isTouch) {
      const video = videoRef.current;
      // On mobile: if video is paused, tap starts playback; if already active/playing, open case study
      if (video && video.paused) {
        const playPromise = video.play();
        if (playPromise !== undefined) playPromise.catch(() => {});
        return;
      }
    }

    onCardClick(project);
  };

  const widthClass = getCardWidthClass(aspectRatio);

  return (
    <div
      ref={combinedRef}
      onClick={handleCardClick}
      style={{
        transform: `scale(${style.scale}) translate3d(0,0,0)`,
        opacity: style.opacity,
        zIndex: style.zIndex
      }}
      className={`shrink-0 ${widthClass} transition-transform duration-75 ease-out group will-change-transform cursor-pointer`}
    >
      {/* Video Frame with container matching the video's exact aspect ratio */}
      <div
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        style={{ aspectRatio }}
        className="relative rounded-2xl overflow-hidden bg-black border border-white/10 shadow-[0_20px_60px_rgba(0,0,0,0.8)] sm:shadow-[0_30px_90px_rgba(0,0,0,0.9)] w-full group-hover:border-white/40 transition-colors"
      >
        {/* Instant Visual Poster Base Layer */}
        {/* Always present so there is zero black flash or layout shift */}
        <img
          src={optimizedPoster}
          alt={project.title}
          loading={index <= 2 ? 'eager' : 'lazy'}
          decoding="async"
          draggable={false}
          className={`absolute inset-0 w-full h-full object-cover object-center transition-opacity duration-300 pointer-events-none ${
            isPlaying && !hasVideoError ? 'opacity-0' : 'opacity-100'
          }`}
        />

        {/* Lazy-Loaded HTML5 Video: only attached when near viewport */}
        {isNearViewport && !hasVideoError && (
          <video
            ref={videoRef}
            src={optimizedVideo}
            poster={optimizedPoster}
            muted
            loop
            playsInline
            preload="none"
            onLoadedMetadata={handleLoadedMetadata}
            onWaiting={() => setIsBuffering(true)}
            onPlaying={() => {
              setIsBuffering(false);
              setIsPlaying(true);
            }}
            onPause={() => {
              setIsPlaying(false);
              setIsBuffering(false);
            }}
            onError={() => {
              setHasVideoError(true);
              setIsBuffering(false);
              setIsPlaying(false);
            }}
            draggable={false}
            onDragStart={(e) => e.preventDefault()}
            className={`w-full h-full object-cover object-center transform group-hover:scale-[1.02] transition-transform duration-700 ease-out pointer-events-none ${
              isPlaying ? 'opacity-100' : 'opacity-90'
            }`}
          />
        )}

        {/* Subtle Minimal Loading State if video is buffering */}
        {isBuffering && (
          <div className="absolute top-4 right-4 z-20 pointer-events-none">
            <div className="w-5 h-5 rounded-full border border-white/20 border-t-white animate-spin" />
          </div>
        )}

        {/* Film Vignette */}
        <div className="absolute inset-0 shadow-[inset_0_0_60px_rgba(0,0,0,0.6)] pointer-events-none" />

        {/* Desktop Hover Trigger Icon */}
        {!isTouch && (
          <div className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-black/60 border border-white/20 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
            <ArrowUpRight size={16} />
          </div>
        )}
      </div>

      {/* Minimal Title and Year */}
      <div className="pt-4 flex items-baseline justify-between px-1">
        <h2 className="font-display text-xl sm:text-2xl md:text-3xl font-bold tracking-tight text-white group-hover:text-zinc-300 transition-colors">
          {project.title}
        </h2>
        <span className="text-xs sm:text-sm font-mono tracking-widest text-zinc-500 uppercase">
          {project.year}
        </span>
      </div>
    </div>
  );
});

export function HorizontalReel({ projects, onSelectProject, isModalOpen }: HorizontalReelProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const isTeleportingRef = useRef(false);

  const cloneCount = projects.length;

  // Duplicate cards for seamless loop wrapping without jumping (3 identical sets)
  const displayItems = useMemo(() => {
    if (projects.length === 0) return [];
    const prefix = projects.map((p, i) => ({
      ...p,
      uniqueKey: `clone-prefix-${p.id}-${i}`,
      originalIndex: i,
      isClone: true
    }));
    const main = projects.map((p, i) => ({
      ...p,
      uniqueKey: `main-${p.id}-${i}`,
      originalIndex: i,
      isClone: false
    }));
    const suffix = projects.map((p, i) => ({
      ...p,
      uniqueKey: `clone-suffix-${p.id}-${i}`,
      originalIndex: i,
      isClone: true
    }));
    return [...prefix, ...main, ...suffix];
  }, [projects]);

  const [activeRenderIndex, setActiveRenderIndex] = useState(projects.length);
  const activeRenderIndexRef = useRef(projects.length);
  const [mobileActiveIndex, setMobileActiveIndex] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [hasDragged, setHasDragged] = useState(false);
  const [isTouch, setIsTouch] = useState(false);

  const realActiveIndex = useMemo(() => {
    if (projects.length === 0) return 0;
    return ((activeRenderIndex - cloneCount) % projects.length + projects.length) % projects.length;
  }, [activeRenderIndex, cloneCount, projects.length]);

  const [cardStyles, setCardStyles] = useState<Array<{ scale: number; opacity: number; zIndex: number }>>(() =>
    new Array(projects.length * 3).fill(null).map((_, i) => ({
      scale: i === projects.length ? 1.08 : 0.82,
      opacity: i === projects.length ? 1 : 0.5,
      zIndex: i === projects.length ? 15 : 1
    }))
  );

  // Physics state
  const currentScrollX = useRef(0);
  const targetScrollX = useRef(0);
  const velocityX = useRef(0);
  const isDraggingRef = useRef(false);
  const lastMouseX = useRef(0);
  const startDragX = useRef(0);
  const startScrollLeft = useRef(0);
  const animationFrameId = useRef<number | null>(null);
  const isLoopRunningRef = useRef(false);
  const scrollRafId = useRef<number | null>(null);
  const touchScrollTimeout = useRef<NodeJS.Timeout | null>(null);

  // Detect touch device capabilities
  useEffect(() => {
    const touch = window.matchMedia('(hover: none)').matches;
    setIsTouch(touch);
  }, []);

  // Update card scales, opacity, active index, and progress
  const updateTransforms = useCallback(() => {
    const container = scrollContainerRef.current;
    if (!container || projects.length === 0) return;

    const viewportCenter = window.innerWidth / 2;
    const viewportWidth = window.innerWidth;

    let closestIdx = projects.length;
    let minDistance = Infinity;

    const newStyles = cardRefs.current.map((card, idx) => {
      if (!card) return { scale: 0.8, opacity: 0.4, zIndex: 1 };

      const rect = card.getBoundingClientRect();
      const cardCenter = rect.left + rect.width / 2;
      const distFromCenter = Math.abs(cardCenter - viewportCenter);

      if (distFromCenter < minDistance) {
        minDistance = distFromCenter;
        closestIdx = idx;
      }

      // Normalized distance: 0 at center, 1 at edge
      const normDist = Math.min(1.4, distFromCenter / (viewportWidth * 0.45));

      // Lighter scaling and smooth opacity curves
      const scale = Math.max(0.78, 1.06 - normDist * 0.28);
      const opacity = Math.max(0.38, 1.0 - normDist * 0.6);
      const zIndex = Math.round((1.5 - normDist) * 20);

      return { scale, opacity, zIndex };
    });

    setCardStyles(newStyles);
    setActiveRenderIndex(closestIdx);
    activeRenderIndexRef.current = closestIdx;

    if (projects.length > 1) {
      const normRealIdx = ((closestIdx - projects.length) % projects.length + projects.length) % projects.length;
      setScrollProgress((normRealIdx / (projects.length - 1)) * 100);
    }
  }, [projects.length]);

  // Seamless hiccup-free loop wrapping using physical span measurement
  const checkAndWrapLoop = useCallback(() => {
    const container = scrollContainerRef.current;
    if (!container || projects.length === 0) return;
    const N = projects.length;

    const firstCanonical = cardRefs.current[N];
    const secondCanonical = cardRefs.current[2 * N];
    if (!firstCanonical || !secondCanonical) return;

    const cycleWidth = secondCanonical.offsetLeft - firstCanonical.offsetLeft;
    if (cycleWidth <= 0) return;

    const cardWidth = firstCanonical.offsetWidth || 300;
    const startCanonicalScroll = firstCanonical.offsetLeft + cardWidth / 2 - container.clientWidth / 2;
    const endCanonicalScroll = startCanonicalScroll + cycleWidth;

    // Only wrap when current scroll has drifted cleanly into Set 0 or Set 2
    if (container.scrollLeft < startCanonicalScroll - cardWidth * 0.35) {
      isTeleportingRef.current = true;
      container.scrollLeft += cycleWidth;
      currentScrollX.current += cycleWidth;
      targetScrollX.current += cycleWidth;
      startScrollLeft.current += cycleWidth;
      updateTransforms();
      requestAnimationFrame(() => {
        isTeleportingRef.current = false;
      });
    } else if (container.scrollLeft > endCanonicalScroll - cardWidth * 0.35) {
      isTeleportingRef.current = true;
      container.scrollLeft -= cycleWidth;
      currentScrollX.current -= cycleWidth;
      targetScrollX.current -= cycleWidth;
      startScrollLeft.current -= cycleWidth;
      updateTransforms();
      requestAnimationFrame(() => {
        isTeleportingRef.current = false;
      });
    }
  }, [projects.length, updateTransforms]);

  // On-demand LERP animation loop (only runs when active movement occurs)
  const startRenderLoop = useCallback(() => {
    if (isLoopRunningRef.current) return;
    isLoopRunningRef.current = true;

    const loop = () => {
      const el = scrollContainerRef.current;
      if (!el) {
        isLoopRunningRef.current = false;
        return;
      }

      if (isDraggingRef.current) {
        currentScrollX.current = el.scrollLeft;
        targetScrollX.current = el.scrollLeft;
        updateTransforms();
        animationFrameId.current = requestAnimationFrame(loop);
        return;
      }

      const diff = targetScrollX.current - currentScrollX.current;
      if (Math.abs(diff) > 0.25) {
        currentScrollX.current += diff * 0.085;
        el.scrollLeft = currentScrollX.current;
        updateTransforms();
        checkAndWrapLoop();
        animationFrameId.current = requestAnimationFrame(loop);
      } else {
        currentScrollX.current = targetScrollX.current;
        el.scrollLeft = currentScrollX.current;
        updateTransforms();
        isLoopRunningRef.current = false;
        checkAndWrapLoop();
      }
    };

    animationFrameId.current = requestAnimationFrame(loop);
  }, [updateTransforms, checkAndWrapLoop]);

  // Clean up animation frames on unmount
  useEffect(() => {
    return () => {
      if (animationFrameId.current) cancelAnimationFrame(animationFrameId.current);
      if (scrollRafId.current) cancelAnimationFrame(scrollRafId.current);
      if (touchScrollTimeout.current) clearTimeout(touchScrollTimeout.current);
    };
  }, []);

  // Initialize scroll position on the first canonical project
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container || projects.length === 0) return;

    const timer = setTimeout(() => {
      const card = cardRefs.current[projects.length];
      if (container && card) {
        const containerCenter = container.clientWidth / 2;
        const cardCenter = card.offsetLeft + card.offsetWidth / 2;
        const initialScroll = cardCenter - containerCenter;
        container.scrollLeft = initialScroll;
        currentScrollX.current = initialScroll;
        targetScrollX.current = initialScroll;
        updateTransforms();
      }
    }, 60);

    return () => clearTimeout(timer);
  }, [projects.length, updateTransforms]);

  // Unified scroll handler for trackpads and momentum
  const handleScroll = useCallback(() => {
    if (isTeleportingRef.current) return;
    const container = scrollContainerRef.current;
    if (!container) return;

    if (!isLoopRunningRef.current && !isDraggingRef.current) {
      currentScrollX.current = container.scrollLeft;
      targetScrollX.current = container.scrollLeft;
    }

    if (scrollRafId.current) cancelAnimationFrame(scrollRafId.current);
    scrollRafId.current = requestAnimationFrame(() => {
      updateTransforms();
      if (!isLoopRunningRef.current && !isDraggingRef.current) {
        checkAndWrapLoop();
      }
    });
  }, [updateTransforms, checkAndWrapLoop]);

  // Handle Wheel Events with smooth LERP momentum on desktop
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container || isTouch) return;

    // Initialize positions
    currentScrollX.current = container.scrollLeft;
    targetScrollX.current = container.scrollLeft;

    const handleWheel = (e: WheelEvent) => {
      const delta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
      if (Math.abs(delta) > 1.5) {
        e.preventDefault();
        const adjustedDelta = delta * 0.85;
        targetScrollX.current += adjustedDelta;
        startRenderLoop();
      }
    };

    container.addEventListener('wheel', handleWheel, { passive: false });
    return () => container.removeEventListener('wheel', handleWheel);
  }, [isTouch, startRenderLoop]);

  const smoothScrollToRenderIndex = (index: number) => {
    const container = scrollContainerRef.current;
    if (!container || projects.length === 0) return;

    const safeIndex = Math.max(0, Math.min(displayItems.length - 1, index));
    const card = cardRefs.current[safeIndex];
    if (!card) return;

    const containerCenter = container.clientWidth / 2;
    const cardCenter = card.offsetLeft + card.offsetWidth / 2;
    const target = cardCenter - containerCenter;

    targetScrollX.current = target;
    startRenderLoop();
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') {
        smoothScrollToRenderIndex(activeRenderIndexRef.current + 1);
      } else if (e.key === 'ArrowLeft') {
        smoothScrollToRenderIndex(activeRenderIndexRef.current - 1);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Mouse Drag to Scroll with Velocity & Momentum Glide
  const handleMouseDown = (e: MouseEvent) => {
    if (isTouch) return;
    const container = scrollContainerRef.current;
    if (!container) return;

    setIsDragging(true);
    isDraggingRef.current = true;
    setHasDragged(false);
    startDragX.current = e.pageX;
    lastMouseX.current = e.pageX;
    startScrollLeft.current = container.scrollLeft;
    velocityX.current = 0;
    startRenderLoop();
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDraggingRef.current || isTouch) return;
    const container = scrollContainerRef.current;
    if (!container) return;

    e.preventDefault();
    const currentX = e.pageX;
    const dragDistance = currentX - startDragX.current;

    if (Math.abs(dragDistance) > 5) {
      setHasDragged(true);
    }

    velocityX.current = lastMouseX.current - currentX;
    lastMouseX.current = currentX;

    const nextScroll = startScrollLeft.current - dragDistance;
    container.scrollLeft = nextScroll;
    currentScrollX.current = nextScroll;
    targetScrollX.current = nextScroll;
    updateTransforms();
    checkAndWrapLoop();
  };

  const handleMouseUp = () => {
    if (!isDraggingRef.current || isTouch) return;
    isDraggingRef.current = false;
    setIsDragging(false);

    const container = scrollContainerRef.current;
    if (!container) return;

    const momentum = velocityX.current * 7;
    targetScrollX.current = container.scrollLeft + momentum;
    startRenderLoop();
  };

  const handleHeaderPrev = () => {
    smoothScrollToRenderIndex(activeRenderIndexRef.current - 1);
    setMobileActiveIndex((prev) => (prev <= 0 ? projects.length - 1 : prev - 1));
  };

  const handleHeaderNext = () => {
    smoothScrollToRenderIndex(activeRenderIndexRef.current + 1);
    setMobileActiveIndex((prev) => (prev >= projects.length - 1 ? 0 : prev + 1));
  };

  const handleCardClick = (project: Project) => {
    if (!hasDragged) {
      onSelectProject(project);
    }
  };

  const smoothScrollToIndex = (index: number) => {
    smoothScrollToRenderIndex(projects.length + index);
  };

  const handleScrubberClick = (e: MouseEvent<HTMLDivElement>) => {
    if (projects.length <= 1) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const ratio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    const targetIdx = Math.round(ratio * (projects.length - 1));
    smoothScrollToRenderIndex(projects.length + targetIdx);
  };

  return (
    <section
      id="work"
      className="relative w-full py-16 md:py-28 bg-[#070709] overflow-hidden select-none"
    >
      {/* Top Header Bar with Reverted Left/Right Controls */}
      <div className="px-6 sm:px-8 md:px-16 mb-6 md:mb-8 flex items-center justify-end md:justify-between text-xs font-mono tracking-widest text-zinc-500 uppercase">
        {/* 'HORIZONTAL MOTION REEL' is visible on desktop, hidden on mobile so only the counter and buttons appear */}
        <div className="hidden md:flex items-center gap-3">
          <span className="w-1.5 h-1.5 rounded-full bg-zinc-300 animate-pulse" />
          <span className="text-zinc-200">HORIZONTAL MOTION REEL</span>
        </div>

        <div className="flex items-center gap-4">
          <span className="text-zinc-300 font-bold hidden md:inline">
            {String(realActiveIndex + 1).padStart(2, '0')} / {String(projects.length).padStart(2, '0')}
          </span>
          <span className="text-zinc-300 font-bold md:hidden">
            {String(mobileActiveIndex + 1).padStart(2, '0')} / {String(projects.length).padStart(2, '0')}
          </span>

          <div className="flex items-center gap-1.5">
            <button
              onClick={handleHeaderPrev}
              aria-label="Previous project"
              className="w-9 h-9 sm:w-8 sm:h-8 flex items-center justify-center rounded-full border border-white/15 hover:border-white text-zinc-400 hover:text-white bg-white/5 hover:bg-white/15 transition-all duration-200 cursor-pointer active:scale-95"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={handleHeaderNext}
              aria-label="Next project"
              className="w-9 h-9 sm:w-8 sm:h-8 flex items-center justify-center rounded-full border border-white/15 hover:border-white text-zinc-400 hover:text-white bg-white/5 hover:bg-white/15 transition-all duration-200 cursor-pointer active:scale-95"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Desktop Horizontal Motion Reel (Computer version kept horizontal, looping seamlessly without snapping) */}
      <div className="hidden md:block relative w-full">
        {/* The Scrollable Horizontal Row */}
        <div
          ref={scrollContainerRef}
          onScroll={handleScroll}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          className={`w-full overflow-x-auto overflow-y-hidden no-scrollbar pt-3 pb-2 sm:pt-4 sm:pb-3 flex items-center gap-[4vw] md:gap-[5vw] px-[8vw] sm:px-[18vw] select-none will-change-scroll ${
            isDragging ? 'cursor-grabbing' : 'cursor-grab'
          }`}
          style={{
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
            WebkitOverflowScrolling: 'touch'
          }}
        >
          {displayItems.map((item, index) => {
            const currentStyle = cardStyles[index] || { scale: 1, opacity: 1, zIndex: 1 };

            return (
              <ReelProjectCard
                key={item.uniqueKey}
                project={item}
                index={index}
                isActive={activeRenderIndex === index}
                style={currentStyle}
                isDragging={isDragging}
                hasDragged={hasDragged}
                isTouch={isTouch}
                isModalOpen={isModalOpen}
                onCardClick={handleCardClick}
                setCardRef={(el) => (cardRefs.current[index] = el)}
              />
            );
          })}
        </div>
      </div>

      {/* Desktop Bottom Horizontal Scrubber Bar */}
      <div className="hidden md:flex px-6 sm:px-8 md:px-16 mt-2 sm:mt-3 flex-col sm:flex-row items-center justify-between gap-4">
        {/* Interactive Scrub Bar with Smooth Gliding Indicator */}
        <div
          onClick={handleScrubberClick}
          className="w-full sm:w-80 md:w-96 h-2 bg-white/10 hover:bg-white/20 rounded-full cursor-pointer overflow-hidden relative transition-colors"
          title="Click to scrub smoothly"
        >
          <div
            className="h-full bg-white rounded-full transition-all duration-150 ease-out shadow-[0_0_12px_rgba(255,255,255,0.4)]"
            style={{ width: `${Math.max(6, scrollProgress)}%` }}
          />
        </div>

        {/* Quick jump dots and index indicator */}
        <div className="flex items-center gap-6">
          <div className="hidden sm:flex items-center gap-1.5">
            {projects.map((p, idx) => (
              <button
                key={p.id}
                onClick={() => smoothScrollToIndex(idx)}
                aria-label={`Scroll smoothly to project ${idx + 1}`}
                className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                  realActiveIndex === idx
                    ? 'w-6 bg-white'
                    : 'w-1.5 bg-white/20 hover:bg-white/50'
                }`}
              />
            ))}
          </div>

          <span className="text-xs font-mono tracking-widest text-zinc-500 uppercase">
            SCROLL TO EXPLORE
          </span>
        </div>
      </div>

      {/* Mobile Version: Stacked Deck of Cards of videos looping seamlessly */}
      <div className="block md:hidden w-full">
        <MobileCardDeck
          projects={projects}
          activeIndex={mobileActiveIndex}
          onIndexChange={setMobileActiveIndex}
          onSelectProject={onSelectProject}
          isModalOpen={isModalOpen}
        />
      </div>
    </section>
  );
}
