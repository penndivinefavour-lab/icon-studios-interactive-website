import React from 'react';
import { Project } from '@/lib/data/schema';
import { Badge } from '@/components/ui/Badge';
import Link from 'next/link';

type ProjectCardProps = {
  project: Project;
};

export const ProjectCard = ({ project }: ProjectCardProps) => {
  return (
    <Link
      href={`/projects/${project.slug}`}
      className="group block rounded-2xl border border-border bg-surface p-4 transition-colors hover:bg-background hover:shadow-md focus-visible:outline-none focus-visible:shadow-focus"
    >
      <div className="overflow-hidden rounded-xl bg-background">
        <div className="aspect-video w-full bg-border/60 transition-transform duration-500 group-hover:scale-[1.03]" aria-hidden="true" />
      </div>
      <div className="mt-4 flex items-start justify-between gap-3">
        <div>
          <h3 className="text-base font-medium text-text-primary group-hover:text-text-secondary transition-colors">
            {project.title}
          </h3>
          <p className="mt-1 line-clamp-2 text-sm text-text-secondary">{project.shortDescription}</p>
        </div>
        <Badge variant="neutral" className="shrink-0">{project.status}</Badge>
      </div>
      <div className="mt-3 flex flex-wrap gap-1.5">
        {project.technologies.slice(0, 3).map((tech) => (
          <span
            key={tech}
            className="rounded-full border border-border bg-background px-2 py-0.5 text-xs text-text-muted"
          >
            {tech}
          </span>
        ))}
      </div>
    </Link>
  );
};
