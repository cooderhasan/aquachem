import type { Metadata } from 'next';
import { locales, defaultLocale, type Locale } from './i18n';

export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || 'https://aquachems.com').replace(/\/+$/, '');
export const SITE_NAME = 'Aquachems';

const OG_LOCALES: Record<Locale, string> = { tr: 'tr_TR', en: 'en_US' };

/** Normalizes a URL/path to an absolute URL on the site. Leaves external URLs untouched. */
export function absoluteUrl(path?: string | null): string | undefined {
    if (!path) return undefined;
    if (/^https?:\/\//i.test(path)) return path;
    return `${SITE_URL}${path.startsWith('/') ? '' : '/'}${path}`;
}

function cleanPath(path: string) {
    if (!path || path === '/') return '';
    return path.startsWith('/') ? path : `/${path}`;
}

/** URL of a page in the given language, e.g. localizedPath('en', '/products') -> '/en/products'. */
export function localizedPath(lang: Locale, path: string, query = '') {
    return `/${lang}${cleanPath(path)}${query}`;
}

/**
 * Canonical + hreflang alternates for a page.
 * `available` lists languages that actually have translated content; untranslated
 * versions are left out of hreflang so Google doesn't treat them as duplicates.
 */
export function getAlternates(
    lang: Locale | string,
    path: string,
    opts: { query?: string; available?: readonly Locale[] } = {}
) {
    const query = opts.query || '';
    const available = opts.available ?? locales;
    const languages: Record<string, string> = {};
    for (const l of available) languages[l] = localizedPath(l, path, query);
    if (available.includes(defaultLocale)) {
        languages['x-default'] = localizedPath(defaultLocale, path, query);
    }
    return {
        canonical: localizedPath(lang as Locale, path, query),
        languages,
    };
}

/** Plain-text meta description: strips markdown/HTML, collapses whitespace, cuts on a word boundary. */
export function toMetaDescription(text?: string | null, max = 160): string | undefined {
    if (!text) return undefined;
    const plain = text
        .replace(/<[^>]+>/g, ' ')
        .replace(/!\[[^\]]*\]\([^)]*\)/g, ' ')
        .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
        .replace(/[#*_`>~|]+/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();
    if (!plain) return undefined;
    if (plain.length <= max) return plain;
    const cut = plain.slice(0, max - 1);
    const lastSpace = cut.lastIndexOf(' ');
    return `${(lastSpace > max * 0.6 ? cut.slice(0, lastSpace) : cut).replace(/[\s,.;:–-]+$/, '')}…`;
}

interface PageMetadataInput {
    lang: Locale;
    path: string;
    title: string;
    description?: string | null;
    images?: (string | null | undefined)[];
    type?: 'website' | 'article';
    query?: string;
    /** Languages that have real (translated) content for this page. Defaults to all. */
    available?: readonly Locale[];
    publishedTime?: string;
}

/** Site-wide share image from admin settings (OG image, else logo). */
async function getDefaultShareImage(): Promise<string | undefined> {
    try {
        const { getSettings } = await import('@/app/admin/settings/actions');
        const settings = await getSettings();
        return settings?.ogImage || settings?.logo || undefined;
    } catch {
        return undefined;
    }
}

/**
 * Full per-page metadata. Child pages must set their own openGraph object because Next
 * replaces (not merges) the parent's openGraph — otherwise og:url would point to the homepage.
 * Pages without their own image fall back to the site-wide share image.
 */
export async function buildPageMetadata({
    lang,
    path,
    title,
    description,
    images = [],
    type = 'website',
    query,
    available = locales,
    publishedTime,
}: PageMetadataInput): Promise<Metadata> {
    const alternates = getAlternates(lang, path, { query, available });
    const url = absoluteUrl(alternates.canonical)!;
    let imageUrls = images.map((i) => absoluteUrl(i)).filter(Boolean) as string[];
    if (!imageUrls.length) {
        const fallback = absoluteUrl(await getDefaultShareImage());
        if (fallback) imageUrls = [fallback];
    }
    const ogTitle = title.includes(SITE_NAME) ? title : `${title} | ${SITE_NAME}`;
    const desc = description || undefined;
    const isUntranslated = !available.includes(lang);

    return {
        title,
        description: desc,
        alternates,
        openGraph: {
            title: ogTitle,
            description: desc,
            url,
            siteName: SITE_NAME,
            locale: OG_LOCALES[lang],
            alternateLocale: available.filter((l) => l !== lang).map((l) => OG_LOCALES[l]),
            type,
            ...(publishedTime ? { publishedTime } : {}),
            ...(imageUrls.length ? { images: imageUrls.map((u) => ({ url: u, alt: title })) } : {}),
        },
        twitter: {
            card: 'summary_large_image',
            title: ogTitle,
            description: desc,
            ...(imageUrls.length ? { images: imageUrls } : {}),
        },
        ...(isUntranslated ? { robots: { index: false, follow: true } } : {}),
    };
}

/** schema.org BreadcrumbList from [name, path] pairs (paths already localized). */
export function breadcrumbJsonLd(items: { name: string; path: string }[]) {
    return {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: items.map((item, i) => ({
            '@type': 'ListItem',
            position: i + 1,
            name: item.name,
            item: absoluteUrl(item.path),
        })),
    };
}

/** Serializes JSON-LD safely for a <script> tag. */
export function jsonLd(data: unknown) {
    return { __html: JSON.stringify(data).replace(/</g, '\\u003c') };
}
