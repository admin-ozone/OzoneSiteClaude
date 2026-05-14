/**
 * PRISMA CLIENT SINGLETON
 * ─────────────────────────────────────────────────────────────────────────────
 * In Next.js development, Hot Module Replacement (HMR) causes module re-evaluation
 * on every code change. Without this singleton, each re-evaluation would create a
 * new PrismaClient, exhausting the Supabase connection pool (max 20 connections)
 * within minutes of development.
 *
 * This pattern attaches the client to the global object so it survives HMR.
 * In production, `globalThis.__prisma` is always undefined, so a fresh client
 * is created exactly once per cold start.
 * ─────────────────────────────────────────────────────────────────────────────
 */

import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const db =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development'
      ? ['query', 'error', 'warn']
      : ['error'],
  });

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = db;
}

export default db;
