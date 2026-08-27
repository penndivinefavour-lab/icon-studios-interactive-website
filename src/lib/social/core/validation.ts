import type { PublishRequest } from './types';

const MAX_TEXT_LENGTH = 3000;

export function validatePublishRequest(request: PublishRequest): void {
  if (!request.platform) {
    throw new Error('platform is required');
  }

  if (!request.account) {
    throw new Error('account is required');
  }

  const text = typeof request.text === 'string' ? request.text.trim() : '';

  if (!text) {
    throw new Error('text must not be empty');
  }

  if (text.length > MAX_TEXT_LENGTH) {
    throw new Error(`text exceeds max length of ${MAX_TEXT_LENGTH}`);
  }
}
