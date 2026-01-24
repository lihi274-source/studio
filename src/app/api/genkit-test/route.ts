import { ai } from '@/ai/genkit';
import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

export async function POST(req: Request) {
  try {
    const { message } = await req.json();

    if (!message) {
      return NextResponse.json({ error: "El missatge és requerit." }, { status: 400 });
    }

    const prompt = `Ets un assistent virtual. Respon de manera breu i útil. La pregunta és: "${message}"`;
    const response = await ai.generate({ prompt });
    const reply = response.text;

    return NextResponse.json({ reply });

  } catch (error: any) {
    console.error('Error en /api/genkit-test:', error);
    return NextResponse.json({ error: "No s'ha pogut contactar amb l'assistent d'IA." }, { status: 500 });
  }
}
