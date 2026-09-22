import { Project } from '@/lib/data/schema';

export const projects: Project[] = [
  {
    id: '1',
    slug: 'aurora',
    title: 'Aurora',
    shortDescription: 'An AI-assisted design environment for creative teams.',
    fullDescription:
      'Aurora is an intelligent design environment that blends human creative intent with machine-assisted exploration. Built for studios, it streamlines review cycles, asset organization, and visual decision-making.',
    category: 'ai',
    technologies: ['React', 'Node.js', 'AI Pipeline', 'Canvas'],
    status: 'live',
    featured: true,
    thumbnail: '/media/projects/aurora-thumbnail.jpg',
    heroMedia: '/media/projects/aurora-hero.jpg',
    gallery: ['/media/projects/aurora-1.jpg', '/media/projects/aurora-2.jpg'],
    createdAt: '2026-01-01',
    updatedAt: '2026-08-01',
  },
  {
    id: '2',
    slug: 'nocturne',
    title: 'Nocturne',
    shortDescription: 'Cinematic visual sequencing for high-end content studios.',
    fullDescription:
      'Nocturne provides structured motion, cut management, and visual narrative controls for post-production teams. Designed around timeline thinking, not spreadsheet thinking.',
    category: 'creative',
    technologies: ['Next.js', 'WebCodecs', 'Timeline Engine'],
    status: 'in-progress',
    featured: true,
    thumbnail: '/media/projects/nocturne-thumbnail.jpg',
    heroMedia: '/media/projects/nocturne-hero.jpg',
    gallery: ['/media/projects/nocturne-1.jpg'],
    createdAt: '2025-11-10',
    updatedAt: '2026-07-15',
  },
  {
    id: '3',
    slug: 'helix',
    title: 'Helix',
    shortDescription: 'Automated infrastructure with human approval semantics.',
    fullDescription:
      'Helix bridges automation and control by surfacing system changes as explicit, reviewable actions. Built for teams that want machines to act, but humans to remain accountable.',
    category: 'automation',
    technologies: ['Go', 'REST', 'Event System', 'Policy Engine'],
    status: 'prototype',
    featured: true,
    thumbnail: '/media/projects/helix-thumbnail.jpg',
    heroMedia: '/media/projects/helix-hero.jpg',
    gallery: [],
    createdAt: '2026-03-04',
    updatedAt: '2026-06-20',
  },
];

export const services = [
  {
    id: '1',
    title: 'AI Systems',
    description: 'Designing machine-assisted workflows that respect human intent and control.',
    icon: 'systems',
    capabilities: ['assistive AI', 'model design', 'workflow automation', 'human-in-the-loop'],
  },
  {
    id: '2',
    title: 'Creative Technology',
    description: 'Building expressive interactive experiences with modern media tooling.',
    icon: 'creative',
    capabilities: ['motion design', 'interactive media', 'visual systems', 'cinematic UX'],
  },
  {
    id: '3',
    title: 'Automation & Platforms',
    description: 'Stable infrastructure, clean APIs, and scalable internal platforms.',
    icon: 'platforms',
    capabilities: ['platform design', 'api design', 'automation', 'operational resilience'],
  },
  {
    id: '4',
    title: 'Product Design',
    description: 'Premium interfaces shaped by craft, clarity, and long-term maintenance.',
    icon: 'product',
    capabilities: ['design systems', 'UX', 'interfaces', 'accessibility'],
  },
];

export const experiences = [
  {
    id: '1',
    title: 'Founder & Lead Designer',
    organization: 'ICON Studios',
    period: '2024 — Present',
    description: 'Building intelligent digital products and creative systems for clients and internal platforms.',
    highlights: [
      'Founded studio with explicit product and AI principles',
      'Led product design and technical architecture',
      'Shipped multi-project pipeline with iterative delivery',
    ],
  },
  {
    id: '2',
    title: 'Senior Product Designer',
    organization: 'Independent / Contract',
    period: '2022 — 2024',
    description: 'Worked with early-stage teams on design systems, product strategy, and launch interfaces.',
    highlights: [
      'Designed design systems adopted by multiple product lines',
      'Contracted across enterprise and startup teams',
      'Focused on long-term maintainability over quick wins',
    ],
  },
];

export const navigation = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About' },
  { href: '/projects', label: 'Projects' },
  { href: '/services', label: 'Services' },
  { href: '/experience', label: 'Experience' },
  { href: '/contact', label: 'Contact' },
];

export const siteSettings: {
  studioName: string;
  tagline: string;
  description: string;
  contactEmail: string;
} = {
  studioName: 'ICON Studios',
  tagline: 'Intelligent systems, creative technology, and premium digital products.',
  description: 'ICON Studios builds intelligent digital products, AI systems, automation, and creative technology.',
  contactEmail: 'hello@iconstudios.example',
};
