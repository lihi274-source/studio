const Footer = () => {
  return (
    <footer className="bg-background border-t border-border/50">
      <div className="container mx-auto py-6 text-center text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} Viajes HICA. Todos los derechos reservados.</p>
      </div>
    </footer>
  );
};

export default Footer;
