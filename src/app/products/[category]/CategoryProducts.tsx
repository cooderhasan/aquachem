'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Package, FileText } from 'lucide-react';
import QuoteModal from '@/components/shared/QuoteModal';

interface Product {
    id: number;
    title: string;
    slug: string;
    image: string | null;
    shortDescription: string | null;
    description: string | null;
}

interface CategoryProductsProps {
    products: Product[];
    categorySlug: string;
    categoryTitle: string;
}

export default function CategoryProducts({ products, categorySlug, categoryTitle }: CategoryProductsProps) {
    const [quoteModal, setQuoteModal] = useState<{ open: boolean; name: string }>({ open: false, name: '' });

    const openQuote = (name: string) => setQuoteModal({ open: true, name });
    const closeQuote = () => setQuoteModal({ open: false, name: '' });

    if (products.length === 0) {
        return (
            <div className="text-center py-20 bg-white rounded-xl shadow-sm border border-slate-100">
                <Package size={48} className="mx-auto text-slate-300 mb-4" />
                <h3 className="text-lg font-bold text-slate-700">Ürün Bulunamadı</h3>
                <p className="text-slate-500 mt-2">Bu kategoriye ait henüz bir ürün eklenmemiş.</p>
            </div>
        );
    }

    return (
        <>
            {/* Kategori için Teklif Al CTA Banner */}
            <div className="mb-8 bg-gradient-to-r from-primary-700 to-primary-900 rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-lg shadow-primary-900/20">
                <div>
                    <p className="text-primary-200 text-sm font-medium mb-1">Toplu sipariş veya özel formülasyon?</p>
                    <h3 className="text-white text-xl font-bold">{categoryTitle} için Teklif Alın</h3>
                </div>
                <button
                    onClick={() => openQuote(categoryTitle)}
                    className="shrink-0 bg-white hover:bg-slate-50 text-primary-700 font-bold px-6 py-3 rounded-xl flex items-center gap-2 transition-all hover:scale-105 active:scale-95 shadow-md"
                >
                    <FileText size={18} />
                    Hemen Teklif Al
                </button>
            </div>

            {/* Ürün Kartları */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {products.map((product) => (
                    <div key={product.id} className="group bg-white rounded-xl border border-slate-200 overflow-hidden hover:shadow-lg transition-all duration-300 h-full flex flex-col">
                        <Link href={`/products/${categorySlug}/${product.slug}`} className="block">
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
                        </Link>

                        <div className="p-5 flex-1 flex flex-col">
                            <Link href={`/products/${categorySlug}/${product.slug}`}>
                                <h3 className="text-base font-bold text-slate-800 mb-1.5 group-hover:text-primary-600 transition-colors line-clamp-2">
                                    {product.title}
                                </h3>
                            </Link>
                            <p className="text-sm text-slate-500 mb-4 flex-1 line-clamp-2">
                                {product.shortDescription || product.description || ''}
                            </p>

                            {/* İki buton: Detay + Teklif Al */}
                            <div className="flex gap-2 mt-auto">
                                <Link
                                    href={`/products/${categorySlug}/${product.slug}`}
                                    className="flex-1 bg-slate-50 hover:bg-slate-100 text-slate-600 hover:text-slate-800 text-sm py-2 px-3 rounded-lg font-medium text-center flex items-center justify-center gap-1 transition-colors"
                                >
                                    <span>İncele</span>
                                    <ArrowRight size={14} />
                                </Link>
                                <button
                                    onClick={() => openQuote(product.title)}
                                    className="flex-1 bg-primary-600 hover:bg-primary-700 text-white text-sm py-2 px-3 rounded-lg font-medium flex items-center justify-center gap-1 transition-colors active:scale-95"
                                >
                                    <FileText size={14} />
                                    <span>Teklif Al</span>
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <QuoteModal
                isOpen={quoteModal.open}
                onClose={closeQuote}
                productName={quoteModal.name}
            />
        </>
    );
}
