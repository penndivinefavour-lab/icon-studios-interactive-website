'use client';

import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import type { AvatarState } from '@/lib/ai/avatar-state';

type AvatarProps = {
  state: AvatarState;
  size?: 'sm' | 'md' | 'lg';
};

const stateConfig: Record<AvatarState, {
  label: string;
  icon: string;
  color: string;
  bgGradient: string;
  pulseColor: string;
  borderColor: string;
}> = {
  idle: {
    label: 'ICON AI is ready',
    icon: '✦',
    color: 'text-accent',
    bgGradient: 'from-surface to-background',
    pulseColor: 'bg-accent/10',
    borderColor: 'border-border',
  },
  listening: {
    label: 'Listening...',
    icon: '🎤',
    color: 'text-blue-600',
    bgGradient: 'from-blue-50 to-blue-100/50',
    pulseColor: 'bg-blue-400/20',
    borderColor: 'border-blue-200',
  },
  thinking: {
    label: 'Thinking...',
    icon: '⟳',
    color: 'text-amber-600',
    bgGradient: 'from-amber-50 to-amber-100/50',
    pulseColor: 'bg-amber-400/20',
    borderColor: 'border-amber-200',
  },
  speaking: {
    label: 'Speaking...',
    icon: '🔊',
    color: 'text-emerald-600',
    bgGradient: 'from-emerald-50 to-emerald-100/50',
    pulseColor: 'bg-emerald-400/20',
    borderColor: 'border-emerald-200',
  },
  guiding: {
    label: 'Guiding you...',
    icon: '➤',
    color: 'text-violet-600',
    bgGradient: 'from-violet-50 to-violet-100/50',
    pulseColor: 'bg-violet-400/20',
    borderColor: 'border-violet-200',
  },
  success: {
    label: 'Done',
    icon: '✓',
    color: 'text-green-600',
    bgGradient: 'from-green-50 to-green-100/50',
    pulseColor: 'bg-green-400/20',
    borderColor: 'border-green-200',
  },
  error: {
    label: 'Something went wrong',
    icon: '✕',
    color: 'text-red-600',
    bgGradient: 'from-red-50 to-red-100/50',
    pulseColor: 'bg-red-400/20',
    borderColor: 'border-red-200',
  },
};

const sizeConfig = {
  sm: { container: 'h-12 w-12', icon: 'text-lg', label: 'text-[10px]' },
  md: { container: 'h-16 w-16', icon: 'text-2xl', label: 'text-xs' },
  lg: { container: 'h-24 w-24', icon: 'text-4xl', label: 'text-sm' },
};

export const Avatar = ({ state, size = 'md' }: AvatarProps) => {
  const config = stateConfig[state];
  const sizes = sizeConfig[size];
  const isAnimated = state === 'thinking' || state === 'listening' || state === 'speaking';

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative">
        {/* Outer pulse rings */}
        {isAnimated && (
          <>
            <motion.div
              className={`absolute inset-0 rounded-full ${config.pulseColor}`}
              animate={{
                scale: [1, 1.4, 1],
                opacity: [0.5, 0, 0.5],
              }}
              transition={{
                duration: state === 'thinking' ? 1.8 : 1.4,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />
            <motion.div
              className={`absolute inset-0 rounded-full ${config.pulseColor}`}
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.3, 0, 0.3],
              }}
              transition={{
                duration: state === 'thinking' ? 1.2 : 1.0,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: 0.2,
              }}
            />
          </>
        )}
        
        {/* Main avatar body */}
        <motion.div
          className={`relative flex items-center justify-center rounded-full border-2 bg-gradient-to-br ${config.bgGradient} ${config.borderColor} ${sizes.container} shadow-md`}
          animate={{
            scale: state === 'thinking' ? [1, 1.06, 1] : state === 'error' ? [1, 0.94, 1] : 1,
          }}
          transition={{
            duration: state === 'thinking' ? 1.6 : 0.3,
            repeat: state === 'thinking' ? Infinity : 0,
            ease: 'easeInOut',
          }}
          aria-live="polite"
          role="status"
        >
          {/* Inner glow */}
          <div className={`absolute inset-1 rounded-full ${config.pulseColor} blur-sm`} />
          
          {/* Icon */}
          <AnimatePresence mode="wait">
            <motion.span
              key={state}
              initial={{ opacity: 0, scale: 0.7, rotate: -10 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              exit={{ opacity: 0, scale: 0.7, rotate: 10 }}
              transition={{ duration: 0.25 }}
              className={`relative z-10 ${sizes.icon} ${config.color}`}
            >
              {config.icon}
            </motion.span>
          </AnimatePresence>
        </motion.div>
      </div>

      {/* State label */}
      <motion.p
        key={state}
        initial={{ opacity: 0, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -4 }}
        className={`font-medium ${sizes.label} ${config.color}`}
      >
        {config.label}
      </motion.p>
    </div>
  );
};
