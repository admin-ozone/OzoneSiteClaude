'use client';

import { useEffect, useCallback } from 'react';
import { useTerminalStore } from '@/lib/stores/terminal-store';
import { TerminalOutput } from './TerminalOutput';
import { TerminalInput } from './TerminalInput';
import { cn } from '@/lib/utils';

// ─── Boot Sequence ────────────────────────────────────────────────────────────
// Displayed once when the terminal mounts. Simulates system initialisation.

const BOOT_LINES: Array<{ text: string; delay: number; type: 'system' | 'output' | 'command' }> = [
  { text: 'OzoneOS v1.0.0 initialising…',          delay: 0,    type: 'system' },
  { text: 'Loading core modules…',                   delay: 320,  type: 'system' },
  { text: '  [✓] gemini-2.0-flash-lite connected',  delay: 580,  type: 'output' },
  { text: '  [✓] groq/llama-3.1-8b-instant (fb)',   delay: 760,  type: 'output' },
  { text: '  [✓] knowledge base loaded',            delay: 940,  type: 'output' },
  { text: '',                                        delay: 1100, type: 'system' },
  { text: 'Ready. Type help to see commands.',       delay: 1200, type: 'system' },
];

// ─── SSE Stream Handler ───────────────────────────────────────────────────────

async function streamAssistant(
  message: string,
  history: Array<{ role: 'user' | 'model'; content: string }>,
  onChunk: (chunk: string) => void,
  onDone: () => void,
  onError: (msg: string) => void
) {
  const res = await fetch('/api/assistant', {
    method:  'POST',
    headers: { 'Content-Type': 'application/json' },
    body:    JSON.stringify({ message, history }),
  });

  if (!res.ok) {
    onError(`API error: ${res.status}`);
    return;
  }

  const reader = res.body?.getReader();
  if (!reader) { onError('No response body'); return; }

  const decoder = new TextDecoder();
  let   buffer  = '';

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const parts = buffer.split('\n\n');
    buffer = parts.pop() ?? '';

    for (const part of parts) {
      const line = part.trim();
      if (!line.startsWith('data:')) continue;

      const raw = line.slice(5).trim();
      if (raw === '[DONE]') { onDone(); return; }

      try {
        const parsed = JSON.parse(raw);
        if (parsed.chunk) onChunk(parsed.chunk);
        if (parsed.done)  { onDone(); return; }
        if (parsed.error) { onError(parsed.error); return; }
      } catch {
        // Malformed SSE line — skip
      }
    }
  }

  onDone();
}

// ─── Component ────────────────────────────────────────────────────────────────

interface OzoneTerminalProps {
  className?: string;
  compact?:   boolean; // Smaller variant for embedding
}

export function OzoneTerminal({ className, compact = false }: OzoneTerminalProps) {
  const {
    isBooted,
    isStreaming,
    history,
    addLine,
    appendToLine,
    finalizeStream,
    setStreaming,
    addToHistory,
    clearTerminal,
    setBooted,
    setStreamingLine,
  } = useTerminalStore();

  // ── Boot sequence (runs once on mount) ──────────────────────────────────
  useEffect(() => {
    if (isBooted) return;

    const timers: ReturnType<typeof setTimeout>[] = [];

    BOOT_LINES.forEach(({ text, delay, type }) => {
      timers.push(
        setTimeout(() => {
          addLine(type, text);
        }, delay)
      );
    });

    timers.push(
      setTimeout(() => setBooted(true), BOOT_LINES.at(-1)!.delay + 100)
    );

    return () => timers.forEach(clearTimeout);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Handle submission ────────────────────────────────────────────────────
  const handleSubmit = useCallback(
    async (input: string) => {
      const cmd = input.trim();
      if (!cmd) return;

      // Handle clear command locally
      if (cmd.toLowerCase() === 'clear') {
        clearTerminal();
        return;
      }

      // Echo user input
      addLine('input', cmd);

      setStreaming(true);

      // Start a streaming output line
      const lineId = addLine('stream', '');
      setStreamingLine(lineId);

      let fullResponse = '';

      await streamAssistant(
        cmd,
        history,
        (chunk) => {
          fullResponse += chunk;
          appendToLine(lineId, chunk);
        },
        () => {
          finalizeStream(lineId);
          setStreamingLine(null);
          setStreaming(false);
          if (fullResponse) {
            addToHistory('user',  cmd);
            addToHistory('model', fullResponse);
          }
        },
        (errMsg) => {
          finalizeStream(lineId);
          setStreamingLine(null);
          setStreaming(false);
          addLine('error', `Error: ${errMsg}`);
        }
      );
    },
    [
      history,
      addLine,
      appendToLine,
      finalizeStream,
      setStreaming,
      addToHistory,
      clearTerminal,
      setStreamingLine,
    ]
  );

  return (
    <div
      className={cn(
        // Shell
        'flex flex-col bg-oz-black-2 border border-oz-border rounded-sm overflow-hidden',
        // CRT effect
        'crt-scanlines',
        // Glow on the whole terminal
        'shadow-[0_0_0_1px_rgba(0,229,255,0.06),0_0_60px_rgba(0,229,255,0.04),0_32px_64px_rgba(0,0,0,0.6)]',
        compact ? 'h-72' : 'h-[480px]',
        className
      )}
      // Clicking anywhere in the terminal focuses the input
      onClick={() => {
        const input = document.querySelector<HTMLInputElement>('[data-terminal-input]');
        input?.focus();
      }}
    >
      {/* Title bar */}
      <div className="shrink-0 flex items-center gap-3 px-4 py-2.5 border-b border-oz-border bg-oz-surface">
        {/* Window dots */}
        <div className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-oz-red/70" />
          <span className="h-2.5 w-2.5 rounded-full bg-oz-amber/70" />
          <span className="h-2.5 w-2.5 rounded-full bg-oz-green/70" />
        </div>
        <span className="font-mono text-xs text-oz-text-3 tracking-widest uppercase ml-1">
          ozone-terminal — bash
        </span>
        {/* Live indicator */}
        <div className="ml-auto flex items-center gap-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-oz-green animate-status-pulse" />
          <span className="font-mono text-2xs text-oz-text-3 tracking-wider">LIVE</span>
        </div>
      </div>

      {/* Output */}
      <TerminalOutput />

      {/* Input */}
      <TerminalInput onSubmit={handleSubmit} />
    </div>
  );
}
