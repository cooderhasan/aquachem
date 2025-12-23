import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ChevronRight } from 'lucide-react';
import { db } from '@/lib/db';
import { products, categories } from '@/db/schema';
import { eq } from 'drizzle-orm';
import ProductTabs from './ProductTabs';

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

                    {/* Product Image */}
                    <div className="bg-slate-50 rounded-2xl border border-slate-100 p-8 flex items-center justify-center">
                        <div className="relative w-full aspect-square max-w-md bg-white rounded-xl shadow-sm p-4">
                            {product.image ? (
                                <img src={product.image} alt={product.title} className="w-full h-full object-cover rounded-lg" />
                            ) : (
                                <div className="w-full h-full bg-slate-100 rounded-lg flex items-center justify-center text-slate-400">
                                    Görsel Yok
                                </div>
                            )}
                        </div>
                    </div>

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
        </div>
    );
}
