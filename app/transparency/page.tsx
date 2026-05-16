'use client';

/**
 * TRANSPARENCY HUB
 * Route: /transparency
 * ─────────────────────────────────────────────────────────────────────────────
 * Live system status dashboard. Fetches from /api/status (ISR, 30s cache).
 * Shows service health, active incidents, and uptime percentages.
 * ─────────────────────────────────────────────────────────────────────────────
 */

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Navigation } from '@/components/Navigation';
import { GlowCard } from '@/components/ui/GlowCard';
import { cn } from '@/lib/utils';

// ─── Types ────────────────────────────────────────────────────────────────────

type StatusLevel = 'OPERATIONAL' | 'DEGRADED' | 'PARTIAL_OUTAGE' | 'MAJOR_OUTAGE' | 'MAINTENANCE';

interface Incident {
  id:          string;
  title:       string;
  description: string;
  severity:    string;
  startedAt:   string;
  isResolved:  boolean;
}

interface ServiceStatus {
  service:       string;
  displayName:   string;
  status:        StatusLevel;
  latencyMs:     number | null;
  uptimePercent: number;
  incidents:     Incident[];
}

interface StatusResponse {
  overall:   StatusLevel;
  services:  ServiceStatus[];
  updatedAt: string;
  error?:    string;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const STATUS_CONFIG: Record<StatusLevel, { label: string; dot: string; text: string; border: string; bg: string }> = {
  OPERATIONAL:    { label: 'Operational',    dot: 'bg-oz-green',   text: 'text-oz-green',   border: 'border-oz-green/20',  bg: 'bg-oz-green/5'  },
  DEGRADED:       { label: 'Degraded',       dot: 'bg-oz-amber',   text: 'text-oz-amber',   border: 'border-oz-amber/20',  bg: 'bg-oz-amber/5'  },
  PARTIAL_OUTAGE: { label: 'Partial Outage', dot: 'bg-oz-amber',   text: 'text-oz-amber',   border: 'border-oz-amber/20',  bg: 'bg-oz-amber/5'  },
  MAJOR_OUTAGE:   { label: 'Major Outage',   dot: 'bg-oz-red',     text: 'text-oz-red',     border: 'border-oz-red/20',    bg: 'bg-oz-red/5'    },
  MAINTENANCE:    { label: 'Maintenance',    dot: 'bg-oz-text-3',  text: 'text-oz-text-3',  border: 'border-oz-border',    bg: 'bg-oz-surface'  },
};

function StatusBadge({ status }: { status: StatusLevel }) {
  const cfg = STATUS_CONFIG[status];
  return (
    <span className={cn(
      'inline-flex items-center gap-1.5 font-mono text-2xs px-2 py-0.5 rounded-sm border tracking-widest uppercase',
      cfg.text, cfg.border, cfg.bg
    )}>
      <span className={cn('h-1.5 w-1.5 rounded-full', cfg.dot,
        status === 'OPERATIONAL' && 'animate-status-pulse'
      )} />
      {cfg.label}
    </span>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function TransparencyPage() {
  const [data,    setData]    = useState<StatusResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/status')
      .then((r) => r.json())
      .then((d) => { setData(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const overallCfg = data ? STATUS_CONFIG[data.overall] : null;

  return (
    <>
      <Navigation />

      <main className="relative min-h-screen bg-oz-black pt-24 pb-32 overflow-x-hidden">
        <div className="absolute inset-0 bg-grid opacity-40 pointer-events-none" />

        <div className="relative z-10 max-w-4xl mx-auto px-6">

          {/* Header */}
          <div className="mb-14">
            <div className="flex items-center gap-3 mb-4">
              <span className="h-px w-8 bg-oz-cyan/40" />
              <span className="font-mono text-xs text-oz-cyan tracking-[0.2em] uppercase">Transparency Hub</span>
            </div>
            <h1 className="font-display text-4xl lg:text-5xl font-bold tracking-tight text-oz-text mb-4">
              System Status<span className="text-oz-cyan">.</span>
            </h1>
            <p className="text-oz-text-2 leading-relaxed max-w-xl">
              Real-time health of all Ozone Labs infrastructure. Updated every 30 seconds.
              We believe in radical transparency — if something's broken, you'll see it here first.
            </p>
          </div>

          {/* Overall status banner */}
          <GlowCard className="p-6 mb-8 flex items-center justify-between gap-4" elevated={data?.overall === 'OPERATIONAL'}>
            <div>
              <p className="font-mono text-xs text-oz-text-3 tracking-widest uppercase mb-2">Overall Status</p>
              {loading ? (
                <div className="h-6 w-40 bg-oz-border rounded-sm animate-pulse" />
              ) : (
                <p className={cn('font-display text-2xl font-bold', overallCfg?.text)}>
                  {overallCfg?.label ?? 'Unknown'}
                </p>
              )}
            </div>
            {data?.updatedAt && (
              <p className="font-mono text-2xs text-oz-text-3 tracking-wider text-right">
                Last updated<br />
                {new Date(data.updatedAt).toLocaleTimeString()}
              </p>
            )}
          </GlowCard>

          {/* Services grid */}
          <div className="flex flex-col gap-4 mb-12">
            <h2 className="font-mono text-xs text-oz-text-3 tracking-widest uppercase">Services</h2>

            {loading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="h-16 bg-oz-surface border border-oz-border rounded-sm animate-pulse" />
              ))
            ) : (
              data?.services.map((svc) => (
                <GlowCard key={svc.service} className="px-6 py-4">
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-4 min-w-0">
                      <p className="font-mono text-sm text-oz-text truncate">{svc.displayName}</p>
                      {svc.incidents.length > 0 && (
                        <span className="font-mono text-2xs text-oz-red tracking-wider shrink-0">
                          Active incident
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-6 shrink-0">
                      {svc.latencyMs !== null && (
                        <span className="font-mono text-2xs text-oz-text-3 tracking-wider hidden sm:block">
                          {svc.latencyMs}ms
                        </span>
                      )}
                      {svc.uptimePercent != null && (
                        <span className="font-mono text-2xs text-oz-text-3 tracking-wider hidden sm:block">
                          {svc.uptimePercent.toFixed(2)}% uptime
                        </span>
                      )}
                      <StatusBadge status={svc.status} />
                    </div>
                  </div>

                  {/* Active incidents */}
                  {svc.incidents.map((inc) => (
                    <div key={inc.id} className="mt-3 pt-3 border-t border-oz-border">
                      <p className="font-mono text-xs text-oz-amber tracking-wider mb-1">{inc.title}</p>
                      <p className="font-mono text-xs text-oz-text-3 leading-relaxed">{inc.description}</p>
                    </div>
                  ))}
                </GlowCard>
              ))
            )}
          </div>

          {/* Architecture note */}
          <GlowCard className="p-6">
            <p className="font-mono text-xs text-oz-text-3 tracking-widest uppercase mb-3">Architecture</p>
            <p className="text-oz-text-2 text-sm leading-relaxed mb-4">
              Our LLM architecture chains Gemini → Groq → OpenRouter with automatic failover.
              If the primary provider degrades, traffic routes to the next provider within milliseconds —
              no downtime, no manual intervention.
            </p>
            <div className="flex flex-wrap gap-2">
              {['Gemini 2.0', 'Groq Llama', 'OpenRouter', 'Next.js Edge', 'Supabase', 'Vercel'].map((tag) => (
                <span key={tag} className="font-mono text-2xs px-2 py-0.5 border border-oz-border-2 text-oz-text-3 rounded-sm tracking-wider">
                  {tag}
                </span>
              ))}
            </div>
          </GlowCard>

          {/* Back link */}
          <div className="mt-10 flex justify-center">
            <Link
              href="/"
              className="font-mono text-xs text-oz-text-3 hover:text-oz-cyan transition-colors tracking-widest uppercase"
            >
              ← Back to homepage
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}
