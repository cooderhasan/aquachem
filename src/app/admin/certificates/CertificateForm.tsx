"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Save, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import ImageUpload from '@/components/ui/ImageUpload';
import { createCertificate, updateCertificate } from './actions';

interface CertificateFormProps {
    initialData?: {
        id: number;
        title: string;
        description: string | null;
        image: string;
    };
}

export default function CertificateForm({ initialData }: CertificateFormProps = {}) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [image, setImage] = useState(initialData?.image || '');

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);

        const formData = new FormData(e.currentTarget);
        if (image) {
            formData.set('image', image);
        }

        try {
            if (initialData) {
                await updateCertificate(initialData.id, formData);
            } else {
                await createCertificate(formData);
            }
            // Router refresh handled in server action redirect
        } catch (error: unknown) {
            // Next.js redirect throws a special error that we should ignore
            if (error && typeof error === 'object' && 'digest' in error) {
                const digest = (error as { digest?: string }).digest;
                if (digest?.startsWith('NEXT_REDIRECT')) {
                    // This is a redirect, not an error - let it propagate
                    throw error;
                }
            }
            console.error('Error saving certificate:', error);
            alert('Bir hata oluştu. Lütfen tekrar deneyin.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="max-w-4xl space-y-8">
            <div className="flex items-center gap-4 mb-8">
                <Link
                    href="/admin/certificates"
                    className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                >
                    <ArrowLeft className="text-slate-500" />
                </Link>
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">
                        {initialData ? 'Belgeyi Düzenle' : 'Yeni Belge Ekle'}
                    </h1>
                    <p className="text-slate-500">
                        {initialData ? 'Mevcut belge bilgilerini güncelleyin.' : 'Listenize yeni bir belge veya sertifika ekleyin.'}
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column - Form Fields */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white p-6 rounded-xl border border-slate-200 space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                Belge Başlığı
                            </label>
                            <input
                                name="title"
                                type="text"
                                defaultValue={initialData?.title}
                                required
                                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all"
                                placeholder="Örn: ISO 9001 - 2000"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                Açıklama
                            </label>
                            <textarea
                                name="description"
                                defaultValue={initialData?.description || ''}
                                rows={4}
                                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all"
                                placeholder="Belge hakkında kısa bir açıklama..."
                            />
                        </div>
                    </div>
                </div>

                {/* Right Column - Image Upload */}
                <div className="space-y-6">
                    <div className="bg-white p-6 rounded-xl border border-slate-200 space-y-4">
                        <label className="block text-sm font-medium text-slate-700">
                            Belge Görseli
                        </label>
                        <ImageUpload
                            value={image}
                            onChange={setImage}
                            onRemove={() => setImage('')}
                            label="Görsel Yükle"
                        />
                        <input type="hidden" name="image" value={image} />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-primary-600 hover:bg-primary-700 text-white p-4 rounded-xl flex items-center justify-center gap-2 font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <Save size={20} />
                        {loading ? 'Kaydediliyor...' : 'Kaydet'}
                    </button>
                </div>
            </div>
        </form>
    );
}
