import React from 'react';
import Link from 'next/link';
import { Package } from 'lucide-react';
import { Locale } from '@/lib/i18n';

interface RelatedProduct {
    id: number;
    title: string;
    titleEn?: string | null;
    slug: string;
    image: string | null;
    shortDescription?: string | null;
    shortDescriptionEn?: string | null;
    descriptionEn?: string | null;
}

interface RelatedProductsProps {
    products: RelatedProduct[];
    categorySlug: string;
    currentProductId: number;
    lang: Locale;
}

export default function RelatedProducts({ products, categorySlug, currentProductId, lang }: RelatedProductsProps) {
    // Filter out the current product, shuffle randomly, and limit to 4
    const relatedProducts = products
        .filter(p => p.id !== currentProductId)
        .sort(() => Math.random() - 0.5) // Random shuffle
        .slice(0, 4);

    if (relatedProducts.length === 0) {
        return null;
    }

    return (
        <div className="border-t border-slate-200 mt-16 pt-12">
            <div className="container-custom">
                <h2 className="text-2xl font-bold text-slate-800 mb-8">
                    {lang === 'en' ? 'Other Products in the Same Category' : 'Aynı Kategoriden Diğer Ürünler'}
                </h2>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                    {relatedProducts.map((product) => {
                        const title = (lang === 'en' && product.titleEn) ? product.titleEn : product.title;
                        return (
                            <Link
                                href={`/${lang}/products/${categorySlug}/${product.slug}`}
                                key={product.id}
                                className="group"
                            >
                                <div className="bg-white rounded-xl border border-slate-200 overflow-hidden hover:shadow-lg transition-all duration-300 h-full flex flex-col">
                                    <div className="aspect-square relative bg-slate-100 overflow-hidden">
                                        {product.image ? (
                                            <img
                                                src={product.image}
                                                alt={title}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-slate-400">
                                                <Package size={32} />
                                            </div>
                                        )}
                                    </div>
                                    <div className="p-4 flex-1 flex flex-col">
                                        <h3 className="text-sm md:text-base font-semibold text-slate-800 mb-1 group-hover:text-primary-600 transition-colors line-clamp-2">
                                            {title}
                                        </h3>
                                        <span className="text-xs text-primary-600 font-medium mt-auto">
                                            {lang === 'en' ? 'Explore →' : 'İncele →'}
                                        </span>
                                    </div>
                                </div>
                            </Link>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
