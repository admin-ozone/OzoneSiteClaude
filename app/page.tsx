'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { Navigation } from '@/components/Navigation';
import { OzoneAI } from '@/components/chat/OzoneAI';
import { cn } from '@/lib/utils';

// ─── Data ──────────────────────────────────────────────────────────────────────

const SERVICES = [
  {
    id:      'assistant',
    index:   '01',
    title:   'Assistant Forge',
    tagline: 'AI that speaks your customer\'s language',
    desc:    'Custom AI assistants built on RAG pipelines and agentic workflows. Deployed on WhatsApp Business, web widgets, and Telegram. Built for the market you\'re actually serving.',
    tags:    ['RAG', 'WhatsApp API', 'Agentic', 'Custom LLM'],
    large:   true,
  },
  {
    id:      'bots',
    index:   '02',
    title:   'Bot Infrastructure',
    tagline: 'Automation at production scale',
    desc:    'WhatsApp automation, Puppeteer browser bots, proxy rotation, and stealth fingerprinting. Custom webhook architecture that doesn\'t break.',
    tags:    ['whatsapp-web.js', 'Puppeteer', 'p-queue', 'Proxy'],
    large:   false,
  },
  {
    id:      'web',
    index:   '03',
    title:   'Web & App Lab',
    tagline: 'Full-stack, shipped fast',
    desc:    'Next.js 15 applications, React Native mobile apps, Progressive Web Apps. PostgreSQL via Supabase. Auth that just works.',
    tags:    ['Next.js 15', 'React Native', 'Supabase', 'NextAuth v5'],
    large:   false,
  },
  {
    id:      'games',
    index:   '04',
    title:   'Game Lab',
    tagline: 'Interactive experiences in the browser',
    desc:    'WebGL games, Three.js 3D environments, browser-based 2D/3D applications. From concept to playable product.',
    tags:    ['WebGL', 'Three.js', 'React Three Fiber'],
    large:   false,
  },
] as const;

const STATS = [
  { value: '48',   suffix: 'h',  label: 'First delivery'   },
  { value: '100',  suffix: '%',  label: 'Source ownership'  },
  { value: '99.9', suffix: '%',  label: 'Uptime SLA'        },
  { value: '24',   suffix: 'h',  label: 'Response time'     },
] as const;

const PROCESS = [
  {
    step:  '01',
    title: 'Scope & Spec',
    desc:  'We map your requirements with ruthless precision. Fixed deliverables, fixed timelines, zero upsells. You know exactly what you\'re getting before we write a line of code.',
  },
  {
    step:  '02',
    title: 'Build in Public',
    desc:  'Production-grade code from day one. You see progress every 48 hours — live demos, not status updates. We move fast without cutting corners.',
  },
  {
    step:  '03',
    title: 'Deploy & Hand Off',
    desc:  'Live on Vercel, DigitalOcean, or your infra. Full documentation, source access, no black boxes. You own everything we build.',
  },
] as const;

const STACK = [
  'Next.js 15', 'React 19', 'TypeScript', 'Tailwind 4',
  'RAG Pipelines', 'Agentic Workflows',
  'Prisma ORM', 'Supabase', 'Vercel',
  'WhatsApp API', 'Puppeteer',
  'Three.js', 'WebGL', 'React Native',
] as const;

// ─── Helpers ───────────────────────────────────────────────────────────────────

function useInView(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);

  return { ref, visible };
}

// ─── Blueprint SVG — hero right column ────────────────────────────────────────

function BlueprintSVG() {
  return (
    <svg
      viewBox="0 0 480 400"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-auto opacity-0 animate-[fade-in_0.8s_0.3s_ease-out_forwards]"
      style={{ animation: 'fadeIn 0.8s 0.3s ease-out forwards', opacity: 0 }}
      aria-hidden="true"
    >
      <style>{`@keyframes fadeIn { to { opacity: 1; } }`}</style>

      {/* ── Outer boundary ── */}
      <rect x="24" y="24" width="432" height="352" stroke="#DEDAD4" strokeWidth="0.75" />

      {/* ── Corner ticks ── */}
      {/* top-left */}
      <line x1="24" y1="14" x2="24" y2="34"  stroke="#C8C4BE" strokeWidth="0.75" />
      <line x1="14" y1="24" x2="34" y2="24"  stroke="#C8C4BE" strokeWidth="0.75" />
      {/* top-right */}
      <line x1="456" y1="14" x2="456" y2="34"  stroke="#C8C4BE" strokeWidth="0.75" />
      <line x1="446" y1="24" x2="466" y2="24"  stroke="#C8C4BE" strokeWidth="0.75" />
      {/* bottom-left */}
      <line x1="24" y1="366" x2="24" y2="386"  stroke="#C8C4BE" strokeWidth="0.75" />
      <line x1="14" y1="376" x2="34" y2="376"  stroke="#C8C4BE" strokeWidth="0.75" />
      {/* bottom-right */}
      <line x1="456" y1="366" x2="456" y2="386"  stroke="#C8C4BE" strokeWidth="0.75" />
      <line x1="446" y1="376" x2="466" y2="376"  stroke="#C8C4BE" strokeWidth="0.75" />

      {/* ── Internal grid lines ── */}
      <line x1="24"  y1="130" x2="456" y2="130" stroke="#DEDAD4" strokeWidth="0.5" strokeDasharray="4 6" />
      <line x1="24"  y1="270" x2="456" y2="270" stroke="#DEDAD4" strokeWidth="0.5" strokeDasharray="4 6" />
      <line x1="180" y1="24"  x2="180" y2="376" stroke="#DEDAD4" strokeWidth="0.5" strokeDasharray="4 6" />
      <line x1="340" y1="24"  x2="340" y2="376" stroke="#DEDAD4" strokeWidth="0.5" strokeDasharray="4 6" />

      {/* ── Module A — top-left block ── */}
      <rect x="44"  y="44" width="116" height="66" stroke="#C8C4BE" strokeWidth="0.75" />
      <text x="52" y="73" fontFamily="'Space Mono', monospace" fontSize="8" fill="#B0ADA8" letterSpacing="0.08em">MODULE_A</text>
      <text x="52" y="87" fontFamily="'Space Mono', monospace" fontSize="7" fill="#DEDAD4" letterSpacing="0.06em">INGESTION</text>

      {/* ── Core — center block (accent) ── */}
      <rect x="200" y="148" width="120" height="102" stroke="#FF3428" strokeWidth="1" />
      {/* Red fill accent — very light */}
      <rect x="200" y="148" width="120" height="102" fill="rgba(255,52,40,0.04)" />
      <text x="260" y="196" fontFamily="'Space Mono', monospace" fontSize="9" fill="#FF3428" letterSpacing="0.1em" textAnchor="middle">CORE</text>
      <text x="260" y="211" fontFamily="'Space Mono', monospace" fontSize="7" fill="rgba(255,52,40,0.5)" letterSpacing="0.08em" textAnchor="middle">ORCHESTRATOR</text>
      {/* Red corner dot */}
      <circle cx="200" cy="148" r="3" fill="#FF3428" />

      {/* ── API block — top-right ── */}
      <rect x="360" y="44" width="76" height="56" stroke="#C8C4BE" strokeWidth="0.75" />
      <text x="398" y="70" fontFamily="'Space Mono', monospace" fontSize="8" fill="#B0ADA8" letterSpacing="0.08em" textAnchor="middle">API</text>
      <text x="398" y="84" fontFamily="'Space Mono', monospace" fontSize="7" fill="#DEDAD4" letterSpacing="0.06em" textAnchor="middle">LAYER</text>

      {/* ── Output block — bottom-right ── */}
      <rect x="360" y="290" width="76" height="56" stroke="#C8C4BE" strokeWidth="0.75" />
      <text x="398" y="316" fontFamily="'Space Mono', monospace" fontSize="8" fill="#B0ADA8" letterSpacing="0.08em" textAnchor="middle">OUTPUT</text>
      <text x="398" y="330" fontFamily="'Space Mono', monospace" fontSize="7" fill="#DEDAD4" letterSpacing="0.06em" textAnchor="middle">WEBHOOK</text>

      {/* ── Storage block — bottom-left ── */}
      <rect x="44" y="290" width="116" height="56" stroke="#C8C4BE" strokeWidth="0.75" />
      <text x="102" y="316" fontFamily="'Space Mono', monospace" fontSize="8" fill="#B0ADA8" letterSpacing="0.08em" textAnchor="middle">STORAGE</text>
      <text x="102" y="330" fontFamily="'Space Mono', monospace" fontSize="7" fill="#DEDAD4" letterSpacing="0.06em" textAnchor="middle">VECTOR + SQL</text>

      {/* ── Connector lines ── */}
      {/* MODULE_A → CORE */}
      <line x1="160" y1="77" x2="200" y2="199" stroke="#DEDAD4" strokeWidth="0.75" />
      <circle cx="160" cy="77"  r="2" fill="#C8C4BE" />
      <circle cx="200" cy="199" r="2" fill="#C8C4BE" />

      {/* API → CORE */}
      <line x1="360" y1="72" x2="320" y2="175" stroke="#DEDAD4" strokeWidth="0.75" />
      <circle cx="360" cy="72"  r="2" fill="#C8C4BE" />
      <circle cx="320" cy="175" r="2" fill="#C8C4BE" />

      {/* CORE → OUTPUT */}
      <line x1="320" y1="220" x2="360" y2="305" stroke="#DEDAD4" strokeWidth="0.75" />
      <circle cx="320" cy="220" r="2" fill="#C8C4BE" />
      <circle cx="360" cy="305" r="2" fill="#C8C4BE" />

      {/* CORE → STORAGE */}
      <line x1="200" y1="230" x2="160" y2="305" stroke="#DEDAD4" strokeWidth="0.75" />
      <circle cx="200" cy="230" r="2" fill="#C8C4BE" />
      <circle cx="160" cy="305" r="2" fill="#C8C4BE" />

      {/* ── Dimension line — horizontal ── */}
      <line x1="44"  y1="12" x2="180" y2="12" stroke="#DEDAD4" strokeWidth="0.5" />
      <line x1="44"  y1="8"  x2="44"  y2="16" stroke="#DEDAD4" strokeWidth="0.5" />
      <line x1="180" y1="8"  x2="180" y2="16" stroke="#DEDAD4" strokeWidth="0.5" />
      <text x="112" y="10" fontFamily="'Space Mono', monospace" fontSize="6" fill="#DEDAD4" letterSpacing="0.06em" textAnchor="middle">136px</text>

      {/* ── Dimension line — vertical ── */}
      <line x1="472" y1="148" x2="472" y2="250" stroke="#DEDAD4" strokeWidth="0.5" />
      <line x1="468" y1="148" x2="476" y2="148" stroke="#DEDAD4" strokeWidth="0.5" />
      <line x1="468" y1="250" x2="476" y2="250" stroke="#DEDAD4" strokeWidth="0.5" />
      <text
        x="478" y="202"
        fontFamily="'Space Mono', monospace"
        fontSize="6"
        fill="#DEDAD4"
        letterSpacing="0.06em"
        textAnchor="middle"
        transform="rotate(90, 478, 202)"
      >
        102px
      </text>

      {/* ── Reference label ── */}
      <text x="456" y="390" fontFamily="'Space Mono', monospace" fontSize="6" fill="#DEDAD4" letterSpacing="0.08em" textAnchor="end">OZ-ARCH-v2.4</text>
    </svg>
  );
}

// ─── Sub-Components ────────────────────────────────────────────────────────────

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3 mb-6">
      <span className="h-px w-8 bg-oz-red/40" />
      <span className="font-mono text-xs text-oz-red tracking-[0.2em] uppercase">{children}</span>
    </div>
  );
}

function ServiceCard({ svc, delay = 0 }: { svc: typeof SERVICES[number]; delay?: number }) {
  const { ref, visible } = useInView();

  return (
    <div
      ref={ref}
      className={cn(
        'group relative border border-oz-border bg-oz-white rounded-sm overflow-hidden h-full',
        'transition-all duration-500',
        'hover:border-oz-border-2 hover:shadow-[0_2px_16px_rgba(0,0,0,0.06)]',
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8',
      )}
      style={{ transitionDelay: visible ? `${delay}ms` : '0ms' }}
    >
      {/* Top hairline */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-oz-border-2 to-transparent" />

      <div className={cn('relative z-10 flex flex-col h-full', svc.large ? 'p-10 gap-6' : 'p-7 gap-4')}>
        {/* Index + arrow */}
        <div className="flex items-center justify-between">
          <span className="font-mono text-xs text-oz-muted tracking-widest">{svc.index}</span>
          <span className="font-mono text-oz-muted/50 group-hover:text-oz-text-3 transition-all duration-150 group-hover:translate-x-1">
            →
          </span>
        </div>

        {/* Title */}
        <div>
          <h3 className={cn(
            'font-display font-bold text-oz-text tracking-tight leading-none mb-2',
            svc.large ? 'text-4xl' : 'text-2xl'
          )}>
            {svc.title}
          </h3>
          <p className={cn('font-mono text-oz-red', svc.large ? 'text-sm' : 'text-xs')}>
            {svc.tagline}
          </p>
        </div>

        {/* Description */}
        <p className={cn('text-oz-text-2 leading-relaxed flex-1', svc.large ? 'text-base max-w-lg' : 'text-sm')}>
          {svc.desc}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mt-auto">
          {svc.tags.map((tag) => (
            <span
              key={tag}
              className="font-mono text-2xs px-2.5 py-1 border border-oz-border text-oz-text-3 rounded-sm tracking-wider group-hover:border-oz-border-2 group-hover:text-oz-text-2 transition-colors duration-300"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Page ──────────────────────────────────────────────────────────────────────

export default function HomePage() {
  const [mounted, setMounted] = useState(false);

  const statsView   = useInView(0.2);
  const processView = useInView(0.1);

  useEffect(() => { setMounted(true); }, []);

  return (
    <>
      <Navigation />

      <main className="bg-oz-white overflow-x-hidden">

        {/* ── HERO ─────────────────────────────────────────────────────────── */}
        <section className="relative min-h-screen flex flex-col justify-center pt-24 pb-16 overflow-hidden">
          <div className="absolute inset-0 bg-grid opacity-100 pointer-events-none" />

          <div className="relative z-10 max-w-7xl mx-auto px-6 w-full">
            <div className="grid lg:grid-cols-2 gap-16 items-center">

              {/* Left — copy */}
              <div>
                <h1 className="font-display font-bold tracking-tight leading-[1.0] mb-8">
                  <span className="block text-oz-text" style={{ fontSize: 'clamp(2.75rem, 6vw, 5.5rem)' }}>
                    We build
                  </span>
                  <span
                    className="block"
                    style={{
                      fontSize:             'clamp(2.75rem, 6vw, 5.5rem)',
                      background:           'linear-gradient(135deg, #FF3428 0%, rgba(255,52,40,0.55) 100%)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor:  'transparent',
                      backgroundClip:       'text',
                    }}
                  >
                    AI infrastructure
                  </span>
                  <span className="block text-oz-text" style={{ fontSize: 'clamp(2.75rem, 6vw, 5.5rem)' }}>
                    for real business.
                  </span>
                </h1>

                <p className="text-oz-text-2 text-lg leading-relaxed mb-10 max-w-lg">
                  AI Assistants. WhatsApp Bots. Web Applications. Games.
                  We ship production-grade systems that your customers actually use —
                  not demos that live in a slide deck.
                </p>

                <div className="flex flex-wrap items-center gap-4">
                  <a
                    href="mailto:founders@ozbuilts.com"
                    className={cn(
                      'inline-flex items-center gap-2 font-mono text-sm tracking-widest uppercase font-bold',
                      'bg-oz-red text-white px-8 py-4 rounded-sm',
                      'hover:bg-[#E02D22] transition-colors duration-200',
                    )}
                  >
                    Start a Project
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                      <path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </a>
                  {/*<Link
                    href="/#services"
                    className="font-mono text-sm tracking-widest uppercase text-oz-text-3 hover:text-oz-text-2 transition-colors duration-150 px-4 py-4"
                  >
                    See our work
                  </Link> */}
                </div>

                {/* Headline stats — clean, no inflated metrics */}
                <div className="flex items-center gap-6 mt-14 pt-10 border-t border-oz-border">
                  <div>
                    <p className="font-display text-2xl font-bold text-oz-text">
                      48<span className="text-oz-red">h</span>
                    </p>
                    <p className="font-mono text-2xs text-oz-text-3 tracking-widest uppercase mt-0.5">
                      First delivery
                    </p>
                  </div>
                  <div>
                    <p className="font-display text-2xl font-bold text-oz-text">
                      100<span className="text-oz-red">%</span>
                    </p>
                    <p className="font-mono text-2xs text-oz-text-3 tracking-widest uppercase mt-0.5">
                      Source ownership
                    </p>
                  </div>
                  <div>
                    <p className="font-display text-2xl font-bold text-oz-text">
                      99.9<span className="text-oz-red">%</span>
                    </p>
                    <p className="font-mono text-2xs text-oz-text-3 tracking-widest uppercase mt-0.5">
                      Uptime SLA
                    </p>
                  </div>
                </div>
              </div>

              {/* Right — technical blueprint */}
              <div className="relative hidden lg:block">
                <BlueprintSVG />
              </div>

            </div>
          </div>

          {/* Scroll hint */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-30">
            <span className="font-mono text-2xs text-oz-text-3 tracking-widest uppercase">Scroll</span>
            <div className="h-8 w-px bg-gradient-to-b from-oz-text-3 to-transparent" />
          </div>
        </section>

        {/* ── SERVICES ─────────────────────────────────────────────────────── */}
        <section id="services" className="relative py-32 border-t border-oz-border">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-16">
              <div>
                <SectionLabel>What we build</SectionLabel>
                <h2 className="font-display text-5xl font-bold text-oz-text tracking-tight">
                  Four practices.<br />
                  <span style={{
                    background:           'linear-gradient(135deg, #FF3428 0%, rgba(255,52,40,0.55) 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor:  'transparent',
                    backgroundClip:       'text',
                  }}>
                    One agency.
                  </span>
                </h2>
              </div>
              <p className="text-oz-text-2 leading-relaxed max-w-sm lg:text-right">
                We don't do everything. We do four things at a level that most agencies can't match.
              </p>
            </div>

            {/* Bento grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

              {/* Row 1: large (2 cols) + card 2 (1 col) */}
              <div className="md:col-span-2 min-h-[360px]">
                <ServiceCard svc={SERVICES[0]} delay={0} />
              </div>
              <div className="min-h-[360px]">
                <ServiceCard svc={SERVICES[1]} delay={100} />
              </div>

              {/* Row 2: card 3, card 4, architecture highlight */}
              <div className="min-h-[280px]">
                <ServiceCard svc={SERVICES[2]} delay={150} />
              </div>
              <div className="min-h-[280px]">
                <ServiceCard svc={SERVICES[3]} delay={200} />
              </div>

              {/* Architecture principle card */}
              <div className="group relative border border-oz-border bg-oz-surface rounded-sm overflow-hidden min-h-[280px] hover:border-oz-border-2 hover:shadow-[0_2px_16px_rgba(0,0,0,0.06)] transition-all duration-300">
                <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-oz-border-2 to-transparent" />
                <div className="p-7 h-full flex flex-col justify-between">
                  <span className="font-mono text-2xs text-oz-text-3 tracking-widest uppercase">Principle</span>
                  <div>
                    <p className="font-display text-3xl font-bold text-oz-text mb-2 leading-tight">
                      Built for<br />scale.
                    </p>
                    <p className="font-mono text-xs text-oz-text-3 tracking-wider mb-3">
                      Engineered to last.
                    </p>
                    <p className="text-oz-text-2 text-sm leading-relaxed">
                      Resilient architecture, automatic failover, zero vendor lock-in. You own the stack.
                    </p>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* ── STATS STRIP ──────────────────────────────────────────────────── */}
        <section className="border-y border-oz-border bg-oz-surface py-16">
          <div ref={statsView.ref} className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
              {STATS.map((s, i) => (
                <div
                  key={s.label}
                  className={cn(
                    'text-center transition-all duration-700',
                    statsView.visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6',
                  )}
                  style={{ transitionDelay: statsView.visible ? `${i * 100}ms` : '0ms' }}
                >
                  <p className="font-display font-bold text-oz-text" style={{ fontSize: 'clamp(2.5rem, 4vw, 3.5rem)' }}>
                    {s.value}<span className="text-oz-red">{s.suffix}</span>
                  </p>
                  <p className="font-mono text-xs text-oz-text-3 tracking-widest uppercase mt-2">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── HOW WE WORK ──────────────────────────────────────────────────── */}
        <section id="work" className="relative py-32 overflow-hidden">
          <div className="absolute inset-0 bg-grid opacity-100 pointer-events-none" />
          <div className="relative z-10 max-w-7xl mx-auto px-6">
            <SectionLabel>Process</SectionLabel>
            <h2 className="font-display text-5xl font-bold text-oz-text tracking-tight mb-20">
              How we work<span className="text-oz-red">.</span>
            </h2>

            <div ref={processView.ref} className="grid md:grid-cols-3 gap-0 relative">
              <div className="hidden md:block absolute top-7 left-[calc(16.67%+1rem)] right-[calc(16.67%+1rem)] h-px bg-oz-border" />

              {PROCESS.map((p, i) => (
                <div
                  key={p.step}
                  className={cn(
                    'relative px-0 md:px-8 first:pl-0 last:pr-0 transition-all duration-700',
                    processView.visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8',
                  )}
                  style={{ transitionDelay: processView.visible ? `${i * 150}ms` : '0ms' }}
                >
                  <div className="relative z-10 inline-flex items-center justify-center w-14 h-14 border border-oz-border bg-oz-white rounded-sm mb-6">
                    <span className="font-mono text-sm text-oz-red tracking-widest">{p.step}</span>
                  </div>
                  <h3 className="font-display text-2xl font-bold text-oz-text mb-4">{p.title}</h3>
                  <p className="text-oz-text-2 leading-relaxed">{p.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── TECH STACK ───────────────────────────────────────────────────── */}
        <section id="about" className="py-24 border-t border-oz-border overflow-hidden">
          <div className="max-w-7xl mx-auto px-6 mb-12">
            <SectionLabel>Technology</SectionLabel>
            <h2 className="font-display text-4xl font-bold text-oz-text tracking-tight">
              Built on what actually works<span className="text-oz-red">.</span>
            </h2>
          </div>

          <div className="relative">
            <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-oz-white to-transparent z-10 pointer-events-none" />
            <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-oz-white to-transparent z-10 pointer-events-none" />
            <div className="flex overflow-hidden">
              <div className="flex gap-3 shrink-0 pr-3" style={{ animation: 'ticker 25s linear infinite' }}>
                {[...STACK, ...STACK].map((tech, i) => (
                  <span
                    key={i}
                    className="shrink-0 font-mono text-sm px-5 py-2.5 border border-oz-border bg-oz-white text-oz-text-2 rounded-sm tracking-wider whitespace-nowrap hover:border-oz-border-2 hover:text-oz-text transition-colors duration-200 cursor-default"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <style>{`
            @keyframes ticker {
              0%   { transform: translateX(0); }
              100% { transform: translateX(-50%); }
            }
          `}</style>
        </section>

        {/* ── TRANSPARENCY STRIP ───────────────────────────────────────────── */}
        <section className="py-16 border-t border-oz-border">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
              <div>
                <SectionLabel>Transparency Hub</SectionLabel>
                <h3 className="font-display text-3xl font-bold text-oz-text tracking-tight mb-3">
                  If something breaks, you'll know before we do.
                </h3>
                <p className="text-oz-text-2 leading-relaxed max-w-lg">
                  Real-time system status for all infrastructure. Published publicly because trust is built in public.
                </p>
              </div>
              <Link
                href="/transparency"
                className={cn(
                  'shrink-0 inline-flex items-center gap-2',
                  'font-mono text-sm tracking-widest uppercase',
                  'border border-oz-border-2 text-oz-text-2',
                  'px-8 py-4 rounded-sm',
                  'hover:border-oz-text-3 hover:text-oz-text',
                  'transition-all duration-200',
                )}
              >
                View Status
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Link>
            </div>
          </div>
        </section>

        {/* ── CTA ──────────────────────────────────────────────────────────── */}
        <section className="relative py-40 overflow-hidden bg-oz-surface">
          <div className="absolute inset-0 bg-grid opacity-100 pointer-events-none" />

          <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
            <p className="font-mono text-xs text-oz-red tracking-[0.3em] uppercase mb-8">
              Let's work together
            </p>
            <h2
              className="font-display font-bold tracking-tight text-oz-text mb-6"
              style={{ fontSize: 'clamp(2.5rem, 7vw, 5.5rem)', lineHeight: 1.0 }}
            >
              Ready to build something that actually works?
            </h2>
            <p className="text-oz-text-2 text-lg leading-relaxed max-w-xl mx-auto mb-14">
              We scope fast and we're honest about what's feasible.
              Drop us a line and we'll respond within 24 hours — usually much less.
            </p>

            <a href="mailto:founders@ozbuilts.com" className="group inline-flex items-center gap-4">
              <span
                className="font-display font-bold text-oz-text group-hover:text-oz-red transition-colors duration-300"
                style={{ fontSize: 'clamp(1.5rem, 4vw, 2.5rem)' }}
              >
                founders@ozbuilts.com
              </span>
              <svg
                width="32" height="32" viewBox="0 0 32 32" fill="none"
                className="text-oz-red group-hover:translate-x-2 transition-transform duration-300"
              >
                <path d="M6 16h20M18 8l8 8-8 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </a>

            <div className="flex items-center justify-center gap-6 mt-16">
              <span className="font-mono text-xs text-oz-text-3 tracking-widest uppercase">Or find us at</span>
              <a
                href="https://instagram.com/ozbuilts"
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono text-sm text-oz-text-2 hover:text-oz-red transition-colors tracking-wider"
              >
                @ozbuilts
              </a>
            </div>
          </div>
        </section>

        {/* ── FOOTER ───────────────────────────────────────────────────────── */}
        <footer className="border-t border-oz-border bg-oz-off-white py-10">
          <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
            <Link href="/" className="font-mono text-sm font-bold tracking-[0.2em] uppercase">
              <span style={{ color: '#FF3428' }}>OZ</span>
              <span className="text-oz-border-2 mx-1.5">/</span>
              <span className="text-oz-text-2">LABS</span>
            </Link>
            <p className="font-mono text-xs text-oz-text-3 tracking-wider" suppressHydrationWarning>
              © {new Date().getFullYear()} Ozone Labs — Islamabad, Pakistan
            </p>
            <div className="flex items-center gap-6">
              <Link href="/transparency" className="font-mono text-xs text-oz-text-3 hover:text-oz-text transition-colors tracking-wider">
                Status
              </Link>
              <Link href="/auth/login" className="font-mono text-xs text-oz-text-3 hover:text-oz-text transition-colors tracking-wider">
                Portal
              </Link>
              <a href="mailto:founders@ozbuilts.com" className="font-mono text-xs text-oz-text-3 hover:text-oz-text transition-colors tracking-wider">
                Contact
              </a>
            </div>
          </div>
        </footer>

      </main>

      {/* ── Floating AI Chat ─────────────────────────────────────────────── */}
      {mounted && <OzoneAI />}
    </>
  );
}