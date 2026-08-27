import { Section } from '@/components/ui/Section';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { services } from '@/lib/data/content';

export default function ServicesPage() {
  return (
    <Section>
      <div className="flex flex-col gap-6">
        <SectionHeading
          title="Services"
          description="What ICON Studios provides and how engagements are structured."
        />
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {services.map((service) => (
            <div key={service.id} className="rounded-2xl border border-border bg-surface p-5">
              <h3 className="text-base font-semibold text-text-primary">{service.title}</h3>
              <p className="mt-2 text-sm text-text-secondary">{service.description}</p>
              <ul className="mt-4 space-y-1.5">
                {service.capabilities.map((capability) => (
                  <li key={capability} className="text-sm text-text-muted">
                    — {capability}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </Section>
  );
}
