import { Mistral } from '@mistralai/mistralai';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

const apiKey = process.env.MISTRAL_API_KEY || 'iHZflshkC1szdrco0g6IMrzLuQwjMH4Z';
const client = new Mistral({ apiKey });

export async function POST(req: Request) {
  try {
    const { message } = await req.json();

    const response = await client.chat.complete({
      model: 'mistral-small-latest',
      messages: [
        { 
          role: 'system', 
          content: 'Ets l\'expert de Viajes HICA. La teva missió és rebre dades d\'un viatge (destí, dates, pressupost) i generar un itinerari detallat i amable en Markdown.' 
        },
        { role: 'user', content: message }
      ],
    });

    return NextResponse.json({ reply: response.choices?.[0]?.message?.content });
  } catch (error) {
    return NextResponse.json({ error: "Error de connexió amb la IA" }, { status: 500 });
  }
}