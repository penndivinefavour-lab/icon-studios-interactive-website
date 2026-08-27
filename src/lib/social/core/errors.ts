// src/lib/social/core/errors.ts
import { ErrorCode } from './types';

export class SocialAdapterError extends Error {
  constructor(public readonly code: ErrorCode, message: string) {
    super(message);
    this.name = 'SocialAdapterError';
  }
}

export function isSocialAdapterError(error: unknown): error is SocialAdapterError {
  return (
    typeof error === 'object' &&
    error !== null &&
    'code' in error &&
    typeof (error as { code: unknown }).code === 'string'
  );
}
