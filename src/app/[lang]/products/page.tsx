import React from 'react';
import Link from 'next/link';
import { Package, ArrowRight } from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import { db } from '@/lib/db';
import { categories as categoriesTable } from '@/db/schema';
import { asc } from 'drizzle-orm';
import { Metadata } from 'next';
import { Locale } from '@/lib/i18n';
import { getDictionary } from '@/lib/dictionary';

import { getAlternates } from '@/lib/seo';

export const revalidate = 60;

export async function generateMetadata({ params }: { params: Promise<{ lang: Locale }> }): Promise<Metadata> {
    const { lang } = await params;
    const dict = getDictionary(lang);
    return {
        title: dict.seo.productsTitle,
        description: dict.seo.productsDescription,
        alternates: getAlternates(lang, '/products'),
        openGraph: {
            title: `${dict.seo.productsTitle} | Aquachems`,
            description: dict.seo.productsDescription,
        },
    };
}

export default async function ProductsPage({ params }: { params: Promise<{ lang: Locale }> }) {
    const { lang } = await params;
    const dict = getDictionary(lang);

    let categories: any[] = [];
    try {
        categories = await db.select().from(categoriesTable).orderBy(asc(categoriesTable.order));
    } catch (e) {
        console.error('Failed to fetch categories:', e);
    }

    const colors = [
        'bg-blue-500', 'bg-rose-500', 'bg-teal-500', 'bg-yellow-500',
        'bg-indigo-500', 'bg-purple-500', 'bg-slate-500', 'bg-red-500',
        'bg-orange-500', 'bg-cyan-500'
    ];

    return (
        <div className="bg-slate-50 min-h-screen pb-20">
            {/* Header Banner */}
            <div className="bg-primary-900 text-white pt-48 pb-16">
                <div className="container-custom">
                    <h1 className="text-3xl md:text-5xl font-bold mb-4 text-white">{dict.products.pageTitle}</h1>
                    <p className="text-primary-200 text-lg">
                        {dict.products.pageSubtitle}
                    </p>
                </div>
            </div>

            <div className="container-custom py-12">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {categories.length > 0 ? categories.map((cat, index) => {
                        const IconComponent = LucideIcons[cat.icon as keyof typeof LucideIcons] || Package;
                        const Icon = IconComponent as any;
                        const colorClass = colors[index % colors.length];
                        const catTitle = (lang === 'en' && cat.titleEn) ? cat.titleEn : cat.title;

                        return (
                            <Link href={`/${lang}/products/${cat.slug}`} key={cat.id} className="group block">
                                <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden h-full hover:shadow-xl transition-all duration-300 flex flex-col relative">

                                    {/* Image Area */}
                                    <div className="relative h-48 overflow-hidden">
                                        {cat.image ? (
                                            <img
                                                src={cat.image}
                                                alt={catTitle}
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
                                            {catTitle}
                                        </h3>

                                        <div className="flex items-center text-sm font-medium text-slate-400 transition-colors mt-4">
                                            <span>{dict.products.browseProducts}</span>
                                            <ArrowRight size={16} className="ml-2 transform group-hover:translate-x-1 transition-transform" />
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        );
                    }) : (
                        <div className="col-span-full text-center py-20 text-slate-500">
                            {dict.products.noCategories}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
