'use client';

import React, { useState, useRef, useEffect, useId, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from '@/components/ui/Button';
import type { ConversationMessage, AiAction } from '@/lib/ai/schema';
import { createConversationService } from '@/lib/ai/conversation';
import type { AvatarState } from '@/lib/ai/avatar-state';
import { speechToTextProvider } from '@/lib/ai/speech-to-text';
import { textToSpeechProvider } from '@/lib/ai/text-to-speech';
import { Avatar } from '@/components/ai/Avatar';

type AiChatProps = {
  initialContext?: {
    currentPath?: string;
    currentProjectSlug?: string;
  };
};

const generateId = () => `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;

const welcomeMessage: ConversationMessage = {
  id: 'welcome',
  role: 'assistant',
  text: 'Ask me anything about ICON Studios — projects, services, or how I can guide you.',
  timestamp: Date.now(),
};

function getActionLabel(action: AiAction): string {
  if (action.type === 'navigate') {
    const safeHref = action.href ?? '/';
    return new URL(safeHref, 'http://localhost').pathname.replace(/^\//, '').replace(/\/$/, '') || 'Go';
  }
  if (action.type === 'open_project') {
    return `Open ${action.slug}`;
  }
  if (action.type === 'start_tour') {
    return 'Start tour';
  }
  return action.type;
}

const hasVoiceSupport = () => {
  if (typeof window === 'undefined') return false;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const w = window as any;
  return (
    typeof w.SpeechRecognition !== 'undefined' ||
    typeof w.webkitSpeechRecognition !== 'undefined'
  ) && typeof window.speechSynthesis !== 'undefined';
};

export const AiChat = ({ initialContext }: AiChatProps) => {
  const inputId = useId();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ConversationMessage[]>([welcomeMessage]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [avatarState, setAvatarState] = useState<AvatarState>('idle');
  const [voiceReady] = useState(() => hasVoiceSupport());
  const listRef = useRef<HTMLDivElement>(null);
  const conversationService = createConversationService();

  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, [messages, open]);

  useEffect(() => {
    if (!voiceReady) return;
    const handleResult = (result: { text: string; isFinal: boolean }) => {
      if (result.isFinal && result.text.trim()) {
        setAvatarState('thinking');
      }
    };
    speechToTextProvider.onResult(handleResult);
    return () => {
      speechToTextProvider.stopListening();
    };
  }, [voiceReady]);

  useEffect(() => {
    if (!voiceReady) return;
    const end = () => {
      if (avatarState === 'speaking') {
        setAvatarState('idle');
      }
    };
    textToSpeechProvider.onEnd(end);
    return () => {
      textToSpeechProvider.stop();
    };
  }, [avatarState, voiceReady]);

  const speak = useCallback((text: string) => {
    if (!voiceReady) return;
    textToSpeechProvider.stop();
    setAvatarState('speaking');
    textToSpeechProvider.speak(text);
  }, [voiceReady]);

  const handleSend = async (text?: string) => {
    const message = (text ?? input).trim();
    if (!message || loading) return;

    const userMessage: ConversationMessage = {
      id: generateId(),
      role: 'user',
      text: message,
      timestamp: Date.now(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);
    setError(null);
    setAvatarState('thinking');

    try {
      const response = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message,
          history: messages.map((msg) => ({ role: msg.role, content: msg.text })),
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data?.error || 'AI request failed');
      }

      const assistantMessage: ConversationMessage = {
        id: generateId(),
        role: 'assistant',
        text: data.response,
        actions: data.actions,
        timestamp: Date.now(),
      };
      setMessages((prev) => [...prev, assistantMessage]);
      setAvatarState('speaking');
      speak(data.response);
    } catch (err) {
      const messageText = err instanceof Error ? err.message : 'Unknown error';
      setError(messageText);
      setAvatarState('error');
      const fallback = conversationService.buildAiResponse(messageText, initialContext);
      const assistantMessage: ConversationMessage = {
        id: generateId(),
        role: 'assistant',
        text: fallback.text,
        actions: fallback.actions,
        timestamp: Date.now(),
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handleAction = (action: AiAction) => {
    if (action.type === 'navigate') {
      const href = action.href ?? '/';
      if (href.startsWith('http://') || href.startsWith('https://')) {
        window.location.assign(href);
      } else {
        router.push(href);
      }
      setAvatarState('guiding');
      return;
    }
    if (action.type === 'open_project') {
      router.push(`/projects/${action.slug}`);
      setAvatarState('guiding');
      return;
    }
    if (action.type === 'start_tour') {
      setMessages((prev) => [
        ...prev,
        {
          id: generateId(),
          role: 'assistant',
          text: 'Tour starting: introduction → selected work → capabilities → experience → services → contact.',
          actions: [
            { type: 'navigate', href: '/about' },
            { type: 'navigate', href: '/projects' },
            { type: 'navigate', href: '/services' },
            { type: 'navigate', href: '/experience' },
            { type: 'navigate', href: '/contact' },
          ],
          timestamp: Date.now(),
        },
      ]);
      setAvatarState('guiding');
      return;
    }
    if (action.type === 'clear_chat') {
      setMessages((prev) =>
        prev.map((message) =>
          message.id === 'welcome'
            ? { ...message, text: 'Conversation cleared. How can I help you next?', timestamp: Date.now() }
            : message
        )
      );
      setAvatarState('idle');
    }
  };

  const handleVoiceToggle = () => {
    if (!voiceReady) return;
    if (speechToTextProvider.isListening) {
      speechToTextProvider.stopListening();
      setAvatarState('idle');
    } else {
      textToSpeechProvider.stop();
      speechToTextProvider.startListening();
      setAvatarState('listening');
    }
  };

  const handleStopSpeaking = () => {
    if (avatarState === 'speaking') {
      textToSpeechProvider.stop();
      setAvatarState('idle');
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col items-end gap-2">
      <AnimatePresence>
        {open ? (
          <motion.div
            initial={{ opacity: 0, y: 12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.98 }}
            transition={{ duration: 0.35, ease: [0.25, 0.1, 0.25, 1] }}
            className="w-[min(92vw,420px)] rounded-2xl border border-border bg-surface shadow-lg"
          >
            <div className="flex items-center justify-between px-4 py-3">
              <div>
                <p className="text-sm font-semibold text-text-primary">Ask ICON</p>
                <p className="text-xs text-text-muted">Powered by ICON Studios knowledge</p>
              </div>
              <div className="flex items-center gap-2">
                {voiceReady ? (
                  <>
                    <button
                      type="button"
                      aria-label={speechToTextProvider.isListening ? 'Stop listening' : 'Start listening'}
                      className={`h-8 w-8 rounded-full border text-xs ${
                        speechToTextProvider.isListening
                          ? 'border-accent bg-accent text-accent-foreground'
                          : 'border-border text-text-secondary hover:bg-background'
                      }`}
                      onClick={handleVoiceToggle}
                    >
                      {speechToTextProvider.isListening ? '■' : '🎤'}
                    </button>
                    {avatarState === 'speaking' && (
                      <button
                        type="button"
                        aria-label="Stop speaking"
                        className="h-8 w-8 rounded-full border border-border text-xs text-text-secondary hover:bg-background"
                        onClick={handleStopSpeaking}
                      >
                        ■
                      </button>
                    )}
                  </>
                ) : (
                  <span className="text-xs text-text-muted">Voice unavailable</span>
                )}
                <Button variant="ghost" size="sm" onClick={() => handleAction({ type: 'clear_chat' })}>
                  Clear
                </Button>
                <Button variant="ghost" size="sm" onClick={() => setOpen(false)}>
                  Close
                </Button>
              </div>
            </div>
            <div className="flex justify-center px-4 py-4">
              <Avatar state={avatarState} />
            </div>
            <div ref={listRef} className="max-h-[50vh] space-y-3 overflow-y-auto px-4 py-3">
              {messages.map((message) => (
                <div key={message.id} className="space-y-2">
                  <div
                    className={`text-sm ${
                      message.role === 'user' ? 'text-right text-text-primary' : 'text-left text-text-secondary'
                    }`}
                  >
                    <span className="inline-block rounded-xl bg-background px-3 py-2">{message.text}</span>
                  </div>
                  {message.actions?.length ? (
                    <div className="flex flex-wrap gap-2">
                      {message.actions.map((action) => {
                        const label = getActionLabel(action);
                        return (
                          <Button key={`${message.id}-${action.type}-${action.type === 'navigate' ? action.href : action.type === 'open_project' ? action.slug : 'tour'}`} size="sm" variant="secondary" onClick={() => handleAction(action)}>
                            {label}
                          </Button>
                        );
                      })}
                    </div>
                  ) : null}
                </div>
              ))}
              {loading ? <p className="text-xs text-text-muted">Thinking...</p> : null}
              {error ? <p className="text-xs text-error">Error: {error}</p> : null}
            </div>
            <div className="border-t border-border px-4 py-3">
              <form
                onSubmit={(event) => {
                  event.preventDefault();
                  handleSend();
                }}
                className="flex items-center gap-2"
              >
                <input
                  id={inputId}
                  value={input}
                  onChange={(event) => setInput(event.target.value)}
                  placeholder="Ask ICON..."
                  className="h-9 w-full rounded-full border border-border bg-background px-3 text-sm outline-none focus-visible:shadow-focus"
                />
                <Button type="submit" size="sm" disabled={loading}>
                  Send
                </Button>
              </form>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
      {!open ? (
        <Button onClick={() => setOpen(true)} className="shadow-md">
          Ask ICON
        </Button>
      ) : null}
    </div>
  );
};
