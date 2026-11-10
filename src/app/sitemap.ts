import { MetadataRoute } from 'next';
import { db } from '@/lib/db';
import { products, categories, posts } from '@/db/schema';
import { SITE_URL, localizedPath } from '@/lib/seo';
import { defaultLocale, type Locale } from '@/lib/i18n';

// Rendered per request (never at build time, when the DB isn't reachable). It's a few small queries.
export const dynamic = 'force-dynamic';

type Entry = MetadataRoute.Sitemap[number];

/**
 * One <url> per available language, each carrying the full hreflang set (incl. x-default),
 * so Google can pair the TR and EN versions straight from the sitemap.
 */
function localizedEntries(
    path: string,
    available: readonly Locale[],
    extra: Omit<Entry, 'url' | 'alternates'> = {}
): Entry[] {
    const languages: Record<string, string> = {};
    for (const l of available) languages[l] = `${SITE_URL}${localizedPath(l, path)}`;
    if (available.includes(defaultLocale)) languages['x-default'] = languages[defaultLocale];

    return available.map((lang) => ({
        url: `${SITE_URL}${localizedPath(lang, path)}`,
        alternates: { languages },
        ...extra,
    }));
}

const BOTH: readonly Locale[] = ['tr', 'en'];
const TR_ONLY: readonly Locale[] = ['tr'];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const entries: MetadataRoute.Sitemap = [];

    // 1. Static pages. No lastModified: a fake "now" date teaches Google to ignore it.
    const staticPages: [string, Entry['changeFrequency'], number][] = [
        ['/', 'daily', 1],
        ['/products', 'weekly', 0.9],
        ['/corporate', 'monthly', 0.8],
        ['/corporate/innovation', 'monthly', 0.7],
        ['/references', 'monthly', 0.7],
        ['/certificates', 'monthly', 0.6],
        ['/news', 'weekly', 0.8],
        ['/contact', 'monthly', 0.6],
        ['/human-resources', 'monthly', 0.5],
        ['/privacy', 'yearly', 0.3],
        ['/cookies', 'yearly', 0.3],
        ['/terms', 'yearly', 0.3],
    ];
    for (const [path, changeFrequency, priority] of staticPages) {
        entries.push(...localizedEntries(path, BOTH, { changeFrequency, priority }));
    }

    try {
        const [allCategories, allProducts, allPosts] = await Promise.all([
            db.select({ id: categories.id, slug: categories.slug, titleEn: categories.titleEn }).from(categories),
            db.select({
                slug: products.slug,
                categoryId: products.categoryId,
                titleEn: products.titleEn,
                createdAt: products.createdAt,
            }).from(products),
            db.select({ slug: posts.slug, titleEn: posts.titleEn, createdAt: posts.createdAt }).from(posts),
        ]);

        // 2. Categories
        const categorySlugById = new Map<number, string>();
        for (const cat of allCategories) {
            categorySlugById.set(cat.id, cat.slug);
            entries.push(...localizedEntries(`/products/${cat.slug}`, cat.titleEn ? BOTH : TR_ONLY, {
                changeFrequency: 'weekly',
                priority: 0.8,
            }));
        }

        // 3. Products (only those with a category — others have no reachable URL).
        //    English URLs are listed only when the product has an English translation.
        for (const product of allProducts) {
            const categorySlug = product.categoryId ? categorySlugById.get(product.categoryId) : undefined;
            if (!categorySlug) continue;
            entries.push(...localizedEntries(`/products/${categorySlug}/${product.slug}`, product.titleEn ? BOTH : TR_ONLY, {
                ...(product.createdAt ? { lastModified: product.createdAt } : {}),
                changeFrequency: 'weekly',
                priority: 0.7,
            }));
        }

        // 4. News / Blog Posts
        for (const post of allPosts) {
            entries.push(...localizedEntries(`/news/${post.slug}`, post.titleEn ? BOTH : TR_ONLY, {
                ...(post.createdAt ? { lastModified: post.createdAt } : {}),
                changeFrequency: 'monthly',
                priority: 0.6,
            }));
        }
    } catch (error) {
        console.error('Failed to fetch dynamic sitemap entries:', error);
    }

    return entries;
}
