import type {Metadata} from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster"
import { FirebaseClientProvider } from '@/firebase';

export const metadata: Metadata = {
  title: 'Viajes HICA',
  description: 'Tu agencia de viajes para explorar el mundo.',
  themeColor: '#0a0a0a',
  manifest: '/manifest.json?v=6',
  icons: {
    icon: [
      { url: '/logo.blau.png?v=6', sizes: '32x32', type: 'image/png' },
      { url: '/logo.blau.png?v=6', sizes: '16x16', type: 'image/png' },
    ],
    apple: '/logo.blau.png?v=6',
  },
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
