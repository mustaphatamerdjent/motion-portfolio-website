import { useEffect } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, ArrowRight, Share2, Check } from 'lucide-react';
import { useState } from 'react';
import { Project } from '../types';
import { SmartVideo } from './SmartVideo';

interface ProjectDetailProps {
  key?: string;
  project: Project;
  allProjects: Project[];
  onBackToWork: () => void;
  onSelectProject: (project: Project) => void;
}

export function ProjectDetail({
  project,
  allProjects,
  onBackToWork,
  onSelectProject
}: ProjectDetailProps) {
  const [copied, setCopied] = useState(false);

  // Scroll to top when project detail opens
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [project.id]);

  // Find next project in sequence for infinite study flow
  const currentIndex = allProjects.findIndex((p) => p.id === project.id);
  const nextProject = allProjects[(currentIndex + 1) % allProjects.length];
  const prevProject = allProjects[(currentIndex - 1 + allProjects.length) % allProjects.length];

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.article
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="min-h-screen pt-28 md:pt-36 pb-28 px-6 md:px-12 max-w-7xl mx-auto"
    >
      {/* Top Nav Breadcrumbs & Controls */}
      <div className="flex items-center justify-between pb-8 md:pb-12 border-b border-white/[0.08]">
        <button
          id="project-detail-back-btn"
          onClick={onBackToWork}
          className="inline-flex items-center gap-2 text-xs font-mono tracking-widest uppercase text-zinc-400 hover:text-white transition-colors cursor-pointer group"
        >
          <ArrowLeft size={14} className="transition-transform group-hover:-translate-x-1" />
          <span>Back to all projects</span>
        </button>

        <div className="flex items-center gap-4">
          <button
            onClick={handleShare}
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-white/10 text-zinc-400 hover:text-zinc-200 text-xs font-mono tracking-wider transition-colors cursor-pointer"
          >
            {copied ? <Check size={12} className="text-emerald-400" /> : <Share2 size={12} />}
            <span>{copied ? 'COPIED LINK' : 'SHARE'}</span>
          </button>
        </div>
      </div>

      {/* Hero Title & Client Summary */}
      <div className="pt-10 pb-8 md:py-14">
        <div className="flex flex-wrap items-center gap-3 text-xs font-mono tracking-widest text-zinc-500 uppercase mb-4">
          <span>PROJECT {String(currentIndex + 1).padStart(2, '0')} / {String(allProjects.length).padStart(2, '0')}</span>
          <span>•</span>
          <span className="text-zinc-300">{project.category}</span>
        </div>

        <h1 className="font-display text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black uppercase tracking-tight text-white leading-none">
          {project.title}
        </h1>
      </div>

      {/* Large Hero Video (Direct HTML5) */}
      <div className="rounded-2xl overflow-hidden border border-white/10 shadow-2xl bg-black mb-16 md:mb-24">
        <SmartVideo
          src={project.videoUrl}
          poster={project.posterUrl}
          aspectRatio="16/9"
          priority={true}
          title={`${project.title} Hero Video`}
          className="w-full"
        />
        <div className="py-2.5 px-4 bg-zinc-950/80 border-t border-white/5 flex items-center justify-between text-[11px] font-mono text-zinc-500">
          <span>HERO FILM PASS // DIRECT MP4 PLAYBACK</span>
          <span className="text-zinc-400">{project.client} © {project.year}</span>
        </div>
      </div>

      {/* Metadata & Narrative Two-Column Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 md:gap-16 pb-20 border-b border-white/[0.08]">
        {/* Left Column: Metadata Specs */}
        <div className="lg:col-span-5 flex flex-col gap-8">
          <div className="grid grid-cols-2 gap-6 p-6 rounded-xl border border-white/[0.08] bg-zinc-950/40 font-mono text-xs">
            <div>
              <span className="text-zinc-500 uppercase tracking-widest block mb-1">CLIENT</span>
              <span className="text-zinc-100 font-medium text-sm">{project.client}</span>
            </div>

            <div>
              <span className="text-zinc-500 uppercase tracking-widest block mb-1">YEAR</span>
              <span className="text-zinc-100 font-medium text-sm">{project.year}</span>
            </div>

            <div className="col-span-2 pt-2 border-t border-white/5">
              <span className="text-zinc-500 uppercase tracking-widest block mb-1">MY ROLE</span>
              <span className="text-zinc-100 font-medium text-sm">{project.role}</span>
            </div>
          </div>

          {/* Software Used */}
          <div>
            <span className="text-xs font-mono tracking-widest text-zinc-500 uppercase block mb-3">
              SOFTWARE USED
            </span>
            <div className="flex flex-wrap gap-2">
              {project.software.map((tool) => (
                <span
                  key={tool}
                  className="px-3.5 py-1.5 rounded-full border border-white/10 bg-white/[0.02] text-xs font-mono text-zinc-300 tracking-wide"
                >
                  {tool}
                </span>
              ))}
            </div>
          </div>

          {/* Credits */}
          {project.credits && project.credits.length > 0 && (
            <div>
              <span className="text-xs font-mono tracking-widest text-zinc-500 uppercase block mb-3">
                CREDITS & COLLABORATORS
              </span>
              <div className="flex flex-col gap-2 font-mono text-xs text-zinc-400">
                {project.credits.map((c, i) => (
                  <div key={i} className="flex justify-between border-b border-white/5 pb-1">
                    <span className="text-zinc-500">{c.role}</span>
                    <span className="text-zinc-300">{c.name}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Project Description */}
        <div className="lg:col-span-7 flex flex-col gap-8">
          <div>
            <span className="text-xs font-mono tracking-widest text-zinc-500 uppercase block mb-3">
              CREATIVE DIRECTION & NARRATIVE
            </span>
            <p className="text-xl sm:text-2xl text-zinc-200 font-light leading-relaxed">
              {project.fullDescription}
            </p>
          </div>

          {project.direction && (
            <div className="p-6 rounded-xl border-l-2 border-zinc-400 bg-white/[0.02]">
              <span className="text-xs font-mono tracking-widest text-zinc-400 uppercase block mb-1">
                ART DIRECTION MANIFESTO
              </span>
              <p className="text-sm sm:text-base text-zinc-300 font-light italic">
                "{project.direction}"
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Additional Video & Image Sections */}
      {project.additionalMedia && project.additionalMedia.length > 0 && (
        <section className="py-20 border-b border-white/[0.08]">
          <div className="flex items-center justify-between mb-12">
            <div>
              <span className="text-xs font-mono tracking-widest text-zinc-500 uppercase block mb-1">
                PROCESS & STYLEFRAMES
              </span>
              <h3 className="font-display text-2xl sm:text-3xl font-bold uppercase text-white">
                Look Development & R&D Passes
              </h3>
            </div>
            <span className="text-xs font-mono text-zinc-500">
              {project.additionalMedia.length} ARTIFACTS
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
            {project.additionalMedia.map((media) => {
              const isFull = media.span === 'full';
              return (
                <div
                  key={media.id}
                  className={`flex flex-col gap-3 ${isFull ? 'md:col-span-2' : 'md:col-span-1'}`}
                >
                  <div className="rounded-xl overflow-hidden border border-white/10 bg-[#0c0c0e]">
                    {media.type === 'video' ? (
                      <SmartVideo
                        src={media.url}
                        poster={media.posterUrl}
                        aspectRatio={isFull ? '21/9' : '16/9'}
                        title={media.caption || 'Process clip'}
                        className="w-full"
                      />
                    ) : (
                      <img
                        src={media.url}
                        alt={media.caption || project.title}
                        loading="lazy"
                        className="w-full h-full object-cover object-center max-h-[600px] hover:scale-[1.01] transition-transform duration-500"
                      />
                    )}
                  </div>
                  {media.caption && (
                    <p className="text-xs font-mono text-zinc-500 tracking-wider">
                      // {media.caption}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Navigation Footer: Prev / Next Projects */}
      <section className="pt-20">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          <button
            onClick={() => onSelectProject(prevProject)}
            className="w-full sm:w-auto flex items-center gap-3 p-4 rounded-xl border border-white/10 hover:border-white/30 bg-white/[0.02] hover:bg-white/[0.05] transition-all text-left group cursor-pointer"
          >
            <ArrowLeft size={18} className="text-zinc-500 group-hover:text-white group-hover:-translate-x-1 transition-transform" />
            <div>
              <span className="text-[10px] font-mono tracking-widest uppercase text-zinc-500 block">PREVIOUS PROJECT</span>
              <span className="text-sm font-display font-bold uppercase text-zinc-200 group-hover:text-white">{prevProject.title}</span>
            </div>
          </button>

          <button
            onClick={onBackToWork}
            className="px-6 py-3 rounded-full border border-white/20 hover:bg-white text-zinc-300 hover:text-black font-mono text-xs tracking-widest uppercase transition-all cursor-pointer"
          >
            Overview
          </button>

          <button
            onClick={() => onSelectProject(nextProject)}
            className="w-full sm:w-auto flex items-center justify-end gap-3 p-4 rounded-xl border border-white/10 hover:border-white/30 bg-white/[0.02] hover:bg-white/[0.05] transition-all text-right group cursor-pointer"
          >
            <div>
              <span className="text-[10px] font-mono tracking-widest uppercase text-zinc-500 block">NEXT PROJECT</span>
              <span className="text-sm font-display font-bold uppercase text-zinc-200 group-hover:text-white">{nextProject.title}</span>
            </div>
            <ArrowRight size={18} className="text-zinc-500 group-hover:text-white group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </section>
    </motion.article>
  );
}
