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

import { Navigation } from '@/components/Navigation';
import { OzoneTerminal } from '@/components/terminal/OzoneTerminal';
import { GlowCard } from '@/components/ui/GlowCard';
import { Button } from '@/components/ui/Button';

// ─── Data ─────────────────────────────────────────────────────────────────────

const SERVICES = [
  {
    id:          '01',
    title:       'Assistant Forge',
    tag:         'AI · RAG · Agents',
    description: 'Custom AI assistants for local businesses. RAG-powered knowledge bases, agentic workflows, and multi-platform deployment — ready for production from day one.',
    features:    [
      'WhatsApp Business API & web widgets',
      'Trilingual: English · Roman Urdu · اردو',
      'Multi-provider LLM fallback chain',
      'Retrieval-Augmented Generation (RAG)',
    ],
    accentColor: 'oz-cyan',
    dotColor:    'bg-oz-cyan',
    tagColor:    'text-oz-cyan border-oz-cyan/20',
    glowClass:   'hover:shadow-[0_0_40px_rgba(0,229,255,0.06)]',
  },
  {
    id:          '02',
    title:       'Bot Infrastructure',
    tag:         'WhatsApp · Automation',
    description: 'Production-grade bot infrastructure with proxy rotation, stealth fingerprinting, and custom webhook architecture that scales without breaking.',
    features:    [
      'whatsapp-web.js integration',
      'Puppeteer browser automation',
      'Proxy rotation & stealth layer',
      'p-queue rate management',
    ],
    accentColor: 'oz-green',
    dotColor:    'bg-oz-green',
    tagColor:    'text-oz-green border-oz-green/20',
    glowClass:   'hover:shadow-[0_0_40px_rgba(0,255,136,0.06)]',
  },
  {
    id:          '03',
    title:       'Web & App Lab',
    tag:         'Next.js · Mobile',
    description: 'Full-stack Next.js applications and React Native mobile apps. Server components, streaming, and edge deployment by default.',
    features:    [
      'Next.js 15 + React 19',
      'React Native / PWA',
      'PostgreSQL via Supabase',
      'NextAuth.js v5',
    ],
    accentColor: 'oz-amber',
    dotColor:    'bg-oz-amber',
    tagColor:    'text-oz-amber border-oz-amber/20',
    glowClass:   'hover:shadow-[0_0_40px_rgba(255,184,0,0.06)]',
  },
  {
    id:          '04',
    title:       'Game Lab',
    tag:         'WebGL · Three.js',
    description: 'Browser-based 2D/3D games and interactive experiences. WebGL-powered with silky frame rates and no native install required.',
    features:    [
      'Three.js 3D scenes',
      'WebGL custom shaders',
      'Interactive experiences',
      'Multiplayer architecture',
    ],
    accentColor: 'oz-red',
    dotColor:    'bg-oz-red',
    tagColor:    'text-oz-red border-oz-red/20',
    glowClass:   'hover:shadow-[0_0_40px_rgba(255,61,87,0.06)]',
  },
] as const;

const STATS = [
  { value: '$0',  label: 'LLM cost at scale' },
  { value: '9',   label: 'AI model fallbacks' },
  { value: '3',   label: 'Languages supported' },
  { value: '<24h', label: 'Response guarantee' },
] as const;

const LLM_CHAIN = [
  { name: 'gemini-2.0-flash-lite', provider: 'Google',     role: 'Primary',     color: 'text-oz-cyan',  border: 'border-oz-cyan/30',  bg: 'bg-oz-cyan/5'  },
  { name: 'llama-3.1-8b-instant',  provider: 'Groq',       role: 'Fallback',    color: 'text-oz-green', border: 'border-oz-green/30', bg: 'bg-oz-green/5' },
  { name: 'mistral-7b',            provider: 'OpenRouter',  role: 'Fallback B',  color: 'text-oz-amber', border: 'border-oz-amber/30', bg: 'bg-oz-amber/5' },
] as const;

const WORK_ITEMS = [
  {
    type:    'AI_ASSISTANT',
    label:   'AI Assistant',
    title:   'LaForza Gym — Lahore',
    body:    'WhatsApp bot that handles membership queries, class schedules, and payment reminders in Roman Urdu & English — 24/7 with zero human intervention.',
    stack:   ['Gemini 2.0', 'RAG', 'WhatsApp API'],
    status:  'DELIVERED',
  },
  {
    type:    'BOT_INFRASTRUCTURE',
    label:   'Bot Infrastructure',
    title:   'E-commerce Lead Bot',
    body:    'Scraping + outreach pipeline for a fashion brand. Puppeteer-based, proxy-rotated, with a p-queue throttle layer. 2,000+ leads/day safely.',
    stack:   ['Puppeteer', 'p-queue', 'Proxy Rotation'],
    status:  'DELIVERED',
  },
  {
    type:    'WEB_APPLICATION',
    label:   'Web Application',
    title:   'Client Portal — SaaS',
    body:    'Full-stack project management portal for agency clients. Real-time status, usage analytics, and API key management. Built on Next.js 15 + Prisma.',
    stack:   ['Next.js 15', 'Prisma', 'Supabase'],
    status:  'IN_PROGRESS',
  },
] as const;

const STACK_ROWS = [
  { cat: 'FRONTEND',  val: 'Next.js 15  ·  React 19  ·  Tailwind CSS v4' },
  { cat: 'BACKEND',   val: 'Node.js  ·  Prisma ORM  ·  PostgreSQL (Supabase)' },
  { cat: 'AI / ML',   val: 'Gemini  ·  Groq  ·  OpenRouter  ·  9 models total' },
  { cat: 'AUTH',      val: 'NextAuth.js v5  ·  GitHub & Google OAuth' },
  { cat: 'BOTS',      val: 'whatsapp-web.js  ·  Puppeteer  ·  p-queue' },
  { cat: 'DEPLOY',    val: 'Vercel Edge  ·  DigitalOcean  ·  Docker' },
] as const;

// ─── Micro-components ─────────────────────────────────────────────────────────

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3 mb-4">
      <span className="h-px w-8 bg-oz-cyan/40" />
      <span className="font-mono text-xs text-oz-cyan tracking-[0.2em] uppercase">{children}</span>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { label: string; color: string }> = {
    DELIVERED:   { label: 'Delivered',   color: 'text-oz-green border-oz-green/20 bg-oz-green/5' },
    IN_PROGRESS: { label: 'In Progress', color: 'text-oz-amber border-oz-amber/20 bg-oz-amber/5' },
    MAINTENANCE: { label: 'Maintenance', color: 'text-oz-text-3 border-oz-border' },
  };
  const { label, color } = map[status] ?? { label: status, color: 'text-oz-text-3 border-oz-border' };
  return (
    <span className={`font-mono text-2xs px-2 py-0.5 rounded-sm border tracking-widest uppercase ${color}`}>
      {label}
    </span>
  );
}

// ─── Footer ───────────────────────────────────────────────────────────────────

function Footer() {
  return (
    <footer className="border-t border-oz-border bg-oz-black-2">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid md:grid-cols-3 gap-10 mb-10">
          {/* Brand */}
          <div>
            <p className="font-mono text-sm tracking-widest uppercase mb-3">
              <span className="text-oz-cyan">OZ</span>
              <span className="text-oz-text-3 mx-1">/</span>
              <span className="text-oz-text">LABS</span>
            </p>
            <p className="text-oz-text-3 text-sm leading-relaxed">
              Deep-tech agency. Lahore, Pakistan.
              <br />
              Building AI infrastructure for local business.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <p className="font-mono text-xs text-oz-text-3 tracking-widest uppercase mb-4">Navigation</p>
            <div className="flex flex-col gap-2">
              {[
                { href: '/#services',    label: 'Services' },
                { href: '/transparency', label: 'Transparency' },
                { href: '/#work',        label: 'Work' },
              ].map(({ href, label }) => (
                <a
                  key={href}
                  href={href}
                  className="font-mono text-xs text-oz-text-3 hover:text-oz-cyan transition-colors duration-200 tracking-wider"
                >
                  {label}
                </a>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div>
            <p className="font-mono text-xs text-oz-text-3 tracking-widest uppercase mb-4">Contact</p>
            <div className="flex flex-col gap-2">
              <a
                href="mailto:founders@ozonelabs.io"
                className="font-mono text-xs text-oz-text-3 hover:text-oz-cyan transition-colors duration-200 tracking-wider"
              >
                founders@ozonelabs.io
              </a>
              <a
                href="https://instagram.com/ozonelabs"
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono text-xs text-oz-text-3 hover:text-oz-cyan transition-colors duration-200 tracking-wider"
              >
                @ozonelabs on Instagram
              </a>
            </div>
          </div>
        </div>

        {/* Bottom row */}
        <div className="pt-8 border-t border-oz-border flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="font-mono text-2xs text-oz-text-3 tracking-wider">
            © {new Date().getFullYear()} Ozone Labs. All rights reserved.
          </p>
          <div className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-oz-green animate-status-pulse" />
            <span className="font-mono text-2xs text-oz-text-3 tracking-wider">All systems operational</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function HomePage() {
  return (
    <>
      <Navigation />

      <main className="relative overflow-x-hidden">

        {/* ══════════════════════════════════════════════════════════
            §1  HERO
        ══════════════════════════════════════════════════════════ */}
        <section className="relative min-h-screen flex flex-col justify-center overflow-hidden pt-16">
          {/* Grid background */}
          <div className="absolute inset-0 bg-grid pointer-events-none" />
          {/* Fade overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-oz-black pointer-events-none" />
          {/* Radial glow behind terminal */}
          <div
            className="absolute right-0 top-1/2 -translate-y-1/2 w-[700px] h-[700px] pointer-events-none"
            style={{ background: 'radial-gradient(ellipse at center, rgba(0,229,255,0.04) 0%, transparent 70%)' }}
          />

          <div className="relative z-10 max-w-7xl mx-auto px-6 w-full py-20 lg:py-28">
            <div className="grid lg:grid-cols-[1fr_1.1fr] gap-16 items-center">

              {/* ── Left: Copy ── */}
              <div>
                {/* Status badge */}
                <div className="inline-flex items-center gap-2.5 border border-oz-border-2 rounded-sm px-3 py-1.5 mb-8 bg-oz-surface/50">
                  <span className="h-1.5 w-1.5 rounded-full bg-oz-green animate-status-pulse shrink-0" />
                  <span className="font-mono text-xs text-oz-text-3 tracking-widest uppercase">
                    Lahore, Pakistan — Open to new projects
                  </span>
                </div>

                {/* Headline */}
                <h1 className="font-display text-[2.8rem] sm:text-5xl lg:text-[3.5rem] xl:text-[4rem] font-bold leading-[1.06] tracking-[-0.025em] mb-6">
                  <span className="text-gradient-white block">AI Infrastructure</span>
                  <span className="text-gradient-white">for </span>
                  <span className="text-gradient-cyan">Local Business.</span>
                </h1>

                {/* Subheadline */}
                <p className="text-oz-text-2 text-lg leading-relaxed mb-10 max-w-lg">
                  Production-ready AI assistants, WhatsApp bot infrastructure, and full-stack web apps —
                  all running on <span className="text-oz-text font-medium">zero-cost LLM architecture</span>.
                </p>

                {/* CTA buttons */}
                <div className="flex flex-wrap gap-3">
                  <Button
                    variant="primary"
                    size="lg"
                    onClick={() => { window.location.href = 'mailto:founders@ozonelabs.io'; }}
                  >
                    Start a Project
                  </Button>
                  <Button
                    variant="outline"
                    size="lg"
                    onClick={() => { window.location.href = '/transparency'; }}
                  >
                    View Transparency
                  </Button>
                </div>

                {/* Stats row */}
                <div className="mt-14 pt-8 border-t border-oz-border grid grid-cols-2 sm:grid-cols-4 gap-6">
                  {STATS.map(({ value, label }) => (
                    <div key={label}>
                      <p className="font-mono text-2xl font-bold text-oz-cyan glow-text mb-1">{value}</p>
                      <p className="font-mono text-2xs text-oz-text-3 tracking-wider uppercase leading-tight">{label}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* ── Right: Terminal ── */}
              <div className="flex flex-col gap-3">
                {/* Terminal header hint */}
                <div className="flex items-center gap-2 px-1">
                  <span className="font-mono text-2xs text-oz-text-3 tracking-widest uppercase">Live Demo</span>
                  <span className="h-px flex-1 bg-oz-border" />
                  <span className="font-mono text-2xs text-oz-cyan/60 tracking-wider">Ask anything about Ozone Labs</span>
                </div>
                <OzoneTerminal />
                <p className="font-mono text-2xs text-oz-text-3 text-center tracking-wider">
                  Type <span className="text-oz-cyan">help</span> · <span className="text-oz-cyan">services</span> · <span className="text-oz-cyan">stack</span> · or any question
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════════
            §2  SERVICES
        ══════════════════════════════════════════════════════════ */}
        <section id="services" className="relative py-28 border-t border-oz-border">
          <div className="max-w-7xl mx-auto px-6">
            {/* Header */}
            <div className="mb-16">
              <SectionLabel>Services</SectionLabel>
              <h2 className="font-display text-4xl lg:text-5xl font-bold tracking-tight text-gradient-white max-w-lg">
                What we build<span className="text-oz-cyan">.</span>
              </h2>
            </div>

            {/* Cards grid */}
            <div className="grid md:grid-cols-2 gap-5">
              {SERVICES.map((svc) => (
                <GlowCard
                  key={svc.id}
                  as="article"
                  className={`p-8 flex flex-col gap-6 transition-all duration-300 ${svc.glowClass}`}
                >
                  {/* Card header */}
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <span className={`font-mono text-2xs px-2 py-0.5 rounded-sm border tracking-widest uppercase ${svc.tagColor}`}>
                        {svc.tag}
                      </span>
                      <div className="flex items-center gap-3 mt-4">
                        <span className="font-mono text-xs text-oz-text-3">{svc.id}</span>
                        <h3 className="font-display text-xl font-bold text-oz-text">{svc.title}</h3>
                      </div>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-oz-text-2 text-sm leading-relaxed">{svc.description}</p>

                  {/* Feature list */}
                  <ul className="flex flex-col gap-2 mt-auto">
                    {svc.features.map((feat) => (
                      <li key={feat} className="flex items-center gap-2.5">
                        <span className={`shrink-0 h-1 w-1 rounded-full ${svc.dotColor}`} />
                        <span className="font-mono text-xs text-oz-text-3 tracking-wide">{feat}</span>
                      </li>
                    ))}
                  </ul>
                </GlowCard>
              ))}
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════════
            §3  ARCHITECTURE — Zero-cost LLM chain
        ══════════════════════════════════════════════════════════ */}
        <section className="relative py-28 border-t border-oz-border overflow-hidden">
          {/* Ambient glow */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{ background: 'radial-gradient(ellipse 60% 40% at 50% 50%, rgba(0,229,255,0.025) 0%, transparent 70%)' }}
          />

          <div className="relative z-10 max-w-7xl mx-auto px-6">
            <div className="grid lg:grid-cols-[1fr_1.4fr] gap-16 items-center">

              {/* Left: copy */}
              <div>
                <SectionLabel>Architecture</SectionLabel>
                <h2 className="font-display text-4xl lg:text-5xl font-bold tracking-tight text-gradient-white mb-6">
                  Zero-cost LLMs<span className="text-oz-cyan">.</span>
                </h2>
                <p className="text-oz-text-2 leading-relaxed mb-8">
                  We chain free-tier AI providers — Gemini, Groq, OpenRouter — so your product has 9 model fallbacks
                  and <strong className="text-oz-text font-medium">$0 LLM cost at scale</strong>.
                  If one provider goes down, the next one picks up instantly.
                </p>

                {/* Stack table */}
                <div className="flex flex-col divide-y divide-oz-border border border-oz-border rounded-sm">
                  {STACK_ROWS.map(({ cat, val }) => (
                    <div key={cat} className="flex gap-4 px-4 py-3 hover:bg-oz-surface/50 transition-colors duration-150">
                      <span className="font-mono text-2xs text-oz-text-3 tracking-widest uppercase w-20 shrink-0 mt-0.5">{cat}</span>
                      <span className="font-mono text-xs text-oz-text-2 leading-relaxed">{val}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right: LLM chain visual */}
              <div className="flex flex-col gap-4">
                <p className="font-mono text-xs text-oz-text-3 tracking-widest uppercase mb-2">
                  Request routing — live chain
                </p>

                {/* User input */}
                <div className="flex items-center gap-3 px-4 py-3 bg-oz-surface border border-oz-border-2 rounded-sm">
                  <span className="text-oz-cyan/60 font-mono text-sm">❯</span>
                  <span className="font-mono text-sm text-oz-text-2">User message received</span>
                  <span className="ml-auto font-mono text-2xs text-oz-text-3 tracking-wider">INPUT</span>
                </div>

                {/* Arrow down */}
                <div className="flex justify-center">
                  <div className="flex flex-col items-center gap-1">
                    <span className="h-4 w-px bg-oz-border-2" />
                    <span className="font-mono text-xs text-oz-text-3">route</span>
                    <span className="h-4 w-px bg-oz-border-2" />
                  </div>
                </div>

                {/* LLM providers */}
                {LLM_CHAIN.map((model, i) => (
                  <div key={model.name}>
                    <div className={`relative px-4 py-4 border rounded-sm ${model.bg} ${model.border} transition-all duration-300`}>
                      <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                          {/* Status dot */}
                          <span className={`h-2 w-2 rounded-full ${i === 0 ? 'bg-oz-green animate-status-pulse' : 'bg-oz-text-3/40'}`} />
                          <div>
                            <p className={`font-mono text-sm font-bold ${model.color}`}>{model.provider}</p>
                            <p className="font-mono text-xs text-oz-text-3">{model.name}</p>
                          </div>
                        </div>
                        <span className={`font-mono text-2xs px-2 py-0.5 rounded-sm border tracking-widest uppercase ${model.color} ${model.border}`}>
                          {model.role}
                        </span>
                      </div>
                      {i === 0 && (
                        <p className="font-mono text-2xs text-oz-green/60 mt-2 tracking-wider">← Currently active</p>
                      )}
                    </div>
                    {i < LLM_CHAIN.length - 1 && (
                      <div className="flex justify-center my-2">
                        <div className="flex flex-col items-center gap-1">
                          <span className="h-3 w-px bg-oz-border" />
                          <span className="font-mono text-2xs text-oz-text-3 tracking-wider">on failure</span>
                          <span className="h-3 w-px bg-oz-border" />
                        </div>
                      </div>
                    )}
                  </div>
                ))}

                {/* Output */}
                <div className="flex justify-center my-2">
                  <div className="flex flex-col items-center gap-1">
                    <span className="h-4 w-px bg-oz-border-2" />
                    <span className="font-mono text-xs text-oz-text-3">stream</span>
                    <span className="h-4 w-px bg-oz-border-2" />
                  </div>
                </div>
                <div className="flex items-center gap-3 px-4 py-3 bg-oz-surface border border-oz-border-2 rounded-sm">
                  <span className="h-2 w-2 rounded-full bg-oz-cyan animate-status-pulse" />
                  <span className="font-mono text-sm text-oz-cyan">Streaming response to client</span>
                  <span className="ml-auto font-mono text-2xs text-oz-text-3 tracking-wider">SSE</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════════
            §4  WORK
        ══════════════════════════════════════════════════════════ */}
        <section id="work" className="relative py-28 border-t border-oz-border">
          <div className="max-w-7xl mx-auto px-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-16">
              <div>
                <SectionLabel>Work</SectionLabel>
                <h2 className="font-display text-4xl lg:text-5xl font-bold tracking-tight text-gradient-white">
                  Recent projects<span className="text-oz-cyan">.</span>
                </h2>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => { window.location.href = 'mailto:founders@ozonelabs.io'; }}
              >
                Discuss a project →
              </Button>
            </div>

            {/* Project cards */}
            <div className="grid md:grid-cols-3 gap-5">
              {WORK_ITEMS.map((item) => (
                <GlowCard
                  key={item.title}
                  as="article"
                  className="p-6 flex flex-col gap-5 animate-grid-in"
                >
                  {/* Type + status */}
                  <div className="flex items-center justify-between gap-3">
                    <span className="font-mono text-2xs text-oz-text-3 tracking-widest uppercase">{item.label}</span>
                    <StatusBadge status={item.status} />
                  </div>

                  {/* Title */}
                  <h3 className="font-display text-lg font-bold text-oz-text leading-tight">{item.title}</h3>

                  {/* Body */}
                  <p className="text-oz-text-2 text-sm leading-relaxed flex-1">{item.body}</p>

                  {/* Stack tags */}
                  <div className="flex flex-wrap gap-2 pt-2 border-t border-oz-border">
                    {item.stack.map((tag) => (
                      <span
                        key={tag}
                        className="font-mono text-2xs px-2 py-0.5 border border-oz-border-2 text-oz-text-3 tracking-wider rounded-sm"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </GlowCard>
              ))}
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════════
            §5  CTA
        ══════════════════════════════════════════════════════════ */}
        <section className="relative py-32 border-t border-oz-border overflow-hidden">
          {/* Glow effect */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{ background: 'radial-gradient(ellipse 50% 60% at 50% 100%, rgba(0,229,255,0.05) 0%, transparent 70%)' }}
          />
          {/* Grid */}
          <div className="absolute inset-0 bg-grid opacity-40 pointer-events-none" />

          <div className="relative z-10 max-w-3xl mx-auto px-6 text-center">
            <SectionLabel>Get in touch</SectionLabel>

            <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
              <span className="text-gradient-white">Ready to build</span>
              <br />
              <span className="text-gradient-cyan">something real?</span>
            </h2>

            <p className="text-oz-text-2 text-lg leading-relaxed mb-10 max-w-xl mx-auto">
              Tell us what you need. We scope, quote, and ship — usually within a week of alignment.
              No bloated agencies, no hidden fees.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button
                variant="primary"
                size="xl"
                onClick={() => { window.location.href = 'mailto:founders@ozonelabs.io'; }}
              >
                founders@ozonelabs.io
              </Button>
              <Button
                variant="outline"
                size="xl"
                onClick={() => { window.location.href = '/transparency'; }}
              >
                View transparency hub
              </Button>
            </div>

            {/* Trust note */}
            <p className="font-mono text-xs text-oz-text-3 mt-8 tracking-wider">
              Response within 24 hours · Based in Lahore, Pakistan · Serving global clients
            </p>
          </div>
        </section>

      </main>

      <Footer />
    </>
  );
}
