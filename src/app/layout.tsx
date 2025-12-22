import type { Metadata } from 'next';
import './globals.css';
import ConditionalLayout from '@/components/layout/ConditionalLayout';
import { getSettings } from '@/app/admin/settings/actions';

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
      <head>
        {settings?.favicon && (
          <link rel="icon" href={settings.favicon} />
        )}
      </head>
      <body className="font-sans antialiased text-slate-600">
        <ConditionalLayout settings={settings}>{children}</ConditionalLayout>
      </body>
    </html>
  );
}

