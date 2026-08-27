import { Section } from '@/components/ui/Section';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { ServiceCard } from '@/components/cards/ServiceCard';
import { services } from '@/lib/data/content';

export const CapabilitiesSection = () => {
  return (
    <Section>
      <div className="flex flex-col gap-6">
        <SectionHeading title="Capabilities" description="Major areas we design and build around." />
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {services.map((service, index) => (
            <ServiceCard
              key={service.id}
              title={service.title}
              description={service.description}
              capabilities={service.capabilities}
              index={index}
            />
          ))}
        </div>
      </div>
    </Section>
  );
};
