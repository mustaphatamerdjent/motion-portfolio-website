import { useState } from 'react';
import { motion } from 'motion/react';
import { Project } from '../types';
import { ProjectCard } from './ProjectCard';

interface WorkSectionProps {
  projects: Project[];
  onSelectProject: (project: Project) => void;
}

export function WorkSection({ projects, onSelectProject }: WorkSectionProps) {
  const [activeCategory, setActiveCategory] = useState<string>('All');

  const categories = ['All', '3D Motion & Simulation', 'Sound Visualization & Brand', 'Title Sequence & Creative Direction', 'Kinetic UI & Generative 3D', 'Procedural Motion Installation', 'Commercial & CGI Lookdev'];

  const filteredProjects = activeCategory === 'All'
    ? projects
    : projects.filter((p) => p.category === activeCategory);

  return (
    <section id="work" className="py-24 md:py-36 px-6 md:px-12 max-w-7xl mx-auto">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-12 md:pb-16 border-b border-white/[0.1]">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono tracking-widest text-zinc-500 uppercase mb-3">
            <span className="w-1.5 h-1.5 rounded-full bg-zinc-400" />
            <span>PORTFOLIO INDEX</span>
          </div>
          <h2 className="font-display text-4xl sm:text-5xl md:text-6xl font-bold uppercase tracking-tight text-white">
            Selected Work
          </h2>
        </div>

        <div className="flex flex-col md:items-end gap-2 text-xs font-mono text-zinc-400">
          <span className="text-zinc-200">DIRECT HTML5 VIDEO REELS</span>
          <span className="text-zinc-500">6 FEATURED CASE STUDIES</span>
        </div>
      </div>

      {/* Category Pills (Subtle studio filter) */}
      <div className="py-8 flex items-center gap-2 overflow-x-auto no-scrollbar">
        {['All', '3D Motion', 'Branding', 'Titles', 'Installations'].map((cat) => {
          const isSelected = (cat === 'All' && activeCategory === 'All') ||
            (cat === '3D Motion' && activeCategory === '3D Motion & Simulation') ||
            (cat === 'Branding' && activeCategory === 'Sound Visualization & Brand') ||
            (cat === 'Titles' && activeCategory === 'Title Sequence & Creative Direction') ||
            (cat === 'Installations' && activeCategory === 'Procedural Motion Installation');

          return (
            <button
              key={cat}
              onClick={() => {
                if (cat === 'All') setActiveCategory('All');
                else if (cat === '3D Motion') setActiveCategory('3D Motion & Simulation');
                else if (cat === 'Branding') setActiveCategory('Sound Visualization & Brand');
                else if (cat === 'Titles') setActiveCategory('Title Sequence & Creative Direction');
                else if (cat === 'Installations') setActiveCategory('Procedural Motion Installation');
              }}
              className={`px-4 py-2 rounded-full text-xs font-mono tracking-wider uppercase transition-all shrink-0 cursor-pointer ${
                isSelected
                  ? 'bg-white text-black font-semibold'
                  : 'bg-white/[0.03] text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.08] border border-white/[0.08]'
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* 6 Large Project Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 pt-4">
        {filteredProjects.map((project, index) => (
          <div
            key={project.id}
            className={index % 3 === 0 ? 'md:col-span-2' : 'md:col-span-1'}
          >
            <ProjectCard
              project={project}
              index={index}
              onSelectProject={onSelectProject}
            />
          </div>
        ))}
      </div>

      {/* Direct Video Replace Guide (Subtle note for user) */}
      <div className="mt-16 p-6 rounded-xl border border-white/[0.08] bg-zinc-950/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs font-mono text-zinc-400">
        <div>
          <span className="text-zinc-200 font-medium">CUSTOM VIDEO INTEGRATION: </span>
          <span>All 6 projects play native HTML5 videos with autoplay, loop and offscreen pause. Replace links in <code className="text-zinc-300 font-bold bg-white/5 px-1 py-0.5 rounded">src/data/portfolioData.ts</code>.</span>
        </div>
        <div className="text-zinc-500 whitespace-nowrap">
          NO YOUTUBE / NO IFRAMES
        </div>
      </div>
    </section>
  );
}
