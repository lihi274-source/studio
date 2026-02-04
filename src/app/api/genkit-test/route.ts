import { ai } from '@/ai/genkit'; 
import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

export async function POST(req: Request) {
  try {
    const { message } = await req.json();

    if (!message) {
      return NextResponse.json({ error: "Falten dades del viatge." }, { status: 400 });
    }

    const response = await ai.generate({
      prompt: `Ets l'expert de Viajes HICA. Genera un itinerari detallat per: ${message}. 
               Respon en un format Markdown bonic i amable.`,
    });

    return NextResponse.json({ reply: response.text });

  } catch (error: any) {
    console.error('Error API:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}