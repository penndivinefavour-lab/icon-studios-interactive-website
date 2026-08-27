'use client';

import React from 'react';
import { motion } from 'motion/react';
import { Section } from '@/components/ui/Section';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { experiences } from '@/lib/data/content';

const systemPoints = [
  { title: 'Public Experience', description: 'Polished interfaces for exploration, projects, and collaboration.' },
  { title: 'Immersive Layer', description: 'Transitional motion, depth, and atmosphere without heavy decoration.' },
  { title: 'Interactive Layer', description: 'Future project exploration, media-driven storytelling, and live demonstrations.' },
  { title: 'AI Experience Layer', description: 'Reserved for future agent guidance, voice, and contextual assistance.' },
  { title: '3D Environment', description: 'Architected as a future spatial layer, not a decorative effect.' },
  { title: 'Control Center', description: 'Separate admin boundary for content, configuration, and analytics.' },
];

export default function ExperiencePage() {
  return (
    <Section>
      <div className="flex flex-col gap-8">
        <SectionHeading
          title="Experience"
          description="This area is the conceptual center of the ICON Studios platform."
          align="left"
        />
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {systemPoints.map((item, index) => (
            <motion.div
              key={item.title}
              className="rounded-2xl border border-border bg-surface p-5"
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.55, ease: [0.25, 0.1, 0.25, 1], delay: index * 0.05 }}
            >
              <div className="flex items-center justify-between">
                <h3 className="text-base font-semibold text-text-primary">{item.title}</h3>
                <span className="text-xs text-text-muted">0{index + 1}</span>
              </div>
              <p className="mt-2 text-sm text-text-secondary">{item.description}</p>
            </motion.div>
          ))}
        </div>
        <div className="rounded-2xl border border-border bg-surface p-5">
          <h3 className="text-sm font-semibold text-text-primary">Background</h3>
          <div className="mt-3 space-y-4">
            {experiences.map((item) => (
              <div key={item.id}>
                <div className="flex flex-col gap-1 md:flex-row md:items-center md:justify-between">
                  <div>
                    <p className="text-sm font-medium text-text-primary">{item.title}</p>
                    <p className="text-sm text-text-secondary">{item.organization}</p>
                  </div>
                  <p className="text-xs text-text-muted">{item.period}</p>
                </div>
                <p className="mt-2 text-sm text-text-secondary">{item.description}</p>
                <ul className="mt-2 list-disc space-y-1 pl-4 text-sm text-text-muted">
                  {item.highlights.map((highlight) => (
                    <li key={highlight}>{highlight}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Section>
  );
}
