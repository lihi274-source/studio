import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const PromocionesTab = () => {
    return (
        <div className="mt-6">
            <Card className="border-2 border-primary/20 shadow-lg">
                <CardHeader>
                    <CardTitle className="font-headline text-3xl">Nuestras Promociones</CardTitle>
                    <CardDescription>
                        Aprovecha nuestras ofertas exclusivas para tu próximo viaje.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="text-center py-16 text-muted-foreground">
                        <p>Próximamente tendremos nuevas promociones disponibles.</p>
                        <p className="text-sm">¡Vuelve a visitarnos pronto!</p>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default PromocionesTab;
