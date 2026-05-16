'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function TransparencyError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('[transparency]', error);
  }, [error]);

  return (
    <div className="min-h-screen bg-oz-black flex items-center justify-center px-6">
      <div className="absolute inset-0 bg-grid opacity-40 pointer-events-none" />
      <div className="relative z-10 w-full max-w-md flex flex-col gap-6">
        <div className="border border-oz-red/30 bg-oz-red-dim rounded-sm px-6 py-8">
          <p className="font-mono text-2xs text-oz-red tracking-widest uppercase mb-3">
            Status page error
          </p>
          <h1 className="font-display text-2xl font-bold text-oz-text mb-3">
            Could not load status
          </h1>
          <p className="font-mono text-xs text-oz-text-3 leading-relaxed">
            {error.message ?? 'An unexpected error occurred loading the transparency page.'}
          </p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={reset}
            className="flex-1 font-mono text-xs tracking-widest uppercase text-center border border-oz-border-2 text-oz-text-2 px-6 py-3 rounded-sm hover:border-oz-cyan hover:text-oz-cyan transition-all duration-200"
          >
            Try again
          </button>
          <Link
            href="/"
            className="flex-1 font-mono text-xs tracking-widest uppercase text-center border border-transparent text-oz-text-3 px-6 py-3 rounded-sm hover:text-oz-cyan transition-all duration-200"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}