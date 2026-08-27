'use client';

import React from 'react';
import { Section } from '@/components/ui/Section';
import { AnimatedReveal } from '@/components/ui/AnimatedReveal';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { ProjectsSection } from '@/app/components/ProjectsSection';
import { CapabilitiesSection } from '@/app/components/CapabilitiesSection';
import { ExperiencePhilosophySection } from '@/app/components/ExperiencePhilosophySection';
import { HeroShell } from '@/app/components/HeroShell';
import { AmbientLight } from '@/components/ui/AmbientLight';
import { siteSettings } from '@/lib/data/content';

export default function HomePage() {
  return (
    <div>
      <Section className="!pt-24 md:!pt-28">
        <div className="relative">
          <AmbientLight />
          <HeroShell tagline={siteSettings.tagline} description={siteSettings.description} />
        </div>
      </Section>
      <AnimatedReveal>
        <ProjectsSection />
      </AnimatedReveal>
      <AnimatedReveal delay={80}>
        <CapabilitiesSection />
      </AnimatedReveal>
      <AnimatedReveal delay={120}>
        <ExperiencePhilosophySection />
      </AnimatedReveal>
      <Section>
        <div className="flex flex-col items-start gap-4 md:items-center md:text-center">
          <SectionHeading title="Next steps" description="Collaborate or explore the studio." />
          <div className="flex flex-wrap gap-3">
            <a
              href="/contact"
              className="inline-flex h-10 items-center justify-center rounded-full bg-accent px-4 text-sm font-medium text-accent-foreground transition-colors hover:bg-text-secondary focus-visible:outline-none focus-visible:shadow-focus"
            >
              Contact ICON Studios
            </a>
            <a
              href="/about"
              className="inline-flex h-10 items-center justify-center rounded-full bg-surface border border-border px-4 text-sm font-medium text-text-primary transition-colors hover:bg-background focus-visible:outline-none focus-visible:shadow-focus"
            >
              About the studio
            </a>
          </div>
        </div>
      </Section>
    </div>
  );
}
