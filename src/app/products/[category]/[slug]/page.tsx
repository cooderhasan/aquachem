"use client";

import React, { useState, use } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ChevronRight, CheckCircle2, Info, MapPin } from 'lucide-react';
import { categories, products } from '@/data/mockData';

export default function ProductDetailPage({ params }: { params: Promise<{ category: string; slug: string }> }) {
    const { category: categorySlug, slug: productSlug } = use(params);
    const [activeTab, setActiveTab] = useState<'desc' | 'usage'>('desc');

    const product = products.find(p => p.slug === productSlug);
    const category = categories.find(c => c.slug === categorySlug);

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
                            <img src={product.image} alt={product.title} className="w-full h-full object-cover rounded-lg" />
                        </div>
                    </div>

                    {/* Product Info */}
                    <div>
                        <h1 className="text-4xl font-bold text-slate-900 mb-2">{product.title}</h1>
                        <p className="text-xl text-slate-500 mb-8">{product.subtitle || product.description}</p>

                        {/* Tabs */}
                        <div className="flex border-b border-slate-200 mb-8">
                            <button
                                onClick={() => setActiveTab('desc')}
                                className={`flex items-center gap-2 px-6 py-3 font-medium border-b-2 transition-colors ${activeTab === 'desc' ? 'border-primary-600 text-primary-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
                            >
                                <Info size={18} />
                                Ürün Açıklaması
                            </button>
                            <button
                                onClick={() => setActiveTab('usage')}
                                className={`flex items-center gap-2 px-6 py-3 font-medium border-b-2 transition-colors ${activeTab === 'usage' ? 'border-primary-600 text-primary-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
                            >
                                <MapPin size={18} />
                                Kullanım Alanları
                            </button>
                        </div>

                        {/* Tab Content */}
                        <div className="prose prose-slate max-w-none mb-10 h-[300px] overflow-y-auto pr-4 scrollbar-thin scrollbar-thumb-slate-200">
                            {activeTab === 'desc' && (
                                <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                                    <p className="whitespace-pre-line leading-relaxed text-slate-600">
                                        {product.description}
                                    </p>
                                    {product.features && (
                                        <ul className="mt-6 space-y-3 list-none p-0">
                                            {product.features.map((feature, idx) => (
                                                <li key={idx} className="flex items-center gap-3 text-slate-700">
                                                    <CheckCircle2 className="text-green-500 shrink-0" size={20} />
                                                    {feature}
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </div>
                            )}

                            {activeTab === 'usage' && (
                                <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                                    <p className="whitespace-pre-line leading-relaxed text-slate-600 bg-slate-50 p-6 rounded-xl border border-slate-100">
                                        {product.usageArea || "Bu ürün için kullanım alanı bilgisi bulunmamaktadır."}
                                    </p>
                                </div>
                            )}
                        </div>

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
