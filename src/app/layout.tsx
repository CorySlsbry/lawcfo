import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'LawCFO | Financial Dashboard for Law Firms (Small to Mid-sized)',
  description:
    'Real-time financial dashboard for law firms (small to mid-sized) businesses. Built for managing partners, firm administrators, and financial controllers at law firms with 5-50 attorneys.. Industry-specific KPIs, automated reporting, and integrations with QuickBooks, Stripe, and more.',
  keywords: 'law firms (small to mid-sized) financial dashboard, LawCFO, lawcfo, CFO dashboard, law firms (small to mid-sized) accounting, financial reporting, KPI tracking',
  openGraph: {
    title: 'LawCFO | Financial Dashboard for Law Firms (Small to Mid-sized)',
    description: 'Real-time financial visibility for law firms (small to mid-sized) businesses. 14-day free trial.',
    url: 'https://lawcfo.vercel.app',
    siteName: 'LawCFO',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'LawCFO | Financial Dashboard for Law Firms (Small to Mid-sized)',
    description: 'Real-time financial visibility for law firms (small to mid-sized) businesses.',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <style>{`:root { --accent-color: #3b82f6; }`}</style>
      </head>
      <body className={inter.className}>{children}</body>
    </html>
  );
}
