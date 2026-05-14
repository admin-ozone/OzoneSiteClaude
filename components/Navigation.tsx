'use client';

/**
 * NAVIGATION — Ozone Labs
 * ─────────────────────────────────────────────────────────────────────────────
 * Sticky top nav. Always visible (border + bg applied from mount).
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

  // Lock body scroll when drawer is open
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
        // Inline styles guarantee visibility regardless of Tailwind v4 config resolution
        style={{
          borderBottomColor: scrolled ? 'rgba(30, 30, 40, 0.8)' : '#1e1e28',
          backgroundColor:   scrolled ? 'rgba(5, 5, 7, 0.85)'   : '#050507',
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
              className="transition-colors duration-200 group-hover:text-white"
              style={{ color: '#00E5FF' }}
            >
              OZ
            </span>
            <span style={{ color: '#2a2a38', margin: '0 6px' }}>/</span>
            <span
              className="transition-colors duration-200 group-hover:text-oz-cyan"
              style={{ color: '#f0f0f4' }}
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
                      ? 'text-oz-cyan bg-oz-cyan-dim'
                      : 'text-oz-text-2 hover:text-oz-text hover:bg-oz-surface',
                  )}
                  style={
                    active
                      ? { color: '#00E5FF', backgroundColor: 'rgba(0,229,255,0.08)' }
                      : { color: '#9898b0' }
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
              style={{ color: '#52526a' }}
              onMouseEnter={e => (e.currentTarget.style.color = '#9898b0')}
              onMouseLeave={e => (e.currentTarget.style.color = '#52526a')}
            >
              Portal
            </Link>
            <a
              href="mailto:founders@ozonelabs.io"
              className="font-mono text-xs tracking-widest uppercase font-bold px-5 py-2.5 rounded-sm transition-all duration-150"
              style={{
                backgroundColor: '#00E5FF',
                color:           '#050507',
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLAnchorElement).style.backgroundColor = '#ffffff';
                (e.currentTarget as HTMLAnchorElement).style.boxShadow = '0 0 24px rgba(0,229,255,0.4)';
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLAnchorElement).style.backgroundColor = '#00E5FF';
                (e.currentTarget as HTMLAnchorElement).style.boxShadow = 'none';
              }}
            >
              Get in Touch
            </a>
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden flex flex-col justify-center gap-[5px] p-2 transition-colors duration-200"
            style={{ color: open ? '#00E5FF' : '#9898b0' }}
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
          backgroundColor:   'rgba(5,5,7,0.98)',
          backdropFilter:    'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
          opacity:          open ? 1 : 0,
          pointerEvents:    open ? 'auto' : 'none',
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
                  color:            '#52526a',
                  opacity:          open ? 1 : 0,
                  transform:        open ? 'translateY(0)' : 'translateY(24px)',
                  transitionDelay:  open ? `${i * 70 + 80}ms` : '0ms',
                }}
                onMouseEnter={e => (e.currentTarget.style.color = '#00E5FF')}
                onMouseLeave={e => (e.currentTarget.style.color = '#52526a')}
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
              href="mailto:founders@ozonelabs.io"
              className="w-full text-center font-mono text-sm tracking-widest uppercase font-bold py-4 rounded-sm transition-colors duration-150"
              style={{ backgroundColor: '#00E5FF', color: '#050507' }}
            >
              Get in Touch
            </a>
            <Link
              href="/auth/login"
              className="w-full text-center font-mono text-xs tracking-widest uppercase py-3 transition-colors duration-150"
              style={{ color: '#52526a' }}
            >
              Client Portal →
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}