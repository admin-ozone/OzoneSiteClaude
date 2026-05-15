(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push(["chunks/[root-of-the-server]__9f78c18e._.js",
"[externals]/node:buffer [external] (node:buffer, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("node:buffer", () => require("node:buffer"));

module.exports = mod;
}),
"[externals]/node:async_hooks [external] (node:async_hooks, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("node:async_hooks", () => require("node:async_hooks"));

module.exports = mod;
}),
"[project]/lib/ai/assistant.ts [app-edge-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * OZONE TERMINAL ASSISTANT
 * ─────────────────────────────────────────────────────────────────────────────
 * Powers the interactive terminal on the homepage.
 * Streams responses via Server-Sent Events (SSE).
 * Routes through Gemini with Groq fallback.
 * ─────────────────────────────────────────────────────────────────────────────
 */ __turbopack_context__.s([
    "processCommand",
    ()=>processCommand,
    "streamTerminalResponse",
    ()=>streamTerminalResponse
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$google$2f$generative$2d$ai$2f$dist$2f$index$2e$mjs__$5b$app$2d$edge$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@google/generative-ai/dist/index.mjs [app-edge-route] (ecmascript)");
;
// ─── System Prompt ─────────────────────────────────────────────────────────
const OZONE_TERMINAL_SYSTEM_PROMPT = `
<persona>
  You are OzoneOS v1.0 — the AI assistant powering Ozone Labs' public terminal.
  You are a highly technical, precise, and confident AI built by Ozone Labs.
  Tone: technical but approachable. Concise. Never verbose. Think CLI output, not essays.
</persona>

<ozone_labs_knowledge>
  Ozone Labs is a deep-tech agency based in Lahore, Pakistan.
  
  CORE SERVICES:
  1. Assistant Forge — Custom AI assistants for local businesses using RAG (Retrieval-Augmented Generation) and agentic workflows. Supports WhatsApp Business API, web widgets, Telegram. Trilingual: English, Roman Urdu, Urdu. Powered by Gemini, with Groq and OpenRouter as intelligent fallbacks.
  
  2. Bot Infrastructure — WhatsApp automation (whatsapp-web.js), Puppeteer-based browser bots, proxy rotation, stealth fingerprinting. Custom webhook architecture.
  
  3. Web & App Lab — Full-stack Next.js applications, React Native mobile apps, Progressive Web Apps. Database: PostgreSQL via Supabase. Auth: NextAuth.js.
  
  4. Game Lab — WebGL games, Three.js interactive experiences, browser-based 2D/3D applications.
  
  DIFFERENTIATORS:
  - Zero dependency on expensive proprietary SaaS — we build the infrastructure
  - Free-tier LLM architecture: Gemini + Groq + OpenRouter = $0 LLM cost at scale
  - Multi-provider fallback chains: 9 models, zero downtime if any provider fails
  - Trilingual AI: Roman Urdu, Urdu, and English — rare in the region
  - Full transparency: open-source architecture, real-time status dashboard
  
  CONTACT: founders@ozonelabs.io | Instagram: @ozonelabs
</ozone_labs_knowledge>

<terminal_rules>
  1. Format responses like terminal output when appropriate — use short lines
  2. Use markdown code blocks for technical information
  3. Keep responses under 200 words unless the question demands more
  4. If asked about pricing, say: "Pricing is scoped per project. Contact founders@ozonelabs.io"
  5. If asked to do something outside Ozone Labs context, handle it naturally — you are a general-purpose AI in the terminal
  6. Respond in the same language the user writes in (English or Roman Urdu)
  7. NEVER fabricate technical specifications, pricing, or team details
</terminal_rules>
`.trim();
// ─── Gemini Streaming ─────────────────────────────────────────────────────
const genAI = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$google$2f$generative$2d$ai$2f$dist$2f$index$2e$mjs__$5b$app$2d$edge$2d$route$5d$__$28$ecmascript$29$__["GoogleGenerativeAI"](process.env.GEMINI_API_KEY);
/**
 * Streams a response from Gemini.
 * Throws on API / network failure so the caller can fall back to Groq.
 */ async function* streamGemini(userMessage, history) {
    const model = genAI.getGenerativeModel({
        model: process.env.TERMINAL_MODEL ?? 'gemini-3.1-flash-lite',
        systemInstruction: OZONE_TERMINAL_SYSTEM_PROMPT,
        generationConfig: {
            maxOutputTokens: 512,
            temperature: 0.6,
            topP: 0.9
        }
    });
    const geminiHistory = history.map((m)=>({
            role: m.role,
            parts: [
                {
                    text: m.content
                }
            ]
        }));
    const chat = model.startChat({
        history: geminiHistory
    });
    const result = await chat.sendMessageStream(userMessage);
    for await (const chunk of result.stream){
        const text = chunk.text();
        if (text) yield text;
    }
}
// ─── Groq Fallback Streaming ──────────────────────────────────────────────
// Uses Groq's OpenAI-compatible chat completions endpoint with SSE streaming.
// Model default matches the boot sequence: llama-3.1-8b-instant
async function* streamGroq(userMessage, history) {
    const messages = [
        {
            role: 'system',
            content: OZONE_TERMINAL_SYSTEM_PROMPT
        },
        ...history.map((m)=>({
                role: m.role === 'model' ? 'assistant' : 'user',
                content: m.content
            })),
        {
            role: 'user',
            content: userMessage
        }
    ];
    const response = await fetch('https://api.groq.com/openai/v1/terminal/completions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.GROQ_API_KEY}`
        },
        body: JSON.stringify({
            model: process.env.GROQ_MODEL ?? 'llama-3.1-8b-instant',
            messages,
            max_tokens: 512,
            temperature: 0.6,
            stream: true
        })
    });
    if (!response.ok) {
        throw new Error(`Groq API error: ${response.status} ${response.statusText}`);
    }
    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';
    while(true){
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, {
            stream: true
        });
        const lines = buffer.split('\n');
        buffer = lines.pop() ?? '';
        for (const line of lines){
            const trimmed = line.trim();
            if (!trimmed.startsWith('data:')) continue;
            const raw = trimmed.slice(5).trim();
            if (raw === '[DONE]') return;
            try {
                const parsed = JSON.parse(raw);
                const content = parsed.choices?.[0]?.delta?.content;
                if (content) yield content;
            } catch  {
            // Malformed SSE chunk — skip
            }
        }
    }
}
async function* streamTerminalResponse(userMessage, history) {
    try {
        yield* streamGemini(userMessage, history);
    } catch (geminiErr) {
        // Log server-side for observability; client never sees this
        console.error('[assistant] Gemini failed — falling back to Groq:', geminiErr);
        try {
            yield* streamGroq(userMessage, history);
        } catch (groqErr) {
            console.error('[assistant] Groq fallback also failed:', groqErr);
            // Surface a clean error to the SSE handler in route.ts
            throw new Error('All LLM providers unavailable. Please try again shortly.');
        }
    }
}
function processCommand(input) {
    const cmd = input.trim().toLowerCase();
    const commands = {
        help: [
            '  OZONE TERMINAL v1.0',
            '  ─────────────────────────────────────────',
            '  help          Show this help message',
            '  services      List all Ozone Labs services',
            '  stack         View our tech stack',
            '  status        Check system status',
            '  contact       Get in touch',
            '  clear         Clear the terminal',
            '  ',
            '  Or just type any question — the AI will answer.'
        ],
        services: [
            '  ┌─ SERVICES ──────────────────────────────┐',
            '  │  [1] Assistant Forge    AI + RAG + Agents │',
            '  │  [2] Bot Infrastructure WhatsApp + Bots   │',
            '  │  [3] Web & App Lab      Next.js + Mobile  │',
            '  │  [4] Game Lab           WebGL + Three.js  │',
            '  └─────────────────────────────────────────-┘'
        ],
        stack: [
            '  FRONTEND   Next.js 15 · React 19 · Tailwind 4',
            '  BACKEND    Node.js · Prisma ORM · PostgreSQL',
            '  AI/ML      Gemini · Groq · OpenRouter (9 models)',
            '  AUTH       NextAuth.js v5 · Supabase',
            '  DEPLOY     Vercel · DigitalOcean · Docker',
            '  BOTS       whatsapp-web.js · Puppeteer · p-queue'
        ],
        contact: [
            '  EMAIL       founders@ozonelabs.io',
            '  WHATSAPP    [Request via email]',
            '  INSTAGRAM   @ozonelabs',
            '  RESPONSE    < 24 hours'
        ],
        status: [
            '  Checking system status...',
            '  → Redirecting to /transparency'
        ]
    };
    if (cmd in commands) {
        return {
            output: commands[cmd],
            isCommand: true
        };
    }
    return null;
}
}),
"[project]/app/api/assistant/route.ts [app-edge-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

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
 */ __turbopack_context__.s([
    "OPTIONS",
    ()=>OPTIONS,
    "POST",
    ()=>POST,
    "runtime",
    ()=>runtime
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$ai$2f$assistant$2e$ts__$5b$app$2d$edge$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/ai/assistant.ts [app-edge-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$edge$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__ = __turbopack_context__.i("[project]/node_modules/zod/v3/external.js [app-edge-route] (ecmascript) <export * as z>");
const runtime = 'edge'; // Forces Vercel Edge Runtime
;
;
// ─── Request Schema ───────────────────────────────────────────────────────────
const RequestSchema = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$edge$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
    message: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$edge$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().min(1).max(2000),
    history: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$edge$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].array(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$edge$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
        role: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$edge$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].enum([
            'user',
            'model'
        ]),
        content: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$edge$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().max(4000)
    })).max(20) // Cap history at 20 turns to prevent prompt inflation
    .default([])
});
// ─── Simple In-Memory Rate Limiter ────────────────────────────────────────────
// Edge runtime doesn't support Node.js APIs — using Map + timestamps
// Production: swap this for Upstash Redis (@upstash/ratelimit)
const rateLimitMap = new Map();
const RATE_LIMIT = 30; // requests per window
const WINDOW_MS = 60 * 1000; // 1 minute
function checkRateLimit(ip) {
    const now = Date.now();
    const entry = rateLimitMap.get(ip);
    if (!entry || now > entry.resetAt) {
        rateLimitMap.set(ip, {
            count: 1,
            resetAt: now + WINDOW_MS
        });
        return true;
    }
    if (entry.count >= RATE_LIMIT) return false;
    entry.count++;
    return true;
}
async function POST(request) {
    // ── Rate limiting ──────────────────────────────────────────────────────
    const ip = request.headers.get('x-forwarded-for') ?? 'anonymous';
    if (!checkRateLimit(ip)) {
        return new Response('Too many requests', {
            status: 429
        });
    }
    // ── Parse & validate body ──────────────────────────────────────────────
    let body;
    try {
        body = await request.json();
    } catch  {
        return new Response('Invalid JSON', {
            status: 400
        });
    }
    const parsed = RequestSchema.safeParse(body);
    if (!parsed.success) {
        return new Response(JSON.stringify({
            error: 'Invalid request',
            issues: parsed.error.issues
        }), {
            status: 400,
            headers: {
                'Content-Type': 'application/json'
            }
        });
    }
    const { message, history } = parsed.data;
    // ── Check for special commands (instant, no LLM) ──────────────────────
    const commandResult = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$ai$2f$assistant$2e$ts__$5b$app$2d$edge$2d$route$5d$__$28$ecmascript$29$__["processCommand"])(message);
    if (commandResult) {
        const outputText = commandResult.output.join('\n');
        const stream = new ReadableStream({
            start (controller) {
                const encoder = new TextEncoder();
                // Send the command output as a single chunk
                controller.enqueue(encoder.encode(`data: ${JSON.stringify({
                    chunk: outputText
                })}\n\n`));
                controller.enqueue(encoder.encode('data: [DONE]\n\n'));
                controller.close();
            }
        });
        return new Response(stream, {
            headers: {
                'Content-Type': 'text/event-stream',
                'Cache-Control': 'no-cache, no-transform',
                'Connection': 'keep-alive',
                'Access-Control-Allow-Origin': '*',
                'X-Accel-Buffering': 'no'
            }
        });
    }
    // ── Stream LLM response ────────────────────────────────────────────────
    const encoder = new TextEncoder();
    let isAborted = false;
    const stream = new ReadableStream({
        async start (controller) {
            const send = (data)=>{
                if (!isAborted) {
                    try {
                        controller.enqueue(encoder.encode(`data: ${JSON.stringify(data)}\n\n`));
                    } catch  {
                        isAborted = true;
                    }
                }
            };
            try {
                for await (const chunk of (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$ai$2f$assistant$2e$ts__$5b$app$2d$edge$2d$route$5d$__$28$ecmascript$29$__["streamTerminalResponse"])(message, history)){
                    if (isAborted) break;
                    send({
                        chunk
                    });
                }
                send({
                    done: true
                });
                controller.enqueue(encoder.encode('data: [DONE]\n\n'));
            } catch (err) {
                const message = err instanceof Error ? err.message : 'Unknown error';
                send({
                    error: message
                });
            } finally{
                controller.close();
            }
        },
        cancel () {
            isAborted = true;
        }
    });
    return new Response(stream, {
        headers: {
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache, no-transform',
            'Connection': 'keep-alive',
            'Access-Control-Allow-Origin': '*',
            'X-Accel-Buffering': 'no'
        }
    });
}
async function OPTIONS() {
    return new Response(null, {
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type'
        }
    });
}
}),
]);

//# sourceMappingURL=%5Broot-of-the-server%5D__9f78c18e._.js.map