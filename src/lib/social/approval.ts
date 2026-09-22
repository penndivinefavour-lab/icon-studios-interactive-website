// src/lib/social/approval.ts
import { publishLinkedInText } from './';

export type HermesSocialPublishState =
  | 'DRAFT'
  | 'AWAITING_APPROVAL'
  | 'APPROVED'
  | 'PUBLISHING'
  | 'PUBLISHED'
  | 'FAILED';

export function mapApprovalState(status: string): HermesSocialPublishState {
  const map: Record<string, HermesSocialPublishState> = {
    draft: 'DRAFT',
    awaiting_approval: 'AWAITING_APPROVAL',
    approved: 'APPROVED',
    publishing: 'PUBLISHING',
    published: 'PUBLISHED',
    failed: 'FAILED',
  };

  return map[status] ?? 'FAILED';
}

export async function socialPublish(opts: {
  platform: 'linkedin';
  account: string;
  text: string;
  approved?: boolean;
  dry_run?: boolean;
}) {
  if (opts.platform !== 'linkedin') {
    return {
      success: false,
      platform: opts.platform,
      account: opts.account,
      status: 'FAILED',
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Only linkedin is supported in Phase 1.',
      },
    } as const;
  }

  const result = await publishLinkedInText({
    account: opts.account,
    text: opts.text,
    approved: opts.approved,
    dry_run: opts.dry_run,
  });

  return {
    ...result,
    state: mapApprovalState(result.status),
  };
}
