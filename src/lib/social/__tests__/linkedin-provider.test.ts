import { describe, it, expect, vi, beforeEach } from 'vitest';
import { LinkedInProvider } from '@/lib/social/providers/linkedin/publisher';
import { LinkedInClient, LinkedInApiError } from '@/lib/social/providers/linkedin/client';
import { SocialAdapterError } from '@/lib/social/core/errors';

const mockUgcCreateResponse = { id: 'linkedin-ugc-post-123' };
const mockProfileResponse = { id: 'owner-person-id' };

function createMockClient(overrides: {
  getProfile?: ReturnType<typeof vi.fn>;
  createUgcPost?: ReturnType<typeof vi.fn>;
} = {}) {
  const client = {
    getProfile: vi.fn().mockResolvedValue(mockProfileResponse),
    createUgcPost: vi.fn().mockResolvedValue(mockUgcCreateResponse),
    ...overrides,
  } as unknown as LinkedInClient;

  return client;
}

describe('LinkedInProvider', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('publishes a dry run successfully', async () => {
    const client = createMockClient();
    const provider = new LinkedInProvider({ client });

    const result = await provider.publishText({
      account: 'linkedin_primary',
      text: 'Hello LinkedIn from ICON Studios.',
      dry_run: true,
    });

    expect(result.success).toBe(true);
    expect(result.status).toBe('draft');
    expect(result.post_id).toMatch(/^dry-run-/);
    expect(client.createUgcPost).not.toHaveBeenCalled();
  });

  it('publishes a real post only when approved=true', async () => {
    const client = createMockClient();
    const provider = new LinkedInProvider({ client });

    const result = await provider.publishText({
      account: 'linkedin_primary',
      text: 'Hello LinkedIn from ICON Studios.',
      approved: true,
      dry_run: false,
    });

    expect(result.success).toBe(true);
    expect(result.status).toBe('published');
    expect(result.post_id).toBe(mockUgcCreateResponse.id);
    expect(client.getProfile).toHaveBeenCalled();
    expect(client.createUgcPost).toHaveBeenCalled();
  });

  it('rejects real publish when approval is missing', async () => {
    const client = createMockClient();
    const provider = new LinkedInProvider({ client });

    const result = await provider.publishText({
      account: 'linkedin_primary',
      text: 'Hello LinkedIn from ICON Studios.',
      dry_run: false,
    });

    expect(result.success).toBe(false);
    expect(result.status).toBe('failed');
    expect(result.error?.code).toBe('AUTHORIZATION_ERROR');
    expect(client.createUgcPost).not.toHaveBeenCalled();
  });

  it('rejects an unknown account alias', async () => {
    const client = createMockClient();
    const provider = new LinkedInProvider({
      client,
      accountAlias: 'linkedin_primary',
    });

    const result = await provider.publishText({
      account: 'unknown_account',
      text: 'Hello LinkedIn from ICON Studios.',
      dry_run: true,
    });

    expect(result.success).toBe(false);
    expect(result.error?.code).toBe('AUTHORIZATION_ERROR');
  });

  it('returns a validation-style failure for empty text on real publish', async () => {
    const client = createMockClient();
    const provider = new LinkedInProvider({ client });

    const result = await provider.publishText({
      account: 'linkedin_primary',
      text: '   ',
      approved: true,
      dry_run: false,
    });

    expect(result.success).toBe(false);
    expect(result.status).toBe('failed');
    expect(result.error?.code).toBe('VALIDATION_ERROR');
  });

  it('maps LinkedIn API errors into structured errors', async () => {
    const client = createMockClient({
      getProfile: vi.fn().mockRejectedValue(
        new LinkedInApiError('AUTHENTICATION_ERROR', 'bad token', 401),
      ),
    });
    const provider = new LinkedInProvider({ client });

    const result = await provider.publishText({
      account: 'linkedin_primary',
      text: 'Hello LinkedIn from ICON Studios.',
      approved: true,
      dry_run: false,
    });

    expect(result.success).toBe(false);
    expect(result.error?.code).toBe('AUTHENTICATION_ERROR');
  });

  it('prevents duplicate publish requests', async () => {
    const client = createMockClient();
    const provider = new LinkedInProvider({ client });

    const first = await provider.publishText({
      account: 'linkedin_primary',
      text: 'Hello LinkedIn from ICON Studios.',
      approved: true,
      dry_run: false,
    });

    expect(first.success).toBe(true);

    const second = await provider.publishText({
      account: 'linkedin_primary',
      text: 'Hello LinkedIn from ICON Studios.',
      approved: true,
      dry_run: false,
    });

    expect(second.success).toBe(false);
    expect(second.error?.code).toBe('DUPLICATE_REQUEST');
    expect(client.createUgcPost).toHaveBeenCalledTimes(1);
  });
});

describe('LinkedInAdapterError', () => {
  it('preserves error code and message', () => {
    const error = new SocialAdapterError(
      'AUTHENTICATION_ERROR',
      'bad token',
    );

    expect(error.code).toBe('AUTHENTICATION_ERROR');
    expect(error.message).toBe('bad token');
  });
});
