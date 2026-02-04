import { Mistral } from '@mistralai/mistralai';
import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

// Usamos la clave directamente para evitar fallos de configuración
const apiKey = process.env.MISTRAL_API_KEY || 'iHZflshkC1szdrco0g6IMrzLuQwjMH4Z';
const client = new Mistral({ apiKey });

export async function POST(req: Request) {
  try {
    const { message } = await req.json();

    if (!message) {
      return NextResponse.json({ error: "Falten dades per generar l'itinerari." }, { status: 400 });
    }

    // Usamos el cliente directo de Mistral en lugar de Genkit para evitar el error de Google Key
    const chatResponse = await client.chat.complete({
      model: 'mistral-small-latest',
      messages: [
        { 
          role: 'system', 
          content: `Ets l'assistent expert de l'agència "Viajes HICA". 
          INSTRUCCIONS:
          1. Genera un itinerari detallat dia per dia basat en les dades de l'usuari.
          2. Usa un to amable, professional i expert.
          3. Destaca experiències úniques (som especialistes en Japó, Islàndia i Europa).
          4. Respon sempre en Markdown amb negretes i llistes.`
        },
        { role: 'user', content: message }
      ],
    });

    const reply = chatResponse.choices?.[0]?.message?.content || "No s'ha pogut generar una resposta.";

    return NextResponse.json({ reply });

  } catch (error: any) {
    console.error('Error en /api/genkit-test:', error);
    return NextResponse.json(
      { error: "Error de connexió amb Mistral AI directamente." }, 
      { status: 500 }
    );
  }
}