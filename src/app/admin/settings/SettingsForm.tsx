'use client';

import React, { useState } from 'react';
import { Loader2, Save, CheckCircle, XCircle } from 'lucide-react';
import { updateSettings } from './actions';
import { useRouter } from 'next/navigation';
import ImageUpload from '@/components/ui/ImageUpload';


interface SettingsFormProps {
    initialSettings: any;
}

export default function SettingsForm({ initialSettings }: SettingsFormProps) {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
    const [logo, setLogo] = useState(initialSettings?.logo || '');
    const [favicon, setFavicon] = useState(initialSettings?.favicon || '');
    const [aboutImage, setAboutImage] = useState(initialSettings?.aboutImage || '');

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setIsLoading(true);
        setNotification(null);

        const formData = new FormData(event.currentTarget);

        try {
            const result = await updateSettings(formData);
            if (result?.success) {
                setNotification({ type: 'success', message: 'Ayarlar başarıyla kaydedildi!' });
                router.refresh();
            } else {
                setNotification({ type: 'error', message: result?.error || 'Ayarlar kaydedilemedi.' });
            }
        } catch (error) {
            console.error('Failed to update settings', error);
            setNotification({ type: 'error', message: 'Bir hata oluştu. Lütfen tekrar deneyin.' });
        } finally {
            setIsLoading(false);
            // 5 saniye sonra bildirimi gizle
            setTimeout(() => setNotification(null), 5000);
        }
    }

    return (
        <>
            {/* Bildirim Toast */}
            {notification && (
                <div className={`fixed top-4 right-4 z-50 flex items-center gap-3 px-6 py-4 rounded-xl shadow-lg animate-in slide-in-from-top-2 ${notification.type === 'success'
                        ? 'bg-green-500 text-white'
                        : 'bg-red-500 text-white'
                    }`}>
                    {notification.type === 'success' ? (
                        <CheckCircle size={24} />
                    ) : (
                        <XCircle size={24} />
                    )}
                    <span className="font-medium">{notification.message}</span>
                    <button
                        onClick={() => setNotification(null)}
                        className="ml-2 hover:opacity-70 transition-opacity"
                    >
                        ×
                    </button>
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                    <h2 className="text-lg font-bold text-slate-800 mb-4 pb-2 border-b">Genel Ayarlar</h2>
                    <input type="hidden" name="logo" value={logo} />
                    <input type="hidden" name="favicon" value={favicon} />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Site Logosu</label>
                            <ImageUpload
                                value={logo}
                                onChange={(url) => setLogo(url)}
                                onRemove={() => setLogo('')}
                                label="Logo Yükle"
                                description="Şeffaf arka planlı PNG veya SVG önerilir (Max 2MB)"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Favicon (Site İkonu)</label>
                            <ImageUpload
                                value={favicon}
                                onChange={(url) => setFavicon(url)}
                                onRemove={() => setFavicon('')}
                                label="Favicon Yükle"
                                description="32x32 veya 64x64 px, PNG/ICO önerilir"
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
                    <h2 className="text-lg font-bold text-slate-800 mb-4 pb-2 border-b">E-Katalog</h2>
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-slate-700 mb-2">PDF Katalog</label>
                        <div className="flex items-center gap-4">
                            <input
                                type="text"
                                name="catalogUrl"
                                defaultValue={initialSettings?.catalogUrl || ''}
                                className="flex-1 px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-slate-50"
                                placeholder="Katalog URL'si (veya dosya yükleyiniz)"
                                readOnly
                            />
                            <div className="relative">
                                <input
                                    type="file"
                                    id="catalog-upload"
                                    accept=".pdf"
                                    className="hidden"
                                    onChange={async (e) => {
                                        const file = e.target.files?.[0];
                                        if (!file) return;

                                        const formData = new FormData();
                                        formData.append('file', file);

                                        setIsLoading(true);
                                        try {
                                            const res = await fetch('/api/upload', {
                                                method: 'POST',
                                                body: formData,
                                            });

                                            if (!res.ok) throw new Error('Upload failed');

                                            const data = await res.json();
                                            const input = document.querySelector('input[name="catalogUrl"]') as HTMLInputElement;
                                            if (input) input.value = data.url;
                                        } catch (error) {
                                            console.error('Catalog upload error:', error);
                                            alert('Katalog yüklenemedi!');
                                        } finally {
                                            setIsLoading(false);
                                        }
                                    }}
                                />
                                <label
                                    htmlFor="catalog-upload"
                                    className="cursor-pointer bg-slate-800 hover:bg-slate-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                                >
                                    Katalog Yükle
                                </label>
                            </div>
                        </div>
                        {initialSettings?.catalogUrl && (
                            <a
                                href={initialSettings.catalogUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-primary-600 text-sm mt-2 inline-block hover:underline"
                            >
                                Mevcut Kataloğu Görüntüle
                            </a>
                        )}
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
                            <label className="block text-sm font-medium text-slate-700 mb-2">Hakkımızda Görseli</label>
                            <div className="max-w-md">
                                <ImageUpload
                                    value={aboutImage}
                                    onChange={(url) => setAboutImage(url)}
                                    onRemove={() => setAboutImage('')}
                                    label="Görsel Yükle"
                                    description="Kurumsal sayfada görünecek (önerilen: 800x600px)"
                                />
                            </div>
                            <input type="hidden" name="aboutImage" value={aboutImage} />
                        </div>
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
        </>
    );
}
