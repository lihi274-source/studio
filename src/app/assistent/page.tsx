'use client';

import { useState, useRef, useEffect } from 'react';
import { Bot, Send, User, Loader2, RefreshCcw, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';

type Message = {
  role: 'user' | 'assistant';
  content: string;
};

export default function AssistentPage() {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: 'Hola! Sóc l\'assistent de **Viajes HICA**. Com et puc ajudar avui amb el teu proper viatge?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
    }
  }, [messages, isLoading]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { role: 'user', content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/mistral', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          messages: [...messages, userMessage].map(m => ({ role: m.role, content: m.content })) 
        }),
      });

      const data = await response.json();
      if (data.error) throw new Error(data.error);

      setMessages((prev) => [...prev, { role: 'assistant', content: data.reply }]);
    } catch (error: any) {
      setMessages((prev) => [...prev, { 
        role: 'assistant', 
        content: `Huy! He tingut un problema: ${error.message}. Si us plau, revisa la configuració de la clau API.` 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const resetChat = () => {
    setMessages([{ role: 'assistant', content: 'Hola! Sóc l\'assistent de **Viajes HICA**. Com et puc ajudar avui amb el teu proper viatge?' }]);
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 items-center p-4 md:p-8">
      <div className="w-full max-w-4xl flex justify-between items-center mb-6">
        <Button asChild variant="ghost">
          <Link href="/">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Tornar
          </Link>
        </Button>
        <Button variant="outline" size="sm" onClick={resetChat} className="text-muted-foreground">
          <RefreshCcw className="mr-2 h-4 w-4" />
          Reiniciar xat
        </Button>
      </div>

      <Card className="w-full max-w-4xl h-[75vh] flex flex-col shadow-2xl border-primary/20 bg-white">
        <CardHeader className="border-b bg-primary/5 py-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary rounded-full">
              <Bot className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <CardTitle className="text-xl">Assistent Viatger HICA</CardTitle>
              <CardDescription>Mistral AI al teu servei</CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent className="flex-grow p-0 overflow-hidden">
          <ScrollArea ref={scrollAreaRef} className="h-full p-4 md:p-6">
            <div className="space-y-6">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={cn(
                    'flex items-start gap-3',
                    message.role === 'user' ? 'flex-row-reverse' : 'flex-row'
                  )}
                >
                  <Avatar className={cn(
                    "w-8 h-8",
                    message.role === 'assistant' ? "border-2 border-primary" : ""
                  )}>
                    <AvatarFallback className={message.role === 'assistant' ? "bg-primary/10" : "bg-slate-200"}>
                      {message.role === 'assistant' ? <Bot className="h-4 w-4 text-primary" /> : <User className="h-4 w-4" />}
                    </AvatarFallback>
                  </Avatar>
                  <div
                    className={cn(
                      'max-w-[80%] rounded-2xl p-4 shadow-sm',
                      message.role === 'user'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-slate-100 text-slate-800'
                    )}
                  >
                    <ReactMarkdown className="prose prose-sm dark:prose-invert max-w-none">
                      {message.content}
                    </ReactMarkdown>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex items-start gap-3">
                  <Avatar className="w-8 h-8 border-2 border-primary">
                    <AvatarFallback className="bg-primary/10">
                      <Bot className="h-4 w-4 text-primary" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="max-w-[80%] rounded-2xl p-4 shadow-sm bg-slate-100 flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin text-primary" />
                    <span className="text-sm italic">Escrivint...</span>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>
        </CardContent>

        <CardFooter className="p-4 border-t bg-slate-50">
          <form onSubmit={handleSendMessage} className="flex w-full items-center gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Pregunta'm sobre el teu proper viatge..."
              className="flex-grow bg-white"
              disabled={isLoading}
            />
            <Button type="submit" disabled={isLoading || !input.trim()} className="bg-primary hover:bg-primary/90">
              <Send className="h-5 w-5" />
            </Button>
          </form>
        </CardFooter>
      </Card>
      
      <p className="mt-4 text-xs text-muted-foreground text-center max-w-md">
        Aquest assistent utilitza intel·ligència artificial. Revisa la informació crítica sobre vols i reserves amb el nostre equip humà.
      </p>
    </div>
  );
}
