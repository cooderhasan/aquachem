'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Upload, Loader2 } from 'lucide-react';
import { createProduct } from '../actions';

interface Category {
    id: number;
    title: string;
}

interface ProductFormProps {
    categories: Category[];
}

export default function ProductForm({ categories }: ProductFormProps) {
    const [loading, setLoading] = useState(false);

    // We can use the server action directly in the form action, 
    // but for specific UI loading states we might wrap it.
    // However, simplest way with current Next.js is using `action` prop or handleSubmit.

    // For this example let's stick to standard form submission to server action
    // but we want to show loading state.

    // Note: To properly show loading with Server Actions + useFormStatus is better, 
    // but here we can just use a wrapper.

    async function clientAction(formData: FormData) {
        setLoading(true);
        await createProduct(formData);
        // Redirect happens on server, so client state update might be moot if redirect works fast.
    }

    return (
        <div className="max-w-4xl mx-auto">
            <div className="mb-6">
                <Link href="/admin/products" className="text-slate-500 hover:text-slate-800 flex items-center gap-2 mb-2 font-medium">
                    <ArrowLeft size={18} />
                    Ürünlere Dön
                </Link>
                <h1 className="text-2xl font-bold text-slate-800">Yeni Ürün Ekle</h1>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
                <form action={clientAction} className="space-y-6">

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Ürün Adı</label>
                            <input
                                name="title"
                                type="text"
                                required
                                className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Kategori</label>
                            <select
                                name="categoryId"
                                className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none bg-white"
                            >
                                {categories.map((cat) => (
                                    <option key={cat.id} value={cat.id}>
                                        {cat.title}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Ürün Görseli</label>
                        <div className="border-2 border-dashed border-slate-300 rounded-xl p-8 hover:bg-slate-50 transition-colors cursor-pointer text-center">
                            <Upload className="mx-auto text-slate-400 mb-2" size={32} />
                            <p className="text-slate-500 text-sm">Görsel seçmek için tıklayın veya sürükleyin</p>
                            <input type="file" className="hidden" accept="image/*" />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Ürün Açıklaması</label>
                        <textarea
                            name="description"
                            className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none h-32"
                            placeholder="Ürün özelliklerini buraya yazın..."
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Kullanım Alanları</label>
                        <textarea
                            name="usage"
                            className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none h-24"
                            placeholder="Örn: Otomotiv, Tekstil, Gıda sanayi..."
                        />
                    </div>

                    <div className="flex justify-end pt-4">
                        <button
                            type="submit"
                            disabled={loading}
                            className="bg-primary-600 hover:bg-primary-700 text-white px-8 py-3 rounded-lg font-medium flex items-center gap-2 disabled:opacity-70"
                        >
                            {loading && <Loader2 size={18} className="animate-spin" />}
                            {loading ? 'Kaydediliyor...' : 'Ürünü Kaydet'}
                        </button>
                    </div>

                </form>
            </div>
        </div>
    );
}
