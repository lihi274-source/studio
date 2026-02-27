'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Loader2, User, KeyRound, ArrowLeft } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useLocale } from '@/contexts/locale-context';
import { translations } from '@/lib/translations';

const formSchema = z.object({
  usuari: z.string().min(1),
  password: z.string().min(1),
});

type FormValues = z.infer<typeof formSchema>;
type UserData = {
  usuari: string;
  empresa: string;
}

export default function AccountPage() {
  const { locale } = useLocale();
  const t = translations[locale];
  const { toast } = useToast();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [user, setUser] = useState<UserData | null>(null);
  const [isLoadingUser, setIsLoadingUser] = useState(true);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) setUser(JSON.parse(userData));
    setIsLoadingUser(false);
  }, []);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { usuari: '', password: '' },
  });

  const handleLogin = async (values: FormValues) => {
    setIsSubmitting(true);
    try {
      const response = await fetch(`https://sheetdb.io/api/v1/reou400435n4c/search?sheet=usuaris&usuari=${values.usuari}&password=${values.password}`);
      const data = await response.json();
      if (data.length > 0) {
        const userData = { usuari: data[0].usuari, empresa: data[0].empresa };
        localStorage.setItem('user', JSON.stringify(userData));
        setUser(userData);
        toast({ title: t.account.welcome, description: `${userData.usuari}` });
        router.push('/dashboard');
      } else {
        toast({ variant: "destructive", title: t.account.error, description: t.account.errorDesc });
      }
    } catch (error) {
      toast({ variant: "destructive", title: "Error", description: "Network Error" });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  if (isLoadingUser) return <div className="flex min-h-screen items-center justify-center"><Loader2 className="animate-spin" /></div>;

  return (
     <div className="flex flex-col min-h-screen bg-background">
      <main className="flex-grow container mx-auto px-4 py-8 flex items-center justify-center">
        {user ? (
          <Card className="w-full max-w-md">
            <CardHeader className="text-center">
              <CardTitle>{t.account.welcome}</CardTitle>
              <CardDescription>{user.usuari}</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <Button onClick={() => router.push('/dashboard')} className="w-full">
                {t.account.profile}
              </Button>
              <Button asChild variant="outline" className="w-full">
                <Link href="/">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  {t.account.backToHome}
                </Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>{t.account.loginTitle}</CardTitle>
              <CardDescription>{t.account.loginSub}</CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(handleLogin)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="usuari"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t.account.user}</FormLabel>
                         <div className="relative">
                           <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                           <FormControl>
                            <Input placeholder={t.account.userPlace} {...field} className="pl-10"/>
                          </FormControl>
                         </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t.account.pass}</FormLabel>
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
                    {isSubmitting ? t.account.loggingIn : t.account.loginBtn}
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