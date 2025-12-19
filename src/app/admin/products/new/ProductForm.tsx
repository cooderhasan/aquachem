'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Upload, Loader2 } from 'lucide-react';
import { createProduct } from '../actions';

interface Category {
    id: number;
    title: string;
}

interface Product {
    id: number;
    title: string;
    categoryId: number | null;
    description: string | null;
    usage: string | null;
    slug: string;
    image: string | null;
}

interface ProductFormProps {
    categories: Category[];
    product?: Product;
}

export default function ProductForm({ categories, product }: ProductFormProps) {
    const [loading, setLoading] = useState(false);
    const isEditing = !!product;

    async function clientAction(formData: FormData) {
        setLoading(true);
        if (isEditing && product) {
            // Append ID for update
            formData.append('id', product.id.toString());
            // We need to import updateProduct. Since it's a server action, 
            // we should probably pass it as a prop or import it.
            // For now, let's assume we import it or handle it here.
            // Ideally, we'd have separate logic, but let's dynamically import or use a conditional.
            // Since we can't easily dynamically swap actions in the form attribute without client JS,
            // we'll handle the call ourselves.
            const { updateProduct } = await import('../actions');
            await updateProduct(formData);
        } else {
            await createProduct(formData);
        }
    }

    return (
        <div className="max-w-4xl mx-auto">
            <div className="mb-6">
                <Link href="/admin/products" className="text-slate-500 hover:text-slate-800 flex items-center gap-2 mb-2 font-medium">
                    <ArrowLeft size={18} />
                    Ürünlere Dön
                </Link>
                <h1 className="text-2xl font-bold text-slate-800">
                    {isEditing ? 'Ürünü Düzenle' : 'Yeni Ürün Ekle'}
                </h1>
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
                                defaultValue={product?.title}
                                className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Kategori</label>
                            <select
                                name="categoryId"
                                defaultValue={product?.categoryId || ''}
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
                            {product?.image && (
                                <img src={product.image} alt="Current" className="mx-auto h-32 object-cover mb-4 rounded-lg" />
                            )}
                            <Upload className="mx-auto text-slate-400 mb-2" size={32} />
                            <p className="text-slate-500 text-sm">Görsel seçmek için tıklayın veya sürükleyin</p>
                            <input type="file" className="hidden" accept="image/*" />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Ürün Açıklaması</label>
                        <textarea
                            name="description"
                            defaultValue={product?.description || ''}
                            className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none h-32"
                            placeholder="Ürün özelliklerini buraya yazın..."
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Kullanım Alanları</label>
                        <textarea
                            name="usage"
                            defaultValue={product?.usage || ''}
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
                            {loading ? 'Kaydediliyor...' : (isEditing ? 'Güncelle' : 'Ürünü Kaydet')}
                        </button>
                    </div>

                </form>
            </div>
        </div>
    );
}
