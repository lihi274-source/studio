'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useAuth, useUser } from '@/firebase';
import { signOut } from 'firebase/auth';
import { Loader2 } from 'lucide-react';
import { initiateEmailSignUp, initiateEmailSignIn } from '@/firebase/non-blocking-login';
import { useToast } from '@/hooks/use-toast';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';

const formSchema = z.object({
  email: z.string().email('Introduce un email válido.'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres.'),
});

type FormValues = z.infer<typeof formSchema>;

export default function AccountPage() {
  const { user, isUserLoading } = useUser();
  const auth = useAuth();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const handleRegister = async (values: FormValues) => {
    setIsSubmitting(true);
    try {
      initiateEmailSignUp(auth, values.email, values.password);
      // The onAuthStateChanged listener in FirebaseProvider will handle the user state change.
      // We can show a toast or message here if we want.
      toast({
        title: "¡Registro exitoso!",
        description: "Revisa tu bandeja de entrada para verificar tu email.",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error en el registro",
        description: error.message,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLogin = async (values: FormValues) => {
    setIsSubmitting(true);
    try {
      initiateEmailSignIn(auth, values.email, values.password);
      // onAuthStateChanged will handle UI updates
    } catch (error: any) {
       toast({
        variant: "destructive",
        title: "Error al iniciar sesión",
        description: "El email o la contraseña son incorrectos.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
  };
  
  if (isUserLoading || isSubmitting) {
    return (
      <div className="flex flex-col min-h-screen bg-background">
        <Header />
        <main className="flex-grow container mx-auto px-4 py-8 flex items-center justify-center">
            <Loader2 className="h-16 w-16 animate-spin text-primary" />
        </main>
        <Footer />
      </div>
    );
  }

  return (
     <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8 flex items-center justify-center">
        {user ? (
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Mi Cuenta</CardTitle>
              <CardDescription>Bienvenido, {user.email}</CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={handleLogout} className="w-full">Cerrar Sesión</Button>
            </CardContent>
          </Card>
        ) : (
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Accede a tu cuenta</CardTitle>
              <CardDescription>Inicia sesión o regístrate para continuar.</CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form className="space-y-6">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Usuario (Email)</FormLabel>
                        <FormControl>
                          <Input placeholder="tu@email.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Contraseña</FormLabel>
                        <FormControl>
                          <Input type="password" placeholder="********" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="flex flex-col sm:flex-row gap-4">
                    <Button onClick={form.handleSubmit(handleLogin)} className="flex-1" disabled={isSubmitting}>
                      {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      Iniciar Sesión
                    </Button>
                    <Button onClick={form.handleSubmit(handleRegister)} variant="secondary" className="flex-1" disabled={isSubmitting}>
                      {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      Registrarse
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        )}
      </main>
      <Footer />
    </div>
  );
}
