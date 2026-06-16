'use server';

import { db } from '@/lib/db';
import { products, categories } from '@/db/schema';
import { ilike, or, eq, and, desc } from 'drizzle-orm';

export async function searchProducts(query: string) {
    if (!query || query.length < 2) {
        return [];
    }

    try {
        const results = await db
            .select({
                id: products.id,
                title: products.title,
                titleEn: products.titleEn,
                slug: products.slug,
                image: products.image,
                categoryId: products.categoryId,
                categorySlug: categories.slug,
                shortDescription: products.shortDescription,
                shortDescriptionEn: products.shortDescriptionEn,
                description: products.description,
                descriptionEn: products.descriptionEn
            })
            .from(products)
            .leftJoin(categories, eq(products.categoryId, categories.id))
            .where(
                or(
                    ilike(products.title, `%${query}%`),
                    ilike(products.titleEn, `%${query}%`),
                    ilike(products.description, `%${query}%`),
                    ilike(products.descriptionEn, `%${query}%`),
                    ilike(products.shortDescription, `%${query}%`),
                    ilike(products.shortDescriptionEn, `%${query}%`)
                )
            )
            .limit(10); // Limit results for performance

        return results;
    } catch (error) {
        console.error('Search error:', error);
        return [];
    }
}
