'use client';

import { cn } from '@/lib/utils';

interface GlowCardProps extends React.HTMLAttributes<HTMLElement> {
  elevated?: boolean;
  noBorder?: boolean;
  as?: 'div' | 'article' | 'section' | 'li';
}

export function GlowCard({
  className,
  elevated = false,
  noBorder = false,
  as: Tag = 'div',
  children,
  ...props
}: GlowCardProps) {
  return (
    <div
      className={cn(
        'relative bg-oz-white rounded-sm transition-all duration-300',
        !noBorder && 'border border-oz-border',
        'hover:border-oz-border-2 hover:shadow-[0_2px_16px_rgba(0,0,0,0.06)]',
        elevated && 'border-oz-border-2 shadow-[0_2px_12px_rgba(0,0,0,0.05)]',
        className
      )}
      {...(props as React.HTMLAttributes<HTMLDivElement>)}
    >
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-oz-border to-transparent" />
      {children}
    </div>
  );
}