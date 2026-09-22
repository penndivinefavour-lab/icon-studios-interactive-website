'use client';

import React from 'react';
import { getAnalyticsEvents } from '@/lib/analytics';

export function VisitorExperienceStats() {
  const events = getAnalyticsEvents();
  
  const pageViews = events.filter(e => e.name === 'page_view').length;
  const projectViews = events.filter(e => e.name === 'project_view').length;
  const aiQueries = events.filter(e => e.name === 'ai_query').length;
  
  if (events.length === 0) {
    return (
      <div className="rounded-lg border border-border bg-surface p-4 text-center">
        <p className="text-xs text-text-muted">Start exploring to see your activity</p>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-border bg-surface p-4">
      <h4 className="text-xs font-medium uppercase tracking-wide text-text-muted mb-3">Your Activity</h4>
      <div className="grid grid-cols-3 gap-3 text-center">
        <div>
          <p className="text-lg font-semibold text-text-primary">{pageViews}</p>
          <p className="text-xs text-text-muted">Pages</p>
        </div>
        <div>
          <p className="text-lg font-semibold text-text-primary">{projectViews}</p>
          <p className="text-xs text-text-muted">Projects</p>
        </div>
        <div>
          <p className="text-lg font-semibold text-text-primary">{aiQueries}</p>
          <p className="text-xs text-text-muted">AI Chats</p>
        </div>
      </div>
    </div>
  );
}
