'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, LogOut, User, Building, FileText } from 'lucide-react';
import { useLocale } from '@/contexts/locale-context';
import { translations } from '@/lib/translations';

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
      <main className="flex-grow container mx-auto px-4 py-12 flex items-center justify-center">
        <Card className="w-full max-w-lg">
          <CardHeader className="text-center">
            <CardTitle className="font-headline text-4xl">{t.account.profile}</CardTitle>
            <CardDescription className="text-lg">
              {t.account.profileSub} {user.usuari}.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center gap-4 p-4 border rounded-md">
                <User className="h-6 w-6 text-primary" />
                <div>
                    <p className="text-sm text-muted-foreground">{t.account.user}</p>
                    <p className="font-semibold text-lg">{user.usuari}</p>
                </div>
            </div>
             <div className="flex items-center gap-4 p-4 border rounded-md">
                <Building className="h-6 w-6 text-primary" />
                <div>
                    <p className="text-sm text-muted-foreground">{t.account.company}</p>
                    <p className="font-semibold text-lg">{user.empresa}</p>
                </div>
            </div>
            <Button onClick={() => router.push('/documents')} className="w-full bg-accent hover:bg-accent/90 text-accent-foreground">
              <FileText className="mr-2 h-4 w-4" />
              {t.account.viewInvoices}
            </Button>
            <Button onClick={handleLogout} variant="destructive" className="w-full">
              <LogOut className="mr-2 h-4 w-4" />
              {t.account.logout}
            </Button>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
