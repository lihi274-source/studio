import { Mistral } from '@mistralai/mistralai';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

const apiKey = process.env.MISTRAL_API_KEY;
const client = apiKey ? new Mistral({ apiKey }) : null;

export async function POST(req: Request) {
  try {
    if (!client) {
      return NextResponse.json(
        { error: "La MISTRAL_API_KEY no està configurada al servidor." },
        { status: 500 }
      );
    }

    const { messages } = await req.json();

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: "Els missatges són requerits." }, { status: 400 });
    }

    const chatResponse = await client.chat.complete({
      model: 'mistral-small-latest',
      messages: [
        { 
          role: 'system', 
          content: 'Ets l\'assistent virtual expert de Viajes HICA. La teva missió és ajudar els usuaris a planificar els seus viatges, donar informació sobre destinacions i resoldre dubtes sobre la web. Respon sempre de manera amable i professional.' 
        },
        ...messages
      ],
    });

    const reply = chatResponse.choices?.[0]?.message?.content || "No s'ha obtingut resposta.";

    return NextResponse.json({ reply });

  } catch (error: any) {
    console.error('Error en la API de Mistral:', error);
    return NextResponse.json(
      { error: "Error en comunicar amb Mistral AI." },
      { status: 500 }
    );
  }
}
