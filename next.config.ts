import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // ── Experimental Features ─────────────────────────────────────────────────
  experimental: {
    // React 19 PPR: partial pre-rendering for shell + streaming content
    // Enable typed routes for compile-time route safety
    typedRoutes: true,
    // Optimise server component imports
    optimizePackageImports: [
      'framer-motion',
      'lucide-react',
      '@radix-ui/react-dialog',
    ],
  },

  // ── Image Domains ─────────────────────────────────────────────────────────
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'avatars.githubusercontent.com' },
      { protocol: 'https', hostname: 'lh3.googleusercontent.com' },
    ],
    formats: ['image/avif', 'image/webp'],
  },

  // ── Security Headers ──────────────────────────────────────────────────────
  // These headers make Ozone Labs score A+ on securityheaders.com
  // Critical for the "anti-scam / trust signals" brand positioning
  async headers() {
    const isDev = process.env.NODE_ENV === 'development';

    const cspDirectives = [
      "default-src 'self'",
      "script-src 'self' 'unsafe-eval' 'unsafe-inline'", // unsafe-eval needed for Next.js dev
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' https://fonts.gstatic.com",
      "img-src 'self' data: blob: https:",
      "media-src 'self'",
      `connect-src 'self' ${isDev ? 'ws://localhost:* wss://localhost:*' : ''} https://generativelanguage.googleapis.com https://api.groq.com`,
      "frame-ancestors 'none'",
      "base-uri 'self'",
      "form-action 'self'",
    ].join('; ');

    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Frame-Options',            value: 'DENY' },
          { key: 'X-Content-Type-Options',      value: 'nosniff' },
          { key: 'X-XSS-Protection',            value: '1; mode=block' },
          { key: 'Referrer-Policy',             value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy',          value: 'camera=(), microphone=(), geolocation=()' },
          { key: 'Strict-Transport-Security',   value: 'max-age=63072000; includeSubDomains; preload' },
          { key: 'Content-Security-Policy',     value: cspDirectives },
        ],
      },
    ];
  },

  // ── Redirects ─────────────────────────────────────────────────────────────
  async redirects() {
    return [
      {
        source: '/portal',
        destination: '/portal/dashboard',
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
