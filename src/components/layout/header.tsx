'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Menu, Home, Newspaper, User, Info, MessageSquare, PackageSearch, FileText, Languages } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useLocale } from '@/contexts/locale-context';
import { translations } from '@/lib/translations';

const Header = () => {
  const { locale, setLocale } = useLocale();
  const t = translations[locale];

  const navLinks = [
    { href: '/', label: t.nav.home, icon: Home },
    { href: '/about', label: t.nav.about, icon: Info },
    { href: '/blog', label: t.nav.blog, icon: Newspaper },
    { href: '/tracking', label: t.nav.tracking, icon: PackageSearch },
    { href: '/documents', label: t.nav.documents, icon: FileText },
    { href: '/contacto', label: t.nav.contact, icon: MessageSquare },
    { href: '/account', label: t.nav.account, icon: User },
  ];

  return (
    <header className="py-3 md:py-4 bg-transparent backdrop-blur-sm border-b border-border/50 sticky top-0 z-40">
      <div className="flex w-full items-center justify-between px-4 md:px-6 lg:px-10 gap-2">
        <div className="flex items-center min-w-0">
            <Link href="/" className="flex items-center min-w-0">
              <div className="relative w-10 h-10 md:w-16 md:h-16 mr-2 md:mr-3 flex-shrink-0">
                <Image 
                  src="/log.png" 
                  alt="Viajes HICA Logo" 
                  fill
                  className="object-contain"
                />
              </div>
              <div className="min-w-0">
                <h1 className="text-lg md:text-3xl font-headline text-primary-foreground truncate leading-tight">
                  Viajes HICA
                </h1>
                <p className="text-[10px] md:text-sm text-muted-foreground hidden md:block truncate">{t.nav.tagline}</p>
              </div>
            </Link>
        </div>

        <div className="flex items-center gap-1 md:gap-2 flex-shrink-0">
          {/* Selector de Idioma */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-9 w-9 md:h-10 md:w-10 hover:bg-accent/50">
                <Languages className="h-5 w-5 md:h-6 md:h-6 text-primary" />
                <span className="sr-only">Seleccionar idioma</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-44 p-2 bg-card/95 backdrop-blur-md border-primary/20 shadow-xl">
              <div className="px-2 py-2 mb-1 border-b border-border/50">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">{t.nav.langTitle}</p>
              </div>
              <DropdownMenuItem onClick={() => setLocale('es')} className="cursor-pointer py-2 px-3 hover:bg-primary/10 rounded-md transition-colors">
                <span className="text-sm font-medium">Castellano</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setLocale('ca')} className="cursor-pointer py-2 px-3 hover:bg-primary/10 rounded-md transition-colors">
                <span className="text-sm font-medium">Català</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setLocale('en')} className="cursor-pointer py-2 px-3 hover:bg-primary/10 rounded-md transition-colors">
                <span className="text-sm font-medium">English</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setLocale('fr')} className="cursor-pointer py-2 px-3 hover:bg-primary/10 rounded-md transition-colors">
                <span className="text-sm font-medium">Français</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Account Shortcut */}
          <Button asChild variant="ghost" size="icon" className="h-9 w-9 md:h-10 md:w-10 hover:bg-accent/50">
            <Link href="/account">
              <User className="h-5 w-5 md:h-6 md:h-6 text-primary" />
              <span className="sr-only">{t.nav.account}</span>
            </Link>
          </Button>

          {/* Unified Navigation Dropdown (3 lines icon) */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-9 w-9 md:h-10 md:w-10 hover:bg-accent/50">
                <Menu className="h-6 w-6 md:h-8 md:w-8 text-primary" />
                <span className="sr-only">Abrir menú de navegación</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-64 p-2 bg-card/95 backdrop-blur-md border-primary/20 shadow-xl">
              <div className="px-2 py-3 mb-2 border-b border-border/50">
                  <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{t.nav.menuTitle}</p>
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