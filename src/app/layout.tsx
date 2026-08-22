import type { Metadata } from 'next';
import './globals.css';
import { readSession } from '@/lib/auth';
import { ActiveNav } from '@/components/ActiveNav';
import { PageTransition } from '@/components/Anim';
import { HeaderNav } from '@/components/HeaderNav';
import { FloatingActionBar } from '@/components/FloatingActionBar';

export const metadata: Metadata = {
  title: 'GlobeTrotter — Personalized Travel Planning Platform',
  description: 'Dream it, plan it, share it. Multi-city itineraries, budget engines, interactive calendars and smart tools.',
  icons: {
    icon: '/favicon.svg',
    shortcut: '/favicon.svg',
    apple: '/favicon.svg',
  },
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const session = await readSession();

  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Plus+Jakarta+Sans:wght@600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body suppressHydrationWarning className="bg-slate-50 text-slate-900 min-h-screen">
        <ActiveNav />
        <HeaderNav userSession={session} />
        <PageTransition>{children}</PageTransition>
        <FloatingActionBar />
      </body>
    </html>
  );
}
