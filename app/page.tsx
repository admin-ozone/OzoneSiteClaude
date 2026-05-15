'use client';

/**
 * OZONE LABS — HOMEPAGE
 * ─────────────────────────────────────────────────────────────────────────────
 * Premium agency landing page.
 * Sections: Hero · Services · Stats · Process · Stack · CTA
 * ─────────────────────────────────────────────────────────────────────────────
 */

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { Navigation } from '@/components/Navigation';
import { OzoneTerminal } from '@/components/terminal/OzoneTerminal';
import { cn } from '@/lib/utils';

// ─── Data ──────────────────────────────────────────────────────────────────────

const SERVICES = [
  {
    id:       'assistant',
    index:    '01',
    title:    'Assistant Forge',
    tagline:  'AI that speaks your customer\'s language',
    desc:     'Custom AI assistants built on RAG pipelines and agentic workflows. Deployed on WhatsApp Business, web widgets, and Telegram. Fully trilingual — English, Roman Urdu, Urdu — because your market deserves it.',
    tags:     ['Gemini 3.1', 'RAG', 'WhatsApp API', 'Agentic', 'Trilingual'],
    large:    true,
  },
  {
    id:       'bots',
    index:    '02',
    title:    'Bot Infrastructure',
    tagline:  'Automation at production scale',
    desc:     'WhatsApp automation, Puppeteer browser bots, proxy rotation, and stealth fingerprinting. Custom webhook architecture that doesn\'t break.',
    tags:     ['whatsapp-web.js', 'Puppeteer', 'p-queue', 'Proxy'],
    large:    false,
  },
  {
    id:       'web',
    index:    '03',
    title:    'Web & App Lab',
    tagline:  'Full-stack, shipped fast',
    desc:     'Next.js 15 applications, React Native mobile apps, Progressive Web Apps. PostgreSQL via Supabase. Auth that just works.',
    tags:     ['Next.js 15', 'React Native', 'Supabase', 'NextAuth v5'],
    large:    false,
  },
  {
    id:       'games',
    index:    '04',
    title:    'Game Lab',
    tagline:  'Interactive experiences in the browser',
    desc:     'WebGL games, Three.js 3D environments, browser-based 2D/3D applications. From concept to playable product.',
    tags:     ['WebGL', 'Three.js', 'React Three Fiber'],
    large:    false,
  },
] as const;

const STATS = [
  { value: '9',    suffix: '+',  label: 'AI Models'        },
  { value: '3',    suffix: '',   label: 'Languages'         },
  { value: '$0',   suffix: '',   label: 'LLM Cost at Scale' },
  { value: '99.9', suffix: '%',  label: 'Uptime SLA'        },
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
  'Gemini 2.0', 'Groq Llama', 'OpenRouter',
  'Prisma ORM', 'Supabase', 'Vercel',
  'WhatsApp API', 'Puppeteer',
  'Three.js', 'WebGL', 'React Native',
] as const;

// ─── Helpers ───────────────────────────────────────────────────────────────────

/** Intersection-Observer hook — fires once when element enters viewport */
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

// ─── Sub-Components ────────────────────────────────────────────────────────────

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3 mb-6">
      <span className="h-px w-8 bg-oz-cyan/50" />
      <span className="font-mono text-xs text-oz-cyan tracking-[0.2em] uppercase">{children}</span>
    </div>
  );
}

function ServiceCard({ svc, delay = 0 }: { svc: typeof SERVICES[number]; delay?: number }) {
  const { ref, visible } = useInView();

  return (
    <div
      ref={ref}
      className={cn(
        'group relative border border-oz-border bg-oz-surface rounded-sm overflow-hidden',
        'transition-all duration-500',
        'hover:border-oz-cyan/30 hover:shadow-[0_0_40px_rgba(0,229,255,0.07)]',
        svc.large ? 'col-span-2 row-span-2' : 'col-span-1',
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8',
      )}
      style={{ transitionDelay: visible ? `${delay}ms` : '0ms' }}
    >
      {/* Top accent line */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-oz-cyan/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      {/* Hover glow */}
      <div className="absolute inset-0 bg-gradient-to-br from-oz-cyan/[0.03] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

      <div className={cn('relative z-10 flex flex-col h-full', svc.large ? 'p-10 gap-6' : 'p-7 gap-4')}>
        {/* Index */}
        <div className="flex items-center justify-between">
          <span className="font-mono text-xs text-oz-text-3 tracking-widest">{svc.index}</span>
          {/* Animated corner bracket */}
          <svg width="20" height="20" viewBox="0 0 20 20" className="text-oz-text-3/30 group-hover:text-oz-cyan/50 transition-colors duration-300">
            <path d="M14 2h4v4M6 18H2v-4" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
          </svg>
        </div>

        {/* Title */}
        <div>
          <h3 className={cn(
            'font-display font-bold text-oz-text tracking-tight leading-none mb-2',
            svc.large ? 'text-4xl' : 'text-2xl'
          )}>
            {svc.title}
          </h3>
          <p className={cn(
            'font-mono text-oz-cyan',
            svc.large ? 'text-sm' : 'text-xs'
          )}>
            {svc.tagline}
          </p>
        </div>

        {/* Description */}
        <p className={cn(
          'text-oz-text-2 leading-relaxed flex-1',
          svc.large ? 'text-base max-w-lg' : 'text-sm'
        )}>
          {svc.desc}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mt-auto">
          {svc.tags.map((tag) => (
            <span
              key={tag}
              className="font-mono text-2xs px-2.5 py-1 border border-oz-border-2 text-oz-text-3 rounded-sm tracking-wider group-hover:border-oz-cyan/20 group-hover:text-oz-text-2 transition-colors duration-300"
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
  const heroRef = useRef<HTMLDivElement>(null);
  const statsView = useInView(0.2);
  const processView = useInView(0.1);

  useEffect(() => { setMounted(true); }, []);

  return (
    <>
      <Navigation />

      <main className="bg-oz-black overflow-x-hidden">

        {/* ── HERO ─────────────────────────────────────────────────────────── */}
        <section
          ref={heroRef}
          className="relative min-h-screen flex flex-col justify-center pt-24 pb-16 overflow-hidden"
        >
          {/* Grid background */}
          <div className="absolute inset-0 bg-grid opacity-40 pointer-events-none" />

          {/* Radial fade — brighter at top */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                'radial-gradient(ellipse 80% 60% at 50% -10%, rgba(0,229,255,0.07) 0%, transparent 70%)',
            }}
          />

          <div className="relative z-10 max-w-7xl mx-auto px-6 w-full">
            <div className="grid lg:grid-cols-2 gap-16 items-center">

              {/* Left — copy */}
              <div>
                {/* Eyebrow */}
                <div
                  className="inline-flex items-center gap-2 border border-oz-border bg-oz-surface rounded-sm px-4 py-2 mb-10"
                  style={{ animationDelay: '0ms' }}
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-oz-green animate-status-pulse" />
                  <span className="font-mono text-xs text-oz-text-2 tracking-[0.15em] uppercase">
                    Lahore, Pakistan — Est. 2024
                  </span>
                </div>

                {/* Headline */}
                <h1 className="font-display font-bold tracking-tight leading-[1.0] mb-8">
                  <span
                    className="block text-oz-text"
                    style={{ fontSize: 'clamp(2.75rem, 6vw, 5.5rem)' }}
                  >
                    We build
                  </span>
                  <span
                    className="block"
                    style={{
                      fontSize:          'clamp(2.75rem, 6vw, 5.5rem)',
                      background:        'linear-gradient(135deg, #00E5FF 0%, rgba(0,229,255,0.5) 100%)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip:    'text',
                    }}
                  >
                    AI infrastructure
                  </span>
                  <span
                    className="block text-oz-text"
                    style={{ fontSize: 'clamp(2.75rem, 6vw, 5.5rem)' }}
                  >
                    for real business.
                  </span>
                </h1>

                {/* Subheading */}
                <p className="text-oz-text-2 text-lg leading-relaxed mb-10 max-w-lg">
                  AI Assistants. WhatsApp Bots. Web Applications. Games.
                  We ship production-grade systems that your customers actually use —
                  not demos that live in a slide deck.
                </p>

                {/* CTAs */}
                <div className="flex flex-wrap items-center gap-4">
                  <a
                    href="mailto:founders@ozonelabs.io"
                    className={cn(
                      'inline-flex items-center gap-2 font-mono text-sm tracking-widest uppercase font-bold',
                      'bg-oz-cyan text-oz-black px-8 py-4 rounded-sm',
                      'hover:bg-white transition-all duration-200',
                      'hover:shadow-[0_0_40px_rgba(0,229,255,0.5)]',
                    )}
                  >
                    Start a Project
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                      <path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </a>
                  <Link
                    href="/transparency"
                    className="inline-flex items-center gap-2 font-mono text-sm tracking-widest uppercase text-oz-text-2 hover:text-oz-cyan transition-colors duration-200 px-2 py-4"
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-oz-green animate-status-pulse" />
                    System Status
                  </Link>
                </div>

                {/* Social proof strip */}
                <div className="flex items-center gap-6 mt-14 pt-10 border-t border-oz-border">
                  {STATS.slice(0, 3).map((s) => (
                    <div key={s.label}>
                      <p className="font-display text-2xl font-bold text-oz-text">
                        {s.value}<span className="text-oz-cyan">{s.suffix}</span>
                      </p>
                      <p className="font-mono text-2xs text-oz-text-3 tracking-widest uppercase mt-0.5">
                        {s.label}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right — terminal */}
              <div className="relative">
                {/* Glow backdrop */}
                <div
                  className="absolute -inset-8 pointer-events-none"
                  style={{
                    background:
                      'radial-gradient(ellipse 80% 80% at 50% 50%, rgba(0,229,255,0.06) 0%, transparent 70%)',
                  }}
                />
                <div className="relative">
                  {/* Terminal label */}
                  <div className="flex items-center justify-between mb-3 px-1">
                    <span className="font-mono text-xs text-oz-text-3 tracking-widest uppercase">Live Demo</span>
                    <span className="font-mono text-xs text-oz-cyan/60 tracking-widest">Try: services</span>
                  </div>
                  {mounted && <OzoneTerminal />}
                </div>
              </div>

            </div>
          </div>

          {/* Scroll hint */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-40">
            <span className="font-mono text-2xs text-oz-text-3 tracking-widest uppercase">Scroll</span>
            <div className="h-8 w-px bg-gradient-to-b from-oz-text-3 to-transparent" />
          </div>
        </section>

        {/* ── SERVICES ─────────────────────────────────────────────────────── */}
        <section id="services" className="relative py-32">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-16">
              <div>
                <SectionLabel>What we build</SectionLabel>
                <h2 className="font-display text-5xl font-bold text-oz-text tracking-tight">
                  Four practices.<br />
                  <span style={{
                    background:        'linear-gradient(135deg, #00E5FF 0%, rgba(0,229,255,0.5) 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip:    'text',
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 auto-rows-fr">
              {/* Large card — spans 2 cols on lg */}
              <div className="lg:col-span-2">
                <ServiceCard svc={SERVICES[0]} delay={0} />
              </div>

              {/* Bot card */}
              <ServiceCard svc={SERVICES[1]} delay={100} />

              {/* Web card */}
              <ServiceCard svc={SERVICES[2]} delay={150} />

              {/* Games card */}
              <ServiceCard svc={SERVICES[3]} delay={200} />

              {/* "Zero-cost LLM" highlight card */}
              <div className="group relative border border-oz-cyan/20 bg-gradient-to-br from-oz-cyan-dim to-transparent rounded-sm overflow-hidden">
                <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-oz-cyan/50 to-transparent" />
                <div className="p-7 h-full flex flex-col justify-between">
                  <span className="font-mono text-2xs text-oz-cyan/60 tracking-widest uppercase">Architecture</span>
                  <div>
                    <p className="font-display text-3xl font-bold text-oz-cyan mb-2">$0</p>
                    <p className="font-mono text-xs text-oz-text-3 tracking-wider mb-3">LLM cost at scale</p>
                    <p className="text-oz-text-2 text-sm leading-relaxed">
                      9 models. 3 providers. Automatic failover. Zero dependency on any single vendor.
                    </p>
                    <div className="flex flex-wrap gap-2 mt-4">
                      {['Gemini', 'Groq', 'OpenRouter'].map((t) => (
                        <span key={t} className="font-mono text-2xs px-2 py-0.5 border border-oz-cyan/20 text-oz-cyan/60 rounded-sm tracking-wider">
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── STATS STRIP ──────────────────────────────────────────────────── */}
        <section className="border-y border-oz-border bg-oz-surface/30 py-16">
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
                    {s.value}<span className="text-oz-cyan">{s.suffix}</span>
                  </p>
                  <p className="font-mono text-xs text-oz-text-3 tracking-widest uppercase mt-2">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── HOW WE WORK ──────────────────────────────────────────────────── */}
        <section id="work" className="relative py-32 overflow-hidden">
          <div className="absolute inset-0 bg-grid opacity-20 pointer-events-none" />
          <div className="relative z-10 max-w-7xl mx-auto px-6">
            <SectionLabel>Process</SectionLabel>
            <h2 className="font-display text-5xl font-bold text-oz-text tracking-tight mb-20">
              How we work<span className="text-oz-cyan">.</span>
            </h2>

            <div ref={processView.ref} className="grid md:grid-cols-3 gap-0 relative">
              {/* Connector line — desktop */}
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
                  {/* Step number */}
                  <div className="relative z-10 inline-flex items-center justify-center w-14 h-14 border border-oz-border bg-oz-black rounded-sm mb-6">
                    <span className="font-mono text-sm text-oz-cyan tracking-widest">{p.step}</span>
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
              Built on what actually works<span className="text-oz-cyan">.</span>
            </h2>
          </div>

          {/* Scrolling ticker */}
          <div className="relative">
            {/* Fade edges */}
            <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-oz-black to-transparent z-10 pointer-events-none" />
            <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-oz-black to-transparent z-10 pointer-events-none" />

            {/* Track */}
            <div className="flex overflow-hidden">
              <div
                className="flex gap-3 shrink-0 pr-3"
                style={{ animation: 'ticker 25s linear infinite' }}
              >
                {[...STACK, ...STACK].map((tech, i) => (
                  <span
                    key={i}
                    className="shrink-0 font-mono text-sm px-5 py-2.5 border border-oz-border-2 bg-oz-surface text-oz-text-2 rounded-sm tracking-wider whitespace-nowrap hover:border-oz-cyan/30 hover:text-oz-cyan transition-colors duration-200 cursor-default"
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
                  Real-time system status for all infrastructure. We publish it publicly because we believe trust is built in public.
                </p>
              </div>
              <Link
                href="/transparency"
                className={cn(
                  'shrink-0 inline-flex items-center gap-2',
                  'font-mono text-sm tracking-widest uppercase',
                  'border border-oz-border-2 text-oz-text-2',
                  'px-8 py-4 rounded-sm',
                  'hover:border-oz-cyan hover:text-oz-cyan hover:shadow-oz',
                  'transition-all duration-200',
                )}
              >
                View Status
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </Link>
            </div>
          </div>
        </section>

        {/* ── CTA ──────────────────────────────────────────────────────────── */}
        <section className="relative py-40 overflow-hidden">
          {/* Background grid */}
          <div className="absolute inset-0 bg-grid opacity-30 pointer-events-none" />

          {/* Cyan radial glow */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: 'radial-gradient(ellipse 60% 60% at 50% 100%, rgba(0,229,255,0.08) 0%, transparent 70%)',
            }}
          />

          <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
            <p className="font-mono text-xs text-oz-cyan tracking-[0.3em] uppercase mb-8">
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

            {/* Email CTA */}
            <a
              href="mailto:founders@ozonelabs.io"
              className="group inline-flex items-center gap-4"
            >
              <span
                className="font-display font-bold text-oz-text group-hover:text-oz-cyan transition-colors duration-300"
                style={{ fontSize: 'clamp(1.5rem, 4vw, 2.5rem)' }}
              >
                founders@ozonelabs.io
              </span>
              <svg
                width="32"
                height="32"
                viewBox="0 0 32 32"
                fill="none"
                className="text-oz-cyan group-hover:translate-x-2 transition-transform duration-300"
              >
                <path d="M6 16h20M18 8l8 8-8 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </a>

            {/* Secondary */}
            <div className="flex items-center justify-center gap-6 mt-16">
              <span className="font-mono text-xs text-oz-text-3 tracking-widest uppercase">Or find us at</span>
              <a
                href="https://instagram.com/ozonelabs"
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono text-sm text-oz-text-2 hover:text-oz-cyan transition-colors tracking-wider"
              >
                @ozonelabs
              </a>
            </div>
          </div>
        </section>

        {/* ── FOOTER ───────────────────────────────────────────────────────── */}
        <footer className="border-t border-oz-border py-10">
          <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
            <Link href="/" className="font-mono text-sm font-bold tracking-[0.2em] uppercase">
              <span className="text-oz-cyan">OZ</span>
              <span className="text-oz-border-2 mx-1.5">/</span>
              <span className="text-oz-text">LABS</span>
            </Link>
            <p className="font-mono text-xs text-oz-text-3 tracking-wider">
              © {new Date().getFullYear()} Ozone Labs — Lahore, Pakistan
            </p>
            <div className="flex items-center gap-6">
              <Link href="/transparency" className="font-mono text-xs text-oz-text-3 hover:text-oz-cyan transition-colors tracking-wider">
                Status
              </Link>
              <Link href="/auth/login" className="font-mono text-xs text-oz-text-3 hover:text-oz-cyan transition-colors tracking-wider">
                Portal
              </Link>
              <a href="mailto:founders@ozonelabs.io" className="font-mono text-xs text-oz-text-3 hover:text-oz-cyan transition-colors tracking-wider">
                Contact
              </a>
            </div>
          </div>
        </footer>

      </main>
    </>
  );
}