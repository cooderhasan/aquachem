"use client";

import React, { useState } from 'react';
import { Plus, Trash2, Image as ImageIcon } from 'lucide-react';

// Mock data (replace with real DB fetch later)
const initialCategories = [
    { id: 1, title: 'Genel Temizlik', image: '' },
    { id: 2, title: 'Dezenfektan Grubu', image: '' },
];

export default function CategoriesPage() {
    const [categories, setCategories] = useState(initialCategories);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newCategory, setNewCategory] = useState({ title: '', image: '' });

    // Simple handler to simulate adding (UI only for now)
    const handleAdd = (e: React.FormEvent) => {
        e.preventDefault();
        setCategories([...categories, { id: Date.now(), title: newCategory.title, image: newCategory.image }]);
        setNewCategory({ title: '', image: '' });
        setIsModalOpen(false);
    };

    const handleDelete = (id: number) => {
        if (confirm('Silmek istediğinize emin misiniz?')) {
            setCategories(categories.filter(c => c.id !== id));
        }
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-2xl font-bold text-slate-800">Kategoriler</h1>
                <button
                    onClick={() => setIsModalOpen(true)}
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
                            <th className="p-4 font-semibold text-slate-600 text-right">İşlemler</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {categories.map((cat) => (
                            <tr key={cat.id} className="hover:bg-slate-50 transition-colors">
                                <td className="p-4 text-slate-500">#{cat.id}</td>
                                <td className="p-4">
                                    <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center text-slate-400">
                                        {cat.image ? <img src={cat.image} className="w-full h-full object-cover rounded-lg" /> : <ImageIcon size={20} />}
                                    </div>
                                </td>
                                <td className="p-4 font-medium text-slate-800">{cat.title}</td>
                                <td className="p-4 text-right">
                                    <button
                                        onClick={() => handleDelete(cat.id)}
                                        className="text-red-400 hover:text-red-600 p-2 hover:bg-red-50 rounded-lg transition-colors"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {categories.length === 0 && (
                    <div className="p-8 text-center text-slate-500">Henüz kategori eklenmemiş.</div>
                )}
            </div>

            {/* Simple Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl p-6 w-full max-w-md">
                        <h2 className="text-xl font-bold mb-4">Yeni Kategori Ekle</h2>
                        <form onSubmit={handleAdd} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">Başlık</label>
                                <input
                                    type="text"
                                    required
                                    value={newCategory.title}
                                    onChange={e => setNewCategory({ ...newCategory, title: e.target.value })}
                                    className="w-full border rounded-lg p-2"
                                />
                            </div>
                            <div className="flex gap-2 justify-end mt-6">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg"
                                >
                                    İptal
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
                                >
                                    Kaydet
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
