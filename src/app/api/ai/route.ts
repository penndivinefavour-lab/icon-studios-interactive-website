import { NextRequest, NextResponse } from 'next/server';
import { iconKnowledge, projectKnowledge, serviceKnowledge, actionTools } from '@/lib/ai/knowledge';

export const maxDuration = 30;

interface KnowledgeEntry {
  content: string;
  metadata?: Record<string, string>;
  title?: string;
}

interface ToolDefinition {
  name: string;
  description: string;
  parameters?: Record<string, unknown>;
}

function buildSystemContext(userMessage: string) {
  const relevantProjects = searchKnowledge(userMessage, projectKnowledge as KnowledgeEntry[]);
  const relevantServices = searchKnowledge(userMessage, serviceKnowledge as KnowledgeEntry[]);

  const sections = [
    '# ICON STUDIOS KNOWLEDGE BASE',
    ...iconKnowledge.map((entry) => `## ${entry.title}\n${entry.content}`),
    ...(relevantProjects.length
      ? [
          '\n# RELEVANT PROJECTS',
          ...relevantProjects.map(
            (entry) => `## ${entry.title}\n${entry.content}\nMetadata: ${JSON.stringify(entry.metadata)}`
          ),
        ]
      : []),
    ...(relevantServices.length
      ? [
          '\n# RELEVANT SERVICES',
          ...relevantServices.map(
            (entry) => `## ${entry.title}\n${entry.content}\nMetadata: ${JSON.stringify(entry.metadata)}`
          ),
        ]
      : []),
    '\n# AVAILABLE ACTIONS',
    ...(actionTools as ToolDefinition[]).map((tool) => `- ${tool.name}: ${tool.description}`),
    '\n# BEHAVIOR RULES',
    '- Only use information from the knowledge base.',
    '- If information is unavailable, say so honestly.',
    '- Prefer concise, useful responses.',
    '- When the visitor asks for projects/services/sections, provide a contextual action when helpful.',
  ];

  return sections.join('\n\n');
}

function searchKnowledge(query: string, entries: KnowledgeEntry[]) {
  const terms = query.toLowerCase().split(/\s+/).filter(Boolean);
  const scored = entries.map((entry) => {
    const text = `${entry.content} ${JSON.stringify(entry.metadata ?? {})}`.toLowerCase();
    const matches = terms.filter((term) => text.includes(term)).length;
    return { entry, score: matches };
  });
  return scored
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 4)
    .map((item) => item.entry);
}

function buildKnowledgeResponse(userMessage: string) {
  const text = userMessage.toLowerCase();

  if (/tour|guide|walk/.test(text)) {
    return {
      response:
        'I can guide you through the site: introduction, selected work, capabilities, experience, services, and contact.',
      actions: [{ type: 'start_tour' }],
    };
  }

  if (/about|who are you|what is icon/.test(text)) {
    const entry = iconKnowledge.find((item) => item.id === 'identity');
    return {
      response: entry?.content ?? 'ICON Studios builds intelligent digital products, AI systems, automation, and creative technology.',
      actions: [{ type: 'navigate', href: '/about' }],
    };
  }

  if (/project/.test(text)) {
    return {
      response: 'ICON Studios works across AI, creative, automation, and platform projects. Here are a few starting points.',
      actions: [{ type: 'navigate', href: '/projects' }],
    };
  }

  if (/service|capability/.test(text)) {
    return {
      response: 'ICON Studios provides services across AI, automation, creative, and platform work.',
      actions: [{ type: 'navigate', href: '/services' }],
    };
  }

  if (/contact|hire/.test(text)) {
    return {
      response: 'You can reach ICON Studios through the contact page.',
      actions: [{ type: 'navigate', href: '/contact' }],
    };
  }

  if (/technology|stack/.test(text)) {
    return {
      response: 'ICON Studios uses modern web, AI, and automation tooling.',
      actions: [{ type: 'navigate', href: '/projects' }],
    };
  }

  return {
    response: "I don't have that information in the ICON Studios knowledge base yet. I can help with projects, services, the studio background, or a guided tour.",
    actions: [{ type: 'navigate', href: '/projects' }],
  };
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const message = typeof body?.message === 'string' ? body.message.trim() : '';
    const history = Array.isArray(body?.history) ? body.history : [];

    if (!message) {
      return NextResponse.json({ error: 'Message is required.' }, { status: 400 });
    }

    const apiKey = process.env.AI_API_KEY;
    const apiUrl = process.env.AI_API_URL;
    const useLiveProvider = Boolean(apiKey && apiUrl);

    if (!useLiveProvider) {
      const knowledgeResponse = buildKnowledgeResponse(message);
      return NextResponse.json({
        response: knowledgeResponse.response,
        actions: knowledgeResponse.actions,
        provider: 'knowledge-fallback',
      });
    }

    const systemContext = buildSystemContext(message);

    const payload = {
      model: process.env.AI_MODEL || 'meta-llama/llama-4-maverick:free',
      messages: [
        { role: 'system', content: systemContext },
        ...history.slice(-8),
        { role: 'user', content: message },
      ],
      temperature: 0.4,
      max_tokens: 512,
    };

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 25_000);

    let response: Response;
    try {
      response = await fetchWithTimeout(apiUrl as string, payload, apiKey, controller);
      clearTimeout(timeout);

      if (!response.ok) {
        const parsed = await response.json().catch(() => ({} as Record<string, unknown>));
        const detail = (parsed['error'] as Record<string, unknown> | undefined)?.['message'] || response.statusText || 'Unknown provider error.';
        return NextResponse.json(
          {
            error: `Provider error: ${detail}`,
            response: 'The AI layer is temporarily unavailable. You can still browse the site directly.',
          },
          { status: 502 }
        );
      }
    } catch {
      clearTimeout(timeout);
      return NextResponse.json(
        {
          error: 'AI request failed.',
          response: 'I could not reach the AI service right now. Try again shortly, or continue exploring the site.',
        },
        { status: 502 }
      );
    }

    const data = (await response.json()) as Record<string, unknown>;
    const choice = (data?.choices as Array<Record<string, unknown>> | undefined)?.[0];
    const content = (choice?.message as Record<string, unknown> | undefined)?.['content'];
    if (typeof content !== 'string' || !content.trim()) {
      return NextResponse.json(
        {
          error: 'Empty model response.',
          response: 'I have no answer for that right now. Try rephrasing, or ask about projects, services, or the studio.',
        },
        { status: 502 }
      );
    }

    return NextResponse.json({ response: content.trim() });
  } catch {
    return NextResponse.json(
      {
        error: 'Unexpected server error.',
        response: 'Something went wrong in the AI layer. Please try again.',
      },
      { status: 500 }
    );
  }
}

async function fetchWithTimeout(
  apiUrl: string,
  payload: Record<string, unknown>,
  apiKey: string | undefined,
  controller: AbortController
) {
  return fetch(apiUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify(payload),
    signal: controller.signal,
  });
}
