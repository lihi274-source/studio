import Image from 'next/image';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlaceHolderImages } from '@/lib/placeholder-images';

const DestinosTab = () => {
  // We'll show a selection of popular destinations from the excursions data
  const popularDestinations = PlaceHolderImages.filter(p => ['tour-paris', 'tour-rome', 'tour-tokyo', 'tour-new-york'].includes(p.id));

  return (
    <div className="mt-6">
      <div className="text-center mb-12">
        <h2 className="font-headline text-3xl text-primary-foreground">Destinos Populares</h2>
        <p className="text-muted-foreground mt-2">Inspírate para tu próxima aventura. Estos son algunos de nuestros lugares más visitados.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {popularDestinations.map((destination) => (
          <Card key={destination.id} className="flex flex-col md:flex-row overflow-hidden transition-transform duration-300 hover:scale-105 hover:shadow-2xl">
            <div className="relative w-full md:w-1/2 aspect-video md:aspect-auto">
              <Image
                src={destination.imageUrl}
                alt={destination.imageHint.replace(' ', ' ')}
                fill
                className="object-cover"
                data-ai-hint={destination.imageHint}
              />
            </div>
            <div className="flex flex-col justify-between w-full md:w-1/2 p-6">
              <div>
                <CardTitle className="font-headline text-2xl mb-2">{destination.imageHint.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}</CardTitle>
                <CardDescription>{destination.description}</CardDescription>
              </div>
              <Button className="mt-4 w-full bg-accent hover:bg-accent/90 text-accent-foreground">
                Ver ofertas
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default DestinosTab;
