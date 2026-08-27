// src/lib/social/providers/linkedin/auth.ts
import { SocialAdapterError } from '@/lib/social/core/errors';
import type { ErrorCode } from '@/lib/social/core/types';

export type { ErrorCode };

const ENV_CLIENT_ID = 'LINKEDIN_CLIENT_ID';
const ENV_CLIENT_SECRET = 'LINKEDIN_CLIENT_SECRET';
const ENV_ACCESS_TOKEN = 'LINKEDIN_ACCESS_TOKEN';
const DEFAULT_ACCOUNT_ALIAS = 'linkedin_primary';

export interface LinkedInConfig {
  clientId: string;
  clientSecret: string;
  accessToken: string;
  defaultAccountAlias: string;
}

export function loadLinkedInConfig(): LinkedInConfig {
  const clientId = process.env.LINKEDIN_CLIENT_ID;
  const clientSecret = process.env.LINKEDIN_CLIENT_SECRET;
  const accessToken = process.env.LINKEDIN_ACCESS_TOKEN;

  const missing = [
    ENV_CLIENT_ID,
    ENV_CLIENT_SECRET,
    ENV_ACCESS_TOKEN,
  ]
    .filter((name) => !process.env[name])
    .map((name) => `Missing environment variable: ${name}`);

  if (missing.length > 0) {
    throw new SocialAdapterError(
      'CONFIGURATION_ERROR',
      missing.join('; '),
    );
  }

  if (!clientId || !clientSecret || !accessToken) {
    throw new SocialAdapterError(
      'CONFIGURATION_ERROR',
      'LinkedIn configuration is incomplete.',
    );
  }

  return {
    clientId,
    clientSecret,
    accessToken,
    defaultAccountAlias: DEFAULT_ACCOUNT_ALIAS,
  };
}

export function getDefaultAccountAlias(): string {
  return DEFAULT_ACCOUNT_ALIAS;
}
