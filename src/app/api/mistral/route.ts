'use server';
import MistralClient from '@mistralai/mistralai';
import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

const mistral = new MistralClient(process.env.MISTRAL_API_KEY);

export async function POST(req: Request) {
  try {
    const { message } = await req.json();

    const chatResponse = await mistral.chat({
      model: 'mistral-small-latest',
      messages: [{ role: 'user', content: message }],
    });

    if (chatResponse.choices.length > 0 && chatResponse.choices[0].message.content) {
      const assistantMessage = chatResponse.choices[0].message.content;
      return NextResponse.json({ reply: assistantMessage });
    } else {
      return NextResponse.json({ error: "No s'ha rebut una resposta de l'assistent." }, { status: 500 });
    }
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Error en contactar amb l'API de Mistral." }, { status: 500 });
  }
}
