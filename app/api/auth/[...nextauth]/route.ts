/**
 * NEXTAUTH ROUTE HANDLER
 * ─────────────────────────────────────────────────────────────────────────────
 * Route: /api/auth/[...nextauth]
 * Handles all NextAuth.js v5 sign-in, sign-out, callback, and session routes.
 * ─────────────────────────────────────────────────────────────────────────────
 */

export { handlers as GET, handlers as POST } from '@/lib/auth/config';
