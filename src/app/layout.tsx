import type {Metadata} from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster"
import { FirebaseClientProvider } from '@/firebase';

export const metadata: Metadata = {
  title: 'Viajes HICA',
  description: 'Tu agencia de viajes para explorar el mundo.',
  themeColor: '#0a0a0a',
  manifest: '/manifest.json?v=2',
  icons: {
    icon: '/logo.blau.png',
    apple: '/logo.blau.png',
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
