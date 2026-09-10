import { ArrowUp } from 'lucide-react';

interface FooterProps {
  designerName: string;
  designerTitle: string;
  onScrollToTop: () => void;
}

export function Footer({ designerName, designerTitle, onScrollToTop }: FooterProps) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-white/[0.08] py-12 px-6 md:px-12 max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6 text-xs font-mono text-zinc-500">
      <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-center sm:text-left">
        <span className="text-zinc-300 font-bold uppercase tracking-wider">{designerName}</span>
        <span className="hidden sm:inline text-zinc-700">//</span>
        <span>{designerTitle}</span>
        <span className="hidden sm:inline text-zinc-700">//</span>
        <span>ARCHIVE © {currentYear}</span>
      </div>

      <div className="flex items-center gap-6">
        <span className="text-zinc-600 hidden md:inline">CINEMATIC DIRECT MP4 ENGINE</span>

        <button
          onClick={onScrollToTop}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-white/10 hover:border-white/30 text-zinc-400 hover:text-white transition-colors cursor-pointer"
        >
          <span>TOP</span>
          <ArrowUp size={12} />
        </button>
      </div>
    </footer>
  );
}
