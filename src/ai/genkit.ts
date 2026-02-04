import { genkit } from 'genkit';
import { mistral } from '@genkit-ai/mistral'; // Cambiado de googleAI a mistral

export const ai = genkit({
  plugins: [
    mistral({ apiKey: process.env.MISTRAL_API_KEY || 'iHZflshkC1szdrco0g6IMrzLuQwjMH4Z' })
  ],
  model: 'mistral/mistral-small-latest', // Usamos el modelo de Mistral
});