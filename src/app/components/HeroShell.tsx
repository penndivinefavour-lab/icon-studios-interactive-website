'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'motion/react';
import { useExperience } from '@/components/experience/ExperienceContext';

type HeroShellProps = {
  tagline: string;
  description: string;
};

const cinematicEase = [0.25, 0.1, 0.25, 1] as const;

const container = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.08, delayChildren: 0.1 },
  },
};

const item = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: cinematicEase } },
};

export const HeroShell = ({ tagline, description }: HeroShellProps) => {
  const { preferences } = useExperience();

  if (!preferences.motionEnabled) {
    return (
      <div className="grid grid-cols-1 gap-10 md:grid-cols-2 md:gap-16">
        <div className="relative">
          <div className="absolute -left-3 top-0 hidden h-12 w-px bg-gradient-to-b from-border to-transparent md:block" aria-hidden="true" />
          <h1 className="text-4xl font-semibold leading-[1.05] tracking-tight text-text-primary md:text-5xl">{tagline}</h1>
        </div>
        <div className="flex flex-col gap-6">
          <p className="text-sm text-text-secondary md:text-base">{description}</p>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/projects"
              className="inline-flex h-10 items-center justify-center rounded-full bg-accent px-4 text-sm font-medium text-accent-foreground transition-colors hover:bg-text-secondary focus-visible:outline-none focus-visible:shadow-focus"
            >
              Selected work
            </Link>
            <Link
              href="/services"
              className="inline-flex h-10 items-center justify-center rounded-full bg-surface border border-border px-4 text-sm font-medium text-text-primary transition-colors hover:bg-background focus-visible:outline-none focus-visible:shadow-focus"
            >
              Services
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      className="grid grid-cols-1 gap-10 md:grid-cols-2 md:gap-16"
      initial="hidden"
      animate="show"
      variants={container}
    >
      <motion.div className="relative" variants={item}>
        <div className="absolute -left-3 top-0 hidden h-12 w-px bg-gradient-to-b from-border to-transparent md:block" aria-hidden="true" />
        <h1 className="text-4xl font-semibold leading-[1.05] tracking-tight text-text-primary md:text-5xl">{tagline}</h1>
      </motion.div>
      <motion.div className="flex flex-col gap-6" variants={item}>
        <p className="text-sm text-text-secondary md:text-base">{description}</p>
        <motion.div className="flex flex-wrap gap-3" initial="hidden" animate="show" variants={container}>
          <motion.div variants={item} whileHover={{ y: -1 }} whileTap={{ y: 0 }}>
            <Link
              href="/projects"
              className="inline-flex h-10 items-center justify-center rounded-full bg-accent px-4 text-sm font-medium text-accent-foreground transition-colors hover:bg-text-secondary focus-visible:outline-none focus-visible:shadow-focus"
            >
              Selected work
            </Link>
          </motion.div>
          <motion.div variants={item} whileHover={{ y: -1 }} whileTap={{ y: 0 }}>
            <Link
              href="/services"
              className="inline-flex h-10 items-center justify-center rounded-full bg-surface border border-border px-4 text-sm font-medium text-text-primary transition-colors hover:bg-background focus-visible:outline-none focus-visible:shadow-focus"
            >
              Services
            </Link>
          </motion.div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};
