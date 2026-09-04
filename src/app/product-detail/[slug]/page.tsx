import { redirect } from 'next/navigation';
import { db } from '@/lib/db';
import { products, categories } from '@/db/schema';
import { eq } from 'drizzle-orm';

interface PageProps {
    params: Promise<{ slug: string }>;
}

export const dynamic = 'force-dynamic';

export default async function ProductDetailRedirect({ params }: PageProps) {
    const { slug } = await params;

    if (!slug) {
        redirect('/tr/products');
    }

    try {
        const productResult = await db
            .select({
                id: products.id,
                slug: products.slug,
                categoryId: products.categoryId,
            })
            .from(products)
            .where(eq(products.slug, slug))
            .limit(1);

        const product = productResult[0];

        if (product && product.categoryId) {
            const categoryResult = await db
                .select({
                    slug: categories.slug,
                })
                .from(categories)
                .where(eq(categories.id, product.categoryId))
                .limit(1);

            const category = categoryResult[0];
            if (category && category.slug) {
                redirect(`/tr/products/${category.slug}/${product.slug}`);
            }
        }
    } catch (error) {
        console.error('Error finding product for 301 redirect:', error);
    }

    // Fallback: If product not found in database, send to all products page so no 404
    redirect('/tr/products');
}
