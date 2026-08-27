'use client';

import type { TextToSpeechProvider } from '@/lib/ai/voice-types';

const createProvider = (): TextToSpeechProvider => {
  let speaking = false;
  let endCallback: (() => void) | null = null;
  let errorCallback: ((error: Error) => void) | null = null;

  const clearState = () => {
    speaking = false;
    endCallback?.();
  };

  return {
    get supported() {
      return typeof window !== 'undefined' && typeof window.speechSynthesis !== 'undefined';
    },
    get speaking() {
      return speaking;
    },
    speak(text: string) {
      if (!this.supported) return;
      window.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.onend = () => clearState();
      utterance.onerror = () => {
        clearState();
        errorCallback?.(new Error('Speech synthesis error'));
      };

      speaking = true;
      window.speechSynthesis.speak(utterance);
    },
    stop() {
      if (this.supported) {
        window.speechSynthesis.cancel();
      }
      clearState();
    },
    onEnd(callback: () => void) {
      endCallback = callback;
    },
    onError(callback: (error: Error) => void) {
      errorCallback = callback;
    },
  };
};

export const textToSpeechProvider: TextToSpeechProvider = createProvider();
