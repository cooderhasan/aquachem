import type { Metadata } from 'next';
import { Ubuntu, Playfair_Display } from 'next/font/google';
import './globals.css';

// Prevent static pre-rendering at build time (DB is only accessible at runtime)
export const dynamic = 'force-dynamic';

const ubuntu = Ubuntu({
  subsets: ['latin'],
  weight: ['300', '400', '500', '700'],
  variable: '--font-ubuntu',
});

const playfair = Playfair_Display({
  subsets: ['latin'],
  style: ['italic'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-playfair',
});

export const metadata: Metadata = {
  title: 'Aquachems',
  description: 'Aquachems - İnsana ve Doğaya Saygılı Üretim',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html>
      <body className={`${ubuntu.variable} ${playfair.variable} font-sans antialiased text-slate-600`}>
        {children}
      </body>
    </html>
  );
}

