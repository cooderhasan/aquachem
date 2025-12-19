"use client";

import React, { use } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, Package } from 'lucide-react';
import { categories, products as allProducts } from '@/data/mockData';

export default function CategoryPage({ params }: { params: Promise<{ category: string }> }) {
    const { category: categorySlug } = use(params);

    const category = categories.find(c => c.slug === categorySlug);
    // Filter products by category ID (since products map to categoryId mock relation)
    // In a real app with slug-based relations, this might be direct.
    // Here we find the category first, then filter products by its ID.

    if (!category) {
        notFound();
    }

    const products = allProducts.filter(p => p.categoryId === category.id);

    return (
        <div className="bg-slate-50 min-h-screen pb-20 pt-28">
            {/* Rich Header Banner */}
            <div className="relative h-[300px] flex items-center justify-center overflow-hidden">
                {/* Background Image */}
                <div className="absolute inset-0">
                    <img
                        src={category.image}
                        alt={category.title}
                        className="w-full h-full object-cover"
                    />
                    {/* Dark Overlay with Gradient */}
                    <div className="absolute inset-0 bg-slate-900/70 bg-gradient-to-t from-slate-900/90 to-transparent"></div>
                </div>

                <div className="container-custom relative z-10 w-full">
                    <Link href="/products" className="inline-flex items-center text-slate-200 hover:text-white mb-6 transition-colors bg-white/10 px-4 py-2 rounded-full backdrop-blur-sm hover:bg-white/20 w-max">
                        <ArrowLeft size={18} className="mr-2" />
                        Ürün Gruplarına Dön
                    </Link>

                    <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 ${category.color} rounded-xl flex items-center justify-center text-white shadow-lg`}>
                            <category.icon size={24} />
                        </div>
                        <div>
                            <h1 className="text-3xl md:text-5xl font-bold text-white shadow-sm">{category.title}</h1>
                            <p className="text-slate-200 mt-2 text-lg">Bu grupta toplam {products.length} ürün listeleniyor.</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container-custom py-12">
                {products.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {products.map((product) => (
                            <Link href={`/products/${category.slug}/${product.slug}`} key={product.id} className="group">
                                <div className="bg-white rounded-xl border border-slate-200 overflow-hidden hover:shadow-lg transition-all duration-300 h-full flex flex-col">
                                    <div className="aspect-square relative bg-slate-100 overflow-hidden">
                                        <img
                                            src={product.image}
                                            alt={product.title}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                        />
                                    </div>
                                    <div className="p-6 flex-1 flex flex-col">
                                        <h3 className="text-lg font-bold text-slate-800 mb-2 group-hover:text-primary-600 transition-colors">{product.title}</h3>
                                        <p className="text-sm text-slate-500 mb-4 flex-1 line-clamp-2">{product.description}</p>
                                        <div className="bg-slate-50 text-slate-600 text-sm py-2 px-4 rounded-lg font-medium text-center group-hover:bg-primary-50 group-hover:text-primary-600 transition-colors">
                                            Detaylı İncele
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 bg-white rounded-xl shadow-sm border border-slate-100">
                        <Package size={48} className="mx-auto text-slate-300 mb-4" />
                        <h3 className="text-lg font-bold text-slate-700">Ürün Bulunamadı</h3>
                        <p className="text-slate-500 mt-2">Bu kategoriye ait henüz bir ürün eklenmemiş.</p>
                        <p className="text-xs text-slate-400 mt-4">(Örnek ürünler için "Likit Cilt Temizleme" kategorisine bakınız)</p>
                    </div>
                )}
            </div>
        </div>
    );
}
