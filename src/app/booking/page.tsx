'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Loader2, Package, MapPin, Send, History, ClipboardList } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useLocale } from '@/contexts/locale-context';
import { translations } from '@/lib/translations';
import { cn } from '@/lib/utils';

// --- SCHEMA & TYPES ---
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
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  // --- AUTH CHECK & INITIAL FETCH ---
  useEffect(() => {
    const userDataString = localStorage.getItem('user');
    if (userDataString) {
      const userData = JSON.parse(userDataString);
      setUser(userData);
      fetchRequests(userData.usuari);
    } else {
      router.push('/account');
    }
    setIsAuthLoading(false);
  }, [router]);

  const fetchRequests = async (username: string) => {
    setIsLoadingRequests(true);
    try {
      const response = await fetch(`https://sheetdb.io/api/v1/reou400435n4c/search?sheet=solicituds&usuari=${username}`);
      const data = await response.json();
      // Reverse to show newest first
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

  // --- FORM SUBMISSION ---
  const onSubmit = async (values: BookingFormValues) => {
    if (!user) return;
    setIsSubmitting(true);

    try {
      const id = `BK-${Math.floor(100000 + Math.random() * 900000)}`;
      const dataHoje = new Date().toLocaleDateString('es-ES');
      
      // CONCATENATION LOGIC
      const detalls = `Servei: ${values.serviceType} | Origen: ${values.origin} | Destí: ${values.destination} | Càrrega: ${values.cargo}`;

      const payload = {
        id,
        data: dataHoje,
        usuari: user.usuari,
        estat: 'Pendent',
        detalls,
      };

      const response = await fetch('https://sheetdb.io/api/v1/reou400435n4c?sheet=solicituds', {
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

  if (isAuthLoading) return <div className="flex h-screen items-center justify-center"><Loader2 className="animate-spin h-12 w-12 text-primary" /></div>;
  if (!user) return null;

  return (
    <div className="container mx-auto px-4 py-12 max-w-6xl">
      <div className="mb-10 text-center">
        <h1 className="font-headline text-4xl text-primary-foreground flex items-center justify-center gap-3">
          <ClipboardList className="h-10 w-10 text-primary" />
          {t.booking_mgmt.title}
        </h1>
        <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
          {t.booking_mgmt.subtitle}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        
        {/* 1. FORM PART */}
        <section>
          <Card className="border-2 border-primary/10 shadow-xl sticky top-24">
            <CardHeader className="bg-primary/5">
              <CardTitle className="text-2xl flex items-center gap-2">
                <Send className="h-5 w-5 text-primary" />
                {t.booking_mgmt.formTitle}
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
                            <SelectItem value={t.booking_mgmt.services.sea}>{t.booking_mgmt.services.sea}</SelectItem>
                            <SelectItem value={t.booking_mgmt.services.air}>{t.booking_mgmt.services.air}</SelectItem>
                            <SelectItem value={t.booking_mgmt.services.land}>{t.booking_mgmt.services.land}</SelectItem>
                            <SelectItem value={t.booking_mgmt.services.warehouse}>{t.booking_mgmt.services.warehouse}</SelectItem>
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
                          <div className="relative">
                            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <FormControl>
                              <Input placeholder="BCN, Madrid..." {...field} className="pl-9" />
                            </FormControl>
                          </div>
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
                          <div className="relative">
                            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <FormControl>
                              <Input placeholder="NYC, London..." {...field} className="pl-9" />
                            </FormControl>
                          </div>
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
                        <FormControl>
                          <Textarea 
                            placeholder={t.booking_mgmt.cargoPlace} 
                            className="min-h-[100px]" 
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button type="submit" size="lg" className="w-full bg-accent hover:bg-accent/90 text-accent-foreground" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        {t.booking_mgmt.sending}
                      </>
                    ) : (
                      t.booking_mgmt.submit
                    )}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </section>

        {/* 2. LIST PART */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-headline text-primary-foreground flex items-center gap-2">
              <History className="h-6 w-6 text-primary" />
              {t.booking_mgmt.historyTitle}
            </h2>
            <Badge variant="outline" className="text-primary border-primary">
              {requests.length}
            </Badge>
          </div>

          <div className="space-y-4">
            {isLoadingRequests ? (
              <div className="flex justify-center py-20">
                <Loader2 className="h-8 w-8 animate-spin text-primary/40" />
              </div>
            ) : requests.length === 0 ? (
              <div className="text-center py-20 bg-card/50 rounded-lg border-2 border-dashed">
                <Package className="h-12 w-12 text-muted-foreground mx-auto mb-3 opacity-20" />
                <p className="text-muted-foreground">{t.booking_mgmt.empty}</p>
              </div>
            ) : (
              requests.map((req) => {
                const isPending = req.estat.toLowerCase() === 'pendent' || req.estat.toLowerCase() === 'pendiente';
                const isApproved = req.estat.toLowerCase() === 'aprovat' || req.estat.toLowerCase() === 'aprobado';
                
                return (
                  <Card key={req.id} className="overflow-hidden border-l-4 transition-all hover:shadow-md" style={{ borderLeftColor: isPending ? '#eab308' : isApproved ? '#22c55e' : '#ef4444' }}>
                    <CardHeader className="p-4 pb-2 bg-muted/30">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">{req.data}</p>
                          <CardTitle className="text-lg font-bold text-primary">{req.id}</CardTitle>
                        </div>
                        <Badge className={cn(
                          "uppercase text-[10px]",
                          isPending && "bg-yellow-100 text-yellow-800 border-yellow-200",
                          isApproved && "bg-green-100 text-green-800 border-green-200"
                        )}>
                          {req.estat}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="p-4 pt-2">
                      <div className="text-sm text-foreground whitespace-pre-wrap leading-relaxed">
                        {req.detalls.split(' | ').map((part, i) => (
                          <div key={i} className="flex gap-2 mb-1">
                            <span className="font-semibold text-primary/80 min-w-[70px]">{part.split(': ')[0]}:</span>
                            <span className="text-muted-foreground">{part.split(': ')[1]}</span>
                          </div>
                        ))}
                      </div>
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