// src/lib/social/providers/linkedin/client.ts
import { SocialAdapterError } from '@/lib/social/core/errors';
import type { ErrorCode, LinkedInConfig } from './auth';

export type { ErrorCode };

export class LinkedInApiError extends SocialAdapterError {
  constructor(
    code: ErrorCode,
    message: string,
    public readonly status?: number,
  ) {
    super(code, message);
    this.name = 'LinkedInApiError';
  }
}

const API_BASE = 'https://api.linkedin.com/v2';

type HttpMethod = 'GET' | 'POST' | 'PUT';

export class LinkedInClient {
  constructor(private readonly config: LinkedInConfig) {}

  async request<T>(
    method: HttpMethod,
    path: string,
    body?: unknown,
  ): Promise<T> {
    const url = `${API_BASE}${path}`;
    const headers: Record<string, string> = {
      Authorization: `Bearer ${this.config.accessToken}`,
      'X-Restli-Protocol-Version': '2.0.0',
    };

    if (body !== undefined) {
      headers['Content-Type'] = 'application/json';
    }

    const response = await fetch(url, {
      method,
      headers,
      body: body === undefined ? undefined : JSON.stringify(body),
    });

    const text = await response.text().catch(() => '');

    if (!response.ok) {
      let parsedBody: unknown = text;

      try {
        parsedBody = JSON.parse(text);
      } catch {
        // keep parsedBody as raw text
      }

      const code = classifyLinkedInError(response.status);

      const message =
        typeof parsedBody === 'object' &&
        parsedBody !== null &&
        'message' in parsedBody &&
        typeof (parsedBody as { message?: string }).message === 'string'
          ? (parsedBody as { message: string }).message
          : `LinkedIn API error: ${response.status}`;

      throw new LinkedInApiError(code, message, response.status);
    }

    if (!text) {
      return {} as T;
    }

    try {
      return JSON.parse(text) as T;
    } catch {
      throw new LinkedInApiError(
        'LINKEDIN_API_ERROR',
        'Invalid JSON response from LinkedIn.',
        response.status,
      );
    }
  }

  async getProfile(): Promise<{ id: string }> {
    return this.request<{ id: string }>('GET', '/me?projection=(id)');
  }

  async createUgcPost(body: unknown): Promise<{ id: string }> {
    return this.request<{ id: string }>('POST', '/ugcPosts', body);
  }
}

function classifyLinkedInError(status: number): ErrorCode {
  if (status === 401) {
    return 'AUTHENTICATION_ERROR';
  }

  if (status === 403) {
    return 'AUTHORIZATION_ERROR';
  }

  if (status === 429) {
    return 'RATE_LIMIT_ERROR';
  }

  return 'LINKEDIN_API_ERROR';
}
