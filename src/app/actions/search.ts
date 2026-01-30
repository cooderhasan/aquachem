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
                slug: products.slug,
                image: products.image,
                categoryId: products.categoryId,
                categorySlug: categories.slug,
                shortDescription: products.shortDescription,
                description: products.description
            })
            .from(products)
            .leftJoin(categories, eq(products.categoryId, categories.id))
            .where(
                or(
                    ilike(products.title, `%${query}%`),
                    ilike(products.description, `%${query}%`),
                    ilike(products.shortDescription, `%${query}%`)
                    // ilike(products.features, `%${query}%`) - Removed to prevent JSONB error
                    // Note: querying JSONB with ilike might vary by driver compatibility, usually need sql operator.
                    // For simplicity and safety, let's stick to title and descriptions for now.
                    // If features search is needed, we'd do sql`...`
                )
            )
            .limit(10); // Limit results for performance

        return results;
    } catch (error) {
        console.error('Search error:', error);
        return [];
    }
}
