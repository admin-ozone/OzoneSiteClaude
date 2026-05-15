import type { Metadata, Viewport } from 'next';
import { Syne, Space_Mono } from 'next/font/google';
import { GeistSans } from 'geist/font/sans';
import './globals.css'; 

// ─── Typography ───────────────────────────────────────────────────────────────

const syne = Syne({
  subsets: ['latin'],
  variable: '--font-syne',
  weight: ['400', '500', '600', '700', '800'],
  display: 'swap',
});

const spaceMono = Space_Mono({
  subsets: ['latin'],
  variable: '--font-space-mono',
  weight: ['400', '700'],
  display: 'swap',
});

// ─── Metadata ─────────────────────────────────────────────────────────────────

export const metadata: Metadata = {
  metadataBase: new URL(process.env.APP_URL ?? 'https://ozbuilts.com'),

  title: {
    template: '%s — Ozone Labs',
    default: 'Ozone Labs — AI Infrastructure for Local Business',
  },

  description:
    'We build production-ready AI Assistants, Bot Infrastructure, and Web Applications. ' +
    'Trilingual (English, Roman Urdu, Urdu). Zero-cost LLM architecture.',

  keywords: [
    'AI Assistant', 'WhatsApp Bot', 'Islamabad', 'Pakistan',
    'Next.js Agency', 'Bot Infrastructure', 'RAG', 'Gemini API',
  ],

  authors: [{ name: 'Ozone Labs', url: 'https://ozonelabs.io' }],

  openGraph: {
    type:        'website',
    locale:      'en_US',
    url:         'https://ozonelabs.io',
    siteName:    'Ozone Labs',
    title:       'Ozone Labs — AI Infrastructure for Local Business',
    description: 'Production-ready AI Assistants, Bot Infrastructure, and Web Applications.',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'Ozone Labs' }],
  },

  twitter: {
    card:    'summary_large_image',
    title:   'Ozone Labs',
    description: 'AI Infrastructure for Local Business',
    images:  ['/og-image.png'],
  },

  robots: {
    index:  true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-video-preview': -1, 'max-image-preview': 'large' },
  },

  icons: {
    icon: [
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: '/apple-touch-icon.png',
  },
};

export const viewport: Viewport = {
  themeColor:     '#050507',
  width:          'device-width',
  initialScale:   1,
};

// ─── Root Layout ──────────────────────────────────────────────────────────────

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${syne.variable} ${spaceMono.variable} ${GeistSans.variable}`}
      suppressHydrationWarning
    >
      <body className="bg-oz-black font-sans text-oz-text antialiased selection:bg-oz-cyan-dim selection:text-oz-cyan">
        {children}
      </body>
    </html>
  );
}
