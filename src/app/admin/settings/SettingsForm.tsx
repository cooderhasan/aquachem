'use client';

import React, { useState } from 'react';
import { Loader2, Save } from 'lucide-react';
import { updateSettings } from './actions';
import { useRouter } from 'next/navigation';
import ImageUpload from '@/components/ui/ImageUpload';


interface SettingsFormProps {
    initialSettings: any;
}

export default function SettingsForm({ initialSettings }: SettingsFormProps) {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [logo, setLogo] = useState(initialSettings?.logo || '');

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setIsLoading(true);

        const formData = new FormData(event.currentTarget);

        try {
            await updateSettings(formData);
            router.refresh();
        } catch (error) {
            console.error('Failed to update settings', error);
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                <h2 className="text-lg font-bold text-slate-800 mb-4 pb-2 border-b">Genel Ayarlar</h2>
                <input type="hidden" name="logo" value={logo} />

                <div className="mb-6">
                    <label className="block text-sm font-medium text-slate-700 mb-2">Site Logosu</label>
                    <div className="max-w-md">
                        <ImageUpload
                            value={logo}
                            onChange={(url) => setLogo(url)}
                            onRemove={() => setLogo('')}
                            label="Logo Yükle"
                            description="Şeffaf arka planlı PNG veya SVG önerilir (Max 2MB)"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Site Başlığı</label>
                        <input
                            type="text"
                            name="siteTitle"
                            defaultValue={initialSettings?.siteTitle || ''}
                            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Site Açıklaması</label>
                        <input
                            type="text"
                            name="description"
                            defaultValue={initialSettings?.description || ''}
                            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                        />
                    </div>
                </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                <h2 className="text-lg font-bold text-slate-800 mb-4 pb-2 border-b">Sosyal Medya</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Facebook</label>
                        <input
                            type="text"
                            name="facebook"
                            defaultValue={initialSettings?.socialMedia?.facebook || ''}
                            placeholder="https://facebook.com/..."
                            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Twitter / X</label>
                        <input
                            type="text"
                            name="twitter"
                            defaultValue={initialSettings?.socialMedia?.twitter || ''}
                            placeholder="https://x.com/..."
                            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Instagram</label>
                        <input
                            type="text"
                            name="instagram"
                            defaultValue={initialSettings?.socialMedia?.instagram || ''}
                            placeholder="https://instagram.com/..."
                            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">LinkedIn</label>
                        <input
                            type="text"
                            name="linkedin"
                            defaultValue={initialSettings?.socialMedia?.linkedin || ''}
                            placeholder="https://linkedin.com/in/..."
                            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">YouTube</label>
                        <input
                            type="text"
                            name="youtube"
                            defaultValue={initialSettings?.socialMedia?.youtube || ''}
                            placeholder="https://youtube.com/..."
                            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                        />
                    </div>
                </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                <h2 className="text-lg font-bold text-slate-800 mb-4 pb-2 border-b">Kurumsal İçerik</h2>

                <div className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Hakkımızda</label>
                        <textarea
                            name="aboutUs"
                            rows={5}
                            defaultValue={initialSettings?.aboutUs || ''}
                            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                        ></textarea>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Misyonumuz</label>
                            <textarea
                                name="mission"
                                rows={4}
                                defaultValue={initialSettings?.mission || ''}
                                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                            ></textarea>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Vizyonumuz</label>
                            <textarea
                                name="vision"
                                rows={4}
                                defaultValue={initialSettings?.vision || ''}
                                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                            ></textarea>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">İnsan Politikamız</label>
                        <textarea
                            name="humanPolicy"
                            rows={3}
                            defaultValue={initialSettings?.humanPolicy || ''}
                            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                        ></textarea>
                    </div>
                </div>
            </div>

            <div className="flex justify-end sticky bottom-4">
                <button
                    type="submit"
                    disabled={isLoading}
                    className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-xl flex items-center gap-2 transition-colors disabled:opacity-50 shadow-lg"
                >
                    {isLoading ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
                    Ayarları Kaydet
                </button>
            </div>
        </form>
    );
}
