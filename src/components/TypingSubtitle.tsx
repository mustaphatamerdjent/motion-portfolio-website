import React, { useState, useEffect } from 'react';

interface TypingSubtitleProps {
  className?: string;
}

export function TypingSubtitle({ className = '' }: TypingSubtitleProps) {
  // Phrases to cycle through
  const phases = [
    { prefix: 'Motion Designer', suffix: '' },
    { prefix: 'Motion Designer for ', suffix: 'AI' },
    { prefix: 'Motion Designer for ', suffix: 'SaaS' },
    { prefix: 'Motion Designer for ', suffix: 'Fintech' },
    { prefix: 'Motion Designer for ', suffix: 'AI / SaaS / Fintech' },
  ];

  const [phaseIndex, setPhaseIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [cursorVisible, setCursorVisible] = useState(true);

  // Blinking cursor interval
  useEffect(() => {
    const cursorInterval = setInterval(() => {
      setCursorVisible((prev) => !prev);
    }, 530);
    return () => clearInterval(cursorInterval);
  }, []);

  useEffect(() => {
    const currentPhase = phases[phaseIndex];
    const fullTarget = currentPhase.prefix + currentPhase.suffix;

    let timer: NodeJS.Timeout;

    if (!isDeleting) {
      // TYPING FORWARD
      if (displayedText.length < fullTarget.length) {
        // Typing speed with slight humanized cadence
        const typingDelay = Math.floor(Math.random() * 35) + 55;
        timer = setTimeout(() => {
          setDisplayedText(fullTarget.slice(0, displayedText.length + 1));
        }, typingDelay);
      } else {
        // Finished typing current phrase — hold for reading
        const holdTime = phaseIndex === 0 ? 1800 : 2200;
        timer = setTimeout(() => {
          setIsDeleting(true);
        }, holdTime);
      }
    } else {
      // DELETING BACKWARD
      const nextIndex = (phaseIndex + 1) % phases.length;
      const nextPhase = phases[nextIndex];
      const nextFullTarget = nextPhase.prefix + nextPhase.suffix;

      // Find common prefix to avoid retyping what's identical
      let commonPrefixLen = 0;
      while (
        commonPrefixLen < displayedText.length &&
        commonPrefixLen < nextFullTarget.length &&
        displayedText[commonPrefixLen] === nextFullTarget[commonPrefixLen]
      ) {
        commonPrefixLen++;
      }

      if (displayedText.length > commonPrefixLen) {
        // Backspace speed (fast and crisp)
        const deleteDelay = 35;
        timer = setTimeout(() => {
          setDisplayedText(displayedText.slice(0, -1));
        }, deleteDelay);
      } else {
        // Finished deleting to common prefix — switch to typing next phrase
        setIsDeleting(false);
        setPhaseIndex(nextIndex);
      }
    }

    return () => clearTimeout(timer);
  }, [displayedText, isDeleting, phaseIndex]);

  return (
    <div className={`inline-flex items-center justify-center font-mono tracking-widest uppercase ${className}`}>
      <span className="text-zinc-300 font-medium drop-shadow-md whitespace-nowrap">
        {displayedText}
      </span>
      {/* Sleek Minimal Glowing Terminal Cursor */}
      <span
        aria-hidden="true"
        className={`inline-block w-[2px] h-[1.1em] ml-1.5 align-middle bg-zinc-200 transition-opacity duration-150 ${
          cursorVisible ? 'opacity-100 shadow-[0_0_8px_rgba(255,255,255,0.8)]' : 'opacity-0'
        }`}
      />
    </div>
  );
}
