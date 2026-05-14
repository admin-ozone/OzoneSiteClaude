'use client';

/**
 * OZONE LABS — HOMEPAGE
 * ─────────────────────────────────────────────────────────────────────────────
 * Sections:
 *   1. Hero          — headline + live terminal demo
 *   2. Differentiators — 4 key stats
 *   3. Services      — 4 service cards  (#services)
 *   4. Architecture  — zero-cost LLM chain
 *   5. Work          — project categories (#work)
 *   6. CTA           — email contact
 *   7. Footer
 * ─────────────────────────────────────────────────────────────────────────────
 */

import { Suspense } from 'react';
import Link from 'next/link';
import { Navigation } from '@/components/Navigation';
import { OzoneTerminal } from '@/components/terminal/OzoneTerminal';
import { cn } from '@/lib/utils';

// ─── Static data ──────────────────────────────────────────────────────────────

const STATS = [
  { value: '9',    label: 'LLM Models',      sub: 'in fallback chain'    },
  { value: '$0',   label: 'LLM Cost',         sub: 'free-tier architecture'},
  { value: '3',    label: 'Languages',         sub: 'EN · Roman Urdu · UR' },
  { value: '99.9', label: 'Uptime',            sub: 'multi-provider failover'},
];

const SERVICES = [
  {
    id:    'assistant',
    tag:   '01 — ASSISTANT FORGE',
    title: 'AI Assistants that speak your customers\'s language',
    body:  'WhatsApp bots, web widgets, and agentic workflows. RAG-powered knowledge bases. Trilingual by default: English, Roman Urdu, Urdu. Powered by a 9-model fallback chain that costs you $0.',
    span:  'col-span-2',
    items: ['RAG Knowledge Base', 'WhatsApp Business API', 'Multilingual (EN/UR)', '9-Model Fallback Chain'],
    accent: '#00E5FF',
  },
  {
    id:    'bots',
    tag:   '02 — BOT INFRASTRUCTURE',
    title: 'Automation that scales silently',
    body:  'Browser automation, proxy rotation, stealth fingerprinting. We build the infrastructure layer that your competitors can\'t see.',
    span:  'col-span-1',
    items: ['Puppeteer / Playwright', 'Proxy Rotation', 'Stealth Fingerprinting'],
    accent: '#00FF88',
  },
  {
    id:    'web',
    tag:   '03 — WEB & APP LAB',
    title: 'Production apps that ship on time',
    body:  'Next.js 15, React Native, Progressive Web Apps. Supabase backend, NextAuth.js, edge-deployed APIs.',
    span:  'col-span-1',
    items: ['Next.js 15 App Router', 'React Native', 'Supabase + Prisma'],
    accent: '#FFB800',
  },
  {
    id:    'games',
    tag:   '04 — GAME LAB',
    title: 'Interactive experiences',
    body:  'WebGL and Three.js games, browser-based 2D/3D applications, and interactive product showcases.',
    span:  'col-span-1',
    items: ['Three.js / WebGL', 'Browser 2D/3D', 'Interactive Showcases'],
    accent: '#FF3D57',
  },
];

const STACK = [
  { name: 'Next.js 15',    category: 'Frontend'  },
  { name: 'React 19',      category: 'Frontend'  },
  { name: 'Tailwind CSS',  category: 'Frontend'  },
  { name: 'Framer Motion', category: 'Frontend'  },
  { name: 'Node.js',       category: 'Backend'   },
  { name: 'Prisma ORM',    category: 'Backend'   },
  { name: 'PostgreSQL',    category: 'Database'  },
  { name: 'Supabase',      category: 'Database'  },
  { name: 'Gemini 2.0',    category: 'AI/ML'     },
  { name: 'Groq Llama',    category: 'AI/ML'     },
  { name: 'OpenRouter',    category: 'AI/ML'     },
  { name: 'NextAuth.js',   category: 'Auth'      },
  { name: 'TypeScript',    category: 'Language'  },
  { name: 'Vercel Edge',   category: 'Infra'     },
  { name: 'Puppeteer',     category: 'Automation'},
  { name: 'whatsapp-web',  category: 'Messaging' },
];

const WORK = [
  {
    client: 'La Forza Gyms',
    type:   'AI Assistant',
    desc:   'WhatsApp AI assistant for a premium fitness gym in Bahria Town Lahore. Handles membership inquiries, lead capture, and booking — trilingual, 24/7.',
    tags:   ['WhatsApp Bot', 'Gemini API', 'Lead Capture', 'Roman Urdu'],
    status: 'Live',
  },
  {
    client: 'DHA Realty',
    type:   'AI Assistant',
    desc:   'Property enquiry bot for a real estate agency in DHA Lahore. Qualifies buyers, captures leads, and handles 200+ daily inquiries autonomously.',
    tags:   ['WhatsApp Bot', 'RAG', 'Property Tech', 'Fallback Chain'],
    status: 'Live',
  },
  {
    client: 'Modular Bot Framework',
    type:   'Infrastructure',
    desc:   'Multi-tenant bot framework: one engine powering unlimited clients. SQLite memory, p-queue rate limiting, dashboard with live WebSocket monitoring.',
    tags:   ['Node.js', 'SQLite', 'WebSocket', 'Multi-tenant'],
    status: 'Internal',
  },
];

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function HomePage() {
  return (
    <>
      <Navigation />

      <main className="bg-oz-black text-oz-text overflow-x-hidden">

        {/* ── HERO ─────────────────────────────────────────────────────────── */}
        <section className="relative min-h-screen flex flex-col justify-center pt-16">
          {/* Grid background */}
          <div className="absolute inset-0 bg-grid opacity-30 pointer-events-none" />
          {/* Radial glow from bottom-left */}
          <div className="absolute inset-0 pointer-events-none"
            style={{ background: 'radial-gradient(ellipse 60% 50% at 10% 90%, rgba(0,229,255,0.06) 0%, transparent 70%)' }} />

          <div className="relative z-10 max-w-7xl mx-auto px-6 w-full">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center py-20 lg:py-0 min-h-[calc(100vh-64px)]">

              {/* Left: Copy */}
              <div className="flex flex-col justify-center">
                {/* Eyebrow */}
                <div className="flex items-center gap-3 mb-8">
                  <span className="h-px w-6 bg-oz-cyan" />
                  <span className="font-mono text-xs text-oz-cyan tracking-[0.25em] uppercase">
                    Ozone Labs — Lahore, Pakistan
                  </span>
                </div>

                {/* Headline */}
                <h1 className="font-display text-5xl sm:text-6xl xl:text-7xl font-bold tracking-tight leading-[1.0] mb-6">
                  We build<br />
                  <span className="text-gradient-cyan">AI that works</span><br />
                  for business<span className="text-oz-cyan">.</span>
                </h1>

                {/* Sub */}
                <p className="text-oz-text-2 text-lg leading-relaxed mb-10 max-w-md">
                  AI assistants, bots, apps, and games.
                  No wrappers. No fluff. Just production infrastructure
                  that generates real leads.
                </p>

                {/* CTAs */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <a
                    href="mailto:founders@ozonelabs.io"
                    className={cn(
                      'inline-flex items-center justify-center gap-2',
                      'font-mono text-sm font-bold tracking-widest uppercase',
                      'bg-oz-cyan text-oz-black',
                      'h-12 px-8 rounded-sm',
                      'hover:bg-white hover:shadow-[0_0_32px_rgba(0,229,255,0.5)]',
                      'transition-all duration-200'
                    )}
                  >
                    Start a Project
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
                    </svg>
                  </a>
                  <Link
                    href="#services"
                    className={cn(
                      'inline-flex items-center justify-center',
                      'font-mono text-sm tracking-widest uppercase',
                      'border border-oz-border-2 text-oz-text-2',
                      'h-12 px-8 rounded-sm',
                      'hover:border-oz-cyan/40 hover:text-oz-text',
                      'transition-all duration-200'
                    )}
                  >
                    View Services
                  </Link>
                </div>
              </div>

              {/* Right: Terminal */}
              <div className="flex flex-col gap-4">
                <p className="font-mono text-xs text-oz-text-3 tracking-widest uppercase mb-1">
                  Live Terminal — Talk to OzoneOS
                </p>
                <Suspense fallback={
                  <div className="h-[460px] bg-oz-surface border border-oz-border rounded-sm animate-pulse" />
                }>
                  <OzoneTerminal />
                </Suspense>
                <p className="font-mono text-2xs text-oz-text-3 tracking-wider">
                  Try: <span className="text-oz-cyan cursor-pointer">help</span>,{' '}
                  <span className="text-oz-cyan">services</span>, or ask anything about what we build.
                </p>
              </div>

            </div>
          </div>

          {/* Scroll indicator */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-float">
            <span className="font-mono text-2xs text-oz-text-3 tracking-widest uppercase">scroll</span>
            <div className="h-8 w-px bg-gradient-to-b from-oz-border to-transparent" />
          </div>
        </section>

        {/* ── STATS MARQUEE ─────────────────────────────────────────────────── */}
        <section className="border-y border-oz-border bg-oz-surface/40 py-10">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-0 divide-x divide-oz-border">
              {STATS.map(({ value, label, sub }) => (
                <div key={label} className="flex flex-col items-center text-center px-8 first:pl-0 last:pr-0 py-4">
                  <span className="font-display text-4xl lg:text-5xl font-bold text-oz-text tracking-tight mb-1">
                    {value}
                    {value === '99.9' && <span className="text-oz-cyan text-2xl">%</span>}
                  </span>
                  <span className="font-mono text-xs text-oz-text-2 tracking-wider mb-1">{label}</span>
                  <span className="font-mono text-2xs text-oz-text-3 tracking-wider">{sub}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── SERVICES BENTO GRID ───────────────────────────────────────────── */}
        <section id="services" className="py-28 relative">
          <div className="absolute inset-0 bg-grid opacity-20 pointer-events-none" />
          <div className="relative z-10 max-w-7xl mx-auto px-6">

            {/* Section header */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-14">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <span className="h-px w-6 bg-oz-cyan/40" />
                  <span className="font-mono text-xs text-oz-cyan tracking-[0.2em] uppercase">What we build</span>
                </div>
                <h2 className="font-display text-4xl lg:text-5xl font-bold tracking-tight">
                  Four departments<span className="text-oz-cyan">.</span><br />
                  One studio<span className="text-oz-cyan">.</span>
                </h2>
              </div>
              <p className="text-oz-text-3 font-mono text-xs tracking-wider max-w-xs leading-relaxed">
                Specialised teams working in parallel. Same codebase standards across every project.
              </p>
            </div>

            {/* Bento grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {SERVICES.map((svc) => (
                <ServiceCard key={svc.id} {...svc} />
              ))}
            </div>
          </div>
        </section>

        {/* ── HOW IT WORKS ──────────────────────────────────────────────────── */}
        <section className="py-28 border-t border-oz-border bg-oz-surface/20">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex items-center gap-3 mb-4">
              <span className="h-px w-6 bg-oz-cyan/40" />
              <span className="font-mono text-xs text-oz-cyan tracking-[0.2em] uppercase">Architecture</span>
            </div>
            <h2 className="font-display text-4xl lg:text-5xl font-bold tracking-tight mb-16">
              Zero-cost AI.<br />Production-grade<span className="text-oz-cyan">.</span>
            </h2>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-px bg-oz-border rounded-sm overflow-hidden">
              {[
                {
                  n: '01',
                  title: 'Smart Routing',
                  body: 'Each message is classified as simple or complex. Simple messages go to the fastest, cheapest model. Complex queries route to the most capable.',
                },
                {
                  n: '02',
                  title: '9-Model Fallback',
                  body: 'Gemini → Groq → OpenRouter. If any provider throttles or goes down, the next one fires automatically. Zero downtime, zero manual intervention.',
                },
                {
                  n: '03',
                  title: 'Memory + Context',
                  body: 'SQLite in WAL mode with a sliding context window. Every session persists history. Language is detected once and pinned — no drift mid-conversation.',
                },
              ].map(({ n, title, body }) => (
                <div key={n} className="bg-oz-black p-8 lg:p-10">
                  <p className="font-mono text-oz-cyan text-xs tracking-[0.2em] mb-6">{n}</p>
                  <h3 className="font-display text-xl font-bold mb-4">{title}</h3>
                  <p className="text-oz-text-2 text-sm leading-relaxed">{body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── WORK ─────────────────────────────────────────────────────────── */}
        <section id="work" className="py-28 border-t border-oz-border">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex items-center gap-3 mb-4">
              <span className="h-px w-6 bg-oz-cyan/40" />
              <span className="font-mono text-xs text-oz-cyan tracking-[0.2em] uppercase">Selected Work</span>
            </div>
            <h2 className="font-display text-4xl lg:text-5xl font-bold tracking-tight mb-16">
              Built and<br />deployed<span className="text-oz-cyan">.</span>
            </h2>

            <div className="flex flex-col gap-px bg-oz-border rounded-sm overflow-hidden">
              {WORK.map((w, i) => (
                <WorkRow key={i} {...w} index={i} />
              ))}
            </div>
          </div>
        </section>

        {/* ── TECH STACK ────────────────────────────────────────────────────── */}
        <section className="py-28 border-t border-oz-border bg-oz-surface/20">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-8 mb-14">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <span className="h-px w-6 bg-oz-cyan/40" />
                  <span className="font-mono text-xs text-oz-cyan tracking-[0.2em] uppercase">Transparency Hub</span>
                </div>
                <h2 className="font-display text-4xl lg:text-5xl font-bold tracking-tight">
                  Open stack<span className="text-oz-cyan">.</span><br />
                  No black boxes<span className="text-oz-cyan">.</span>
                </h2>
              </div>
              <Link
                href="/transparency"
                className="font-mono text-xs tracking-widest uppercase text-oz-cyan border border-oz-cyan/20 hover:border-oz-cyan px-6 py-3 rounded-sm transition-all duration-200 shrink-0 self-start sm:self-auto"
              >
                View System Status →
              </Link>
            </div>

            <div className="flex flex-wrap gap-2">
              {STACK.map(({ name, category }) => (
                <StackTag key={name} name={name} category={category} />
              ))}
            </div>
          </div>
        </section>

        {/* ── ABOUT ─────────────────────────────────────────────────────────── */}
        <section id="about" className="py-28 border-t border-oz-border">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">

              <div>
                <div className="flex items-center gap-3 mb-4">
                  <span className="h-px w-6 bg-oz-cyan/40" />
                  <span className="font-mono text-xs text-oz-cyan tracking-[0.2em] uppercase">About</span>
                </div>
                <h2 className="font-display text-4xl lg:text-5xl font-bold tracking-tight mb-8">
                  Deep tech.<br />
                  Not a wrapper<span className="text-oz-cyan">.</span>
                </h2>
                <div className="space-y-4 text-oz-text-2 leading-relaxed">
                  <p>
                    Ozone Labs is a technical agency based in Lahore, Pakistan.
                    We don't resell SaaS tools with a markup — we build the underlying infrastructure.
                  </p>
                  <p>
                    Our AI architecture uses a 9-model fallback chain across Gemini, Groq, and OpenRouter.
                    That means $0 LLM cost at our volume, with better reliability than any single-provider setup.
                  </p>
                  <p>
                    Everything we build ships with trilingual support out of the box:
                    English, Roman Urdu, and Urdu script — because that's what your customers actually speak.
                  </p>
                </div>
              </div>

              {/* Terminal-style "manifest" */}
              <div className="bg-oz-surface border border-oz-border rounded-sm p-8 font-mono text-sm">
                <p className="text-oz-text-3 mb-6 text-xs tracking-widest uppercase">ozonelabs.manifest</p>
                {[
                  ['Performance',    'Ship fast. Iterate faster.'],
                  ['Transparency',   'Open stack. Real status. No black boxes.'],
                  ['Intelligence',   'Agentic workflows over scripted bots.'],
                  ['Language',       'English + Roman Urdu + Urdu — always.'],
                  ['Cost',           'Free-tier LLM infrastructure by design.'],
                  ['Reliability',    'Multi-provider fallback. 9 models deep.'],
                ].map(([key, val]) => (
                  <div key={key} className="flex gap-4 py-2.5 border-b border-oz-border last:border-0">
                    <span className="text-oz-cyan w-32 shrink-0">{key}</span>
                    <span className="text-oz-text-2">{val}</span>
                  </div>
                ))}
              </div>

            </div>
          </div>
        </section>

        {/* ── CTA ───────────────────────────────────────────────────────────── */}
        <section className="relative py-32 border-t border-oz-border overflow-hidden">
          <div className="absolute inset-0 bg-grid opacity-20 pointer-events-none" />
          <div className="absolute inset-0 pointer-events-none"
            style={{ background: 'radial-gradient(ellipse 80% 60% at 50% 50%, rgba(0,229,255,0.05) 0%, transparent 70%)' }} />

          <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
            <p className="font-mono text-xs text-oz-cyan tracking-[0.25em] uppercase mb-6">Ready to ship?</p>
            <h2 className="font-display text-5xl lg:text-7xl font-bold tracking-tight mb-8">
              Let's build<br />
              something real<span className="text-oz-cyan">.</span>
            </h2>
            <p className="text-oz-text-2 text-lg leading-relaxed mb-12 max-w-xl mx-auto">
              Tell us what you need. We scope, prototype, and ship.
              Response within 24 hours.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="mailto:founders@ozonelabs.io"
                className={cn(
                  'inline-flex items-center justify-center gap-3',
                  'font-mono text-sm font-bold tracking-widest uppercase',
                  'bg-oz-cyan text-oz-black',
                  'h-14 px-10 rounded-sm',
                  'hover:bg-white hover:shadow-[0_0_60px_rgba(0,229,255,0.6)]',
                  'transition-all duration-200'
                )}
              >
                founders@ozonelabs.io
              </a>
              <a
                href="https://instagram.com/ozonelabs"
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  'inline-flex items-center justify-center',
                  'font-mono text-sm tracking-widest uppercase',
                  'border border-oz-border-2 text-oz-text-2',
                  'h-14 px-10 rounded-sm',
                  'hover:border-oz-cyan/40 hover:text-oz-text',
                  'transition-all duration-200'
                )}
              >
                @ozonelabs
              </a>
            </div>
          </div>
        </section>

        {/* ── FOOTER ────────────────────────────────────────────────────────── */}
        <footer className="border-t border-oz-border py-10">
          <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="font-mono text-xs text-oz-text-3 tracking-widest">
              <span className="text-oz-cyan">OZ</span>
              <span className="text-oz-border-2 mx-1.5">/</span>
              LABS — Lahore, Pakistan
            </p>
            <p className="font-mono text-xs text-oz-text-3 tracking-wider">
              © {new Date().getFullYear()} Ozone Labs. Built with Next.js 15 + Gemini.
            </p>
            <Link
              href="/transparency"
              className="font-mono text-xs text-oz-text-3 hover:text-oz-cyan tracking-wider transition-colors duration-150 flex items-center gap-2"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-oz-green animate-status-pulse" />
              All systems operational
            </Link>
          </div>
        </footer>

      </main>
    </>
  );
}

// ─── Sub-components (colocated, no extra files needed) ────────────────────────

const CATEGORY_COLORS: Record<string, string> = {
  'Frontend':   'rgba(0,229,255,0.08)',
  'Backend':    'rgba(0,255,136,0.08)',
  'Database':   'rgba(255,184,0,0.08)',
  'AI/ML':      'rgba(255,61,87,0.08)',
  'Auth':       'rgba(0,229,255,0.06)',
  'Language':   'rgba(0,229,255,0.06)',
  'Infra':      'rgba(0,255,136,0.06)',
  'Automation': 'rgba(255,184,0,0.06)',
  'Messaging':  'rgba(0,229,255,0.06)',
};

const CATEGORY_TEXT: Record<string, string> = {
  'Frontend':   '#00E5FF',
  'Backend':    '#00FF88',
  'Database':   '#FFB800',
  'AI/ML':      '#FF3D57',
  'Auth':       '#9898B0',
  'Language':   '#9898B0',
  'Infra':      '#00FF88',
  'Automation': '#FFB800',
  'Messaging':  '#00E5FF',
};

function StackTag({ name, category }: { name: string; category: string }) {
  return (
    <span
      className="font-mono text-xs px-3 py-1.5 rounded-sm border border-oz-border tracking-wider"
      style={{
        background: CATEGORY_COLORS[category] ?? 'rgba(255,255,255,0.03)',
        color:      CATEGORY_TEXT[category]   ?? '#9898B0',
      }}
    >
      {name}
    </span>
  );
}

function ServiceCard({
  tag, title, body, span, items, accent,
}: {
  tag: string; title: string; body: string;
  span: string; items: string[]; accent: string;
}) {
  // First card spans 2 columns on md+
  const isWide = span === 'col-span-2';

  return (
    <div
      className={cn(
        'group relative bg-oz-surface border border-oz-border rounded-sm p-8',
        'hover:border-oz-border-2 transition-all duration-300',
        isWide ? 'md:col-span-2' : 'col-span-1',
        // Top accent line on hover
        'overflow-hidden'
      )}
    >
      {/* Top accent line */}
      <div
        className="absolute top-0 inset-x-0 h-px opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{ background: `linear-gradient(90deg, transparent, ${accent}, transparent)` }}
      />

      <p className="font-mono text-2xs tracking-widest uppercase mb-5"
        style={{ color: accent }}
      >
        {tag}
      </p>

      <h3 className={cn(
        'font-display font-bold tracking-tight mb-4 text-oz-text',
        isWide ? 'text-2xl lg:text-3xl' : 'text-xl'
      )}>
        {title}
      </h3>

      <p className="text-oz-text-2 text-sm leading-relaxed mb-8">{body}</p>

      <div className="flex flex-wrap gap-2">
        {items.map(item => (
          <span
            key={item}
            className="font-mono text-2xs px-2.5 py-1 rounded-sm border border-oz-border text-oz-text-3 tracking-wider"
          >
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}

function WorkRow({
  client, type, desc, tags, status, index,
}: {
  client: string; type: string; desc: string;
  tags: string[]; status: string; index: number;
}) {
  return (
    <div className="bg-oz-black grid grid-cols-1 lg:grid-cols-[1fr_2fr_auto] gap-6 p-8 group hover:bg-oz-surface/40 transition-colors duration-200">
      <div>
        <p className="font-mono text-2xs text-oz-text-3 tracking-widest uppercase mb-2">{type}</p>
        <h3 className="font-display text-xl font-bold text-oz-text">{client}</h3>
        <span className={cn(
          'inline-flex items-center gap-1.5 font-mono text-2xs tracking-widest uppercase mt-3',
          status === 'Live' ? 'text-oz-green' : 'text-oz-text-3'
        )}>
          <span className={cn(
            'h-1.5 w-1.5 rounded-full',
            status === 'Live' ? 'bg-oz-green animate-status-pulse' : 'bg-oz-text-3'
          )} />
          {status}
        </span>
      </div>

      <div>
        <p className="text-oz-text-2 text-sm leading-relaxed mb-4">{desc}</p>
        <div className="flex flex-wrap gap-2">
          {tags.map(tag => (
            <span key={tag} className="font-mono text-2xs px-2.5 py-1 border border-oz-border text-oz-text-3 rounded-sm tracking-wider">
              {tag}
            </span>
          ))}
        </div>
      </div>

      <div className="flex items-center self-center">
        <span className="font-mono text-xs text-oz-text-3 tracking-widest">
          {String(index + 1).padStart(2, '0')}
        </span>
      </div>
    </div>
  );
}