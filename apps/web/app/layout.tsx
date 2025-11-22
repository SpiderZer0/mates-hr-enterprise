import type { Metadata } from 'next';
import { Inter, Noto_Sans_Arabic } from 'next/font/google';
// Theme tokens are now included in globals.css
import './globals.css';
import { Providers } from './providers';

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
});

const notoSansArabic = Noto_Sans_Arabic({ 
  subsets: ['arabic'],
  variable: '--font-arabic',
});

export const metadata: Metadata = {
  title: 'Mates HR - نظام إدارة الموارد البشرية',
  description: 'Enterprise Human Resources Management System',
  keywords: ['HR', 'Human Resources', 'Employee Management', 'Payroll', 'Attendance'],
  authors: [{ name: 'Mates HR Team' }],
  robots: 'index, follow',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${notoSansArabic.variable} font-sans`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
