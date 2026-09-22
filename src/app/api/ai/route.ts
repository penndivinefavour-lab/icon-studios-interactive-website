import { NextRequest, NextResponse } from 'next/server';
import { getAiProvider, isLiveProviderConfigured } from '@/lib/ai/provider';
import { buildAiResponse } from '@/lib/ai/conversation';

export const maxDuration = 30;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const message = typeof body?.message === 'string' ? body.message.trim() : '';
    const history = Array.isArray(body?.history) ? body.history : [];

    if (!message) {
      return NextResponse.json({ error: 'Message is required.' }, { status: 400 });
    }

    const provider = getAiProvider();

    try {
      const result = await provider.generate(message, history);

      return NextResponse.json({
        response: result.text,
        provider: result.provider,
      });
    } catch {
      // Live provider failed — fall back to knowledge base
      if (isLiveProviderConfigured()) {
        const fallback = buildAiResponse(message);
        return NextResponse.json({
          response: fallback.text,
          provider: 'knowledge-fallback',
        });
      }

      return NextResponse.json(
        {
          error: 'AI request failed.',
          response: 'I could not reach the AI service right now. Try again shortly, or continue exploring the site.',
        },
        { status: 502 },
      );
    }
  } catch {
    return NextResponse.json(
      {
        error: 'Unexpected server error.',
        response: 'Something went wrong in the AI layer. Please try again.',
      },
      { status: 500 },
    );
  }
}
