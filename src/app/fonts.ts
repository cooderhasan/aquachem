import { Ubuntu, Playfair_Display } from 'next/font/google';

export const ubuntu = Ubuntu({
  subsets: ['latin', 'latin-ext'],
  weight: ['300', '400', '500', '700'],
  variable: '--font-ubuntu',
  display: 'swap',
});

export const playfair = Playfair_Display({
  subsets: ['latin', 'latin-ext'],
  style: ['italic'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-playfair',
  display: 'swap',
});

export const bodyClassName = `${ubuntu.variable} ${playfair.variable} font-sans antialiased text-slate-600`;
