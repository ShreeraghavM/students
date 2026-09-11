import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/context/AuthContext';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import FaqChatbot from '@/components/ai/FaqChatbot';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Global Student Assistance Platform | 18+ Verified Marketplace',
  description:
    'A premier marketplace connecting clients needing assistance with verified university students (18+ only) offering paid hourly skills in tech, design, tutoring, and research.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body className={`${inter.className} min-h-full flex flex-col`}>
        <AuthProvider>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
          <FaqChatbot />
        </AuthProvider>
      </body>
    </html>
  );
}
