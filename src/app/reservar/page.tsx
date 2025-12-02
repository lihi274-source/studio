'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { excursionsData } from '@/lib/excursions-data';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, Users, User, Mail, Phone, Loader2, ArrowLeft } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';

const bookingSchema = z.object({
  date: z.date({ required_error: 'La fecha es requerida.' }),
  participants: z.string().min(1, 'El número de participantes es requerido.'),
  fullName: z.string().min(3, 'El nombre es requerido.'),
  email: z.string().email('El email no es válido.'),
  phone: z.string().min(9, 'El teléfono no es válido.'),
  excursion: z.string().optional(),
});

type BookingFormValues = z.infer<typeof bookingSchema>;

function BookingPageContent() {
  const searchParams = useSearchParams();
  const excursionId = searchParams.get('excursionId');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const excursion = excursionsData.find(e => e.id === excursionId);
  const excursionImage = PlaceHolderImages.find(p => p.id === excursionId);

  const form = useForm<BookingFormValues>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      participants: '1',
      fullName: '',
      email: '',
      phone: '',
    },
  });

  if (!excursion || !excursionImage) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h1 className="text-2xl font-bold text-destructive">Excursión no encontrada</h1>
        <p className="text-muted-foreground">No hemos podido encontrar la excursión que buscas.</p>
        <Button asChild className="mt-4">
          <Link href="/">Volver al inicio</Link>
        </Button>
      </div>
    );
  }

  const onSubmit = async (values: BookingFormValues) => {
    setIsSubmitting(true);
    
    try {
      const response = await fetch("https://formspree.io/f/xanrjdrv", {
        method: 'POST',
        headers: {
          'Accept': 'application/json'
        },
        body: JSON.stringify({ ...values, excursion: excursion.title })
      });

      if (response.ok) {
        toast({
          title: "¡Reserva solicitada!",
          description: `Hemos recibido tu solicitud para ${values.participants} persona(s) el ${format(values.date, 'PPP', { locale: es })}. Te contactaremos pronto.`,
        });
        form.reset();
      } else {
         toast({
          variant: "destructive",
          title: 'Error al enviar la reserva',
          description: 'Hubo un problema. Por favor, inténtalo de nuevo.',
        });
      }
    } catch (error) {
       toast({
          variant: "destructive",
          title: 'Error de red',
          description: 'No se pudo conectar con el servidor. Revisa tu conexión.',
        });
    }
    
    setIsSubmitting(false);
  };

  return (
    <div className="container mx-auto px-4 py-12">
       <div className="mb-8">
        <Button asChild variant="outline">
          <Link href="/?tab=excursiones">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver a Excursiones
          </Link>
        </Button>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Excursion Info */}
        <div className="space-y-6">
          <Card className="overflow-hidden">
            <div className="relative w-full aspect-video">
              <Image src={excursionImage.imageUrl} alt={excursion.title} fill className="object-cover" data-ai-hint={excursionImage.imageHint}/>
            </div>
            <CardHeader>
              <CardTitle className="font-headline text-3xl">{excursion.title}</CardTitle>
              <CardDescription>{excursionImage.description}</CardDescription>
            </CardHeader>
          </Card>
        </div>

        {/* Booking Form */}
        <div>
          <Card className="border-2 border-primary/20 shadow-lg">
            <CardHeader>
              <CardTitle className="font-headline text-2xl">Completa tu reserva</CardTitle>
              <CardDescription>Rellena el formulario para solicitar tu plaza.</CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="date"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel>Fecha de la excursión</FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant={'outline'}
                                  className={cn('w-full justify-start text-left font-normal', !field.value && 'text-muted-foreground')}
                                >
                                  <CalendarIcon className="mr-2 h-4 w-4" />
                                  {field.value ? format(field.value, 'PPP', { locale: es }) : <span>Elige una fecha</span>}
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                              <Calendar
                                mode="single"
                                selected={field.value}
                                onSelect={field.onChange}
                                disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="participants"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Participantes</FormLabel>
                          <div className="relative">
                            <Users className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger className="pl-10">
                                  <SelectValue placeholder="Nº de personas" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {[...Array(10)].map((_, i) => (
                                  <SelectItem key={i + 1} value={`${i + 1}`}>
                                    {i + 1} {i + 1 > 1 ? 'personas' : 'persona'}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <FormField control={form.control} name="fullName" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nombre y Apellidos</FormLabel>
                       <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                        <FormControl>
                          <Input placeholder="Tu nombre completo" {...field} className="pl-10"/>
                        </FormControl>
                       </div>
                      <FormMessage />
                    </FormItem>
                  )} />
                   <FormField control={form.control} name="email" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                       <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                        <FormControl>
                          <Input placeholder="tu@email.com" {...field} className="pl-10"/>
                        </FormControl>
                       </div>
                      <FormMessage />
                    </FormItem>
                  )} />
                   <FormField control={form.control} name="phone" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Teléfono de contacto</FormLabel>
                       <div className="relative">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                        <FormControl>
                          <Input placeholder="Tu número de teléfono" {...field} className="pl-10"/>
                        </FormControl>
                       </div>
                      <FormMessage />
                    </FormItem>
                  )} />

                  <Button type="submit" size="lg" className="w-full bg-accent hover:bg-accent/90 text-accent-foreground" disabled={isSubmitting}>
                     {isSubmitting ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Procesando...
                        </>
                      ) : (
                        'Confirmar Reserva'
                      )}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default function BookingPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <BookingPageContent />
    </Suspense>
  )
}
