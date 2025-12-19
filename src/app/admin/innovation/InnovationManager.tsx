'use client';

import React, { useState } from 'react';
import { Plus, Trash2, Pencil, Save, X } from 'lucide-react';
import { addInnovationItem, deleteInnovationItem, updateInnovationItem } from './actions';
import { useRouter } from 'next/navigation';

interface InnovationItem {
    id: number;
    title: string;
    description: string;
    watermarkText: string | null;
    image: string | null;
    order: number | null;
}

interface InnovationManagerProps {
    initialItems: InnovationItem[];
}

export default function InnovationManager({ initialItems }: InnovationManagerProps) {
    const [items, setItems] = useState<InnovationItem[]>(initialItems);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [isAdding, setIsAdding] = useState(false);
    const router = useRouter();

    const handleDelete = async (id: number) => {
        if (!confirm('Silmek istediğinize emin misiniz?')) return;
        try {
            await deleteInnovationItem(id);
            setItems(prev => prev.filter(i => i.id !== id));
            router.refresh();
        } catch (error) {
            alert('Silme başarısız');
        }
    };

    const handleUpdate = async (e: React.FormEvent<HTMLFormElement>, id: number) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        try {
            await updateInnovationItem(id, formData);
            setEditingId(null);
            router.refresh();
            window.location.reload();
        } catch (error) {
            alert('Güncelleme başarısız');
        }
    };

    const handleAdd = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        try {
            await addInnovationItem(formData);
            setIsAdding(false);
            router.refresh();
            window.location.reload();
        } catch (error) {
            alert('Ekleme başarısız');
        }
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-2xl font-bold text-slate-800">İnovasyon Kartları</h1>
                <button
                    onClick={() => setIsAdding(true)}
                    disabled={isAdding}
                    className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                >
                    <Plus size={20} />
                    Yeni Ekle
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {isAdding && (
                    <div className="bg-blue-50 p-6 rounded-xl border border-blue-100">
                        <h3 className="font-bold text-blue-800 mb-4">Yeni Kart Ekle</h3>
                        <form onSubmit={handleAdd} className="space-y-4">
                            <input name="title" placeholder="Başlık" required className="w-full p-2 border rounded" />
                            <input name="watermarkText" placeholder="Filigran (Örn: 04)" className="w-full p-2 border rounded" />
                            <textarea name="description" placeholder="Açıklama" required rows={3} className="w-full p-2 border rounded" />
                            <div className="flex justify-end gap-2">
                                <button type="button" onClick={() => setIsAdding(false)} className="px-4 py-2 text-slate-500">İptal</button>
                                <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Kaydet</button>
                            </div>
                        </form>
                    </div>
                )}

                {items.map((item) => (
                    <div key={item.id} className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                        {editingId === item.id ? (
                            <form onSubmit={(e) => handleUpdate(e, item.id)} className="space-y-4">
                                <input name="title" defaultValue={item.title} required className="w-full p-2 border rounded font-bold" />
                                <input name="watermarkText" defaultValue={item.watermarkText || ''} placeholder="Filigran" className="w-full p-2 border rounded" />
                                <textarea name="description" defaultValue={item.description} required rows={3} className="w-full p-2 border rounded" />
                                <div className="flex justify-end gap-2">
                                    <button type="button" onClick={() => setEditingId(null)} className="px-4 py-2 text-slate-500">İptal</button>
                                    <button type="submit" className="bg-emerald-600 text-white px-4 py-2 rounded">Güncelle</button>
                                </div>
                            </form>
                        ) : (
                            <div>
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <h3 className="text-xl font-bold text-slate-800">{item.title}</h3>
                                        <div className="text-9xl absolute pointer-events-none opacity-[0.03] -mt-10 ml-40 font-bold select-none">
                                            {item.watermarkText}
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <button onClick={() => setEditingId(item.id)} className="p-2 text-slate-400 hover:text-blue-600 rounded">
                                            <Pencil size={18} />
                                        </button>
                                        <button onClick={() => handleDelete(item.id)} className="p-2 text-slate-400 hover:text-red-600 rounded">
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </div>
                                <p className="text-slate-600 relative z-10">{item.description}</p>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
