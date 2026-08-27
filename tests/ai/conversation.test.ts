import { describe, it } from 'vitest';
import { detectIntent, buildAiResponse, getSuggestedPrompts } from '@/lib/ai/conversation';

describe('AI conversation', () => {
  it('detects ABOUT_ICON intent', () => {
    const result = detectIntent('Tell me about ICON Studios');
    expect(result.intent).toBe('ABOUT_ICON');
  });

  it('detects PROJECT_DISCOVERY intent', () => {
    const result = detectIntent('Show me your projects');
    expect(result.intent).toBe('PROJECT_DISCOVERY');
  });

  it('detects SERVICES intent', () => {
    const result = detectIntent('What services do you offer?');
    expect(result.intent).toBe('SERVICES');
  });

  it('detects CONTACT intent', () => {
    const result = detectIntent('How can I contact you?');
    expect(result.intent).toBe('CONTACT');
  });

  it('detects SITE_TOUR intent', () => {
    const result = detectIntent('Give me a tour');
    expect(result.intent).toBe('SITE_TOUR');
  });

  it('returns UNKNOWN for unknown messages', () => {
    const result = detectIntent('xyzzy unknown');
    expect(result.intent).toBe('UNKNOWN');
  });

  it('returns navigation action for ABOUT_ICON', () => {
    const response = buildAiResponse('about icon');
    expect(response.actions?.[0]?.type).toBe('navigate');
    expect(response.actions?.[0]?.href).toBe('/about');
  });

  it('returns project action for PROJECT_DISCOVERY with keyword', () => {
    const response = buildAiResponse('show me an ai project');
    expect(response.text.length).toBeGreaterThan(0);
    expect(response.actions?.some((action) => action.type === 'navigate' || action.type === 'open_project')).toBe(true);
  });

  it('does not fabricate clients or awards for unknown queries', () => {
    const response = buildAiResponse('random unknown thing about clients');
    expect(response.text).toMatch(/don't have that information|knowledge base/);
    expect(response.text.toLowerCase()).not.toContain('client');
    expect(response.text.toLowerCase()).not.toContain('award');
  });

  it('returns valid routes only', () => {
    const queries = ['about icon', 'projects', 'services', 'contact', 'tour', 'technology stack'];
    for (const query of queries) {
      const response = buildAiResponse(query);
      for (const action of response.actions ?? []) {
        if (action.type === 'navigate') {
          expect(action.href?.startsWith('/')).toBe(true);
        }
      }
    }
  });

  it('suggests prompts for home path', () => {
    const prompts = getSuggestedPrompts('/');
    expect(Array.isArray(prompts)).toBe(true);
    expect(prompts.length).toBeGreaterThan(0);
  });

  it('suggests project-specific prompts on project pages', () => {
    const prompts = getSuggestedPrompts('/projects/aurora');
    expect(Array.isArray(prompts)).toBe(true);
    expect(prompts.some((prompt) => prompt.toLowerCase().includes('project'))).toBe(true);
  });
});
