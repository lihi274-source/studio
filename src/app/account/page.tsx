'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Loader2, LogOut, User, KeyRound } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

const formSchema = z.object({
  Usuari: z.string().min(1, 'El camp usuari és requerit.'),
  Contrasenya: z.string().min(1, 'La contrasenya és requerida.'),
});

type FormValues = z.infer<typeof formSchema>;
type UserData = {
  Usuari: string;
  Empresa: string;
}

export default function AccountPage() {
  const { toast } = useToast();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [user, setUser] = useState<UserData | null>(null);
  const [isLoadingUser, setIsLoadingUser] = useState(true);

  useEffect(() => {
    try {
      const userData = localStorage.getItem('user');
      if (userData) {
        setUser(JSON.parse(userData));
      }
    } catch (error) {
      console.error("Failed to parse user data from localStorage", error);
      localStorage.removeItem('user');
    }
    setIsLoadingUser(false);
  }, []);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      Usuari: '',
      Contrasenya: '',
    },
  });

  const handleLogin = async (values: FormValues) => {
    setIsSubmitting(true);
    try {
      const response = await fetch(`https://sheetdb.io/api/v1/reou400435n4c/search?sheet=usuaris&Usuari=${values.Usuari}&Contrasenya=${values.Contrasenya}`);
      const data = await response.json();

      if (data.length > 0) {
        const userData: UserData = {
          Usuari: data[0].Usuari,
          Empresa: data[0].Empresa,
        };
        localStorage.setItem('user', JSON.stringify(userData));
        setUser(userData);
        toast({
          title: 'Sessió iniciada correctament',
          description: `Benvingut/da, ${userData.Usuari}!`,
        });
        router.push('/dashboard');
      } else {
        toast({
          variant: "destructive",
          title: 'Error d\'autenticació',
          description: 'Les dades introduïdes són incorrectes.',
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: 'Error de xarxa',
        description: 'No s\'ha pogut connectar amb el servidor. Intenta-ho de nou més tard.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  if (isLoadingUser) {
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
      <main className="flex-grow container mx-auto px-4 py-8 flex items-center justify-center">
        {user ? (
          <Card className="w-full max-w-md">
            <CardHeader className="text-center">
              <CardTitle>Ja has iniciat sessió</CardTitle>
              <CardDescription>Vols anar al teu perfil o tancar la sessió?</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <Button onClick={() => router.push('/dashboard')} className="w-full">Anar al Perfil</Button>
            </CardContent>
          </Card>
        ) : (
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Accedeix al teu compte</CardTitle>
              <CardDescription>Introdueix les teves credencials per continuar.</CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(handleLogin)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="Usuari"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Usuari</FormLabel>
                         <div className="relative">
                           <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                           <FormControl>
                            <Input placeholder="El teu nom d'usuari" {...field} className="pl-10"/>
                          </FormControl>
                         </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="Contrasenya"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Contrasenya</FormLabel>
                        <div className="relative">
                           <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                          <FormControl>
                            <Input type="password" placeholder="********" {...field} className="pl-10" />
                          </FormControl>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" className="w-full" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Entrant...
                      </>
                    ) : (
                      'Entrar'
                    )}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
}
