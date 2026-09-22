import { LinkedInProvider } from '@/lib/social/providers/linkedin/publisher';
import { LinkedInApiError } from '@/lib/social/providers/linkedin/client';
import { SocialAdapterError } from '@/lib/social/core/errors';

export const runtime = 'nodejs';

export async function GET() {
  try {
    const provider = new LinkedInProvider();
    const result = await provider.publishText({
      account: 'linkedin_primary',
      text: '',
      dry_run: true,
    });

    return Response.json({
      status: 'ok',
      adapter: 'ICON Social Publishing Adapter',
      provider: 'linkedin',
      account: result.account,
      last_check: result,
    });
  } catch (error) {
    const message = normalizeError(error);

    return Response.json(
      {
        status: 'error',
        adapter: 'ICON Social Publishing Adapter',
        provider: 'linkedin',
        error: {
          code: 'CONFIGURATION_ERROR',
          message,
        },
      },
      { status: 500 },
    );
  }
}

function normalizeError(error: unknown): string {
  if (error instanceof SocialAdapterError || error instanceof LinkedInApiError) {
    return error.message;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return 'Unknown health check failure.';
}
