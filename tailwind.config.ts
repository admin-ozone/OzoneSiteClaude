import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      // ── Design Tokens ──────────────────────────────────────────────────────
      colors: {
        oz: {
          // Core palette
          black:      '#050507',
          'black-2':  '#0a0a0e',
          'black-3':  '#0f0f14',
          surface:    '#141419',
          'surface-2':'#1a1a21',
          border:     '#1e1e28',
          'border-2': '#2a2a38',
          // Text hierarchy
          text:       '#f0f0f4',
          'text-2':   '#9898b0',
          'text-3':   '#52526a',
          muted:      '#2e2e40',
          // Accent — electric cyan, the only colour in the system
          cyan:       '#00E5FF',
          'cyan-dim': 'rgba(0, 229, 255, 0.1)',
          'cyan-glow':'rgba(0, 229, 255, 0.2)',
          // Status colours
          green:      '#00FF88',
          'green-dim':'rgba(0, 255, 136, 0.1)',
          amber:      '#FFB800',
          'amber-dim':'rgba(255, 184, 0, 0.1)',
          red:        '#FF3D57',
          'red-dim':  'rgba(255, 61, 87, 0.1)',
        },
      },

      // ── Typography ─────────────────────────────────────────────────────────
      fontFamily: {
        // Syne: display headings — geometric, authoritative, technical
        display: ['var(--font-syne)', 'sans-serif'],
        // Space Mono: all monospace — terminal, code, data
        mono:    ['var(--font-space-mono)', 'Consolas', 'monospace'],
        // Geist Sans: body copy
        sans:    ['var(--font-geist-sans)', 'sans-serif'],
      },

      fontSize: {
        // 12px base scale with tight tracking for terminal feel
        '2xs': ['0.625rem', { lineHeight: '1rem' }],
      },

      // ── Spacing ────────────────────────────────────────────────────────────
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '112': '28rem',
        '128': '32rem',
      },

      // ── Animations ─────────────────────────────────────────────────────────
      keyframes: {
        // Terminal cursor blink
        cursor: {
          '0%, 100%': { opacity: '1' },
          '50%':       { opacity: '0' },
        },
        // Text reveal — characters appear one by one via clip-path
        'text-reveal': {
          from: { clipPath: 'inset(0 100% 0 0)' },
          to:   { clipPath: 'inset(0 0% 0 0)' },
        },
        // Phosphor glow pulse
        'glow-pulse': {
          '0%, 100%': { boxShadow: '0 0 0px rgba(0,229,255,0)' },
          '50%':       { boxShadow: '0 0 20px rgba(0,229,255,0.3), 0 0 40px rgba(0,229,255,0.15)' },
        },
        // Scanline scroll
        scanline: {
          '0%':   { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100vh)' },
        },
        // Float for decorative elements
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%':       { transform: 'translateY(-8px)' },
        },
        // Slide in from left (terminal lines)
        'slide-in-left': {
          from: { opacity: '0', transform: 'translateX(-12px)' },
          to:   { opacity: '1', transform: 'translateX(0)' },
        },
        // Status dot pulse
        'status-pulse': {
          '0%, 100%': { opacity: '1',  transform: 'scale(1)' },
          '50%':       { opacity: '0.4', transform: 'scale(0.85)' },
        },
        // Grid fade-in for service cards
        'grid-in': {
          from: { opacity: '0', transform: 'translateY(20px) scale(0.97)' },
          to:   { opacity: '1', transform: 'translateY(0) scale(1)' },
        },
      },

      animation: {
        'cursor':         'cursor 1.1s ease-in-out infinite',
        'text-reveal':    'text-reveal 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'glow-pulse':     'glow-pulse 3s ease-in-out infinite',
        'scanline':       'scanline 8s linear infinite',
        'float':          'float 6s ease-in-out infinite',
        'slide-in-left':  'slide-in-left 0.3s cubic-bezier(0.16, 1, 0.3, 1) both',
        'status-pulse':   'status-pulse 2s ease-in-out infinite',
        'grid-in':        'grid-in 0.5s cubic-bezier(0.16, 1, 0.3, 1) both',
      },

      // ── Shadows ─────────────────────────────────────────────────────────────
      boxShadow: {
        'oz-sm':  '0 0 0 1px rgba(0,229,255,0.12)',
        'oz':     '0 0 0 1px rgba(0,229,255,0.18), 0 0 20px rgba(0,229,255,0.08)',
        'oz-lg':  '0 0 0 1px rgba(0,229,255,0.25), 0 0 40px rgba(0,229,255,0.15), 0 0 80px rgba(0,229,255,0.05)',
        'inset':  'inset 0 1px 0 rgba(255,255,255,0.04)',
      },

      // ── Backdrop Blur ───────────────────────────────────────────────────────
      backdropBlur: {
        'xs': '2px',
      },
    },
  },

  plugins: [
    require('@tailwindcss/typography'),
  ],
};

export default config;
