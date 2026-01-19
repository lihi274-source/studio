'use client';

import { notFound } from 'next/navigation';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PlaceHolderImages } from '@/lib/placeholder-images';

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

export default function BlogPostPageComponent({ slug }: { slug: string }) {
  const post = PlaceHolderImages.find(p => p.id === slug);

  if (!post) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <div className="mb-8">
        <Button asChild variant="outline">
          <Link href="/blog">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Tornar al Blog
          </Link>
        </Button>
      </div>

      <Card className="overflow-hidden shadow-lg border-primary/20">
        {post.imageUrl && (
            <div className="relative w-full h-80 md:h-[450px] overflow-hidden">
                <Image
                src={post.imageUrl}
                alt={post.title || post.imageHint}
                fill
                className="object-cover"
                data-ai-hint={post.imageHint}
                />
                 <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                 <div className="absolute bottom-0 left-0 p-8 md:p-12">
                    <h1 className="font-headline text-4xl md:text-6xl text-white">
                        {post.title}
                    </h1>
                </div>
            </div>
        )}
        <CardContent className="p-8 md:p-12">
          <article className="prose prose-lg lg:prose-xl dark:prose-invert max-w-none text-foreground">
            <p className="lead text-xl text-muted-foreground">{post.description}</p>
            {post.details ? (
                <DetailsContent content={post.details} />
            ) : (
                <p>El contingut complet d'aquest article estarà disponible properament.</p>
            )}
          </article>
        </CardContent>
      </Card>
    </div>
  );
}

    