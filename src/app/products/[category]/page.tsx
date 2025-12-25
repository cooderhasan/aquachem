import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, Package, ChevronLeft, ChevronRight } from 'lucide-react';
import { db } from '@/lib/db';
import { products as productsTable, categories as categoriesTable } from '@/db/schema';
import { eq, sql } from 'drizzle-orm';

const PRODUCTS_PER_PAGE = 12;

interface PageProps {
    params: Promise<{ category: string }>;
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
    const { category: categorySlug } = await params;
    const { page } = await searchParams;
    const currentPage = Math.max(1, parseInt(page || '1', 10));
    const category = await getCategory(categorySlug);

    if (!category) {
        return {
            title: 'Kategori Bulunamadı',
        };
    }

    const pageTitle = currentPage > 1
        ? `${category.title} - Sayfa ${currentPage}`
        : category.title;
    const description = category.description || `${category.title} kategorisindeki tüm Aquachems ürünlerini inceleyin.`;

    return {
        title: pageTitle,
        description,
        openGraph: {
            title: `${pageTitle} | Aquachems Ürünleri`,
            description,
            images: category.image ? [{ url: category.image }] : [],
            type: 'website',
        },
    };
}

export default async function CategoryPage({ params, searchParams }: PageProps) {
    const { category: categorySlug } = await params;
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

    // Geçersiz sayfa numarası kontrolü
    if (currentPage > totalPages && totalPages > 0) {
        notFound();
    }

    return (
        <div className="bg-slate-50 min-h-screen pb-20 pt-28">
            {/* Rich Header Banner */}
            <div className="relative h-[300px] flex items-center justify-center overflow-hidden">
                {/* Background Image */}
                <div className="absolute inset-0">
                    {category.image ? (
                        <img
                            src={category.image}
                            alt={category.title}
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <div className="w-full h-full bg-gradient-to-br from-primary-600 to-primary-800" />
                    )}
                    {/* Dark Overlay with Gradient */}
                    <div className="absolute inset-0 bg-slate-900/70 bg-gradient-to-t from-slate-900/90 to-transparent"></div>
                </div>

                <div className="container-custom relative z-10 w-full">
                    <Link href="/products" className="inline-flex items-center text-slate-200 hover:text-white mb-6 transition-colors bg-white/10 px-4 py-2 rounded-full backdrop-blur-sm hover:bg-white/20 w-max">
                        <ArrowLeft size={18} className="mr-2" />
                        Ürün Gruplarına Dön
                    </Link>

                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-primary-600 rounded-xl flex items-center justify-center text-white shadow-lg">
                            <Package size={24} />
                        </div>
                        <div>
                            <h1 className="text-3xl md:text-5xl font-bold text-white shadow-sm">{category.title}</h1>
                            <p className="text-slate-200 mt-2 text-lg">
                                Bu grupta toplam {totalProducts} ürün listeleniyor.
                                {totalPages > 1 && ` (Sayfa ${currentPage}/${totalPages})`}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container-custom py-12">
                {products.length > 0 ? (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {products.map((product) => (
                                <Link href={`/products/${category.slug}/${product.slug}`} key={product.id} className="group">
                                    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden hover:shadow-lg transition-all duration-300 h-full flex flex-col">
                                        <div className="aspect-square relative bg-slate-100 overflow-hidden">
                                            {product.image ? (
                                                <img
                                                    src={product.image}
                                                    alt={product.title}
                                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-slate-400">
                                                    <Package size={48} />
                                                </div>
                                            )}
                                        </div>
                                        <div className="p-6 flex-1 flex flex-col">
                                            <h3 className="text-lg font-bold text-slate-800 mb-2 group-hover:text-primary-600 transition-colors">{product.title}</h3>
                                            <p className="text-sm text-slate-500 mb-4 flex-1 line-clamp-2">{product.shortDescription || product.description || ''}</p>
                                            <div className="bg-slate-50 text-slate-600 text-sm py-2 px-4 rounded-lg font-medium text-center group-hover:bg-primary-50 group-hover:text-primary-600 transition-colors">
                                                Detaylı İncele
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <nav className="mt-12 flex justify-center" aria-label="Sayfalama">
                                <ul className="flex items-center gap-2">
                                    {/* Previous Button */}
                                    {currentPage > 1 ? (
                                        <li>
                                            <Link
                                                href={`/products/${category.slug}${currentPage === 2 ? '' : `?page=${currentPage - 1}`}`}
                                                className="flex items-center gap-1 px-4 py-2 rounded-lg bg-white border border-slate-200 text-slate-600 hover:bg-primary-50 hover:text-primary-600 hover:border-primary-200 transition-colors"
                                                rel="prev"
                                            >
                                                <ChevronLeft size={18} />
                                                <span className="hidden sm:inline">Önceki</span>
                                            </Link>
                                        </li>
                                    ) : (
                                        <li>
                                            <span className="flex items-center gap-1 px-4 py-2 rounded-lg bg-slate-100 text-slate-400 cursor-not-allowed">
                                                <ChevronLeft size={18} />
                                                <span className="hidden sm:inline">Önceki</span>
                                            </span>
                                        </li>
                                    )}

                                    {/* Page Numbers */}
                                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => {
                                        // Show first page, last page, current page, and pages around current
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
                                                        href={`/products/${category.slug}${pageNum === 1 ? '' : `?page=${pageNum}`}`}
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
                                                href={`/products/${category.slug}?page=${currentPage + 1}`}
                                                className="flex items-center gap-1 px-4 py-2 rounded-lg bg-white border border-slate-200 text-slate-600 hover:bg-primary-50 hover:text-primary-600 hover:border-primary-200 transition-colors"
                                                rel="next"
                                            >
                                                <span className="hidden sm:inline">Sonraki</span>
                                                <ChevronRight size={18} />
                                            </Link>
                                        </li>
                                    ) : (
                                        <li>
                                            <span className="flex items-center gap-1 px-4 py-2 rounded-lg bg-slate-100 text-slate-400 cursor-not-allowed">
                                                <span className="hidden sm:inline">Sonraki</span>
                                                <ChevronRight size={18} />
                                            </span>
                                        </li>
                                    )}
                                </ul>
                            </nav>
                        )}
                    </>
                ) : (
                    <div className="text-center py-20 bg-white rounded-xl shadow-sm border border-slate-100">
                        <Package size={48} className="mx-auto text-slate-300 mb-4" />
                        <h3 className="text-lg font-bold text-slate-700">Ürün Bulunamadı</h3>
                        <p className="text-slate-500 mt-2">Bu kategoriye ait henüz bir ürün eklenmemiş.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
