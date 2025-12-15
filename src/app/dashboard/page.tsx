'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, LogOut, User, Building } from 'lucide-react';

type UserData = {
  Usuari: string;
  Empresa: string;
};

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const userDataString = localStorage.getItem('user');
      if (userDataString) {
        setUser(JSON.parse(userDataString));
      } else {
        router.push('/account');
      }
    } catch (error) {
      console.error("Failed to parse user data, redirecting to login.", error);
      localStorage.removeItem('user');
      router.push('/account');
    }
    setIsLoading(false);
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
    router.push('/account');
  };

  if (isLoading || !user) {
    return (
      <div className="flex flex-col min-h-screen bg-background">
        <main className="flex-grow container mx-auto px-4 py-8 flex items-center justify-center">
          <Loader2 className="h-16 w-16 animate-spin text-primary" />
        </main>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <main className="flex-grow container mx-auto px-4 py-12 flex items-center justify-center">
        <Card className="w-full max-w-lg">
          <CardHeader className="text-center">
            <CardTitle className="font-headline text-4xl">El Teu Perfil</CardTitle>
            <CardDescription className="text-lg">
              Benvingut/da a la teva zona privada, {user.Usuari}.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center gap-4 p-4 border rounded-md">
                <User className="h-6 w-6 text-primary" />
                <div>
                    <p className="text-sm text-muted-foreground">Usuari</p>
                    <p className="font-semibold text-lg">{user.Usuari}</p>
                </div>
            </div>
             <div className="flex items-center gap-4 p-4 border rounded-md">
                <Building className="h-6 w-6 text-primary" />
                <div>
                    <p className="text-sm text-muted-foreground">Empresa</p>
                    <p className="font-semibold text-lg">{user.Empresa}</p>
                </div>
            </div>
            <Button onClick={handleLogout} variant="destructive" className="w-full">
              <LogOut className="mr-2 h-4 w-4" />
              Tancar Sessió
            </Button>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
