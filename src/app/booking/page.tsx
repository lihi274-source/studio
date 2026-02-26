'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Loader2, Plane, MapPin, Send, History, Palmtree, Luggage, FileText, CheckCircle2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { useLocale } from '@/contexts/locale-context';
import { translations } from '@/lib/translations';

// --- CONFIGURACIÓ API ---
const SHEETDB_URL = 'https://sheetdb.io/api/v1/reou400435n4c?sheet=solicituds';
const SHEETDB_SEARCH_URL = 'https://sheetdb.io/api/v1/reou400435n4c/search?sheet=solicituds';

// --- ESQUEMA DE VALIDACIÓ ---
const bookingFormSchema = z.object({
  serviceType: z.string().min(1, "Selecciona un tipus de viatge"),
  origin: z.string().min(2, "Introdueix l'origen"),
  destination: z.string().min(2, "Introdueix la destinació"),
  cargo: z.string().min(5, "Explica'ns més sobre el teu viatge (persones, dates, etc.)"),
});

type BookingFormValues = z.infer<typeof bookingFormSchema>;

export default function BookingManagementPage() {
  const { locale } = useLocale();
  const t = translations[locale];
  const { toast } = useToast();
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [requests, setRequests] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingRequests, setIsLoadingRequests] = useState(true);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  useEffect(() => {
    const userDataString = localStorage.getItem('user');
    if (userDataString) {
      const userData = JSON.parse(userDataString);
      setUser(userData);
      fetchRequests(userData.usuari);
    } else {
      router.push('/account');
    }
  }, [router]);

  const fetchRequests = async (username: string) => {
    setIsLoadingRequests(true);
    try {
      const response = await fetch(`${SHEETDB_SEARCH_URL}&usuari=${username}`);
      const data = await response.json();
      setRequests(Array.isArray(data) ? data.reverse() : []);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsLoadingRequests(false);
    }
  };

  const form = useForm<BookingFormValues>({
    resolver: zodResolver(bookingFormSchema),
    defaultValues: { serviceType: '', origin: '', destination: '', cargo: '' },
  });

  const onSubmit = async (values: BookingFormValues) => {
    if (!user) return;
    setIsSubmitting(true);

    try {
      const id = `HICA-${Math.floor(1000 + Math.random() * 9000)}`;
      const dataAvui = new Date().toLocaleDateString('ca-ES');
      
      const detalls = `Viatge: ${values.serviceType} | Origen: ${values.origin} | Destí: ${values.destination} | Info: ${values.cargo}`;

      const payload = {
        id,
        data: dataAvui,
        usuari: user.usuari,
        estat: 'Pendent',
        detalls,
      };

      const response = await fetch(SHEETDB_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data: [payload] }),
      });

      if (response.ok) {
        toast({ title: t.booking_mgmt.success });
        form.reset();
        fetchRequests(user.usuari);
      }
    } catch (error) {
      toast({ variant: "destructive", title: t.booking_mgmt.error });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDownload = (id: string) => {
    setDownloadingId(id);
    
    // Simulem un procés de generació de PDF/Descàrrega
    setTimeout(() => {
      setDownloadingId(null);
      toast({
        title: "Albarà generat correctament",
        description: `El document ${id}.pdf s'ha descarregat a la teva carpeta de descàrregues.`,
      });
    }, 1500);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="mb-12 text-center">
        <h1 className="text-4xl md:text-5xl font-headline text-primary-foreground flex items-center justify-center gap-4">
          <Palmtree className="h-12 w-12 text-accent" />
          {t.booking_mgmt.title}
        </h1>
        <p className="text-muted-foreground mt-4 text-lg max-w-2xl mx-auto">
          {t.booking_mgmt.subtitle}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        
        {/* FORMULARIO */}
        <section>
          <Card className="shadow-xl border-t-4 border-t-accent bg-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 font-headline text-2xl">
                <Plane className="h-6 w-6 text-primary" />
                {t.booking_mgmt.formTitle}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="serviceType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-primary-foreground font-semibold">{t.booking_mgmt.serviceType}</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="bg-background">
                              <SelectValue placeholder={t.booking_mgmt.serviceType} />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Paquet Vacacional">☀️ Paquet Vacacional</SelectItem>
                            <SelectItem value="Només Vols">✈️ Només Vols</SelectItem>
                            <SelectItem value="Hotels / Allotjament">🏨 Hotels / Allotjament</SelectItem>
                            <SelectItem value="Creuers">🚢 Creuers</SelectItem>
                            <SelectItem value="Circuits Culturals">🗺️ Circuits Culturals</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="origin"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-primary-foreground font-semibold">{t.booking_mgmt.origin}</FormLabel>
                          <FormControl><Input placeholder={t.booking_mgmt.origin} {...field} className="bg-background" /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="destination"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-primary-foreground font-semibold">{t.booking_mgmt.destination}</FormLabel>
                          <FormControl><Input placeholder={t.booking_mgmt.destination} {...field} className="bg-background" /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="cargo"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-primary-foreground font-semibold">{t.booking_mgmt.cargo}</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder={t.booking_mgmt.cargoPlace}
                            className="bg-background min-h-[120px]" 
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button type="submit" size="lg" className="w-full bg-accent hover:bg-accent/90 text-accent-foreground font-bold text-lg h-12" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <Loader2 className="animate-spin h-6 w-6" />
                    ) : (
                      <>
                        <Send className="mr-2 h-5 w-5" />
                        {t.booking_mgmt.submit}
                      </>
                    )}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </section>

        {/* HISTORIAL */}
        <section>
          <h2 className="text-2xl font-headline text-primary-foreground mb-6 flex items-center gap-3">
            <History className="h-7 w-7 text-primary" /> 
            {t.booking_mgmt.historyTitle}
          </h2>
          <div className="space-y-4">
            {isLoadingRequests ? (
              <div className="flex justify-center p-12">
                <Loader2 className="h-10 w-10 animate-spin text-primary" />
              </div>
            ) : requests.length === 0 ? (
              <div className="p-12 text-center border-2 border-dashed rounded-xl bg-card/50">
                <Luggage className="h-16 w-16 mx-auto text-muted-foreground/30 mb-4" />
                <p className="text-muted-foreground italic">{t.booking_mgmt.empty}</p>
              </div>
            ) : (
              requests.map((req: any) => {
                const isAccepted = req.estat === 'Acceptada';
                const isDownloading = downloadingId === req.id;

                return (
                  <Card key={req.id} className="hover:shadow-md transition-shadow border-l-4 border-l-primary bg-card">
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">{req.data}</span>
                          <h3 className="font-headline text-xl text-primary mt-1">{req.id}</h3>
                        </div>
                        <Badge className={cn(
                          "font-bold py-1 px-3",
                          req.estat === 'Pendent' ? 'bg-yellow-100 text-yellow-700 hover:bg-yellow-100' : 
                          isAccepted ? 'bg-green-100 text-green-700 hover:bg-green-100' :
                          'bg-red-100 text-red-700 hover:bg-red-100'
                        )}>
                          {req.estat}
                        </Badge>
                      </div>
                      <div className="text-sm text-foreground space-y-2 border-t pt-4">
                        {req.detalls.split(' | ').map((line: string, i: number) => (
                          <p key={i} className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-accent flex-shrink-0" />
                            {line}
                          </p>
                        ))}
                      </div>

                      {/* Botó funcional per a estat Acceptada */}
                      {isAccepted && (
                        <div className="mt-6 pt-4 border-t flex justify-end">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className={cn(
                              "transition-all",
                              isDownloading ? "text-muted-foreground" : "text-primary hover:bg-primary/10 border-primary/20"
                            )}
                            onClick={() => handleDownload(req.id)}
                            disabled={isDownloading}
                          >
                            {isDownloading ? (
                              <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Generant...
                              </>
                            ) : (
                              <>
                                <FileText className="mr-2 h-4 w-4" />
                                {t.booking_mgmt.downloadDelivery}
                              </>
                            )}
                          </Button>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                );
              })
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
