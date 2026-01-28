import type {Metadata} from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster"
import { FirebaseClientProvider } from '@/firebase';

export const metadata: Metadata = {
  title: 'Viajes HICA',
  description: 'Tu agencia de viajes para explorar el mundo.',
  themeColor: '#0a0a0a',
  manifest: '/manifest.json?v=3',
  icons: [
    {
      rel: 'icon',
      url: '/logo.blau.png?v=3',
      type: 'image/png',
      sizes: '32x32',
    },
    {
      rel: 'icon',
      url: '/logo.blau.png?v=3',
      type: 'image/png',
      sizes: '192x192',
    },
    {
      rel: 'apple-touch-icon',
      url: '/logo.blau.png?v=3',
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className="font-body antialiased">
        <FirebaseClientProvider>
          {children}
        </FirebaseClientProvider>
        <Toaster />
      </body>
    </html>
  );
}
