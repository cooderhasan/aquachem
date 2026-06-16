'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, Loader2, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { searchProducts } from '@/app/actions/search';
import { Locale } from '@/lib/i18n';

// Simulating a useDebounce hook if not exists or just keep simple inside
function useDebounceValue<T>(value: T, delay: number): T {
    const [debouncedValue, setDebouncedValue] = useState<T>(value);
    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);
        return () => {
            clearTimeout(handler);
        };
    }, [value, delay]);
    return debouncedValue;
}

interface SearchModalProps {
    isOpen: boolean;
    onClose: () => void;
    lang?: Locale;
}

export default function SearchModal({ isOpen, onClose, lang = 'tr' }: SearchModalProps) {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);
    const debouncedQuery = useDebounceValue(query, 500);

    // Focus input on open
    useEffect(() => {
        if (isOpen) {
            setTimeout(() => {
                inputRef.current?.focus();
            }, 100);
            // Prevent body scroll
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
            // Clear query on close if desired, or keep it
            // setQuery('');
        }
        return () => { document.body.style.overflow = 'unset'; };
    }, [isOpen]);

    // Handle search
    useEffect(() => {
        async function fetchResults() {
            if (!debouncedQuery || debouncedQuery.length < 2) {
                setResults([]);
                return;
            }

            setIsLoading(true);
            try {
                const data = await searchProducts(debouncedQuery);
                setResults(data);
            } catch (error) {
                console.error(error);
            } finally {
                setIsLoading(false);
            }
        }

        fetchResults();
    }, [debouncedQuery]);

    // Close on ESC
    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, [onClose]);

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm z-[60]"
                    />

                    {/* Modal Content */}
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.2 }}
                        className="fixed top-0 left-0 right-0 z-[70] p-4 pt-8 md:pt-12"
                    >
                        <div className="container-custom max-w-3xl mx-auto">
                            <div className="relative">
                                {/* Close Button */}
                                <button
                                    onClick={onClose}
                                    className="absolute -top-12 right-0 md:-right-12 text-white/70 hover:text-white p-2 transition-colors"
                                >
                                    <X size={32} />
                                </button>

                                {/* Search Input */}
                                <div className="relative bg-white rounded-2xl shadow-2xl overflow-hidden">
                                    <div className="flex items-center border-b border-slate-100 p-2">
                                        <div className="p-4 text-slate-400">
                                            <Search size={24} />
                                        </div>
                                        <input
                                            ref={inputRef}
                                            type="text"
                                            value={query}
                                            onChange={(e) => setQuery(e.target.value)}
                                            placeholder={lang === 'en' ? 'Search product name, description or feature...' : 'Ürün adı, açıklama veya özellik ara...'}
                                            className="w-full h-14 text-lg md:text-xl text-slate-800 placeholder:text-slate-400 focus:outline-none bg-transparent"
                                        />
                                        {query && (
                                            <button
                                                onClick={() => setQuery('')}
                                                className="p-4 text-slate-400 hover:text-slate-600"
                                            >
                                                <X size={20} />
                                            </button>
                                        )}
                                    </div>

                                    {/* Results Area */}
                                    <div className="max-h-[60vh] overflow-y-auto custom-scrollbar bg-slate-50/50">
                                        {/* Loading State */}
                                        {isLoading && (
                                            <div className="flex flex-col items-center justify-center py-12 text-slate-400">
                                                <Loader2 size={32} className="animate-spin mb-4 text-primary-500" />
                                                <p>{lang === 'en' ? 'Searching...' : 'Aranıyor...'}</p>
                                            </div>
                                        )}

                                        {/* No Results (only show if query exists and not loading) */}
                                        {!isLoading && query.length >= 2 && results.length === 0 && (
                                            <div className="flex flex-col items-center justify-center py-12 text-slate-400">
                                                <Search size={48} className="mb-4 opacity-20" />
                                                <p>{lang === 'en' ? `No results found for "${query}".` : `"${query}" için sonuç bulunamadı.`}</p>
                                            </div>
                                        )}

                                        {/* Initial State (No query) */}
                                        {!query && (
                                            <div className="py-12 px-8 text-center text-slate-400">
                                                <p className="text-sm">{lang === 'en' ? 'Start typing to begin search.' : 'Aramaya başlamak için yazmaya başlayın.'}</p>
                                            </div>
                                        )}

                                        {/* Results List */}
                                        {!isLoading && results.length > 0 && (
                                            <div className="divide-y divide-slate-100">
                                                {results.map((product) => {
                                                    const prodTitle = (lang === 'en' && product.titleEn) ? product.titleEn : product.title;
                                                    const prodDesc = (() => {
                                                        const desc = lang === 'en'
                                                            ? (product.shortDescriptionEn || product.descriptionEn || '')
                                                            : (product.shortDescription || product.description || '');
                                                        if (desc) {
                                                            return desc.substring(0, 100) + (desc.length > 100 ? '...' : '');
                                                        }
                                                        return lang === 'en' ? 'Explore product details' : 'Ürün detaylarını inceleyin';
                                                    })();

                                                    return (
                                                        <Link
                                                            key={product.id}
                                                            href={product.categorySlug ? `/${lang}/products/${product.categorySlug}/${product.slug}` : `/${lang}/products/search/${product.slug}`}
                                                            onClick={onClose}
                                                            className="flex items-center gap-4 p-4 hover:bg-primary-50 transition-colors group"
                                                        >
                                                            <div className="w-16 h-16 bg-white rounded-lg border border-slate-200 p-1 flex-shrink-0 flex items-center justify-center">
                                                                {product.image ? (
                                                                    <img src={product.image} alt={prodTitle} className="max-w-full max-h-full object-contain" />
                                                                ) : (
                                                                    <Search size={20} className="text-slate-300" />
                                                                )}
                                                            </div>
                                                            <div className="flex-1 min-w-0">
                                                                <h4 className="font-bold text-slate-800 group-hover:text-primary-700 truncate">{prodTitle}</h4>
                                                                <p className="text-sm text-slate-500 truncate">
                                                                    {prodDesc}
                                                                </p>
                                                            </div>
                                                            <div className="text-slate-300 group-hover:text-primary-400 group-hover:translate-x-1 transition-all">
                                                                <ArrowRight size={20} />
                                                            </div>
                                                        </Link>
                                                    );
                                                })}
                                            </div>
                                        )}
                                    </div>
                                    {results.length > 0 && (
                                        <div className="bg-slate-50 p-2 text-center text-xs text-slate-400 border-t border-slate-100">
                                            {lang === 'en' ? `Found ${results.length} results in total.` : `Toplam ${results.length} sonuç bulundu.`}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
