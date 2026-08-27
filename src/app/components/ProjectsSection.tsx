import { Section } from '@/components/ui/Section';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { ProjectCard } from '@/components/cards/ProjectCard';
import { projects } from '@/lib/data/content';

export const ProjectsSection = () => {
  const featured = projects.filter((p) => p.featured);
  return (
    <Section id="work">
      <div className="flex flex-col gap-6">
        <SectionHeading title="Selected work" description="A small set of projects in progress or in use." />
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {featured.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </div>
    </Section>
  );
};
