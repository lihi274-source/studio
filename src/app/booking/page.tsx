'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Loader2, Package, MapPin, Send, History, ClipboardList, ArrowLeft } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useLocale } from '@/contexts/locale-context';
import { translations } from '@/lib/translations';
import { cn } from '@/lib/utils';
import Link from 'next/link';

const SHEETDB_URL = 'https://sheetdb.io/api/v1/reou400435n4c?sheet=solicituds';
const SHEETDB_SEARCH_URL = 'https://sheetdb.io/api/v1/reou400435n4c/search?sheet=solicituds';

const bookingFormSchema = z.object({
  serviceType: z.string().min(1),
  origin: z.string().min(2),
  destination: z.string().min(2),
  cargo: z.string().min(5),
});

type BookingFormValues = z.infer<typeof bookingFormSchema>;

type BookingRequest = {
  id: string;
  data: string;
  usuari: string;
  estat: string;
  detalls: string;
};

type UserData = {
  usuari: string;
  empresa: string;
};

export default function BookingManagementPage() {
  const { locale } = useLocale();
  const t = translations[locale];
  const { toast } = useToast();
  const router = useRouter();

  const [user, setUser] = useState<UserData | null>(null);
  const [requests, setRequests] = useState<BookingRequest[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingRequests, setIsLoadingRequests] = useState(true);

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
      console.error("Error fetching requests:", error);
    } finally {
      setIsLoadingRequests(false);
    }
  };

  const form = useForm<BookingFormValues>({
    resolver: zodResolver(bookingFormSchema),
    defaultValues: {
      serviceType: '',
      origin: '',
      destination: '',
      cargo: '',
    },
  });

  const onSubmit = async (values: BookingFormValues) => {
    if (!user) return;
    setIsSubmitting(true);

    try {
      const id = `BK-${Math.floor(100000 + Math.random() * 900000)}`;
      const dataHoje = new Date().toLocaleDateString('es-ES');
      const detalls = `Servei: ${values.serviceType} | Origen: ${values.origin} | Destí: ${values.destination} | Càrrega: ${values.cargo}`;

      const payload = {
        id,
        data: dataHoje,
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
      } else {
        throw new Error();
      }
    } catch (error) {
      toast({ variant: "destructive", title: t.booking_mgmt.error });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!user) return null;

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <div className="mb-6">
        <Button asChild variant="ghost">
          <Link href="/dashboard">
            <ArrowLeft className="mr-2 h-4 w-4" />
            {t.about.back}
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* FORMULARI */}
        <Card className="shadow-lg border-primary/20 h-fit">
          <CardHeader>
            <CardTitle className="font-headline text-3xl flex items-center gap-2">
              <Send className="text-primary" />
              {t.booking_mgmt.formTitle}
            </CardTitle>
            <CardDescription>{t.booking_mgmt.subtitle}</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="serviceType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t.booking_mgmt.serviceType}</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder={t.booking_mgmt.serviceType} />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Marítim">{t.booking_mgmt.services.sea}</SelectItem>
                          <SelectItem value="Aeri">{t.booking_mgmt.services.air}</SelectItem>
                          <SelectItem value="Terrestre">{t.booking_mgmt.services.land}</SelectItem>
                          <SelectItem value="Magatzem">{t.booking_mgmt.services.warehouse}</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="origin"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t.booking_mgmt.origin}</FormLabel>
                        <FormControl><Input {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="destination"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t.booking_mgmt.destination}</FormLabel>
                        <FormControl><Input {...field} /></FormControl>
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
                      <FormLabel>{t.booking_mgmt.cargo}</FormLabel>
                      <FormControl><Textarea placeholder={t.booking_mgmt.cargoPlace} {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full bg-accent hover:bg-accent/90 text-accent-foreground" disabled={isSubmitting}>
                  {isSubmitting ? <Loader2 className="animate-spin mr-2" /> : <Send className="mr-2" />}
                  {isSubmitting ? t.booking_mgmt.sending : t.booking_mgmt.submit}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        {/* HISTÒRIC */}
        <div className="space-y-6">
          <div className="flex items-center gap-2 mb-4">
            <History className="text-primary h-6 w-6" />
            <h2 className="text-2xl font-headline text-primary-foreground">{t.booking_mgmt.historyTitle}</h2>
          </div>

          {isLoadingRequests ? (
            <div className="flex justify-center py-10"><Loader2 className="animate-spin h-10 w-10 text-muted-foreground" /></div>
          ) : requests.length === 0 ? (
            <p className="text-center text-muted-foreground bg-muted/30 py-10 rounded-lg">{t.booking_mgmt.empty}</p>
          ) : (
            <div className="space-y-4">
              {requests.map((req) => (
                <Card key={req.id} className="overflow-hidden hover:shadow-md transition-shadow">
                  <div className="p-4 flex flex-col gap-2">
                    <div className="flex justify-between items-start">
                      <span className="font-bold text-primary">{req.id}</span>
                      <Badge className={cn(
                        req.estat === 'Aprovat' ? "bg-green-500" : 
                        req.estat === 'Rebutjat' ? "bg-red-500" : "bg-yellow-500"
                      )}>
                        {req.estat === 'Pendent' ? t.booking_mgmt.status.pending : 
                         req.estat === 'Aprovat' ? t.booking_mgmt.status.approved : 
                         t.booking_mgmt.status.rejected}
                      </Badge>
                    </div>
                    <div className="text-xs text-muted-foreground flex items-center gap-1">
                      <History className="h-3 w-3" /> {req.data}
                    </div>
                    <p className="text-sm border-t pt-2 mt-2 leading-relaxed">{req.detalls}</p>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
