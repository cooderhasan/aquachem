import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ChevronRight, ShieldCheck, Award, Package, Truck } from 'lucide-react';
import { db } from '@/lib/db';
import { products, categories } from '@/db/schema';
import { eq } from 'drizzle-orm';
import ProductTabs from './ProductTabs';
import ProductImageGallery from './ProductImageGallery';
import RelatedProducts from './RelatedProducts';
import QuoteButton from './QuoteButton';
import { Locale } from '@/lib/i18n';
import { getDictionary } from '@/lib/dictionary';
import { getSettings } from '@/app/admin/settings/actions';
import { getMainContactLocation } from '@/app/admin/contact/actions';

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

import { getAlternates } from '@/lib/seo';

// Dinamik SEO metadata
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { category: categorySlug, slug, lang } = await params;
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
        alternates: getAlternates(lang, `/products/${categorySlug}/${slug}`),
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

    const [product, category, settings, contactLocation] = await Promise.all([
        getProduct(productSlug),
        getCategory(categorySlug),
        getSettings(),
        getMainContactLocation()
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
    const productShortDesc = lang === 'en' 
        ? (product.shortDescriptionEn || '') 
        : (product.shortDescription || '');
    const productDesc = (lang === 'en' && product.descriptionEn) ? product.descriptionEn : (product.description || '');
    const productUsage = (lang === 'en' && product.usageEn) ? product.usageEn : (product.usage || '');
    const productFeatures = (lang === 'en' && product.featuresEn) ? (product.featuresEn as string[]) : (product.features as string[]);

    // WhatsApp Contact URL
    const rawPhone = settings?.whatsappNumber || contactLocation?.phone?.replace(/\D/g, '') || "905336838563";
    const cleanPhone = rawPhone.replace(/\D/g, '');
    const whatsappText = encodeURIComponent(
        lang === 'en'
            ? `Hello, I would like to get technical info and a price quote for "${productTitle}".`
            : `Merhaba, "${productTitle}" ürünü hakkında teknik bilgi ve fiyat teklifi almak istiyorum.`
    );
    const whatsappUrl = `https://wa.me/${cleanPhone}?text=${whatsappText}`;

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

            <div className="container-custom py-10 lg:py-12">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">

                    {/* Sol Sütun: Yapışkan (Sticky) Ürün Görsel Galerisi & Hızlı Bilgi */}
                    <div className="lg:col-span-5 lg:sticky lg:top-36 space-y-4 self-start">
                        <ProductImageGallery
                            images={allImages}
                            productTitle={productTitle}
                        />

                        {/* Hızlı Aksiyon & Güvence Kartı - Sadece Masaüstünde Görselin Altında (Mobilde aşağıda başlığın altında gösterilir) */}
                        <div className="hidden lg:block bg-slate-50 rounded-2xl border border-slate-200/80 p-5 space-y-4 shadow-sm">
                            <div className="flex flex-col xl:flex-row gap-2.5">
                                <div className="flex-1">
                                    <QuoteButton
                                        productName={productTitle}
                                        lang={lang}
                                        dict={dict}
                                        className="w-full bg-primary-600 hover:bg-primary-700 text-white px-5 py-3 rounded-xl font-bold transition-all active:scale-95 text-center flex items-center gap-2 justify-center shadow-sm text-sm"
                                    />
                                </div>
                                <a
                                    href={whatsappUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20ba59] text-white px-5 py-3 rounded-xl font-bold transition-all active:scale-95 shadow-sm text-sm whitespace-nowrap"
                                    aria-label="WhatsApp"
                                >
                                    <svg className="w-4 h-4 fill-current shrink-0" viewBox="0 0 24 24">
                                        <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.59-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981z" />
                                    </svg>
                                    <span>{lang === 'en' ? 'WhatsApp Support' : 'WhatsApp Destek'}</span>
                                </a>
                            </div>

                            {/* Güvence Rozetleri */}
                            <div className="grid grid-cols-2 gap-2.5 pt-3 border-t border-slate-200/80 text-xs text-slate-600">
                                <div className="flex items-center gap-2">
                                    <div className="w-6 h-6 rounded-md bg-primary-100 text-primary-700 flex items-center justify-center shrink-0">
                                        <ShieldCheck size={14} />
                                    </div>
                                    <span className="font-medium truncate">{lang === 'en' ? 'High Performance' : 'Konsantre Güç'}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-6 h-6 rounded-md bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                                        <Award size={14} />
                                    </div>
                                    <span className="font-medium truncate">{lang === 'en' ? 'ISO Standard' : 'ISO Kalite'}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-6 h-6 rounded-md bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
                                        <Package size={14} />
                                    </div>
                                    <span className="font-medium truncate">{lang === 'en' ? 'Bulk / Packaging' : 'Endüstriyel Bidon'}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-6 h-6 rounded-md bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
                                        <Truck size={14} />
                                    </div>
                                    <span className="font-medium truncate">{lang === 'en' ? 'Fast Delivery' : 'Hızlı Sevkiyat'}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Sağ Sütun: Ürün Bilgisi & Zengin AI Metinleri */}
                    <div className="lg:col-span-7 space-y-6">
                        <div>
                            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-primary-50 text-primary-700 border border-primary-100 mb-3">
                                {categoryTitle}
                            </div>
                            <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-3 tracking-tight" style={{ fontFamily: 'var(--font-ubuntu)' }}>
                                {productTitle}
                            </h1>
                            {productShortDesc && (
                                <p className="text-lg text-slate-600 leading-relaxed">
                                    {productShortDesc}
                                </p>
                            )}
                        </div>

                        {/* Hızlı Aksiyon Barı */}
                        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pb-6 border-b border-slate-100">
                            <QuoteButton productName={productTitle} lang={lang} dict={dict} />
                            <a
                                href={whatsappUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-bold text-sm bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 transition-all active:scale-95 text-center"
                            >
                                <svg className="w-4 h-4 fill-current text-[#25D366]" viewBox="0 0 24 24">
                                    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.59-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981z" />
                                </svg>
                                <span>{lang === 'en' ? 'WhatsApp Inquiry' : 'WhatsApp ile Danışın'}</span>
                            </a>
                        </div>

                        {/* Mobilde Güvence Rozetleri (Masaüstünde sol sütunda olduğu için burada lg:hidden) */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 lg:hidden py-3 px-4 bg-slate-50 rounded-xl border border-slate-100 text-xs text-slate-600">
                            <div className="flex items-center gap-1.5">
                                <ShieldCheck size={14} className="text-primary-600 shrink-0" />
                                <span className="font-medium truncate">{lang === 'en' ? 'High Performance' : 'Konsantre'}</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <Award size={14} className="text-emerald-600 shrink-0" />
                                <span className="font-medium truncate">{lang === 'en' ? 'ISO Standard' : 'ISO Kalite'}</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <Package size={14} className="text-amber-600 shrink-0" />
                                <span className="font-medium truncate">{lang === 'en' ? 'Packaging' : 'Ambalaj'}</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <Truck size={14} className="text-blue-600 shrink-0" />
                                <span className="font-medium truncate">{lang === 'en' ? 'Fast Delivery' : 'Hızlı Sevkiyat'}</span>
                            </div>
                        </div>

                        <ProductTabs
                            description={productDesc || (lang === 'en' ? 'Product description not added yet.' : 'Ürün açıklaması henüz eklenmemiş.')}
                            usageArea={productUsage || undefined}
                            features={productFeatures}
                            lang={lang}
                        />

                        {/* Alt Aksiyon Çubuğu */}
                        <div className="pt-6 border-t border-slate-200 flex flex-wrap items-center justify-between gap-4">
                            <div className="flex items-center gap-3">
                                <QuoteButton productName={productTitle} lang={lang} dict={dict} />
                                <a
                                    href={whatsappUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-2 px-5 py-3 rounded-xl font-bold text-sm bg-slate-100 hover:bg-slate-200 text-slate-700 transition-all active:scale-95"
                                >
                                    <svg className="w-4 h-4 fill-current text-emerald-600" viewBox="0 0 24 24">
                                        <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.59-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981z" />
                                    </svg>
                                    <span>{lang === 'en' ? 'Direct WhatsApp' : 'Soru Sor'}</span>
                                </a>
                            </div>
                            <span className="text-xs text-slate-400">
                                {lang === 'en' ? 'Direct factory sales & technical engineering support' : 'Fabrikadan doğrudan satış ve teknik destek'}
                            </span>
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
