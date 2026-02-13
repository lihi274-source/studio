'use client';

import { notFound } from 'next/navigation';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { PlaceHolderImages, getLocalized } from '@/lib/placeholder-images';
import { useLocale } from '@/contexts/locale-context';
import { translations } from '@/lib/translations';

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

    let currentList: React.ReactNode[] = [];
    const renderedContent: React.ReactNode[] = [];

    lines.forEach((line, index) => {
        if (line && line.type === 'li') {
            currentList.push(line);
        } else {
            if (currentList.length > 0) {
                renderedContent.push(<ul key={`ul-${index}`} className="list-disc list-inside space-y-2 mb-4">{currentList}</ul>);
                currentList = [];
            }
            if (line) renderedContent.push(line);
        }
    });

    if (currentList.length > 0) {
        renderedContent.push(<ul key="ul-last" className="list-disc list-inside space-y-2 mb-4">{currentList}</ul>);
    }

    return <>{renderedContent}</>;
};

export default function DestinoPageComponent({ slug }: { slug: string }) {
  const { locale } = useLocale();
  const t = translations[locale];
  
  const destination = PlaceHolderImages.find(p => p.id === slug);

  if (!destination) {
    notFound();
  }

  const title = getLocalized(destination, 'title', locale);
  const description = getLocalized(destination, 'description', locale);
  const details = getLocalized(destination, 'details', locale);

  return (
    <div className="container mx-auto px-4 py-12 max-w-5xl">
      <div className="relative w-full h-80 md:h-[500px] mb-12 rounded-2xl overflow-hidden shadow-2xl">
        <Image
          src={destination.imageUrl}
          alt={title || destination.imageHint}
          fill
          className="object-cover"
          data-ai-hint={destination.imageHint}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-0 left-0 p-8 md:p-12">
            <h1 className="font-headline text-4xl md:text-6xl text-white">
                {title}
            </h1>
        </div>
      </div>
      
      <Card>
        <CardContent className="p-8 md:p-12">
            <article className="prose prose-lg lg:prose-xl dark:prose-invert max-w-none text-foreground">
                <p className="lead text-xl text-muted-foreground mb-8">{description}</p>
                
                {details ? (
                    <DetailsContent content={details} />
                ) : (
                    <div className="space-y-4">
                        <p>{t.destinations.noDetails}</p>
                        <p>{t.destinations.noDetailsSub}</p>
                    </div>
                )}

            </article>
            <div className="text-center mt-10">
              <Button asChild className="bg-primary hover:bg-primary/90 text-primary-foreground">
                <Link href="/?tab=destinos">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  {t.destinations.back}
                </Link>
              </Button>
            </div>
        </CardContent>
      </Card>
    </div>
  );
}