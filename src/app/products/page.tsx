"use client";

import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { categories } from '@/data/mockData';

export default function ProductsPage() {
    return (
        <div className="bg-slate-50 min-h-screen pb-20">
            {/* Header Banner */}
            <div className="bg-primary-900 text-white pt-48 pb-16">
                <div className="container-custom">
                    <h1 className="text-3xl md:text-5xl font-bold mb-4 text-white">Ürün Grupları</h1>
                    <p className="text-primary-200 text-lg">
                        İncelemek istediğiniz ürün grubunu seçiniz.
                    </p>
                </div>
            </div>

            <div className="container-custom py-12">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {categories.map((cat) => (
                        <Link href={`/products/${cat.slug}`} key={cat.id} className="group block">
                            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden h-full hover:shadow-xl transition-all duration-300 flex flex-col relative">

                                {/* Image Area */}
                                <div className="relative h-48 overflow-hidden">
                                    <img
                                        src={cat.image}
                                        alt={cat.title}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent"></div>
                                    <div className={`absolute bottom-4 left-4 w-10 h-10 ${cat.color} rounded-lg flex items-center justify-center text-white shadow-lg`}>
                                        <cat.icon size={20} />
                                    </div>
                                </div>

                                {/* Content Area */}
                                <div className="p-6 flex-1 flex flex-col justify-between">
                                    <h3 className="text-lg font-bold text-slate-800 mb-2 transition-colors">
                                        {cat.title}
                                    </h3>

                                    <div className="flex items-center text-sm font-medium text-slate-400 transition-colors mt-4">
                                        <span>Ürünleri İncele</span>
                                        <ArrowRight size={16} className="ml-2 transform group-hover:translate-x-1 transition-transform" />
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}
