import Footer from "@/components/layout/footer";
import Header from "@/components/layout/header";

export default function DocumentsLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex flex-col min-h-screen bg-background">
            <Header />
            <main className="flex-grow container mx-auto px-4 py-12">
                {children}
            </main>
            <Footer />
        </div>
    );
}
