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
  cargo: z.string().min(5, "Detalla el teu viatge"),
});

export default function BookingManagementPage() {
  const { locale } = useLocale();
  const t = translations[locale];
  const { toast } = useToast();
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [requests, setRequests] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingRequests, setIsLoadingRequests] = useState(true);

  useEffect(() => {
    const userDataString = localStorage.getItem('user');
    if (userDataString) {
      setUser(JSON.parse(userDataString));
      fetchRequests(JSON.parse(userDataString).usuari);
    } else {
      router.push('/account');
    }
  }, [router]);

  const fetchRequests = async (username: string) => {
    setIsLoadingRequests(true);
    try {
      const res = await fetch(`${SHEETDB_SEARCH_URL}&usuari=${username}`);
      const data = await res.json();
      setRequests(Array.isArray(data) ? data.reverse() : []);
    } catch (e) { console.error(e); } finally { setIsLoadingRequests(false); }
  };

  const form = useForm<z.infer<typeof bookingFormSchema>>({
    resolver: zodResolver(bookingFormSchema),
    defaultValues: { serviceType: '', origin: '', destination: '', cargo: '' },
  });

  const onSubmit = async (values: z.infer<typeof bookingFormSchema>) => {
    if (!user) return;
    setIsSubmitting(true);
    try {
      const payload = {
        id: `HICA-${Math.floor(1000 + Math.random() * 9000)}`,
        data: new Date().toLocaleDateString('ca-ES'),
        usuari: user.usuari,
        estat: 'Pendent',
        detalls: `Viatge: ${values.serviceType} | De: ${values.origin} | A: ${values.destination} | Info: ${values.cargo}`,
      };
      const res = await fetch(SHEETDB_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data: [payload] }),
      });
      if (res.ok) {
        toast({ title: t.booking_mgmt.success });
        form.reset();
        fetchRequests(user.usuari);
      }
    } catch (e) { toast({ variant: "destructive", title: "Error" }); } finally { setIsSubmitting(false); }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="mb-12 text-center text-primary">
        <h1 className="text-4xl font-bold flex items-center justify-center gap-4">
          <Palmtree className="h-10 w-10 text-orange-500" /> {t.booking_mgmt.title}
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <Card className="shadow-lg border-t-4 border-t-orange-400">
          <CardHeader><CardTitle>{t.booking_mgmt.formTitle}</CardTitle></CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField control={form.control} name="serviceType" render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t.booking_mgmt.serviceType}</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl><SelectTrigger><SelectValue placeholder="Selecciona..." /></SelectTrigger></FormControl>
                      <SelectContent>
                        <SelectItem value="Paquet">☀️ Paquet Vacacional</SelectItem>
                        <SelectItem value="Vols">✈️ Només Vols</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormItem>
                )} />
                <div className="grid grid-cols-2 gap-4">
                  <FormField control={form.control} name="origin" render={({ field }) => (
                    <FormItem><FormLabel>Origen</FormLabel><Input {...field} /></FormItem>
                  )} />
                  <FormField control={form.control} name="destination" render={({ field }) => (
                    <FormItem><FormLabel>Destí</FormLabel><Input {...field} /></FormItem>
                  )} />
                </div>
                <FormField control={form.control} name="cargo" render={({ field }) => (
                  <FormItem><FormLabel>Comentaris</FormLabel><Textarea {...field} /></FormItem>
                )} />
                <Button type="submit" className="w-full bg-orange-500 hover:bg-orange-600" disabled={isSubmitting}>
                  {isSubmitting ? <Loader2 className="animate-spin" /> : t.booking_mgmt.submit}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        <section>
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2 text-primary"><History /> Historial</h2>
          <div className="space-y-4">
            {isLoadingRequests ? <Loader2 className="animate-spin mx-auto text-orange-500" /> : 
              requests.map((req: any) => {
                const isAccepted = req.estat?.toLowerCase().trim() === 'acceptada';
                return (
                  <Card key={req.id} className="border-l-4 border-l-orange-500">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <span className="text-xs text-muted-foreground">{req.data}</span>
                          <p className="font-bold text-primary">{req.id}</p>
                        </div>
                        <Badge className={isAccepted ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}>{req.estat}</Badge>
                      </div>
                      <div className="text-sm border-t pt-2 space-y-1">
                        {req.detalls.split(' | ').map((l: string, i: number) => <p key={i}>{l}</p>)}
                      </div>
                      {isAccepted && (
                        <div className="mt-4 pt-3 border-t flex justify-end">
                          <Button variant="outline" size="sm" className="text-orange-600 border-orange-200" onClick={() => alert('Baixant...')}>
                            <FileText className="mr-2 h-4 w-4" /> Descarregar Albarà
                          </Button>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                );
              })
            }
          </div>
        </section>
      </div>
    </div>
  );
}