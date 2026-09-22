'use client';

import React from 'react';
import { useExperience } from '@/components/experience/ExperienceContext';

type AnimatedRevealProps = {
  children: React.ReactNode;
  className?: string;
  delay?: number;
};

export const AnimatedReveal = ({ children, className = '', delay = 0 }: AnimatedRevealProps) => {
  const { preferences } = useExperience();
  
  if (!preferences.motionEnabled) {
    return <div className={className}>{children}</div>;
  }

  return (
    <div
      className={`reveal ${className}`}
      style={{
        animationDelay: `${delay}ms`,
      }}
    >
      {children}
    </div>
  );
};
