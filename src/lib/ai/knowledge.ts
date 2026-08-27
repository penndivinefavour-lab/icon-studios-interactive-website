import type { KnowledgeEntry, ActionTool } from './schema';
import { projects, services } from '@/lib/data/content';

export const iconKnowledge: KnowledgeEntry[] = [
  {
    id: 'identity',
    title: 'ICON Studios',
    content:
      'ICON Studios builds intelligent digital products, AI systems, automation, and creative technology. The studio focuses on premium, cinematic, and highly interactive digital experiences.',
    metadata: { category: 'about' },
  },
  {
    id: 'philosophy',
    title: 'Philosophy',
    content:
      'Every project is treated as an intentional, polished experience. The studio avoids generic AI aesthetics and prioritizes readability, performance, accessibility, and meaningful motion.',
    metadata: { category: 'about' },
  },
];

export const projectKnowledge: KnowledgeEntry[] = projects.map((project) => ({
  id: `project-${project.slug}`,
  title: project.title,
  content: `${project.shortDescription}\n\n${project.fullDescription}`,
  metadata: {
    category: 'project',
    slug: project.slug,
    technologies: project.technologies.join(', '),
    status: project.status,
    categoryType: project.category,
  } as Record<string, string>,
}));

export const serviceKnowledge: KnowledgeEntry[] = services.map((service) => ({
  id: `service-${service.title.toLowerCase().replace(/\s+/g, '-')}`,
  title: service.title,
  content: `${service.description}\n\nCapabilities:\n${service.capabilities.map((cap) => `• ${cap}`).join('\n')}`,
  metadata: { category: 'service' } as Record<string, string>,
}));

export const actionTools: ActionTool[] = [
  { name: 'get_project', description: 'Retrieve a project by slug or keyword.' },
  { name: 'search_projects', description: 'Search projects by technology, category, or keyword.' },
  { name: 'get_service', description: 'Retrieve a service description and capabilities.' },
  { name: 'navigate_to', description: 'Navigate to a known route.' },
  { name: 'get_site_information', description: 'Retrieve information about ICON Studios.' },
  { name: 'start_tour', description: 'Begin a guided tour of the site.' },
];

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const _knowledgeUsedForSideEffects = [projectKnowledge, serviceKnowledge];
