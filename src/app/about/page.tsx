import { ArrowLeft, Users, Globe, Goal, Rocket } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';

export default function AboutPage() {
  const creationYear = 2023;
  const currentYear = new Date().getFullYear();
  const yearsOfExperience = currentYear - creationYear;
  
  return (
    <div className="container mx-auto px-4 py-12 max-w-5xl">
      <div className="text-center mb-12">
        <h1 className="font-headline text-4xl md:text-6xl text-primary-foreground mb-4">
          Viajes HICA
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
          Hacemos que la planificación de tu próxima aventura sea tan emocionante y sencilla como el viaje mismo.
        </p>
        <div className="mt-8">
            <Button asChild size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground">
                <Link href="/?tab=excursiones">
                    <Rocket className="mr-2 h-5 w-5" />
                    RESERVA YA
                </Link>
            </Button>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-8 text-center mb-16">
        <div className="bg-card p-6 rounded-lg shadow-lg">
          <Users className="h-12 w-12 text-accent mx-auto mb-4" />
          <h3 className="font-headline text-2xl text-primary-foreground">Equipo Experto</h3>
          <p className="text-muted-foreground">Apasionados por los viajes y dedicados a crear experiencias únicas para ti.</p>
        </div>
        <div className="bg-card p-6 rounded-lg shadow-lg">
          <Globe className="h-12 w-12 text-accent mx-auto mb-4" />
          <h3 className="font-headline text-2xl text-primary-foreground">Destinos Globales</h3>
          <p className="text-muted-foreground">Ofrecemos una cuidada selección de destinos en todo el mundo.</p>
        </div>
        <div className="bg-card p-6 rounded-lg shadow-lg">
          <Goal className="h-12 w-12 text-accent mx-auto mb-4" />
          <h3 className="font-headline text-2xl text-primary-foreground">Nuestra Misión</h3>
          <p className="text-muted-foreground">Eliminar el estrés de la planificación para que solo te preocupes de disfrutar.</p>
        </div>
      </div>
        
      <article className="prose prose-lg lg:prose-xl dark:prose-invert max-w-none text-foreground bg-card p-8 md:p-12 rounded-2xl shadow-lg">
        <h2 className="font-headline text-3xl md:text-4xl text-primary-foreground">Una Experiencia Centrada en Ti</h2>
        <p>
          En Viajes HICA, creemos que la planificación de tu viaje debe ser tan emocionante como el viaje en sí. Por eso, hemos diseñado una página web intuitiva y potente, pensada para que encuentres todo lo que necesitas de forma rápida y sencilla. Con {yearsOfExperience} años de experiencia, nuestra misión es eliminar el estrés de la organización para que puedas concentrarte en lo que de verdad importa: soñar con tu próximo destino.
        </p>
        
        <h3 className="font-headline text-2xl md:text-3xl text-primary-foreground mt-10 mb-4">Búsquedas Simplificadas</h3>
        <p>
          Nuestros formularios de búsqueda son un claro ejemplo de nuestro compromiso con la simplicidad. Con campos claramente etiquetados, iconos que te guían visualmente y calendarios interactivos, reservar un vuelo o un hotel es cuestión de segundos. Hemos reducido la cantidad de clics necesarios para que pases menos tiempo navegando y más tiempo planificando.
        </p>

        <blockquote className="border-l-4 border-accent bg-accent/10 p-4 my-8">
          <p className="text-accent-foreground font-semibold">
            "Nuestro objetivo es que la tecnología trabaje para ti, no en tu contra. Una buena web es aquella que se siente invisible, permitiéndote alcanzar tus metas sin fricción."
          </p>
        </blockquote>
        
        <h3 className="font-headline text-2xl md:text-3xl text-primary-foreground mt-10 mb-4">Descubre Experiencias Inolvidables</h3>
        <p>
          La pestaña de <Link href="/?tab=excursiones"><strong className="text-primary hover:underline">Excursiones</strong></Link> es tu ventana a las aventuras que te esperan. Presentamos cada actividad con imágenes de alta calidad, descripciones claras y precios transparentes. El diseño en formato de tarjetas te permite comparar visualmente y elegir la experiencia que más te llame la atención. Con un solo clic en "Reservar ahora", estarás un paso más cerca de vivirla.
        </p>
        <p>
          En Viajes HICA, hemos puesto todo nuestro esfuerzo en crear una plataforma que no solo funcione bien, sino que también te inspire. Tu próxima great aventura empieza con una experiencia web excepcional. ¡Feliz viaje!
        </p>
        <div className="text-center mt-10">
          <Button asChild>
            <Link href="/">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Volver al inicio
            </Link>
          </Button>
        </div>
      </article>
    </div>
  );
}
