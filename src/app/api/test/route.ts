'use server';
import MistralAI from '@mistralai/mistralai';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  // 1. Llegir la clau des de les variables d'entorn (MAI directament al codi)
  const apiKey = process.env.MISTRAL_API_KEY;

  // 2. Comprovació de seguretat: si la clau no existeix, aturar l'execució.
  if (!apiKey) {
    console.error("MISTRAL_API_KEY no està configurada a les variables d'entorn.");
    return NextResponse.json({ error: "Error de configuració del servidor: Manca la clau d'API." }, { status: 500 });
  }

  try {
    // Esperem un JSON amb la clau "message"
    const { message } = await request.json();

    if (!message) {
        return NextResponse.json({ error: 'El missatge no pot estar buit.' }, { status: 400 });
    }
    
    const fullPrompt = `Ets un assistent virtual. Respon de manera breu i útil. La pregunta és: "${message}"`;

    // --- LOGS DE CONTROL (MOLT ÚTILS PER DEPURAR) ---
    console.log("--- INICI DEPURACIÓ /api/test ---");
    console.log("Intentant connectar amb clau...");
    console.log(`Inici de la clau: ${apiKey.substring(0, 4)}...`);
    console.log(`Llargada de la clau: ${apiKey.length} caràcters`);
    console.log("Full Prompt a enviar a Mistral:", fullPrompt);
    console.log("---------------------------------");

    const client = new MistralAI(apiKey);

    const chatResponse = await client.chat({
      model: 'mistral-small-latest',
      messages: [{ role: 'user', content: fullPrompt }],
    });

    console.log("Resposta rebuda de Mistral!"); 
    // Retornem la resposta amb la clau "reply"
    return NextResponse.json({ reply: chatResponse.choices[0].message.content });
    
  } catch (error: any) {
    // --- GESTIÓ D'ERRORS MILLORADA ---
    console.error("--- ERROR DETALLAT /api/test ---");
    console.error(JSON.stringify(error, null, 2));
    console.error("---------------------------------");

    const errorMessage = error.message.includes('401') 
      ? "Error d'autorització. La clau d'API de Mistral no és vàlida o no té crèdit."
      : "No s'ha pogut contactar amb l'assistent d'IA.";

    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
