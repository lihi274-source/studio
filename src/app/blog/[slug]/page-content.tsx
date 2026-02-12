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
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

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
                renderedContent.push(<ul key={`ul-${index}`} className="list-disc list-inside space-y-2 my-4">{currentList}</ul>);
                currentList = [];
            }
            if (line) renderedContent.push(line);
        }
    });

    if (currentList.length > 0) {
        renderedContent.push(<ul key="ul-last" className="list-disc list-inside space-y-2 my-4">{currentList}</ul>);
    }

    return <>{renderedContent}</>;
};

export default function BlogPostPageComponent({ slug }: { slug: string }) {
  const { locale } = useLocale();
  const t = translations[locale];
  
  const post = PlaceHolderImages.find(p => p.id === slug);

  if (!post) {
    notFound();
  }

  const title = getLocalized(post, 'title', locale);
  const description = getLocalized(post, 'description', locale);
  const details = getLocalized(post, 'details', locale);

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <div className="mb-8">
        <Button asChild variant="outline">
          <Link href="/blog">
            <ArrowLeft className="mr-2 h-4 w-4" />
            {t.blog.back}
          </Link>
        </Button>
      </div>

      <Card className="overflow-hidden shadow-lg border-primary/20">
        <div className="relative w-full h-80 md:h-[450px] overflow-hidden group bg-muted">
          {post.images && post.images.length > 0 ? (
            <Carousel className="w-full h-full" opts={{ loop: true }}>
              <CarouselContent className="h-full ml-0">
                {post.images.map((img, idx) => (
                  <CarouselItem key={idx} className="h-full pl-0 basis-full">
                    <div className="relative w-full h-full">
                      <Image
                        src={img}
                        alt={`${title} ${idx + 1}`}
                        fill
                        unoptimized
                        className="object-cover"
                      />
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="left-4 opacity-0 group-hover:opacity-100 transition-opacity bg-black/40 hover:bg-black/60 border-none text-white z-10" />
              <CarouselNext className="right-4 opacity-0 group-hover:opacity-100 transition-opacity bg-black/40 hover:bg-black/60 border-none text-white z-10" />
            </Carousel>
          ) : post.imageUrl ? (
              <Image
                src={post.imageUrl}
                alt={title}
                fill
                className="object-cover"
                data-ai-hint={post.imageHint}
              />
          ) : null}
          
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />
          <div className="absolute bottom-0 left-0 p-8 md:p-12 pointer-events-none z-10">
            <h1 className="font-headline text-4xl md:text-5xl text-white">
              {title}
            </h1>
          </div>
        </div>
        
        <CardContent className="p-8 md:p-12">
          <article className="prose prose-lg lg:prose-xl dark:prose-invert max-w-none text-foreground">
            <p className="lead text-xl text-muted-foreground mb-8">{description}</p>
            {details ? (
                <DetailsContent content={details} />
            ) : (
                <p className="italic text-muted-foreground">{t.blog.noContent}</p>
            )}
          </article>
        </CardContent>
      </Card>
    </div>
  );
}
