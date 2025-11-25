'use server';

import { generateItinerary, type ItineraryInput } from '@/ai/flows/itinerary-generator';

export async function generateItineraryAction(input: ItineraryInput) {
  try {
    const result = await generateItinerary(input);
    return { success: true, itinerary: result.itinerary };
  } catch (error) {
    console.error(error);
    return { success: false, error: 'Hubo un error al generar el itinerario. Por favor, inténtalo de nuevo.' };
  }
}
