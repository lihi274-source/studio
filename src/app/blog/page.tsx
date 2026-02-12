
'use client';

import { ArrowRight, Calendar, Tag } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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

export default function BlogPage() {
  const { locale } = useLocale();
  const t = translations[locale];

  const featuredPost = PlaceHolderImages.find(p => p.id === 'blog-featured');
  const tip1 = PlaceHolderImages.find(p => p.id === 'blog-tip1');
  const tip2 = PlaceHolderImages.find(p => p.id === 'blog-tip2');

  return (
    <div 
      className="relative bg-cover bg-center bg-no-repeat min-h-screen"
      style={{ backgroundImage: "url('/fondo.jpg')" }}
    >
      <div className="absolute inset-0 bg-black/60" />
      <div className="relative container mx-auto px-4 py-12">
        <h1 className="font-headline text-4xl md:text-5xl text-white text-center mb-12">
          {t.blog.title}
        </h1>

        {/* Featured Post */}
        {featuredPost && (
          <section className="mb-16 bg-card/80 backdrop-blur-sm p-6 md:p-8 rounded-2xl shadow-xl border border-primary/10">
             <p className="text-xs font-bold uppercase tracking-widest text-accent mb-4">
              {t.blog.featured}
            </p>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div className="relative w-full h-80 rounded-lg overflow-hidden group bg-muted shadow-inner">
                {featuredPost.images && featuredPost.images.length > 0 ? (
                  <Carousel className="w-full h-full" opts={{ loop: true }}>
                    <CarouselContent className="h-80 ml-0 flex">
                      {featuredPost.images.map((img, idx) => (
                        <CarouselItem key={idx} className="h-full pl-0 basis-full flex-shrink-0">
                          <div className="relative w-full h-full">
                            <Image
                              src={img}
                              alt={`${getLocalized(featuredPost, 'title', locale)} ${idx + 1}`}
                              fill
                              unoptimized
                              priority={idx === 0}
                              className="object-cover"
                            />
                          </div>
                        </CarouselItem>
                      ))}
                    </CarouselContent>
                    <CarouselPrevious className="left-4 opacity-0 group-hover:opacity-100 transition-opacity bg-black/40 hover:bg-black/60 border-none text-white z-10" />
                    <CarouselNext className="right-4 opacity-0 group-hover:opacity-100 transition-opacity bg-black/40 hover:bg-black/60 border-none text-white z-10" />
                  </Carousel>
                ) : (
                  <Image
                    src={featuredPost.imageUrl}
                    alt={getLocalized(featuredPost, 'title', locale)}
                    fill
                    unoptimized
                    className="object-cover"
                    data-ai-hint={featuredPost.imageHint}
                  />
                )}
              </div>
              <div className="text-foreground">
                <div className="flex items-center space-x-4 text-sm text-muted-foreground mb-3">
                    <div className="flex items-center">
                        <Tag className="mr-2 h-4 w-4" />
                        <span>{t.blog.destinations}</span>
                    </div>
                    <div className="flex items-center">
                        <Calendar className="mr-2 h-4 w-4" />
                        <span>{new Date().toLocaleDateString(locale === 'en' ? 'en-US' : locale === 'ca' ? 'ca-ES' : 'es-ES', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                    </div>
                </div>
                <h2 className="font-headline text-3xl md:text-4xl text-primary-foreground mb-4">
                  {getLocalized(featuredPost, 'title', locale)}
                </h2>
                <p className="text-muted-foreground mb-6">
                  {getLocalized(featuredPost, 'description', locale)}
                </p>
                <Button asChild className="bg-accent hover:bg-accent/90 text-accent-foreground">
                  <Link href={`/blog/${featuredPost.id}`}>
                    {t.blog.readMore} <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </section>
        )}

        {/* Consejos Section */}
        <section>
          <h2 className="font-headline text-3xl text-center text-white mb-10">{t.blog.tips}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {tip1 && (
              <Card className="flex flex-col overflow-hidden transition-transform duration-300 hover:scale-105 hover:shadow-2xl bg-card/80 backdrop-blur-sm">
                 <div className="relative w-full h-48 overflow-hidden bg-muted">
                   <Image 
                    src={tip1.imageUrl} 
                    alt={getLocalized(tip1, 'title', locale)} 
                    fill 
                    unoptimized
                    className="object-cover" 
                   />
                 </div>
                <CardHeader>
                  <CardTitle className="font-headline text-2xl">{getLocalized(tip1, 'title', locale)}</CardTitle>
                </CardHeader>
                <CardContent className="flex-grow">
                  <p className="text-muted-foreground text-sm">{getLocalized(tip1, 'description', locale)}</p>
                </CardContent>
                <div className="p-6 pt-0">
                  <Button variant="link" asChild className="p-0 text-primary">
                    <Link href={`/blog/${tip1.id}`}>{t.blog.readMore}...</Link>
                  </Button>
                </div>
              </Card>
            )}
            {tip2 && (
               <Card className="flex flex-col overflow-hidden transition-transform duration-300 hover:scale-105 hover:shadow-2xl bg-card/80 backdrop-blur-sm">
                  <div className="relative w-full h-48 overflow-hidden bg-muted">
                   <Image 
                    src={tip2.imageUrl} 
                    alt={getLocalized(tip2, 'title', locale)} 
                    fill 
                    unoptimized
                    className="object-cover" 
                   />
                 </div>
                  <CardHeader>
                      <CardTitle className="font-headline text-2xl">{getLocalized(tip2, 'title', locale)}</CardTitle>
                  </CardHeader>
                  <CardContent className="flex-grow">
                      <p className="text-muted-foreground text-sm">{getLocalized(tip2, 'description', locale)}</p>
                  </CardContent>
                  <div className="p-6 pt-0">
                      <Button variant="link" asChild className="p-0 text-primary">
                          <Link href={`/blog/${tip2.id}`}>{t.blog.readMore}...</Link>
                      </Button>
                  </div>
              </Card>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
