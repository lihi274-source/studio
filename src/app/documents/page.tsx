'use client';

import { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Loader2, FileText, ArrowLeft, Printer } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { useLocale } from '@/contexts/locale-context';
import { translations } from '@/lib/translations';

// --- TYPE DEFINITIONS ---
type DocumentLine = {
  num_factura: string;
  data: string;
  usuari: string;
  fpagament: string;
  concepte: string;
  preu_unitari: string;
  unitats: string;
  iva: string;
  dte: string;
  albara: string;
  estat: string;
};

type ClientData = {
  usuari: string;
  rol: string;
  empresa: string;
  fiscalid: string;
  adreca: string;
  telefon: string;
};

type InvoiceTotals = {
  subtotal: number;
  discountAmount: number;
  totalBase: number;
  totalVat: number;
  grandTotal: number;
};

type GroupedInvoice = {
  num_factura: string;
  data: string;
  fpagament: string;
  albara: string;
  client: ClientData;
  lines: DocumentLine[];
  totals: InvoiceTotals;
  estat: string;
};

const StatusBadge = ({ status, t }: { status: string, t: any }) => {
  const isPaid = status?.toLowerCase() === 'pagada' || status?.toLowerCase() === 'paid';
  const label = isPaid ? t.documents.status.paid : t.documents.status.pending;
  return (
    <span className={cn('px-2.5 py-0.5 rounded-full text-xs font-semibold', isPaid ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800')}>
      {label}
    </span>
  );
};

const InvoiceDetail = ({ invoice, t }: { invoice: GroupedInvoice, t: any }) => (
  <div className="bg-white text-black p-4 md:p-8 max-w-[800px] mx-auto print:p-0 print:max-w-none">
    {/* Header Section */}
    <header className="flex justify-between items-start mb-10 border-b-2 border-primary pb-6">
      <div className="flex items-center gap-4">
        <div className="relative w-24 h-24">
          <Image 
            src="/log.png" 
            alt="Viajes HICA Logo" 
            fill 
            className="object-contain"
          />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-primary">Viajes HICA</h2>
          <div className="text-xs text-muted-foreground mt-1 space-y-0.5">
            <p>C/Amposta Nº8 Bajo s/n</p>
            <p>43870 Amposta (Tarragona)</p>
            <p>CIF: B-12345678</p>
            <p>Tel: +34 900 123 456</p>
          </div>
        </div>
      </div>
      <div className="text-right">
        <h1 className="text-4xl font-black uppercase text-primary mb-2 tracking-tighter">{t.documents.invoice}</h1>
        <div className="space-y-1">
          <p className="text-sm font-bold">Nº: <span className="text-foreground">{invoice.num_factura}</span></p>
          <p className="text-sm font-bold">{t.documents.date}: <span className="text-foreground">{new Date(invoice.data).toLocaleDateString()}</span></p>
          <div className="inline-block mt-1">
            <StatusBadge status={invoice.estat} t={t} />
          </div>
        </div>
      </div>
    </header>

    {/* Client Section */}
    <section className="grid grid-cols-2 gap-8 mb-10">
      <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
        <h3 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-2">{t.documents.client}</h3>
        <p className="font-bold text-lg">{invoice.client.empresa || invoice.client.usuari}</p>
        <p className="text-sm mt-1">{invoice.client.adreca}</p>
        {invoice.client.fiscalid && <p className="text-sm font-mono mt-1">NIF/CIF: {invoice.client.fiscalid}</p>}
      </div>
      <div className="flex flex-col justify-end text-right">
        <p className="text-sm font-semibold">{t.documents.payment}:</p>
        <p className="text-sm text-muted-foreground">{invoice.fpagament}</p>
      </div>
    </section>

    {/* Table Section */}
    <section className="mb-10">
      <Table className="border-collapse w-full">
        <TableHeader>
          <TableRow className="bg-slate-100 hover:bg-slate-100 border-y-2 border-slate-200">
            <TableHead className="font-bold text-black">{t.documents.concept}</TableHead>
            <TableHead className="text-right font-bold text-black">{t.documents.price}</TableHead>
            <TableHead className="text-right font-bold text-black">{t.documents.units}</TableHead>
            <TableHead className="text-right font-bold text-black">{t.documents.discount}</TableHead>
            <TableHead className="text-right font-bold text-black">Total</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {invoice.lines.map((line, i) => {
            const p = parseFloat(line.preu_unitari) || 0;
            const u = parseFloat(line.unitats) || 0;
            const d = parseFloat(line.dte) || 0;
            const total = (p * u) * (1 - d/100);
            return (
              <TableRow key={i} className="border-b border-slate-100">
                <TableCell className="py-4 font-medium">{line.concepte}</TableCell>
                <TableCell className="text-right">{p.toFixed(2)} €</TableCell>
                <TableCell className="text-right">{u}</TableCell>
                <TableCell className="text-right">{d.toFixed(2)}%</TableCell>
                <TableCell className="text-right font-semibold">{total.toFixed(2)} €</TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </section>

    {/* Totals Section */}
    <section className="flex justify-end">
      <div className="w-full max-w-xs space-y-3">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">{t.documents.subtotal}</span>
          <span>{invoice.totals.subtotal.toFixed(2)} €</span>
        </div>
        <div className="flex justify-between text-sm text-destructive">
          <span className="text-muted-foreground">{t.documents.totalDiscount}</span>
          <span>- {invoice.totals.discountAmount.toFixed(2)} €</span>
        </div>
        <div className="flex justify-between font-bold border-t pt-2">
          <span>{t.documents.taxBase}</span>
          <span>{invoice.totals.totalBase.toFixed(2)} €</span>
        </div>
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>{t.documents.vat} (21%)</span>
          <span>{invoice.totals.totalVat.toFixed(2)} €</span>
        </div>
        <div className="flex justify-between text-2xl font-black border-t-2 border-primary pt-3 mt-3 text-primary">
          <span>{t.documents.total}</span>
          <span>{invoice.totals.grandTotal.toFixed(2)} €</span>
        </div>
      </div>
    </section>

    <footer className="mt-20 pt-8 border-t border-slate-100 text-[10px] text-muted-foreground text-center">
      <p>Gràcies per confiar en Viajes HICA per a les teves aventures.</p>
      <p className="mt-1">Inscrita en el Registro Mercantil de Tarragona, Tomo 123, Libro 45, Folio 67, Hoja T-890</p>
    </footer>
  </div>
);

export default function DocumentsPage() {
  const { locale } = useLocale();
  const t = translations[locale];
  const router = useRouter();
  const [clients, setClients] = useState<ClientData[]>([]);
  const [documents, setDocuments] = useState<DocumentLine[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [invoiceToPrint, setInvoiceToPrint] = useState<GroupedInvoice | null>(null);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (!userData) { router.push('/account'); return; }
    const user = JSON.parse(userData);
    
    const fetchData = async () => {
      try {
        const cRes = await fetch('https://sheetdb.io/api/v1/reou400435n4c?sheet=usuaris');
        const allClients = await cRes.json();
        setClients(allClients);
        const userInDb = allClients.find((c: any) => c.usuari === user.usuari);
        const role = userInDb?.rol?.toLowerCase() || 'client';
        
        const dUrl = role === 'client' 
          ? `https://sheetdb.io/api/v1/reou400435n4c/search?sheet=documents&usuari=${user.usuari}` 
          : 'https://sheetdb.io/api/v1/reou400435n4c?sheet=documents';
          
        const dRes = await fetch(dUrl);
        const docs = await dRes.json();
        setDocuments(Array.isArray(docs) ? docs : []);
      } catch (err) { 
        console.error(err); 
      } finally { 
        setIsLoading(false); 
      }
    };
    fetchData();
  }, [router]);

  const groupedInvoices = useMemo(() => {
    const map = new Map<string, DocumentLine[]>();
    documents.forEach(d => {
      if (!map.has(d.num_factura)) map.set(d.num_factura, []);
      map.get(d.num_factura)!.push(d);
    });
    
    return Array.from(map.entries()).map(([id, lines]) => {
      const client = clients.find(c => c.usuari === lines[0].usuari) || {} as ClientData;
      let subtotal = 0, discount = 0, totalVat = 0;
      
      lines.forEach(l => {
          const p = parseFloat(l.preu_unitari) || 0, u = parseFloat(l.unitats) || 0, d = parseFloat(l.dte) || 0, v = parseFloat(l.iva) || 0;
          const s = p * u, dis = s * (d/100), base = s - dis;
          subtotal += s; 
          discount += dis; 
          totalVat += base * (v/100);
      });
      
      return { 
        num_factura: id, 
        data: lines[0].data, 
        client, 
        lines, 
        estat: lines[0].estat, 
        fpagament: lines[0].fpagament, 
        totals: { 
          subtotal, 
          discountAmount: discount, 
          totalBase: subtotal - discount, 
          totalVat,
          grandTotal: subtotal - discount + totalVat 
        } 
      } as GroupedInvoice;
    });
  }, [documents, clients]);

  useEffect(() => { 
    if (invoiceToPrint) { 
      // Delay to ensure the DOM is updated for the print area
      setTimeout(() => { 
        window.print(); 
        setInvoiceToPrint(null); 
      }, 300); 
    } 
  }, [invoiceToPrint]);

  if (isLoading) return <div className="flex h-64 justify-center items-center"><Loader2 className="animate-spin h-16 w-16 text-primary" /></div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-start">
        <Button asChild variant="ghost" className="text-primary hover:text-primary/80 font-bold">
          <Link href="/dashboard">
            <ArrowLeft className="mr-2 h-4 w-4" />
            {locale === 'ca' ? 'Tornar al Perfil' : locale === 'en' ? 'Back to Profile' : locale === 'fr' ? 'Retour au Profil' : 'Volver al Perfil'}
          </Link>
        </Button>
      </div>

      <Card className="border-2 border-primary/20 shadow-xl overflow-hidden">
        <CardHeader className="bg-primary/5 border-b border-primary/10">
          <CardTitle className="font-headline text-4xl flex items-center gap-4 text-primary-foreground">
            <FileText className="h-10 w-10" />
            {t.documents.title}
          </CardTitle>
          <CardDescription className="text-lg">{t.documents.subtitle}</CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          {groupedInvoices.length === 0 ? (
            <div className="text-center py-16">
              <FileText className="h-16 w-16 mx-auto text-muted-foreground opacity-20 mb-4" />
              <p className="text-xl text-muted-foreground font-medium">{t.documents.empty}</p>
            </div>
          ) : (
            <Accordion type="single" collapsible className="w-full space-y-4">
              {groupedInvoices.map(invoice => (
                <AccordionItem 
                  value={invoice.num_factura} 
                  key={invoice.num_factura}
                  className="border rounded-lg px-4 bg-card hover:bg-slate-50/50 transition-colors"
                  data-id="documents-accordion-item"
                >
                  <AccordionTrigger className="hover:no-underline py-6">
                    <div className="flex justify-between items-center w-full pr-4 gap-4">
                      <div className="text-left">
                        <p className="font-bold text-lg text-primary">{t.documents.invoice} #{invoice.num_factura}</p>
                        <p className="text-sm text-muted-foreground">{new Date(invoice.data).toLocaleDateString()}</p>
                      </div>
                      <div className="flex items-center gap-6">
                        <StatusBadge status={invoice.estat} t={t} />
                        <p className="font-black text-2xl text-primary">{invoice.totals.grandTotal.toFixed(2)} €</p>
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="border-t pt-6">
                    <div className="p-4 md:p-8 bg-slate-50 rounded-xl">
                      <div className="flex justify-end mb-6">
                        <Button 
                          onClick={() => setInvoiceToPrint(invoice)} 
                          className="bg-accent hover:bg-accent/90 text-accent-foreground font-bold"
                        >
                          <Printer className="mr-2 h-4 w-4" />
                          {t.documents.print}
                        </Button>
                      </div>
                      <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">
                        <InvoiceDetail invoice={invoice} t={t} />
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          )}
        </CardContent>
      </Card>

      {/* Hidden area for printing - This ensures high quality print output */}
      <div className="hidden print:block print-area">
        {invoiceToPrint && (
          <div id="zona-factura">
            <InvoiceDetail invoice={invoiceToPrint} t={t} />
          </div>
        )}
      </div>
    </div>
  );
}
