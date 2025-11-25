'use server';

/**
 * @fileOverview An AI agent that generates personalized travel itineraries based on user preferences.
 *
 * - generateItinerary - A function that generates a personalized itinerary.
 * - ItineraryInput - The input type for the generateItinerary function.
 * - ItineraryOutput - The return type for the generateItinerary function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ItineraryInputSchema = z.object({
  destination: z.string().describe('The desired travel destination.'),
  dates: z.string().describe('The travel dates or date range.'),
  budget: z.string().describe('The budget for the trip.'),
  interests: z.string().describe('The user interests and preferences for activities.'),
});
export type ItineraryInput = z.infer<typeof ItineraryInputSchema>;

const ItineraryOutputSchema = z.object({
  itinerary: z.string().describe('A detailed travel itinerary based on the user preferences.'),
});
export type ItineraryOutput = z.infer<typeof ItineraryOutputSchema>;

export async function generateItinerary(input: ItineraryInput): Promise<ItineraryOutput> {
  return itineraryGeneratorFlow(input);
}

const itineraryGeneratorPrompt = ai.definePrompt({
  name: 'itineraryGeneratorPrompt',
  input: {schema: ItineraryInputSchema},
  output: {schema: ItineraryOutputSchema},
  prompt: `You are a travel agent specializing in creating personalized travel itineraries.

  Based on the user's preferences below, create a detailed itinerary including suggested flights, hotels, and activities.

  Destination: {{{destination}}}
  Dates: {{{dates}}}
  Budget: {{{budget}}}
  Interests: {{{interests}}}
  `,
});

const itineraryGeneratorFlow = ai.defineFlow(
  {
    name: 'itineraryGeneratorFlow',
    inputSchema: ItineraryInputSchema,
    outputSchema: ItineraryOutputSchema,
  },
  async input => {
    const {output} = await itineraryGeneratorPrompt(input);
    return output!;
  }
);
