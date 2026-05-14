'use client';

import { forwardRef } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
  // Base
  'relative inline-flex items-center justify-center gap-2 font-mono text-sm tracking-wider uppercase transition-all duration-200 disabled:pointer-events-none disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-oz-cyan focus-visible:ring-offset-2 focus-visible:ring-offset-oz-black',
  {
    variants: {
      variant: {
        // Primary: solid cyan fill with glow
        primary: [
          'bg-oz-cyan text-oz-black font-bold',
          'hover:shadow-[0_0_24px_rgba(0,229,255,0.5),0_0_48px_rgba(0,229,255,0.2)]',
          'hover:bg-[#33ecff]',
          'active:scale-[0.98]',
        ],
        // Outline: bordered, glows on hover
        outline: [
          'border border-oz-border-2 text-oz-text-2 bg-transparent',
          'hover:border-oz-cyan hover:text-oz-cyan hover:shadow-oz',
          'active:scale-[0.98]',
        ],
        // Ghost: no border, text only
        ghost: [
          'text-oz-text-3 bg-transparent',
          'hover:text-oz-cyan hover:bg-oz-cyan-dim',
          'active:scale-[0.98]',
        ],
        // Danger
        danger: [
          'border border-oz-red/30 text-oz-red bg-oz-red-dim',
          'hover:border-oz-red hover:shadow-[0_0_20px_rgba(255,61,87,0.2)]',
          'active:scale-[0.98]',
        ],
      },
      size: {
        sm:  'h-8  px-4 text-xs',
        md:  'h-10 px-6 text-sm',
        lg:  'h-12 px-8 text-sm',
        xl:  'h-14 px-10 text-base',
        icon:'h-10 w-10 p-0',
      },
    },
    defaultVariants: {
      variant: 'outline',
      size:    'md',
    },
  }
);

interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  loading?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, loading, children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(buttonVariants({ variant, size }), className)}
        disabled={loading || props.disabled}
        {...props}
      >
        {loading && (
          <span className="inline-block h-3 w-3 border border-current border-t-transparent rounded-full animate-spin" />
        )}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';

export { Button, buttonVariants };
