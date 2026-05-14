/**
 * NEXTAUTH ROUTE HANDLER
 * ─────────────────────────────────────────────────────────────────────────────
 * Route: /api/auth/[...nextauth]
 * Handles all NextAuth.js v5 sign-in, sign-out, callback, and session routes.
 * ─────────────────────────────────────────────────────────────────────────────
 */

import { handlers } from '@/lib/auth/config';
export const { GET, POST } = handlers;