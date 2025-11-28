import { Mail, Phone, Twitter, Instagram, Facebook } from 'lucide-react';
import Link from 'next/link';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-200">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8">
          
          <div className="lg:col-span-2">
            <h3 className="text-2xl font-headline text-white mb-4">Viajes HICA</h3>
            <p className="text-gray-400 max-w-md">
              Tu agencia de viajes de confianza. Hacemos que la planificación de tu próxima aventura sea emocionante y sencilla. Explora el mundo con nosotros.
            </p>
          </div>

          <div>
            <h4 className="font-bold text-lg text-white mb-4">Contacto</h4>
            <ul className="space-y-3 text-gray-400">
              <li className="flex items-center">
                <Phone className="mr-3 h-5 w-5 text-primary" />
                <a href="tel:+34900123456" className="hover:text-white transition-colors">+34 900 123 456</a>
              </li>
              <li className="flex items-center">
                <Mail className="mr-3 h-5 w-5 text-primary" />
                <a href="mailto:contacto@viajeshica.com" className="hover:text-white transition-colors">contacto@viajeshica.com</a>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-bold text-lg text-white mb-4">Síguenos</h4>
            <div className="flex space-x-4">
              <Link href="#" className="text-gray-400 hover:text-white transition-colors">
                <Twitter className="h-6 w-6" />
                <span className="sr-only">Twitter</span>
              </Link>
              <Link href="#" className="text-gray-400 hover:text-white transition-colors">
                <Facebook className="h-6 w-6" />
                <span className="sr-only">Facebook</span>
              </Link>
              <Link href="#" className="text-gray-400 hover:text-white transition-colors">
                <Instagram className="h-6 w-6" />
                <span className="sr-only">Instagram</span>
              </Link>
            </div>
          </div>
          
        </div>
        <div className="mt-10 pt-8 border-t border-gray-700 text-center text-gray-500">
          <p>&copy; {new Date().getFullYear()} Viajes HICA. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
