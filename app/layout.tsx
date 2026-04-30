import type { Metadata, Viewport } from 'next';

import '../styles/global.css';
import '../styles/variables.css';

export const metadata: Metadata = {
  title: 'Omni — Agent-First OS',
  description: 'A post-smartphone operating system simulator. Issue commands, watch AI agents execute.',
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/favicon.ico', sizes: 'any' },
    ],
    apple: '/apple-touch-icon.svg',
  },
};

export const viewport: Viewport = {
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  width: 'device-width',
  viewportFit: 'cover',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
