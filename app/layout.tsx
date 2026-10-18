import type { Metadata } from 'next';
import { DM_Sans, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/context/AuthContext';
import Navbar from '@/components/layout/Navbar';
import LivePlatformTicker from '@/components/layout/LivePlatformTicker';
import Footer from '@/components/layout/Footer';
import FaqChatbot from '@/components/ai/FaqChatbot';

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'GSAP | 18+ Verified University Student Marketplace & Cross-Border Concierge',
  description:
    'A high-trust peer marketplace connecting global clients & diasporas with verified 18+ university students for technology, research, tutoring, and family eldercare assistance with neutral milestone escrow.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`h-full ${dmSans.variable} ${jetbrainsMono.variable}`}>
      <body className="min-h-full flex flex-col font-sans bg-zinc-50 text-zinc-900 selection:bg-amber-500 selection:text-white">
        <AuthProvider>
          <Navbar />
          <LivePlatformTicker />
          <main className="flex-1">{children}</main>
          <Footer />
          <FaqChatbot />
        </AuthProvider>
      </body>
    </html>
  );
}
