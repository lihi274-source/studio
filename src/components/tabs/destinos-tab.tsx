import Image from 'next/image';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlaceHolderImages } from '@/lib/placeholder-images';

const DestinosTab = () => {
  // We'll show a selection of countries
  const countries = PlaceHolderImages.filter(p => p.id.startsWith('country-'));

  return (
    <div className="mt-6">
      <div className="text-center mb-12">
        <h2 className="font-headline text-3xl text-primary-foreground">Explora el Mundo</h2>
        <p className="text-muted-foreground mt-2">Descubre curiosidades y lugares fascinantes en estos países.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {countries.map((country) => (
          <Card key={country.id} className="flex flex-col md:flex-row overflow-hidden transition-transform duration-300 hover:scale-105 hover:shadow-2xl">
            <div className="relative w-full md:w-1/2 aspect-video md:aspect-auto">
              <Image
                src={country.imageUrl}
                alt={country.title || country.imageHint}
                fill
                className="object-cover"
                data-ai-hint={country.imageHint}
              />
            </div>
            <div className="flex flex-col justify-between w-full md:w-1/2 p-6">
              <div>
                <CardTitle className="font-headline text-2xl mb-2">{country.title}</CardTitle>
                <CardDescription>{country.description}</CardDescription>
              </div>
              <Button className="mt-4 w-full bg-accent hover:bg-accent/90 text-accent-foreground">
                Saber más
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default DestinosTab;
