export type Excursion = {
  id: string;
  title: string;
  price: number;
  currency: string;
};

export const excursionsData: Excursion[] = [
  { id: 'tour-paris', title: 'Tour Eiffel y Crucero por el Sena', price: 120, currency: 'EUR' },
  { id: 'tour-rome', title: 'Roma Antigua: Coliseo y Foro', price: 95, currency: 'EUR' },
  { id: 'tour-new-york', title: 'Contrastes de Nueva York', price: 80, currency: 'USD' },
  { id: 'tour-tokyo', title: 'Tradición y Modernidad en Tokio', price: 15000, currency: 'JPY' },
  { id: 'tour-sydney', title: 'Maravillas de Sídney y Playas', price: 110, currency: 'AUD' },
  { id: 'tour-cairo', title: 'Misterios del Antiguo Egipto', price: 75, currency: 'USD' },
  { id: 'tour-portaventura', title: 'PortAventura: Especial Navidad', price: 60, currency: 'EUR' },
  { id: 'tour-caldea', title: 'Relax en Caldea, Andorra', price: 45, currency: 'EUR' },
  { id: 'tour-rey-leon', title: 'El Rey León, El Musical', price: 75, currency: 'EUR' },
  { id: 'tour-valencia', title: 'Oceanogràfic de Valencia', price: 35, currency: 'EUR' },
  { id: 'tour-madrid', title: 'Tour Triángulo del Arte Madrid', price: 50, currency: 'EUR' },
];

export const conversionRates: Record<string, number> = {
    USD: 0.93, // 1 USD = 0.93 EUR
    JPY: 0.0059, // 1 JPY = 0.0059 EUR
    AUD: 0.61, // 1 AUD = 0.61 EUR
    EUR: 1,
};
