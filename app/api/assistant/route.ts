/**
 * TERMINAL ASSISTANT API — Streaming (SSE)
 * ─────────────────────────────────────────────────────────────────────────────
 * Route:   POST /api/assistant
 * Runtime: Edge (Vercel Edge Functions) — lowest possible latency
 *
 * Protocol: Server-Sent Events (SSE)
 * - Each text chunk is sent as: data: {"chunk": "..."}\n\n
 * - Stream end is signalled with: data: [DONE]\n\n
 * - Errors are sent as: data: {"error": "..."}\n\n
 *
 * Rate limiting: 30 requests per minute per IP (in-memory, resets on cold start)
 * For production: replace with Upstash Redis rate limiter
 * ─────────────────────────────────────────────────────────────────────────────
 */

export const runtime = 'edge'; // Forces Vercel Edge Runtime

import { streamTerminalResponse, processCommand } from '@/lib/ai/assistant';
import { z } from 'zod';

// ─── Request Schema ───────────────────────────────────────────────────────────

const RequestSchema = z.object({
  message: z.string().min(1).max(2000),
  history: z
    .array(
      z.object({
        role:    z.enum(['user', 'model']),
        content: z.string().max(4000),
      })
    )
    .max(20) // Cap history at 20 turns to prevent prompt inflation
    .default([]),
});

// ─── Simple In-Memory Rate Limiter ────────────────────────────────────────────
// Edge runtime doesn't support Node.js APIs — using Map + timestamps
// Production: swap this for Upstash Redis (@upstash/ratelimit)

const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT   = 30; // requests per window
const WINDOW_MS    = 60 * 1000; // 1 minute

function checkRateLimit(ip: string): boolean {
  const now    = Date.now();
  const entry  = rateLimitMap.get(ip);

  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return true;
  }

  if (entry.count >= RATE_LIMIT) return false;
  entry.count++;
  return true;
}

// ─── Route Handler ─────────────────────────────────────────────────────────

export async function POST(request: Request) {
  // ── Rate limiting ──────────────────────────────────────────────────────
  const ip = request.headers.get('x-forwarded-for') ?? 'anonymous';
  if (!checkRateLimit(ip)) {
    return new Response('Too many requests', { status: 429 });
  }

  // ── Parse & validate body ──────────────────────────────────────────────
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return new Response('Invalid JSON', { status: 400 });
  }

  const parsed = RequestSchema.safeParse(body);
  if (!parsed.success) {
    return new Response(JSON.stringify({ error: 'Invalid request', issues: parsed.error.issues }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const { message, history } = parsed.data;

  // ── Check for special commands (instant, no LLM) ──────────────────────
  const commandResult = processCommand(message);
  if (commandResult) {
    const outputText = commandResult.output.join('\n');
    const stream = new ReadableStream({
      start(controller) {
        const encoder = new TextEncoder();
        // Send the command output as a single chunk
        controller.enqueue(encoder.encode(`data: ${JSON.stringify({ chunk: outputText })}\n\n`));
        controller.enqueue(encoder.encode('data: [DONE]\n\n'));
        controller.close();
      },
    });

    return new Response(stream, {
      headers: {
        'Content-Type':                'text/event-stream',
        'Cache-Control':               'no-cache, no-transform',
        'Connection':                  'keep-alive',
        'Access-Control-Allow-Origin': '*',
        'X-Accel-Buffering':           'no', // Prevents Nginx from buffering SSE
      },
    });
  }

  // ── Stream LLM response ────────────────────────────────────────────────
  const encoder = new TextEncoder();
  let   isAborted = false;

  const stream = new ReadableStream({
    async start(controller) {
      const send = (data: object) => {
        if (!isAborted) {
          try {
            controller.enqueue(encoder.encode(`data: ${JSON.stringify(data)}\n\n`));
          } catch {
            isAborted = true;
          }
        }
      };

      try {
        for await (const chunk of streamTerminalResponse(message, history)) {
          if (isAborted) break;
          send({ chunk });
        }
        send({ done: true });
        controller.enqueue(encoder.encode('data: [DONE]\n\n'));
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Unknown error';
        send({ error: message });
      } finally {
        controller.close();
      }
    },
    cancel() {
      isAborted = true;
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type':                'text/event-stream',
      'Cache-Control':               'no-cache, no-transform',
      'Connection':                  'keep-alive',
      'Access-Control-Allow-Origin': '*',
      'X-Accel-Buffering':           'no',
    },
  });
}

// Handle CORS preflight
export async function OPTIONS() {
  return new Response(null, {
    headers: {
      'Access-Control-Allow-Origin':  '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
