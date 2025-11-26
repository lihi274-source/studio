import Image from 'next/image';
import Link from 'next/link';

const Header = () => {
  return (
    <header className="py-6 bg-background/80 backdrop-blur-sm border-b border-border/50 sticky top-0 z-40">
      <div className="container mx-auto flex flex-col items-center justify-center text-center">
        <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <Image src="/logo.png" alt="Viajes HICA Logo" width={40} height={40} className="mr-4" />
              <h1 className="text-4xl font-headline text-primary-foreground">
                Viajes HICA
              </h1>
            </Link>
        </div>
        <nav className="mt-4">
          <ul className="flex space-x-8">
            <li><Link href="/" className="text-lg text-foreground hover:text-primary transition-colors">Inicio</Link></li>
            <li><a href="#" className="text-lg text-foreground hover:text-primary transition-colors">Sobre nosotros</a></li>
            <li><Link href="/blog" className="text-lg text-foreground hover:text-primary transition-colors">BLOG</Link></li>
            <li><Link href="/account" className="text-lg text-foreground hover:text-primary transition-colors">Mi Cuenta</Link></li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
