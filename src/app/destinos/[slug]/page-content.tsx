'use client';

import { Suspense, useState } from 'react';
import { notFound, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowLeft, Bot, Send, Loader2, User, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import ReactMarkdown from 'react-markdown';


// Helper function to parse text with asterisks for bolding
const parseBold = (text: string) => {
  const parts = text.split(/\*{2}(.*?)\*{2}/g);
  return parts.map((part, index) =>
    index % 2 === 1 ? <strong key={index}>{part}</strong> : part
  );
};

// Helper component to render markdown-like text
const DetailsContent = ({ content }: { content: string }) => {
    const lines = content.split('\n').map((line, index) => {
      if (line.startsWith('### ')) {
        return <h3 key={index} className="font-headline text-2xl mt-6 mb-2 text-primary-foreground">{line.substring(4)}</h3>;
      }
      if (line.startsWith('*   ')) {
        return <li key={index} className="mb-2">{parseBold(line.substring(4))}</li>;
      }
      if(line.trim() === '') {
        return null;
      }
      return <p key={index}>{parseBold(line)}</p>;
    });

    const listItems = lines.filter(line => line && line.type === 'li');
    
    let currentList: React.ReactNode[] = [];
    const renderedContent: React.ReactNode[] = [];

    lines.forEach((line, index) => {
        if (line && line.type === 'li') {
            currentList.push(line);
        } else {
            if (currentList.length > 0) {
                renderedContent.push(<ul key={`ul-${index}`} className="list-disc list-inside space-y-2">{currentList}</ul>);
                currentList = [];
            }
            renderedContent.push(line);
        }
    });

    if (currentList.length > 0) {
        renderedContent.push(<ul key="ul-last" className="list-disc list-inside space-y-2">{currentList}</ul>);
    }

    return <>{renderedContent}</>;
};

type Message = {
  role: 'user' | 'assistant';
  content: string;
};

const DestinationChat = ({ destinationTitle }: { destinationTitle: string }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage: Message = { role: 'user', content: input };
    setMessages((prev) => [...prev, userMessage]);
    
    const prompt = `Ets un expert en viatges. Respon a la següent pregunta sobre ${destinationTitle}:\n\n${input}`;
    
    const currentInput = input;
    setInput('');
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/mistral', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: prompt }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Error en la resposta de la xarxa.');

      const assistantMessage: Message = { role: 'assistant', content: data.reply };
      setMessages((prev) => [...prev, assistantMessage]);

    } catch (error: any) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="mt-12 bg-card/80 backdrop-blur-sm border border-primary/10">
        <CardHeader>
            <CardTitle className="font-headline text-2xl flex items-center">
                <Bot className="mr-3 h-7 w-7 text-primary"/>
                Tens preguntes sobre {destinationTitle}?
            </CardTitle>
            <CardDescription>
                Pregunta al nostre assistent virtual sobre aquest destí.
            </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col h-[400px]">
             <ScrollArea className="flex-grow h-0 pr-4 -mr-4">
              <div className="space-y-4">
                {messages.map((message, index) => (
                  <div
                    key={index}
                    className={cn('flex items-start gap-3', message.role === 'user' ? 'justify-end' : 'justify-start')}
                  >
                    {message.role === 'assistant' && (
                      <Avatar className="w-8 h-8 border-2 border-primary"><AvatarFallback>IA</AvatarFallback></Avatar>
                    )}
                    <div className={cn('max-w-md rounded-lg p-3 text-sm', message.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted')}>
                      <ReactMarkdown className="prose prose-sm dark:prose-invert max-w-none">{message.content}</ReactMarkdown>
                    </div>
                     {message.role === 'user' && (
                      <Avatar className="w-8 h-8"><AvatarFallback>TU</AvatarFallback></Avatar>
                    )}
                  </div>
                ))}
                {isLoading && (
                  <div className="flex items-start gap-3"><Avatar className="w-8 h-8 border-2 border-primary"><AvatarFallback>IA</AvatarFallback></Avatar>
                    <div className="max-w-md rounded-lg p-3 bg-muted flex items-center space-x-2">
                        <Loader2 className="h-5 w-5 animate-spin" />
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
             <div className="mt-4">
              <form onSubmit={handleSendMessage} className="flex items-center gap-2">
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Escriu la teva pregunta..."
                  disabled={isLoading}
                />
                <Button type="submit" size="icon" disabled={isLoading || !input.trim()} className="bg-accent hover:bg-accent/90">
                  <Send className="h-5 w-5" /><span className="sr-only">Enviar</span>
                </Button>
              </form>
            </div>
        </CardContent>
    </Card>
  );
}


export default function DestinoPageComponent({ slug }: { slug: string }) {
  const destination = PlaceHolderImages.find(p => p.id === slug);

  if (!destination) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-5xl">
      <div className="relative w-full h-80 md:h-[500px] mb-12 rounded-2xl overflow-hidden shadow-2xl">
        <Image
          src={destination.imageUrl}
          alt={destination.title || destination.imageHint}
          fill
          className="object-cover"
          data-ai-hint={destination.imageHint}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-0 left-0 p-8 md:p-12">
            <h1 className="font-headline text-4xl md:text-6xl text-white">
                {destination.title}
            </h1>
        </div>
      </div>
      
      <Card>
        <CardContent className="p-8 md:p-12">
            <article className="prose prose-lg lg:prose-xl dark:prose-invert max-w-none text-foreground">
                <p className="lead text-xl text-muted-foreground">{destination.description}</p>
                
                {destination.details ? (
                    <DetailsContent content={destination.details} />
                ) : (
                    <>
                        <p>
                            Más detalles sobre este destino estarán disponibles próximamente. Estamos trabajando para ofrecerte la mejor información.
                        </p>
                         <p>
                            Mientras tanto, puedes explorar nuestras excursiones o ponerte en contacto con nosotros si tienes alguna pregunta específica.
                         </p>
                    </>
                )}

            </article>
            <div className="text-center mt-10">
              <Button asChild>
                <Link href="/?tab=destinos">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Volver a Destinos
                </Link>
              </Button>
            </div>
        </CardContent>
      </Card>
      
      {destination.title && <DestinationChat destinationTitle={destination.title} />}

    </div>
  );
}