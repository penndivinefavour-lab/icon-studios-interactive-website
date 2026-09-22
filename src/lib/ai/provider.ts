// Production-capable AI provider abstraction
// Supports a live OpenRouter-compatible endpoint with local knowledge fallback.

import { buildAiResponse } from './conversation';

export type AiProviderResponse = {
  text: string;
  provider: string;
  error?: string;
};

export interface AiProvider {
  generate(
    message: string,
    history: { role: string; content: string }[],
  ): Promise<AiProviderResponse>;
}

function getLiveProvider(): AiProvider | null {
  const apiKey = process.env.AI_API_KEY;
  const apiUrl = process.env.AI_API_URL;

  if (!apiKey || !apiUrl) return null;

  return {
    async generate(message, history) {
      const systemContext = buildSystemContext();
      const model = process.env.AI_MODEL || 'meta-llama/llama-4-maverick:free';
      const maxTokens = parseInt(process.env.AI_MAX_TOKENS || '512', 10);

      const payload = {
        model,
        messages: [
          { role: 'system', content: systemContext },
          ...history.slice(-8),
          { role: 'user', content: message },
        ],
        temperature: 0.4,
        max_tokens: maxTokens,
      };

      const controller = new AbortController();
      const timeoutMs = parseInt(process.env.AI_TIMEOUT_MS || '25000', 10);
      const timeout = setTimeout(() => controller.abort(), timeoutMs);

      try {
        const response = await fetch(apiUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${apiKey}`,
          },
          body: JSON.stringify(payload),
          signal: controller.signal,
        });

        clearTimeout(timeout);

        if (!response.ok) {
          const parsed = await response.json().catch(() => ({} as Record<string, unknown>));
          const detail =
            (parsed?.['error'] as Record<string, unknown> | undefined)?.['message'] ||
            response.statusText ||
            'Unknown provider error.';
          throw new Error(`Provider error: ${detail}`);
        }

        const data = (await response.json()) as Record<string, unknown>;
        const choice = (data?.choices as Array<Record<string, unknown>> | undefined)?.[0];
        const content = (choice?.message as Record<string, unknown> | undefined)?.['content'];

        if (typeof content !== 'string' || !content.trim()) {
          throw new Error('Empty model response.');
        }

        return { text: content.trim(), provider: 'openrouter' };
      } catch (error) {
        clearTimeout(timeout);
        throw error;
      }
    },
  };
}

function buildSystemContext(): string {
  const sections = [
    '# ICON STUDIOS',
    'You are the AI guide for ICON Studios. ICON Studios builds intelligent digital products, AI systems, automation, and creative technology. Contact: WhatsApp +237 672 536 260, email iconstudiosyde@gmail.com.',
    '',
    '# BEHAVIOR RULES',
    '- Only use information from the knowledge base provided by the system.',
    '- If information is unavailable, say so honestly.',
    '- Never fabricate clients, revenue, awards, or metrics.',
    '- Prefer concise, useful responses.',
    '- Stay focused on ICON Studios: projects, services, philosophy, contact.',
  ];

  return sections.join('\n');
}

export function getAiProvider(): AiProvider {
  return getLiveProvider() || getKnowledgeFallbackProvider();
}

export function isLiveProviderConfigured(): boolean {
  return Boolean(process.env.AI_API_KEY && process.env.AI_API_URL);
}

// Simple deterministic fallback provider (unchanged behavior)
function getKnowledgeFallbackProvider(): AiProvider {
  return {
    async generate(message) {
      const response = buildAiResponse(message);
      return {
        text: response.text,
        provider: 'knowledge-fallback',
      };
    },
  };
}
