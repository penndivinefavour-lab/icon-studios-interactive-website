// src/lib/social/core/types.ts

export type Platform = 'linkedin';

export type ApprovalState = 'draft' | 'approved' | 'rejected';

export type PublishStatus =
  | 'draft'
  | 'awaiting_approval'
  | 'approved'
  | 'publishing'
  | 'published'
  | 'failed';

export type ErrorCode =
  | 'CONFIGURATION_ERROR'
  | 'AUTHENTICATION_ERROR'
  | 'AUTHORIZATION_ERROR'
  | 'VALIDATION_ERROR'
  | 'LINKEDIN_API_ERROR'
  | 'RATE_LIMIT_ERROR'
  | 'NETWORK_ERROR'
  | 'DUPLICATE_REQUEST'
  | 'UNKNOWN_ERROR';

export interface PublishRequest {
  platform: Platform;
  account: string;
  text: string;
  approved?: boolean;
  dry_run?: boolean;
}

export interface PublishResult {
  success: boolean;
  platform: Platform;
  account: string;
  status: string;
  post_id?: string;
  error?: {
    code: ErrorCode;
    message: string;
  };
}

export interface SocialProvider {
  platform: Platform;
  publishText(request: {
    account: string;
    text: string;
    approved?: boolean;
    dry_run: boolean;
  }): Promise<PublishResult>;
}

export interface AccountInfo {
  platform: Platform;
  alias: string;
  display_name: string;
  status: 'configured' | 'not_configured';
}
