import type { Metadata } from 'next';
import { getSettings } from '@/app/admin/settings/actions';
import { getMainContactLocation } from '@/app/admin/contact/actions';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import WhatsAppButton from '@/components/layout/WhatsAppButton';
import { Locale } from '@/lib/i18n';
import { getDictionary } from '@/lib/dictionary';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang: rawLang } = await params;
  const lang = (rawLang === 'en' ? 'en' : 'tr') as Locale;
  const settings = await getSettings();
  const dict = getDictionary(lang);

  const title = lang === 'en' 
    ? (settings?.metaTitleEn || settings?.siteTitleEn || dict.seo.homeTitle) 
    : (settings?.metaTitle || settings?.siteTitle || dict.seo.homeTitle);
    
  const description = lang === 'en' 
    ? (settings?.metaDescriptionEn || settings?.descriptionEn || dict.seo.homeDescription) 
    : (settings?.metaDescription || settings?.description || dict.seo.homeDescription);
    
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
    icons: {
      icon: settings?.favicon || '/favicon.ico',
      shortcut: settings?.favicon || '/favicon.ico',
      apple: settings?.favicon || '/favicon.ico',
    },
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
      canonical: `/${lang}`,
      languages: {
        tr: '/tr',
        en: '/en',
      }
    },
    openGraph: {
      title,
      description,
      url: `${siteUrl}/${lang}`,
      siteName: settings?.siteTitle || 'Aquachems',
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      locale: lang === 'en' ? 'en_US' : 'tr_TR',
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
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang: rawLang } = await params;
  const lang = (rawLang === 'en' ? 'en' : 'tr') as Locale;
  const settings = await getSettings();
  const contactLocation = await getMainContactLocation();
  const dict = getDictionary(lang);

  const whatsappNumber = settings?.whatsappNumber || contactLocation?.phone?.replace(/\D/g, '') || "905551234567";

  return (
    <>
      <Header settings={settings} contactLocation={contactLocation} lang={lang} dict={dict} />
      <main className="flex-1">
        {children}
      </main>
      <Footer settings={settings} contactLocation={contactLocation} lang={lang} dict={dict} />
      <WhatsAppButton phoneNumber={whatsappNumber} />
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
              "availableLanguage": lang === 'en' ? ["Turkish", "English"] : "Turkish"
            },
            "address": {
              "@type": "PostalAddress",
              "streetAddress": contactLocation?.address || "",
              "addressLocality": (contactLocation as any)?.city || "",
              "postalCode": (contactLocation as any)?.postalCode || "",
              "addressCountry": "TR"
            },
            "sameAs": [
              (settings?.socialMedia as any)?.facebook,
              (settings?.socialMedia as any)?.twitter,
              (settings?.socialMedia as any)?.linkedin,
              (settings?.socialMedia as any)?.instagram
            ].filter(Boolean)
          })
        }}
      />
    </>
  );
}
