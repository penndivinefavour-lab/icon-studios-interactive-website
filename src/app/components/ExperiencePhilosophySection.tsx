import { Section } from '@/components/ui/Section';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { experiences } from '@/lib/data/content';

export const ExperiencePhilosophySection = () => {
  return (
    <Section>
      <div className="grid grid-cols-1 gap-10 md:grid-cols-2">
        <SectionHeading
          title="Approach"
          description="We prioritize craft, clarity, and maintainability over speed-driven shortcuts."
          align="left"
        />
        <div className="space-y-6">
          {experiences.map((item) => (
            <div key={item.id} className="rounded-2xl border border-border bg-surface p-5">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium text-text-primary">{item.title}</h3>
                <span className="text-xs text-text-muted">{item.organization}</span>
              </div>
              <p className="mt-2 text-sm text-text-secondary">{item.description}</p>
              <ul className="mt-3 list-disc space-y-1 pl-4 text-sm text-text-muted">
                {item.highlights.map((highlight) => (
                  <li key={highlight}>{highlight}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </Section>
  );
};
