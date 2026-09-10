import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Toaster } from 'sonner';
import { ThemeProvider } from '@/components/theme-provider';
import { ChatWidget } from '@/components/chat/chat-widget';
import { SITE_URL } from '@/lib/site-config';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: 'Samme Samuel | GHL Expert, AI Engineer & Virtual Assistant',
  description:
    'Helping businesses automate operations, generate leads, and scale with AI, GoHighLevel, and smart systems. Book a consultation today.',
  keywords: [
    'AI Automation',
    'GoHighLevel Expert',
    'Virtual Assistant',
    'Cold Email Systems',
    'Lead Generation',
    'CRM Setup',
    'Web Development',
    'Samme Samuel',
  ],
  authors: [{ name: 'Samme Samuel' }],
  openGraph: {
    title: 'Samme Samuel | GHL Expert, AI Engineer & Virtual Assistant',
    description:
      'Helping businesses automate operations, generate leads, and scale with AI, GoHighLevel, and smart systems.',
    type: 'website',
    url: '/',
    siteName: 'Samme Samuel',
    images: [{ url: '/og-image.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Samme Samuel | GHL Expert, AI Engineer & Virtual Assistant',
    description:
      'Helping businesses automate operations, generate leads, and scale with AI, GoHighLevel, and smart systems.',
    images: ['/og-image.png'],
  },
  alternates: { canonical: '/' },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <body className="font-sans antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <ChatWidget />
          <Toaster position="bottom-right" />
        </ThemeProvider>
      </body>
    </html>
  );
}
