import type {Metadata} from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster"
import { FirebaseClientProvider } from '@/firebase';

export const metadata: Metadata = {
  title: 'Viajes HICA',
  description: 'Tu agencia de viajes para explorar el mundo.',
  manifest: '/manifest.json?v=8',
  icons: {
    icon: [
      { url: '/logo.blau.png?v=8', sizes: 'any', type: 'image/png' },
    ],
    apple: '/logo.blau.png?v=8',
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
