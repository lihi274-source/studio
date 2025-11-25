import { Compass } from 'lucide-react';

const Header = () => {
  return (
    <header className="py-6 bg-background/80 backdrop-blur-sm border-b border-border/50 sticky top-0 z-40">
      <div className="container mx-auto flex flex-col items-center justify-center text-center">
        <div className="flex items-center">
            <Compass className="h-8 w-8 mr-4 text-primary" />
            <h1 className="text-4xl font-headline text-primary-foreground">
              Viajes Explorador
            </h1>
        </div>
        <nav className="mt-4">
          <ul className="flex space-x-8">
            <li><a href="#" className="text-lg text-foreground hover:text-primary transition-colors">Inicio</a></li>
            <li><a href="#" className="text-lg text-foreground hover:text-primary transition-colors">Sobre nosotros</a></li>
            <li><a href="#" className="text-lg text-foreground hover:text-primary transition-colors">BLOG</a></li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
