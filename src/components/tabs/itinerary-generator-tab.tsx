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
import { generateItinerary } from '@/ai/flows/generate-itinerary-flow';
import { useLocale } from '@/contexts/locale-context';
import { translations } from '@/lib/translations';

const formSchema = z.object({
  destination: z.string().min(1),
  dates: z.string().min(1),
  budget: z.string().min(1),
  interests: z.string().min(10),
});

type FormValues = z.infer<typeof formSchema>;

const ItineraryGeneratorTab = () => {
  const { locale } = useLocale();
  const t = translations[locale];
  
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

    try {
      const result = await generateItinerary(values);
      setItinerary(result);
    } catch (error: any) {
      setError(error.message || "Error generating itinerary.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mt-6">
      <Card className="border-2 border-primary/20 shadow-lg">
        <CardHeader>
          <CardTitle className="font-headline text-3xl">{t.home.itinerTitle}</CardTitle>
          <CardDescription>{t.home.itinerSub}</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="destination"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t.forms.destination}</FormLabel>
                    <FormControl>
                      <Input placeholder={t.forms.destination} {...field} />
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
                    <FormLabel>{t.nav.tracking === 'Seguiment' ? 'Dates del Viatge' : 'Fechas del Viaje'}</FormLabel>
                    <FormControl>
                      <Input placeholder="Ej: 15-22 Oct" {...field} />
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
                    <FormLabel>{t.forms.budget}</FormLabel>
                    <FormControl>
                      <Input placeholder={t.forms.budget} {...field} />
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
                    <FormLabel>{t.forms.interests}</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder={t.forms.interests}
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
                    {t.assistent.thinking}
                  </>
                ) : (
                  t.forms.generate
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
              {t.home.itinerResult}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading && (
              <div className="space-y-4">
                <p className="text-muted-foreground text-center">{t.home.itinerPlanning}</p>
                <div className="space-y-2">
                    <div className="h-4 bg-muted rounded w-3/4 animate-pulse"></div>
                    <div className="h-4 bg-muted rounded w-1/2 animate-pulse"></div>
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
                  <p>{t.home.itinerEmpty}</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ItineraryGeneratorTab;
