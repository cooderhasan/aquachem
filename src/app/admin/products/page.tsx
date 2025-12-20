
import React from 'react';
import Link from 'next/link';
import { Plus, Pencil, Trash2, Search } from 'lucide-react';
import { getProducts } from './actions';

export default async function ProductsPage() {
    const { products, isMock, error } = await getProducts();

    return (
        <div>
            {isMock && (
                <div className="bg-amber-50 border-l-4 border-amber-500 p-4 mb-6 rounded-r-lg">
                    <div className="flex items-center">
                        <div className="flex-shrink-0">
                            <svg className="h-5 w-5 text-amber-500" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <div className="ml-3">
                            <h3 className="text-sm leading-5 font-medium text-amber-800">
                                Demo Modu Aktif
                            </h3>
                            <div className="mt-2 text-sm leading-5 text-amber-700">
                                <p>
                                    Veritabanı bağlantısı sağlanamadığı için şu anda demo verileri görüntüleniyor.
                                    Bu modda yapılan değişiklikler kaydedilmeyecektir.
                                </p>
                                {error && (
                                    <p className="mt-2 font-mono text-xs bg-amber-100 p-2 rounded">
                                        Hata Detayı: {error}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <h1 className="text-2xl font-bold text-slate-800">Ürünler</h1>

                <div className="flex gap-3 w-full md:w-auto">
                    <div className="relative flex-1 md:w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input
                            type="text"
                            placeholder="Ürün Ara..."
                            className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                        />
                    </div>
                    <Link
                        href="/admin/products/new"
                        className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors whitespace-nowrap"
                    >
                        <Plus size={20} />
                        Yeni Ürün
                    </Link>
                </div>
            </div>

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
                        {products.length === 0 ? (
                            <tr>
                                <td colSpan={6} className="p-8 text-center text-slate-500">
                                    Henüz ürün eklenmemiş.
                                </td>
                            </tr>
                        ) : (
                            products.map((product) => (
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
                                            {product.categoryTitle}
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
                                            <button className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
