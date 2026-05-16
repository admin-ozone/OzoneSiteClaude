'use client';

import { useEffect, useCallback, useRef, useState } from 'react';
import { MessageCircle, X, Send } from 'lucide-react';
import { useChatStore } from '@/lib/stores/chat-store';
import { cn } from '@/lib/utils';

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

function ChatBlueprintBG() {
  return (
    <svg
      viewBox="0 0 380 500"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="absolute inset-0 w-full h-full pointer-events-none"
      aria-hidden="true"
    >
      {/* ── Radial rings — like a signal/radar ── */}
      <circle cx="190" cy="260" r="60"  stroke="#DEDAD4" strokeWidth="0.5" />
      <circle cx="190" cy="260" r="110" stroke="#DEDAD4" strokeWidth="0.5" />
      <circle cx="190" cy="260" r="160" stroke="#DEDAD4" strokeWidth="0.5" />
      <circle cx="190" cy="260" r="215" stroke="#DEDAD4" strokeWidth="0.5" />

      {/* ── Cross hairs ── */}
      <line x1="190" y1="0"   x2="190" y2="500" stroke="#DEDAD4" strokeWidth="0.5" strokeDasharray="3 8" />
      <line x1="0"   y1="260" x2="380" y2="260" stroke="#DEDAD4" strokeWidth="0.5" strokeDasharray="3 8" />

      {/* ── Diagonal sweep line ── */}
      <line x1="190" y1="260" x2="380" y2="80"  stroke="#DEDAD4" strokeWidth="0.75" />

      {/* ── Circuit traces — top-left cluster ── */}
      <polyline points="20,40 20,90 60,90 60,120 110,120" stroke="#DEDAD4" strokeWidth="0.75" fill="none" />
      <circle cx="20"  cy="40"  r="2" fill="#DEDAD4" />
      <circle cx="60"  cy="90"  r="1.5" fill="#DEDAD4" />
      <circle cx="110" cy="120" r="2" fill="#DEDAD4" />

      {/* ── Circuit traces — bottom-right cluster ── */}
      <polyline points="360,460 360,400 310,400 310,370 260,370" stroke="#DEDAD4" strokeWidth="0.75" fill="none" />
      <circle cx="360" cy="460" r="2"   fill="#DEDAD4" />
      <circle cx="310" cy="400" r="1.5" fill="#DEDAD4" />
      <circle cx="260" cy="370" r="2"   fill="#DEDAD4" />

      {/* ── Tick marks on outer ring ── */}
      {Array.from({ length: 12 }).map((_, i) => {
        const angle = (i * 30 * Math.PI) / 180;
        const x1 = 190 + 208 * Math.cos(angle);
        const y1 = 260 + 208 * Math.sin(angle);
        const x2 = 190 + 218 * Math.cos(angle);
        const y2 = 260 + 218 * Math.sin(angle);
        return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#DEDAD4" strokeWidth="0.75" />;
      })}

      {/* ── Red center dot ── */}
      <circle cx="190" cy="260" r="3" fill="#FF3428" opacity="0.4" />
      <circle cx="190" cy="260" r="1.5" fill="#FF3428" opacity="0.7" />

      {/* ── Small label ── */}
      <text x="196" y="256" fontFamily="'Space Mono', monospace" fontSize="6" fill="#C8C4BE" letterSpacing="0.08em">
        UZOAI
      </text>
    </svg>
  );
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

  const [input, setInput]             = useState('');
  const [showTooltip, setShowTooltip] = useState(false);
  const bottomRef    = useRef<HTMLDivElement>(null);
  const inputRef     = useRef<HTMLInputElement>(null);
  const tooltipTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (hasOpened) return;
    tooltipTimer.current = setTimeout(() => setShowTooltip(true), 4000);
    return () => { if (tooltipTimer.current) clearTimeout(tooltipTimer.current); };
  }, [hasOpened]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isOpen, setOpen]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }, [messages]);

  useEffect(() => {
    if (isOpen) setTimeout(() => inputRef.current?.focus(), 300);
  }, [isOpen]);

  const handleOpen = () => {
    setShowTooltip(false);
    setOpen(true);
  };

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
      {/* ── FAB ─────────────────────────────────────────────────────────── */}
      {!isOpen && (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-2">

          {/* Tooltip */}
          {showTooltip && !hasOpened && (
            <div className="font-mono text-xs text-oz-text-3 bg-oz-white border border-oz-border px-3 py-2 rounded-sm whitespace-nowrap shadow-[0_2px_8px_rgba(0,0,0,0.08)]">
              Ask Uzo anything →
            </div>
          )}

          <button
            aria-label="Open AI chat"
            onClick={handleOpen}
            className={cn(
              'relative h-14 w-14 rounded-full bg-oz-white border border-oz-border-2',
              'flex items-center justify-center',
              'hover:border-oz-border hover:shadow-[0_2px_12px_rgba(0,0,0,0.10)]',
              'hover:scale-105 active:scale-95',
              'transition-all duration-200'
            )}
          >
            <MessageCircle className="h-5 w-5 text-oz-text-2" strokeWidth={1.5} />
            {/* Static live dot — no pulse */}
            <span className="absolute top-0.5 right-0.5 h-3 w-3 rounded-full bg-oz-white border-2 border-oz-white flex items-center justify-center">
              <span className="h-1.5 w-1.5 rounded-full bg-oz-green" />
            </span>
          </button>
        </div>
      )}

      {/* ── Chat Panel ──────────────────────────────────────────────────── */}
      {isOpen && (
        <div
          role="dialog"
          aria-labelledby="uzo-title"
          className={cn(
            'fixed z-50 flex flex-col',
            'bg-oz-white border border-oz-border',
            'shadow-[0_8px_40px_rgba(0,0,0,0.12)]',
            'sm:bottom-6 sm:right-6 sm:w-[380px] sm:h-[500px] sm:rounded-sm',
            'max-sm:bottom-0 max-sm:right-0 max-sm:w-full max-sm:h-[100dvh] max-sm:rounded-none',
            'animate-chat-open',
          )}
          style={{ overscrollBehavior: 'contain' }}
        >
          {/* Header */}
          <div className="shrink-0 flex items-center justify-between px-4 py-3 border-b border-oz-border bg-oz-off-white">
            <div className="flex items-center gap-2.5">
              {/* Static green dot */}
              <span className="h-2 w-2 rounded-full bg-oz-green" />
              <span id="uzo-title" className="font-mono text-sm text-oz-text tracking-widest uppercase">
                Uzo
              </span>
              <span className="font-mono text-2xs text-oz-text-3 tracking-wider">/ OzoneAI</span>
            </div>
            <button
              onClick={() => setOpen(false)}
              aria-label="Close chat"
              className="h-8 w-8 flex items-center justify-center text-oz-text-3 hover:text-oz-text hover:bg-oz-surface rounded-sm transition-all duration-150"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Messages */}
          <div className="relative flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-4 no-scrollbar">
            <div className="absolute inset-0 opacity-[1.2] pointer-events-none">
              <ChatBlueprintBG />
            </div>
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
                    ? 'bg-oz-red-dim border border-oz-red-border text-oz-red'
                    : 'bg-oz-surface border border-oz-border text-oz-text-2'
                )}>
                  {msg.content}
                  {msg.isPartial && (
                    <span className="inline-block w-1.5 h-3.5 ml-0.5 bg-oz-red/50 align-middle animate-pulse" />
                  )}
                </div>
                <span className="font-mono text-2xs text-oz-text-3 px-1">
                  {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            ))}

            {/* Typing indicator */}
            {isStreaming && messages.at(-1)?.content === '' && (
              <div className="self-start flex items-center gap-1 px-3 py-2.5 bg-oz-surface border border-oz-border rounded-sm">
                {[0, 1, 2].map((i) => (
                  <span
                    key={i}
                    className="h-1 w-1 rounded-full bg-oz-text-3/60 animate-bounce"
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
                  ? 'text-oz-red hover:bg-oz-red-dim'
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