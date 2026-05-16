/**
 * CHAT STORE — Zustand
 * Powers the Uzo / OzoneAI floating chat bubble.
 * Structured so a real streaming API can be wired in with minimal changes.
 */

import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

// ─── Types ────────────────────────────────────────────────────────────────────

export type MessageRole = 'user' | 'ai';

export interface ChatMessage {
  id:        string;
  role:      MessageRole;
  content:   string;
  timestamp: Date;
  isPartial?: boolean;
}

export interface ConversationTurn {
  role:    'user' | 'model';
  content: string;
}

interface ChatState {
  messages:   ChatMessage[];
  history:    ConversationTurn[];
  isStreaming: boolean;
  isOpen:     boolean;
  hasOpened:  boolean;

  addMessage:       (role: MessageRole, content: string) => string;
  appendToMessage:  (id: string, chunk: string) => void;
  finalizeMessage:  (id: string) => void;
  setStreaming:     (streaming: boolean) => void;
  addToHistory:     (role: 'user' | 'model', content: string) => void;
  setOpen:          (open: boolean) => void;
}

// ─── Greeting message ─────────────────────────────────────────────────────────

const GREETING: ChatMessage = {
  id:        'greeting',
  role:      'ai',
  content:   "Hi — I'm Uzo. Ask me about our services, tech stack, or how we can help your business.",
  timestamp: new Date(),
};

// ─── Store ────────────────────────────────────────────────────────────────────

export const useChatStore = create<ChatState>()(
  devtools(
    (set) => ({
      messages:    [GREETING],
      history:     [],
      isStreaming:  false,
      isOpen:      false,
      hasOpened:   false,

      addMessage: (role, content) => {
        const id = `msg_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
        set((state) => ({
          messages: [
            ...state.messages,
            { id, role, content, timestamp: new Date(), isPartial: role === 'ai' },
          ],
        }));
        return id;
      },

      appendToMessage: (id, chunk) => {
        set((state) => ({
          messages: state.messages.map((msg) =>
            msg.id === id
              ? { ...msg, content: msg.content + chunk, isPartial: true }
              : msg
          ),
        }));
      },

      finalizeMessage: (id) => {
        set((state) => ({
          messages: state.messages.map((msg) =>
            msg.id === id ? { ...msg, isPartial: false } : msg
          ),
        }));
      },

      setStreaming: (streaming) => set({ isStreaming: streaming }),

      addToHistory: (role, content) => {
        set((state) => ({
          history: [...state.history.slice(-39), { role, content }],
        }));
      },

      setOpen: (open) => set((state) => ({
        isOpen:    open,
        hasOpened: open ? true : state.hasOpened,
      })),
    }),
    { name: 'UzoChat' }
  )
);