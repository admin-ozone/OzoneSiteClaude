'use client';

/**
 * NAVIGATION — Ozone Labs
 * ─────────────────────────────────────────────────────────────────────────────
 * Sticky top nav. White background, subtle border.
 * Glassmorphism on scroll. Mobile full-screen drawer.
 * ─────────────────────────────────────────────────────────────────────────────
 */

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

const NAV_LINKS = [
  { href: '/#services',    label: 'Services' },
  { href: '/transparency', label: 'Status'   },
  { href: '/#work',        label: 'Process'  },
  { href: '/#about',       label: 'Stack'    },
] as const;

export function Navigation() {
  const pathname  = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open,     setOpen]     = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => { setOpen(false); }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  return (
    <>
      {/* ── Main header ───────────────────────────────────────────────────── */}
      <header
        className={cn(
          'fixed top-0 inset-x-0 z-50',
          'border-b transition-all duration-300',
        )}
        style={{
          borderBottomColor: '#DEDAD4',
          backgroundColor:   scrolled ? 'rgba(255,255,255,0.88)' : '#FFFFFF',
          backdropFilter:    scrolled ? 'blur(16px)'             : 'none',
          WebkitBackdropFilter: scrolled ? 'blur(16px)'          : 'none',
        }}
      >
        <nav className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between gap-8">

          {/* Wordmark */}
          <Link
            href="/"
            className="group font-mono text-sm font-bold tracking-[0.2em] uppercase shrink-0"
          >
            <span
              className="transition-colors duration-200"
              style={{ color: '#FF3428' }}
            >
              OZ
            </span>
            <span style={{ color: '#C8C4BE', margin: '0 6px' }}>/</span>
            <span
              className="transition-colors duration-200 group-hover:text-oz-red"
              style={{ color: '#111110' }}
            >
              LABS
            </span>
          </Link>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map(({ href, label }) => {
              const active = pathname === href;
              return (
                <Link
                  key={href}
                  href={href}
                  className={cn(
                    'font-mono text-xs tracking-[0.15em] uppercase px-4 py-2 rounded-sm',
                    'transition-all duration-150',
                    active
                      ? 'text-oz-red bg-oz-red-dim'
                      : 'text-oz-text-3 hover:text-oz-text-2 hover:bg-oz-surface',
                  )}
                  style={
                    active
                      ? { color: '#FF3428', backgroundColor: 'rgba(255,52,40,0.08)' }
                      : { color: '#7A7873' }
                  }
                >
                  {label}
                </Link>
              );
            })}
          </div>

          {/* Desktop CTA group */}
          <div className="hidden md:flex items-center gap-3 shrink-0">
            <Link
              href="/auth/login"
              className="font-mono text-xs tracking-widest uppercase px-3 py-2 transition-colors duration-150"
              style={{ color: '#B0ADA8' }}
              onMouseEnter={e => (e.currentTarget.style.color = '#7A7873')}
              onMouseLeave={e => (e.currentTarget.style.color = '#B0ADA8')}
            >
              Portal
            </Link>
            <a
              href="mailto:founders@ozbuilts.com"
              className="font-mono text-xs tracking-widest uppercase font-bold px-5 py-2.5 rounded-sm transition-all duration-150"
              style={{
                backgroundColor: '#FF3428',
                color:           '#FFFFFF',
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLAnchorElement).style.backgroundColor = '#E02D22';
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLAnchorElement).style.backgroundColor = '#FF3428';
              }}
            >
              Get in Touch
            </a>
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden flex flex-col justify-center gap-[5px] p-2 transition-colors duration-200"
            style={{ color: open ? '#FF3428' : '#7A7873' }}
            onClick={() => setOpen(o => !o)}
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
          >
            <span
              className="block h-px w-5 bg-current transition-all duration-300 origin-center"
              style={{ transform: open ? 'rotate(45deg) translateY(5px)' : 'none' }}
            />
            <span
              className="block h-px w-5 bg-current transition-all duration-300"
              style={{ opacity: open ? 0 : 1, transform: open ? 'scaleX(0)' : 'none' }}
            />
            <span
              className="block h-px w-5 bg-current transition-all duration-300 origin-center"
              style={{ transform: open ? 'rotate(-45deg) translateY(-5px)' : 'none' }}
            />
          </button>
        </nav>
      </header>

      {/* ── Mobile drawer ─────────────────────────────────────────────────── */}
      <div
        className="fixed inset-0 z-40 md:hidden transition-all duration-300"
        style={{
          backgroundColor:      'rgba(255,255,255,0.98)',
          backdropFilter:       'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
          opacity:              open ? 1 : 0,
          pointerEvents:        open ? 'auto' : 'none',
        }}
        aria-hidden={!open}
      >
        <div className="flex flex-col h-full pt-24 pb-12 px-8 justify-between">

          {/* Nav links */}
          <nav className="flex flex-col gap-2">
            {NAV_LINKS.map(({ href, label }, i) => (
              <Link
                key={href}
                href={href}
                className="font-display text-4xl font-bold uppercase tracking-tight transition-all duration-200"
                style={{
                  color:           '#C8C4BE',
                  opacity:         open ? 1 : 0,
                  transform:       open ? 'translateY(0)' : 'translateY(24px)',
                  transitionDelay: open ? `${i * 70 + 80}ms` : '0ms',
                }}
                onMouseEnter={e => (e.currentTarget.style.color = '#FF3428')}
                onMouseLeave={e => (e.currentTarget.style.color = '#C8C4BE')}
              >
                {label}
              </Link>
            ))}
          </nav>

          {/* Bottom group */}
          <div
            className="flex flex-col gap-5"
            style={{
              opacity:         open ? 1 : 0,
              transform:       open ? 'translateY(0)' : 'translateY(24px)',
              transitionDelay: open ? `${NAV_LINKS.length * 70 + 100}ms` : '0ms',
              transition:      'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
            }}
          >
            <a
              href="mailto:founders@ozbuilts.com"
              className="w-full text-center font-mono text-sm tracking-widest uppercase font-bold py-4 rounded-sm transition-colors duration-150"
              style={{ backgroundColor: '#FF3428', color: '#FFFFFF' }}
            >
              Get in Touch
            </a>
            <Link
              href="/auth/login"
              className="w-full text-center font-mono text-xs tracking-widest uppercase py-3 transition-colors duration-150"
              style={{ color: '#B0ADA8' }}
            >
              Client Portal →
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}