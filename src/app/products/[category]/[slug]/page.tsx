import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ChevronRight } from 'lucide-react';
import { db } from '@/lib/db';
import { products, categories } from '@/db/schema';
import { eq } from 'drizzle-orm';
import ProductTabs from './ProductTabs';
import ProductImageGallery from './ProductImageGallery';
import RelatedProducts from './RelatedProducts';

interface PageProps {
    params: Promise<{ category: string; slug: string }>;
}

// Ürün verilerini çek
async function getProduct(slug: string) {
    try {
        const result = await db.select().from(products).where(eq(products.slug, slug)).limit(1);
        return result[0] || null;
    } catch (error) {
        console.error('Failed to fetch product:', error);
        return null;
    }
}

// Kategori verilerini çek
async function getCategory(slug: string) {
    try {
        const result = await db.select().from(categories).where(eq(categories.slug, slug)).limit(1);
        return result[0] || null;
    } catch (error) {
        console.error('Failed to fetch category:', error);
        return null;
    }
}

// Aynı kategorideki ürünleri çek
async function getRelatedProducts(categoryId: number) {
    try {
        const result = await db.select({
            id: products.id,
            title: products.title,
            slug: products.slug,
            image: products.image,
            shortDescription: products.shortDescription,
        }).from(products).where(eq(products.categoryId, categoryId));
        return result;
    } catch (error) {
        console.error('Failed to fetch related products:', error);
        return [];
    }
}

// Dinamik SEO metadata
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { slug } = await params;
    const product = await getProduct(slug);

    if (!product) {
        return {
            title: 'Ürün Bulunamadı',
        };
    }

    const description = product.shortDescription || product.description?.substring(0, 160) || `${product.title} - Aquachems ürünü`;

    return {
        title: product.title,
        description,
        openGraph: {
            title: `${product.title} | Aquachems`,
            description,
            images: product.image ? [{ url: product.image }] : [],
            type: 'website',
        },
        twitter: {
            card: 'summary_large_image',
            title: product.title,
            description,
            images: product.image ? [product.image] : [],
        },
    };
}

export default async function ProductDetailPage({ params }: PageProps) {
    const { category: categorySlug, slug: productSlug } = await params;

    const [product, category] = await Promise.all([
        getProduct(productSlug),
        getCategory(categorySlug)
    ]);

    if (!product || !category) {
        notFound();
    }

    // Fetch related products from the same category
    const relatedProducts = await getRelatedProducts(category.id);

    // Parse images array from JSON string
    let allImages: string[] = [];
    if (product.image) {
        allImages.push(product.image);
    }
    if (product.images) {
        try {
            const parsed = JSON.parse(product.images);
            if (Array.isArray(parsed)) {
                // Add images that are not the main image (avoid duplicates)
                allImages.push(...parsed.filter((img: string) => img && img !== product.image));
            }
        } catch {
            // Invalid JSON, ignore
        }
    }

    return (
        <div className="bg-white min-h-screen pb-20 pt-28">

            {/* Breadcrumb / Nav */}
            <div className="bg-slate-50 border-b border-slate-200 py-4">
                <div className="container-custom flex items-center gap-2 text-sm text-slate-500 flex-wrap">
                    <Link href="/products" className="hover:text-slate-800">Ürünler</Link>
                    <ChevronRight size={16} />
                    <Link href={`/products/${category.slug}`} className="hover:text-slate-800">{category.title}</Link>
                    <ChevronRight size={16} />
                    <span className="text-slate-800 font-medium">{product.title}</span>
                </div>
            </div>

            <div className="container-custom py-12">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">

                    {/* Product Image Gallery */}
                    <ProductImageGallery
                        images={allImages}
                        productTitle={product.title}
                    />

                    {/* Product Info */}
                    <div>
                        <h1 className="text-4xl font-bold text-slate-900 mb-2" style={{ fontFamily: 'var(--font-ubuntu)' }}>{product.title}</h1>
                        <p className="text-xl text-slate-500 mb-8">{product.shortDescription || ''}</p>

                        <ProductTabs
                            description={product.description || 'Ürün açıklaması henüz eklenmemiş.'}
                            usageArea={product.usage || undefined}
                            features={product.features as string[]}
                        />

                        <div className="flex gap-4">
                            <Link
                                href="/contact"
                                className="bg-primary-600 hover:bg-primary-700 text-white px-8 py-3 rounded-xl font-bold transition-transform active:scale-95 text-center flex-1 md:flex-none"
                            >
                                Teklif İste
                            </Link>
                        </div>
                    </div>

                </div>
            </div>

            {/* Related Products */}
            <RelatedProducts
                products={relatedProducts}
                categorySlug={category.slug}
                currentProductId={product.id}
            />
        </div>
    );
}

