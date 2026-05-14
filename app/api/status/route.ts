/**
 * SYSTEM STATUS API
 * ─────────────────────────────────────────────────────────────────────────────
 * Route: GET /api/status
 * Returns real-time status of all Ozone Labs services.
 * Cached for 30 seconds via Next.js fetch cache.
 * ─────────────────────────────────────────────────────────────────────────────
 */

import { db } from '@/lib/db/client';
import { NextResponse } from 'next/server';

export const revalidate = 30; // ISR: revalidate every 30 seconds

export async function GET() {
  try {
    const statuses = await db.serviceStatus.findMany({
      orderBy: { displayName: 'asc' },
      include: {
        incidents: {
          where: { isResolved: false },
          orderBy: { startedAt: 'desc' },
          take: 1,
        },
      },
    });

    const overallStatus = computeOverallStatus(statuses);

    return NextResponse.json({
      overall:   overallStatus,
      services:  statuses,
      updatedAt: new Date().toISOString(),
    });
  } catch (error) {
    // If DB is unavailable, return degraded status rather than 500
    return NextResponse.json({
      overall:  'DEGRADED',
      services: getStaticFallbackStatuses(),
      updatedAt: new Date().toISOString(),
      error:    'Could not connect to status database',
    }, { status: 200 }); // Still 200 — we have data to show
  }
}

function computeOverallStatus(services: { status: string }[]): string {
  if (services.some(s => s.status === 'MAJOR_OUTAGE'))  return 'MAJOR_OUTAGE';
  if (services.some(s => s.status === 'PARTIAL_OUTAGE')) return 'PARTIAL_OUTAGE';
  if (services.some(s => s.status === 'DEGRADED'))       return 'DEGRADED';
  if (services.some(s => s.status === 'MAINTENANCE'))    return 'MAINTENANCE';
  return 'OPERATIONAL';
}

// Fallback when DB is unavailable — static but better than nothing
function getStaticFallbackStatuses() {
  return [
    { service: 'gemini_api',       displayName: 'Gemini AI',        status: 'OPERATIONAL', latencyMs: null },
    { service: 'groq_api',         displayName: 'Groq (Fallback)',   status: 'OPERATIONAL', latencyMs: null },
    { service: 'whatsapp_bridge',  displayName: 'WhatsApp Bridge',   status: 'OPERATIONAL', latencyMs: null },
    { service: 'database',         displayName: 'Database',          status: 'DEGRADED',    latencyMs: null },
    { service: 'core_api',         displayName: 'Core API',          status: 'OPERATIONAL', latencyMs: null },
  ];
}
