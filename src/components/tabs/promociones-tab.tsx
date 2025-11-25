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
    id: 'promo-valencia', 
    title: 'Escapada Azul a Valencia', 
    price: 180, 
    currency: 'EUR', 
    description: 'Sumérgete en la belleza de Valencia con 2 noches en un hotel de 4 estrellas y entradas incluidas para el impresionante Oceanogràfic. ¡Una experiencia inolvidable!'
  },
  { 
    id: 'promo-madrid', 
    title: 'Arte y Cultura en Madrid', 
    price: 220, 
    currency: 'EUR', 
    description: 'Disfruta de la capital española con 2 noches de alojamiento y un tour guiado por el famoso Triángulo del Arte: los museos del Prado, Reina Sofía y Thyssen-Bornemisza.'
  },
  {
    id: 'promo-barcelona',
    title: 'Aventura Modernista en Barcelona',
    price: 250,
    currency: 'EUR',
    description: 'Vive la magia de Barcelona con 3 noches de hotel y entradas para la Sagrada Familia y el Park Güell. Una inmersión total en la obra de Gaudí.'
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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
