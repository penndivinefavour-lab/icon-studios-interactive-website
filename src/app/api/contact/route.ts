import type { NextRequest } from 'next/server';
import { validateContactPayload, type ContactPayload } from '@/lib/contact/validation';

export const runtime = 'nodejs';
export const maxDuration = 30;

const ALTERNATIVES = {
  whatsapp: '+237 672 536 260',
  email: 'iconstudiosyde@gmail.com',
} as const;

function getAlternatives() {
  return {
    whatsapp: {
      label: ALTERNATIVES.whatsapp,
      href: `https://wa.me/237672536260`,
    },
    email: {
      label: ALTERNATIVES.email,
      href: `mailto:${ALTERNATIVES.email}`,
    },
  };
}

async function deliverEmail(data: { name: string; email: string; message: string }): Promise<{ delivered: boolean; provider: string }> {
  const apiKey = process.env.CONTACT_API_KEY;
  const toEmail = process.env.CONTACT_TO_EMAIL;
  const fromEmail = process.env.CONTACT_FROM_EMAIL || 'noreply@iconstudios.example';

  if (!apiKey || !toEmail) {
    console.log('[contact] No delivery provider configured. Message logged server-side.', {
      from: data.name,
      email: data.email,
      messagePreview: data.message.slice(0, 100),
    });
    return { delivered: false, provider: 'unconfigured' };
  }

  const provider = (process.env.CONTACT_PROVIDER || 'resend').toLowerCase();

  if (provider === 'resend') {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        from: fromEmail,
        to: toEmail,
        subject: `ICON Studios contact: ${data.name}`,
        text: `From: ${data.name} <${data.email}>\n\n${data.message}`,
        replyTo: data.email,
      }),
    });

    if (!response.ok) {
      const detail = await response.text().catch(() => 'Unknown error');
      console.error(`[contact] Resend delivery failed: ${response.status} ${detail}`);
      return { delivered: false, provider };
    }

    return { delivered: true, provider };
  }

  if (provider === 'sendgrid') {
    const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        personalizations: [{ to: [{ email: toEmail }], subject: `ICON Studios contact: ${data.name}` }],
        from: { email: fromEmail },
        reply_to: { email: data.email },
        content: [{ type: 'text/plain', value: `From: ${data.name} <${data.email}>\n\n${data.message}` }],
      }),
    });

    if (!response.ok) {
      const detail = await response.text().catch(() => 'Unknown error');
      console.error(`[contact] SendGrid delivery failed: ${response.status} ${detail}`);
      return { delivered: false, provider };
    }

    return { delivered: true, provider };
  }

  console.error(`[contact] Unknown provider: ${provider}`);
  return { delivered: false, provider };
}

export async function POST(request: NextRequest) {
  let body: ContactPayload;

  try {
    body = await request.json();
  } catch {
    return Response.json(
      { success: false, error: { code: 'VALIDATION_ERROR', message: 'Invalid JSON body.' } },
      { status: 400 },
    );
  }

  const validation = validateContactPayload(body);

  if (!validation.valid) {
    const first = validation.errors[0];
    return Response.json(
      {
        success: false,
        error: { code: 'VALIDATION_ERROR', message: first.message },
        errors: validation.errors,
      },
      { status: 400 },
    );
  }

  const result = await deliverEmail(validation.data);

  if (result.provider === 'unconfigured') {
    return Response.json(
      {
        success: false,
        delivery: 'unconfigured',
        error: {
          code: 'NOT_CONFIGURED',
          message: 'Email delivery is not configured. Please reach out via WhatsApp or email directly.',
        },
        alternatives: getAlternatives(),
      },
      { status: 200 },
    );
  }

  if (!result.delivered) {
    return Response.json(
      {
        success: false,
        error: { code: 'DELIVERY_ERROR', message: 'Failed to send message. Please try again.' },
        alternatives: getAlternatives(),
      },
      { status: 502 },
    );
  }

  return Response.json({
    success: true,
    message: 'Message sent successfully.',
    delivery: 'sent',
  });
}
