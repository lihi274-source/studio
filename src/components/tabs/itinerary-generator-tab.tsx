'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useState } from 'react';
import { Loader2, Sparkles, AlertCircle } from 'lucide-react';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import ReactMarkdown from 'react-markdown';


const formSchema = z.object({
  destination: z.string().min(1, 'El destino es requerido.'),
  dates: z.string().min(1, 'Las fechas son requeridas.'),
  budget: z.string().min(1, 'El presupuesto es requerido.'),
  interests: z.string().min(1, 'Los intereses son requeridos.'),
});

type FormValues = z.infer<typeof formSchema>;

const ItineraryGeneratorTab = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [itinerary, setItinerary] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      destination: '',
      dates: '',
      budget: '',
      interests: '',
    },
  });

  async function onSubmit(values: FormValues) {
    setIsLoading(true);
    setItinerary(null);
    setError(null);

    const prompt = `Ets un agent de viatges expert. Crea un itinerari de viatge detallat basat en les següents preferències:
- Destí: ${values.destination}
- Dates: ${values.dates}
- Pressupost: ${values.budget}
- Interessos: ${values.interests}

Proporciona suggeriments de vols, hotels i activitats. Formata la resposta de manera clara i llegible, utilitzant Markdown per a títols i llistes.`;

    try {
      const response = await fetch('/api/mistral', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: prompt }),
      });
      
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Hi ha hagut un error en generar l\'itinerari.');
      }

      setItinerary(data.reply);

    } catch (error: any) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mt-6">
      <Card className="border-2 border-primary/20 shadow-lg">
        <CardHeader>
          <CardTitle className="font-headline text-3xl">Generador de Itinerarios con IA</CardTitle>
          <CardDescription>
            ¿No sabes por dónde empezar? Describe el viaje de tus sueños y nuestra IA creará un plan personalizado para ti.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="destination"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Destino</FormLabel>
                    <FormControl>
                      <Input placeholder="Ej: París, Francia" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="dates"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Fechas del Viaje</FormLabel>
                    <FormControl>
                      <Input placeholder="Ej: 15 al 22 de Octubre" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="budget"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Presupuesto</FormLabel>
                    <FormControl>
                      <Input placeholder="Ej: Moderado, Lujoso, Económico" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="interests"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Intereses y Preferencias</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Ej: Me encanta el arte, la comida callejera, caminar por la ciudad y busco hoteles boutique."
                        className="resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" size="lg" className="w-full bg-accent hover:bg-accent/90 text-accent-foreground" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generando...
                  </>
                ) : (
                  'Generar Itinerario'
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
      
      <div className="lg:mt-0">
        <Card className="bg-primary/5 min-h-full">
          <CardHeader>
            <CardTitle className="font-headline text-2xl flex items-center">
              <Sparkles className="mr-2 h-6 w-6 text-accent" />
              Tu Itinerario Personalizado
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading && (
              <div className="space-y-4">
                <p className="text-muted-foreground text-center">Nuestra IA está planificando tu viaje...</p>
                <div className="space-y-2">
                    <div className="h-4 bg-muted rounded w-3/4 animate-pulse"></div>
                    <div className="h-4 bg-muted rounded w-1/2 animate-pulse"></div>
                    <div className="h-4 bg-muted rounded w-2/3 animate-pulse"></div>
                </div>
              </div>
            )}
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            {itinerary && (
              <div className="prose prose-sm dark:prose-invert max-w-none">
                 <ReactMarkdown className="whitespace-pre-wrap font-body text-foreground">{itinerary}</ReactMarkdown>
              </div>
            )}
            {!isLoading && !itinerary && !error && (
               <div className="text-center text-muted-foreground py-16">
                  <p>Tu itinerario aparecerá aquí.</p>
                  <p className="text-sm">Rellena el formulario para empezar.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ItineraryGeneratorTab;
