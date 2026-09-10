import { motion } from 'motion/react';
import { ArrowUpRight } from 'lucide-react';
import { Project } from '../types';
import { SmartVideo } from './SmartVideo';

interface ProjectCardProps {
  project: Project;
  index: number;
  onSelectProject: (project: Project) => void;
}

export function ProjectCard({ project, index, onSelectProject }: ProjectCardProps) {
  const indexStr = String(index + 1).padStart(2, '0');

  return (
    <motion.article
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="group flex flex-col gap-5 cursor-pointer select-none"
      onClick={() => onSelectProject(project)}
      data-cursor="project"
    >
      {/* Video Frame */}
      <div className="relative rounded-xl overflow-hidden border border-white/10 bg-[#0c0c0e] transition-all duration-500 group-hover:border-white/30 group-hover:shadow-[0_20px_50px_rgba(0,0,0,0.8)]">
        {/* Direct HTML5 Video Player */}
        <SmartVideo
          src={project.videoUrl}
          poster={project.posterUrl}
          aspectRatio="16/9"
          title={project.title}
          showControlsOverlay={true}
          className="w-full"
        />

        {/* Hover overlay hint */}
        <div className="absolute top-4 left-4 z-20 flex items-center gap-2">
          <span className="px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-xs text-[11px] font-mono tracking-widest text-zinc-300 uppercase border border-white/10">
            {indexStr} // {project.category}
          </span>
        </div>

        {/* Explore badge on hover */}
        <div className="absolute top-4 right-4 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="w-10 h-10 rounded-full bg-white text-black flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform">
            <ArrowUpRight size={18} />
          </div>
        </div>
      </div>

      {/* Metadata Row */}
      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-3 pt-1 border-b border-white/[0.08] pb-4">
        <div>
          <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold uppercase tracking-tight text-zinc-100 group-hover:text-white transition-colors">
            {project.title}
          </h2>
          <p className="text-sm text-zinc-400 font-light mt-1.5 max-w-xl">
            {project.shortDescription}
          </p>
        </div>

        <div className="flex sm:flex-col sm:items-end gap-3 sm:gap-1 text-xs font-mono tracking-widest text-zinc-400 shrink-0">
          <div className="text-zinc-200 uppercase font-medium">{project.client}</div>
          <div className="text-zinc-500">{project.year}</div>
        </div>
      </div>
    </motion.article>
  );
}
