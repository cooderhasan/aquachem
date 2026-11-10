import { NextResponse } from 'next/server';
import { eq } from 'drizzle-orm';
import { db } from '@/lib/db';
import { products, categories } from '@/db/schema';
import { SITE_URL } from '@/lib/seo';

export const dynamic = 'force-dynamic';

// Legacy WordPress product URLs (/product-detail/:slug) -> permanent redirect to the new product page.
export async function GET(_request: Request, { params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;

    try {
        const [row] = await db
            .select({ slug: products.slug, categorySlug: categories.slug })
            .from(products)
            .innerJoin(categories, eq(products.categoryId, categories.id))
            .where(eq(products.slug, decodeURIComponent(slug)))
            .limit(1);

        if (row?.categorySlug) {
            return NextResponse.redirect(`${SITE_URL}/tr/products/${row.categorySlug}/${row.slug}`, 308);
        }
    } catch (error) {
        console.error('Error finding product for legacy redirect:', error);
        // Temporary redirect on DB errors so Google doesn't permanently learn a wrong target.
        return NextResponse.redirect(`${SITE_URL}/tr/products`, 307);
    }

    // Product no longer exists: send to the product list permanently.
    return NextResponse.redirect(`${SITE_URL}/tr/products`, 301);
}
