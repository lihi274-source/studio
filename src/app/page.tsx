import { Hotel, Map, Plane, Wand2 } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import VuelosTab from '@/components/tabs/vuelos-tab';
import HotelesTab from '@/components/tabs/hoteles-tab';
import ExcursionesTab from '@/components/tabs/excursiones-tab';
import ItineraryGeneratorTab from '@/components/tabs/itinerary-generator-tab';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <Tabs defaultValue="vuelos" className="w-full">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 h-auto md:h-12 bg-primary/10 rounded-lg">
            <TabsTrigger value="vuelos" className="py-2.5 text-sm md:text-base">
              <Plane className="mr-2 h-5 w-5" />
              Vuelos
            </TabsTrigger>
            <TabsTrigger value="hoteles" className="py-2.5 text-sm md:text-base">
              <Hotel className="mr-2 h-5 w-5" />
              Hoteles
            </TabsTrigger>
            <TabsTrigger value="excursiones" className="py-2.5 text-sm md:text-base">
              <Map className="mr-2 h-5 w-5" />
              Excursiones
            </TabsTrigger>
            <TabsTrigger value="generador" className="py-2.5 text-sm md:text-base">
              <Wand2 className="mr-2 h-5 w-5" />
              Generador IA
            </TabsTrigger>
          </TabsList>
          <TabsContent value="vuelos">
            <VuelosTab />
          </TabsContent>
          <TabsContent value="hoteles">
            <HotelesTab />
          </TabsContent>
          <TabsContent value="excursiones">
            <ExcursionesTab />
          </TabsContent>
          <TabsContent value="generador">
            <ItineraryGeneratorTab />
          </TabsContent>
        </Tabs>
      </main>
      <Footer />
    </div>
  );
}
