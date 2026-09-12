import { PortfolioData } from '../types';
import { normalizedProjects, projectGalleryList, ProjectEntry } from './projectsData';

export { projectGalleryList };
export type { ProjectEntry };

export const initialPortfolioData: PortfolioData = {
  // YOU CAN EASILY CUSTOMIZE YOUR NAME & DETAILS HERE:
  designerName: 'Musta_phavfx',
  designerTitle: 'Motion Designer for AI/SaaS/Fintech companies',
  tagline: 'I create motion, visual identities and digital experiences for high-growth tech companies.',
  
  // MAIN SHOWREEL / HERO BACKGROUND
  // Direct image/photo behind name (and optional .mp4 showreel link)
  showreelVideoUrl: '',
  showreelPosterUrl: 'https://res.cloudinary.com/rtl1qljc/image/upload/v1788954487/avatar_upscayl_3x_upscayl-standard-4x.png',

  bio: [
    'Independent motion designer and art director specializing in high-fidelity 3D motion, kinetic systems, and product narratives for AI, SaaS, and Fintech innovators.',
    'Collaborating with venture-backed startups and category leaders to translate complex technical breakthroughs into visceral, rhythmic motion systems.',
    'Driven by precision timing, procedural physics, tactile material shaders, and cinematic interface design.'
  ],

  skills: [
    'Art Direction & Creative Direction',
    '3D Motion Design & Simulation',
    'AI & SaaS Product Motion Systems',
    'Kinetic Typography & Type Systems',
    'Fintech Brand Identity Toolkits',
    'Look Development & Shading',
    'Procedural Particle Generation',
    'Audio-Reactive Sound Visualization'
  ],

  software: [
    'After Effects',
    'Cinema 4D',
    'Blender',
    'Figma',
    'Illustrator',
    'Photoshop',
    'DaVinci Resolve'
  ],

  awards: [
    { name: 'Motion Design Awards', award: 'Best 3D Simulation of the Year', year: '2024' },
    { name: 'Vimeo Staff Pick', award: 'Best Narrative Short / Titles', year: '2023' },
    { name: 'Behance Curated', award: 'Motion & Branding Showcase', year: '2024' },
    { name: 'Type Directors Club', award: 'Excellence in Kinetic Typography', year: '2023' }
  ],

  contact: {
    statement: "Let's make something move.",
    email: 'contact@mustaphavfx.studio',
    instagram: 'https://www.instagram.com/musta__phavfx/',
    tiktok: 'https://www.tiktok.com/@mustapha__vfx',
    behance: 'https://behance.net/musta_phavfx',
    vimeo: 'https://vimeo.com/musta_phavfx',
    linkedin: 'https://www.linkedin.com/in/mustapha-tamerdjent-88179b431/?skipRedirect=true',
    location: 'PARIS / REMOTE WORLDWIDE',
    availability: 'AVAILABLE FOR COMMISSIONS Q3 / Q4 2026'
  },

  /**
   * All portfolio video projects are maintained in src/data/projectsData.ts.
   * To add, edit, or remove videos, open src/data/projectsData.ts!
   */
  projects: normalizedProjects
};

