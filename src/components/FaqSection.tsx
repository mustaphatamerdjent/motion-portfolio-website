import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown, ArrowUpRight } from 'lucide-react';

interface FaqItem {
  question: string;
  answer: string;
  highlight?: string;
}

const FAQ_ITEMS: FaqItem[] = [
  {
    question: 'How does your process work?',
    answer:
      'Our production pipeline is engineered for speed, high visual fidelity, and absolute clarity from day one:\n\n• 01. Discovery & Scripting — Aligning on core product narrative, kinetic tempo, and technical messaging.\n• 02. Styleframes & Lookdev — Designing high-resolution 3D stills and material shaders to lock the visual direction before moving a single keyframe.\n• 03. Kinetic Animation & Physics — Procedural particle simulation, tactile UI choreography, and dynamic camera direction.\n• 04. Sound Design & Final Master — Custom cinematic audio synthesis, color grading, and delivery in uncompressed 4K master files.'
  },
  {
    question: 'How long does a video take to produce?',
    answer:
      'Most product motion films and 3D vignette sequences take between 2 to 4 weeks from concept sign-off to final delivery. Turnaround depends on duration, procedural complexity, and simulation requirements. Expedited rush turnarounds (5–7 business days) are available for urgent funding announcements and product launch deadlines.'
  },
  {
    question: 'What do you need from us to get started?',
    answer:
      'To kick off a project swiftly, all we need is a brief overview of your product or campaign objective, your target deadline, and any existing design assets (Figma frames, vector logos, brand typography, or 3D models). If you don’t have a structured brief yet, we can shape the scope together during a 15-minute discovery kickoff.'
  },
  {
    question: 'How many revisions are included?',
    answer:
      'Only one revision is available with the first video. Additional revisions are available for a flat fee.',
    highlight:
      'Because art direction, camera angles, and pacing are locked upfront during the styleframe and animatic stage, the first cut hits the mark with high precision. If subsequent pivots or extra iterations are requested, they are billed transparently at a straightforward flat rate.'
  },
  {
    question: 'What does it cost?',
    answer:
      'Every engagement is scoped individually based on video duration, visual fidelity, 3D simulation complexity, and delivery schedule. Standard motion vignettes typically range from $300 to $1,200+, with comprehensive launch identity packages quoted on a tailored flat-fee basis. Submit your brief below to receive a transparent proposal within 24 hours.'
  },
  {
    question: 'Do you work with early stage startups?',
    answer:
      'Yes, frequently. I collaborate directly with seed and Series A founders to craft high-impact launch films, funding announcement reels, and kinetic product demos that captivate investors, early adopters, and tech media.'
  }
];

interface FaqSectionProps {
  onGetInTouch?: () => void;
}

export function FaqSection({ onGetInTouch }: FaqSectionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleItem = (idx: number) => {
    setOpenIndex((current) => (current === idx ? null : idx));
  };

  const handleGetInTouchClick = () => {
    if (onGetInTouch) {
      onGetInTouch();
    } else {
      const el = document.getElementById('booking');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <section
      id="faq"
      className="relative w-full py-24 sm:py-32 md:py-40 px-6 sm:px-8 md:px-16 bg-[#070709] border-t border-white/[0.06] overflow-hidden"
    >
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Left Column: FAQ Badge, Headline, and 'Get in touch' link */}
          <div className="lg:col-span-5 lg:sticky lg:top-28">
            <span className="inline-flex items-center px-3 py-1 rounded-full bg-white/[0.05] border border-white/15 text-zinc-300 font-mono text-[11px] sm:text-xs font-semibold tracking-wider uppercase mb-5">
              FAQ
            </span>

            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white leading-[1.12] mb-6">
              Questions we get asked a lot
            </h2>

            <p className="text-sm sm:text-base text-zinc-400 leading-relaxed flex items-center gap-1.5 flex-wrap">
              <span>Still have questions?</span>
              <button
                id="faq-get-in-touch-btn"
                onClick={handleGetInTouchClick}
                className="text-white hover:text-zinc-300 font-medium inline-flex items-center gap-0.5 underline underline-offset-4 cursor-pointer transition-colors group"
              >
                <span>Get in touch</span>
                <ArrowUpRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </button>
            </p>
          </div>

          {/* Right Column: Accordion Items */}
          <div className="lg:col-span-7 divide-y divide-white/[0.08] border-t border-b border-white/[0.08]">
            {FAQ_ITEMS.map((item, idx) => {
              const isOpen = openIndex === idx;

              return (
                <div key={idx} className="py-5 sm:py-6 transition-colors">
                  <button
                    id={`faq-accordion-btn-${idx}`}
                    onClick={() => toggleItem(idx)}
                    aria-expanded={isOpen}
                    aria-controls={`faq-accordion-panel-${idx}`}
                    className="w-full flex items-center justify-between gap-4 text-left group cursor-pointer"
                  >
                    <span
                      className={`text-base sm:text-lg md:text-xl font-medium tracking-tight transition-colors duration-200 ${
                        isOpen ? 'text-white' : 'text-zinc-200 group-hover:text-white'
                      }`}
                    >
                      {item.question}
                    </span>

                    <motion.div
                      animate={{ rotate: isOpen ? 180 : 0 }}
                      transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
                      className="shrink-0 text-zinc-400 group-hover:text-white transition-colors"
                    >
                      <ChevronDown className="w-5 h-5" />
                    </motion.div>
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        key="content"
                        id={`faq-accordion-panel-${idx}`}
                        role="region"
                        aria-labelledby={`faq-accordion-btn-${idx}`}
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                        className="overflow-hidden"
                      >
                        <div className="pt-4 sm:pt-5 pr-6 sm:pr-8 text-sm sm:text-base text-zinc-400 leading-relaxed space-y-3 whitespace-pre-line font-normal">
                          <p>{item.answer}</p>
                          {item.highlight && (
                            <p className="text-zinc-500 text-xs sm:text-sm border-l-2 border-white/20 pl-3 italic">
                              {item.highlight}
                            </p>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
