import { MetadataRoute } from 'next';
import { db } from '@/lib/db';
import { products, categories, posts } from '@/db/schema';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://aquachems.com';

    // Statik sayfalar
    const staticPages: MetadataRoute.Sitemap = [
        {
            url: baseUrl,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 1,
        },
        {
            url: `${baseUrl}/products`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.9,
        },
        {
            url: `${baseUrl}/corporate`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.8,
        },
        {
            url: `${baseUrl}/corporate/about`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.7,
        },
        {
            url: `${baseUrl}/corporate/mission`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.7,
        },
        {
            url: `${baseUrl}/corporate/innovation`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.7,
        },
        {
            url: `${baseUrl}/references`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.7,
        },
        {
            url: `${baseUrl}/certificates`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.6,
        },
        {
            url: `${baseUrl}/blog`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.8,
        },
        {
            url: `${baseUrl}/contact`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.6,
        },
        {
            url: `${baseUrl}/human-resources`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.5,
        },
    ];

    // Dinamik sayfalar - Kategoriler
    let categoryPages: MetadataRoute.Sitemap = [];
    try {
        const allCategories = await db.select().from(categories);
        categoryPages = allCategories.map((cat) => ({
            url: `${baseUrl}/products/${cat.slug}`,
            lastModified: new Date(),
            changeFrequency: 'weekly' as const,
            priority: 0.8,
        }));
    } catch (error) {
        console.error('Failed to fetch categories for sitemap:', error);
    }

    // Dinamik sayfalar - Ürünler
    let productPages: MetadataRoute.Sitemap = [];
    try {
        const allProducts = await db.select().from(products);
        const allCats = await db.select().from(categories);

        productPages = allProducts.map((product) => {
            const category = allCats.find(c => c.id === product.categoryId);
            return {
                url: `${baseUrl}/products/${category?.slug || 'urun'}/${product.slug}`,
                lastModified: product.createdAt || new Date(),
                changeFrequency: 'weekly' as const,
                priority: 0.7,
            };
        });
    } catch (error) {
        console.error('Failed to fetch products for sitemap:', error);
    }

    // Dinamik sayfalar - Blog yazıları
    let postPages: MetadataRoute.Sitemap = [];
    try {
        const allPosts = await db.select().from(posts);
        postPages = allPosts.map((post) => ({
            url: `${baseUrl}/blog/${post.slug}`,
            lastModified: post.createdAt || new Date(),
            changeFrequency: 'monthly' as const,
            priority: 0.6,
        }));
    } catch (error) {
        console.error('Failed to fetch posts for sitemap:', error);
    }

    return [...staticPages, ...categoryPages, ...productPages, ...postPages];
}
