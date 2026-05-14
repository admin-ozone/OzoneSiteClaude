/**
 * NEXTAUTH TYPE AUGMENTATION
 * ─────────────────────────────────────────────────────────────────────────────
 * Extends the default NextAuth Session type to include `id` and `role`,
 * which are attached in the session callback in lib/auth/config.ts.
 * Without this, TypeScript will complain about unknown properties on session.user.
 * ─────────────────────────────────────────────────────────────────────────────
 */

import type { DefaultSession } from 'next-auth';

type UserRole = 'SUPER_ADMIN' | 'ADMIN' | 'CLIENT';

declare module 'next-auth' {
  interface Session {
    user: {
      id:   string;
      role: UserRole;
    } & DefaultSession['user'];
  }

  interface User {
    role: UserRole;
  }
}
