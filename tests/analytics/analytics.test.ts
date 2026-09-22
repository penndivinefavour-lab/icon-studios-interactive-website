import { describe, it, expect, beforeEach } from 'vitest';

// Ensure window is defined BEFORE importing the module
if (typeof window === 'undefined') {
  Object.defineProperty(globalThis, 'window', {
    value: {
      location: { pathname: '/' },
    },
    writable: true,
  });
}

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

// Import after mocks are in place
import { trackEvent, getAnalyticsEvents, clearAnalyticsEvents, trackPageView, trackProjectView, trackAIQuery, trackExperiencePreference } from '@/lib/analytics';

describe('analytics', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('stores events with correct structure', () => {
    trackEvent('test_event', { key: 'value' });
    const events = getAnalyticsEvents();
    expect(events.length).toBe(1);
    expect(events[0].name).toBe('test_event');
    expect(events[0].data).toEqual({ key: 'value' });
  });

  it('clears analytics events', () => {
    trackEvent('test');
    clearAnalyticsEvents();
    expect(getAnalyticsEvents().length).toBe(0);
  });

  it('handles malformed stored data', () => {
    localStorage.setItem('icon-analytics-events', 'invalid-json');
    const events = getAnalyticsEvents();
    expect(events).toEqual([]);
  });

  it('tracks page views', () => {
    trackPageView('/test');
    const events = getAnalyticsEvents();
    expect(events[0].name).toBe('page_view');
    expect(events[0].data?.path).toBe('/test');
  });

  it('tracks project views', () => {
    trackProjectView('aurora');
    const events = getAnalyticsEvents();
    expect(events[0].name).toBe('project_view');
    expect(events[0].data?.slug).toBe('aurora');
  });

  it('tracks AI queries', () => {
    trackAIQuery('ABOUT_ICON');
    const events = getAnalyticsEvents();
    expect(events[0].name).toBe('ai_query');
    expect(events[0].data?.intent).toBe('ABOUT_ICON');
  });

  it('tracks experience preferences', () => {
    trackExperiencePreference('motion', true);
    const events = getAnalyticsEvents();
    expect(events[0].name).toBe('experience_preference');
    expect(events[0].data?.key).toBe('motion');
  });
});
