import Image from 'next/image';
import Link from 'next/link';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Menu, Plane, Hotel, Map, Tag, Globe, Home, Newspaper, User, Info, MessageSquare, PackageSearch } from 'lucide-react';

const navLinks = [
  { href: '/', label: 'Inicio', icon: Home },
  { href: '/about', label: 'Sobre nosotros', icon: Info },
  { href: '/blog', label: 'BLOG', icon: Newspaper },
  { href: '/tracking', label: 'Seguimiento', icon: PackageSearch },
  { href: '/contacto', label: 'Contacto', icon: MessageSquare },
  { href: '/account', label: 'Mi Cuenta', icon: User },
];


const Header = () => {
  return (
    <header className="py-4 bg-transparent backdrop-blur-sm border-b border-border/50 sticky top-0 z-40">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <Image src="/logo-Lidia_Hidalgo.png" alt="Viajes HICA Logo" width={80} height={80} className="mr-3" />
              <div>
                <h1 className="text-2xl md:text-3xl font-headline text-primary-foreground">
                  Viajes HICA
                </h1>
                <p className="text-sm text-muted-foreground hidden sm:block">Tu agencia de viajes para explorar el mundo.</p>
              </div>
            </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex">
          <ul className="flex items-center space-x-6">
            {navLinks.map(link => (
                 <li key={link.href}><Link href={link.href} className="text-base text-foreground hover:text-primary transition-colors">{link.label}</Link></li>
            ))}
          </ul>
        </nav>

        {/* Mobile Navigation */}
        <div className="md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Abrir menú</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <div className="flex flex-col space-y-4 p-4">
                <Link href="/" className="flex items-center mb-4">
                    <Image src="/logo-Lidia_Hidalgo.png" alt="Viajes HICA Logo" width={80} height={80} className="mr-3" />
                    <div>
                        <h2 className="text-2xl font-headline">Viajes HICA</h2>
                        <p className="text-sm text-muted-foreground">Tu agencia de viajes para explorar el mundo.</p>
                    </div>
                </Link>
                <nav>
                    <ul className="space-y-2">
                        {navLinks.map((link) => (
                        <li key={link.href}>
                            <Link
                            href={link.href}
                            className="flex items-center p-2 rounded-md text-lg font-medium text-foreground hover:bg-accent hover:text-accent-foreground"
                            >
                            <link.icon className="mr-3 h-5 w-5" />
                            {link.label}
                            </Link>
                        </li>
                        ))}
                    </ul>
                </nav>
              </div>
            </SheetContent>
          </Sheet>
        </div>

      </div>
    </header>
  );
};

export default Header;
