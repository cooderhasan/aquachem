'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, Save, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { createActivity, updateActivity } from './actions';

interface ActivityFormProps {
    initialData?: any;
    isEdit?: boolean;
}

export default function ActivityForm({ initialData, isEdit = false }: ActivityFormProps) {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setIsLoading(true);

        const formData = new FormData(event.currentTarget);

        try {
            if (isEdit && initialData) {
                await updateActivity(initialData.id, formData);
            } else {
                await createActivity(formData);
            }
            router.push('/admin/activities');
            router.refresh();
        } catch (error) {
            console.error('Failed to save activity', error);
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="max-w-2xl mx-auto">
            <div className="mb-6">
                <Link
                    href="/admin/activities"
                    className="inline-flex items-center text-sm text-slate-500 hover:text-primary-600 mb-4 transition-colors"
                >
                    <ArrowLeft size={16} className="mr-2" />
                    Listeye Dön
                </Link>
                <h1 className="text-2xl font-bold text-slate-800">
                    {isEdit ? 'Faaliyet Alanı Düzenle' : 'Yeni Faaliyet Alanı Ekle'}
                </h1>
            </div>

            <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 space-y-6">
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Başlık</label>
                    <input
                        type="text"
                        name="title"
                        required
                        defaultValue={initialData?.title || ''}
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                        placeholder="Örn: Endüstriyel Su Arıtma"
                    />
                </div>

                <div className="grid grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Sıralama (Order)</label>
                        <input
                            type="number"
                            name="order"
                            defaultValue={initialData?.order || 0}
                            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                        />
                    </div>
                    <div className="flex items-center pt-6">
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="checkbox"
                                name="isActive"
                                defaultChecked={initialData?.isActive ?? true}
                                className="w-5 h-5 text-primary-600 rounded focus:ring-primary-500 border-gray-300"
                            />
                            <span className="text-sm font-medium text-slate-700">Aktif Durumda</span>
                        </label>
                    </div>
                </div>

                <div className="flex justify-end pt-4 border-t">
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-2.5 rounded-lg flex items-center gap-2 transition-colors disabled:opacity-50"
                    >
                        {isLoading ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
                        {isEdit ? 'Güncelle' : 'Kaydet'}
                    </button>
                </div>
            </form>
        </div>
    );
}
