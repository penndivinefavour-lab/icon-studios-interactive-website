export type Project = {
  id: string;
  slug: string;
  title: string;
  shortDescription: string;
  fullDescription: string;
  category: 'platform' | 'ai' | 'creative' | 'automation' | 'experience';
  technologies: string[];
  status: 'live' | 'in-progress' | 'prototype';
  featured: boolean;
  thumbnail: string;
  heroMedia: string;
  gallery: string[];
  externalUrl?: string;
  repositoryUrl?: string;
  demoUrl?: string;
  createdAt: string;
  updatedAt: string;
};

export type Service = {
  id: string;
  title: string;
  description: string;
  icon: string;
  capabilities: string[];
};

export type ExperienceItem = {
  id: string;
  title: string;
  organization: string;
  period: string;
  description: string;
  highlights: string[];
};

export type SiteSettings = {
  studioName: string;
  tagline: string;
  description: string;
  contactEmail: string;
  socials: {
    twitter?: string;
    linkedin?: string;
    github?: string;
    youtube?: string;
  };
};
