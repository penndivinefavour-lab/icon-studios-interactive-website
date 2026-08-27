'use client';

import React, { useCallback, useEffect } from 'react';
import type { VoiceCapabilities, AvatarState } from '@/lib/ai/avatar-state';
import { speechToTextProvider } from '@/lib/ai/speech-to-text';
import { textToSpeechProvider } from '@/lib/ai/text-to-speech';

type VoiceControlsProps = {
  capabilities: VoiceCapabilities;
  currentState: AvatarState;
  onStateChange: (state: AvatarState) => void;
};

export const VoiceControls = ({ capabilities, currentState, onStateChange }: VoiceControlsProps) => {
  const handleToggleListening = useCallback(() => {
    if (!capabilities.speechToText) return;
    if (speechToTextProvider.isListening) {
      speechToTextProvider.stopListening();
      onStateChange('idle');
    } else {
      textToSpeechProvider.stop();
      speechToTextProvider.startListening();
      onStateChange('listening');
    }
  }, [capabilities.speechToText, onStateChange]);

  const handleStopSpeaking = useCallback(() => {
    if (currentState === 'speaking') {
      textToSpeechProvider.stop();
      onStateChange('idle');
    }
  }, [currentState, onStateChange]);

  useEffect(() => {
    if (!capabilities.speechToText) return;
    const handleResult = (result: { text: string; isFinal: boolean }) => {
      if (result.isFinal && result.text.trim()) {
        onStateChange('thinking');
      }
    };
    speechToTextProvider.onResult(handleResult);
    return () => {
      speechToTextProvider.stopListening();
    };
  }, [capabilities.speechToText, onStateChange]);

  useEffect(() => {
    if (!capabilities.textToSpeech) return;
    const end = () => {
      if (currentState === 'speaking') {
        onStateChange('idle');
      }
    };
    textToSpeechProvider.onEnd(end);
    return () => {
      textToSpeechProvider.stop();
    };
  }, [capabilities.textToSpeech, currentState, onStateChange]);

  return (
    <div className="flex items-center gap-2">
      {capabilities.speechToText && (
        <button
          type="button"
          aria-label={speechToTextProvider.isListening ? 'Stop listening' : 'Start listening'}
          className={`h-8 w-8 rounded-full border text-xs ${
            speechToTextProvider.isListening
              ? 'border-accent bg-accent text-accent-foreground'
              : 'border-border text-text-secondary hover:bg-background'
          }`}
          onClick={handleToggleListening}
        >
          {speechToTextProvider.isListening ? '■' : '🎤'}
        </button>
      )}

      {capabilities.textToSpeech && currentState === 'speaking' && (
        <button
          type="button"
          aria-label="Stop speaking"
          className="h-8 w-8 rounded-full border border-border text-xs text-text-secondary hover:bg-background"
          onClick={handleStopSpeaking}
        >
          ■
        </button>
      )}

      {!capabilities.speechToText && !capabilities.textToSpeech && (
        <span className="text-xs text-text-muted">Voice unavailable</span>
      )}
    </div>
  );
};
