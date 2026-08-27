export type Intent =
  | 'ABOUT_ICON'
  | 'PROJECT_DISCOVERY'
  | 'PROJECT_DETAILS'
  | 'SERVICES'
  | 'TECHNOLOGY'
  | 'CONTACT'
  | 'SITE_TOUR'
  | 'GENERAL_QUESTION'
  | 'UNKNOWN';

export type AiAction =
  | { type: 'navigate'; href: string }
  | { type: 'open_project'; slug: string }
  | { type: 'start_tour' }
  | { type: 'clear_chat' };

export interface KnowledgeEntry {
  id: string;
  title: string;
  content: string;
  metadata?: Record<string, string>;
}

export interface ActionTool {
  name: string;
  description: string;
  parameters?: Record<string, unknown>;
}

export type ConversationMessage = {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  actions?: AiAction[];
  timestamp: number;
};
