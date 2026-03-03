'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, LogOut, User, Building, FileText, ClipboardList, ArrowLeft, Home } from 'lucide-react';
import { useLocale } from '@/contexts/locale-context';
import { translations } from '@/lib/translations';
import Link from 'next/link';

type UserData = {
  usuari: string;
  empresa: string;
};

export default function DashboardPage() {
  const { locale } = useLocale();
  const t = translations[locale];
  const router = useRouter();
  const [user, setUser] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const userDataString = localStorage.getItem('user');
    if (userDataString) {
      setUser(JSON.parse(userDataString));
    } else {
      router.push('/account');
    }
    setIsLoading(false);
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
    router.push('/account');
  };

  if (isLoading || !user) return <div className="flex min-h-screen items-center justify-center"><Loader2 className="animate-spin" /></div>;

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <main className="flex-grow container mx-auto px-4 py-8 max-w-lg">
        <div className="mb-6 flex flex-col sm:flex-row gap-3 justify-start">
          <Button asChild variant="ghost" className="text-primary hover:text-primary/80 font-bold">
            <Link href="/account">
              <ArrowLeft className="mr-2 h-4 w-4" />
              {locale === 'ca' ? 'Tornar al Compte' : locale === 'en' ? 'Back to Account' : locale === 'fr' ? 'Retour au Compte' : 'Volver a la Cuenta'}
            </Link>
          </Button>
          <Button asChild variant="ghost" className="text-primary hover:text-primary/80 font-bold">
            <Link href="/">
              <Home className="mr-2 h-4 w-4" />
              {t.account.backToHome}
            </Link>
          </Button>
        </div>

        <Card className="w-full shadow-xl border-primary/20">
          <CardHeader className="text-center">
            <CardTitle className="font-headline text-4xl text-primary-foreground">{t.account.profile}</CardTitle>
            <CardDescription className="text-lg">
              {t.account.profileSub} {user.usuari}.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4 p-4 border rounded-md bg-card">
                <User className="h-6 w-6 text-primary" />
                <div>
                    <p className="text-sm text-muted-foreground">{t.account.user}</p>
                    <p className="font-semibold text-lg">{user.usuari}</p>
                </div>
            </div>
             <div className="flex items-center gap-4 p-4 border rounded-md bg-card">
                <Building className="h-6 w-6 text-primary" />
                <div>
                    <p className="text-sm text-muted-foreground">{t.account.company}</p>
                    <p className="font-semibold text-lg">{user.empresa}</p>
                </div>
            </div>
            
            <div className="grid grid-cols-1 gap-3 pt-4">
              <Button onClick={() => router.push('/booking')} className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
                <ClipboardList className="mr-2 h-5 w-5" />
                {t.booking_mgmt.title}
              </Button>
              <Button onClick={() => router.push('/documents')} variant="outline" className="w-full">
                <FileText className="mr-2 h-5 w-5" />
                {t.account.viewInvoices}
              </Button>
              <Button onClick={handleLogout} variant="destructive" className="w-full mt-4">
                <LogOut className="mr-2 h-4 w-4" />
                {t.account.logout}
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
