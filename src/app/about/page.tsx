'use client';

import { ArrowLeft, Users, Globe, Goal, Rocket } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useLocale } from '@/contexts/locale-context';
import { translations } from '@/lib/translations';

export default function AboutPage() {
  const { locale } = useLocale();
  const t = translations[locale];
  
  const creationYear = 2023;
  const currentYear = new Date().getFullYear();
  const yearsOfExperience = currentYear - creationYear;
  
  return (
    <div className="container mx-auto px-4 py-12 max-w-5xl">
      <div className="text-center mb-12">
        <h1 className="font-headline text-4xl md:text-6xl text-primary-foreground mb-4">
          {t.about.title}
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
          {t.about.subtitle}
        </p>
        <div className="mt-8">
            <Button asChild size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground">
                <Link href="/?tab=excursiones">
                    <Rocket className="mr-2 h-5 w-5" />
                    {t.about.button}
                </Link>
            </Button>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-8 text-center mb-16">
        <div className="bg-card p-6 rounded-lg shadow-lg">
          <Users className="h-12 w-12 text-accent mx-auto mb-4" />
          <h3 className="font-headline text-2xl text-primary-foreground">{t.about.team}</h3>
          <p className="text-muted-foreground">{t.about.teamDesc}</p>
        </div>
        <div className="bg-card p-6 rounded-lg shadow-lg">
          <Globe className="h-12 w-12 text-accent mx-auto mb-4" />
          <h3 className="font-headline text-2xl text-primary-foreground">{t.about.global}</h3>
          <p className="text-muted-foreground">{t.about.globalDesc}</p>
        </div>
        <div className="bg-card p-6 rounded-lg shadow-lg">
          <Goal className="h-12 w-12 text-accent mx-auto mb-4" />
          <h3 className="font-headline text-2xl text-primary-foreground">{t.about.mission}</h3>
          <p className="text-muted-foreground">{t.about.missionDesc}</p>
        </div>
      </div>
        
      <article className="prose prose-lg lg:prose-xl dark:prose-invert max-w-none text-foreground bg-card p-8 md:p-12 rounded-2xl shadow-lg">
        <h2 className="font-headline text-3xl md:text-4xl text-primary-foreground">{t.about.articleTitle}</h2>
        <p>{t.about.articleP1}</p>
        
        <h3 className="font-headline text-2xl md:text-3xl text-primary-foreground mt-10 mb-4">{t.about.articleH1}</h3>
        <p>{t.about.articleP2}</p>

        <blockquote className="border-l-4 border-accent bg-accent/10 p-4 my-8">
          <p className="text-accent-foreground font-semibold">
            "{t.about.quote}"
          </p>
        </blockquote>
        
        <h3 className="font-headline text-2xl md:text-3xl text-primary-foreground mt-10 mb-4">{t.about.articleH2}</h3>
        <p>{t.about.articleP3}</p>
        <div className="text-center mt-10">
          <Button asChild style={{ backgroundColor: '#222538', color: 'white' }}>
            <Link href="/">
              <ArrowLeft className="mr-2 h-4 w-4" />
              {t.about.back}
            </Link>
          </Button>
        </div>
      </article>
    </div>
  );
}
