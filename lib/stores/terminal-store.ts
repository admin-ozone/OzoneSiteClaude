/**
 * TERMINAL STORE — Zustand
 * ─────────────────────────────────────────────────────────────────────────────
 * Global state for the Ozone Terminal component.
 * Zustand is chosen over Context here because:
 * - Terminal state is accessed by 3+ sibling components
 * - Avoids prop drilling through OzoneTerminal → TerminalOutput → TerminalLine
 * - Selective subscriptions prevent unnecessary re-renders of the input
 *   component when only the output lines update (and vice versa)
 * ─────────────────────────────────────────────────────────────────────────────
 */

import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

// ─── Types ────────────────────────────────────────────────────────────────────

export type LineType =
  | 'input'      // User-typed command (green prefix)
  | 'output'     // Regular output text
  | 'stream'     // Actively streaming LLM token
  | 'error'      // Error messages (red)
  | 'system'     // System messages (muted)
  | 'command';   // Special command output (formatted)

export interface TerminalLine {
  id:        string;
  type:      LineType;
  content:   string;
  timestamp: Date;
  isPartial?: boolean; // True while line is being streamed
}

export interface ConversationTurn {
  role:    'user' | 'model';
  content: string;
}

interface TerminalState {
  // Output lines displayed in the terminal
  lines: TerminalLine[];
  // Conversation history sent to the LLM for context
  history: ConversationTurn[];
  // Is the terminal currently waiting for an LLM response?
  isStreaming: boolean;
  // Has the terminal been initialized with the boot sequence?
  isBooted: boolean;
  // The ID of the currently streaming line (for in-place updates)
  streamingLineId: string | null;

  // Actions
  addLine:          (type: LineType, content: string) => string;
  appendToLine:     (id: string, chunk: string) => void;
  finalizeStream:   (id: string) => void;
  setStreaming:     (streaming: boolean) => void;
  addToHistory:     (role: 'user' | 'model', content: string) => void;
  clearTerminal:    () => void;
  setBooted:        (booted: boolean) => void;
  setStreamingLine: (id: string | null) => void;
}

// ─── Store ────────────────────────────────────────────────────────────────────

export const useTerminalStore = create<TerminalState>()(
  devtools(
    (set, get) => ({
      lines:           [],
      history:         [],
      isStreaming:     false,
      isBooted:        false,
      streamingLineId: null,

      addLine: (type, content) => {
        const id = `line_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
        set((state) => ({
          lines: [
            ...state.lines,
            { id, type, content, timestamp: new Date(), isPartial: type === 'stream' },
          ],
        }));
        return id;
      },

      appendToLine: (id, chunk) => {
        set((state) => ({
          lines: state.lines.map((line) =>
            line.id === id
              ? { ...line, content: line.content + chunk, isPartial: true }
              : line
          ),
        }));
      },

      finalizeStream: (id) => {
        set((state) => ({
          lines: state.lines.map((line) =>
            line.id === id ? { ...line, isPartial: false, type: 'output' } : line
          ),
        }));
      },

      setStreaming: (streaming) => set({ isStreaming: streaming }),

      addToHistory: (role, content) => {
        set((state) => ({
          // Keep max 20 turns to prevent context overflow
          history: [...state.history.slice(-39), { role, content }],
        }));
      },

      clearTerminal: () => {
        set({ lines: [] });
        // Re-add the prompt after clearing
        get().addLine('system', 'Terminal cleared. Type help for commands.');
      },

      setBooted:        (booted) => set({ isBooted: booted }),
      setStreamingLine: (id)     => set({ streamingLineId: id }),
    }),
    { name: 'OzoneTerminal' }
  )
);