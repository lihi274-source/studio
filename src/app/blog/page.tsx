import { ArrowRight, Calendar, Tag } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PlaceHolderImages } from '@/lib/placeholder-images';

const featuredPost = PlaceHolderImages.find(p => p.id === 'blog-featured');
const tip1 = PlaceHolderImages.find(p => p.id === 'blog-tip1');
const tip2 = PlaceHolderImages.find(p => p.id === 'blog-tip2');

export default function BlogPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      {/* Featured Post */}
      {featuredPost && (
        <section className="mb-16 bg-card p-6 md:p-8 rounded-2xl shadow-xl border border-primary/10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div className="relative w-full h-80 rounded-lg overflow-hidden">
              <Image
                src={featuredPost.imageUrl}
                alt={featuredPost.title || featuredPost.imageHint}
                fill
                className="object-cover"
                data-ai-hint={featuredPost.imageHint}
              />
            </div>
            <div className="text-foreground">
              <div className="flex items-center space-x-4 text-sm text-muted-foreground mb-3">
                  <div className="flex items-center">
                      <Tag className="mr-2 h-4 w-4" />
                      <span>Destinos</span>
                  </div>
                  <div className="flex items-center">
                      <Calendar className="mr-2 h-4 w-4" />
                      <span>{new Date().toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                  </div>
              </div>
              <h1 className="font-headline text-3xl md:text-4xl text-primary-foreground mb-4">
                {featuredPost.title}
              </h1>
              <p className="text-muted-foreground mb-6">
                {featuredPost.description}
              </p>
              <Button asChild className="bg-accent hover:bg-accent/90 text-accent-foreground">
                <Link href="#">
                  Leer más <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </section>
      )}

      {/* Consejos Section */}
      <section>
        <h2 className="font-headline text-3xl text-center text-primary-foreground mb-10">Consejos para tu Viaje</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {tip1 && (
            <Card className="flex flex-col overflow-hidden transition-transform duration-300 hover:scale-105 hover:shadow-2xl">
              <div className="relative w-full h-60">
                <Image
                  src={tip1.imageUrl}
                  alt={tip1.title || tip1.imageHint}
                  fill
                  className="object-cover"
                  data-ai-hint={tip1.imageHint}
                />
              </div>
              <CardHeader>
                <CardTitle className="font-headline text-2xl">{tip1.title}</CardTitle>
              </CardHeader>
              <CardContent className="flex-grow">
                <p className="text-muted-foreground text-sm">{tip1.description}</p>
              </CardContent>
              <div className="p-6 pt-0">
                <Button variant="link" asChild className="p-0 text-primary">
                  <Link href="#">Leer más...</Link>
                </Button>
              </div>
            </Card>
          )}
          {tip2 && (
             <Card className="flex flex-col overflow-hidden transition-transform duration-300 hover:scale-105 hover:shadow-2xl">
                <div className="relative w-full h-60">
                    <Image
                    src={tip2.imageUrl}
                    alt={tip2.title || tip2.imageHint}
                    fill
                    className="object-cover"
                    data-ai-hint={tip2.imageHint}
                    />
                </div>
                <CardHeader>
                    <CardTitle className="font-headline text-2xl">{tip2.title}</CardTitle>
                </CardHeader>
                <CardContent className="flex-grow">
                    <p className="text-muted-foreground text-sm">{tip2.description}</p>
                </CardContent>
                <div className="p-6 pt-0">
                    <Button variant="link" asChild className="p-0 text-primary">
                        <Link href="#">Leer más...</Link>
                    </Button>
                </div>
            </Card>
          )}
        </div>
      </section>
    </div>
  );
}
