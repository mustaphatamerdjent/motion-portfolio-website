export interface ProjectMedia {
  id: string;
  type: 'video' | 'image';
  url: string;
  posterUrl?: string;
  caption?: string;
  span?: 'full' | 'half';
  aspectRatio?: string;
}

export interface ProjectCredit {
  role: string;
  name: string;
}

export interface Project {
  id: string;
  slug: string;
  title: string;
  client: string;
  year: string;
  category: string;
  role: string;
  software: string[];
  shortDescription: string;
  fullDescription: string;
  direction?: string;
  videoUrl: string; // Direct MP4 video URL
  posterUrl: string;
  aspectRatio?: string;
  featured?: boolean;
  additionalMedia: ProjectMedia[];
  credits?: ProjectCredit[];
}

export interface ContactInfo {
  statement: string;
  email: string;
  instagram: string;
  behance?: string;
  tiktok?: string;
  vimeo?: string;
  linkedin?: string;
  location: string;
  availability: string;
}

export interface AwardItem {
  name: string;
  award: string;
  year: string;
}

export interface PortfolioData {
  designerName: string;
  designerTitle: string;
  tagline: string;
  showreelVideoUrl: string;
  showreelPosterUrl: string;
  bio: string[];
  skills: string[];
  software: string[];
  awards: AwardItem[];
  contact: ContactInfo;
  projects: Project[];
}
