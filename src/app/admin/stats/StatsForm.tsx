'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, Save, ArrowLeft, Calendar, Users, Package, Award, Target } from 'lucide-react';
import Link from 'next/link';
import { createStat, updateStat } from './actions';

interface StatsFormProps {
    initialData?: any;
    isEdit?: boolean;
}

const ICONS = [
    { value: 'Calendar', label: 'Takvim', component: Calendar },
    { value: 'Users', label: 'Kullanıcılar', component: Users },
    { value: 'Package', label: 'Paket / Kutu', component: Package },
    { value: 'Award', label: 'Ödül / Başarı', component: Award },
    { value: 'Target', label: 'Hedef', component: Target },
];

export default function StatsForm({ initialData, isEdit = false }: StatsFormProps) {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [selectedIcon, setSelectedIcon] = useState(initialData?.icon || 'Target');

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setIsLoading(true);

        const formData = new FormData(event.currentTarget);
        formData.set('icon', selectedIcon);

        try {
            if (isEdit && initialData) {
                await updateStat(initialData.id, formData);
            } else {
                await createStat(formData);
            }
            router.push('/admin/stats');
            router.refresh();
        } catch (error) {
            console.error('Failed to save stat', error);
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="max-w-2xl mx-auto">
            <div className="mb-6">
                <Link
                    href="/admin/stats"
                    className="inline-flex items-center text-sm text-slate-500 hover:text-primary-600 mb-4 transition-colors"
                >
                    <ArrowLeft size={16} className="mr-2" />
                    Listeye Dön
                </Link>
                <h1 className="text-2xl font-bold text-slate-800">
                    {isEdit ? 'İstatistik Düzenle' : 'Yeni İstatistik Ekle'}
                </h1>
            </div>

            <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Değer (Rakam)</label>
                        <input
                            type="text"
                            name="value"
                            required
                            defaultValue={initialData?.value || ''}
                            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                            placeholder="Örn: 25+"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Etiket (Başlık)</label>
                        <input
                            type="text"
                            name="label"
                            required
                            defaultValue={initialData?.label || ''}
                            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                            placeholder="Örn: Yıllık Deneyim"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">İkon Seçin</label>
                    <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
                        {ICONS.map((icon) => {
                            const IconComponent = icon.component;
                            const isSelected = selectedIcon === icon.value;
                            return (
                                <button
                                    key={icon.value}
                                    type="button"
                                    onClick={() => setSelectedIcon(icon.value)}
                                    className={`flex flex-col items-center justify-center p-3 rounded-lg border-2 transition-all ${isSelected
                                        ? 'border-primary-500 bg-primary-50 text-primary-700'
                                        : 'border-slate-200 hover:border-slate-300 text-slate-600'
                                        }`}
                                >
                                    <IconComponent size={24} className="mb-1" />
                                    <span className="text-xs font-medium">{icon.label}</span>
                                </button>
                            );
                        })}
                    </div>
                    <input type="hidden" name="icon" value={selectedIcon} />
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Sıralama (Order)</label>
                    <input
                        type="number"
                        name="order"
                        defaultValue={initialData?.order || 0}
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
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
