import { genkit } from 'genkit';
import { mistral } from 'genkitx-mistral';

export const ai = genkit({
  plugins: [
    mistral({ apiKey: process.env.MISTRAL_API_KEY || 'iHZflshkC1szdrco0g6IMrzLuQwjMH4Z' })
  ],
  model: 'mistral/mistral-small', 
});