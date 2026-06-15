import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, Package, ChevronLeft, ChevronRight } from 'lucide-react';
import { db } from '@/lib/db';
import { products as productsTable, categories as categoriesTable } from '@/db/schema';
import { eq, sql } from 'drizzle-orm';
import CategoryProducts from './CategoryProducts';
import { Locale } from '@/lib/i18n';
import { getDictionary } from '@/lib/dictionary';

const PRODUCTS_PER_PAGE = 12;

interface PageProps {
    params: Promise<{ category: string; lang: Locale }>;
    searchParams: Promise<{ page?: string }>;
}

// Kategori verilerini çek
async function getCategory(slug: string) {
    try {
        const result = await db.select().from(categoriesTable).where(eq(categoriesTable.slug, slug)).limit(1);
        return result[0] || null;
    } catch (error) {
        console.error('Failed to fetch category:', error);
        return null;
    }
}

// Kategoriye ait ürünleri pagination ile çek
async function getProductsByCategory(categoryId: number, page: number) {
    try {
        const offset = (page - 1) * PRODUCTS_PER_PAGE;
        const result = await db.select().from(productsTable)
            .where(eq(productsTable.categoryId, categoryId))
            .limit(PRODUCTS_PER_PAGE)
            .offset(offset);
        return result;
    } catch (error) {
        console.error('Failed to fetch products:', error);
        return [];
    }
}

// Toplam ürün sayısını al
async function getTotalProductCount(categoryId: number) {
    try {
        const result = await db.select({ count: sql<number>`count(*)` })
            .from(productsTable)
            .where(eq(productsTable.categoryId, categoryId));
        return Number(result[0]?.count) || 0;
    } catch (error) {
        console.error('Failed to fetch product count:', error);
        return 0;
    }
}

// Dinamik SEO metadata
export async function generateMetadata({ params, searchParams }: PageProps): Promise<Metadata> {
    const { category: categorySlug, lang } = await params;
    const { page } = await searchParams;
    const currentPage = Math.max(1, parseInt(page || '1', 10));
    const category = await getCategory(categorySlug);
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://aquachems.com';

    if (!category) {
        return {
            title: lang === 'en' ? 'Category Not Found' : 'Kategori Bulunamadı',
        };
    }

    const categoryTitle = (lang === 'en' && category.titleEn) ? category.titleEn : category.title;
    const categoryDesc = (lang === 'en' && category.descriptionEn) 
        ? category.descriptionEn 
        : (category.description || (lang === 'en' ? `Explore all Aquachems products in the ${categoryTitle} category.` : `${categoryTitle} kategorisindeki tüm Aquachems ürünlerini inceleyin.`));

    const pageTitle = currentPage > 1
        ? `${categoryTitle} - ${lang === 'en' ? 'Page' : 'Sayfa'} ${currentPage}`
        : categoryTitle;
    const description = categoryDesc;

    const canonicalPath = currentPage > 1
        ? `/${lang}/products/${categorySlug}?page=${currentPage}`
        : `/${lang}/products/${categorySlug}`;
    const canonicalUrl = `${siteUrl}${canonicalPath}`;

    return {
        title: pageTitle,
        description,
        alternates: {
            canonical: canonicalUrl,
        },
        openGraph: {
            title: `${pageTitle} | ${lang === 'en' ? 'Aquachems Products' : 'Aquachems Ürünleri'}`,
            description,
            url: canonicalUrl,
            images: category.image ? [{ url: category.image }] : [],
            type: 'website',
        },
    };
}

export default async function CategoryPage({ params, searchParams }: PageProps) {
    const { category: categorySlug, lang } = await params;
    const dict = getDictionary(lang);
    const { page } = await searchParams;
    const currentPage = Math.max(1, parseInt(page || '1', 10));

    const category = await getCategory(categorySlug);

    if (!category) {
        notFound();
    }

    const [products, totalProducts] = await Promise.all([
        getProductsByCategory(category.id, currentPage),
        getTotalProductCount(category.id)
    ]);

    const totalPages = Math.ceil(totalProducts / PRODUCTS_PER_PAGE);

    if (currentPage > totalPages && totalPages > 0) {
        notFound();
    }

    const categoryTitle = (lang === 'en' && category.titleEn) ? category.titleEn : category.title;

    const backButtonText = lang === 'en' ? 'Back to Product Groups' : 'Ürün Gruplarına Dön';
    const totalProductsText = lang === 'en'
        ? `A total of ${totalProducts} products are listed in this group.`
        : `Bu grupta toplam ${totalProducts} ürün listeleniyor.`;
    const pageIndicatorText = totalPages > 1 
        ? ` (${lang === 'en' ? 'Page' : 'Sayfa'} ${currentPage}/${totalPages})`
        : '';

    return (
        <div className="bg-slate-50 min-h-screen pb-20 pt-28">
            {/* Rich Header Banner */}
            <div className="relative h-[300px] flex items-center justify-center overflow-hidden">
                {/* Background Image */}
                <div className="absolute inset-0">
                    {category.image ? (
                        <img
                            src={category.image}
                            alt={categoryTitle}
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <div className="w-full h-full bg-gradient-to-br from-primary-600 to-primary-800" />
                    )}
                    {/* Dark Overlay with Gradient */}
                    <div className="absolute inset-0 bg-slate-900/70 bg-gradient-to-t from-slate-900/90 to-transparent"></div>
                </div>

                <div className="container-custom relative z-10 w-full">
                    <Link href={`/${lang}/products`} className="inline-flex items-center text-slate-200 hover:text-white mb-6 transition-colors bg-white/10 px-4 py-2 rounded-full backdrop-blur-sm hover:bg-white/20 w-max">
                        <ArrowLeft size={18} className="mr-2" />
                        {backButtonText}
                    </Link>

                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-primary-600 rounded-xl flex items-center justify-center text-white shadow-lg">
                            <Package size={24} />
                        </div>
                        <div>
                            <h1 className="text-3xl md:text-5xl font-bold text-white shadow-sm">{categoryTitle}</h1>
                            <p className="text-slate-200 mt-2 text-lg">
                                {totalProductsText}{pageIndicatorText}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container-custom py-12">
                <CategoryProducts
                    products={products}
                    categorySlug={category.slug}
                    categoryTitle={categoryTitle}
                    lang={lang}
                    dict={dict}
                />

                {/* Pagination */}
                {totalPages > 1 && (
                    <nav className="mt-12 flex justify-center" aria-label={lang === 'en' ? 'Pagination' : 'Sayfalama'}>
                        <ul className="flex items-center gap-2">
                            {/* Previous Button */}
                            {currentPage > 1 ? (
                                <li>
                                    <Link
                                        href={`/${lang}/products/${category.slug}${currentPage === 2 ? '' : `?page=${currentPage - 1}`}`}
                                        className="flex items-center gap-1 px-4 py-2 rounded-lg bg-white border border-slate-200 text-slate-600 hover:bg-primary-50 hover:text-primary-600 hover:border-primary-200 transition-colors"
                                        rel="prev"
                                    >
                                        <ChevronLeft size={18} />
                                        <span className="hidden sm:inline">{lang === 'en' ? 'Previous' : 'Önceki'}</span>
                                    </Link>
                                </li>
                            ) : (
                                <li>
                                    <span className="flex items-center gap-1 px-4 py-2 rounded-lg bg-slate-100 text-slate-400 cursor-not-allowed">
                                        <ChevronLeft size={18} />
                                        <span className="hidden sm:inline">{lang === 'en' ? 'Previous' : 'Önceki'}</span>
                                    </span>
                                </li>
                            )}

                            {/* Page Numbers */}
                            {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => {
                                const showPage =
                                    pageNum === 1 ||
                                    pageNum === totalPages ||
                                    Math.abs(pageNum - currentPage) <= 1;
                                const showEllipsisBefore = pageNum === currentPage - 2 && currentPage > 3;
                                const showEllipsisAfter = pageNum === currentPage + 2 && currentPage < totalPages - 2;

                                if (showEllipsisBefore || showEllipsisAfter) {
                                    return (
                                        <li key={pageNum}>
                                            <span className="px-2 py-2 text-slate-400">...</span>
                                        </li>
                                    );
                                }
                                if (!showPage) return null;
                                return (
                                    <li key={pageNum}>
                                        {pageNum === currentPage ? (
                                            <span className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary-600 text-white font-semibold">
                                                {pageNum}
                                            </span>
                                        ) : (
                                            <Link
                                                href={`/${lang}/products/${category.slug}${pageNum === 1 ? '' : `?page=${pageNum}`}`}
                                                className="flex items-center justify-center w-10 h-10 rounded-lg bg-white border border-slate-200 text-slate-600 hover:bg-primary-50 hover:text-primary-600 hover:border-primary-200 transition-colors font-medium"
                                            >
                                                {pageNum}
                                            </Link>
                                        )}
                                    </li>
                                );
                            })}

                            {/* Next Button */}
                            {currentPage < totalPages ? (
                                <li>
                                    <Link
                                        href={`/${lang}/products/${category.slug}?page=${currentPage + 1}`}
                                        className="flex items-center gap-1 px-4 py-2 rounded-lg bg-white border border-slate-200 text-slate-600 hover:bg-primary-50 hover:text-primary-600 hover:border-primary-200 transition-colors"
                                        rel="next"
                                    >
                                        <span className="hidden sm:inline">{lang === 'en' ? 'Next' : 'Sonraki'}</span>
                                        <ChevronRight size={18} />
                                    </Link>
                                </li>
                            ) : (
                                <li>
                                    <span className="flex items-center gap-1 px-4 py-2 rounded-lg bg-slate-100 text-slate-400 cursor-not-allowed">
                                        <span className="hidden sm:inline">{lang === 'en' ? 'Next' : 'Sonraki'}</span>
                                        <ChevronRight size={18} />
                                    </span>
                                </li>
                            )}
                        </ul>
                    </nav>
                )}
            </div>
        </div>
    );
}
