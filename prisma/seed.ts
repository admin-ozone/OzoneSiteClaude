/**
 * PRISMA SEED
 * ─────────────────────────────────────────────────────────────────────────────
 * Seeds the database with initial ServiceStatus rows for the Transparency Hub.
 * Run with: npm run db:seed
 * ─────────────────────────────────────────────────────────────────────────────
 */

import { PrismaClient } from '@prisma/client';

const db = new PrismaClient();

async function main() {
  console.log('Seeding database…');

  // ── Service Status rows ──────────────────────────────────────────────────
  // These power the /transparency page and /api/status route.

  const services = [
    { service: 'gemini_api',      displayName: 'Gemini AI (Primary LLM)' },
    { service: 'groq_api',        displayName: 'Groq (Fallback LLM)'     },
    { service: 'openrouter_api',  displayName: 'OpenRouter (Fallback B)'  },
    { service: 'whatsapp_bridge', displayName: 'WhatsApp Bridge'          },
    { service: 'database',        displayName: 'Database (Supabase)'      },
    { service: 'core_api',        displayName: 'Core API'                 },
  ];

  for (const svc of services) {
    await db.serviceStatus.upsert({
      where:  { service: svc.service },
      create: {
        service:       svc.service,
        displayName:   svc.displayName,
        status:        'OPERATIONAL',
        uptimePercent: 100,
        lastCheckedAt: new Date(),
      },
      update: {},
    });
    console.log(`  [✓] ${svc.displayName}`);
  }

  console.log('Seed complete.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
