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
import QuoteButton from './QuoteButton';
import { Locale } from '@/lib/i18n';
import { getDictionary } from '@/lib/dictionary';

interface PageProps {
    params: Promise<{ category: string; slug: string; lang: Locale }>;
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
            titleEn: products.titleEn,
            slug: products.slug,
            image: products.image,
            shortDescription: products.shortDescription,
            shortDescriptionEn: products.shortDescriptionEn,
            descriptionEn: products.descriptionEn,
        }).from(products).where(eq(products.categoryId, categoryId));
        return result;
    } catch (error) {
        console.error('Failed to fetch related products:', error);
        return [];
    }
}

// Dinamik SEO metadata
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { slug, lang } = await params;
    const product = await getProduct(slug);

    if (!product) {
        return {
            title: lang === 'en' ? 'Product Not Found' : 'Ürün Bulunamadı',
        };
    }

    const title = (lang === 'en' && product.titleEn) ? product.titleEn : product.title;
    const description = (lang === 'en' && product.descriptionEn) 
        ? product.descriptionEn 
        : (product.shortDescription || product.description?.substring(0, 160) || `${title} - Aquachems`);

    return {
        title: title,
        description,
        openGraph: {
            title: `${title} | Aquachems`,
            description,
            images: product.image ? [{ url: product.image }] : [],
            type: 'website',
        },
        twitter: {
            card: 'summary_large_image',
            title: title,
            description,
            images: product.image ? [product.image] : [],
        },
    };
}

export default async function ProductDetailPage({ params }: PageProps) {
    const { category: categorySlug, slug: productSlug, lang } = await params;
    const dict = getDictionary(lang);

    const [product, category] = await Promise.all([
        getProduct(productSlug),
        getCategory(categorySlug)
    ]);

    if (!product || !category) {
        notFound();
    }

    const relatedProducts = await getRelatedProducts(category.id);

    let allImages: string[] = [];
    if (product.image) {
        allImages.push(product.image);
    }
    if (product.images) {
        try {
            const parsed = JSON.parse(product.images);
            if (Array.isArray(parsed)) {
                allImages.push(...parsed.filter((img: string) => img && img !== product.image));
            }
        } catch {
            // ignore
        }
    }

    const categoryTitle = (lang === 'en' && category.titleEn) ? category.titleEn : category.title;
    const productTitle = (lang === 'en' && product.titleEn) ? product.titleEn : product.title;
    const productShortDesc = (lang === 'en' && product.descriptionEn) 
        ? product.descriptionEn.substring(0, 160) 
        : (product.shortDescription || '');
    const productDesc = (lang === 'en' && product.descriptionEn) ? product.descriptionEn : (product.description || '');
    const productUsage = (lang === 'en' && product.usageEn) ? product.usageEn : (product.usage || '');
    const productFeatures = (lang === 'en' && product.featuresEn) ? (product.featuresEn as string[]) : (product.features as string[]);

    return (
        <div className="bg-white min-h-screen pb-20 pt-36">

            {/* Breadcrumb / Nav */}
            <div className="bg-slate-50 border-b border-slate-200 py-4">
                <div className="container-custom flex items-center gap-2 text-sm text-slate-500 flex-wrap">
                    <Link href={`/${lang}/products`} className="hover:text-slate-800">{dict.nav.products}</Link>
                    <ChevronRight size={16} />
                    <Link href={`/${lang}/products/${category.slug}`} className="hover:text-slate-800">{categoryTitle}</Link>
                    <ChevronRight size={16} />
                    <span className="text-slate-800 font-medium">{productTitle}</span>
                </div>
            </div>

            <div className="container-custom py-12">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">

                    {/* Product Image Gallery */}
                    <ProductImageGallery
                        images={allImages}
                        productTitle={productTitle}
                    />

                    {/* Product Info */}
                    <div>
                        <h1 className="text-4xl font-bold text-slate-900 mb-2" style={{ fontFamily: 'var(--font-ubuntu)' }}>{productTitle}</h1>
                        <p className="text-xl text-slate-500 mb-8">{productShortDesc}</p>

                        <ProductTabs
                            description={productDesc || (lang === 'en' ? 'Product description not added yet.' : 'Ürün açıklaması henüz eklenmemiş.')}
                            usageArea={productUsage || undefined}
                            features={productFeatures}
                            lang={lang}
                        />

                        <div className="flex gap-4">
                            <QuoteButton productName={productTitle} lang={lang} dict={dict} />
                        </div>
                    </div>

                </div>
            </div>

            {/* Related Products */}
            <RelatedProducts
                products={relatedProducts}
                categorySlug={category.slug}
                currentProductId={product.id}
                lang={lang}
            />
        </div>
    );
}
