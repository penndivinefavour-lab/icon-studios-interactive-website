// src/lib/social/index.ts
import { LinkedInProvider } from './providers/linkedin/publisher';

export type { SocialProvider, PublishResult, AccountInfo, Platform } from './core/types';
export { SocialAdapterError, isSocialAdapterError } from './core/errors';

export function createLinkedInProvider(opts?: {
  accountAlias?: string;
}) {
  return new LinkedInProvider(opts);
}

export async function publishLinkedInText(opts: {
  account?: string;
  text: string;
  approved?: boolean;
  dry_run?: boolean;
}) {
  const provider = createLinkedInProvider({
    accountAlias: opts.account,
  });

  return provider.publishText({
    account: opts.account ?? 'linkedin_primary',
    text: opts.text,
    approved: opts.approved,
    dry_run: opts.dry_run ?? false,
  });
}
