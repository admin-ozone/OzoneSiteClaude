'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

const NAV_LINKS = [
  { href: '/#services',    label: 'Services' },
  { href: '/transparency', label: 'Status'   },
  { href: '/#work',        label: 'Work'     },
  { href: '/#about',       label: 'About'    },
] as const;

export function Navigation() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen]         = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => { setOpen(false); }, [pathname]);

  return (
    <>
      <header
        className={cn(
          'fixed top-0 inset-x-0 z-50 transition-all duration-300',
          // FIXED: always visible — border and bg present from the start
          'border-b border-oz-border',
          scrolled
            ? 'bg-oz-black/90 backdrop-blur-md'
            : 'bg-oz-black'
        )}
      >
        <nav className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between gap-8">

          {/* Wordmark */}
          <Link
            href="/"
            className="font-mono text-sm font-bold tracking-[0.2em] uppercase shrink-0 group"
          >
            <span className="text-oz-cyan group-hover:text-white transition-colors duration-200">OZ</span>
            <span className="text-oz-border-2 mx-1.5">/</span>
            <span className="text-oz-text group-hover:text-oz-cyan transition-colors duration-200">LABS</span>
          </Link>

          {/* Desktop nav — FIXED: text-oz-text-2 instead of invisible text-oz-text-3 */}
          <div className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className={cn(
                  'font-mono text-xs tracking-[0.15em] uppercase px-4 py-2 rounded-sm',
                  'text-oz-text-2 hover:text-oz-text hover:bg-oz-surface',
                  'transition-all duration-150'
                )}
              >
                {label}
              </Link>
            ))}
          </div>

          {/* CTA */}
          <div className="hidden md:flex items-center gap-3 shrink-0">
            <Link
              href="/auth/login"
              className="font-mono text-xs tracking-widest uppercase text-oz-text-3 hover:text-oz-text transition-colors duration-150 px-3 py-2"
            >
              Portal
            </Link>
            <a
              href="mailto:founders@ozonelabs.io"
              className={cn(
                'font-mono text-xs tracking-widest uppercase',
                'bg-oz-cyan text-oz-black font-bold',
                'px-5 py-2.5 rounded-sm',
                'hover:bg-white transition-colors duration-150',
                'hover:shadow-[0_0_24px_rgba(0,229,255,0.4)]'
              )}
            >
              Get in Touch
            </a>
          </div>

          {/* Mobile toggle */}
          <button
            className="md:hidden flex flex-col gap-1.5 p-2 text-oz-text-2 hover:text-oz-cyan transition-colors"
            onClick={() => setOpen(o => !o)}
            aria-label="Toggle menu"
          >
            <span className={cn('block h-px w-5 bg-current transition-all duration-300', open && 'rotate-45 translate-y-2')} />
            <span className={cn('block h-px w-5 bg-current transition-all duration-300', open && 'opacity-0')} />
            <span className={cn('block h-px w-5 bg-current transition-all duration-300', open && '-rotate-45 -translate-y-2')} />
          </button>
        </nav>
      </header>

      {/* Mobile drawer */}
      <div className={cn(
        'fixed inset-0 z-40 bg-oz-black/98 backdrop-blur-sm transition-all duration-300 md:hidden',
        open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
      )}>
        <div className="flex flex-col items-center justify-center h-full gap-8">
          {NAV_LINKS.map(({ href, label }, i) => (
            <Link
              key={href}
              href={href}
              className={cn(
                'font-display text-3xl font-bold tracking-tight uppercase',
                'text-oz-text-2 hover:text-oz-cyan transition-all duration-200',
                open ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'
              )}
              style={{ transitionDelay: open ? `${i * 60 + 80}ms` : '0ms' }}
            >
              {label}
            </Link>
          ))}
          <a
            href="mailto:founders@ozonelabs.io"
            className={cn(
              'mt-4 font-mono text-sm tracking-widest uppercase font-bold',
              'bg-oz-cyan text-oz-black px-8 py-3 rounded-sm',
              'hover:bg-white transition-colors duration-150',
              open ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'
            )}
            style={{ transitionDelay: open ? `${NAV_LINKS.length * 60 + 80}ms` : '0ms' }}
          >
            Get in Touch
          </a>
        </div>
      </div>
    </>
  );
}