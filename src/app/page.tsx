'use client';

import { Suspense, useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Hotel, Map, Plane, Globe, Bot } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import VuelosTab from '@/components/tabs/vuelos-tab';
import HotelesTab from '@/components/tabs/hoteles-tab';
import ExcursionesTab from '@/components/tabs/excursiones-tab';
import DestinosTab from '@/components/tabs/destinos-tab';
import ItineraryGeneratorTab from '@/components/tabs/itinerary-generator-tab';
import { useLocale } from '@/contexts/locale-context';
import { translations } from '@/lib/translations';

function HomePageContent() {
  const searchParams = useSearchParams();
  const initialTab = searchParams.get('tab') || 'destinos';
  const [activeTab, setActiveTab] = useState(initialTab);
  const { locale } = useLocale();
  const t = translations[locale];

  // When the query param changes, update the state
  useEffect(() => {
    const tabFromUrl = searchParams.get('tab');
    if (tabFromUrl && tabFromUrl !== activeTab) {
      setActiveTab(tabFromUrl);
    }
  }, [searchParams, activeTab]);

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3 md:grid-cols-5 h-auto bg-card rounded-lg border-2 border-foreground/10 p-1 shadow-md">
            <TabsTrigger value="destinos" className="py-2.5 text-sm md:text-base text-accent data-[state=active]:text-foreground">
              <Globe className="mr-2 h-5 w-5" />
              {t.home.destinations}
            </TabsTrigger>
            <TabsTrigger value="vuelos" className="py-2.5 text-sm md:text-base text-accent data-[state=active]:text-foreground">
              <Plane className="mr-2 h-5 w-5" />
              {t.home.flights}
            </TabsTrigger>
            <TabsTrigger value="hoteles" className="py-2.5 text-sm md:text-base text-accent data-[state=active]:text-foreground">
              <Hotel className="mr-2 h-5 w-5" />
              {t.home.hotels}
            </TabsTrigger>
            <TabsTrigger value="excursiones" className="py-2.5 text-sm md:text-base text-accent data-[state=active]:text-foreground">
              <Map className="mr-2 h-5 w-5" />
              {t.home.excursions}
            </TabsTrigger>
            <TabsTrigger value="itinerarios" className="py-2.5 text-sm md:text-base sm:col-span-1 md:col-span-1 text-accent data-[state=active]:text-foreground">
              <Bot className="mr-2 h-5 w-5" />
              {t.home.itineraries}
            </TabsTrigger>
          </TabsList>
          <TabsContent value="destinos">
            <DestinosTab />
          </TabsContent>
          <TabsContent value="vuelos">
            <VuelosTab />
          </TabsContent>
          <TabsContent value="hoteles">
            <HotelesTab />
          </TabsContent>
          <TabsContent value="excursiones">
            <ExcursionesTab />
          </TabsContent>
          <TabsContent value="itinerarios">
            <ItineraryGeneratorTab />
          </TabsContent>
        </Tabs>
      </main>
      <Footer />
    </div>
  );
}

export default function Home() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <HomePageContent />
    </Suspense>
  );
}
