/**
 * MIDDLEWARE — Route Protection
 * ─────────────────────────────────────────────────────────────────────────────
 * Protects /portal/* routes — redirects unauthenticated users to /auth/login.
 * Public routes (homepage, transparency, auth pages, api) pass through freely.
 * ─────────────────────────────────────────────────────────────────────────────
 */

export { auth as middleware } from '@/lib/auth/config';

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon|og-image|apple-touch-icon|favicon-16|favicon-32|api/auth).*)',
  ],
};