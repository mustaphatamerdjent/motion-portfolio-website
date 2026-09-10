import { motion } from 'motion/react';
import { Award, Layers, Cpu } from 'lucide-react';
import { AwardItem } from '../types';

interface AboutSectionProps {
  designerName: string;
  designerTitle: string;
  bio: string[];
  skills: string[];
  software: string[];
  awards: AwardItem[];
}

export function AboutSection({
  designerName,
  designerTitle,
  bio,
  skills,
  software,
  awards
}: AboutSectionProps) {
  return (
    <section id="about" className="py-24 md:py-36 px-6 md:px-12 max-w-7xl mx-auto border-t border-white/[0.08]">
      {/* Section Subhead */}
      <div className="flex items-center gap-2 text-xs font-mono tracking-widest text-zinc-500 uppercase mb-8">
        <span className="w-1.5 h-1.5 rounded-full bg-zinc-400" />
        <span>PROFILE & PRACTICE</span>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20">
        {/* Left Column: Editorial Headline & Bio */}
        <div className="lg:col-span-7 flex flex-col gap-8">
          <h2 className="font-display text-4xl sm:text-5xl md:text-6xl font-bold uppercase tracking-tight text-white leading-tight">
            Translating complex concepts into kinetic form.
          </h2>

          <div className="flex flex-col gap-5 text-base sm:text-lg text-zinc-300 font-light leading-relaxed">
            {bio.map((para, i) => (
              <p key={i}>{para}</p>
            ))}
          </div>

          {/* Philosophy Callout */}
          <div className="p-8 rounded-2xl border border-white/10 bg-white/[0.02] backdrop-blur-xs mt-4">
            <span className="text-xs font-mono tracking-widest text-zinc-400 uppercase block mb-2">
              DESIGN PHILOSOPHY
            </span>
            <p className="text-lg sm:text-xl font-light text-zinc-200 italic leading-snug">
              "Motion is not superficial ornament. It is visual hierarchy, spatial tension, and visceral emotion articulated across time."
            </p>
            <div className="mt-4 flex items-center justify-between text-xs font-mono text-zinc-500">
              <span>{designerName}</span>
              <span>{designerTitle}</span>
            </div>
          </div>
        </div>

        {/* Right Column: Skills & Required Software */}
        <div className="lg:col-span-5 flex flex-col gap-10">
          {/* Software Section (Required explicit list) */}
          <div>
            <div className="flex items-center gap-2 pb-3 border-b border-white/[0.08] mb-4">
              <Cpu size={14} className="text-zinc-400" />
              <h3 className="text-xs font-mono tracking-widest uppercase text-zinc-400 font-semibold">
                Software & Tooling
              </h3>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {software.map((tool) => (
                <div
                  key={tool}
                  className="p-3.5 rounded-xl border border-white/[0.08] bg-zinc-950/60 hover:border-white/20 transition-colors flex items-center justify-between group"
                >
                  <span className="text-sm font-mono tracking-wide text-zinc-200 group-hover:text-white">
                    {tool}
                  </span>
                  <span className="w-1.5 h-1.5 rounded-full bg-zinc-600 group-hover:bg-zinc-300 transition-colors" />
                </div>
              ))}
            </div>
          </div>

          {/* Skills / Capabilities */}
          <div>
            <div className="flex items-center gap-2 pb-3 border-b border-white/[0.08] mb-4">
              <Layers size={14} className="text-zinc-400" />
              <h3 className="text-xs font-mono tracking-widest uppercase text-zinc-400 font-semibold">
                Disciplines & Capabilities
              </h3>
            </div>

            <ul className="flex flex-col divide-y divide-white/[0.05] text-xs font-mono tracking-wider text-zinc-400">
              {skills.map((skill, index) => (
                <li key={index} className="py-2.5 flex items-center justify-between">
                  <span className="text-zinc-300">{skill}</span>
                  <span className="text-zinc-600 font-mono text-[10px]">{String(index + 1).padStart(2, '0')}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Selected Awards */}
          {awards && awards.length > 0 && (
            <div>
              <div className="flex items-center gap-2 pb-3 border-b border-white/[0.08] mb-4">
                <Award size={14} className="text-zinc-400" />
                <h3 className="text-xs font-mono tracking-widest uppercase text-zinc-400 font-semibold">
                  Selected Recognition
                </h3>
              </div>

              <div className="flex flex-col gap-3 font-mono text-xs">
                {awards.map((award, i) => (
                  <div key={i} className="flex items-baseline justify-between border-b border-white/5 pb-2">
                    <div>
                      <span className="text-zinc-200 block">{award.name}</span>
                      <span className="text-zinc-500 text-[11px]">{award.award}</span>
                    </div>
                    <span className="text-zinc-500 text-[11px]">{award.year}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
