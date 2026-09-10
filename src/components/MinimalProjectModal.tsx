import { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ArrowRight, ArrowLeft } from 'lucide-react';
import { Project } from '../types';
import { getOptimizedVideoUrl, getOptimizedPosterUrl } from '../utils/cloudinary';

interface MinimalProjectModalProps {
  project: Project | null;
  allProjects: Project[];
  onClose: () => void;
  onSelectProject: (project: Project) => void;
}

export function MinimalProjectModal({
  project,
  allProjects,
  onClose,
  onSelectProject
}: MinimalProjectModalProps) {
  useEffect(() => {
    if (!project) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') onSelectProject(nextProject);
      if (e.key === 'ArrowLeft') onSelectProject(prevProject);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [project, onClose]);

  if (!project) return null;

  const currentIndex = allProjects.findIndex((p) => p.id === project.id);
  const nextProject = allProjects[(currentIndex + 1) % allProjects.length];
  const prevProject = allProjects[(currentIndex - 1 + allProjects.length) % allProjects.length];

  // Filter out duplicate media that matches the main hero video
  const distinctAdditionalMedia =
    project.additionalMedia?.filter(
      (media) => media.url && media.url !== project.videoUrl
    ) || [];

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        className="fixed inset-0 z-[150] overflow-y-auto bg-[#070709]/98 backdrop-blur-xl flex flex-col justify-between p-6 sm:p-12"
      >
        {/* Top Minimal Bar */}
        <div className="flex items-center justify-between pb-8 border-b border-white/10 max-w-7xl mx-auto w-full text-xs font-mono tracking-widest text-zinc-400 uppercase">
          <button
            onClick={onClose}
            className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors cursor-pointer group"
          >
            <X size={16} className="group-hover:rotate-90 transition-transform duration-300" />
            <span>Close to Reel [ESC]</span>
          </button>

          <div className="flex items-center gap-4">
            <span className="text-zinc-500">PROJECT</span>
            <span className="text-white font-bold">
              {String(currentIndex + 1).padStart(2, '0')} / {String(allProjects.length).padStart(2, '0')}
            </span>
          </div>
        </div>

        {/* Center Visual Showcase */}
        <div className="max-w-7xl mx-auto w-full my-8 flex flex-col gap-10">
          {/* Minimal Title Header */}
          <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-4">
            <div>
              <span className="text-xs font-mono tracking-widest text-zinc-500 uppercase block mb-1">
                {project.category}
              </span>
              <h1 className="font-display text-4xl sm:text-6xl md:text-7xl font-extrabold text-white tracking-tight">
                {project.title}
              </h1>
            </div>

            <div className="flex sm:flex-col sm:items-end gap-3 text-xs font-mono tracking-widest text-zinc-400">
              <span className="text-white uppercase font-medium">{project.client}</span>
              <span className="text-zinc-500">{project.year}</span>
            </div>
          </div>

          {/* Single Direct Master HTML5 Video Player */}
          <div
            style={{ aspectRatio: project.aspectRatio || '16/9' }}
            className={`rounded-2xl overflow-hidden border border-white/10 shadow-[0_20px_80px_rgba(0,0,0,0.8)] bg-black mx-auto w-full ${
              project.aspectRatio === '9/16'
                ? 'max-w-[420px] max-h-[78vh]'
                : project.aspectRatio === '1/1'
                ? 'max-w-[620px] max-h-[75vh]'
                : 'max-w-5xl'
            }`}
          >
            <video
              src={getOptimizedVideoUrl(project.videoUrl)}
              poster={getOptimizedPosterUrl(project.posterUrl)}
              autoPlay
              muted
              loop
              playsInline
              controls
              className="w-full h-full object-cover"
            />
          </div>

          {/* Minimal Software & Specs Badges */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-white/10 text-xs font-mono">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-zinc-500 uppercase mr-2">Tools:</span>
              {project.software.map((s) => (
                <span key={s} className="px-3 py-1 rounded-full border border-white/10 bg-white/[0.02] text-zinc-300">
                  {s}
                </span>
              ))}
            </div>

            <span className="text-zinc-500">{project.role}</span>
          </div>

          {/* Additional Media (only distinct media, never duplicate hero video) */}
          {distinctAdditionalMedia.length > 0 && (
            <div className="pt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              {distinctAdditionalMedia.slice(0, 2).map((media) => (
                <div key={media.id} className="rounded-xl overflow-hidden border border-white/10 bg-black aspect-[16/9]">
                  {media.type === 'video' ? (
                    <video
                      src={getOptimizedVideoUrl(media.url)}
                      poster={media.posterUrl ? getOptimizedPosterUrl(media.posterUrl) : undefined}
                      autoPlay
                      muted
                      loop
                      playsInline
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <img
                      src={getOptimizedPosterUrl(media.url)}
                      alt={media.caption || project.title}
                      loading="lazy"
                      decoding="async"
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Bottom Stepper: Prev / Next */}
        <div className="max-w-7xl mx-auto w-full pt-8 border-t border-white/10 flex items-center justify-between text-xs font-mono tracking-widest uppercase">
          <button
            onClick={() => onSelectProject(prevProject)}
            className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors cursor-pointer"
          >
            <ArrowLeft size={14} />
            <span>Prev: {prevProject.title}</span>
          </button>

          <button
            onClick={() => onSelectProject(nextProject)}
            className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors cursor-pointer"
          >
            <span>Next: {nextProject.title}</span>
            <ArrowRight size={14} />
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
