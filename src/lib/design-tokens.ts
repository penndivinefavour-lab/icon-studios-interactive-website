export const colors = {
  background: '#f8f8f7',
  surface: '#ffffff',
  elevated: '#ffffff',
  'text-primary': '#13130f',
  'text-secondary': '#3a3a36',
  'text-muted': '#73736e',
  border: '#e6e6e3',
  accent: '#0f0f0d',
  'accent-foreground': '#ffffff',
  success: '#0f7b0f',
  warning: '#a15c00',
  error: '#b20f15',
} as const;

export const spacing = [0, 4, 8, 12, 16, 24, 32, 40, 48, 64, 80, 96] as const;

export const radius = {
  sm: '4px',
  md: '8px',
  lg: '12px',
  xl: '20px',
  full: '9999px',
} as const;

export const shadows = {
  sm: '0 1px 2px rgba(0,0,0,0.04)',
  md: '0 8px 24px rgba(0,0,0,0.06)',
  lg: '0 18px 45px rgba(0,0,0,0.08)',
  focus: '0 0 0 3px rgba(19,19,15,0.15)',
} as const;

export const motion = {
  instant: '0ms',
  fast: '120ms',
  normal: '220ms',
  slow: '360ms',
  cinematic: '720ms',
} as const;

export type ColorKey = keyof typeof colors;
export type SpacingScale = typeof spacing[number];
export type RadiusKey = keyof typeof radius;
export type ShadowKey = keyof typeof shadows;
export type MotionKey = keyof typeof motion;
