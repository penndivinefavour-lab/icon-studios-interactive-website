// Privacy-conscious analytics helper
// Tracks only anonymous, non-identifying usage data via localStorage

export type AnalyticsEvent = {
  name: string;
  timestamp: number;
  path: string;
  data?: Record<string, string | number | boolean>;
};

const STORAGE_KEY = 'icon-analytics-events';
const MAX_EVENTS = 100;

export function trackEvent(name: string, data?: Record<string, string | number | boolean>): void {
  if (typeof window === 'undefined') return;
  
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    const events: AnalyticsEvent[] = stored ? JSON.parse(stored) : [];
    
    events.push({
      name,
      timestamp: Date.now(),
      path: window.location.pathname,
      data,
    });
    
    // Keep only the most recent events
    const trimmed = events.slice(-MAX_EVENTS);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed));
  } catch {
    // Storage full or unavailable — fail silently
  }
}

export function getAnalyticsEvents(): AnalyticsEvent[] {
  if (typeof window === 'undefined') return [];
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

export function clearAnalyticsEvents(): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // Ignore
  }
}

// Common event helpers
export function trackPageView(path: string): void {
  trackEvent('page_view', { path });
}

export function trackProjectView(slug: string): void {
  trackEvent('project_view', { slug });
}

export function trackAIQuery(intent: string): void {
  trackEvent('ai_query', { intent });
}

export function trackContactSubmit(method: string): void {
  trackEvent('contact_submit', { method });
}

export function trackExperiencePreference(key: string, value: boolean): void {
  trackEvent('experience_preference', { key, value: value ? 'on' : 'off' });
}
