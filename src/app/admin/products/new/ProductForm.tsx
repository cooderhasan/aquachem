'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { createProduct } from '../actions';
import ImageUpload from '@/components/ui/ImageUpload';
import ToastParams from '@/components/admin/ToastParams';
import { toast } from 'sonner';

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
    const [image, setImage] = useState(product?.image || '');
    const isEditing = !!product;

    const router = useRouter(); // Import useRouter at top level

    async function clientAction(formData: FormData) {
        setLoading(true);
        try {
            let result;
            if (isEditing && product) {
                formData.append('id', product.id.toString());
                const { updateProduct } = await import('../actions');
                result = await updateProduct(formData);
            } else {
                result = await createProduct(formData);
            }

            if (result.success) {
                toast.success(result.message);
                // Toast mesajının görünmesi için kısa bir gecikme
                setTimeout(() => {
                    router.push('/admin/products');
                    router.refresh();
                }, 1500);
            } else {
                toast.error(result.message);
                setLoading(false);
            }
        } catch (error) {
            setLoading(false);
            console.error(error);
            toast.error('Beklenmedik bir hata oluştu');
        }
    }

    return (
        <div className="max-w-4xl mx-auto">
            <Suspense fallback={null}>
                <ToastParams />
            </Suspense>
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
                        <ImageUpload
                            value={image}
                            onChange={(url) => setImage(url)}
                            onRemove={() => setImage('')}
                        />
                        <input type="hidden" name="image" value={image} />
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
