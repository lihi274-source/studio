import { Compass } from 'lucide-react';

const Header = () => {
  return (
    <header className="py-6 bg-background/80 backdrop-blur-sm border-b border-border/50 sticky top-0 z-40">
      <div className="container mx-auto flex items-center justify-center text-center">
        <Compass className="h-8 w-8 mr-4 text-primary" />
        <h1 className="text-4xl font-headline text-primary-foreground">
          Viajes Explorador
        </h1>
      </div>
    </header>
  );
};

export default Header;
