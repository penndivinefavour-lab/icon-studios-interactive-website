import { describe, it, expect } from 'vitest';
import { readFileSync } from 'fs';
import { join } from 'path';

const LINKEDIN_FILES = [
  'src/lib/social/providers/linkedin/auth.ts',
  'src/lib/social/providers/linkedin/client.ts',
  'src/lib/social/providers/linkedin/publisher.ts',
];

const COMPOSIO_BANNED_TERMS = [
  'composio',
  'COMPOSIO',
  'Tool Router',
  'mcp__supabase',
  'COMPOSIO_MULTI_EXECUTE_TOOL',
  'LINKEDIN_CREATE_LINKED_IN_POST',
];

describe('Composio independence for LinkedIn provider', () => {
  for (const relativePath of LINKEDIN_FILES) {
    it(`does not reference Composio or Composio tooling in ${relativePath}`, () => {
      const absolutePath = join(process.cwd(), relativePath);
      const contents = readFileSync(absolutePath, 'utf8');

      for (const term of COMPOSIO_BANNED_TERMS) {
        expect(contents).not.toContain(term);
      }
    });
  }
});
