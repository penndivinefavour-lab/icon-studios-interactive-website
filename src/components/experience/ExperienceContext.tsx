// Experience preferences context and hook
// Manages lightweight experience controls: motion, ambient effects, AI guide, voice

'use client';

import React, { createContext, useContext, useState, useCallback, useEffect, useMemo } from 'react';
import { trackExperiencePreference } from '@/lib/analytics';

export type VisualMode = 'immersive' | 'minimal';

export type ExperiencePreferences = {
  motionEnabled: boolean;
  ambientEnabled: boolean;
  aiEnabled: boolean;
  voiceEnabled: boolean;
};

const STORAGE_KEY = 'icon-experience-preferences';

const DEFAULT_PREFERENCES: ExperiencePreferences = {
  motionEnabled: true,
  ambientEnabled: true,
  aiEnabled: true,
  voiceEnabled: true,
};

type ExperienceContextValue = {
  preferences: ExperiencePreferences;
  setMotionEnabled: (enabled: boolean) => void;
  setAmbientEnabled: (enabled: boolean) => void;
  setAiEnabled: (enabled: boolean) => void;
  setVoiceEnabled: (enabled: boolean) => void;
  resetPreferences: () => void;
};

const ExperienceContext = createContext<ExperienceContextValue | null>(null);

function loadPreferences(): ExperiencePreferences {
  if (typeof window === 'undefined') return DEFAULT_PREFERENCES;
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return DEFAULT_PREFERENCES;
    const parsed = JSON.parse(stored);
    return {
      motionEnabled: typeof parsed.motionEnabled === 'boolean' ? parsed.motionEnabled : DEFAULT_PREFERENCES.motionEnabled,
      ambientEnabled: typeof parsed.ambientEnabled === 'boolean' ? parsed.ambientEnabled : DEFAULT_PREFERENCES.ambientEnabled,
      aiEnabled: typeof parsed.aiEnabled === 'boolean' ? parsed.aiEnabled : DEFAULT_PREFERENCES.aiEnabled,
      voiceEnabled: typeof parsed.voiceEnabled === 'boolean' ? parsed.voiceEnabled : DEFAULT_PREFERENCES.voiceEnabled,
    };
  } catch {
    return DEFAULT_PREFERENCES;
  }
}

function savePreferences(preferences: ExperiencePreferences): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(preferences));
  } catch {
    // Storage full or unavailable — fail silently
  }
}

export function ExperienceProvider({ children }: { children: React.ReactNode }) {
  const [preferences, setPreferences] = useState<ExperiencePreferences>(loadPreferences);

  useEffect(() => {
    savePreferences(preferences);
  }, [preferences]);

  const setMotionEnabled = useCallback((enabled: boolean) => {
    setPreferences((prev) => ({ ...prev, motionEnabled: enabled }));
    trackExperiencePreference('motion', enabled);
  }, []);

  const setAmbientEnabled = useCallback((enabled: boolean) => {
    setPreferences((prev) => ({ ...prev, ambientEnabled: enabled }));
    trackExperiencePreference('ambient', enabled);
  }, []);

  const setAiEnabled = useCallback((enabled: boolean) => {
    setPreferences((prev) => ({ ...prev, aiEnabled: enabled }));
    trackExperiencePreference('ai', enabled);
  }, []);

  const setVoiceEnabled = useCallback((enabled: boolean) => {
    setPreferences((prev) => ({ ...prev, voiceEnabled: enabled }));
    trackExperiencePreference('voice', enabled);
  }, []);

  const resetPreferences = useCallback(() => {
    setPreferences(DEFAULT_PREFERENCES);
  }, []);

  const value = useMemo<ExperienceContextValue>(() => ({
    preferences,
    setMotionEnabled,
    setAmbientEnabled,
    setAiEnabled,
    setVoiceEnabled,
    resetPreferences,
  }), [preferences, setMotionEnabled, setAmbientEnabled, setAiEnabled, setVoiceEnabled, resetPreferences]);

  return (
    <ExperienceContext.Provider value={value}>
      {children}
    </ExperienceContext.Provider>
  );
}

export function useExperience(): ExperienceContextValue {
  const context = useContext(ExperienceContext);
  if (!context) {
    throw new Error('useExperience must be used within an ExperienceProvider');
  }
  return context;
}
