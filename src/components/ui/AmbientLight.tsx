'use client';

import React, { useState } from 'react';
import { motion } from 'motion/react';

type AmbientLightProps = {
  className?: string;
  enabled?: boolean;
};

export const AmbientLight = ({ className = '', enabled = true }: AmbientLightProps) => {
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!enabled) return;
    const bounds = event.currentTarget.getBoundingClientRect();
    setPosition({ x: event.clientX - bounds.left, y: event.clientY - bounds.top });
  };

  if (!enabled) return null;

  return (
    <div
      onPointerMove={handlePointerMove}
      className={`pointer-events-auto absolute inset-0 overflow-hidden ${className}`}
      aria-hidden="true"
    >
      <motion.div
        className="absolute h-[45vh] w-[45vh] rounded-full bg-gradient-to-br from-foreground/[0.04] to-transparent blur-2xl"
        style={{ left: position.x, top: position.y, transform: 'translate(-50%, -50%)' }}
        transition={{ type: 'tween', ease: 'easeOut', duration: 0.8 }}
      />
    </div>
  );
};
