'use client';

import { useRef, useState, useCallback, useEffect } from 'react';
import { useTerminalStore } from '@/lib/stores/terminal-store';

interface TerminalInputProps {
  onSubmit: (value: string) => void;
}

export function TerminalInput({ onSubmit }: TerminalInputProps) {
  const [value, setValue]               = useState('');
  const [historyIdx, setHistoryIdx]     = useState(-1);
  const [localHistory, setLocalHistory] = useState<string[]>([]);
  const inputRef   = useRef<HTMLInputElement>(null);
  const isStreaming = useTerminalStore((s) => s.isStreaming);

  // Keep focus on the input at all times (clicking anywhere in terminal refocuses)
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        const trimmed = value.trim();
        if (!trimmed || isStreaming) return;

        // Push to local history for ↑↓ navigation
        setLocalHistory((prev) => [trimmed, ...prev].slice(0, 50));
        setHistoryIdx(-1);
        setValue('');
        onSubmit(trimmed);
        return;
      }

      if (e.key === 'ArrowUp') {
        e.preventDefault();
        const nextIdx = Math.min(historyIdx + 1, localHistory.length - 1);
        setHistoryIdx(nextIdx);
        setValue(localHistory[nextIdx] ?? '');
        return;
      }

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        const nextIdx = historyIdx - 1;
        if (nextIdx < 0) {
          setHistoryIdx(-1);
          setValue('');
        } else {
          setHistoryIdx(nextIdx);
          setValue(localHistory[nextIdx] ?? '');
        }
        return;
      }

      // Ctrl+C cancels current input
      if (e.key === 'c' && e.ctrlKey) {
        setValue('');
        setHistoryIdx(-1);
      }
    },
    [value, isStreaming, historyIdx, localHistory, onSubmit]
  );

  return (
    <div className="shrink-0 border-t border-oz-border px-5 py-3 flex items-center gap-2">
      {/* Prompt symbol */}
      <span className="shrink-0 font-mono text-oz-cyan/60 text-sm select-none">
        {isStreaming ? '…' : '❯'}
      </span>

      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={(e) => {
          setValue(e.target.value);
          setHistoryIdx(-1);
        }}
        onKeyDown={handleKeyDown}
        disabled={isStreaming}
        placeholder={isStreaming ? 'Processing…' : 'Type a command or ask anything…'}
        spellCheck={false}
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="off"
        data-terminal-input
        className={[
          'flex-1 bg-transparent border-none outline-none',
          'font-mono text-sm text-oz-text caret-oz-cyan',
          'placeholder:text-oz-text-3/40',
          'disabled:opacity-40 disabled:cursor-not-allowed',
        ].join(' ')}
      />

      {/* Streaming indicator — staggered bounce gives a wave / typing feel */}
      {isStreaming && (
        <span className="shrink-0 flex items-center gap-1">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="inline-block h-1 w-1 rounded-full bg-oz-cyan/60 animate-bounce"
              style={{ animationDelay: `${i * 0.15}s` }}
            />
          ))}
        </span>
      )}
    </div>
  );
}