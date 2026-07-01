import { MetadataRoute } from 'next';
import { db } from '@/lib/db';
import { products, categories, posts } from '@/db/schema';

export const dynamic = 'force-dynamic';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://aquachems.com';
    const locales = ['tr', 'en'];

    const sitemapEntries: MetadataRoute.Sitemap = [];

    // 1. Static Pages for both languages
    for (const lang of locales) {
        sitemapEntries.push(
            {
                url: `${baseUrl}/${lang}`,
                lastModified: new Date(),
                changeFrequency: 'daily',
                priority: 1,
            },
            {
                url: `${baseUrl}/${lang}/products`,
                lastModified: new Date(),
                changeFrequency: 'weekly',
                priority: 0.9,
            },
            {
                url: `${baseUrl}/${lang}/corporate`,
                lastModified: new Date(),
                changeFrequency: 'monthly',
                priority: 0.8,
            },
            {
                url: `${baseUrl}/${lang}/corporate/innovation`,
                lastModified: new Date(),
                changeFrequency: 'monthly',
                priority: 0.7,
            },
            {
                url: `${baseUrl}/${lang}/references`,
                lastModified: new Date(),
                changeFrequency: 'monthly',
                priority: 0.7,
            },
            {
                url: `${baseUrl}/${lang}/certificates`,
                lastModified: new Date(),
                changeFrequency: 'monthly',
                priority: 0.6,
            },
            {
                url: `${baseUrl}/${lang}/news`,
                lastModified: new Date(),
                changeFrequency: 'weekly',
                priority: 0.8,
            },
            {
                url: `${baseUrl}/${lang}/contact`,
                lastModified: new Date(),
                changeFrequency: 'monthly',
                priority: 0.6,
            },
            {
                url: `${baseUrl}/${lang}/human-resources`,
                lastModified: new Date(),
                changeFrequency: 'monthly',
                priority: 0.5,
            },
            {
                url: `${baseUrl}/${lang}/privacy`,
                lastModified: new Date(),
                changeFrequency: 'yearly',
                priority: 0.3,
            },
            {
                url: `${baseUrl}/${lang}/cookies`,
                lastModified: new Date(),
                changeFrequency: 'yearly',
                priority: 0.3,
            },
            {
                url: `${baseUrl}/${lang}/terms`,
                lastModified: new Date(),
                changeFrequency: 'yearly',
                priority: 0.3,
            }
        );
    }

    // 2. Categories
    try {
        const allCategories = await db.select().from(categories);
        for (const lang of locales) {
            allCategories.forEach((cat) => {
                sitemapEntries.push({
                    url: `${baseUrl}/${lang}/products/${cat.slug}`,
                    lastModified: new Date(),
                    changeFrequency: 'weekly',
                    priority: 0.8,
                });
            });
        }
    } catch (error) {
        console.error('Failed to fetch categories for sitemap:', error);
    }

    // 3. Products
    try {
        const allProducts = await db.select().from(products);
        const allCats = await db.select().from(categories);

        for (const lang of locales) {
            allProducts.forEach((product) => {
                const category = allCats.find(c => c.id === product.categoryId);
                sitemapEntries.push({
                    url: `${baseUrl}/${lang}/products/${category?.slug || 'urun'}/${product.slug}`,
                    lastModified: product.createdAt || new Date(),
                    changeFrequency: 'weekly',
                    priority: 0.7,
                });
            });
        }
    } catch (error) {
        console.error('Failed to fetch products for sitemap:', error);
    }

    // 4. News / Blog Posts
    try {
        const allPosts = await db.select().from(posts);
        for (const lang of locales) {
            allPosts.forEach((post) => {
                sitemapEntries.push({
                    url: `${baseUrl}/${lang}/news/${post.slug}`,
                    lastModified: post.createdAt || new Date(),
                    changeFrequency: 'monthly',
                    priority: 0.6,
                });
            });
        }
    } catch (error) {
        console.error('Failed to fetch posts for sitemap:', error);
    }

    return sitemapEntries;
}
