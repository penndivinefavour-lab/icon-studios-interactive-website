import type { NextRequest } from 'next/server';
import { LinkedInProvider } from '@/lib/social/providers/linkedin/publisher';
import { LinkedInApiError } from '@/lib/social/providers/linkedin/client';
import { SocialAdapterError } from '@/lib/social/core/errors';

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  let body: {
    platform?: string;
    account?: string;
    text?: string;
    approved?: boolean;
    dry_run?: boolean;
  };

  try {
    body = await request.json();
  } catch {
    return Response.json(
      {
        success: false,
        platform: 'unknown',
        account: 'unknown',
        status: 'failed',
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Invalid JSON body.',
        },
      },
      { status: 400 },
    );
  }

  if (!body.platform || !body.account) {
    return Response.json(
      {
        success: false,
        platform: body.platform || 'unknown',
        account: body.account || 'unknown',
        status: 'awaiting_approval',
        error: {
          code: 'VALIDATION_ERROR',
          message: 'platform and account are required.',
        },
      },
      { status: 400 },
    );
  }

  const text = typeof body.text === 'string' ? body.text.trim() : '';

  if (!text) {
    return Response.json(
      {
        success: false,
        platform: body.platform,
        account: body.account,
        status: 'awaiting_approval',
        error: {
          code: 'VALIDATION_ERROR',
          message: 'text must not be empty.',
        },
      },
      { status: 400 },
    );
  }

  if (body.platform !== 'linkedin') {
    return Response.json(
      {
        success: false,
        platform: body.platform,
        account: body.account,
        status: 'awaiting_approval',
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Only linkedin is supported in Phase 1.',
        },
      },
      { status: 400 },
    );
  }

  const dryRun = body.dry_run === true;
  const realPublishRequested = !dryRun;
  const approvalRequired = realPublishRequested && body.approved !== true;

  if (approvalRequired) {
    return Response.json(
      {
        success: false,
        platform: 'linkedin',
        account: body.account,
        status: 'awaiting_approval',
        error: {
          code: 'AUTHORIZATION_ERROR',
          message: 'Explicit publish approval is required.',
        },
      },
      { status: 403 },
    );
  }

  const provider = new LinkedInProvider();
  const result = await provider.publishText({
    account: body.account,
    text: body.text || '',
    dry_run: dryRun,
  });

  const status = result.success
    ? dryRun
      ? 'draft'
      : 'published'
    : 'failed';

  const payload: Record<string, unknown> = {
    success: result.success,
    platform: result.platform,
    account: result.account,
    status,
    post_id: result.post_id,
  };

  if (!result.success && result.error) {
    payload.error = {
      code: result.error.code,
      message: result.error.message,
    };
  }

  return Response.json(payload, { status: result.success ? 200 : 400 });
}
