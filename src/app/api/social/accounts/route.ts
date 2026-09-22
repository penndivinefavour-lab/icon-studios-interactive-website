import { LinkedInProvider } from '@/lib/social/providers/linkedin/publisher';

export const runtime = 'nodejs';

export async function GET() {
  const provider = new LinkedInProvider();

  return Response.json({
    adapter: 'ICON Social Publishing Adapter',
    accounts: [
      {
        platform: provider.platform,
        alias: 'linkedin_primary',
        display_name: 'Primary LinkedIn Account',
        status: 'configured',
      },
    ],
  });
}
