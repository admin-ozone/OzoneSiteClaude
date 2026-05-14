'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/Button';

const NAV_LINKS = [
  { href: '/#services',      label: 'Services' },
  { href: '/transparency',   label: 'Transparency' },
  { href: '/#work',          label: 'Work' },
] as const;

export function Navigation() {
  const pathname      = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen]         = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => { setOpen(false); }, [pathname]);

  return (
    <>
      <header
        className={cn(
          'fixed top-0 inset-x-0 z-50 transition-all duration-300',
          scrolled
            ? 'bg-oz-black/80 backdrop-blur-sm border-b border-oz-border'
            : 'bg-transparent border-b border-transparent'
        )}
      >
        <nav className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          {/* Wordmark */}
          <Link
            href="/"
            className="font-mono text-sm tracking-widest uppercase text-oz-text hover:text-oz-cyan transition-colors duration-200"
          >
            <span className="text-oz-cyan">OZ</span>
            <span className="text-oz-text-3 mx-1">/</span>
            LABS
          </Link>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-8">
            {NAV_LINKS.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className="font-mono text-xs tracking-widest uppercase text-oz-text-3 hover:text-oz-cyan transition-colors duration-200"
              >
                {label}
              </Link>
            ))}
          </div>

          {/* CTA */}
          <div className="hidden md:flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.location.href = 'mailto:founders@ozonelabs.io'}
            >
              Get in Touch
            </Button>
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden flex flex-col gap-1.5 p-2 text-oz-text-3 hover:text-oz-cyan transition-colors"
            onClick={() => setOpen((o) => !o)}
            aria-label="Toggle menu"
          >
            <span className={cn(
              'block h-px w-5 bg-current transition-all duration-300',
              open && 'rotate-45 translate-y-2'
            )} />
            <span className={cn(
              'block h-px w-5 bg-current transition-all duration-300',
              open && 'opacity-0'
            )} />
            <span className={cn(
              'block h-px w-5 bg-current transition-all duration-300',
              open && '-rotate-45 -translate-y-2'
            )} />
          </button>
        </nav>
      </header>

      {/* Mobile menu */}
      <div
        className={cn(
          'fixed inset-0 z-40 bg-oz-black/95 backdrop-blur-sm transition-all duration-300 md:hidden',
          open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        )}
      >
        <div className="flex flex-col items-center justify-center h-full gap-10">
          {NAV_LINKS.map(({ href, label }, i) => (
            <Link
              key={href}
              href={href}
              className={cn(
                'font-mono text-2xl tracking-widest uppercase',
                'text-oz-text-2 hover:text-oz-cyan transition-colors duration-200',
                'transition-all duration-300',
                open ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
              )}
              style={{ transitionDelay: open ? `${i * 60}ms` : '0ms' }}
            >
              {label}
            </Link>
          ))}
          <Button
            variant="primary"
            size="lg"
            className={cn(
              'mt-4 transition-all duration-300',
              open ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
            )}
            style={{ transitionDelay: open ? `${NAV_LINKS.length * 60}ms` : '0ms' }}
            onClick={() => {
              setOpen(false);
              window.location.href = 'mailto:founders@ozonelabs.io';
            }}
          >
            Get in Touch
          </Button>
        </div>
      </div>
    </>
  );
}
