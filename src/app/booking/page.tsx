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
import { Loader2, Plane, Send, History, Palmtree, Luggage, FileText } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { useLocale } from '@/contexts/locale-context';
import { translations } from '@/lib/translations';

const SHEETDB_URL = 'https://sheetdb.io/api/v1/reou400435n4c?sheet=solicituds';
const SHEETDB_SEARCH_URL = 'https://sheetdb.io/api/v1/reou400435n4c/search?sheet=solicituds';

const bookingFormSchema = z.object({
  serviceType: z.string().min(1, "Required"),
  origin: z.string().min(2, "Min 2 chars"),
  destination: z.string().min(2, "Min 2 chars"),
  description: z.string().min(5, "Min 5 chars"),
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

  // Textos locales rápidos para los 4 idiomas
  const localTxt = {
    newReq: { ca: 'Nova Sol·licitud', es: 'Nueva Solicitud', en: 'New Request', fr: 'Nouvelle Demande' },
    servType: { ca: 'Tipus de Viatge', es: 'Tipo de Viaje', en: 'Travel Type', fr: 'Type de Voyage' },
    placeholder: { ca: 'Què vols reservar?', es: '¿Qué quieres reservar?', en: 'What to book?', fr: 'Que reserver?' },
    descLabel: { ca: 'Descripció del viatge', es: 'Descripción del viaje', en: 'Travel description', fr: 'Description du voyage' },
    descPlace: { 
      ca: "Dates, persones, edats dels nens...", 
      es: "Fechas, personas, edades de niños...", 
      en: "Dates, people, children ages...", 
      fr: "Dates, personnes, âges des enfants..." 
    },
    noReq: { ca: 'Encara no tens cap sol·licitud.', es: 'Aún no tienes ninguna solicitud.', en: 'No requests yet.', fr: 'Aucune demande pour le moment.' },
    print: { ca: 'IMPRIMIR PDF', es: 'IMPRIMIR PDF', en: 'PRINT PDF', fr: 'IMPRIMER PDF' }
  };

  const getTxt = (key: keyof typeof localTxt) => localTxt[key][locale as 'ca' | 'es' | 'en' | 'fr'] || localTxt[key]['es'];

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
    defaultValues: { serviceType: '', origin: '', destination: '', description: '' },
  });

  const onSubmit = async (values: BookingFormValues) => {
    if (!user) return;
    setIsSubmitting(true);
    try {
      const id = `HICA-${Math.floor(10000 + Math.random() * 90000)}`;
      const dataAvui = new Date().toLocaleDateString('ca-ES');
      const detalls = `Servei: ${values.serviceType} | Origen: ${values.origin} | Destí: ${values.destination} | Descripció: ${values.description}`;

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
      toast({ variant: "destructive", title: "Error" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDownloadAlbara = (req: any) => {
    // Intentar abrir la ventana inmediatamente para evitar el bloqueo del navegador
    const printWindow = window.open('', '_blank', 'width=800,height=900');
    
    if (!printWindow) {
      alert("⚠️ Navegador bloqueja la finestra. Per favor, activa les 'Finestres Emergents' (Pop-ups) per aquesta web.");
      return;
    }

    const detailsLines = req.detalls.split(' | ').map((line: string) => `<li>${line}</li>`).join('');

    const htmlContent = `
      <html>
      <head>
        <title>Reserva ${req.id}</title>
        <style>
          body { font-family: sans-serif; padding: 40px; color: #333; line-height: 1.5; }
          .header { display: flex; justify-content: space-between; border-bottom: 3px solid #2079ad; padding-bottom: 20px; margin-bottom: 30px; }
          .logo h1 { color: #2079ad; margin: 0; font-size: 24px; }
          .section { margin-bottom: 20px; }
          .section-title { font-weight: bold; color: #2079ad; text-transform: uppercase; font-size: 14px; margin-bottom: 10px; border-bottom: 1px solid #eee; }
          li { margin-bottom: 10px; padding-left: 10px; border-left: 3px solid #ffae4d; list-style:none; }
          @media print { .no-print { display: none; } }
        </style>
      </head>
      <body>
        <button class="no-print" onclick="window.print()" style="margin-bottom:20px; padding:10px 20px; background:#2079ad; color:white; border:none; border-radius:4px; cursor:pointer; font-weight:bold;">
          ${getTxt('print')}
        </button>
        <div class="header">
          <div class="logo"><h1>Viajes HICA</h1></div>
          <div style="text-align:right;">
            <h2 style="margin:0; color:#2079ad;">COMPROVANT</h2>
            <p><strong>Ref:</strong> ${req.id}</p>
            <p><strong>Data:</strong> ${req.data}</p>
          </div>
        </div>
        <div class="section">
          <p class="section-title">Detalls</p>
          <ul>${detailsLines}</ul>
        </div>
      </body>
      </html>
    `;

    printWindow.document.write(htmlContent);
    printWindow.document.close();
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="mb-12 text-center">
        <h1 className="text-4xl md:text-5xl font-headline text-primary-foreground flex items-center justify-center gap-4">
          <Palmtree className="h-12 w-12 text-accent" />
          {t.booking_mgmt.title}
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <section>
          <Card className="shadow-xl border-t-4 border-t-accent bg-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 font-headline text-2xl">
                <Plane className="h-6 w-6 text-primary" /> 
                {getTxt('newReq')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField control={form.control} name="serviceType" render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-primary-foreground font-semibold">{getTxt('servType')}</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="bg-background">
                            <SelectValue placeholder={getTxt('placeholder')} />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Paquet Vacacional">☀️ {locale === 'ca' ? 'Paquet Vacacional' : locale === 'en' ? 'Vacation Package' : locale === 'fr' ? 'Forfait Vacances' : 'Paquete Vacacional'}</SelectItem>
                          <SelectItem value="Només Vols">✈️ {locale === 'ca' ? 'Només Vols' : locale === 'en' ? 'Only Flights' : locale === 'fr' ? 'Vols Uniquement' : 'Solo Vuelos'}</SelectItem>
                          <SelectItem value="Hotels">🏨 {locale === 'ca' ? 'Hotels' : locale === 'en' ? 'Hotels' : locale === 'fr' ? 'Hôtels' : 'Hoteles'}</SelectItem>
                          <SelectItem value="Creuers">🚢 {locale === 'ca' ? 'Creuers' : locale === 'en' ? 'Cruises' : locale === 'fr' ? 'Croisières' : 'Cruceros'}</SelectItem>
                          <SelectItem value="Circuits">🗺️ {locale === 'ca' ? 'Circuits' : locale === 'en' ? 'Circuits' : locale === 'fr' ? 'Circuits' : 'Circuitos'}</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )} />

                  <div className="grid grid-cols-2 gap-4">
                    <FormField control={form.control} name="origin" render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-primary-foreground font-semibold">{t.booking_mgmt.origin}</FormLabel>
                        <FormControl><Input {...field} className="bg-background" /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField control={form.control} name="destination" render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-primary-foreground font-semibold">{t.booking_mgmt.destination}</FormLabel>
                        <FormControl><Input {...field} className="bg-background" /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                  </div>

                  <FormField control={form.control} name="description" render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-primary-foreground font-semibold">{getTxt('descLabel')}</FormLabel>
                      <FormControl>
                        <Textarea placeholder={getTxt('descPlace')} className="bg-background min-h-[120px]" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />

                  <Button type="submit" size="lg" className="w-full bg-accent hover:bg-accent/90 text-accent-foreground font-bold" disabled={isSubmitting}>
                    {isSubmitting ? <Loader2 className="animate-spin h-6 w-6" /> : <><Send className="mr-2 h-5 w-5" /> {t.booking_mgmt.submit}</>}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </section>

        <section>
          <h2 className="text-2xl font-headline text-primary-foreground mb-6 flex items-center gap-3">
            <History className="h-7 w-7 text-primary" /> 
            {t.booking_mgmt.historyTitle}
          </h2>
          <div className="space-y-4">
            {isLoadingRequests ? <Loader2 className="animate-spin mx-auto text-primary" /> : requests.length === 0 ? (
              <p className="text-muted-foreground italic text-center p-8">{getTxt('noReq')}</p>
            ) : requests.map((req: any) => {
              const statusClean = req.estat?.toLowerCase().trim();
              const isAccepted = statusClean === 'acceptada' || statusClean === 'aceptada' || statusClean === 'accepted' || statusClean === 'acceptée';
              return (
                <Card key={req.id} className="border-l-4 border-l-primary bg-card">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div><span className="text-xs font-bold text-muted-foreground">{req.data}</span><h3 className="font-headline text-xl text-primary">{req.id}</h3></div>
                      <Badge className={cn("font-bold px-3 py-1", isAccepted ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700')}>
                        {isAccepted ? (locale === 'ca' ? 'Acceptada' : locale === 'en' ? 'Accepted' : locale === 'fr' ? 'Acceptée' : 'Aceptada') : req.estat}
                      </Badge>
                    </div>
                    <div className="text-sm space-y-2 border-t pt-4">
                      {req.detalls.split(' | ').map((line: string, i: number) => <p key={i} className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-accent" />{line}</p>)}
                    </div>
                    {isAccepted && (
                      <div className="mt-6 pt-4 border-t flex justify-end">
                        <Button variant="outline" size="sm" className="text-primary font-bold" onClick={() => handleDownloadAlbara(req)}>
                          <FileText className="mr-2 h-4 w-4" /> {t.booking_mgmt.downloadDelivery}
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </section>
      </div>
    </div>
  );
}