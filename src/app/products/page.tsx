import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowRight, Package } from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import { db } from '@/lib/db';
import { categories as categoriesTable } from '@/db/schema';
import { asc } from 'drizzle-orm';
import { Metadata } from 'next';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
    title: 'Ürün Grupları | Aquachems',
    description: 'Aquachems endüstriyel ve bireysel ürün gruplarını inceleyin.',
};

export default async function ProductsPage() {
    let categories: any[] = [];

    try {
        categories = await db.select().from(categoriesTable).orderBy(asc(categoriesTable.order));
    } catch (e) {
        console.error('Failed to fetch categories:', e);
    }

    // Helper to get icon component dynamically
    // Note: since this is server component we can't iterate LucideIcons easily for rendering as component in loop if not careful, 
    // but here we are just selecting icon.
    // Actually, Lucide icons are valid React components.

    // Map of colors for variety
    const colors = [
        'bg-blue-500', 'bg-rose-500', 'bg-teal-500', 'bg-yellow-500',
        'bg-indigo-500', 'bg-purple-500', 'bg-slate-500', 'bg-red-500',
        'bg-orange-500', 'bg-cyan-500'
    ];

    return (
        <div className="bg-slate-50 min-h-screen pb-20 pt-28">
            {/* Header Banner */}
            <div className="bg-primary-900 text-white py-16">
                <div className="container-custom">
                    <h1 className="text-3xl md:text-5xl font-bold mb-4 text-white">Ürün Grupları</h1>
                    <p className="text-primary-200 text-lg">
                        İncelemek istediğiniz ürün grubunu seçiniz.
                    </p>
                </div>
            </div>

            <div className="container-custom py-12">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {categories.length > 0 ? categories.map((cat, index) => {
                        // Dynamic icon handling if icon name was stored, else default
                        const Icon = LucideIcons[cat.icon as keyof typeof LucideIcons] || Package;
                        const colorClass = colors[index % colors.length];

                        return (
                            <Link href={`/products/${cat.slug}`} key={cat.id} className="group block">
                                <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden h-full hover:shadow-xl transition-all duration-300 flex flex-col relative">

                                    {/* Image Area */}
                                    <div className="relative h-48 overflow-hidden">
                                        {cat.image ? (
                                            <img
                                                src={cat.image}
                                                alt={cat.title}
                                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                            />
                                        ) : (
                                            <div className="w-full h-full bg-slate-200 flex items-center justify-center">
                                                <Package size={48} className="text-slate-400" />
                                            </div>
                                        )}
                                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent"></div>
                                        <div className={`absolute bottom-4 left-4 w-10 h-10 ${colorClass} rounded-lg flex items-center justify-center text-white shadow-lg`}>
                                            <Icon size={20} />
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
                        );
                    }) : (
                        <div className="col-span-full text-center py-20 text-slate-500">
                            Henüz kategori eklenmemiş.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
