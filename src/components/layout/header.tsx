import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Menu, Home, Newspaper, User, Info, MessageSquare, PackageSearch, FileText } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const navLinks = [
  { href: '/', label: 'Inicio', icon: Home },
  { href: '/about', label: 'Sobre nosotros', icon: Info },
  { href: '/blog', label: 'Blog', icon: Newspaper },
  { href: '/tracking', label: 'Tracking', icon: PackageSearch },
  { href: '/documents', label: 'Documents', icon: FileText },
  { href: '/contacto', label: 'Contacto', icon: MessageSquare },
  { href: '/account', label: 'Mi Cuenta', icon: User },
];

const Header = () => {
  return (
    <header className="py-4 bg-transparent backdrop-blur-sm border-b border-border/50 sticky top-0 z-40">
      <div className="flex w-full items-center justify-between px-6 lg:px-10">
        <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <Image src="/log.png" alt="Viajes HICA Logo" width={200} height={200} className="mr-3" />
              <div>
                <h1 className="text-2xl md:text-3xl font-headline text-primary-foreground">
                  Viajes HICA
                </h1>
                <p className="text-sm text-muted-foreground hidden sm:block">Tu agencia de viajes para explorar el mundo</p>
              </div>
            </Link>
        </div>

        <div className="flex items-center gap-2">
          {/* Account Shortcut */}
          <Button asChild variant="ghost" size="icon" className="h-10 w-10 hover:bg-accent/50">
            <Link href="/account">
              <User className="h-6 w-6 text-primary" />
              <span className="sr-only">Mi Cuenta</span>
            </Link>
          </Button>

          {/* Unified Navigation Dropdown (3 lines icon) */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-10 w-10 hover:bg-accent/50">
                <Menu className="h-8 w-8 text-primary" />
                <span className="sr-only">Abrir menú de navegación</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-64 p-2 bg-card/95 backdrop-blur-md border-primary/20 shadow-xl">
              <div className="px-2 py-3 mb-2 border-b border-border/50">
                  <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Menú de Navegació</p>
              </div>
              {navLinks.map((link) => (
                <DropdownMenuItem key={link.href} asChild>
                  <Link 
                    href={link.href} 
                    className="flex items-center cursor-pointer py-3 px-4 rounded-md transition-colors hover:bg-primary/10 hover:text-primary focus:bg-primary/10 focus:text-primary"
                  >
                    <link.icon className="mr-3 h-5 w-5" />
                    <span className="text-base font-medium">{link.label}</span>
                  </Link>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};

export default Header;
