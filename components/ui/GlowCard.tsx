'use client';

import { cn } from '@/lib/utils';

interface GlowCardProps extends React.HTMLAttributes<HTMLElement> {
  glow?: boolean;
  noBorder?: boolean;
  as?: 'div' | 'article' | 'section' | 'li';
}

export function GlowCard({
  className,
  glow = false,
  noBorder = false,
  as: Tag = 'div',
  children,
  ...props
}: GlowCardProps) {
  return (
    <div
      className={cn(
        'relative bg-oz-surface rounded-sm transition-all duration-300',
        !noBorder && 'border border-oz-border',
        'hover:border-oz-cyan/20 hover:shadow-[0_0_0_1px_rgba(0,229,255,0.1),0_0_30px_rgba(0,229,255,0.06)]',
        glow && 'border-oz-cyan/20 shadow-oz',
        className
      )}
      {...(props as React.HTMLAttributes<HTMLDivElement>)}
    >
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-oz-border-2 to-transparent" />
      {children}
    </div>
  );
}