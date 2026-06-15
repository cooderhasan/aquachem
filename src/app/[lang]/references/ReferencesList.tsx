"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Filter } from 'lucide-react';
import { Locale } from '@/lib/i18n';
import { Dictionary } from '@/lib/dictionary';

interface Category {
    id: number;
    title: string;
    description: string | null;
    image: string | null;
    slug: string;
}

interface Reference {
    id: number;
    title: string;
    image: string;
    categoryId: number | null;
}

interface ReferencesListProps {
    references: Reference[];
    categories: Category[];
    lang: Locale;
    dict: Dictionary;
}

export default function ReferencesList({ references, categories, lang, dict }: ReferencesListProps) {
    const [selectedCategory, setSelectedCategory] = useState<number | 'all'>('all');

    const filteredReferences = selectedCategory === 'all'
        ? references
        : references.filter(ref => ref.categoryId === selectedCategory);

    return (
        <div className="container-custom py-12">

            {/* Filter Tabs - Modern Design */}
            <div className="flex flex-wrap justify-center gap-4 mb-12 max-w-5xl mx-auto">
                <button
                    onClick={() => setSelectedCategory('all')}
                    className={`px-6 py-3 rounded-xl text-sm font-semibold transition-all flex items-center gap-2 ${selectedCategory === 'all'
                        ? 'bg-primary-600 text-white shadow-lg shadow-primary-500/20 scale-105'
                        : 'bg-white text-slate-500 hover:bg-slate-50 border border-slate-200 hover:border-primary-200 hover:text-primary-600'
                        }`}
                >
                    <Filter size={18} />
                    <span>{lang === 'en' ? 'All' : 'Tümü'}</span>
                </button>
                {categories.map((cat) => (
                    <button
                        key={cat.id}
                        onClick={() => setSelectedCategory(cat.id)}
                        className={`px-5 py-3 rounded-xl text-sm font-semibold transition-all flex items-center gap-2 ${selectedCategory === cat.id
                            ? 'bg-primary-600 text-white shadow-lg shadow-primary-500/20 scale-105'
                            : 'bg-white text-slate-500 hover:bg-slate-50 border border-slate-200 hover:border-primary-200 hover:text-primary-600'
                            }`}
                    >
                        <span>{cat.title}</span>
                    </button>
                ))}
            </div>

            {/* References Grid */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4 sm:p-8 md:p-12 min-h-[400px]">
                {filteredReferences.length > 0 ? (
                    <motion.div
                        layout
                        className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-10"
                    >
                        <AnimatePresence>
                            {filteredReferences.map((ref) => (
                                <motion.div
                                    layout
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.8 }}
                                    transition={{ duration: 0.3 }}
                                    key={ref.id}
                                    className="group relative flex items-center justify-center p-2 rounded-xl border border-slate-100 hover:border-primary-100 hover:shadow-lg transition-all duration-300 bg-slate-50/50"
                                >
                                    <div className="relative w-full h-[120px] sm:h-[150px] md:h-[165px] flex items-center justify-center p-1">
                                        <img
                                            src={ref.image}
                                            alt={ref.title}
                                            className="w-full h-full object-contain mix-blend-multiply transition-all duration-300"
                                        />
                                    </div>
                                    {/* Optional: Show category name on hover */}
                                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-white text-[10px] px-2 py-1 rounded-md shadow-sm text-slate-500 border border-slate-100">
                                        {categories.find(c => c.id === ref.categoryId)?.title}
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </motion.div>
                ) : (
                    <div className="text-center py-20 text-slate-400">
                        <Filter size={48} className="mx-auto mb-4 opacity-50" />
                        <p>{dict.references.noReferences}</p>
                    </div>
                )}
            </div>
        </div>
    );
}
