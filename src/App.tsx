import { useState, useEffect } from 'react';
import { initialPortfolioData } from './data/portfolioData';
import { Project } from './types';
import { MinimalHero } from './components/MinimalHero';
import { HorizontalReel } from './components/HorizontalReel';
import { FaqSection } from './components/FaqSection';
import { BookingSection } from './components/BookingSection';
import { Footer } from './components/Footer';
import { MinimalProjectModal } from './components/MinimalProjectModal';
import { FilmGrain } from './components/FilmGrain';
import { CustomCursor } from './components/CustomCursor';

export default function App() {
  const [data] = useState(initialPortfolioData);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  // Synchronize with URL hash for browser back/forward and direct links
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash.startsWith('#project/')) {
        const slug = hash.replace('#project/', '');
        const found = data.projects.find((p) => p.slug === slug);
        if (found) {
          setSelectedProject(found);
          return;
        }
      }
      setSelectedProject(null);
    };

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [data.projects]);

  const handleSelectProject = (project: Project) => {
    setSelectedProject(project);
    window.location.hash = `#project/${project.slug}`;
  };

  const handleCloseProject = () => {
    setSelectedProject(null);
    window.location.hash = '#work';
  };

  const scrollToSection = (sectionId: string) => {
    if (sectionId === 'top' || sectionId === 'hero') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="relative min-h-screen bg-[#070709] text-[#e4e4e7] selection:bg-white selection:text-black font-sans overflow-x-hidden">
      {/* Subtle Analog Film Grain Overlay */}
      <FilmGrain />

      {/* Subtle Motion Cursor */}
      <CustomCursor />

      {/* 1. HERO / SHOWREEL */}
      <MinimalHero
        designerName={data.designerName}
        designerTitle={data.designerTitle}
        showreelVideoUrl={data.showreelVideoUrl}
        showreelPosterUrl={data.showreelPosterUrl}
        onScrollToWork={() => scrollToSection('work')}
        onScrollToBooking={() => scrollToSection('booking')}
      />

      {/* 2. HORIZONTAL VIDEO REEL */}
      <HorizontalReel
        projects={data.projects}
        onSelectProject={handleSelectProject}
        isModalOpen={!!selectedProject}
      />

      {/* 3. FREQUENTLY ASKED QUESTIONS (MATCHING PHOTO 2) */}
      <FaqSection onGetInTouch={() => scrollToSection('booking')} />

      {/* 4. PROJECT BOOKING / CREATIVE BRIEF */}
      <BookingSection contact={data.contact} />

      {/* 5. FOOTER WITH SOCIALS FOR CONTACT */}
      <Footer
        designerName={data.designerName}
        designerTitle={data.designerTitle}
        onScrollToTop={() => scrollToSection('top')}
      />

      {/* Minimal Project Case Study Modal */}
      <MinimalProjectModal
        project={selectedProject}
        allProjects={data.projects}
        onClose={handleCloseProject}
        onSelectProject={handleSelectProject}
      />
    </div>
  );
}
