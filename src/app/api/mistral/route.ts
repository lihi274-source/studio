'use server';
import MistralAI from '@mistralai/mistralai';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const apiKey = process.env.MISTRAL_API_KEY;

  if (!apiKey) {
    console.error("MISTRAL_API_KEY no està configurada a les variables d'entorn.");
    return NextResponse.json({ error: "Error de configuració del servidor: Manca la clau d'API." }, { status: 500 });
  }

  try {
    const { message } = await request.json();

    if (!message) {
        return NextResponse.json({ error: 'El missatge no pot estar buit.' }, { status: 400 });
    }
    
    const fullPrompt = `Actua com a expert logístic de l'empresa EnTrans. Parla en català, Sigues corporatiu i breu. La pregunta del client és: "${message}"`;

    console.log("--- INICI DEPURACIÓ MISTRAL ---");
    console.log("Intentant connectar amb clau...");
    console.log(`Inici de la clau: ${apiKey.substring(0, 4)}...`);
    console.log(`Llargada de la clau: ${apiKey.length} caràcters`);
    console.log("Full Prompt a enviar a Mistral:", fullPrompt);
    console.log("----------------------------");

    const client = new MistralAI(apiKey);

    const chatResponse = await client.chat({
      model: 'mistral-small-latest',
      messages: [{ role: 'user', content: fullPrompt }],
    });

    console.log("Resposta rebuda de Mistral!"); 
    return NextResponse.json({ reply: chatResponse.choices[0].message.content });
    
  } catch (error: any) {
    console.error("--- ERROR DETALLAT MISTRAL ---");
    console.error(JSON.stringify(error, null, 2));
    console.error("-------------------------------");

    let errorMessage = "No s'ha pogut contactar amb l'assistent d'IA.";
    const errorString = error.message || '';

    if (errorString.includes('401')) {
      errorMessage = "Error d'autorització (401). La teva clau d'API de Mistral no és vàlida o no té crèdit.";
    } else if (errorString.includes('429')) {
      errorMessage = "S'ha superat el límit de peticions (429). Si us plau, espera un moment abans de tornar-ho a intentar.";
    } else if (errorString.includes('500')) {
      errorMessage = "Error intern del servidor de la IA (500). Prova-ho de nou més tard.";
    } else if (error.code === 'ENOTFOUND' || error.code === 'ECONNRESET') {
      errorMessage = "Error de xarxa. No s'ha pogut connectar amb l'API de Mistral.";
    }

    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
