import { useEffect, useState } from 'react';
import { ArrowLeft, Menu, X, Disc } from 'lucide-react';

interface NavbarProps {
  designerName: string;
  isProjectView?: boolean;
  onBackToWork?: () => void;
  onNavigateSection?: (sectionId: string) => void;
  onOpenReel?: () => void;
}

export function Navbar({
  designerName,
  isProjectView = false,
  onBackToWork,
  onNavigateSection,
  onOpenReel
}: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [timeString, setTimeString] = useState('');

  // Live Paris / UTC time display typical of boutique studios
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeString(
        now.toLocaleTimeString('en-US', {
          timeZone: 'Europe/Paris',
          hour12: false,
          hour: '2-digit',
          minute: '2-digit'
        }) + ' CET'
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (sectionId: string) => {
    setMobileMenuOpen(false);
    if (isProjectView && onBackToWork) {
      onBackToWork();
      setTimeout(() => {
        onNavigateSection?.(sectionId);
      }, 150);
    } else {
      onNavigateSection?.(sectionId);
    }
  };

  return (
    <header
      id="main-navigation"
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-[#09090b]/85 backdrop-blur-md border-b border-white/[0.06] py-4'
          : 'bg-transparent py-6 md:py-8'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between">
        {/* Brand / Name */}
        <div className="flex items-center gap-4">
          {isProjectView ? (
            <button
              id="back-to-work-nav-btn"
              onClick={onBackToWork}
              className="flex items-center gap-2 text-xs font-mono tracking-widest uppercase text-zinc-300 hover:text-white transition-colors group cursor-pointer"
            >
              <ArrowLeft size={14} className="transition-transform group-hover:-translate-x-1" />
              <span>Back to Overview</span>
            </button>
          ) : (
            <a
              href="#top"
              onClick={(e) => {
                e.preventDefault();
                handleNavClick('top');
              }}
              className="group flex flex-col"
            >
              <span className="font-display font-bold text-sm tracking-widest text-zinc-100 group-hover:text-white uppercase">
                {designerName}
              </span>
              <span className="text-[10px] font-mono tracking-widest uppercase text-zinc-500">
                Motion Portfolio
              </span>
            </a>
          )}
        </div>

        {/* Center Live Availability / Studio status (Desktop) */}
        <div className="hidden lg:flex items-center gap-4 text-[11px] font-mono tracking-wider text-zinc-400">
          <div className="flex items-center gap-2 px-3 py-1 rounded-full border border-white/[0.08] bg-white/[0.02]">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-zinc-300">OPEN FOR COMMISSIONS</span>
          </div>
          <span className="text-zinc-600">/</span>
          <span>PARIS {timeString}</span>
        </div>

        {/* Desktop Nav Items */}
        <nav className="hidden md:flex items-center gap-8 text-xs font-mono tracking-widest uppercase text-zinc-400">
          <button
            id="nav-work-link"
            onClick={() => handleNavClick('work')}
            className="hover:text-white transition-colors cursor-pointer"
          >
            Work (06)
          </button>

          <button
            id="nav-reel-link"
            onClick={() => {
              if (onOpenReel) {
                onOpenReel();
              } else {
                handleNavClick('showreel');
              }
            }}
            className="flex items-center gap-1.5 text-zinc-300 hover:text-white transition-colors cursor-pointer"
          >
            <Disc size={13} className="animate-spin text-zinc-400" style={{ animationDuration: '8s' }} />
            <span>Showreel</span>
          </button>

          <button
            id="nav-about-link"
            onClick={() => handleNavClick('about')}
            className="hover:text-white transition-colors cursor-pointer"
          >
            About
          </button>

          <button
            id="nav-contact-link"
            onClick={() => handleNavClick('contact')}
            className="px-3.5 py-1.5 border border-white/20 rounded-full text-zinc-200 hover:text-white hover:border-white/60 hover:bg-white/[0.05] transition-all cursor-pointer"
          >
            Contact
          </button>
        </nav>

        {/* Mobile Menu Trigger */}
        <div className="flex md:hidden items-center gap-3">
          {onOpenReel && (
            <button
              onClick={onOpenReel}
              className="text-[11px] font-mono tracking-widest uppercase px-2.5 py-1 rounded-full border border-white/20 text-zinc-300"
            >
              Reel
            </button>
          )}
          <button
            id="mobile-menu-toggle-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation menu"
            className="p-2 text-zinc-300 hover:text-white"
          >
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-x-0 top-[65px] bg-[#0a0a0c]/98 border-b border-white/10 px-8 py-8 flex flex-col gap-6 backdrop-blur-xl">
          <div className="flex flex-col gap-5 text-sm font-mono tracking-widest uppercase">
            <button
              onClick={() => handleNavClick('work')}
              className="text-left text-zinc-300 hover:text-white py-1"
            >
              Selected Work (06)
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                if (onOpenReel) onOpenReel();
                else handleNavClick('showreel');
              }}
              className="text-left text-zinc-300 hover:text-white py-1 flex items-center gap-2"
            >
              <Disc size={14} className="animate-spin" />
              <span>Full Showreel</span>
            </button>
            <button
              onClick={() => handleNavClick('about')}
              className="text-left text-zinc-300 hover:text-white py-1"
            >
              About / Software
            </button>
            <button
              onClick={() => handleNavClick('contact')}
              className="text-left text-zinc-200 hover:text-white py-1 border-t border-white/10 pt-4"
            >
              Let's Make Something Move →
            </button>
          </div>

          <div className="pt-4 border-t border-white/5 text-[11px] font-mono text-zinc-500 flex items-center justify-between">
            <span>PARIS {timeString}</span>
            <span className="text-emerald-400">AVAILABLE</span>
          </div>
        </div>
      )}
    </header>
  );
}
