import { describe, it, expect } from 'vitest';
import type { NextRequest } from 'next/server';
import { POST } from '@/app/api/contact/route';

const validPayload = {
  name: 'Test User',
  email: 'test@example.com',
  message: 'I would like to discuss a project.',
};

function createRequest(body: unknown): NextRequest {
  return new Request('http://localhost/api/contact', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  }) as unknown as NextRequest;
}

describe('POST /api/contact', () => {
  it('rejects invalid JSON', async () => {
    const request = new Request('http://localhost/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: 'not-json',
    }) as unknown as NextRequest;
    const response = await POST(request);
    expect(response.status).toBe(400);
    const data = await response.json();
    expect(data.success).toBe(false);
  });

  it('rejects missing required fields', async () => {
    const request = createRequest({ email: 'test@test.com' });
    const response = await POST(request);
    expect(response.status).toBe(400);
    const data = await response.json();
    expect(data.success).toBe(false);
  });

  it('rejects invalid email', async () => {
    const request = createRequest({ ...validPayload, email: 'invalid' });
    const response = await POST(request);
    expect(response.status).toBe(400);
  });

  it('rejects honeypot', async () => {
    const request = createRequest({ ...validPayload, _bot: 'spam' });
    const response = await POST(request);
    expect(response.status).toBe(400);
  });

  it('returns unconfigured state when no provider', async () => {
    const request = createRequest(validPayload);
    const response = await POST(request);
    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data.success).toBe(false);
    expect(data.delivery).toBe('unconfigured');
    expect(data.alternatives.whatsapp.label).toBe('+237 672 536 260');
    expect(data.alternatives.email.label).toBe('iconstudiosyde@gmail.com');
  });

  it('accepts empty honeypot', async () => {
    const request = createRequest({ ...validPayload, _bot: '' });
    const response = await POST(request);
    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data.success).toBe(false); // unconfigured, not success
  });
});
