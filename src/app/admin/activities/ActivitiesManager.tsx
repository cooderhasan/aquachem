'use client';

import React, { useState } from 'react';
import { Plus, Trash2, Pencil, Check, X, GripVertical } from 'lucide-react';
import { addActivity, deleteActivity, updateActivity } from './actions';
import { useRouter } from 'next/navigation';

interface Activity {
    id: number;
    title: string;
    order: number | null;
    isActive: boolean | null;
}

interface ActivitiesManagerProps {
    initialActivities: Activity[];
}

export default function ActivitiesManager({ initialActivities }: ActivitiesManagerProps) {
    const [activities, setActivities] = useState<Activity[]>(initialActivities);
    const [isAdding, setIsAdding] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);
    const router = useRouter();

    const handleDelete = async (id: number) => {
        if (!confirm('Silmek istediğinize emin misiniz?')) return;
        try {
            await deleteActivity(id);
            setActivities(prev => prev.filter(a => a.id !== id));
            router.refresh();
        } catch (error) {
            console.error(error);
            alert('Silme başarısız');
        }
    };

    const handleAdd = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        try {
            await addActivity(formData);
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
            await updateActivity(id, formData);
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
                <h1 className="text-2xl font-bold text-slate-800">Faaliyet Alanları</h1>
                <button
                    onClick={() => setIsAdding(true)}
                    disabled={isAdding}
                    className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                >
                    <Plus size={20} />
                    Yeni Ekle
                </button>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden max-w-2xl">
                {/* Header */}
                <div className="bg-slate-50 border-b border-slate-200 p-4 font-semibold text-slate-600 flex justify-between">
                    <span>Faaliyet Tanımı</span>
                    <span>İşlemler</span>
                </div>

                {/* Add New Row */}
                {isAdding && (
                    <form onSubmit={handleAdd} className="p-4 border-b border-slate-100 bg-blue-50/50 flex gap-4 items-center">
                        <input
                            name="title"
                            autoFocus
                            placeholder="Yeni faaliyet alanı yazın..."
                            className="flex-1 p-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                        />
                        <div className="flex gap-2">
                            <button type="submit" className="p-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700">
                                <Check size={18} />
                            </button>
                            <button type="button" onClick={() => setIsAdding(false)} className="p-2 bg-slate-300 text-slate-700 rounded-lg hover:bg-slate-400">
                                <X size={18} />
                            </button>
                        </div>
                    </form>
                )}

                {/* List */}
                {activities.length === 0 && !isAdding && (
                    <div className="p-8 text-center text-slate-500">
                        Henüz faaliyet alanı eklenmemiş.
                    </div>
                )}

                <div className="divide-y divide-slate-100">
                    {activities.map((activity) => (
                        <div key={activity.id} className="p-4 flex items-center gap-4 hover:bg-slate-50 group">
                            <GripVertical size={20} className="text-slate-300 cursor-move" />

                            {editingId === activity.id ? (
                                <form onSubmit={(e) => handleUpdate(e, activity.id)} className="flex-1 flex gap-4 items-center">
                                    <input
                                        name="title"
                                        defaultValue={activity.title}
                                        autoFocus
                                        className="flex-1 p-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                                    />
                                    <div className="flex gap-2">
                                        <button type="submit" className="p-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700">
                                            <Check size={18} />
                                        </button>
                                        <button type="button" onClick={() => setEditingId(null)} className="p-2 bg-slate-200 text-slate-600 rounded-lg hover:bg-slate-300">
                                            <X size={18} />
                                        </button>
                                    </div>
                                </form>
                            ) : (
                                <>
                                    <span className="flex-1 text-slate-700 font-medium">{activity.title}</span>
                                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button
                                            onClick={() => setEditingId(activity.id)}
                                            className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg"
                                        >
                                            <Pencil size={18} />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(activity.id)}
                                            className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
