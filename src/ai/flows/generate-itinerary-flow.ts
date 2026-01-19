'use server';
/**
 * @fileOverview A flow to generate a travel itinerary using AI.
 *
 * - generateItinerary - A function that handles the itinerary generation process.
 * - GenerateItineraryInput - The input type for the generateItinerary function.
 */
import { ai } from '@/ai/genkit';
import { z } from 'zod';

// Export the type, but not the Zod schema object
export type GenerateItineraryInput = {
  destination: string;
  dates: string;
  budget: string;
  interests: string;
};

// Define the schema for internal use in the flow, but DO NOT export it.
const GenerateItineraryInputSchema = z.object({
  destination: z.string().describe('The travel destination.'),
  dates: z.string().describe('The dates of travel.'),
  budget: z.string().describe('The budget for the trip.'),
  interests: z.string().describe('The interests and preferences for the trip.'),
});


const itineraryPrompt = ai.definePrompt({
    name: 'itineraryPrompt',
    input: { schema: GenerateItineraryInputSchema },
    prompt: `Ets un agent de viatges expert. Crea un itinerari de viatge detallat basat en les següents preferències:
- Destí: {{{destination}}}
- Dates: {{{dates}}}
- Pressupost: {{{budget}}}
- Interessos: {{{interests}}}

Proporciona suggeriments de vols, hotels i activitats. Formata la resposta de manera clara i llegible, utilitzant Markdown per a títols i llistes.`,
});

const generateItineraryFlow = ai.defineFlow(
  {
    name: 'generateItineraryFlow',
    inputSchema: GenerateItineraryInputSchema,
    outputSchema: z.string(),
  },
  async (input) => {
    const { text } = await itineraryPrompt(input);
    return text;
  }
);

export async function generateItinerary(
  input: GenerateItineraryInput
): Promise<string> {
  return await generateItineraryFlow(input);
}
