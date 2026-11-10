import type { Metadata } from 'next';
import '../globals.css';
import { bodyClassName } from '../fonts';
import { getSettings } from '@/app/admin/settings/actions';
import { getMainContactLocation } from '@/app/admin/contact/actions';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import WhatsAppButton from '@/components/layout/WhatsAppButton';
import Script from 'next/script';
import { Locale } from '@/lib/i18n';
import { getDictionary } from '@/lib/dictionary';
import { db } from '@/lib/db';
import { categories as categoriesTable } from '@/db/schema';
import { asc } from 'drizzle-orm';
import { SITE_URL, absoluteUrl, getAlternates, jsonLd } from '@/lib/seo';

// Pages are rendered on first request and cached (ISR). Admin actions purge the cache
// with revalidatePath('/', 'layout'), so edits still show up immediately.
export const revalidate = 3600;

// No paths are prerendered at build time (the DB isn't reachable then); each page is rendered
// on its first visit and then served from the ISR cache. Without this, every request hits the DB.
export function generateStaticParams() {
  return [];
}

function resolveLang(rawLang: string): Locale {
  return rawLang === 'en' ? 'en' : 'tr';
}

async function getFooterCategories() {
  try {
    return await db
      .select({ slug: categoriesTable.slug, title: categoriesTable.title, titleEn: categoriesTable.titleEn })
      .from(categoriesTable)
      .orderBy(asc(categoriesTable.order))
      .limit(6);
  } catch (error) {
    console.error('Failed to fetch footer categories:', error);
    return [];
  }
}

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang: rawLang } = await params;
  const lang = resolveLang(rawLang);
  const settings = await getSettings();
  const dict = getDictionary(lang);

  const siteName = (lang === 'en' ? settings?.siteTitleEn : settings?.siteTitle) || settings?.siteTitle || 'Aquachems';

  const title = lang === 'en'
    ? (settings?.metaTitleEn || settings?.siteTitleEn || dict.seo.homeTitle)
    : (settings?.metaTitle || settings?.siteTitle || dict.seo.homeTitle);

  const description = lang === 'en'
    ? (settings?.metaDescriptionEn || settings?.descriptionEn || dict.seo.homeDescription)
    : (settings?.metaDescription || settings?.description || dict.seo.homeDescription);

  const ogImage = absoluteUrl(settings?.ogImage || settings?.logo || '/images/og-default.jpg');

  return {
    title: {
      default: title,
      // Short brand suffix keeps product titles within what Google shows (~60 chars).
      template: `%s | Aquachems`,
    },
    description,
    ...(lang === 'tr' && settings?.metaKeywords ? { keywords: settings.metaKeywords } : {}),
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
    metadataBase: new URL(SITE_URL),
    alternates: getAlternates(lang, '/'),
    openGraph: {
      title,
      description,
      url: `${SITE_URL}/${lang}`,
      siteName,
      images: ogImage ? [{ url: ogImage, width: 1200, height: 630, alt: title }] : [],
      locale: lang === 'en' ? 'en_US' : 'tr_TR',
      alternateLocale: lang === 'en' ? ['tr_TR'] : ['en_US'],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: ogImage ? [ogImage] : [],
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
  const lang = resolveLang(rawLang);
  const [settings, contactLocation, footerCategories] = await Promise.all([
    getSettings(),
    getMainContactLocation(),
    getFooterCategories(),
  ]);
  const dict = getDictionary(lang);

  const whatsappNumber = settings?.whatsappNumber || contactLocation?.phone?.replace(/\D/g, '') || "905551234567";
  const googleAnalyticsId = settings?.googleAnalyticsId || "G-4LRD88KMRC";
  const siteName = (lang === 'en' ? settings?.siteTitleEn : settings?.siteTitle) || settings?.siteTitle || 'Aquachems';
  const social = (settings?.socialMedia as Record<string, string | undefined> | null) || {};

  const organizationLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${SITE_URL}/#organization`,
    "name": siteName,
    "url": SITE_URL,
    "logo": absoluteUrl(settings?.logo || '/images/logo.png'),
    ...(contactLocation?.email ? { "email": contactLocation.email } : {}),
    ...(contactLocation?.phone ? {
      "contactPoint": {
        "@type": "ContactPoint",
        "telephone": contactLocation.phone,
        "contactType": "customer service",
        "availableLanguage": ["Turkish", "English"]
      }
    } : {}),
    ...(contactLocation?.address ? {
      "address": {
        "@type": "PostalAddress",
        "streetAddress": contactLocation.address,
        "addressLocality": (contactLocation as any)?.city || undefined,
        "postalCode": (contactLocation as any)?.postalCode || undefined,
        "addressCountry": "TR"
      }
    } : {}),
    "sameAs": [social.facebook, social.twitter, social.linkedin, social.instagram, social.youtube].filter(Boolean)
  };

  const websiteLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE_URL}/#website`,
    "name": siteName,
    "url": `${SITE_URL}/${lang}`,
    "inLanguage": lang === 'en' ? 'en' : 'tr',
    "publisher": { "@id": `${SITE_URL}/#organization` }
  };

  return (
    <html lang={lang} suppressHydrationWarning>
      <body className={bodyClassName}>
        {googleAnalyticsId && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${googleAnalyticsId}`}
              strategy="afterInteractive"
            />
            <Script id="google-analytics" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${googleAnalyticsId}');
              `}
            </Script>
          </>
        )}
        <Header settings={settings} contactLocation={contactLocation} lang={lang} dict={dict} />
        <main className="flex-1">
          {children}
        </main>
        <Footer settings={settings} contactLocation={contactLocation} lang={lang} dict={dict} categories={footerCategories} />
        <WhatsAppButton phoneNumber={whatsappNumber} />
        <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(organizationLd)} />
        <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(websiteLd)} />
      </body>
    </html>
  );
}
