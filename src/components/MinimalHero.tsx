import { useRef, useEffect } from 'react';
import { motion } from 'motion/react';
import { ArrowDown } from 'lucide-react';
import { TypingSubtitle } from './TypingSubtitle';
import { getOptimizedPosterUrl, getOptimizedVideoUrl } from '../utils/cloudinary';
import { DottedSphere } from './DottedSphere';

interface MinimalHeroProps {
  designerName: string;
  designerTitle: string;
  showreelVideoUrl: string;
  showreelPosterUrl: string;
  onScrollToWork: () => void;
  onScrollToBooking: () => void;
}

export function MinimalHero({
  designerName,
  designerTitle,
  showreelVideoUrl,
  showreelPosterUrl,
  onScrollToWork,
  onScrollToBooking
}: MinimalHeroProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (!showreelVideoUrl) return;
    const vid = videoRef.current;
    if (!vid) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          vid.play().catch(() => {});
        } else {
          vid.pause();
        }
      },
      { threshold: 0.1 }
    );
    observer.observe(vid);
    return () => observer.disconnect();
  }, [showreelVideoUrl]);

  return (
    <section
      id="hero"
      className="relative w-full h-screen min-h-[640px] flex items-center justify-center overflow-hidden bg-[#070709] select-none"
    >
      {/* 1. Procedural Interactive Dotted Sphere in place of photo */}
      <div className="absolute inset-0 w-full h-full overflow-hidden">
        {showreelVideoUrl && (
          <video
            ref={videoRef}
            src={getOptimizedVideoUrl(showreelVideoUrl)}
            poster={getOptimizedPosterUrl(showreelPosterUrl)}
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            className="absolute inset-0 w-full h-full object-cover object-center scale-105 opacity-25 pointer-events-none"
          />
        )}

        {/* Interactive Procedural Dotted Sphere */}
        <DottedSphere className="absolute inset-0" />

        {/* 2. Seamless dark scrim & edge blending */}
        <div className="absolute inset-0 bg-[#070709]/20 pointer-events-none" />

        {/* Radial vignette so the visual emerges smoothly from deep dark atmosphere */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'radial-gradient(ellipse at center, rgba(7,7,9,0.0) 0%, rgba(7,7,9,0.45) 60%, #070709 100%)'
          }}
        />

        {/* Smooth top edge blend */}
        <div className="absolute top-0 inset-x-0 h-40 bg-gradient-to-b from-[#070709] via-[#070709]/60 to-transparent pointer-events-none" />

        {/* Smooth bottom edge blend into horizontal reel */}
        <div className="absolute bottom-0 inset-x-0 h-48 bg-gradient-to-t from-[#070709] via-[#070709]/75 to-transparent pointer-events-none" />

        {/* Left & Right border soft fades */}
        <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-[#070709] to-transparent pointer-events-none" />
        <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-[#070709] to-transparent pointer-events-none" />
      </div>

      {/* 3. Minimal Top Navigation */}
      <header className="absolute top-0 inset-x-0 z-30 flex items-center justify-between px-5 sm:px-8 md:px-16 py-5 sm:py-8 pointer-events-none">
        <div className="flex items-center gap-2.5 sm:gap-3 pointer-events-auto">
          <span className="font-urbanist text-xs sm:text-sm tracking-wider font-bold text-white/90">
            {designerName}
          </span>
          <span className="text-white/20 font-mono text-xs">•</span>
          <span className="text-[10px] sm:text-[11px] font-mono tracking-widest text-zinc-400 uppercase hidden sm:inline">
            REEL 2024–2026
          </span>
        </div>

        <div className="flex items-center gap-2 text-[10px] sm:text-[11px] font-mono tracking-widest text-zinc-400 uppercase pointer-events-auto">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="hidden xs:inline">AVAILABLE FOR COMMISSIONS</span>
          <span className="xs:hidden">AVAILABLE</span>
        </div>
      </header>

      {/* 4. Centered Name and Designer Title - Refined Urbanist Typography */}
      <div className="relative z-20 flex flex-col items-center text-center px-6 max-w-6xl pointer-events-none">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col items-center gap-4 md:gap-6"
        >
          {/* Main Name: Refined, elegant Urbanist typography */}
          <h1 className="font-urbanist text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-none drop-shadow-[0_10px_40px_rgba(0,0,0,0.8)] select-none">
            {designerName}
          </h1>

          {/* Subtitle: Interactive Typing Animation cycling through AI, SaaS, Fintech */}
          <div className="overflow-hidden max-w-3xl min-h-[32px] flex items-center justify-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
            >
              <TypingSubtitle className="text-[11px] sm:text-xs md:text-sm lg:text-base tracking-[0.14em] sm:tracking-[0.22em]" />
            </motion.div>
          </div>

          {/* Book Project and Work buttons underneath subtitle, reverted to original style and appearance from the beginning */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.45, ease: [0.16, 1, 0.3, 1] }}
            className="flex items-center gap-3.5 sm:gap-5 mt-2 sm:mt-2.5 pointer-events-auto"
          >
            <button
              id="hero-book-project-btn"
              onClick={onScrollToBooking}
              className="px-3 py-1 sm:px-3.5 sm:py-1.5 text-[10px] sm:text-xs font-mono tracking-widest uppercase rounded-full border border-white/20 text-white hover:bg-white hover:text-black transition-all cursor-pointer whitespace-nowrap"
            >
              Book Project
            </button>
            <button
              id="hero-work-btn"
              onClick={onScrollToWork}
              className="px-1.5 py-1 text-[11px] sm:text-xs font-mono tracking-widest uppercase text-zinc-400 hover:text-white transition-colors cursor-pointer whitespace-nowrap"
            >
              Work
            </button>
          </motion.div>
        </motion.div>
      </div>

      {/* 5. Minimal Bottom Controls: Scroll Indicator */}
      <div className="absolute bottom-8 inset-x-0 z-30 flex items-center justify-end px-8 md:px-16 text-xs font-mono text-zinc-500 pointer-events-none">
        <button
          onClick={onScrollToWork}
          className="hidden sm:flex items-center gap-2 text-zinc-400 hover:text-white transition-colors cursor-pointer group pointer-events-auto"
        >
          <span className="text-[10px] tracking-widest uppercase">SCROLL TO WORK</span>
          <ArrowDown size={12} className="group-hover:translate-y-0.5 transition-transform" />
        </button>
      </div>
    </section>
  );
}
