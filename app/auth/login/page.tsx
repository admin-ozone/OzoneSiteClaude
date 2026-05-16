'use client';

/**
 * AUTH — LOGIN PAGE
 * Route: /auth/login
 * ─────────────────────────────────────────────────────────────────────────────
 * Minimal sign-in page matching the Ozone Labs dark terminal aesthetic.
 * Supports GitHub OAuth, Google OAuth, and email/password credentials.
 * ─────────────────────────────────────────────────────────────────────────────
 */

'use client';

import { Suspense } from 'react';
import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';
import Link from 'next/link';

function LoginForm() {
  const searchParams = useSearchParams();
  const callbackUrl  = searchParams.get('callbackUrl') ?? '/portal/dashboard';
  const error        = searchParams.get('error');

  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [loading,  setLoading]  = useState<string | null>(null);

  async function handleCredentials() {
    setLoading('credentials');
    await signIn('credentials', { email, password, callbackUrl });
    setLoading(null);
  }

  async function handleOAuth(provider: 'github' | 'google') {
    setLoading(provider);
    await signIn(provider, { callbackUrl });
  }

  return (
    <div className="border border-oz-border bg-oz-surface rounded-sm p-8 flex flex-col gap-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-oz-text mb-1">Sign in</h1>
        <p className="font-mono text-xs text-oz-text-3 tracking-wider">Access the client portal</p>
      </div>

      {error && (
        <div className="border border-oz-red/30 bg-oz-red-dim rounded-sm px-4 py-3">
          <p className="font-mono text-xs text-oz-red tracking-wide">
            {error === 'CredentialsSignin'
              ? 'Invalid email or password.'
              : 'Authentication failed. Please try again.'}
          </p>
        </div>
      )}

      {/*<Link
                      href="/"
                      className="font-mono text-xs text-oz-text-3 hover:text-oz-cyan transition-colors tracking-widest uppercase w-full text-center"
                    >
                      ← Back to homepage
      </Link>*/}

      <div className="flex flex-col gap-3">
        <Button
          variant="outline"
          size="md"
          className="w-full justify-center"
          loading={loading === 'github'}
          onClick={() => handleOAuth('github')}
        >
          Continue with GitHub
        </Button>
        <Button
          variant="outline"
          size="md"
          className="w-full justify-center"
          loading={loading === 'google'}
          onClick={() => handleOAuth('google')}
        >
          Continue with Google
        </Button>
      </div>

      <div className="flex items-center gap-3">
        <span className="h-px flex-1 bg-oz-border" />
        <span className="font-mono text-2xs text-oz-text-3 tracking-widest uppercase">or</span>
        <span className="h-px flex-1 bg-oz-border" />
      </div>

      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <label className="font-mono text-xs text-oz-text-3 tracking-widest uppercase">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className={cn(
              'bg-oz-black border border-oz-border rounded-sm px-3 py-2.5',
              'font-mono text-sm text-oz-text placeholder:text-oz-text-3/40',
              'focus:outline-none focus:border-oz-cyan/50 focus:ring-1 focus:ring-oz-cyan/20',
              'transition-colors duration-150'
            )}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="font-mono text-xs text-oz-text-3 tracking-widest uppercase">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            onKeyDown={(e) => e.key === 'Enter' && handleCredentials()}
            className={cn(
              'bg-oz-black border border-oz-border rounded-sm px-3 py-2.5',
              'font-mono text-sm text-oz-text placeholder:text-oz-text-3/40',
              'focus:outline-none focus:border-oz-cyan/50 focus:ring-1 focus:ring-oz-cyan/20',
              'transition-colors duration-150'
            )}
          />
        </div>
        <Button
          variant="primary"
          size="md"
          className="w-full mt-1"
          loading={loading === 'credentials'}
          onClick={handleCredentials}
        >
          Sign in
        </Button>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-oz-white flex items-center justify-center px-6">
      <div className="absolute inset-0 bg-grid opacity-50 pointer-events-none" />
      <div className="relative z-10 w-full max-w-sm">
        {/* Wordmark */}
                  <Link href="/" className="group font-mono text-sm font-bold tracking-[0.2em] uppercase w-full flex justify-center items-center gap-0">
                    <span className="transition-colors duration-200" style={{ color: '#FF3428' }}>OZ</span>
                    <span style={{ color: '#C8C4BE', margin: '0 6px' }}>/</span>
                    <span className="transition-colors duration-200 group-hover:text-oz-red" style={{ color: '#111110' }}>LABS</span>
                  </Link>

        <Suspense fallback={<div className="h-96 bg-oz-surface border border-oz-border rounded-sm animate-pulse" />}>
          <LoginForm />
        </Suspense>

        <p className="font-mono text-2xs text-oz-text-3 text-center mt-6 tracking-wider">
          Access is by invitation only.{' '}
          <a href="mailto:founders@ozbuilts.com" className="text-oz-red hover:underline">
            Contact us
          </a>
        </p>
      </div>
    </div>
  );
}