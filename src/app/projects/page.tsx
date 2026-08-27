import { Section } from '@/components/ui/Section';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { ProjectCard } from '@/components/cards/ProjectCard';
import { projects } from '@/lib/data/content';

export default function ProjectsPage() {
  return (
    <Section>
      <div className="flex flex-col gap-6">
        <SectionHeading
          title="Projects"
          description="Work across AI systems, creative technology, automation, and product design."
        />
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </div>
    </Section>
  );
}
