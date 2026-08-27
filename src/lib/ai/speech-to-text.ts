'use client';

import type { SpeechToTextProvider, StartListeningOptions, SpeechRecognitionResult } from '@/lib/ai/voice-types';

type RecognitionLike = {
  start(): void;
  stop(): void;
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  onresult: ((event: { results: { length: number; [index: number]: { length: number; 0?: { transcript: string }; isFinal: boolean } } }) => void) | null;
  onerror: ((event: { error?: string }) => void) | null;
  onend: (() => void) | null;
};

const getSpeechRecognitionAPI = (): { new (): RecognitionLike } | undefined => {
  if (typeof window === 'undefined') return undefined;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return ((window as any).SpeechRecognition || (window as any).webkitSpeechRecognition) as { new (): RecognitionLike } | undefined;
};

const createProvider = (): SpeechToTextProvider => {
  let recognition: RecognitionLike | null = null;
  let active = false;
  let resultCallback: ((result: SpeechRecognitionResult) => void) | null = null;
  let errorCallback: ((error: Error) => void) | null = null;

  const initialize = () => {
    if (recognition) return;
    const SpeechRecognitionAPI = getSpeechRecognitionAPI();
    if (!SpeechRecognitionAPI) return;
    recognition = new SpeechRecognitionAPI();
    recognition.continuous = true;
    recognition.interimResults = true;

    recognition.onresult = (event) => {
      const last = event.results[event.results.length - 1];
      if (!last) return;
      resultCallback?.({
        text: (last[0]?.transcript as string) ?? '',
        isFinal: last.isFinal,
      });
    };

    recognition.onerror = (event) => {
      active = false;
      errorCallback?.(new Error(event.error ?? 'Speech recognition error'));
    };

    recognition.onend = () => {
      active = false;
    };
  };

  return {
    get supported() {
      initialize();
      return Boolean(recognition);
    },
    get isListening() {
      initialize();
      return active;
    },
    startListening(options?: StartListeningOptions) {
      initialize();
      if (!recognition) return;
      recognition.lang = options?.lang ?? 'en-US';
      recognition.continuous = options?.continuous ?? true;
      recognition.interimResults = options?.interimResults ?? true;
      try {
        recognition.start();
        active = true;
      } catch {
        active = false;
      }
    },
    stopListening() {
      try {
        recognition?.stop();
      } finally {
        active = false;
      }
    },
    onResult(callback: (result: SpeechRecognitionResult) => void) {
      resultCallback = callback;
    },
    onError(callback: (error: Error) => void) {
      errorCallback = callback;
    },
  };
};

export const speechToTextProvider: SpeechToTextProvider = createProvider();
