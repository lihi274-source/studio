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
import { Loader2, Plane, MapPin, Send, History, Palmtree, Luggage, FileText } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { useLocale } from '@/contexts/locale-context';
import { translations } from '@/lib/translations';

const SHEETDB_URL = 'https://sheetdb.io/api/v1/reou400435n4c?sheet=solicituds';
const SHEETDB_SEARCH_URL = 'https://sheetdb.io/api/v1/reou400435n4c/search?sheet=solicituds';

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
      
      const detalls = `Servei: ${values.serviceType} | Origen: ${values.origin} | Destí: ${values.destination} | Càrrega: ${values.cargo}`;

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

  const handleDownload = (req: any) => {
    setDownloadingId(req.id);
    
    setTimeout(() => {
      const albaraWindow = window.open('', '_blank');
      if (albaraWindow) {
        const detallsHtml = req.detalls.split(' | ').map((line: string) => `<p style="margin: 5px 0;">${line}</p>`).join('');
        
        albaraWindow.document.write(`
          <!DOCTYPE html>
          <html>
            <head>
              <title>Albarà ${req.id} - Viajes HICA</title>
              <style>
                body { font-family: 'Arial', sans-serif; padding: 40px; color: #333; line-height: 1.6; background-color: white; }
                .container { max-width: 800px; margin: 0 auto; border: 1px solid #eee; padding: 40px; border-radius: 8px; box-shadow: 0 0 10px rgba(0,0,0,0.05); }
                .header { display: flex; justify-content: space-between; border-bottom: 3px solid #222538; padding-bottom: 20px; margin-bottom: 30px; }
                .logo { font-size: 28px; font-weight: 900; color: #222538; text-transform: uppercase; letter-spacing: -1px; }
                .title { font-size: 32px; font-weight: 900; text-transform: uppercase; margin: 0; color: #222538; }
                .info-section { display: grid; grid-template-cols: 1fr 1fr; gap: 40px; margin-bottom: 40px; }
                .info-box h3 { margin-top: 0; border-bottom: 1px solid #ddd; padding-bottom: 5px; font-size: 14px; text-transform: uppercase; color: #666; }
                .label { font-weight: bold; color: #222538; }
                .details-box { border: 2px solid #f0f0f0; padding: 25px; background: #fafafa; border-radius: 8px; margin-bottom: 30px; }
                .details-box h2 { margin-top: 0; color: #222538; font-size: 20px; border-bottom: 1px solid #eee; padding-bottom: 10px; }
                .footer { margin-top: 60px; font-size: 11px; color: #999; text-align: center; border-top: 1px solid #eee; padding-top: 20px; }
                .status-badge { display: inline-block; padding: 4px 12px; border-radius: 20px; background: #e8f5e9; color: #2e7d32; font-weight: bold; font-size: 12px; }
                @media print { .no-print { display: none !important; } .container { border: none; box-shadow: none; padding: 0; } }
                .btn-print { padding: 12px 25px; background: #222538; color: white; border: none; border-radius: 5px; cursor: pointer; font-weight: bold; transition: opacity 0.2s; }
                .btn-print:hover { opacity: 0.9; }
              </style>
            </head>
            <body>
              <div class="container">
                <div class="header">
                  <div>
                    <div class="logo">Viajes HICA</div>
                    <p style="margin: 5px 0;">C/Amposta Nº8 Bajo s/n</p>
                    <p style="margin: 5px 0;">46000 València, Espanya</p>
                  </div>
                  <div style="text-align: right;">
                    <h1 class="title">Albarà</h1>
                    <p style="margin: 5px 0;"><strong>Nº Document:</strong> ${req.id}</p>
                    <p style="margin: 5px 0;"><strong>Data d'Emissió:</strong> ${req.data}</p>
                    <div class="status-badge">Estat: ${req.estat}</div>
                  </div>
                </div>
                
                <div class="info-section">
                  <div class="info-box">
                    <h3>Dades del Sol·licitant</h3>
                    <p><span class="label">Usuari:</span> ${req.usuari}</p>
                  </div>
                  <div class="info-box">
                    <h3>Referència de Gestió</h3>
                    <p><span class="label">ID Sistema:</span> ${req.id}</p>
                    <p><span class="label">Tipus:</span> Sol·licitud de Servei</p>
                  </div>
                </div>
                
                <div class="details-box">
                  <h2>Detalls de la Sol·licitud</h2>
                  <div style="font-size: 15px;">
                    ${detallsHtml}
                  </div>
                </div>
                
                <div style="margin-top: 40px;">
                   <p><strong>Observacions:</strong> Aquest document acredita la recepció de la vostra sol·licitud per part dels nostres sistemes. Un agent es posarà en contacte amb vosaltres per coordinar els següents passos.</p>
                </div>

                <div class="footer">
                  <p>© ${new Date().getFullYear()} Viajes HICA. Tots els drets reservats. Document de control intern.</p>
                </div>
              </div>
              
              <div class="no-print" style="text-align: center; margin-top: 30px;">
                <button onclick="window.print()" class="btn-print">Imprimir o Guardar com a PDF</button>
              </div>
            </body>
          </html>
        `);
        albaraWindow.document.close();
      }
      
      setDownloadingId(null);
      toast({
        title: "Document obert",
        description: `L'albarà ${req.id} s'ha generat correctament.`,
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
        <p className="text-muted-foreground mt-4 text-lg max-w-2xl mx-auto italic">
          {t.booking_mgmt.subtitle}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        
        {/* FORMULARIO */}
        <section>
          <Card className="shadow-2xl border-t-8 border-t-accent bg-card overflow-hidden">
            <CardHeader className="bg-primary/5 border-b">
              <CardTitle className="flex items-center gap-3 font-headline text-2xl text-primary">
                <Plane className="h-7 w-7" />
                {t.booking_mgmt.formTitle}
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-8">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="serviceType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-primary font-bold">{t.booking_mgmt.serviceType}</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="bg-background border-primary/20">
                              <SelectValue placeholder={t.booking_mgmt.serviceType} />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Transport Marítim">🚢 Transport Marítim</SelectItem>
                            <SelectItem value="Transport Aeri">✈️ Transport Aeri</SelectItem>
                            <SelectItem value="Transport Terrestre">🚛 Transport Terrestre</SelectItem>
                            <SelectItem value="Almacén">🏬 Magatzem</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="origin"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-primary font-bold">{t.booking_mgmt.origin}</FormLabel>
                          <FormControl><Input placeholder={t.booking_mgmt.origin} {...field} className="bg-background border-primary/20 focus:ring-accent" /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="destination"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-primary font-bold">{t.booking_mgmt.destination}</FormLabel>
                          <FormControl><Input placeholder={t.booking_mgmt.destination} {...field} className="bg-background border-primary/20 focus:ring-accent" /></FormControl>
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
                        <FormLabel className="text-primary font-bold">{t.booking_mgmt.cargo}</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder={t.booking_mgmt.cargoPlace}
                            className="bg-background min-h-[140px] border-primary/20 focus:ring-accent" 
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button type="submit" size="lg" className="w-full bg-accent hover:bg-accent/90 text-accent-foreground font-headline text-lg h-14 shadow-lg transition-all" disabled={isSubmitting}>
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
          <h2 className="text-3xl font-headline text-primary mb-8 flex items-center gap-3">
            <History className="h-8 w-8 text-accent" /> 
            {t.booking_mgmt.historyTitle}
          </h2>
          <div className="space-y-6">
            {isLoadingRequests ? (
              <div className="flex flex-col items-center justify-center p-20">
                <Loader2 className="h-12 w-12 animate-spin text-accent mb-4" />
                <p className="text-muted-foreground">Carregant les teves dades...</p>
              </div>
            ) : requests.length === 0 ? (
              <div className="p-16 text-center border-4 border-dashed rounded-3xl bg-card/40 border-primary/10">
                <Luggage className="h-20 w-20 mx-auto text-primary/20 mb-6" />
                <p className="text-muted-foreground font-medium">{t.booking_mgmt.empty}</p>
              </div>
            ) : (
              requests.map((req: any) => {
                const isAccepted = req.estat?.trim() === 'Acceptada';
                const isDownloading = downloadingId === req.id;

                return (
                  <Card key={req.id} className="hover:shadow-xl transition-all duration-300 border-l-[12px] border-l-primary bg-card group">
                    <CardContent className="p-8">
                      <div className="flex justify-between items-start mb-6">
                        <div>
                          <span className="text-xs font-black text-accent uppercase tracking-widest bg-accent/10 px-2 py-1 rounded">{req.data}</span>
                          <h3 className="font-headline text-2xl text-primary mt-2">{req.id}</h3>
                        </div>
                        <Badge className={cn(
                          "font-black py-2 px-5 text-sm uppercase shadow-sm",
                          req.estat === 'Pendent' ? 'bg-amber-100 text-amber-700 hover:bg-amber-100 border-amber-200' : 
                          isAccepted ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-100 border-emerald-200' :
                          'bg-rose-100 text-rose-700 hover:bg-rose-100 border-rose-200'
                        )}>
                          {req.estat}
                        </Badge>
                      </div>
                      <div className="text-sm text-foreground space-y-3 border-t border-primary/5 pt-6">
                        {req.detalls.split(' | ').map((line: string, i: number) => (
                          <p key={i} className="flex items-center gap-3">
                            <span className="w-2 h-2 rounded-full bg-accent group-hover:scale-125 transition-transform" />
                            {line}
                          </p>
                        ))}
                      </div>

                      {isAccepted && (
                        <div className="mt-8 pt-6 border-t border-primary/5 flex justify-end">
                          <Button 
                            variant="outline" 
                            size="lg" 
                            className={cn(
                              "font-headline border-primary/20 hover:bg-primary/5 text-primary h-12",
                              isDownloading && "opacity-50"
                            )}
                            onClick={() => handleDownload(req)}
                            disabled={isDownloading}
                          >
                            {isDownloading ? (
                              <>
                                <Loader2 className="mr-2 h-5 w-5 animate-spin text-accent" />
                                Generant...
                              </>
                            ) : (
                              <>
                                <FileText className="mr-2 h-5 w-5 text-accent" />
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
