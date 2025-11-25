import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export default function BlogPage() {
  const publicationDate = new Date().toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <Link href="/" className="inline-flex items-center text-primary hover:underline mb-8">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Volver al inicio
      </Link>
      
      <article className="bg-card p-6 md:p-10 rounded-lg shadow-lg">
        <div className="relative w-full h-60 md:h-80 mb-8 rounded-lg overflow-hidden">
            <Image
                src="https://www.shutterstock.com/image-photo/commercial-airliner-flying-over-mountains-600nw-2477114069.jpg"
                alt="Avión comercial volando sobre montañas"
                fill
                className="object-cover"
                data-ai-hint="airplane mountains"
            />
        </div>

        <h1 className="font-headline text-3xl md:text-5xl text-primary-foreground mb-4">
          Navegando tus Sueños: Cómo Viajes HICA Facilita tu Próxima Aventura
        </h1>
        <p className="text-muted-foreground text-md md:text-lg mb-8">
          Publicado el {publicationDate}
        </p>
        
        <div className="prose prose-lg lg:prose-xl dark:prose-invert max-w-none text-foreground">
          <p>
            En Viajes HICA, creemos que la planificación de tu viaje debe ser tan emocionante como el viaje en sí. Por eso, hemos diseñado una página web intuitiva y potente, pensada para que encuentres todo lo que necesitas de forma rápida y sencilla. Nuestra misión es eliminar el estrés de la organización para que puedas concentrarte en lo que de verdad importa: soñar con tu próximo destino.
          </p>
          
          <h2 className="font-headline text-2xl md:text-3xl text-primary-foreground mt-10 mb-4">Una Experiencia Centrada en Ti</h2>
          <p>
            Desde el momento en que entras a nuestra web, te encontrarás con una interfaz limpia y clara. Las tres pestañas principales —<strong className="text-primary">Vuelos, Hoteles y Excursiones</strong>— te guían directamente a lo que buscas. No más menús confusos ni opciones interminables. Cada sección está diseñada para ofrecerte la información relevante de manera concisa.
          </p>
          
          <h3 className="font-headline text-xl md:text-2xl text-primary-foreground mt-8 mb-4">Búsquedas Simplificadas</h3>
          <p>
            Nuestros formularios de búsqueda son un claro ejemplo de nuestro compromiso con la simplicidad. Con campos claramente etiquetados, iconos que te guían visualmente y calendarios interactivos, reservar un vuelo o un hotel es cuestión de segundos. Hemos reducido la cantidad de clics necesarios para que pases menos tiempo navegando y más tiempo planificando.
          </p>

          <blockquote className="border-l-4 border-accent bg-accent/10 p-4 my-8">
            <p className="text-accent-foreground font-semibold">
              "Nuestro objetivo es que la tecnología trabaje para ti, no en tu contra. Una buena web es aquella que se siente invisible, permitiéndote alcanzar tus metas sin fricción."
            </p>
          </blockquote>
          
          <h2 className="font-headline text-2xl md:text-3xl text-primary-foreground mt-10 mb-4">Descubre Experiencias Inolvidables</h2>
          <p>
            La pestaña de <strong className="text-primary">Excursiones</strong> es tu ventana a las aventuras que te esperan. Presentamos cada actividad con imágenes de alta calidad, descripciones claras y precios transparentes. El diseño en formato de tarjetas te permite comparar visualmente y elegir la experiencia que más te llame la atención. Con un solo clic en "Reservar ahora", estarás un paso más cerca de vivirla.
          </p>
          <p>
            En Viajes HICA, hemos puesto todo nuestro esfuerzo en crear una plataforma que no solo funcione bien, sino que también te inspire. Tu próxima gran aventura empieza con una experiencia web excepcional. ¡Feliz viaje!
          </p>
        </div>
      </article>
    </div>
  );
}
