'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { CalendarIcon, Users, MapPin } from 'lucide-react';
import { format } from 'date-fns';
import { es, ca, enUS } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { useLocale } from '@/contexts/locale-context';
import { translations } from '@/lib/translations';

const formSchema = z.object({
  destino: z.string().min(1),
  fechas: z.object({
    from: z.date(),
    to: z.date(),
  }),
  huespedes: z.string().min(1),
});

const HotelesTab = () => {
  const { locale } = useLocale();
  const t = translations[locale];
  
  const dateLocale = locale === 'ca' ? ca : locale === 'en' ? enUS : es;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      destino: '',
      huespedes: '2',
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
  }

  return (
    <Card className="mt-6 border-2 border-primary/20 shadow-lg">
      <CardHeader>
        <CardTitle className="font-headline text-3xl">{t.home.hotelTitle}</CardTitle>
        <CardDescription>{t.home.hotelSub}</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="destino"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t.forms.destination}</FormLabel>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <FormControl>
                      <Input placeholder={t.forms.destination} {...field} className="pl-10" />
                    </FormControl>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <FormField
                control={form.control}
                name="fechas"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>{t.forms.departure} - {t.forms.return}</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            id="date"
                            variant={'outline'}
                            className={cn('w-full justify-start text-left font-normal', !field.value?.from && 'text-muted-foreground')}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {field.value?.from ? (
                              field.value.to ? (
                                <>
                                  {format(field.value.from, 'LLL dd, y', { locale: dateLocale })} -{' '}
                                  {format(field.value.to, 'LLL dd, y', { locale: dateLocale })}
                                </>
                              ) : (
                                format(field.value.from, 'LLL dd, y', { locale: dateLocale })
                              )
                            ) : (
                              <span>{t.forms.chooseRange}</span>
                            )}
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          initialFocus
                          mode="range"
                          defaultMonth={field.value?.from}
                          selected={field.value}
                          onSelect={field.onChange}
                          numberOfMonths={2}
                          disabled={(date) => date < new Date(new Date().setHours(0,0,0,0))}
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="huespedes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t.forms.guests}</FormLabel>
                    <div className="relative">
                      <Users className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="pl-10">
                            <SelectValue placeholder={t.forms.guests} />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {[...Array(8)].map((_, i) => (
                            <SelectItem key={i + 1} value={`${i + 1}`}>
                              {i + 1} {i + 1 > 1 ? t.forms.guests.toLowerCase() : t.forms.guests.toLowerCase().slice(0, -1)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <Button type="submit" size="lg" className="w-full md:w-auto bg-accent hover:bg-accent/90 text-accent-foreground">
              {t.forms.search}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default HotelesTab;
