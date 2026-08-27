export type StartListeningOptions = {
  lang?: string;
  continuous?: boolean;
  interimResults?: boolean;
};

export type SpeechRecognitionResult = {
  text: string;
  isFinal: boolean;
};

export type SpeechToTextProvider = {
  readonly supported: boolean;
  readonly isListening: boolean;
  startListening: (options?: StartListeningOptions) => void;
  stopListening: () => void;
  onResult: (callback: (result: SpeechRecognitionResult) => void) => void;
  onError: (callback: (error: Error) => void) => void;
};

export type TextToSpeechProvider = {
  readonly supported: boolean;
  readonly speaking: boolean;
  speak: (text: string) => void;
  stop: () => void;
  onEnd: (callback: () => void) => void;
  onError: (callback: (error: Error) => void) => void;
};
