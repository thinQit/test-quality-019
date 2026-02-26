import type { Metadata } from 'next';
import './globals.css';
import Navigation from '@/components/layout/Navigation';
import Toaster from '@/components/ui/Toaster';
import AuthProvider from '@/providers/AuthProvider';
import ToastProvider from '@/providers/ToastProvider';

export const metadata: Metadata = {
  title: 'Portfolio',
  description: 'Single-page portfolio site with a hero section and a contact form.'
};

export function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-background text-foreground">
        <AuthProvider>
          <ToastProvider>
            <Navigation />
            <main className="min-h-screen">{children}</main>
            <Toaster />
          </ToastProvider>
        </AuthProvider>
      </body>
    </html>
  );
}

export default RootLayout;
