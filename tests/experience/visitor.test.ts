import { describe, it, expect, beforeEach } from 'vitest';

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => { store[key] = value; },
    removeItem: (key: string) => { delete store[key]; },
    clear: () => { store = {}; },
  };
})();

Object.defineProperty(globalThis, 'localStorage', {
  value: localStorageMock,
  writable: true,
});

if (typeof window === 'undefined') {
  Object.defineProperty(globalThis, 'window', {
    value: { location: { pathname: '/' } },
    writable: true,
  });
}

import { getAnalyticsEvents, clearAnalyticsEvents, trackEvent } from '@/lib/analytics';

describe('visitor experience stats', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('returns empty array when no events', () => {
    const events = getAnalyticsEvents();
    expect(events).toEqual([]);
  });

  it('counts page views correctly', () => {
    trackEvent('page_view', { path: '/' });
    trackEvent('page_view', { path: '/about' });
    trackEvent('project_view', { slug: 'aurora' });
    
    const events = getAnalyticsEvents();
    expect(events.length).toBe(3);
    
    const pageViews = events.filter(e => e.name === 'page_view');
    expect(pageViews.length).toBe(2);
  });

  it('counts project views correctly', () => {
    trackEvent('project_view', { slug: 'aurora' });
    trackEvent('project_view', { slug: 'nocturne' });
    
    const events = getAnalyticsEvents();
    const projectViews = events.filter(e => e.name === 'project_view');
    expect(projectViews.length).toBe(2);
  });

  it('counts AI queries correctly', () => {
    trackEvent('ai_query', { intent: 'ABOUT_ICON' });
    trackEvent('ai_query', { intent: 'PROJECT_DISCOVERY' });
    
    const events = getAnalyticsEvents();
    const aiQueries = events.filter(e => e.name === 'ai_query');
    expect(aiQueries.length).toBe(2);
  });

  it('tracks experience preferences', () => {
    trackEvent('experience_preference', { key: 'motion', value: 'off' });
    
    const events = getAnalyticsEvents();
    expect(events[0].name).toBe('experience_preference');
    expect(events[0].data?.key).toBe('motion');
  });
});
