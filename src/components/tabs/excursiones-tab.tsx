'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { excursionsData, conversionRates } from '@/lib/excursions-data';

const ExcursionesTab = () => {
  const excursions = excursionsData.map(excursion => {
    const imageData = PlaceHolderImages.find(img => img.id === excursion.id);
    const priceInEur = excursion.price * (conversionRates[excursion.currency] || 1);
    return { ...excursion, ...imageData, priceInEur };
  });

  return (
    <div className="mt-6">
      <div className="text-center mb-12">
        <h2 className="font-headline text-3xl text-primary-foreground">Excursiones y Actividades Populares</h2>
        <p className="text-muted-foreground mt-2">Descubre experiencias inolvidables en los mejores destinos del mundo.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {excursions.map((excursion) => (
          <Card key={excursion.id} className="flex flex-col overflow-hidden transition-transform duration-300 hover:scale-105 hover:shadow-2xl">
            {excursion.imageUrl && (
              <div className="relative w-full aspect-video">
                <Image
                  src={excursion.imageUrl}
                  alt={excursion.title}
                  fill
                  className="object-cover"
                  data-ai-hint={excursion.imageHint}
                />
              </div>
            )}
            <CardHeader>
              <CardTitle className="font-headline text-xl">{excursion.title}</CardTitle>
              <CardDescription>{excursion.description}</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow" />
            <CardFooter className="flex justify-between items-center">
              <p className="text-lg font-bold text-primary">
                {new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(excursion.priceInEur)}
              </p>
              <Button asChild className="bg-accent hover:bg-accent/90 text-accent-foreground">
                <Link href={`/reservar?excursionId=${excursion.id}`}>
                  Reservar ahora
                </Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ExcursionesTab;
