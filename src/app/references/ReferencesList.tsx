"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Filter } from 'lucide-react';
import * as LucideIcons from 'lucide-react';

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
}

export default function ReferencesList({ references, categories }: ReferencesListProps) {
    const [selectedCategory, setSelectedCategory] = useState<number | 'all'>('all');

    const filteredReferences = selectedCategory === 'all'
        ? references
        : references.filter(ref => ref.categoryId === selectedCategory);

    // Helper to get icon component if needed, or just use category data.
    // Assuming category icon/color logic was hardcoded or we rely on DB data.
    // In DB we don't store icon/color. We'll use simple style or just title.

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
                    <span>Tümü</span>
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
                        {/* <cat.icon ... /> We don't have icon in DB yet, just text for now */}
                        <span>{cat.title}</span>
                    </button>
                ))}
            </div>

            {/* References Grid */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8 md:p-12 min-h-[400px]">
                {filteredReferences.length > 0 ? (
                    <motion.div
                        layout
                        className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 md:gap-12"
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
                                    className="group relative flex items-center justify-center p-6 rounded-xl border border-slate-100 hover:border-primary-100 hover:shadow-lg transition-all duration-300 bg-slate-50/50"
                                >
                                    <div className="relative w-full h-[100px] grayscale group-hover:grayscale-0 opacity-60 group-hover:opacity-100 transition-all duration-300">
                                        <img
                                            src={ref.image}
                                            alt={ref.title}
                                            className="w-full h-full object-contain"
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
                        <p>Bu kategoride henüz referans eklenmemiş.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
