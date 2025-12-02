'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Loader2, User, Mail, MessageSquare } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const contactFormSchema = z.object({
  fullName: z.string().min(3, 'El nombre es requerido.'),
  email: z.string().email('El email no es válido.'),
  message: z.string().min(10, 'El mensaje debe tener al menos 10 caracteres.'),
});

type ContactFormValues = z.infer<typeof contactFormSchema>;

export default function ContactoPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      fullName: '',
      email: '',
      message: '',
    },
  });

  const onSubmit = async (values: ContactFormValues) => {
    setIsSubmitting(true);
    console.log('Datos del formulario de contacto:', values);
    
    // Simula una llamada a la API
    await new Promise(resolve => setTimeout(resolve, 1500));

    toast({
      title: '¡Mensaje enviado!',
      description: 'Gracias por contactarnos. Te responderemos lo antes posible.',
    });

    form.reset();
    setIsSubmitting(false);
  };

  return (
    <div className="container mx-auto px-4 py-12 flex items-center justify-center">
      <Card className="w-full max-w-2xl border-2 border-primary/20 shadow-lg">
        <CardHeader className="text-center">
          <CardTitle className="font-headline text-4xl">Ponte en contacto</CardTitle>
          <CardDescription className="text-lg">
            ¿Tienes alguna pregunta o sugerencia? ¡Nos encantaría saber de ti!
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="fullName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nombre completo</FormLabel>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                      <FormControl>
                        <Input placeholder="Tu nombre y apellidos" {...field} className="pl-10" />
                      </FormControl>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Correo electrónico</FormLabel>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                      <FormControl>
                        <Input type="email" placeholder="tu@email.com" {...field} className="pl-10" />
                      </FormControl>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="message"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tu mensaje</FormLabel>
                    <div className="relative">
                       <MessageSquare className="absolute left-3 top-4 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                      <FormControl>
                        <Textarea placeholder="Escribe aquí tu consulta..." {...field} className="pl-10 pt-3 min-h-[120px]" />
                      </FormControl>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" size="lg" className="w-full bg-accent hover:bg-accent/90 text-accent-foreground" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Enviando...
                  </>
                ) : (
                  'Enviar Mensaje'
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
