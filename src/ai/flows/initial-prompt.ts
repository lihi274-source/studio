// src/ai/flows/initial-prompt.ts
'use server';

/**
 * @fileOverview A GenAI-powered prompt to help users get started with the itinerary generator.
 *
 * - generateInitialPrompt - A function that generates an initial prompt for the itinerary generator.
 * - InitialPromptInput - The input type for the generateInitialPrompt function.
 * - InitialPromptOutput - The return type for the generateInitialPrompt function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const InitialPromptInputSchema = z.object({
  userPreferences: z.string().describe('The user\u0027s preferences for the trip, including desired destinations, activities, budget, and travel dates.'),
});
export type InitialPromptInput = z.infer<typeof InitialPromptInputSchema>;

const InitialPromptOutputSchema = z.object({
  initialPrompt: z.string().describe('An initial prompt for the itinerary generator based on the user\u0027s preferences.'),
});
export type InitialPromptOutput = z.infer<typeof InitialPromptOutputSchema>;

export async function generateInitialPrompt(input: InitialPromptInput): Promise<InitialPromptOutput> {
  return initialPromptFlow(input);
}

const prompt = ai.definePrompt({
  name: 'initialPromptPrompt',
  input: {schema: InitialPromptInputSchema},
  output: {schema: InitialPromptOutputSchema},
  prompt: `You are an AI assistant designed to help users create travel itineraries. Based on the user's preferences, generate an initial prompt that they can use to start planning their trip.

User Preferences: {{{userPreferences}}}

Initial Prompt:`,
});

const initialPromptFlow = ai.defineFlow(
  {
    name: 'initialPromptFlow',
    inputSchema: InitialPromptInputSchema,
    outputSchema: InitialPromptOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
