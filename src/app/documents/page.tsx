'use client';

import { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Loader2, Printer, AlertCircle, FileText } from 'lucide-react';
import Image from 'next/image';
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

type LoggedInUser = {
  usuari: string;
  empresa: string;
};

type VatSummary = {
  [rate: number]: { base: number; amount: number };
};

type InvoiceTotals = {
  subtotal: number;
  discountAmount: number;
  totalBase: number;
  vatSummary: VatSummary;
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
  <Card className="shadow-none border-0">
    <CardContent className="p-8 bg-white text-black">
      <header className="flex justify-between items-start mb-8">
        <div className="flex items-center">
          <Image src="/log.png" alt="Logo" width={150} height={150} />
          <div className="ml-4">
            <h2 className="text-2xl font-bold">Viajes HICA</h2>
            <p className="text-sm">C/Amposta Nº8 Bajo s/n</p>
          </div>
        </div>
        <div className="text-right">
          <h1 className="text-3xl font-bold uppercase">{t.documents.invoice}</h1>
           <div className="flex items-center justify-end gap-4 my-1">
             <p><span className="font-semibold">Nº:</span> {invoice.num_factura}</p>
             <StatusBadge status={invoice.estat} t={t} />
           </div>
          <p><span className="font-semibold">{t.documents.date}:</span> {new Date(invoice.data).toLocaleDateString()}</p>
        </div>
      </header>
      <section className="mb-8 border-y py-4">
        <h3 className="text-lg font-semibold mb-2">{t.documents.client}:</h3>
        <p className="font-bold">{invoice.client.empresa}</p>
        <p>{invoice.client.adreca}</p>
      </section>
      <section className="mb-8">
        <Table>
          <TableHeader><TableRow className="bg-gray-100">
            <TableHead>{t.documents.concept}</TableHead>
            <TableHead className="text-right">{t.documents.price}</TableHead>
            <TableHead className="text-right">{t.documents.units}</TableHead>
            <TableHead className="text-right">{t.documents.discount}</TableHead>
            <TableHead className="text-right">Total</TableHead>
          </TableRow></TableHeader>
          <TableBody>{invoice.lines.map((line, i) => {
              const p = parseFloat(line.preu_unitari) || 0;
              const u = parseFloat(line.unitats) || 0;
              const d = parseFloat(line.dte) || 0;
              const total = (p * u) * (1 - d/100);
              return (<TableRow key={i}>
                  <TableCell>{line.concepte}</TableCell>
                  <TableCell className="text-right">{p.toFixed(2)} €</TableCell>
                  <TableCell className="text-right">{u}</TableCell>
                  <TableCell className="text-right">{d.toFixed(2)} %</TableCell>
                  <TableCell className="text-right">{total.toFixed(2)} €</TableCell>
                </TableRow>);
          })}</TableBody>
        </Table>
      </section>
      <section className="flex justify-end mb-8">
        <div className="w-full max-w-sm space-y-2">
            <div className="flex justify-between"><span>{t.documents.subtotal}:</span><span>{invoice.totals.subtotal.toFixed(2)} €</span></div>
            <div className="flex justify-between"><span>{t.documents.totalDiscount}:</span><span>- {invoice.totals.discountAmount.toFixed(2)} €</span></div>
            <div className="flex justify-between font-bold border-t pt-2"><span>{t.documents.taxBase}:</span><span>{invoice.totals.totalBase.toFixed(2)} €</span></div>
            <div className="flex justify-between text-xl font-bold border-t pt-2 mt-2"><span>{t.documents.total}:</span><span>{invoice.totals.grandTotal.toFixed(2)} €</span></div>
        </div>
      </section>
      <footer className="border-t pt-4 text-xs text-gray-500">
         <p><span className="font-semibold">{t.documents.payment}:</span> {invoice.fpagament}</p>
      </footer>
    </CardContent>
  </Card>
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
        const role = allClients.find((c: any) => c.usuari === user.usuari)?.rol.toLowerCase() || 'client';
        const dUrl = role === 'client' ? `https://sheetdb.io/api/v1/reou400435n4c/search?sheet=documents&usuari=${user.usuari}` : 'https://sheetdb.io/api/v1/reou400435n4c?sheet=documents';
        const dRes = await fetch(dUrl);
        setDocuments(await dRes.json());
      } catch (err) { console.error(err); } finally { setIsLoading(false); }
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
      let subtotal = 0, discount = 0, vat = 0;
      lines.forEach(l => {
          const p = parseFloat(l.preu_unitari) || 0, u = parseFloat(l.unitats) || 0, d = parseFloat(l.dte) || 0, v = parseFloat(l.iva) || 0;
          const s = p * u, dis = s * (d/100), base = s - dis;
          subtotal += s; discount += dis; vat += base * (v/100);
      });
      return { num_factura: id, data: lines[0].data, client, lines, estat: lines[0].estat, fpagament: lines[0].fpagament, totals: { subtotal, discountAmount: discount, totalBase: subtotal - discount, grandTotal: subtotal - discount + vat } };
    });
  }, [documents, clients]);

  useEffect(() => { if (invoiceToPrint) { setTimeout(() => { window.print(); setInvoiceToPrint(null); }, 100); } }, [invoiceToPrint]);

  if (isLoading) return <div className="flex h-64 justify-center items-center"><Loader2 className="animate-spin h-16 w-16" /></div>;

  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle className="font-headline text-4xl flex items-center"><FileText className="mr-4" />{t.documents.title}</CardTitle>
          <CardDescription>{t.documents.subtitle}</CardDescription>
        </CardHeader>
        <CardContent>
          {groupedInvoices.length === 0 ? <p className="text-center py-8">{t.documents.empty}</p> : (
            <Accordion type="single" collapsible className="w-full">
              {groupedInvoices.map(invoice => (
                <AccordionItem value={invoice.num_factura} key={invoice.num_factura}>
                  <AccordionTrigger>
                    <div className="flex justify-between items-center w-full pr-4">
                      <div className="text-left"><p className="font-bold text-primary">{t.documents.invoice} #{invoice.num_factura}</p><p className="text-sm">{new Date(invoice.data).toLocaleDateString()}</p></div>
                      <div className="flex items-center gap-4"><StatusBadge status={invoice.estat} t={t} /><p className="font-bold text-xl">{invoice.totals.grandTotal.toFixed(2)} €</p></div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="p-4 bg-primary/5 rounded-md">
                      <div className="flex justify-end mb-4 print:hidden"><Button onClick={() => setInvoiceToPrint(invoice as any)}>{t.documents.print}</Button></div>
                      <div className="bg-white rounded-lg p-2"><InvoiceDetail invoice={invoice as any} t={t} /></div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          )}
        </CardContent>
      </Card>
      <div className="invisible h-0 overflow-hidden print-area">{invoiceToPrint && <div id="zona-factura"><InvoiceDetail invoice={invoiceToPrint} t={t} /></div>}</div>
    </div>
  );
}
