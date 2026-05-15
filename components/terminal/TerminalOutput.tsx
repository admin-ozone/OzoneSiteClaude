'use client';

import { useEffect, useRef } from 'react';
import { useTerminalStore, type TerminalLine } from '@/lib/stores/terminal-store';
import { cn } from '@/lib/utils';

function TerminalLineItem({ line }: { line: TerminalLine }) {
  const isMultiline = line.content.includes('\n');

  const lineClass = cn(
    'font-mono text-sm leading-relaxed whitespace-pre-wrap break-words',
    line.type === 'input'   && 'text-oz-cyan',
    line.type === 'output'  && 'text-oz-text-2',
    line.type === 'stream'  && 'text-oz-text-2',
    line.type === 'error'   && 'text-oz-red',
    line.type === 'system'  && 'text-oz-text-3',
    line.type === 'command' && 'text-oz-text-2',
  );

  if (line.type === 'input') {
    return (
      <div className="flex items-start gap-2 mb-1">
        <span className="shrink-0 text-oz-cyan/50 select-none mt-0.5">❯</span>
        <span className={lineClass}>{line.content}</span>
      </div>
    );
  }

  if (line.type === 'system') {
    return (
      <div className="flex items-center gap-2 mb-1">
        <span className="text-oz-text-3 select-none text-xs">─</span>
        <span className={lineClass}>{line.content}</span>
      </div>
    );
  }

  return (
    <div className={cn('mb-1', isMultiline && 'mb-2')}>
      <span className={lineClass}>
        {line.content}
        {line.isPartial && (
          <span className="inline-block w-2 h-3.5 ml-0.5 bg-oz-cyan align-middle animate-cursor" />
        )}
      </span>
    </div>
  );
}

export function TerminalOutput() {
  const lines    = useTerminalStore((s) => s.lines);
  const bottomRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom on new lines
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }, [lines]);

  return (
    <div className="flex-1 overflow-y-auto px-5 py-4 no-scrollbar">
      {lines.map((line) => (
        <TerminalLineItem key={line.id} line={line} />
      ))}
      <div ref={bottomRef} />
    </div>
  );
}