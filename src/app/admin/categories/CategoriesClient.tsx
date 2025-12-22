"use client";

import React, { useState } from 'react';
import { Plus, Trash2, Image as ImageIcon, Pencil } from 'lucide-react';
import { createCategory, updateCategory, deleteCategory } from './actions';
import { useRouter } from 'next/navigation';

interface Category {
    id: number;
    title: string;
    slug: string;
    description: string | null;
    image: string | null;
    order: number | null;
}

interface CategoriesClientProps {
    initialCategories: Category[];
}

export default function CategoriesClient({ initialCategories }: CategoriesClientProps) {
    const router = useRouter();
    const [categories, setCategories] = useState(initialCategories);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [editingCategory, setEditingCategory] = useState<Category | null>(null);
    const [formData, setFormData] = useState({ title: '', image: '', description: '' });

    const openAddModal = () => {
        setEditingCategory(null);
        setFormData({ title: '', image: '', description: '' });
        setIsModalOpen(true);
    };

    const openEditModal = (category: Category) => {
        setEditingCategory(category);
        setFormData({
            title: category.title,
            image: category.image || '',
            description: category.description || ''
        });
        setIsModalOpen(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        const data = new FormData();
        data.append('title', formData.title);
        data.append('image', formData.image);
        data.append('description', formData.description);

        try {
            if (editingCategory) {
                data.append('id', editingCategory.id.toString());
                const result = await updateCategory(data);
                if (result.success) {
                    router.refresh();
                    setIsModalOpen(false);
                } else {
                    alert(result.error || 'Bir hata oluştu');
                }
            } else {
                const result = await createCategory(data);
                if (result.success) {
                    router.refresh();
                    setIsModalOpen(false);
                } else {
                    alert(result.error || 'Bir hata oluştu');
                }
            }
        } catch (error) {
            console.error('Form submit error:', error);
            alert('Bir hata oluştu');
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (confirm('Bu kategoriyi silmek istediğinize emin misiniz? Bu kategoriye ait tüm ürünler de silinecektir.')) {
            setIsLoading(true);
            try {
                const result = await deleteCategory(id);
                if (result.success) {
                    router.refresh();
                } else {
                    alert(result.error || 'Bir hata oluştu');
                }
            } catch (error) {
                console.error('Delete error:', error);
                alert('Bir hata oluştu');
            } finally {
                setIsLoading(false);
            }
        }
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-2xl font-bold text-slate-800">Kategoriler</h1>
                <button
                    onClick={openAddModal}
                    className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                >
                    <Plus size={20} />
                    Yeni Kategori
                </button>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-slate-50 border-b border-slate-200">
                        <tr>
                            <th className="p-4 font-semibold text-slate-600 w-20">ID</th>
                            <th className="p-4 font-semibold text-slate-600">Görsel</th>
                            <th className="p-4 font-semibold text-slate-600">Kategori Adı</th>
                            <th className="p-4 font-semibold text-slate-600">Slug</th>
                            <th className="p-4 font-semibold text-slate-600 text-right">İşlemler</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {categories.map((cat) => (
                            <tr key={cat.id} className="hover:bg-slate-50 transition-colors">
                                <td className="p-4 text-slate-500">#{cat.id}</td>
                                <td className="p-4">
                                    <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center text-slate-400 overflow-hidden">
                                        {cat.image ? (
                                            <img src={cat.image} className="w-full h-full object-cover" alt={cat.title} />
                                        ) : (
                                            <ImageIcon size={20} />
                                        )}
                                    </div>
                                </td>
                                <td className="p-4 font-medium text-slate-800">{cat.title}</td>
                                <td className="p-4 text-slate-500 text-sm">{cat.slug}</td>
                                <td className="p-4 text-right">
                                    <div className="flex items-center justify-end gap-1">
                                        <button
                                            onClick={() => openEditModal(cat)}
                                            className="text-blue-500 hover:text-blue-700 p-2 hover:bg-blue-50 rounded-lg transition-colors"
                                            title="Düzenle"
                                        >
                                            <Pencil size={18} />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(cat.id)}
                                            className="text-red-400 hover:text-red-600 p-2 hover:bg-red-50 rounded-lg transition-colors"
                                            title="Sil"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {categories.length === 0 && (
                    <div className="p-8 text-center text-slate-500">Henüz kategori eklenmemiş.</div>
                )}
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl p-6 w-full max-w-md">
                        <h2 className="text-xl font-bold mb-4">
                            {editingCategory ? 'Kategori Düzenle' : 'Yeni Kategori Ekle'}
                        </h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">Kategori Adı</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.title}
                                    onChange={e => setFormData({ ...formData, title: e.target.value })}
                                    className="w-full border border-slate-300 rounded-lg p-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                    placeholder="Örn: Genel Temizlik"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Görsel URL (Opsiyonel)</label>
                                <input
                                    type="text"
                                    value={formData.image}
                                    onChange={e => setFormData({ ...formData, image: e.target.value })}
                                    className="w-full border border-slate-300 rounded-lg p-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                    placeholder="https://..."
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Açıklama (Opsiyonel)</label>
                                <textarea
                                    value={formData.description}
                                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                                    className="w-full border border-slate-300 rounded-lg p-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                    rows={3}
                                    placeholder="Kategori açıklaması..."
                                />
                            </div>
                            <div className="flex gap-2 justify-end mt-6">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    disabled={isLoading}
                                    className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg disabled:opacity-50"
                                >
                                    İptal
                                </button>
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 flex items-center gap-2"
                                >
                                    {isLoading ? 'Kaydediliyor...' : 'Kaydet'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
