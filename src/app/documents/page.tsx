'use client';

import { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Loader2, Printer, AlertCircle, FileText, Building, User, Phone, MapPin } from 'lucide-react';
import Image from 'next/image';

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
  [rate: number]: {
    base: number;
    amount: number;
  };
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
};


// --- INVOICE DETAIL COMPONENT (for rendering and printing) ---

const InvoiceDetail = ({ invoice }: { invoice: GroupedInvoice }) => (
  <Card className="shadow-none border-0">
    <CardContent className="p-8 bg-white text-black">
      {/* Header */}
      <header className="flex justify-between items-start mb-8">
        <div className="flex items-center">
          <Image src="/log.png" alt="Viajes HICA Logo" width={150} height={150} />
          <div className="ml-4">
            <h2 className="text-2xl font-bold text-black">Viajes HICA</h2>
            <p className="text-sm">C/Amposta Nº8 Bajo s/n</p>
            <p className="text-sm">contacto@viajeshica.com</p>
            <p className="text-sm">+34 900 123 456</p>
          </div>
        </div>
        <div className="text-right">
          <h1 className="text-3xl font-bold uppercase text-gray-700">Factura</h1>
          <p>
            <span className="font-semibold">Nº:</span> {invoice.num_factura}
          </p>
          <p>
            <span className="font-semibold">Data:</span> {new Date(invoice.data).toLocaleDateString('ca-ES')}
          </p>
          {invoice.albara && <p><span className="font-semibold">Albarà:</span> {invoice.albara}</p>}
        </div>
      </header>

      {/* Client Info */}
      <section className="mb-8">
        <div className="border-t border-b border-gray-300 py-4">
          <h3 className="text-lg font-semibold mb-2">Client:</h3>
          <p className="font-bold">{invoice.client.empresa}</p>
          <p>{invoice.client.fiscalid}</p>
          <p>{invoice.client.adreca}</p>
          <p>Tel: {invoice.client.telefon}</p>
          <p>Email: {invoice.client.usuari}</p>
        </div>
      </section>

      {/* Invoice Lines Table */}
      <section className="mb-8">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-100">
              <TableHead className="w-[50%]">Concepte</TableHead>
              <TableHead className="text-right">P. Unitari</TableHead>
              <TableHead className="text-right">Unitats</TableHead>
              <TableHead className="text-right">Dte.</TableHead>
              <TableHead className="text-right">Total</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {invoice.lines.map((line, index) => {
              const price = parseFloat(line.preu_unitari) || 0;
              const units = parseFloat(line.unitats) || 0;
              const discount = parseFloat(line.dte) || 0;
              const lineTotal = (price * units) * (1 - discount / 100);
              return (
                <TableRow key={index}>
                  <TableCell>{line.concepte}</TableCell>
                  <TableCell className="text-right">{price.toFixed(2)} €</TableCell>
                  <TableCell className="text-right">{units}</TableCell>
                  <TableCell className="text-right">{discount.toFixed(2)} %</TableCell>
                  <TableCell className="text-right">{lineTotal.toFixed(2)} €</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </section>
      
      {/* Totals Section */}
      <section className="flex justify-end mb-8">
        <div className="w-full max-w-sm space-y-2">
            <div className="flex justify-between">
                <span className="font-semibold">Subtotal:</span>
                <span>{invoice.totals.subtotal.toFixed(2)} €</span>
            </div>
            <div className="flex justify-between">
                <span className="font-semibold">Descompte Total:</span>
                <span>- {invoice.totals.discountAmount.toFixed(2)} €</span>
            </div>
            <div className="flex justify-between font-bold border-t pt-2">
                <span className="font-semibold">Base Imposable:</span>
                <span>{invoice.totals.totalBase.toFixed(2)} €</span>
            </div>
             {Object.entries(invoice.totals.vatSummary).map(([rate, { base, amount }]) => (
                 <div key={rate} className="flex justify-between text-sm text-gray-600">
                     <span>Quota {rate}% s/ {base.toFixed(2)} €:</span>
                     <span>{amount.toFixed(2)} €</span>
                 </div>
             ))}
             <div className="flex justify-between text-xl font-bold border-t pt-2 mt-2">
                <span>TOTAL A PAGAR:</span>
                <span>{invoice.totals.grandTotal.toFixed(2)} €</span>
            </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="border-t border-gray-300 pt-4 mt-8 text-xs text-gray-500">
         <div className="mb-4">
            <span className="font-semibold">Forma de pagament:</span> {invoice.fpagament}
        </div>
        <p>Inscrita al Registre Mercantil de [Ciutat], Tom [Número], Foli [Número], Full [Número], Inscripció [Número].</p>
        <p>De conformitat amb el que estableix el Reglament (UE) 2016/679 del Parlament Europeu i del Consell, de 27 d'abril de 2016, relatiu a la protecció de les persones físiques pel que fa al tractament de dades personals i a la lliure circulació d'aquestes dades, l'informem que les seves dades seran incorporades a un fitxer sota la responsabilitat de Viajes HICA per gestionar la present relació comercial.</p>
      </footer>
    </CardContent>
  </Card>
);

// --- MAIN PAGE COMPONENT ---

export default function DocumentsPage() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<LoggedInUser | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [documents, setDocuments] = useState<DocumentLine[]>([]);
  const [clients, setClients] = useState<ClientData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [invoiceToPrint, setInvoiceToPrint] = useState<GroupedInvoice | null>(null);

  // Authentication and Data Fetching
  useEffect(() => {
    let loggedInUser: LoggedInUser | null = null;
    try {
      const userDataString = localStorage.getItem('user');
      if (userDataString) {
        loggedInUser = JSON.parse(userDataString);
        setCurrentUser(loggedInUser);
      } else {
        router.push('/account');
        return;
      }
    } catch (e) {
      console.error("Failed to parse user data", e);
      router.push('/account');
      return;
    }

    if (!loggedInUser) return;

    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // Fetch all clients to get role and fiscal data
        const clientsResponse = await fetch('https://sheetdb.io/api/v1/reou400435n4c?sheet=usuaris');
        const allClients: ClientData[] = await clientsResponse.json();
        setClients(allClients);

        const currentUserData = allClients.find(c => c.usuari === loggedInUser!.usuari);
        const role = currentUserData?.rol.toLowerCase() || 'client';
        setUserRole(role);

        // Fetch documents based on role
        let documentsUrl = 'https://sheetdb.io/api/v1/reou400435n4c?sheet=documents';
        if (role === 'client') {
          documentsUrl = `https://sheetdb.io/api/v1/reou400435n4c/search?sheet=documents&usuari=${loggedInUser.usuari}`;
        }
        
        const documentsResponse = await fetch(documentsUrl);
        const fetchedDocuments: DocumentLine[] = await documentsResponse.json();
        setDocuments(fetchedDocuments);

      } catch (err) {
        setError('No s\'ha pogut carregar la informació. Intenta-ho de nou més tard.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [router]);

  // Invoice processing and grouping
  const groupedInvoices = useMemo((): GroupedInvoice[] => {
    if (!documents.length || !clients.length) return [];

    const invoicesMap = new Map<string, { lines: DocumentLine[], clientName: string }>();

    for (const doc of documents) {
      if (!doc.num_factura) continue;
      
      if (!invoicesMap.has(doc.num_factura)) {
        invoicesMap.set(doc.num_factura, { lines: [], clientName: doc.usuari });
      }
      invoicesMap.get(doc.num_factura)!.lines.push(doc);
    }
    
    return Array.from(invoicesMap.entries()).map(([num_factura, data]) => {
      const firstLine = data.lines[0];
      const clientInfo = clients.find(c => c.usuari === data.clientName) || {} as ClientData;
      
      const vatSummary: VatSummary = {};
      let subtotal = 0;
      let discountAmount = 0;

      data.lines.forEach(line => {
        const price = parseFloat(line.preu_unitari) || 0;
        const units = parseFloat(line.unitats) || 0;
        const discountPercentage = parseFloat(line.dte) || 0;
        const vatRate = parseFloat(line.iva) || 0;

        const lineSubtotal = price * units;
        const lineDiscount = lineSubtotal * (discountPercentage / 100);
        const lineBase = lineSubtotal - lineDiscount;
        const lineVatAmount = lineBase * (vatRate / 100);

        subtotal += lineSubtotal;
        discountAmount += lineDiscount;
        
        if (!vatSummary[vatRate]) {
          vatSummary[vatRate] = { base: 0, amount: 0 };
        }
        vatSummary[vatRate].base += lineBase;
        vatSummary[vatRate].amount += lineVatAmount;
      });

      const totalBase = subtotal - discountAmount;
      const totalVat = Object.values(vatSummary).reduce((acc, curr) => acc + curr.amount, 0);
      const grandTotal = totalBase + totalVat;

      const totals: InvoiceTotals = { subtotal, discountAmount, totalBase, vatSummary, totalVat, grandTotal };

      return {
        num_factura,
        data: firstLine.data,
        fpagament: firstLine.fpagament,
        albara: firstLine.albara,
        client: clientInfo,
        lines: data.lines,
        totals,
      };
    }).sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime());

  }, [documents, clients]);

  // Printing effect
  useEffect(() => {
    if (invoiceToPrint) {
      // Use a short timeout to ensure the DOM is updated before printing
      const timer = setTimeout(() => {
        window.print();
        setInvoiceToPrint(null);
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [invoiceToPrint]);


  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-16 w-16 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  return (
    <div>
        <Card>
            <CardHeader>
                <CardTitle className="font-headline text-4xl flex items-center">
                    <FileText className="mr-4 h-8 w-8 text-primary"/>
                    Els Meus Documents
                </CardTitle>
                <CardDescription>
                    Aquí pots consultar i imprimir les teves factures.
                </CardDescription>
            </CardHeader>
            <CardContent>
                {groupedInvoices.length === 0 ? (
                    <p className="text-muted-foreground text-center py-8">No s'han trobat factures.</p>
                ) : (
                    <Accordion type="single" collapsible className="w-full">
                        {groupedInvoices.map((invoice) => (
                             <AccordionItem value={invoice.num_factura} key={invoice.num_factura}>
                                 <AccordionTrigger>
                                     <div className="flex justify-between items-center w-full pr-4">
                                         <div className="text-left">
                                             <p className="font-bold text-lg text-primary">Factura #{invoice.num_factura}</p>
                                             <p className="text-sm text-muted-foreground">
                                                Data: {new Date(invoice.data).toLocaleDateString('ca-ES')}
                                             </p>
                                         </div>
                                         <div className="text-right">
                                             <p className="font-bold text-xl">{invoice.totals.grandTotal.toFixed(2)} €</p>
                                             {userRole !== 'client' && <p className="text-sm text-muted-foreground">{invoice.client.empresa}</p>}
                                         </div>
                                     </div>
                                 </AccordionTrigger>
                                 <AccordionContent>
                                     <div className="p-4 bg-primary/5 rounded-md">
                                        <div className="flex justify-end mb-4 print:hidden">
                                            <Button onClick={() => setInvoiceToPrint(invoice)} className="bg-accent hover:bg-accent/90 text-accent-foreground">
                                                <Printer className="mr-2 h-4 w-4"/>
                                                Imprimir PDF
                                            </Button>
                                        </div>
                                        <div className="bg-white rounded-lg shadow-md p-2">
                                            <InvoiceDetail invoice={invoice} />
                                        </div>
                                     </div>
                                 </AccordionContent>
                             </AccordionItem>
                        ))}
                    </Accordion>
                )}
            </CardContent>
        </Card>
        
        {/*
          Hidden container for the invoice to be printed.
          It's kept in the DOM but made invisible on screen.
          The print-specific CSS in globals.css will make it visible for printing.
        */}
        <div className="invisible h-0 overflow-hidden">
            {invoiceToPrint && (
                <div id="zona-factura">
                    <InvoiceDetail invoice={invoiceToPrint} />
                </div>
            )}
        </div>
    </div>
  );
}
