import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import ConditionalLayout from '@/components/layout/ConditionalLayout';
import { getSettings } from '@/app/admin/settings/actions';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  title: 'Aquachems - İnsana ve Doğaya Saygılı Üretim',
  description: 'Aquachems, çevre bilinci ve insan sağlığını ön planda tutan kimyasal üretim çözümleri sunar.',
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const settings = await getSettings();

  return (
    <html lang="tr">
      <body className={inter.className}>
        <ConditionalLayout settings={settings}>{children}</ConditionalLayout>
      </body>
    </html>
  );
}
