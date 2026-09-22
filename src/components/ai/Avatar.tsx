'use client';

import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import type { AvatarState } from '@/lib/ai/avatar-state';
import { useExperience } from '../experience/ExperienceContext';

type AvatarProps = {
  state: AvatarState;
  size?: 'sm' | 'md' | 'lg';
};

const stateConfig: Record<AvatarState, {
  label: string;
  icon: string;
  color: string;
  bgGradient: string;
  ringColor: string;
  glowColor: string;
  particleCount: number;
}> = {
  idle: {
    label: 'ICON AI is ready',
    icon: '✦',
    color: 'text-accent',
    bgGradient: 'from-accent/10 via-accent/5 to-transparent',
    ringColor: 'ring-accent/20',
    glowColor: 'shadow-accent/10',
    particleCount: 3,
  },
  listening: {
    label: 'Listening...',
    icon: '🎤',
    color: 'text-blue-600',
    bgGradient: 'from-blue-500/20 via-blue-500/10 to-transparent',
    ringColor: 'ring-blue-400/30',
    glowColor: 'shadow-blue-500/20',
    particleCount: 5,
  },
  thinking: {
    label: 'Thinking...',
    icon: '⟳',
    color: 'text-amber-600',
    bgGradient: 'from-amber-500/20 via-amber-500/10 to-transparent',
    ringColor: 'ring-amber-400/30',
    glowColor: 'shadow-amber-500/20',
    particleCount: 6,
  },
  speaking: {
    label: 'Speaking...',
    icon: '🔊',
    color: 'text-emerald-600',
    bgGradient: 'from-emerald-500/20 via-emerald-500/10 to-transparent',
    ringColor: 'ring-emerald-400/30',
    glowColor: 'shadow-emerald-500/20',
    particleCount: 4,
  },
  guiding: {
    label: 'Guiding you...',
    icon: '➤',
    color: 'text-violet-600',
    bgGradient: 'from-violet-500/20 via-violet-500/10 to-transparent',
    ringColor: 'ring-violet-400/30',
    glowColor: 'shadow-violet-500/20',
    particleCount: 4,
  },
  success: {
    label: 'Done',
    icon: '✓',
    color: 'text-green-600',
    bgGradient: 'from-green-500/20 via-green-500/10 to-transparent',
    ringColor: 'ring-green-400/30',
    glowColor: 'shadow-green-500/20',
    particleCount: 2,
  },
  error: {
    label: 'Something went wrong',
    icon: '✕',
    color: 'text-red-600',
    bgGradient: 'from-red-500/20 via-red-500/10 to-transparent',
    ringColor: 'ring-red-400/30',
    glowColor: 'shadow-red-500/20',
    particleCount: 1,
  },
};

const sizeConfig = {
  sm: { container: 'h-16 w-16', icon: 'text-xl', label: 'text-[10px]', ring: 'ring-2' },
  md: { container: 'h-24 w-24', icon: 'text-4xl', label: 'text-xs', ring: 'ring-4' },
  lg: { container: 'h-32 w-32', icon: 'text-5xl', label: 'text-sm', ring: 'ring-4' },
};

export const Avatar = ({ state, size = 'md' }: AvatarProps) => {
  const { preferences } = useExperience();
  const config = stateConfig[state];
  const sizes = sizeConfig[size];
  const isAnimated = preferences.motionEnabled && (state === 'thinking' || state === 'listening' || state === 'speaking');

  return (
    <div className="flex flex-col items-center gap-4" style={{ perspective: '800px' }}>
      {/* 3D-like container with subtle rotation based on state */}
      <div className="relative" style={{ transformStyle: 'preserve-3d' }}>
        {/* Floating particles */}
        {preferences.motionEnabled && preferences.ambientEnabled && Array.from({ length: config.particleCount }).map((_, i) => (
          <motion.div
            key={i}
            className={`absolute rounded-full ${config.color.replace('text-', 'bg-')} opacity-30`}
            style={{
              width: 4 + (i % 3) * 2,
              height: 4 + (i % 3) * 2,
              left: '50%',
              top: '50%',
            }}
            animate={{
              x: [0, (Math.cos(i * 1.2) * 30), 0],
              y: [0, (Math.sin(i * 1.2) * 30), 0],
              opacity: [0.2, 0.5, 0.2],
              scale: [0.8, 1.2, 0.8],
            }}
            transition={{
              duration: 2 + i * 0.3,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: i * 0.2,
            }}
          />
        ))}
        
        {/* Outer glow ring */}
        <motion.div
          className={`absolute inset-0 rounded-full bg-gradient-to-br ${config.bgGradient} blur-xl`}
          animate={{
            scale: isAnimated ? [1, 1.2, 1] : 1,
            opacity: isAnimated ? [0.5, 0.8, 0.5] : 0.3,
          }}
          transition={{
            duration: state === 'thinking' ? 1.6 : 1.2,
            repeat: isAnimated ? Infinity : 0,
            ease: 'easeInOut',
          }}
        />
        
        {/* Main avatar body with 3D tilt */}
        <motion.div
          className={`relative flex items-center justify-center rounded-full ring-4 ${config.ringColor} bg-gradient-to-br from-surface via-background to-surface shadow-2xl ${sizes.container} ${sizes.ring} ${config.glowColor}`}
          style={{ transformStyle: 'preserve-3d' }}
          animate={{
            rotateX: state === 'thinking' ? [0, 5, 0, -5, 0] : 0,
            rotateY: state === 'listening' ? [0, 10, 0, -10, 0] : state === 'guiding' ? [0, 15, 0] : 0,
            scale: state === 'thinking' ? [1, 1.05, 1] : state === 'error' ? [1, 0.95, 1] : state === 'success' ? [1, 1.08, 1] : 1,
          }}
          transition={{
            duration: state === 'thinking' ? 1.6 : 0.4,
            repeat: isAnimated ? Infinity : 0,
            ease: 'easeInOut',
          }}
          whileHover={{ rotateY: 15, rotateX: -5 }}
          aria-live="polite"
          role="status"
        >
          {/* Inner surface with gradient */}
          <div className={`absolute inset-2 rounded-full bg-gradient-to-br ${config.bgGradient} opacity-80`} />
          
          {/* Icon */}
          <AnimatePresence mode="wait">
            <motion.span
              key={state}
              initial={{ opacity: 0, scale: 0.6, rotate: -20 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              exit={{ opacity: 0, scale: 0.6, rotate: 20 }}
              transition={{ duration: 0.3, ease: 'backOut' }}
              className={`relative z-10 ${sizes.icon} ${config.color} drop-shadow-sm`}
              style={{ 
                filter: `drop-shadow(0 2px 4px currentColor)`,
              }}
            >
              {config.icon}
            </motion.span>
          </AnimatePresence>

          {/* Specular highlight */}
          <div className="absolute top-1 left-1/4 h-1/3 w-1/3 rounded-full bg-gradient-to-br from-white/40 to-transparent blur-sm" />
        </motion.div>
      </div>

      {/* State label */}
      <motion.div
        key={state}
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center gap-1"
      >
        <p className={`font-medium ${sizes.label} ${config.color}`}>
          {config.label}
        </p>
        {state === 'idle' && (
          <p className="text-[10px] text-text-muted">Ask ICON anything about the studio</p>
        )}
      </motion.div>
    </div>
  );
};
