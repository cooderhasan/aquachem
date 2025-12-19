'use client';

import React, { useState } from 'react';
import { Plus, Trash2, Pencil, Check, X } from 'lucide-react';
import { addStat, deleteStat, updateStat } from './actions';
import { useRouter } from 'next/navigation';

interface Stat {
    id: number;
    label: string;
    value: string;
    icon: string;
    order: number | null;
}

interface StatsManagerProps {
    initialStats: Stat[];
}

export default function StatsManager({ initialStats }: StatsManagerProps) {
    const [stats, setStats] = useState<Stat[]>(initialStats);
    const [isAdding, setIsAdding] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);
    const router = useRouter();

    const handleDelete = async (id: number) => {
        if (!confirm('Silmek istediğinize emin misiniz?')) return;
        try {
            await deleteStat(id);
            setStats(prev => prev.filter(s => s.id !== id));
            router.refresh();
        } catch (error) {
            alert('Silme başarısız');
        }
    };

    const handleAdd = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        try {
            await addStat(formData);
            setIsAdding(false);
            router.refresh();
            window.location.reload();
        } catch (error) {
            alert('Ekleme başarısız');
        }
    };

    const handleUpdate = async (e: React.FormEvent<HTMLFormElement>, id: number) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        try {
            await updateStat(id, formData);
            setEditingId(null);
            router.refresh();
            window.location.reload();
        } catch (error) {
            alert('Güncelleme başarısız');
        }
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-2xl font-bold text-slate-800">Rakamlarla Biz</h1>
                <button
                    onClick={() => setIsAdding(true)}
                    disabled={isAdding}
                    className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                >
                    <Plus size={20} />
                    Yeni Ekle
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {isAdding && (
                    <div className="bg-blue-50 p-6 rounded-xl border border-blue-100 flex flex-col justify-between h-48">
                        <form onSubmit={handleAdd} className="space-y-2">
                            <input name="value" placeholder="Değer (50+)" required className="w-full p-2 border rounded font-mono text-xl" />
                            <input name="label" placeholder="Etiket (Ülke)" required className="w-full p-2 border rounded text-sm" />
                            <input name="icon" type="hidden" value="Target" />
                            {/* Icon selection skipped for simplicity, using default */}
                            <div className="flex justify-end gap-2 pt-2">
                                <button type="button" onClick={() => setIsAdding(false)} className="p-2 bg-slate-300 rounded hover:bg-slate-400">
                                    <X size={16} />
                                </button>
                                <button type="submit" className="p-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                                    <Check size={16} />
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                {stats.map((stat) => (
                    <div key={stat.id} className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex flex-col items-center justify-center text-center relative group h-48">
                        {editingId === stat.id ? (
                            <form onSubmit={(e) => handleUpdate(e, stat.id)} className="w-full space-y-2">
                                <input name="value" defaultValue={stat.value} required className="w-full p-2 border rounded text-center font-bold text-xl" />
                                <input name="label" defaultValue={stat.label} required className="w-full p-2 border rounded text-center text-sm" />
                                <div className="flex justify-center gap-2 mt-2">
                                    <button type="button" onClick={() => setEditingId(null)} className="p-1 bg-slate-200 rounded">
                                        <X size={16} />
                                    </button>
                                    <button type="submit" className="p-1 bg-emerald-600 text-white rounded">
                                        <Check size={16} />
                                    </button>
                                </div>
                            </form>
                        ) : (
                            <>
                                <div className="text-4xl font-bold text-slate-800 mb-2">{stat.value}</div>
                                <div className="text-slate-500 font-medium">{stat.label}</div>

                                <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button onClick={() => setEditingId(stat.id)} className="p-1.5 text-slate-400 hover:text-blue-600 bg-slate-50 hover:bg-blue-50 rounded">
                                        <Pencil size={14} />
                                    </button>
                                    <button onClick={() => handleDelete(stat.id)} className="p-1.5 text-slate-400 hover:text-red-600 bg-slate-50 hover:bg-red-50 rounded">
                                        <Trash2 size={14} />
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
