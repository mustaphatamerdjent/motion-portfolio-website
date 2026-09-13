import { Project } from '../types';

/**
 * ============================================================================
 * 🎬 PROJECT & VIDEO GALLERY CONFIGURATION
 * ============================================================================
 *
 * HOW TO ADD A NEW VIDEO / PROJECT IN THE FUTURE:
 * 1. Scroll down to `projectGalleryList` below.
 * 2. Add a new item to the array following this simple format:
 *
 *    {
 *      title: 'Project Title',
 *      videoUrl: 'https://res.cloudinary.com/.../your-video.mp4',
 *      posterUrl: 'https://res.cloudinary.com/.../your-poster.jpg', // Optional: auto-generated if omitted
 *      category: 'AI Motion & 3D Simulation',                       // Optional: defaults to 'Motion Design'
 *      aspectRatio: '16/9',                                         // Optional: '16/9', '1/1', or '9/16'
 *    },
 *
 * The website will automatically render the new video in:
 * - The Desktop Horizontal Motion Reel (with seamless infinite looping)
 * - The Mobile 3D Card Deck (with free-flowing touch physics)
 * - The Interactive Counter (e.g. 01 / 16)
 * - The Case Study / Details View Modal
 *
 * NO JSX, NO CSS, NO COMPONENT CODE CHANGES ARE NEEDED!
 * ============================================================================
 */

export interface ProjectEntry {
  /** The display title of the video project */
  title: string;

  /** Direct Cloudinary video URL (e.g. https://res.cloudinary.com/.../video.mp4) */
  videoUrl: string;

  /** Optional: Custom poster/thumbnail image. If omitted, it is automatically generated from the Cloudinary video! */
  posterUrl?: string;

  /** Optional: Project category or style tag (e.g., "AI Motion", "Fintech 3D"). Defaults to "Motion Design". */
  category?: string;

  /** Optional: Aspect ratio ('16/9' | '1/1' | '9/16'). Defaults to '16/9' */
  aspectRatio?: '16/9' | '1/1' | '9/16' | string;

  /** Optional: Client or brand name (defaults to title) */
  client?: string;

  /** Optional: Release year (defaults to '2024') */
  year?: string;

  /** Optional: Role description */
  role?: string;

  /** Optional: Tools & software used */
  software?: string[];

  /** Optional: Short synopsis for preview */
  shortDescription?: string;

  /** Optional: Detailed case study description */
  fullDescription?: string;

  /** Optional: Creative direction notes */
  direction?: string;
}

/**
 * ============================================================================
 * 👇 ADD / REORDER / REMOVE YOUR PORTFOLIO VIDEOS HERE:
 * ============================================================================
 */
export const projectGalleryList: ProjectEntry[] = [
  // ⭐ [FUTURE VIDEOS] Add your next project here:
  // {
  //   title: "My New Project",
  //   videoUrl: "https://res.cloudinary.com/rtl1qljc/video/upload/v12345/my_video.mp4",
  //   posterUrl: "https://res.cloudinary.com/rtl1qljc/video/upload/so_0/v12345/my_video.jpg", // optional
  //   category: "3D Motion & AI", // optional
  //   aspectRatio: "16/9",        // optional
  // },

  {
    title: 'Open AI Codex',
    videoUrl: 'https://res.cloudinary.com/rtl1qljc/video/upload/v1788952481/codexfinal.mp4',
    posterUrl: 'https://res.cloudinary.com/rtl1qljc/video/upload/so_0/v1788952481/codexfinal.jpg',
    category: 'AI Identity & Kinetic Simulation',
    aspectRatio: '16/9',
    client: 'OpenAI',
    year: '2024',
    role: 'Lead Motion Designer & Lookdev',
    software: ['Cinema 4D', 'Blender', 'After Effects', 'Photoshop'],
    shortDescription: 'Procedural neural physics, dynamic token simulations, and algorithmic kinetic choreography for AI code intelligence.',
    fullDescription: 'An experimental motion study exploring zero-gravity particulate physics and real-time computational flow. Commissioned to visualize neural language synthesis, balancing technical precision with organic kinetic rhythm.',
    direction: 'Macro cinematography, zero-gravity aerodynamics, and high-frequency procedural tension.'
  },
  {
    title: 'Apple Wallet',
    videoUrl: 'https://res.cloudinary.com/rtl1qljc/video/upload/v1788953362/dnyxfinal.mp4',
    posterUrl: 'https://res.cloudinary.com/rtl1qljc/video/upload/so_0/v1788953362/dnyxfinal.jpg',
    category: 'Fintech Motion & Tactile Identity',
    aspectRatio: '1/1',
    client: 'Apple',
    year: '2024',
    role: 'Art Director & 3D Artist',
    software: ['Cinema 4D', 'After Effects', 'Illustrator', 'DaVinci Resolve'],
    shortDescription: 'Tactile card physics, biometric haptic dynamics, and monolithic financial geometry for next-gen payments.',
    fullDescription: 'Visualizing invisible transactional security through physical magnetic and fluid simulations. Designed to capture tactile precision, metallic reflections, and instant card authentication flows.',
    direction: 'Monochrome precision, tactile fluid tension, and mathematical frequency synchronization.'
  },
  {
    title: 'Microsoft 365 Copilot',
    videoUrl: 'https://res.cloudinary.com/rtl1qljc/video/upload/v1788953454/copilot.mp4',
    posterUrl: 'https://res.cloudinary.com/rtl1qljc/video/upload/so_0/v1788953454/copilot.jpg',
    category: 'Kinetic UI & AI Motion',
    aspectRatio: '16/9',
    client: 'Microsoft',
    year: '2024',
    role: 'Creative Director & Motion Designer',
    software: ['After Effects', 'Cinema 4D', 'Photoshop', 'DaVinci Resolve'],
    shortDescription: 'Motion identity and generative luminous interface language for AI enterprise productivity.',
    fullDescription: 'Exploring real-time fluid reasoning and generative synthesis through kinetic particles, typographic morphing, and luminous focal transitions across productivity applications.',
    direction: 'Fluid intelligence, glowing vector lattices, and hyper-responsive choreography.'
  },
  {
    title: 'ClickUp',
    videoUrl: 'https://res.cloudinary.com/rtl1qljc/video/upload/v1788953516/clickup.mp4',
    posterUrl: 'https://res.cloudinary.com/rtl1qljc/video/upload/so_0/v1788953516/clickup.jpg',
    category: 'Product Motion & 3D SaaS',
    aspectRatio: '16/9',
    client: 'ClickUp',
    year: '2024',
    role: 'Lead Kinetic Designer',
    software: ['Blender', 'Cinema 4D', 'After Effects', 'Illustrator'],
    shortDescription: 'Dimensional motion design, modular spatial widgets, and fluid workspace dynamics.',
    fullDescription: 'Deconstructing modern workflow complexity into tactile, weightless 3D components and dynamic kinetic choreography.',
    direction: 'High-energy precision, clean geometric framing, and spatial fluidity.'
  },
  {
    title: 'Revolut',
    videoUrl: 'https://res.cloudinary.com/rtl1qljc/video/upload/v1788953527/revolut.mp4',
    posterUrl: 'https://res.cloudinary.com/rtl1qljc/video/upload/so_0/v1788953527/revolut.jpg',
    category: 'Fintech Brand & Identity',
    aspectRatio: '16/9',
    client: 'Revolut',
    year: '2024',
    role: 'Artist & Motion Director',
    software: ['Cinema 4D', 'Blender', 'After Effects', 'DaVinci Resolve'],
    shortDescription: 'Luxury platinum metallics, precision caustics, and monolithic financial geometry.',
    fullDescription: 'Kinetic launch film for the Ultra tier membership. Monolithic brushed platinum surfaces, iridescent edge dispersion, and precision micro-engraving simulations.',
    direction: 'Precious metal optics, deliberate camera drifts, and understated luxury.'
  },
  {
    title: 'OpenAI GPT 5.6',
    videoUrl: 'https://res.cloudinary.com/rtl1qljc/video/upload/v1788953531/gpt_openai.mp4',
    posterUrl: 'https://res.cloudinary.com/rtl1qljc/video/upload/so_0/v1788953531/gpt_openai.jpg',
    category: 'AI Identity & Motion Systems',
    aspectRatio: '16/9',
    client: 'OpenAI',
    year: '2024',
    role: '3D Animator & Visualizer',
    software: ['Blender', 'Cinema 4D', 'Photoshop', 'After Effects'],
    shortDescription: 'Ethereal neural topologies, fluid language matrices, and organic digital intelligence.',
    fullDescription: 'Translating cognitive synthesis and conversational flow into organic kinetic sculptures and dynamic vector fields.',
    direction: 'Subtle luminance, mathematical equilibrium, and organic computational flow.'
  },
  {
    title: 'Proofrr',
    videoUrl: 'https://res.cloudinary.com/rtl1qljc/video/upload/v1788953532/PROOFRR_Final.mp4',
    posterUrl: 'https://res.cloudinary.com/rtl1qljc/video/upload/so_0/v1788953532/PROOFRR_Final.jpg',
    category: 'Commercial & CGI Lookdev',
    aspectRatio: '16/9',
    client: 'Proofrr',
    year: '2023',
    role: 'Creative Director & 3D Artist',
    software: ['Cinema 4D', 'Redshift', 'After Effects'],
    shortDescription: 'Hyper-detailed verification mechanics, laser diagnostics, and structural analysis visuals.',
    fullDescription: 'Kinetic visual system exploring cryptographic proof and structural validation through optical laser sweeps and crystalline refractions.',
    direction: 'Crisp specular edges, high-contrast diagnostics, and analytical motion.'
  },
  {
    title: 'GPTZero',
    videoUrl: 'https://res.cloudinary.com/rtl1qljc/video/upload/v1788953538/gptzero.mp4',
    posterUrl: 'https://res.cloudinary.com/rtl1qljc/video/upload/so_0/v1788953538/gptzero.jpg',
    category: 'AI Forensic Motion & UI',
    aspectRatio: '16/9',
    client: 'GPTZero',
    year: '2023',
    role: 'Lead Kinetic Designer',
    software: ['After Effects', 'Cinema 4D', 'Illustrator'],
    shortDescription: 'Perplexity indexing, text forensic telemetry, and statistical kinetic typographies.',
    fullDescription: 'Kinetic identity deconstructing human versus synthetic cadence through dynamic typography, burst metrics, and telemetry overlays.',
    direction: 'Forensic precision, rapid typographic rhythms, and editorial rigor.'
  },
  {
    title: 'Figma Motion',
    videoUrl: 'https://res.cloudinary.com/rtl1qljc/video/upload/v1788953526/figma_final.mp4',
    posterUrl: 'https://res.cloudinary.com/rtl1qljc/video/upload/so_0/v1788953526/figma_final.jpg',
    category: 'Design Systems & SaaS Motion',
    aspectRatio: '16/9',
    client: 'Figma',
    year: '2023',
    role: 'Art Director & Animator',
    software: ['Figma', 'After Effects', 'Cinema 4D'],
    shortDescription: 'Collaborative vector dynamics, infinite canvas orchestration, and design tool choreography.',
    fullDescription: 'Celebration of digital craftsmanship, multiplayer cursor choreography, and live canvas interactions rendered with tactile physical qualities.',
    direction: 'Playful geometry, instant tactile response, and seamless interface cascades.'
  },
  {
    title: 'Google Drive',
    videoUrl: 'https://res.cloudinary.com/rtl1qljc/video/upload/v1788953455/drivee.mp4',
    posterUrl: 'https://res.cloudinary.com/rtl1qljc/video/upload/so_0/v1788953455/drivee.jpg',
    category: 'Cloud Storage & Kinetic Animation',
    aspectRatio: '9/16',
    client: 'Google',
    year: '2023',
    role: 'Mobile Kinetic Designer',
    software: ['After Effects', 'Cinema 4D', 'SwiftUI'],
    shortDescription: 'Fluid cloud synchronization choreography, spatial telemetry, and micro-haptic kinetic responses.',
    fullDescription: 'Vertical format kinetic prototype for cloud synchronization and file organization, featuring fluid file streams, real-time spatial indicators, and dynamic UI states.',
    direction: 'Mobile-first vertical kinetic flow, fluid cloud physics, and ultra-crisp interactions.'
  },
  {
    title: 'Pinterest',
    videoUrl: 'https://res.cloudinary.com/rtl1qljc/video/upload/v1788953463/pinterest.mp4',
    posterUrl: 'https://res.cloudinary.com/rtl1qljc/video/upload/so_0/v1788953463/pinterest.jpg',
    category: 'Creative Campaign & Motion',
    aspectRatio: '1/1',
    client: 'Pinterest',
    year: '2023',
    role: 'Motion Designer',
    software: ['After Effects', 'Cinema 4D', 'Blender'],
    shortDescription: 'Inspiration cascades, tactile collage dynamics, and visual discovery momentum.',
    fullDescription: 'Square-format visual campaign capturing the electric sensation of discovering aesthetic inspiration, with tactile physical textures and rhythmic transitions.',
    direction: 'Vibrant curation, tactile collage momentum, and dynamic square framing.'
  },
  {
    title: 'Apple Music',
    videoUrl: 'https://res.cloudinary.com/rtl1qljc/video/upload/v1788953537/apple_music.mp4',
    posterUrl: 'https://res.cloudinary.com/rtl1qljc/video/upload/so_0/v1788953537/apple_music.jpg',
    category: 'Audio Kinetic Visuals',
    aspectRatio: '1/1',
    client: 'Apple Music',
    year: '2023',
    role: 'Lead Lookdev & 3D Motion',
    software: ['Cinema 4D', 'After Effects', 'Metal Shaders'],
    shortDescription: 'Monochrome sound waves, spatial audio visualization, and minimal kinetic typography.',
    fullDescription: 'Square kinetic audio visualizer celebrating lossless spatial audio fidelity. High-contrast typography and fluid acoustic contours synchronized to dynamic frequencies.',
    direction: 'Monochrome purity, surgical precision, and lossless acoustic dynamics.'
  },
  {
    title: 'Flow',
    videoUrl: 'https://res.cloudinary.com/rtl1qljc/video/upload/v1788955961/flow.mp4',
    posterUrl: 'https://res.cloudinary.com/rtl1qljc/video/upload/so_0/v1788955961/flow.jpg',
    category: 'AI Motion & Dynamic Systems',
    aspectRatio: '16/9',
    client: 'Flow',
    year: '2024',
    role: 'Motion Designer & 3D Artist',
    software: ['After Effects', 'Cinema 4D', 'Blender'],
    shortDescription: 'Fluid generative dynamics, kinetic interface choreography, and modern digital fluidity.',
    fullDescription: 'Dynamic brand motion systems exploring fluid generative dynamics, responsive interaction kinetics, and continuous visual momentum.',
    direction: 'Fluid precision, effortless momentum, and clean kinetic rhythm.'
  },
  {
    title: 'Gumroad',
    videoUrl: 'https://res.cloudinary.com/rtl1qljc/video/upload/v1788955952/Gumroad.mp4',
    posterUrl: 'https://res.cloudinary.com/rtl1qljc/video/upload/so_0/v1788955952/Gumroad.jpg',
    category: 'Creator Economy & Motion',
    aspectRatio: '1/1',
    client: 'Gumroad',
    year: '2024',
    role: '3D Animator & Visualizer',
    software: ['Cinema 4D', 'After Effects', 'Octane Render'],
    shortDescription: 'Tactile creator commerce, dynamic graphic motion, and vibrant digital product packaging.',
    fullDescription: 'Square-format kinetic film highlighting creator commerce, tactile product dynamics, and energetic digital economy animations.',
    direction: 'Bold graphic playfulness, tactile 3D elements, and rhythmic square composition.'
  },
  {
    title: 'Claude AI',
    videoUrl: 'https://res.cloudinary.com/rtl1qljc/video/upload/v1788955951/claudeai.mp4',
    posterUrl: 'https://res.cloudinary.com/rtl1qljc/video/upload/so_0/v1788955951/claudeai.jpg',
    category: 'AI Research & Product Motion',
    aspectRatio: '16/9',
    client: 'Anthropic',
    year: '2024',
    role: 'Motion Director & CGI Artist',
    software: ['Blender', 'Cinema 4D', 'After Effects', 'DaVinci Resolve'],
    shortDescription: 'Sophisticated synthetic cognition, constitutional AI visual architecture, and calm computational aesthetics.',
    fullDescription: 'Widescreen cinematic visual identity exploring nuanced machine reasoning, conversational depth, and calm intelligent computational aesthetics.',
    direction: 'Intellectual clarity, nuanced warmth, and sophisticated typographic choreography.'
  },
  {
    title: 'Base44',
    videoUrl: 'https://res.cloudinary.com/rtl1qljc/video/upload/v1789338889/base44.mp4',
    posterUrl: 'https://res.cloudinary.com/rtl1qljc/video/upload/so_0/v1789338889/base44.jpg',
    category: 'AI & SaaS Motion Identity',
    aspectRatio: '16/9',
    client: 'Base44',
    year: '2024',
    role: 'Motion Designer & 3D Artist',
    software: ['Cinema 4D', 'After Effects', 'Blender', 'Photoshop'],
    shortDescription: 'Procedural kinetic systems, dynamic interface choreography, and high-frequency brand motion for Base44.',
    fullDescription: 'Comprehensive motion design system showcasing procedural physics, tactile component animations, and kinetic narratives designed for next-generation software architecture.',
    direction: 'High-contrast typography, precision timing, and fluid volumetric motion.'
  }
];

/**
 * Normalizes user-friendly ProjectEntry configuration items into standard Project objects
 * with smart auto-defaults for Cloudinary posters, slug URLs, and case-study metadata.
 */
export function normalizeProjectEntry(entry: ProjectEntry, index: number): Project {
  const slug =
    entry.title
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '') || `project-${index + 1}`;

  // If posterUrl is omitted, automatically derive standard Cloudinary frame-0 poster
  const fallbackPoster = entry.posterUrl
    ? entry.posterUrl
    : entry.videoUrl.includes('/video/upload/')
    ? entry.videoUrl
        .replace('/video/upload/', '/video/upload/so_0/')
        .replace(/\.[a-zA-Z0-9]+$/, '.jpg')
    : entry.videoUrl;

  const client = entry.client || entry.title;
  const year = entry.year || '2024';
  const category = entry.category || 'Motion Design';
  const role = entry.role || 'Motion Designer & 3D Artist';
  const software = entry.software || ['Cinema 4D', 'After Effects', 'Blender'];
  const shortDescription =
    entry.shortDescription ||
    `${entry.title} motion design and kinetic visual study.`;
  const fullDescription =
    entry.fullDescription ||
    `High-fidelity 3D motion design, procedural simulation, and dynamic choreography created for ${client}.`;

  return {
    id: `proj-${index + 1}`,
    slug,
    title: entry.title,
    client,
    year,
    category,
    role,
    software,
    shortDescription,
    fullDescription,
    direction:
      entry.direction ||
      'Cinematic lighting, fluid particle physics, and precise kinetic choreography.',
    videoUrl: entry.videoUrl,
    posterUrl: fallbackPoster,
    aspectRatio: entry.aspectRatio || '16/9',
    additionalMedia: [
      {
        id: `m-${index + 1}-1`,
        type: 'video',
        url: entry.videoUrl,
        posterUrl: fallbackPoster,
        caption: `${entry.title} motion study`,
        span: 'full'
      }
    ],
    credits: [
      { role: 'Motion Design', name: 'Musta_phavfx' },
      { role: 'Client', name: client }
    ]
  };
}

/**
 * Normalized list of full projects ready for consumption by all gallery components.
 */
export const normalizedProjects: Project[] = projectGalleryList.map(normalizeProjectEntry);
