import { PlaceHolderImages } from '@/lib/placeholder-images';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

export async function generateStaticParams() {
  return PlaceHolderImages.map((p) => ({
    slug: p.id,
  }));
}

// Helper function to parse text with asterisks for bolding
const parseBold = (text: string) => {
  const parts = text.split(/\*{2}(.*?)\*{2}/g);
  return parts.map((part, index) =>
    index % 2 === 1 ? <strong key={index}>{part}</strong> : part
  );
};

// Helper component to render markdown-like text
const DetailsContent = ({ content }: { content: string }) => {
    const lines = content.split('\n').map((line, index) => {
      if (line.startsWith('### ')) {
        return <h3 key={index} className="font-headline text-2xl mt-6 mb-2 text-primary-foreground">{line.substring(4)}</h3>;
      }
      if (line.startsWith('*   ')) {
        return <li key={index} className="mb-2">{parseBold(line.substring(4))}</li>;
      }
      if(line.trim() === '') {
        return null;
      }
      return <p key={index}>{parseBold(line)}</p>;
    });

    const listItems = lines.filter(line => line && line.type === 'li');
    
    let currentList: React.ReactNode[] = [];
    const renderedContent: React.ReactNode[] = [];

    lines.forEach((line, index) => {
        if (line && line.type === 'li') {
            currentList.push(line);
        } else {
            if (currentList.length > 0) {
                renderedContent.push(<ul key={`ul-${index}`} className="list-disc list-inside space-y-2">{currentList}</ul>);
                currentList = [];
            }
            renderedContent.push(line);
        }
    });

    if (currentList.length > 0) {
        renderedContent.push(<ul key="ul-last" className="list-disc list-inside space-y-2">{currentList}</ul>);
    }

    return <>{renderedContent}</>;
};

export default function DestinoPage({ params }: { params: { slug: string } }) {
  const { slug } = params;
  const destination = PlaceHolderImages.find(p => p.id === slug);

  if (!destination) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-5xl">
      <div className="relative w-full h-80 md:h-[500px] mb-12 rounded-2xl overflow-hidden shadow-2xl">
        <Image
          src={destination.imageUrl}
          alt={destination.title || destination.imageHint}
          fill
          className="object-cover"
          data-ai-hint={destination.imageHint}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-0 left-0 p-8 md:p-12">
            <h1 className="font-headline text-4xl md:text-6xl text-white">
                {destination.title}
            </h1>
        </div>
      </div>
      
      <Card>
        <CardContent className="p-8 md:p-12">
            <article className="prose prose-lg lg:prose-xl dark:prose-invert max-w-none text-foreground">
                <p className="lead text-xl text-muted-foreground">{destination.description}</p>
                
                {destination.details ? (
                    <DetailsContent content={destination.details} />
                ) : (
                    <>
                        <p>
                            Más detalles sobre este destino estarán disponibles próximamente. Estamos trabajando para ofrecerte la mejor información.
                        </p>
                         <p>
                            Mientras tanto, puedes explorar nuestras excursiones o ponerte en contacto con nosotros si tienes alguna pregunta específica.
                         </p>
                    </>
                )}

            </article>
            <div className="text-center mt-10">
              <Button asChild>
                <Link href="/?tab=destinos">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Volver a Destinos
                </Link>
              </Button>
            </div>
        </CardContent>
      </Card>

    </div>
  );
}
    