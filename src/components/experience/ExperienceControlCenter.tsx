'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useExperience } from './ExperienceContext';
import { Button } from '@/components/ui/Button';

function ToggleSwitch({ enabled, onToggle, label, description }: { enabled: boolean; onToggle: (val: boolean) => void; label: string; description: string }) {
  const id = label.toLowerCase().replace(/\s+/g, '-');
  return (
    <div className="flex items-start gap-3">
      <button
        type="button"
        role="switch"
        aria-checked={enabled}
        aria-label={label}
        onClick={() => onToggle(!enabled)}
        className={`relative mt-0.5 h-6 w-11 shrink-0 rounded-full border transition-colors ${
          enabled ? 'border-accent bg-accent' : 'border-border bg-surface'
        }`}
      >
        <motion.span
          className="absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow-sm"
          animate={{ x: enabled ? 20 : 0 }}
          transition={{ duration: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
        />
      </button>
      <div className="flex-1 min-w-0">
        <label htmlFor={id} className="text-sm font-medium text-text-primary cursor-pointer">{label}</label>
        <p className="text-xs text-text-muted mt-0.5">{description}</p>
      </div>
    </div>
  );
}

export function ExperienceControlCenter() {
  const { preferences, setMotionEnabled, setAmbientEnabled, setAiEnabled, setVoiceEnabled, resetPreferences } = useExperience();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        aria-label="Open experience settings"
        className="fixed bottom-4 left-4 z-40 flex h-10 w-10 items-center justify-center rounded-full border border-border bg-surface text-text-secondary shadow-sm transition-colors hover:bg-background focus-visible:outline-none focus-visible:shadow-focus"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M12 15a3 3 0 100-6 3 3 0 000 6z" />
          <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06A1.65 1.65 0 009 4.68 1.65 1.65 0 0010 3.17V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z" />
        </svg>
      </button>

      <AnimatePresence>
        {isOpen ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="fixed inset-0 bg-background/60 backdrop-blur-sm" onClick={() => setIsOpen(false)} aria-hidden="true" />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 8 }}
              transition={{ duration: 0.25, ease: [0.25, 0.1, 0.25, 1] }}
              role="dialog"
              aria-modal="true"
              aria-label="Experience settings"
              className="relative w-full max-w-md rounded-2xl border border-border bg-surface p-6 shadow-lg"
            >
              <div className="mb-5">
                <h2 className="text-lg font-semibold text-text-primary">Experience Settings</h2>
                <p className="mt-1 text-sm text-text-muted">Personalize your ICON Studios experience.</p>
              </div>

              <div className="space-y-5">
                <ToggleSwitch
                  label="Motion"
                  description="Page transitions and animations."
                  enabled={preferences.motionEnabled}
                  onToggle={setMotionEnabled}
                />
                <ToggleSwitch
                  label="Ambient Effects"
                  description="Cursor-tracking glow, particles, and gradient orbs."
                  enabled={preferences.ambientEnabled}
                  onToggle={setAmbientEnabled}
                />
                <ToggleSwitch
                  label="AI Guide"
                  description="Ask ICON assistant for help navigating the site."
                  enabled={preferences.aiEnabled}
                  onToggle={setAiEnabled}
                />
                <ToggleSwitch
                  label="Voice"
                  description="Microphone input and spoken responses (browser support required)."
                  enabled={preferences.voiceEnabled}
                  onToggle={setVoiceEnabled}
                />
              </div>

              <div className="mt-6 flex items-center justify-between gap-3">
                <Button variant="ghost" size="sm" onClick={resetPreferences}>Reset to defaults</Button>
                <Button size="sm" onClick={() => setIsOpen(false)}>Done</Button>
              </div>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
