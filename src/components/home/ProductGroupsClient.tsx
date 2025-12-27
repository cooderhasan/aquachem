"use client";

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ArrowRight, Package } from 'lucide-react';
import * as LucideIcons from 'lucide-react';

interface Category {
    id: number;
    title: string;
    slug: string;
    image: string;
    iconName: string;
    color: string;
}

interface ProductGroupsClientProps {
    categories: Category[];
}

export default function ProductGroupsClient({ categories }: ProductGroupsClientProps) {
    // Helper to get icon component dynamically
    const getIcon = (iconName: string) => {
        const Icon = (LucideIcons as any)[iconName] || Package;
        return Icon;
    };

    // Map of colors for variety based on index if DB doesn't have them
    const colors = [
        'bg-blue-500', 'bg-rose-500', 'bg-teal-500', 'bg-yellow-500',
        'bg-indigo-500', 'bg-purple-500', 'bg-slate-500', 'bg-red-500',
        'bg-orange-500', 'bg-cyan-500'
    ];

    return (
        <section className="py-20 bg-slate-50">
            <div className="container-custom">
                <div className="text-center mb-16">
                    <span className="inline-block bg-primary-100 text-primary-700 text-sm font-bold px-4 py-1.5 rounded-full mb-4 uppercase tracking-wider">Kapsamlı Çözümler</span>
                    <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Ürün Gruplarımız</h2>
                    <p className="text-slate-600 max-w-2xl mx-auto text-lg">
                        Endüstriyel ve bireysel ihtiyaçlarınız için özel olarak formüle edilmiş geniş ürün yelpazemiz.
                    </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {categories.map((cat, index) => {
                        const Icon = getIcon(cat.iconName);
                        const colorClass = colors[index % colors.length]; // Cycle through colors

                        return (
                            <motion.div
                                key={cat.id}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.05 }}
                                whileHover={{ y: -5 }}
                            >
                                <Link href={`/products/${cat.slug}`} className="group block h-full">
                                    <div className="bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 h-full border border-slate-100 overflow-hidden flex flex-col">

                                        {/* Image Area */}
                                        <div className="relative h-48 overflow-hidden">
                                            {cat.image ? (
                                                <Image
                                                    src={cat.image}
                                                    alt={cat.title}
                                                    fill
                                                    sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                                                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                                                />
                                            ) : (
                                                <div className="w-full h-full bg-slate-200 flex items-center justify-center">
                                                    <Package className="text-slate-400" size={48} />
                                                </div>
                                            )}
                                            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent"></div>

                                            {/* Icon floating on image */}
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
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
