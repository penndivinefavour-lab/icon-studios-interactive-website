'use client';

import React from 'react';
import { motion } from 'motion/react';
import type { AvatarState } from '@/lib/ai/avatar-state';

type AvatarProps = {
  state: AvatarState;
};

const stateLabels: Record<AvatarState, string> = {
  idle: 'ICON AI is ready.',
  listening: 'Listening...',
  thinking: 'Thinking...',
  speaking: 'Speaking...',
  guiding: 'Guiding you...',
  success: 'Done.',
  error: 'Something went wrong.',
};

export const Avatar = ({ state }: AvatarProps) => {
  const indicatorColor =
    state === 'error'
      ? 'bg-error'
      : state === 'success'
        ? 'bg-success'
        : 'bg-accent';

  return (
    <div className="flex flex-col items-center gap-3">
      <motion.div
        aria-live="polite"
        className="flex items-center gap-3 rounded-full border border-border bg-surface px-4 py-2 shadow-sm"
        animate={{
          scale: state === 'thinking' ? [1, 1.04, 1] : 1,
          opacity: state === 'error' ? 0.9 : 1,
        }}
        transition={{
          duration: state === 'thinking' ? 1.6 : 0.35,
          repeat: state === 'thinking' ? Infinity : 0,
          ease: 'easeInOut',
        }}
      >
        <span className="relative flex h-2.5 w-2.5">
          <span className={`absolute inline-flex h-full w-full rounded-full ${indicatorColor} opacity-75`} />
          <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${indicatorColor}`} />
        </span>
        <span className="text-xs text-text-secondary">{stateLabels[state]}</span>
      </motion.div>
    </div>
  );
};
