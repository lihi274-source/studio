'use client';

import { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Loader2, Search, Package, MapPin, Calendar, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

const searchSchema = z.object({
  tracking_code: z.string().min(3, 'El codi de seguiment és requerit.'),
});

type SearchFormValues = z.infer<typeof searchSchema>;

type Shipment = {
  id: string;
  tracking_code: string;
  origin: string;
  destination: string;
  eta: string;
  status: 'En magatzem' | 'En trànsit' | 'Lliurat';
  current_location: string;
};

const statusConfig = {
  'En magatzem': { progress: 10, color: 'bg-yellow-500', label: 'En Magatzem' },
  'En trànsit': { progress: 50, color: 'bg-blue-500', label: 'En Trànsit' },
  'Lliurat': { progress: 100, color: 'bg-green-500', label: 'Lliurat' },
};

export default function TrackingPage() {
  const [shipment, setShipment] = useState<Shipment | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<SearchFormValues>({
    resolver: zodResolver(searchSchema),
    defaultValues: {
      tracking_code: '',
    },
  });

  const handleSearch: SubmitHandler<SearchFormValues> = async (data) => {
    setIsLoading(true);
    setShipment(null);
    setError(null);

    try {
      const response = await fetch(`https://sheetdb.io/api/v1/8cm3mytzi94ag/search?tracking_code=${data.tracking_code}`);
      if (!response.ok) {
        throw new Error('No s\'ha pogut connectar amb el servidor.');
      }
      const results: Shipment[] = await response.json();

      if (results.length > 0) {
        setShipment(results[0]);
      } else {
        setError('Codi no trobat. Revisa el codi i torna a intentar-ho.');
      }
    } catch (e) {
      setError('Hi ha hagut un error en la connexió. Intenta-ho més tard.');
    } finally {
      setIsLoading(false);
    }
  };

  const currentStatus = shipment ? statusConfig[shipment.status] : null;

  return (
    <div className="container mx-auto px-4 py-12 max-w-3xl">
      <Card className="w-full border-2 border-primary/10 shadow-lg">
        <CardHeader className="text-center">
          <CardTitle className="font-headline text-4xl">Localitza el teu enviament</CardTitle>
          <CardDescription className="text-lg">
            Introdueix el teu codi de seguiment per veure l'estat actual.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSearch)} className="flex flex-col sm:flex-row gap-4">
              <FormField
                control={form.control}
                name="tracking_code"
                render={({ field }) => (
                  <FormItem className="flex-grow">
                    <FormControl>
                      <div className="relative">
                        <Package className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                        <Input placeholder="Escriu el teu codi aquí..." {...field} className="pl-10 h-12 text-base" />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" size="lg" className="h-12 bg-accent hover:bg-accent/90 text-accent-foreground" disabled={isLoading}>
                {isLoading ? <Loader2 className="animate-spin" /> : <Search />}
                <span className="ml-2">Cercar</span>
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {error && (
        <Alert variant="destructive" className="mt-8">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {shipment && currentStatus && (
        <Card className="mt-8 animate-in fade-in-50">
          <CardHeader>
            <CardTitle className="font-headline text-2xl">Resultats per: {shipment.tracking_code}</CardTitle>
            <CardDescription>A continuació es mostra la informació més recent del teu enviament.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="font-semibold text-lg">{currentStatus.label}</span>
                <span className="text-sm text-muted-foreground">{currentStatus.progress}%</span>
              </div>
              <Progress value={currentStatus.progress} className={cn("h-3", currentStatus.color)} />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                <div className="flex items-start gap-3">
                    <Package className="h-5 w-5 text-primary mt-1"/>
                    <div>
                        <p className="font-semibold">Origen</p>
                        <p className="text-muted-foreground">{shipment.origin}</p>
                    </div>
                </div>
                 <div className="flex items-start gap-3">
                    <MapPin className="h-5 w-5 text-primary mt-1"/>
                    <div>
                        <p className="font-semibold">Destí</p>
                        <p className="text-muted-foreground">{shipment.destination}</p>
                    </div>
                </div>
                 <div className="flex items-start gap-3">
                    <Calendar className="h-5 w-5 text-primary mt-1"/>
                    <div>
                        <p className="font-semibold">Data prevista (ETA)</p>
                        <p className="text-muted-foreground">{shipment.eta}</p>
                    </div>
                </div>
                <div className="flex items-start gap-3">
                    <MapPin className="h-5 w-5 text-green-500 mt-1"/>
                    <div>
                        <p className="font-semibold">Ubicació actual</p>
                        <p className="text-muted-foreground">{shipment.current_location}</p>
                    </div>
                </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}