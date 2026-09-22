import { notFound } from 'next/navigation';
import { Section } from '@/components/ui/Section';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { projects } from '@/lib/data/content';

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export default async function ProjectDetailPage({ params }: Props) {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);
  if (!project) return notFound();

  const narrativeBlocks = [
    { label: 'Identity', text: `${project.title} is a ${project.status.replace('-', ' ')} ${project.category} initiative.` },
    { label: 'Focus', text: project.fullDescription },
    {
      label: 'Technologies',
      text: project.technologies.map((tech) => `• ${tech}`).join('\n'),
    },
    {
      label: 'Status',
      text: project.status === 'live'
        ? 'This project is actively in use. Contact ICON Studios to see a demonstration or discuss similar work.'
        : project.status === 'in-progress'
          ? 'This project is currently in development. Reach out to ICON Studios to learn more or collaborate.'
          : 'This project is in the prototype phase. Contact ICON Studios to explore the concept further.',
    },
  ];

  return (
    <Section>
      <div className="flex flex-col gap-8">
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <Badge variant="neutral">{project.status}</Badge>
            <span className="text-xs text-text-muted">{project.category}</span>
          </div>
          <h1 className="text-3xl font-semibold tracking-tight text-text-primary md:text-4xl">{project.title}</h1>
          <p className="text-sm text-text-secondary md:text-base">{project.shortDescription}</p>
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {narrativeBlocks.map((block) => (
            <div key={block.label} className="rounded-2xl border border-border bg-surface p-5">
              <p className="text-xs text-text-muted">{block.label}</p>
              <p className="mt-2 whitespace-pre-line text-sm text-text-secondary">{block.text}</p>
            </div>
          ))}
        </div>
        <div className="flex flex-wrap gap-3">
          {project.demoUrl ? (
            <Button href={project.demoUrl} target="_blank" rel="noreferrer">
              Open demo
            </Button>
          ) : null}
          {project.repositoryUrl ? (
            <Button href={project.repositoryUrl} variant="secondary" target="_blank" rel="noreferrer">
              Repository
            </Button>
          ) : null}
          <Button href="/contact" variant={project.demoUrl || project.repositoryUrl ? "ghost" : "primary"}>
            Discuss this project
          </Button>
          <Button href="/projects" variant="ghost">Back to projects</Button>
        </div>
      </div>
    </Section>
  );
}
