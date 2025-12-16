import MistralClient from '@mistralai/mistralai';
import { NextResponse } from 'next/server';

export const runtime = 'edge';

export async function POST(req: Request) {
  try {
    const { message } = await req.json();

    if (!message) {
      return NextResponse.json({ error: 'El missatge és requerit' }, { status: 400 });
    }

    const mistralApiKey = process.env.MISTRAL_API_KEY;

    if (!mistralApiKey) {
        return NextResponse.json({ error: 'La clau de la API de Mistral no està configurada' }, { status: 500 });
    }

    const client = new MistralClient(mistralApiKey);

    const chatResponse = await client.chat({
      model: 'mistral-small-latest',
      messages: [{ role: 'user', content: message }],
    });

    if (chatResponse.choices && chatResponse.choices.length > 0) {
      const reply = chatResponse.choices[0].message.content;
      return NextResponse.json({ reply });
    } else {
      return NextResponse.json({ error: 'No s\'ha rebut cap resposta de l\'assistent' }, { status: 500 });
    }
  } catch (error) {
    console.error('Error a la ruta de Mistral:', error);
    return NextResponse.json({ error: 'Error intern del servidor al processar la sol·licitud.' }, { status: 500 });
  }
}
