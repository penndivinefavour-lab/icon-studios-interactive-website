export type AvatarState =
  | 'idle'
  | 'listening'
  | 'thinking'
  | 'speaking'
  | 'guiding'
  | 'success'
  | 'error';

export type VoiceState = 'idle' | 'listening' | 'thinking' | 'speaking' | 'unsupported';

export type VoiceCapabilities = {
  speechToText: boolean;
  textToSpeech: boolean;
};

export type AvatarStateChangeEvent = {
  previousState: AvatarState;
  currentState: AvatarState;
  timestamp: number;
};
