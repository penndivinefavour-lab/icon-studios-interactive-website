import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import type { NextRequest } from 'next/server';
import { buildAiResponse, detectIntent, getSuggestedPrompts } from '@/lib/ai/conversation';
import { iconKnowledge, projectKnowledge, serviceKnowledge } from '@/lib/ai/knowledge';

const originalEnv = process.env;

beforeEach(() => {
  process.env = { ...originalEnv };
  delete process.env.AI_API_KEY;
  delete process.env.AI_API_URL;
  vi.restoreAllMocks();
});

afterEach(() => {
  process.env = originalEnv;
});

describe('AI production layer', () => {
  describe('provider selection', () => {
    it('uses fallback when no credentials configured', async () => {
      const { getAiProvider, isLiveProviderConfigured } = await import('@/lib/ai/provider');
      
      expect(isLiveProviderConfigured()).toBe(false);
      
      const provider = getAiProvider();
      const result = await provider.generate('hello', []);
      
      expect(result.provider).toBe('knowledge-fallback');
      expect(result.text.length).toBeGreaterThan(0);
    });

    it('detects live provider configuration', async () => {
      process.env.AI_API_KEY = 'sk-test-123';
      process.env.AI_API_URL = 'https://openrouter.ai/api/v1/chat/completions';
      
      const { isLiveProviderConfigured } = await import('@/lib/ai/provider');
      expect(isLiveProviderConfigured()).toBe(true);
    });
  });

  describe('fallback behavior', () => {
    it('falls back to knowledge response on provider error', async () => {
      process.env.AI_API_KEY = 'sk-invalid';
      process.env.AI_API_URL = 'https://non-existent-provider.example.com/api';
      
      const { getAiProvider } = await import('@/lib/ai/provider');
      const provider = getAiProvider();
      
      // This should throw (network error) and we catch it
      let threw = false;
      try {
        await provider.generate('what is ICON Studios', []);
      } catch {
        threw = true;
      }
      expect(threw).toBe(true);

      // But the API route should fall back gracefully
      const { POST } = await import('@/app/api/ai/route');
      const request = new Request('http://localhost/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: 'what is ICON Studios' }),
      });
      const response = await POST(request as unknown as NextRequest);
      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data.provider).toBe('knowledge-fallback');
      expect(data.response.length).toBeGreaterThan(0);
    });
  });

  describe('ICON Studios knowledge integrity', () => {
    it('contains identity knowledge', () => {
      const identity = iconKnowledge.find(k => k.id === 'identity');
      expect(identity).toBeDefined();
      expect(identity?.content).toContain('ICON Studios');
    });

    it('contains all projects in knowledge base', () => {
      const projectIds = projectKnowledge.map(p => p.id);
      expect(projectIds).toContain('project-aurora');
      expect(projectIds).toContain('project-nocturne');
      expect(projectIds).toContain('project-helix');
    });

    it('contains all services in knowledge base', () => {
      const serviceIds = serviceKnowledge.map(s => s.id);
      expect(serviceIds).toContain('service-ai-systems');
      expect(serviceIds).toContain('service-creative-technology');
    });
  });

  describe('truthfulness protections', () => {
    it('does not fabricate information for unknown queries', () => {
      const response = buildAiResponse('what is the revenue of ICON Studios');
      expect(response.text.toLowerCase()).not.toContain('revenue');
      expect(response.text.toLowerCase()).not.toContain('$');
    });

    it('provides honest response for unknown question', () => {
      const response = buildAiResponse('xyz completely unknown query');
      expect(response.text).toContain("don't have that information");
    });
  });

  describe('controlled actions', () => {
    it('provides valid routes for navigation actions', () => {
      const response = buildAiResponse('show me about');
      for (const action of response.actions ?? []) {
        if (action.type === 'navigate') {
          expect(action.href?.startsWith('/')).toBe(true);
        }
      }
    });

    it('provides valid project slugs for open_project actions', () => {
      const response = buildAiResponse('show me the aurora project');
      for (const action of response.actions ?? []) {
        if (action.type === 'open_project') {
          expect(['aurora', 'nocturne', 'helix']).toContain(action.slug);
        }
      }
    });
  });

  describe('intent detection', () => {
    it('detects ABOUT_ICON intent', () => {
      const result = detectIntent('Tell me about ICON Studios');
      expect(result.intent).toBe('ABOUT_ICON');
    });

    it('detects CONTACT intent', () => {
      const result = detectIntent('How can I contact you?');
      expect(result.intent).toBe('CONTACT');
    });

    it('detects SITE_TOUR intent', () => {
      const result = detectIntent('Give me a tour');
      expect(result.intent).toBe('SITE_TOUR');
    });

    it('returns UNKNOWN for unrecognized input', () => {
      const result = detectIntent('xyzzy');
      expect(result.intent).toBe('UNKNOWN');
    });
  });

  describe('suggested prompts', () => {
    it('returns project-specific prompts on project pages', () => {
      const prompts = getSuggestedPrompts('/projects/aurora');
      expect(prompts.some(p => p.toLowerCase().includes('project'))).toBe(true);
    });

    it('returns general prompts for home page', () => {
      const prompts = getSuggestedPrompts('/');
      expect(prompts.length).toBeGreaterThan(0);
    });
  });
});
