/**
 * OZONE TERMINAL ASSISTANT
 * ─────────────────────────────────────────────────────────────────────────────
 * Powers the interactive terminal on the homepage.
 * Streams responses via Server-Sent Events (SSE).
 * Routes through Gemini with Groq fallback.
 * ─────────────────────────────────────────────────────────────────────────────
 */

import { GoogleGenerativeAI } from '@google/generative-ai';

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

// ─── Shared History Type ───────────────────────────────────────────────────

type ConversationHistory = Array<{ role: 'user' | 'model'; content: string }>;

// ─── Gemini Streaming ─────────────────────────────────────────────────────

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

/**
 * Streams a response from Gemini.
 * Throws on API / network failure so the caller can fall back to Groq.
 */
async function* streamGemini(
  userMessage: string,
  history: ConversationHistory
): AsyncGenerator<string> {
  const model = genAI.getGenerativeModel({
    model:             process.env.TERMINAL_MODEL ?? 'gemini-3.1-flash-lite',
    systemInstruction: OZONE_TERMINAL_SYSTEM_PROMPT,
    generationConfig: {
      maxOutputTokens: 512,
      temperature:     0.6,
      topP:            0.9,
    },
  });

  const geminiHistory = history.map((m) => ({
    role:  m.role,
    parts: [{ text: m.content }],
  }));

  const chat   = model.startChat({ history: geminiHistory });
  const result = await chat.sendMessageStream(userMessage);

  for await (const chunk of result.stream) {
    const text = chunk.text();
    if (text) yield text;
  }
}

// ─── Groq Fallback Streaming ──────────────────────────────────────────────
// Uses Groq's OpenAI-compatible chat completions endpoint with SSE streaming.
// Model default matches the boot sequence: llama-3.1-8b-instant

async function* streamGroq(
  userMessage: string,
  history: ConversationHistory
): AsyncGenerator<string> {
  const messages = [
    { role: 'system',    content: OZONE_TERMINAL_SYSTEM_PROMPT },
    ...history.map((m) => ({
      role:    m.role === 'model' ? 'assistant' : 'user',
      content: m.content,
    })),
    { role: 'user', content: userMessage },
  ];

  const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method:  'POST',
    headers: {
      'Content-Type':  'application/json',
      'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
    },
    body: JSON.stringify({
      model:      process.env.GROQ_MODEL ?? 'llama-3.1-8b-instant',
      messages,
      max_tokens: 512,
      temperature: 0.6,
      stream:     true,
    }),
  });

  if (!response.ok) {
    throw new Error(`Groq API error: ${response.status} ${response.statusText}`);
  }

  const reader  = response.body!.getReader();
  const decoder = new TextDecoder();
  let   buffer  = '';

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split('\n');
    buffer = lines.pop() ?? '';

    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed.startsWith('data:')) continue;

      const raw = trimmed.slice(5).trim();
      if (raw === '[DONE]') return;

      try {
        const parsed  = JSON.parse(raw);
        const content = parsed.choices?.[0]?.delta?.content;
        if (content) yield content;
      } catch {
        // Malformed SSE chunk — skip
      }
    }
  }
}

// ─── Public API: streamTerminalResponse ──────────────────────────────────
/**
 * Streams a terminal response.
 * Tries Gemini first; on any failure, transparently falls back to Groq.
 * Returns an async generator of text chunks.
 */
export async function* streamTerminalResponse(
  userMessage: string,
  history: ConversationHistory
): AsyncGenerator<string> {
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

// ─── Terminal Command Processor ───────────────────────────────────────────
// Special commands that bypass the LLM entirely for instant responses

export type TerminalCommand = {
  output: string[];
  isCommand: true;
} | null;

export function processCommand(input: string): TerminalCommand {
  const cmd = input.trim().toLowerCase();

  const commands: Record<string, string[]> = {
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
      '  Or just type any question — the AI will answer.',
    ],

    services: [
      '  ┌─ SERVICES ──────────────────────────────┐',
      '  │  [1] Assistant Forge    AI + RAG + Agents │',
      '  │  [2] Bot Infrastructure WhatsApp + Bots   │',
      '  │  [3] Web & App Lab      Next.js + Mobile  │',
      '  │  [4] Game Lab           WebGL + Three.js  │',
      '  └─────────────────────────────────────────-┘',
    ],

    stack: [
      '  FRONTEND   Next.js 15 · React 19 · Tailwind 4',
      '  BACKEND    Node.js · Prisma ORM · PostgreSQL',
      '  AI/ML      Gemini · Groq · OpenRouter (9 models)',
      '  AUTH       NextAuth.js v5 · Supabase',
      '  DEPLOY     Vercel · DigitalOcean · Docker',
      '  BOTS       whatsapp-web.js · Puppeteer · p-queue',
    ],

    contact: [
      '  EMAIL       founders@ozonelabs.io',
      '  WHATSAPP    [Request via email]',
      '  INSTAGRAM   @ozonelabs',
      '  RESPONSE    < 24 hours',
    ],

    status: [
      '  Checking system status...',
      '  → Redirecting to /transparency',
    ],
  };

  if (cmd in commands) {
    return { output: commands[cmd], isCommand: true };
  }

  return null;
}