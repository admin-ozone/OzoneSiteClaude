/**
 * OZONE ASSISTANT
 * ─────────────────────────────────────────────────────────────────────────────
 * Powers the Uzo AI chat bubble.
 * Streams responses via Server-Sent Events (SSE).
 * Provider chain: Gemini → Groq → OpenRouter
 * ─────────────────────────────────────────────────────────────────────────────
 */

import { GoogleGenerativeAI } from '@google/generative-ai';

// ─── System Prompt ─────────────────────────────────────────────────────────

const SYSTEM_PROMPT = `
<persona>
  You are Uzo — the AI assistant for Ozone Labs.
  You are helpful, technically precise, and confident. Keep responses concise and direct.
  Never use terminal formatting, ASCII headers, or system boot messages.
  Just answer naturally, like a knowledgeable team member would.
</persona>

<ozone_labs_knowledge>
  Ozone Labs is a deep-tech agency based in Islamabad, Pakistan.
  
  CORE SERVICES:
  1. Assistant Forge — Custom AI assistants using RAG and agentic workflows. Deployed on WhatsApp Business API, web widgets, Telegram. Supports any language. Powered by Gemini with intelligent fallbacks.
  2. Bot Infrastructure — WhatsApp automation, Puppeteer browser bots, proxy rotation, stealth fingerprinting. Custom webhook architecture.
  3. Web & App Lab — Full-stack Next.js applications, React Native mobile apps, Progressive Web Apps. PostgreSQL, Supabase, NextAuth.
  4. Game Lab — WebGL games, Three.js interactive experiences, browser-based 2D/3D applications.
  
  CONTACT: founders@ozonelabs.io | Instagram: @ozonelabs
</ozone_labs_knowledge>

<rules>
  1. Be concise — under 150 words unless the question genuinely needs more
  2. Never output terminal headers, system boot text, or ASCII art
  3. If asked about pricing: "Pricing is scoped per project. Reach us at founders@ozonelabs.io"
  4. Respond in the same language the user writes in
  5. Never fabricate specifications, pricing, or team details
</rules>
`.trim();

// ─── Types ─────────────────────────────────────────────────────────────────

type ConversationHistory = Array<{ role: 'user' | 'model'; content: string }>;

// ─── Gemini ───────────────────────────────────────────────────────────────

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

async function* streamGemini(
  userMessage: string,
  history: ConversationHistory
): AsyncGenerator<string> {
  const model = genAI.getGenerativeModel({
    model:             process.env.TERMINAL_MODEL ?? 'gemini-2.0-flash-lite',
    systemInstruction: SYSTEM_PROMPT,
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

// ─── Groq ─────────────────────────────────────────────────────────────────

async function* streamGroq(
  userMessage: string,
  history: ConversationHistory
): AsyncGenerator<string> {
  const messages = [
    { role: 'system', content: SYSTEM_PROMPT },
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
      model:       process.env.GROQ_MODEL ?? 'llama-3.1-8b-instant',
      messages,
      max_tokens:  512,
      temperature: 0.6,
      stream:      true,
    }),
  });

  if (!response.ok) {
    throw new Error(`Groq error: ${response.status} ${response.statusText}`);
  }

  yield* parseOpenAIStream(response);
}

// ─── OpenRouter ───────────────────────────────────────────────────────────

async function* streamOpenRouter(
  userMessage: string,
  history: ConversationHistory
): AsyncGenerator<string> {
  const messages = [
    { role: 'system', content: SYSTEM_PROMPT },
    ...history.map((m) => ({
      role:    m.role === 'model' ? 'assistant' : 'user',
      content: m.content,
    })),
    { role: 'user', content: userMessage },
  ];

  const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method:  'POST',
    headers: {
      'Content-Type':  'application/json',
      'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
      'HTTP-Referer':  process.env.APP_URL ?? 'https://ozonelabs.io',
      'X-Title':       'Ozone Labs',
    },
    body: JSON.stringify({
      model:       process.env.OPENROUTER_MODEL ?? 'meta-llama/llama-3.1-8b-instruct:free',
      messages,
      max_tokens:  512,
      temperature: 0.6,
      stream:      true,
    }),
  });

  if (!response.ok) {
    throw new Error(`OpenRouter error: ${response.status} ${response.statusText}`);
  }

  yield* parseOpenAIStream(response);
}

// ─── Shared SSE parser (OpenAI-compatible) ────────────────────────────────

async function* parseOpenAIStream(response: Response): AsyncGenerator<string> {
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
        // Malformed chunk — skip
      }
    }
  }
}

// ─── Public API ───────────────────────────────────────────────────────────
/**
 * Tries Gemini → Groq → OpenRouter in order.
 * Each failure is logged server-side only.
 */
export async function* streamTerminalResponse(
  userMessage: string,
  history: ConversationHistory
): AsyncGenerator<string> {
  try {
    yield* streamGemini(userMessage, history);
    return;
  } catch (err) {
    console.error('[assistant] Gemini failed:', err);
  }

  try {
    yield* streamGroq(userMessage, history);
    return;
  } catch (err) {
    console.error('[assistant] Groq failed:', err);
  }

  try {
    yield* streamOpenRouter(userMessage, history);
    return;
  } catch (err) {
    console.error('[assistant] OpenRouter failed:', err);
    throw new Error('All LLM providers unavailable. Please try again shortly.');
  }
}

// ─── Command Processor ────────────────────────────────────────────────────

export type TerminalCommand = { output: string[]; isCommand: true } | null;

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
      '  AI/ML      Gemini · Groq · OpenRouter',
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