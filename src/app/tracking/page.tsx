'use client';

import { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Loader2, Search, Package, MapPin, AlertCircle, CheckCircle, FileText, Wallet, SearchCheck } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useLocale } from '@/contexts/locale-context';
import { translations } from '@/lib/translations';

const searchSchema = z.object({
  tracking_code: z.string().min(3),
});

type SearchFormValues = z.infer<typeof searchSchema>;

type Shipment = {
  tracking_code: string;
  origen: string;
  destino: string;
  confirmacion_reserva: string;
  status: string;
  ubicacion_actual: string;
};

const statusIcons = {
  'Buscando ofertas': SearchCheck,
  'Pendiente de pago': Wallet,
  'Pagado': CheckCircle,
};

export default function TrackingPage() {
  const { locale } = useLocale();
  const t = translations[locale];
  
  const [shipment, setShipment] = useState<Shipment | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const statuses = [t.tracking.status.searching, t.tracking.status.pending, t.tracking.status.paid];

  const form = useForm<SearchFormValues>({
    resolver: zodResolver(searchSchema),
    defaultValues: { tracking_code: '' },
  });

  const handleSearch: SubmitHandler<SearchFormValues> = async (data) => {
    setIsLoading(true);
    setShipment(null);
    setError(null);
    try {
      const response = await fetch(`https://sheetdb.io/api/v1/reou400435n4c/search?tracking_code=${data.tracking_code}`);
      const results: Shipment[] = await response.json();
      if (results.length > 0) {
        setShipment(results[0]);
      } else {
        setError(t.tracking.notFound);
      }
    } catch (e) {
      setError(t.tracking.error);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Map spreadsheet status to translated status for index finding
  const mapStatus = (status: string) => {
      if (status === 'Buscando ofertas') return t.tracking.status.searching;
      if (status === 'Pendiente de pago') return t.tracking.status.pending;
      if (status === 'Pagado') return t.tracking.status.paid;
      return status;
  };

  const currentStatusIndex = shipment ? statuses.indexOf(mapStatus(shipment.status)) : -1;

  return (
    <div className="container mx-auto px-4 py-12 max-w-3xl">
      <Card className="w-full border-2 border-primary/10 shadow-lg">
        <CardHeader className="text-center">
          <CardTitle className="font-headline text-4xl">{t.tracking.title}</CardTitle>
          <CardDescription className="text-lg">{t.tracking.subtitle}</CardDescription>
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
                        <Input placeholder={t.tracking.placeholder} {...field} className="pl-10 h-12 text-base" />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" size="lg" className="h-12 bg-accent hover:bg-accent/90 text-accent-foreground" disabled={isLoading}>
                {isLoading ? <Loader2 className="animate-spin" /> : <Search />}
                <span className="ml-2">{t.tracking.button}</span>
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

      {shipment && (
        <Card className="mt-8 animate-in fade-in-50">
          <CardHeader>
            <CardTitle className="font-headline text-2xl">{t.tracking.resultTitle}: {shipment.tracking_code}</CardTitle>
            <CardDescription>{t.tracking.resultSub}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-8">
             <div className="flex items-center w-full px-4 sm:px-8 pt-4">
                <div className="relative flex-1">
                    <div className="absolute top-1/2 -translate-y-1/2 w-full h-0.5 bg-border"></div>
                    <div
                        className="absolute top-1/2 -translate-y-1/2 h-0.5 bg-green-500 transition-all duration-500"
                        style={{ width: `${currentStatusIndex >= 0 ? (currentStatusIndex / (statuses.length - 1)) * 100 : 0}%` }}
                    ></div>
                    <div className="relative flex justify-between">
                        {statuses.map((status, index) => {
                            const Icon = statusIcons['Buscando ofertas' as keyof typeof statusIcons]; // Generic
                            const isCompleted = currentStatusIndex >=0 && index <= currentStatusIndex;
                            const isActive = index === currentStatusIndex;
                            return (
                                <div key={status} className="z-10">
                                    <div className={cn(
                                        "flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-full border-2 transition-colors duration-300",
                                        isCompleted ? "bg-green-500 border-green-600 text-white" : "bg-card border-border",
                                        isActive && "animate-pulse"
                                    )}>
                                        <SearchCheck className="w-5 h-5 sm:w-6 sm:h-6" />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
            <div className="flex justify-between px-2 sm:px-4">
                {statuses.map((status) => (
                    <p key={status} className="text-center text-xs sm:text-sm text-muted-foreground w-1/3 font-medium">
                        {status}
                    </p>
                ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm pt-6 border-t">
                <div className="flex items-start gap-3">
                    <Package className="h-5 w-5 text-primary mt-1"/>
                    <div>
                        <p className="font-semibold">{t.tracking.origin}</p>
                        <p className="text-muted-foreground">{shipment.origen}</p>
                    </div>
                </div>
                 <div className="flex items-start gap-3">
                    <MapPin className="h-5 w-5 text-primary mt-1"/>
                    <div>
                        <p className="font-semibold">{t.tracking.destination}</p>
                        <p className="text-muted-foreground">{shipment.destino}</p>
                    </div>
                </div>
                 <div className="flex items-start gap-3">
                    <FileText className="h-5 w-5 text-primary mt-1"/>
                    <div>
                        <p className="font-semibold">{t.tracking.confirmation}</p>
                        <p className="text-muted-foreground">{shipment.confirmacion_reserva}</p>
                    </div>
                </div>
                <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-1"/>
                    <div>
                        <p className="font-semibold">{t.tracking.current}</p>
                        <p className="text-muted-foreground">{shipment.ubicacion_actual}</p>
                    </div>
                </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
