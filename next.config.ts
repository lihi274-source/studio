
import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  // Esto es lo que soluciona el error de "s(...) is not a constructor"
  serverExternalPackages: ['@mistralai/mistralai', 'genkit', '@genkit-ai/core', '@genkit-ai/ai'],
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'www.shutterstock.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'cdn-imgix.headout.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'www.gastronomistas.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'www.civitatis.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'www.sortiraparis.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'www.stage-entertainment.es',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'www.renfe.com',
        port: '',
        pathname: '/**',
      }
    ],
  },
};

export default nextConfig;
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Arreglo para el error de Mistral/Genkit
  serverExternalPackages: ['@mistralai/mistralai', 'genkit', '@genkit-ai/core', '@genkit-ai/ai'],
  
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'placehold.co', pathname: '/**' },
      { protocol: 'https', hostname: 'images.unsplash.com', pathname: '/**' },
      { protocol: 'https', hostname: 'picsum.photos', pathname: '/**' },
      { protocol: 'https', hostname: 'www.shutterstock.com', pathname: '/**' },
      { protocol: 'https', hostname: 'cdn-imgix.headout.com', pathname: '/**' },
      { protocol: 'https', hostname: 'res.cloudinary.com', pathname: '/**' },
      { protocol: 'https', hostname: 'www.gastronomistas.com', pathname: '/**' },
      { protocol: 'https', hostname: 'www.civitatis.com', pathname: '/**' },
      { protocol: 'https', hostname: 'www.sortiraparis.com', pathname: '/**' },
      { protocol: 'https', hostname: 'www.stage-entertainment.es', pathname: '/**' },
      { protocol: 'https', hostname: 'www.renfe.com', pathname: '/**' }
    ],
  },
};

export default nextConfig;

    
    
