'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { Pencil, Search, ChevronLeft, ChevronRight, Filter } from 'lucide-react';
import DeleteProductButton from './DeleteProductButton';

interface Product {
    id: number;
    title: string;
    image: string | null;
    categoryTitle: string | null;
    categoryId: number | null;
}

interface Category {
    id: number;
    title: string;
}

interface ProductsTableProps {
    products: Product[];
    categories: Category[];
}

const ITEMS_PER_PAGE = 20;

export default function ProductsTable({ products, categories }: ProductsTableProps) {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
    const [currentPage, setCurrentPage] = useState(1);

    // Filtreleme
    const filteredProducts = useMemo(() => {
        return products.filter(product => {
            const matchesSearch = product.title.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesCategory = selectedCategory === null || product.categoryId === selectedCategory;
            return matchesSearch && matchesCategory;
        });
    }, [products, searchQuery, selectedCategory]);

    // Pagination hesaplamaları
    const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const paginatedProducts = filteredProducts.slice(startIndex, startIndex + ITEMS_PER_PAGE);

    // Filtre değiştiğinde sayfa 1'e dön
    const handleSearchChange = (value: string) => {
        setSearchQuery(value);
        setCurrentPage(1);
    };

    const handleCategoryChange = (value: number | null) => {
        setSelectedCategory(value);
        setCurrentPage(1);
    };

    return (
        <div>
            {/* Filtreler */}
            <div className="flex flex-col md:flex-row gap-3 mb-6">
                {/* Arama */}
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input
                        type="text"
                        placeholder="Ürün Ara..."
                        value={searchQuery}
                        onChange={(e) => handleSearchChange(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    />
                </div>

                {/* Kategori Filtresi */}
                <div className="relative md:w-64">
                    <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <select
                        value={selectedCategory ?? ''}
                        onChange={(e) => handleCategoryChange(e.target.value ? Number(e.target.value) : null)}
                        className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white appearance-none cursor-pointer"
                    >
                        <option value="">Tüm Kategoriler</option>
                        {categories.map(cat => (
                            <option key={cat.id} value={cat.id}>{cat.title}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Sonuç bilgisi */}
            <div className="flex justify-between items-center mb-4">
                <p className="text-sm text-slate-500">
                    {filteredProducts.length} ürün bulundu
                    {searchQuery && <span className="ml-1">(&quot;{searchQuery}&quot; için)</span>}
                    {selectedCategory && (
                        <span className="ml-1">
                            - {categories.find(c => c.id === selectedCategory)?.title}
                        </span>
                    )}
                </p>
                {(searchQuery || selectedCategory) && (
                    <button
                        onClick={() => {
                            setSearchQuery('');
                            setSelectedCategory(null);
                            setCurrentPage(1);
                        }}
                        className="text-sm text-primary-600 hover:text-primary-700 font-medium"
                    >
                        Filtreleri Temizle
                    </button>
                )}
            </div>

            {/* Tablo */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-slate-50 border-b border-slate-200">
                        <tr>
                            <th className="p-4 font-semibold text-slate-600 w-20">ID</th>
                            <th className="p-4 font-semibold text-slate-600 w-24">Görsel</th>
                            <th className="p-4 font-semibold text-slate-600">Ürün Adı</th>
                            <th className="p-4 font-semibold text-slate-600">Kategori</th>
                            <th className="p-4 font-semibold text-slate-600">Durum</th>
                            <th className="p-4 font-semibold text-slate-600 text-right">İşlemler</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {paginatedProducts.length === 0 ? (
                            <tr>
                                <td colSpan={6} className="p-8 text-center text-slate-500">
                                    {searchQuery || selectedCategory
                                        ? 'Arama kriterlerine uygun ürün bulunamadı.'
                                        : 'Henüz ürün eklenmemiş.'}
                                </td>
                            </tr>
                        ) : (
                            paginatedProducts.map((product) => (
                                <tr key={product.id} className="hover:bg-slate-50 transition-colors">
                                    <td className="p-4 text-slate-600">#{product.id}</td>
                                    <td className="p-4">
                                        <div className="w-12 h-12 rounded-lg bg-slate-100 overflow-hidden">
                                            <img
                                                src={product.image || 'https://placehold.co/100'}
                                                alt={product.title}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                    </td>
                                    <td className="p-4 font-medium text-slate-800">{product.title}</td>
                                    <td className="p-4 text-slate-600">
                                        <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-sm font-medium">
                                            {product.categoryTitle || 'Kategorisiz'}
                                        </span>
                                    </td>
                                    <td className="p-4">
                                        <span className="flex items-center gap-1 text-emerald-600 text-sm font-medium">
                                            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                                            Yayında
                                        </span>
                                    </td>
                                    <td className="p-4 text-right">
                                        <div className="flex justify-end gap-2">
                                            <Link href={`/admin/products/${product.id}`} className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                                                <Pencil size={18} />
                                            </Link>
                                            <DeleteProductButton id={product.id} />
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex items-center justify-between mt-6">
                    <p className="text-sm text-slate-500">
                        Sayfa {currentPage} / {totalPages}
                        <span className="ml-2">
                            (Gösterilen: {startIndex + 1}-{Math.min(startIndex + ITEMS_PER_PAGE, filteredProducts.length)})
                        </span>
                    </p>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                            disabled={currentPage === 1}
                            className="flex items-center gap-1 px-3 py-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            <ChevronLeft size={18} />
                            <span className="hidden sm:inline">Önceki</span>
                        </button>

                        {/* Sayfa numaraları */}
                        <div className="hidden md:flex items-center gap-1">
                            {Array.from({ length: totalPages }, (_, i) => i + 1)
                                .filter(page => {
                                    return page === 1 || page === totalPages || Math.abs(page - currentPage) <= 1;
                                })
                                .map((page, index, arr) => (
                                    <React.Fragment key={page}>
                                        {index > 0 && arr[index - 1] !== page - 1 && (
                                            <span className="px-2 text-slate-400">...</span>
                                        )}
                                        <button
                                            onClick={() => setCurrentPage(page)}
                                            className={`w-10 h-10 rounded-lg font-medium transition-colors ${currentPage === page
                                                    ? 'bg-primary-600 text-white'
                                                    : 'border border-slate-200 text-slate-600 hover:bg-slate-50'
                                                }`}
                                        >
                                            {page}
                                        </button>
                                    </React.Fragment>
                                ))}
                        </div>

                        <button
                            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                            disabled={currentPage === totalPages}
                            className="flex items-center gap-1 px-3 py-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            <span className="hidden sm:inline">Sonraki</span>
                            <ChevronRight size={18} />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
