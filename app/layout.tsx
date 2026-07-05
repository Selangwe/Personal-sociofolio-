import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Toaster } from 'sonner';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
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
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Samme Samuel | GHL Expert, AI Engineer & Virtual Assistant',
    description:
      'Helping businesses automate operations, generate leads, and scale with AI, GoHighLevel, and smart systems.',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="font-sans antialiased">
        {children}
        <Toaster position="bottom-right" />
      </body>
    </html>
  );
}
