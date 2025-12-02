'use client';

import Image from 'next/image';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlaceHolderImages } from '@/lib/placeholder-images';

type Promocion = {
  id: string;
  title: string;
  price: number;
  currency: string;
  description: string;
};

const promocionesData: Promocion[] = [
  { 
    id: 'promo-disneyland', 
    title: 'Magia en Disneyland® Paris', 
    price: 99, 
    currency: 'EUR', 
    description: 'Vive un sueño en Disneyland® Paris con entradas para los 2 parques Disney. ¡Una experiencia ideal para toda la familia!'
  },
  { 
    id: 'promo-caldea', 
    title: 'Relax en Caldea, Andorra', 
    price: 45, 
    currency: 'EUR', 
    description: 'Escápate a las montañas y disfruta de un acceso de 3 horas al espectacular centro termolúdico Caldea en Andorra.'
  },
  {
    id: 'promo-valencia', 
    title: 'Escapada Azul a Valencia', 
    price: 35, 
    currency: 'EUR', 
    description: 'Sumérgete en la belleza del mundo marino con las entradas para el impresionante Oceanogràfic de Valencia. ¡Una experiencia inolvidable!'
  },
  { 
    id: 'promo-madrid', 
    title: 'Arte y Cultura en Madrid', 
    price: 50, 
    currency: 'EUR', 
    description: 'Descubre la capital española con un tour guiado por el famoso Triángulo del Arte: los museos del Prado, Reina Sofía y Thyssen-Bornemisza.'
  }
];

const PromocionesTab = () => {
  const promociones = promocionesData.map(promo => {
    const imageData = PlaceHolderImages.find(img => img.id === promo.id);
    return { ...promo, ...imageData };
  });

  return (
    <div className="mt-6">
      <div className="text-center mb-12">
        <h2 className="font-headline text-3xl text-primary-foreground">Nuestras Promociones Exclusivas</h2>
        <p className="text-muted-foreground mt-2">Aprovecha nuestras ofertas de hotel + excursión al mejor precio.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {promociones.map((promo) => (
          <Card key={promo.id} className="flex flex-col overflow-hidden transition-transform duration-300 hover:scale-105 hover:shadow-2xl">
            {promo.imageUrl && (
              <div className="relative w-full aspect-video">
                <Image
                  src={promo.imageUrl}
                  alt={promo.title}
                  fill
                  className="object-cover"
                  data-ai-hint={promo.imageHint}
                />
              </div>
            )}
            <CardHeader>
              <CardTitle className="font-headline text-xl">{promo.title}</CardTitle>
            </CardHeader>
            <CardContent className="flex-grow">
              <p className="text-sm text-muted-foreground">{promo.description}</p>
            </CardContent>
            <CardFooter className="flex justify-between items-center">
              <p className="text-lg font-bold text-primary">
                Desde {new Intl.NumberFormat('es-ES', { style: 'currency', currency: promo.currency }).format(promo.price)}
              </p>
              <Button className="bg-accent hover:bg-accent/90 text-accent-foreground">
                Ver Oferta
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default PromocionesTab;
