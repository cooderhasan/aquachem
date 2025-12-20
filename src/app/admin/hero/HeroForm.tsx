'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Loader2, Save } from 'lucide-react';
import { createHeroSlide, updateHeroSlide } from './actions';
import ImageUpload from '@/components/ui/ImageUpload';

interface HeroFormProps {
    slide?: any;
}

export default function HeroForm({ slide }: HeroFormProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [image, setImage] = useState(slide?.image || null);
    const isEditing = !!slide;

    const handleSubmit = async (formData: FormData) => {
        setIsLoading(true);
        try {
            if (isEditing) {
                formData.append('id', slide.id.toString());
                await updateHeroSlide(formData);
            } else {
                await createHeroSlide(formData);
            }
        } catch (error) {
            console.error(error);
            alert('İşlem başarısız oldu.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto">
            <div className="mb-6">
                <Link href="/admin/hero" className="text-slate-500 hover:text-slate-800 flex items-center gap-2 mb-2 font-medium">
                    <ArrowLeft size={18} />
                    Listeye Dön
                </Link>
                <h1 className="text-2xl font-bold text-slate-800">
                    {isEditing ? 'Slide Düzenle' : 'Yeni Slide Ekle'}
                </h1>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
                <form action={handleSubmit} className="space-y-6">
                    <input type="hidden" name="image" value={image || ''} />

                    <div>
                        <ImageUpload
                            label="Slide Görseli"
                            description="Geniş format (1920x1080) önerilir. (Max 5MB)"
                            value={image}
                            onChange={(url) => setImage(url)}
                            onRemove={() => setImage(null)}
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Başlık</label>
                            <input
                                name="title"
                                type="text"
                                required
                                defaultValue={slide?.title}
                                className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Sıra (Order)</label>
                            <input
                                name="order"
                                type="number"
                                defaultValue={slide?.order || 0}
                                className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Açıklama</label>
                        <textarea
                            name="description"
                            rows={3}
                            defaultValue={slide?.description || ''}
                            className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Buton Metni</label>
                            <input
                                name="buttonText"
                                type="text"
                                defaultValue={slide?.buttonText || ''}
                                placeholder="Örn: Ürünleri İncele"
                                className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Buton Linki</label>
                            <input
                                name="link"
                                type="text"
                                defaultValue={slide?.link || ''}
                                placeholder="Örn: /products"
                                className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            name="isActive"
                            id="isActive"
                            defaultChecked={slide ? slide.isActive : true}
                            className="w-5 h-5 text-primary-600 rounded focus:ring-primary-500"
                        />
                        <label htmlFor="isActive" className="text-slate-700 font-medium">Bu slide yayında olsun (Aktif)</label>
                    </div>

                    <div className="flex justify-end pt-4">
                        <button
                            type="submit"
                            disabled={isLoading || !image}
                            className="bg-primary-600 hover:bg-primary-700 text-white px-8 py-3 rounded-lg font-medium flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {isLoading && <Loader2 size={18} className="animate-spin" />}
                            {isLoading ? 'Kaydediliyor...' : (isEditing ? 'Güncelle' : 'Kaydet')}
                        </button>
                    </div>

                </form>
            </div>
        </div>
    );
}
