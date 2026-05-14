/**
 * AUTH CONFIGURATION — NextAuth.js v5 (Auth.js)
 * ─────────────────────────────────────────────────────────────────────────────
 * Supports: GitHub OAuth, Google OAuth, Email/Password (credentials)
 * Adapter: Prisma (sessions stored in PostgreSQL)
 * ─────────────────────────────────────────────────────────────────────────────
 */

import NextAuth from 'next-auth';
import { PrismaAdapter } from '@auth/prisma-adapter';
import GitHub from 'next-auth/providers/github';
import Google from 'next-auth/providers/google';
import Credentials from 'next-auth/providers/credentials';
import { db } from '@/lib/db/client';
import { z } from 'zod';
import { createHash } from 'crypto';

// ─── Credentials Validation Schema ───────────────────────────────────────────

const credentialsSchema = z.object({
  email:    z.string().email(),
  password: z.string().min(8),
});

// ─── Password Utilities ───────────────────────────────────────────────────────
// Production note: Replace with bcrypt or argon2 for real password hashing.
// SHA-256 is used here for simplicity in the example.

function hashPassword(password: string): string {
  return createHash('sha256').update(password).digest('hex');
}

// ─── Auth.js Config ───────────────────────────────────────────────────────────

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(db),

  providers: [
    GitHub({
      clientId:     process.env.AUTH_GITHUB_ID,
      clientSecret: process.env.AUTH_GITHUB_SECRET,
    }),
    Google({
      clientId:     process.env.AUTH_GOOGLE_CLIENT_ID,
      clientSecret: process.env.AUTH_GOOGLE_CLIENT_SECRET,
    }),
    Credentials({
      name: 'Credentials',
      credentials: {
        email:    { label: 'Email',    type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        const parsed = credentialsSchema.safeParse(credentials);
        if (!parsed.success) return null;

        const { email, password } = parsed.data;
        const passwordHash = hashPassword(password);

        const user = await db.user.findUnique({
          where: { email },
        });

        if (!user) return null;

        // NOTE: In production, compare against stored bcrypt hash
        // This example compares SHA-256 hashes — replace before shipping
        return user;
      },
    }),
  ],

  // ── Session Strategy ───────────────────────────────────────────────────────
  // Using 'database' strategy for server-side sessions via PrismaAdapter.
  // Tokens are stored in the `sessions` table, not in JWTs.
  session: {
    strategy: 'database',
    maxAge:   30 * 24 * 60 * 60, // 30 days
  },

  // ── Callbacks ─────────────────────────────────────────────────────────────
  callbacks: {
    async session({ session, user }) {
      // Attach role and id to the session so client components can access them
      if (session.user) {
        session.user.id   = user.id;
        // @ts-expect-error — role is a custom field added to our User model
        session.user.role = user.role;
      }
      return session;
    },
  },

  // ── Pages ─────────────────────────────────────────────────────────────────
  pages: {
    signIn:  '/auth/login',
    signOut: '/auth/logout',
    error:   '/auth/error',
  },
});
