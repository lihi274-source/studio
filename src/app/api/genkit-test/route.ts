import { ai } from '@/ai/genkit';
import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

export async function POST(req: Request) {
  try {
    const { message } = await req.json();

    if (!message) {
      return NextResponse.json({ error: "Falten dades per generar l'itinerari." }, { status: 400 });
    }

    // Le pedimos a Genkit que genere la respuesta usando tu modelo configurado
    const response = await ai.generate({
      prompt: `Ets l'assistent expert de l'agència "Viajes HICA". 
      
      DADES DEL VIATGE:
      ${message}
      
      INSTRUCCIONS:
      1. Genera un itinerari detallat dia per dia.
      2. Usa un to amable, professional i expert.
      3. Destaca experiències úniques (som especialistes en Japó, Islàndia i Europa).
      4. Respon sempre en Markdown amb negretes i llistes.`,
    });

    return NextResponse.json({ reply: response.text });

  } catch (error: any) {
    console.error('Error en /api/genkit-test:', error);
    return NextResponse.json(
      { error: "Error de connexió amb la IA. Revisa la configuració de Genkit." }, 
      { status: 500 }
    );
  }
}