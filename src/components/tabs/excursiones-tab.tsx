import Image from 'next/image';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlaceHolderImages } from '@/lib/placeholder-images';

type Excursion = {
  id: string;
  title: string;
  price: number;
  currency: string;
};

const excursionsData: Excursion[] = [
  { id: 'tour-paris', title: 'Tour Eiffel y Crucero por el Sena', price: 120, currency: 'EUR' },
  { id: 'tour-rome', title: 'Roma Antigua: Coliseo y Foro', price: 95, currency: 'EUR' },
  { id: 'tour-new-york', title: 'Contrastes de Nueva York', price: 80, currency: 'USD' },
  { id: 'tour-tokyo', title: 'Tradición y Modernidad en Tokio', price: 15000, currency: 'JPY' },
  { id: 'tour-sydney', title: 'Maravillas de Sídney y Playas', price: 110, currency: 'AUD' },
  { id: 'tour-cairo', title: 'Misterios del Antiguo Egipto', price: 75, currency: 'USD' },
  { id: 'tour-portaventura', title: 'PortAventura: Especial Navidad', price: 60, currency: 'EUR' },
];

const conversionRates: Record<string, number> = {
    USD: 0.93, // 1 USD = 0.93 EUR
    JPY: 0.0059, // 1 JPY = 0.0059 EUR
    AUD: 0.61, // 1 AUD = 0.61 EUR
    EUR: 1,
};

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
              <Button className="bg-accent hover:bg-accent/90 text-accent-foreground">
                Reservar ahora
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ExcursionesTab;
