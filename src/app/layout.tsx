import type { Metadata } from 'next';
import { Ubuntu } from 'next/font/google';
import './globals.css';
import ConditionalLayout from '@/components/layout/ConditionalLayout';
import { getSettings } from '@/app/admin/settings/actions';
import { getMainContactLocation } from '@/app/admin/contact/actions';

const ubuntu = Ubuntu({
  subsets: ['latin'],
  weight: ['300', '400', '500', '700'],
  variable: '--font-ubuntu',
});

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

  // Fetch verified main contact location (İç Anadolu or similar)
  const contactLocation = await getMainContactLocation();

  return (
    <html lang="tr">
      <head>
        {settings?.favicon && (
          <link rel="icon" href={settings.favicon} />
        )}
      </head>
      <body className={`${ubuntu.variable} font-sans antialiased text-slate-600`}>
        <ConditionalLayout settings={settings} contactLocation={contactLocation}>{children}</ConditionalLayout>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              "name": settings?.siteTitle || "Aquachems",
              "url": process.env.NEXT_PUBLIC_SITE_URL || "https://aquachems.com",
              "logo": settings?.logo || (process.env.NEXT_PUBLIC_SITE_URL ? `${process.env.NEXT_PUBLIC_SITE_URL}/images/logo.png` : ""),
              "contactPoint": {
                "@type": "ContactPoint",
                "telephone": contactLocation?.phone || "",
                "contactType": "customer service",
                "areaServed": "TR",
                "availableLanguage": "Turkish"
              },
              "address": {
                "@type": "PostalAddress",
                "streetAddress": contactLocation?.address || "",
                "addressLocality": contactLocation?.city || "",
                "postalCode": contactLocation?.postalCode || "",
                "addressCountry": "TR"
              },
              "sameAs": [
                settings?.facebookUrl,
                settings?.twitterUrl,
                settings?.linkedinUrl,
                settings?.instagramUrl
              ].filter(Boolean)
            })
          }}
        />
      </body>
    </html>
  );
}

