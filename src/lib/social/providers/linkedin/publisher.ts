// src/lib/social/providers/linkedin/publisher.ts
import type { SocialProvider, PublishResult } from '@/lib/social/core/types';
import { isSocialAdapterError } from '@/lib/social/core/errors';
import { loadLinkedInConfig, getDefaultAccountAlias } from './auth';
import { LinkedInClient, LinkedInApiError } from './client';

const IDEMPOTENCY_PREFIX = 'icon-hermes-';
const DEFAULT_IDEMPOTENCY_TTL_MS = 1000 * 60 * 60;

export class LinkedInProvider implements SocialProvider {
  readonly platform = 'linkedin' as const;
  private readonly client: LinkedInClient;
  private readonly accountAlias: string;
  private readonly processedKeys = new Map<string, number>();

  constructor(config?: { client?: LinkedInClient; accountAlias?: string }) {
    const client = config?.client ?? new LinkedInClient(loadLinkedInConfig());
    const accountAlias = config?.accountAlias ?? getDefaultAccountAlias();
    this.client = client;
    this.accountAlias = accountAlias;
  }

  async publishText(request: {
    account: string;
    text: string;
    approved?: boolean;
    dry_run: boolean;
  }): Promise<PublishResult> {
    const account = request.account || this.accountAlias;

    try {
      const text = typeof request.text === 'string' ? request.text.trim() : '';

      if (!text) {
        return this.failure(account, 'VALIDATION_ERROR', 'text must not be empty.');
      }

      if (account !== this.accountAlias) {
        return this.failure(account, 'AUTHORIZATION_ERROR', 'Unknown LinkedIn account alias.');
      }

      if (!request.dry_run && request.approved !== true) {
        return this.failure(account, 'AUTHORIZATION_ERROR', 'Explicit publish approval is required.');
      }

      const idempotencyKey = this.buildIdempotencyKey(account, text);

      if (this.isDuplicateRequest(idempotencyKey)) {
        return this.failure(account, 'DUPLICATE_REQUEST', 'Duplicate publish request detected.');
      }

      if (request.dry_run) {
        return this.dryRunSuccess(account, idempotencyKey);
      }

      const profile = await this.client.getProfile();
      const body = buildUgcTextPostBody(profile.id, text);

      const response = await this.client.createUgcPost(body);

      this.markProcessed(idempotencyKey);

      return {
        success: true,
        platform: 'linkedin',
        account,
        status: 'published',
        post_id: response.id,
      };
    } catch (error) {
      if (isSocialAdapterError(error)) {
        return this.failure(account, error.code, error.message);
      }

      if (error instanceof LinkedInApiError) {
        return this.failure(account, error.code, error.message);
      }

      if (error instanceof Error) {
        return this.failure(account, 'UNKNOWN_ERROR', error.message);
      }

      return this.failure(account, 'UNKNOWN_ERROR', 'Unknown publishing failure.');
    }
  }

  private failure(account: string, code: string, message: string): PublishResult {
    return {
      success: false,
      platform: 'linkedin',
      account,
      status: 'failed',
      error: {
        code: code as import('@/lib/social/core/types').ErrorCode,
        message,
      },
    };
  }

  private dryRunSuccess(account: string, idempotencyKey: string): PublishResult {
    return {
      success: true,
      platform: 'linkedin',
      account,
      status: 'draft',
      post_id: `dry-run-${idempotencyKey}`,
    };
  }

  private buildIdempotencyKey(account: string, text: string): string {
    return `${IDEMPOTENCY_PREFIX}${account}-${hashText(text)}`;
  }

  private isDuplicateRequest(key: string): boolean {
    this.pruneIdempotencyStore();
    return this.processedKeys.has(key);
  }

  private markProcessed(key: string): void {
    this.processedKeys.set(key, Date.now());
  }

  private pruneIdempotencyStore(): void {
    const cutoff = Date.now() - DEFAULT_IDEMPOTENCY_TTL_MS;
    for (const [key, timestamp] of this.processedKeys) {
      if (timestamp < cutoff) {
        this.processedKeys.delete(key);
      }
    }
  }
}

function hashText(text: string): string {
  let hash = 0;

  for (let index = 0; index < text.length; index++) {
    const char = text.charCodeAt(index);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }

  return `${Math.abs(hash)}`;
}

function buildUgcTextPostBody(ownerUrn: string, text: string): unknown {
  const safeText = text.length > 3000 ? `${text.slice(0, 2997)}...` : text;

  return {
    author: `urn:li:person:${ownerUrn}`,
    lifecycleState: 'PUBLISHED',
    specificContent: {
      'com.linkedin.ugc.ShareContent': {
        shareCommentary: {
          text: safeText,
        },
        shareMediaCategory: 'NONE',
      },
    },
    visibility: {
      'com.linkedin.ugc.MemberNetworkVisibility': 'PUBLIC',
    },
  };
}
