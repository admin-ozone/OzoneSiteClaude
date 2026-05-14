'use client';

/**
 * AUTH — ERROR PAGE
 * Route: /auth/error
 * Displayed by NextAuth when something goes wrong during OAuth (e.g. access denied).
 */

'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

const ERROR_MESSAGES: Record<string, string> = {
  Configuration: 'Server configuration error. Please contact support.',
  AccessDenied:  'Access denied. You do not have permission to sign in.',
  Verification:  'The verification link has expired or has already been used.',
  Default:       'An unexpected error occurred during sign in.',
};

function ErrorContent() {
  const searchParams = useSearchParams();
  const error        = searchParams.get('error') ?? 'Default';
  const message      = ERROR_MESSAGES[error] ?? ERROR_MESSAGES.Default;

  return (
    <div className="border border-oz-red/30 bg-oz-red-dim rounded-sm px-6 py-8 w-full">
      <p className="font-mono text-2xs text-oz-red tracking-widest uppercase mb-3">Auth Error</p>
      <h1 className="font-display text-xl font-bold text-oz-text mb-3">Sign-in failed</h1>
      <p className="font-mono text-xs text-oz-text-3 leading-relaxed">{message}</p>
    </div>
  );
}

export default function AuthErrorPage() {
  return (
    <div className="min-h-screen bg-oz-black flex items-center justify-center px-6">
      <div className="absolute inset-0 bg-grid opacity-50 pointer-events-none" />
      <div className="relative z-10 w-full max-w-sm text-center flex flex-col items-center gap-6">
        <p className="font-mono text-sm tracking-widest uppercase">
          <span className="text-oz-cyan">OZ</span>
          <span className="text-oz-text-3 mx-1">/</span>
          <span className="text-oz-text">LABS</span>
        </p>

        <Suspense fallback={<div className="h-32 bg-oz-surface border border-oz-border rounded-sm w-full animate-pulse" />}>
          <ErrorContent />
        </Suspense>

        <div className="flex gap-3 w-full">
          <Link
            href="/auth/login"
            className="flex-1 text-center font-mono text-sm tracking-wider uppercase border border-oz-border-2 text-oz-text-2 px-6 py-2 rounded-sm hover:border-oz-cyan hover:text-oz-cyan transition-all duration-200"
          >
            Try again
          </Link>
          <Link
            href="/"
            className="flex-1 text-center font-mono text-sm tracking-wider uppercase text-oz-text-3 px-6 py-2 rounded-sm hover:text-oz-cyan transition-all duration-200"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}