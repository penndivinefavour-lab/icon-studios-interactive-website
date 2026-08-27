# ICON Social Publishing Adapter

LinkedIn publishing layer for ICON Studios, built as a clean,
provider-based adapter that talks directly to LinkedIn's official API.

    Hermes
      ↓
    ICON Social Publishing Adapter
      ↓
    Official LinkedIn API
      ↓
    LinkedIn

Composio is NOT part of the LinkedIn publishing path.

## Structure

    src/lib/social
    ├── core
    │   ├── types.ts
    │   ├── errors.ts
    │   ├── validation.ts
    │   └── approval.ts
    ├── providers
    │   └── linkedin
    │       ├── auth.ts
    │       ├── client.ts
    │       └── publisher.ts
    └── __tests__
        ├── linkedin-provider.test.ts
        └── composio-independence.test.ts

    src/app/api/social
    ├── health/route.ts
    ├── accounts/route.ts
    └── publish/route.ts

## Configuration

Required environment variables:

    LINKEDIN_CLIENT_ID
    LINKEDIN_CLIENT_SECRET
    LINKEDIN_ACCESS_TOKEN

Do not hard-code these values. Use `.env.local` or your environment's
secure secrets mechanism.

## Invocation

Hermes invokes the adapter via the built-in API routes:

    GET  /api/social/health
    GET  /api/social/accounts
    POST /api/social/publish

Example publish request:

    {
      "platform": "linkedin",
      "account": "linkedin_primary",
      "text": "...",
      "dry_run": true,
      "approved": true
    }

Real publishing requires both:

    dry_run = false
    approved = true

If either is missing, the adapter returns AUTHORIZATION_ERROR.

## Approval States

    DRAFT / AWAITING_APPROVAL / APPROVED / PUBLISHING / PUBLISHED / FAILED

The adapter separates validation, approval, and actual publishing.
It does not publish arbitrary generated content automatically.

## Error Codes

    CONFIGURATION_ERROR
    AUTHENTICATION_ERROR
    AUTHORIZATION_ERROR
    VALIDATION_ERROR
    LINKEDIN_API_ERROR
    RATE_LIMIT_ERROR
    NETWORK_ERROR
    DUPLICATE_REQUEST
    UNKNOWN_ERROR

## Security

- No secrets are logged.
- No credentials are committed.
- Duplicate requests are suppressed with local idempotency tracking.
- The LinkedIn provider never imports Composio.

## Adding Future Providers

Implement `SocialProvider` in `src/lib/social/providers/<provider>`.
Extend the API routes to route new platforms. Keep the core types
and approval logic shared.
