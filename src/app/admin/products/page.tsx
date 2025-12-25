
import React from 'react';
import Link from 'next/link';
import { Plus } from 'lucide-react';
import { db } from '@/lib/db';
import { products as productsTable, categories as categoriesTable } from '@/db/schema';
import { desc, eq } from 'drizzle-orm';
import ToastParams from '@/components/admin/ToastParams';
import ProductsTable from './ProductsTable';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function ProductsPage() {
    let products: any[] = [];
    let categories: any[] = [];
    let isMock = false;
    let error = null;

    try {
        [products, categories] = await Promise.all([
            db.select({
                id: productsTable.id,
                title: productsTable.title,
                image: productsTable.image,
                categoryTitle: categoriesTable.title,
                categoryId: productsTable.categoryId,
            })
                .from(productsTable)
                .leftJoin(categoriesTable, eq(productsTable.categoryId, categoriesTable.id))
                .orderBy(desc(productsTable.id)),
            db.select({
                id: categoriesTable.id,
                title: categoriesTable.title,
            }).from(categoriesTable).orderBy(categoriesTable.title)
        ]);
    } catch (e: any) {
        console.error('Failed to fetch products:', e);
        error = e.message;
        isMock = true;
    }

    return (
        <div>
            <ToastParams />
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
                <Link
                    href="/admin/products/new"
                    className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors whitespace-nowrap"
                >
                    <Plus size={20} />
                    Yeni Ürün
                </Link>
            </div>

            <ProductsTable products={products} categories={categories} />
        </div>
    );
}
