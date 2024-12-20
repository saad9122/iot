import type { Metadata } from 'next';
import { Inter as FontSans } from 'next/font/google';
import './globals.css';
import { cn } from '@/lib/utils';
import AuthProvider from '@/context/AuthProvider';
import { Toaster } from '@/components/ui/toaster';

const inter = FontSans({
  subsets: ['latin'],
  variable: '--font-sans',
});

export const metadata: Metadata = {
  title: 'Create Next App',
  description: 'Generated by create next app',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={cn('min-h-screen bg-background font-sans antialiased', inter.variable)}>
        <AuthProvider>
          <div className="2xl:container mx-auto">
            {children}
            <Toaster />
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
