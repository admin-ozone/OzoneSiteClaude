'use client';

import { useEffect, useCallback, useRef, useState } from 'react';
import { MessageCircle, X, Send } from 'lucide-react';
import { useChatStore } from '@/lib/stores/chat-store';
import { cn } from '@/lib/utils';

// ─── SSE Stream Handler (identical to terminal) ───────────────────────────────

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

  if (!res.ok) { onError(`API error: ${res.status}`); return; }

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
      } catch { /* skip malformed */ }
    }
  }
  onDone();
}

// ─── Component ────────────────────────────────────────────────────────────────

export function OzoneAI() {
  const {
    messages,
    history,
    isStreaming,
    isOpen,
    hasOpened,
    addMessage,
    appendToMessage,
    finalizeMessage,
    setStreaming,
    addToHistory,
    setOpen,
  } = useChatStore();

  const [input, setInput]           = useState('');
  const [showTooltip, setShowTooltip] = useState(false);
  const bottomRef   = useRef<HTMLDivElement>(null);
  const inputRef    = useRef<HTMLInputElement>(null);
  const tooltipTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Show tooltip after 4s if panel was never opened
  useEffect(() => {
    if (hasOpened) return;
    tooltipTimer.current = setTimeout(() => setShowTooltip(true), 4000);
    return () => { if (tooltipTimer.current) clearTimeout(tooltipTimer.current); };
  }, [hasOpened]);

  // Close on Escape
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isOpen, setOpen]);

  // Auto-scroll to latest message
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }, [messages]);

  // Focus input when panel opens
  useEffect(() => {
    if (isOpen) setTimeout(() => inputRef.current?.focus(), 300);
  }, [isOpen]);

  const handleOpen = () => {
    setShowTooltip(false);
    setOpen(true);
  };

  // ── Submit handler ─────────────────────────────────────────────────────────
  const handleSubmit = useCallback(async () => {
    const text = input.trim();
    if (!text || isStreaming) return;
    setInput('');

    addMessage('user', text);
    setStreaming(true);
    const msgId = addMessage('ai', '');

    let fullResponse = '';

    await streamAssistant(
      text,
      history,
      (chunk) => {
        fullResponse += chunk;
        appendToMessage(msgId, chunk);
      },
      () => {
        finalizeMessage(msgId);
        setStreaming(false);
        if (fullResponse) {
          addToHistory('user',  text);
          addToHistory('model', fullResponse);
        }
      },
      (errMsg) => {
        appendToMessage(msgId, `Error: ${errMsg}`);
        finalizeMessage(msgId);
        setStreaming(false);
      }
    );
  }, [input, isStreaming, history, addMessage, appendToMessage, finalizeMessage, setStreaming, addToHistory]);

  return (
    <>
      {/* ── FAB (closed state) ───────────────────────────────────────────── */}
      {!isOpen && (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-2">
          {/* Tooltip */}
          {showTooltip && !hasOpened && (
            <div className="animate-fade-in font-mono text-xs text-oz-text-3 bg-oz-surface border border-oz-border px-3 py-2 rounded-sm whitespace-nowrap shadow-oz-sm">
              Ask Uzo anything →
            </div>
          )}

          <button
            aria-label="Open AI chat"
            onClick={handleOpen}
            className={cn(
              'relative h-14 w-14 rounded-full bg-oz-surface border border-oz-border-2',
              'flex items-center justify-center',
              'hover:border-oz-cyan/30 hover:shadow-[0_0_24px_rgba(0,229,255,0.12)]',
              'hover:scale-105 active:scale-95',
              'transition-all duration-200'
            )}
          >
            <MessageCircle className="h-5 w-5 text-oz-text-2" strokeWidth={1.5} />
            {/* Live pulse dot */}
            <span className="absolute top-0.5 right-0.5 h-3 w-3 rounded-full bg-oz-black border-2 border-oz-black flex items-center justify-center">
              <span className="h-1.5 w-1.5 rounded-full bg-oz-cyan animate-status-pulse" />
            </span>
          </button>
        </div>
      )}

      {/* ── Chat Panel (open state) ──────────────────────────────────────── */}
      {isOpen && (
        <div
          role="dialog"
          aria-labelledby="uzo-title"
          className={cn(
            'fixed z-50 flex flex-col',
            'bg-oz-black-2 border border-oz-border',
            'shadow-[0_0_0_1px_rgba(0,229,255,0.06),0_32px_64px_rgba(0,0,0,0.7)]',
            // Desktop: anchored above FAB
            'sm:bottom-6 sm:right-6 sm:w-[380px] sm:h-[500px] sm:rounded-sm',
            // Mobile: full-screen bottom sheet
            'max-sm:bottom-0 max-sm:right-0 max-sm:w-full max-sm:h-[100dvh] max-sm:rounded-none',
            // Spring open animation
            'animate-chat-open',
          )}
          style={{ overscrollBehavior: 'contain' }}
        >
          {/* Header */}
          <div className="shrink-0 flex items-center justify-between px-4 py-3 border-b border-oz-border bg-oz-surface">
            <div className="flex items-center gap-2.5">
              <span className="h-2 w-2 rounded-full bg-oz-green animate-status-pulse" />
              <span id="uzo-title" className="font-mono text-sm text-oz-text tracking-widest uppercase">
                Uzo
              </span>
              <span className="font-mono text-2xs text-oz-text-3 tracking-wider">/ OzoneAI</span>
            </div>
            <button
              onClick={() => setOpen(false)}
              aria-label="Close chat"
              className="h-8 w-8 flex items-center justify-center text-oz-text-3 hover:text-oz-text hover:bg-oz-black rounded-sm transition-all duration-150"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-4 no-scrollbar">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={cn(
                  'flex flex-col gap-1 max-w-[85%]',
                  msg.role === 'user' ? 'self-end items-end' : 'self-start items-start'
                )}
              >
                <div className={cn(
                  'px-3 py-2.5 rounded-sm font-mono text-sm leading-relaxed',
                  msg.role === 'user'
                    ? 'bg-oz-cyan-dim border border-oz-cyan/20 text-oz-cyan'
                    : 'bg-oz-surface-2 border border-oz-border text-oz-text-2'
                )}>
                  {msg.content}
                  {msg.isPartial && (
                    <span className="inline-block w-1.5 h-3.5 ml-0.5 bg-oz-cyan/60 align-middle animate-cursor" />
                  )}
                </div>
                <span className="font-mono text-2xs text-oz-text-3 px-1">
                  {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            ))}

            {/* Typing indicator while streaming with no content yet */}
            {isStreaming && messages.at(-1)?.content === '' && (
              <div className="self-start flex items-center gap-1 px-3 py-2.5 bg-oz-surface-2 border border-oz-border rounded-sm">
                {[0, 1, 2].map((i) => (
                  <span
                    key={i}
                    className="h-1 w-1 rounded-full bg-oz-cyan/60 animate-bounce"
                    style={{ animationDelay: `${i * 0.15}s` }}
                  />
                ))}
              </div>
            )}

            <div ref={bottomRef} />
          </div>

          {/* Input bar */}
          <div className="shrink-0 border-t border-oz-border px-4 py-3 flex items-center gap-3">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
              disabled={isStreaming}
              placeholder={isStreaming ? 'Uzo is thinking…' : 'Ask anything…'}
              spellCheck={false}
              autoComplete="off"
              className={cn(
                'flex-1 bg-transparent border-none outline-none',
                'font-mono text-sm text-oz-text placeholder:text-oz-text-3/60',
                'disabled:opacity-40 disabled:cursor-not-allowed'
              )}
            />
            <button
              onClick={handleSubmit}
              disabled={!input.trim() || isStreaming}
              aria-label="Send message"
              className={cn(
                'h-9 w-9 flex items-center justify-center rounded-sm transition-all duration-200',
                input.trim() && !isStreaming
                  ? 'text-oz-cyan hover:bg-oz-cyan-dim'
                  : 'text-oz-text-3/30 cursor-not-allowed'
              )}
            >
              <Send className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </>
  );
}