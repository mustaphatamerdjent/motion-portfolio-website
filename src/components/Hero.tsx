import { motion } from 'motion/react';
import { ArrowDown, Play, Sparkles } from 'lucide-react';
import { SmartVideo } from './SmartVideo';

interface HeroProps {
  designerName: string;
  designerTitle: string;
  tagline: string;
  showreelVideoUrl: string;
  showreelPosterUrl: string;
  onScrollToWork: () => void;
  onOpenFullReel?: () => void;
}

export function Hero({
  designerName,
  designerTitle,
  tagline,
  showreelVideoUrl,
  showreelPosterUrl,
  onScrollToWork,
  onOpenFullReel
}: HeroProps) {
  return (
    <section
      id="top"
      className="relative min-h-screen flex flex-col justify-between pt-28 md:pt-36 pb-12 px-6 md:px-12 max-w-7xl mx-auto overflow-hidden"
    >
      {/* Top Header Statement */}
      <div className="flex flex-col gap-6 md:gap-8 z-10">
        {/* Subtle Category Eyebrow & Status */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-wrap items-center justify-between gap-4 text-xs font-mono tracking-widest uppercase text-zinc-500"
        >
          <div className="flex items-center gap-3">
            <span className="text-zinc-200 font-semibold">{designerTitle}</span>
            <span className="text-zinc-700">//</span>
            <span>CGI & 3D DIRECTION</span>
          </div>

          <div className="flex items-center gap-2 text-[11px] text-zinc-400">
            <Sparkles size={13} className="text-zinc-400" />
            <span>SELECTED ARCHIVE 2023–2026</span>
          </div>
        </motion.div>

        {/* Hero Main Name Display */}
        <div className="overflow-hidden">
          <motion.h1
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="font-display text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-extrabold uppercase tracking-tight text-white leading-[0.9] select-none"
          >
            {designerName}
          </motion.h1>
        </div>

        {/* Short description quote */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
          className="grid grid-cols-1 md:grid-cols-12 gap-6 items-end pt-2 pb-4"
        >
          <p className="md:col-span-8 text-xl sm:text-2xl md:text-3xl text-zinc-300 font-light tracking-tight leading-snug">
            "{tagline}"
          </p>

          <div className="md:col-span-4 flex md:justify-end">
            {/* Subtle "View selected work" button */}
            <button
              id="hero-view-work-btn"
              onClick={onScrollToWork}
              className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full border border-white/20 bg-white/[0.03] hover:bg-white text-zinc-300 hover:text-black hover:border-white transition-all duration-300 text-xs font-mono tracking-widest uppercase cursor-pointer group"
            >
              <span>View selected work</span>
              <ArrowDown size={14} className="transition-transform group-hover:translate-y-0.5" />
            </button>
          </div>
        </motion.div>
      </div>

      {/* Large Showreel Area */}
      <motion.div
        id="showreel"
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
        className="mt-6 md:mt-10 relative z-10"
      >
        <div className="flex items-center justify-between pb-3 px-1 text-[11px] font-mono tracking-widest text-zinc-500 uppercase">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-red-500/80 animate-ping" />
            <span className="text-zinc-300">MOTION REEL // 2024-2026</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="hidden sm:inline">DIRECT 4K MP4 FEED</span>
            {onOpenFullReel && (
              <button
                onClick={onOpenFullReel}
                className="flex items-center gap-1.5 text-zinc-300 hover:text-white transition-colors cursor-pointer"
              >
                <Play size={10} fill="currentColor" />
                <span>EXPAND REEL</span>
              </button>
            )}
          </div>
        </div>

        {/* Video Player */}
        <div
          data-cursor="video"
          className="rounded-xl overflow-hidden border border-white/10 shadow-2xl bg-[#09090b]"
        >
          <SmartVideo
            src={showreelVideoUrl}
            poster={showreelPosterUrl}
            aspectRatio="21/9"
            priority={true}
            title="Musta_phavfx Master Showreel"
            className="w-full min-h-[260px] sm:min-h-[380px] md:min-h-[480px]"
          />
        </div>

        <div className="flex flex-wrap items-center justify-between pt-3 px-1 text-[11px] font-mono text-zinc-500">
          <p>Autoplay enabled with smart viewport pausing to optimize bandwidth.</p>
          <p className="text-zinc-400">Audio toggle available in bottom right corner.</p>
        </div>
      </motion.div>
    </section>
  );
}
