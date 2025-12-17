'use client';

import { useState } from 'react';
import { Bot, User, Send, Loader, CornerDownLeft, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import ReactMarkdown from 'react-markdown';


type Message = {
  role: 'user' | 'assistant';
  content: string;
};

export default function TestPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage: Message = { role: 'user', content: input };
    setMessages((prev) => [...prev, userMessage]);
    setError(null);
    const currentInput = input;
    setInput('');
    setIsLoading(true);

    try {
      // Cridem a la nostra nova API route unificada
      const response = await fetch('/api/ai/mistral', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: currentInput }), // Enviem només el missatge, la ruta API utilitzarà un prompt per defecte
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'La resposta de la xarxa no ha estat correcta.');
      }

      // Esperem una resposta amb la clau "reply"
      const assistantMessage: Message = { role: 'assistant', content: data.reply };
      setMessages((prev) => [...prev, assistantMessage]);

    } catch (error: any) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
     <div className="absolute top-4 left-4">
        <Button asChild variant="outline">
          <Link href="/">
            <CornerDownLeft className="mr-2 h-4 w-4" />
            Tornar a l'inici
          </Link>
        </Button>
      </div>
      <div className="flex flex-col h-screen bg-background items-center justify-center p-4">
        <Card className="w-full max-w-2xl h-[90vh] flex flex-col shadow-2xl border-primary/20">
          <CardHeader className="text-center">
            <CardTitle className="font-headline text-3xl flex items-center justify-center">
              <Bot className="mr-2 h-8 w-8 text-primary" />
              Pàgina de Test IA
            </CardTitle>
            <CardDescription>
              Aquesta pàgina utilitza /api/ai/mistral per comunicar-se amb la IA.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-grow flex flex-col p-0">
            <ScrollArea className="flex-grow h-0 p-6">
              <div className="space-y-6">
                {messages.map((message, index) => (
                  <div
                    key={index}
                    className={cn(
                      'flex items-start gap-4',
                      message.role === 'user' ? 'justify-end' : 'justify-start'
                    )}
                  >
                    {message.role === 'assistant' && (
                      <Avatar className="w-8 h-8 border-2 border-primary">
                        <AvatarFallback>IA</AvatarFallback>
                      </Avatar>
                    )}
                    <div
                      className={cn(
                        'max-w-md rounded-xl p-3 shadow-md',
                        message.role === 'user'
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-card'
                      )}
                    >
                      <ReactMarkdown className="prose prose-sm dark:prose-invert max-w-none">{message.content}</ReactMarkdown>
                    </div>
                     {message.role === 'user' && (
                      <Avatar className="w-8 h-8">
                        <AvatarFallback>TU</AvatarFallback>
                      </Avatar>
                    )}
                  </div>
                ))}
                {isLoading && (
                  <div className="flex items-start gap-4">
                    <Avatar className="w-8 h-8 border-2 border-primary">
                      <AvatarFallback>IA</AvatarFallback>
                    </Avatar>
                    <div className="max-w-md rounded-xl p-3 shadow-md bg-card flex items-center space-x-2">
                        <Loader className="h-5 w-5 animate-spin" />
                        <p className="text-sm">Pensant...</p>
                    </div>
                  </div>
                )}
                 {error && (
                    <Alert variant="destructive" className="mt-4">
                      <AlertCircle className="h-4 w-4" />
                      <AlertTitle>Error</AlertTitle>
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}
              </div>
            </ScrollArea>
            <div className="p-4 border-t">
              <form onSubmit={handleSendMessage} className="flex items-center gap-2">
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Escriu la teva pregunta aquí..."
                  className="flex-grow"
                  disabled={isLoading}
                />
                <Button type="submit" size="icon" disabled={isLoading || !input.trim()} className="bg-accent hover:bg-accent/90">
                  <Send className="h-5 w-5" />
                  <span className="sr-only">Enviar</span>
                </Button>
              </form>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
