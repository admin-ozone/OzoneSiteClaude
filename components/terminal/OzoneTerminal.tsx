'use client';

import { useEffect, useRef, useState, useCallback, KeyboardEvent } from 'react';
import { cn } from '@/lib/utils';

// ─── Types ────────────────────────────────────────────────────────────────────

type LineType = 'input' | 'output' | 'stream' | 'error' | 'system';

interface Line {
  id:       string;
  type:     LineType;
  content:  string;
  partial?: boolean;
}

interface Turn { role: 'user' | 'model'; content: string; }

const uid = () => `${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;

// ─── Boot sequence ────────────────────────────────────────────────────────────

const BOOT_LINES: { content: string; type: LineType; delay: number }[] = [
  { content: 'OzoneOS v1.0.0 — initializing...', type: 'system', delay: 0   },
  { content: 'loading AI modules............... OK', type: 'system', delay: 300 },
  { content: 'connecting to inference cluster.. OK', type: 'system', delay: 550 },
  { content: 'gemini-3.1-flash-lite online..... OK', type: 'system', delay: 780 },
  { content: '─────────────────────────────────────', type: 'system', delay: 1000 },
  { content: 'Type  help  to see commands, or ask me anything.', type: 'system', delay: 1150 },
];

// ─── Terminal Component ───────────────────────────────────────────────────────

export function OzoneTerminal() {
  const [lines,      setLines]      = useState<Line[]>([]);
  const [input,      setInput]      = useState('');
  const [streaming,  setStreaming]   = useState(false);
  const [history,    setHistory]    = useState<Turn[]>([]);
  const [cmdHistory, setCmdHistory] = useState<string[]>([]);
  const [cmdIdx,     setCmdIdx]     = useState(-1);
  const bottomRef  = useRef<HTMLDivElement>(null);
  const inputRef   = useRef<HTMLInputElement>(null);
  const abortRef   = useRef<AbortController | null>(null);

  // ── Boot sequence on mount ─────────────────────────────────────────────────
  useEffect(() => {
    let mounted = true;
    BOOT_LINES.forEach(({ content, type, delay }) => {
      setTimeout(() => {
        if (!mounted) return;
        setLines(prev => [...prev, { id: uid(), type, content }]);
      }, delay);
    });
    return () => { mounted = false; };
  }, []);

  // ── Auto-scroll ────────────────────────────────────────────────────────────
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }, [lines]);

  const addLine = useCallback((type: LineType, content: string, partial = false) => {
    const id = uid();
    setLines(prev => [...prev, { id, type, content, partial }]);
    return id;
  }, []);

  const appendToLine = useCallback((id: string, chunk: string) => {
    setLines(prev => prev.map(l => l.id === id ? { ...l, content: l.content + chunk } : l));
  }, []);

  const finalizeStream = useCallback((id: string) => {
    setLines(prev => prev.map(l => l.id === id ? { ...l, partial: false, type: 'output' } : l));
  }, []);

  // ── Submit ─────────────────────────────────────────────────────────────────
  const submit = useCallback(async (raw: string) => {
    const msg = raw.trim();
    if (!msg || streaming) return;

    setCmdHistory(h => [msg, ...h.slice(0, 49)]);
    setCmdIdx(-1);
    setInput('');

    addLine('input', msg);

    // Special client-side commands
    if (msg.toLowerCase() === 'clear') {
      setLines([]);
      addLine('system', 'Terminal cleared. Type help for commands.');
      return;
    }

    setStreaming(true);

    // Cancel any in-flight request
    abortRef.current?.abort();
    const abort = new AbortController();
    abortRef.current = abort;

    const streamId = uid();
    setLines(prev => [...prev, { id: streamId, type: 'stream', content: '', partial: true }]);

    try {
      const res = await fetch('/api/assistant', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ message: msg, history: history.slice(-20) }),
        signal:  abort.signal,
      });

      if (!res.ok || !res.body) throw new Error(`HTTP ${res.status}`);

      const reader  = res.body.getReader();
      const decoder = new TextDecoder();
      let   full    = '';
      let   buf     = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buf += decoder.decode(value, { stream: true });
        const parts = buf.split('\n\n');
        buf = parts.pop() ?? '';

        for (const part of parts) {
          if (!part.startsWith('data: ')) continue;
          const raw = part.slice(6).trim();
          if (raw === '[DONE]') break;

          try {
            const parsed = JSON.parse(raw);
            if (parsed.chunk) {
              full += parsed.chunk;
              appendToLine(streamId, parsed.chunk);
            }
            if (parsed.error) {
              setLines(prev => prev.map(l =>
                l.id === streamId ? { ...l, content: 'Error: ' + parsed.error, type: 'error', partial: false } : l
              ));
            }
          } catch { /* ignore malformed SSE */ }
        }
      }

      finalizeStream(streamId);
      setHistory(h => [...h, { role: 'user', content: msg }, { role: 'model', content: full }]);

    } catch (err: unknown) {
      if (err instanceof Error && err.name === 'AbortError') return;
      setLines(prev => prev.map(l =>
        l.id === streamId
          ? { ...l, content: 'Connection failed. Check console.', type: 'error', partial: false }
          : l
      ));
    } finally {
      setStreaming(false);
    }
  }, [streaming, history, addLine, appendToLine, finalizeStream]);

  // ── Keyboard ───────────────────────────────────────────────────────────────
  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); submit(input); return; }
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      const next = Math.min(cmdIdx + 1, cmdHistory.length - 1);
      setCmdIdx(next);
      setInput(cmdHistory[next] ?? '');
    }
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      const next = cmdIdx - 1;
      setCmdIdx(next);
      setInput(next < 0 ? '' : (cmdHistory[next] ?? ''));
    }
  };

  return (
    <div
      className={cn(
        'relative flex flex-col',
        'bg-[#080810] border border-oz-border rounded-sm',
        'h-[460px] lg:h-[520px]',
        'font-mono text-sm',
        // CRT scanline overlay
        'crt-scanlines',
        // Subtle cyan glow
        'shadow-[0_0_0_1px_rgba(0,229,255,0.08),0_0_60px_rgba(0,229,255,0.06),0_20px_60px_rgba(0,0,0,0.5)]'
      )}
      onClick={() => inputRef.current?.focus()}
    >
      {/* Title bar */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-oz-border shrink-0 bg-oz-surface/50">
        <div className="flex gap-2">
          <span className="h-3 w-3 rounded-full bg-oz-red/60"   />
          <span className="h-3 w-3 rounded-full bg-oz-amber/60" />
          <span className="h-3 w-3 rounded-full bg-oz-green/60" />
        </div>
        <span className="text-oz-text-3 text-xs tracking-widest flex-1 text-center select-none">
          ozoneos — bash
        </span>
        {streaming && (
          <span className="text-oz-cyan text-2xs tracking-widest animate-pulse">
            processing
          </span>
        )}
      </div>

      {/* Output */}
      <div className="flex-1 overflow-y-auto px-4 py-4 no-scrollbar space-y-1">
        {lines.map(line => (
          <TerminalLine key={line.id} line={line} />
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Input row */}
      <div className="flex items-center gap-2 px-4 py-3 border-t border-oz-border shrink-0">
        <span className="text-oz-cyan select-none shrink-0">❯</span>
        <input
          ref={inputRef}
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={onKeyDown}
          disabled={streaming}
          placeholder={streaming ? '' : 'type a command or ask anything...'}
          className={cn(
            'flex-1 bg-transparent text-oz-text text-sm',
            'placeholder:text-oz-text-3/30',
            'focus:outline-none',
            'caret-oz-cyan',
            streaming && 'opacity-50'
          )}
          autoComplete="off"
          spellCheck={false}
        />
        {input && !streaming && (
          <span className="text-oz-text-3 text-2xs tracking-wider shrink-0">↵ enter</span>
        )}
      </div>
    </div>
  );
}

// ─── Individual Line ──────────────────────────────────────────────────────────

function TerminalLine({ line }: { line: Line }) {
  const base = 'leading-relaxed whitespace-pre-wrap break-words text-sm';

  if (line.type === 'input') {
    return (
      <div className="flex items-start gap-2">
        <span className="text-oz-cyan/40 select-none shrink-0 mt-0.5 text-xs">❯</span>
        <span className={cn(base, 'text-oz-cyan')}>{line.content}</span>
      </div>
    );
  }

  if (line.type === 'system') {
    return <p className={cn(base, 'text-oz-text-3')}>{line.content}</p>;
  }

  if (line.type === 'error') {
    return <p className={cn(base, 'text-oz-red')}>{line.content}</p>;
  }

  return (
    <p className={cn(base, 'text-oz-text-2')}>
      {line.content}
      {line.partial && (
        <span className="inline-block w-[7px] h-[13px] ml-0.5 bg-oz-cyan/70 align-middle animate-cursor" />
      )}
    </p>
  );
}