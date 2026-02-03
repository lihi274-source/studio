import { Mistral } from '@mistralai/mistralai';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

const apiKey = process.env.MISTRAL_API_KEY;
const client = new Mistral({ apiKey });

export async function POST(req: Request) {
  try {
    const { message } = await req.json();

    if (!message) {
      return NextResponse.json({ error: "El missatge és requerit." }, { status: 400 });
    }

    if (!apiKey) {
      return NextResponse.json(
        { error: "La clau MISTRAL_API_KEY no està configurada al fitxer .env" },
        { status: 500 }
      );
    }

    const chatResponse = await client.chat.complete({
      model: 'mistral-large-latest',
      messages: [{ role: 'user', content: message }],
    });

    const reply = chatResponse.choices?.[0]?.message?.content || "No s'ha obtingut cap resposta de Mistral.";

    return NextResponse.json({ reply });

  } catch (error: any) {
    console.error('Error a la ruta de Mistral:', error);
    return NextResponse.json(
      { error: "No s'ha pogut connectar amb Mistral AI. Revisa la configuració." },
      { status: 500 }
    );
  }
}
