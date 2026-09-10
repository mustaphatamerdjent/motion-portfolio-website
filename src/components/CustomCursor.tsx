import { useEffect, useState, useRef } from 'react';
import { motion } from 'motion/react';

export function CustomCursor() {
  const [pos, setPos] = useState({ x: -100, y: -100 });
  const [cursorType, setCursorType] = useState<'default' | 'pointer' | 'project' | 'video'>('default');
  const [cursorLabel, setCursorLabel] = useState<string>('');
  const [isVisible, setIsVisible] = useState(false);
  const isVisibleRef = useRef(false);
  const [isTouch, setIsTouch] = useState(false);

  useEffect(() => {
    // Check touch screen or prefers-reduced-motion
    if (window.matchMedia('(pointer: coarse)').matches) {
      setIsTouch(true);
      return;
    }
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      setIsTouch(true);
      return;
    }

    const handleMouseMove = (e: MouseEvent) => {
      setPos({ x: e.clientX, y: e.clientY });
      if (!isVisibleRef.current) {
        isVisibleRef.current = true;
        setIsVisible(true);
      }

      // Inspect hovered target for custom cursor states
      const target = e.target as HTMLElement | null;
      if (!target) return;

      const projectEl = target.closest('[data-cursor="project"]');
      const videoEl = target.closest('[data-cursor="video"]');
      const clickableEl = target.closest('a, button, [role="button"], input, textarea');

      if (projectEl) {
        setCursorType('project');
        setCursorLabel('EXPLORE');
      } else if (videoEl) {
        setCursorType('video');
        setCursorLabel('PLAY');
      } else if (clickableEl) {
        setCursorType('pointer');
        setCursorLabel('');
      } else {
        setCursorType('default');
        setCursorLabel('');
      }
    };

    const handleMouseLeave = () => {
      isVisibleRef.current = false;
      setIsVisible(false);
    };

    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  if (isTouch || !isVisible) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-[1000] overflow-hidden">
      {/* Precision center dot */}
      <motion.div
        className="fixed top-0 left-0 w-1.5 h-1.5 rounded-full bg-white -translate-x-1/2 -translate-y-1/2 pointer-events-none mix-blend-difference"
        animate={{
          x: pos.x,
          y: pos.y,
          opacity: cursorType === 'project' || cursorType === 'video' ? 0 : 1
        }}
        transition={{ type: 'spring', damping: 40, stiffness: 600, mass: 0.1 }}
      />

      {/* Floating magnetic ring / label pill */}
      <motion.div
        className="fixed top-0 left-0 -translate-x-1/2 -translate-y-1/2 pointer-events-none flex items-center justify-center rounded-full border border-white/30 backdrop-blur-[2px] transition-colors"
        animate={{
          x: pos.x,
          y: pos.y,
          width: cursorType === 'project' || cursorType === 'video' ? 76 : cursorType === 'pointer' ? 44 : 26,
          height: cursorType === 'project' || cursorType === 'video' ? 76 : cursorType === 'pointer' ? 44 : 26,
          backgroundColor:
            cursorType === 'project' || cursorType === 'video'
              ? 'rgba(255, 255, 255, 0.95)'
              : 'rgba(255, 255, 255, 0.04)',
          borderColor:
            cursorType === 'project' || cursorType === 'video'
              ? 'rgba(255, 255, 255, 1)'
              : cursorType === 'pointer'
              ? 'rgba(255, 255, 255, 0.6)'
              : 'rgba(255, 255, 255, 0.25)'
        }}
        transition={{ type: 'spring', damping: 28, stiffness: 350, mass: 0.2 }}
      >
        {cursorLabel && (
          <span className="text-[10px] font-mono tracking-widest font-semibold text-black uppercase select-none">
            {cursorLabel}
          </span>
        )}
      </motion.div>
    </div>
  );
}
