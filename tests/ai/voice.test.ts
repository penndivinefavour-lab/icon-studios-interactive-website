import { describe, it, expect } from 'vitest';
import { speechToTextProvider } from '@/lib/ai/speech-to-text';
import { textToSpeechProvider } from '@/lib/ai/text-to-speech';

describe('voice providers', () => {
  it('exposes speech-to-text provider state', () => {
    expect(speechToTextProvider).toBeDefined();
    expect(typeof speechToTextProvider.supported).toBe('boolean');
    expect(typeof speechToTextProvider.isListening).toBe('boolean');
    expect(typeof speechToTextProvider.startListening).toBe('function');
    expect(typeof speechToTextProvider.stopListening).toBe('function');
  });

  it('exposes text-to-speech provider state', () => {
    expect(textToSpeechProvider).toBeDefined();
    expect(typeof textToSpeechProvider.supported).toBe('boolean');
    expect(typeof textToSpeechProvider.speaking).toBe('boolean');
    expect(typeof textToSpeechProvider.speak).toBe('function');
    expect(typeof textToSpeechProvider.stop).toBe('function');
  });
});
