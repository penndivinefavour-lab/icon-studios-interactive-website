'use client';

import React from 'react';

type AnimatedRevealProps = {
  children: React.ReactNode;
  className?: string;
  delay?: number;
};

export const AnimatedReveal = ({ children, className = '', delay = 0 }: AnimatedRevealProps) => {
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
