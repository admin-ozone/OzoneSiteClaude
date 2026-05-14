/**
 * MIDDLEWARE — Route Protection
 * ─────────────────────────────────────────────────────────────────────────────
 * Protects /portal/* routes — redirects unauthenticated users to /auth/login.
 * Public routes (homepage, transparency, auth pages, api) pass through freely.
 * ─────────────────────────────────────────────────────────────────────────────
 */

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Protect /portal routes only
  if (pathname.startsWith('/portal')) {
    const sessionToken =
      request.cookies.get('next-auth.session-token') ??
      request.cookies.get('__Secure-next-auth.session-token');

    if (!sessionToken) {
      return NextResponse.redirect(new URL('/auth/login', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/portal/:path*'],
};