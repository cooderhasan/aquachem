import type { Metadata } from 'next';
import './globals.css';
import ConditionalLayout from '@/components/layout/ConditionalLayout';
import { getSettings } from '@/app/admin/settings/actions';

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings();

  const title = settings?.metaTitle || settings?.siteTitle || 'Aquachems - İnsana ve Doğaya Saygılı Üretim';
  const description = settings?.metaDescription || settings?.description || 'Aquachems, çevre bilinci ve insan sağlığını ön planda tutan kimyasal üretim çözümleri sunar.';
  const keywords = settings?.metaKeywords || 'aquachems, kimyasal, temizlik, dezenfektan, hijyen, endüstriyel temizlik';
  const ogImage = settings?.ogImage || settings?.logo || '/images/og-default.jpg';
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://aquachems.com';

  return {
    title: {
      default: title,
      template: `%s | ${settings?.siteTitle || 'Aquachems'}`,
    },
    description,
    keywords,
    authors: [{ name: 'Aquachems' }],
    creator: 'Aquachems',
    publisher: 'Aquachems',
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
    metadataBase: new URL(siteUrl),
    alternates: {
      canonical: '/',
    },
    openGraph: {
      title,
      description,
      url: siteUrl,
      siteName: settings?.siteTitle || 'Aquachems',
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      locale: 'tr_TR',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImage],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    verification: {
      // Google Search Console verification (admin panelden eklenebilir)
      // google: 'verification-code',
    },
  };
}

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
