"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Loader2, Upload, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

interface PostFormProps {
    initialData?: {
        title: string;
        type: string;
        content: string;
        image: string;
    };
    onSubmit: (formData: FormData) => Promise<{ success: boolean; error?: string }>;
    title: string;
}

export default function PostForm({ initialData, onSubmit, title }: PostFormProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        title: initialData?.title || '',
        type: initialData?.type || 'news',
        content: initialData?.content || '',
        image: initialData?.image || ''
    });
    const [uploading, setUploading] = useState(false);

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        const uploadFormData = new FormData();
        uploadFormData.append('file', file);

        try {
            const res = await fetch('/api/upload', {
                method: 'POST',
                body: uploadFormData
            });
            const data = await res.json();

            if (data.success) {
                setFormData(prev => ({ ...prev, image: data.url }));
                toast.success('Görsel yüklendi');
            } else {
                toast.error('Görsel yüklenirken hata oluştu');
            }
        } catch (error) {
            console.error('Upload error:', error);
            toast.error('Yükleme hatası');
        } finally {
            setUploading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const submitData = new FormData();
            submitData.append('title', formData.title);
            submitData.append('type', formData.type);
            submitData.append('content', formData.content);
            submitData.append('image', formData.image);

            const result = await onSubmit(submitData);

            if (result.success) {
                toast.success('İşlem başarılı');
                router.push('/admin/posts');
                router.refresh();
            } else {
                toast.error(result.error || 'Bir hata oluştu');
            }
        } catch (error) {
            console.error('Submit error:', error);
            toast.error('Beklenmedik bir hata oluştu');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto">
            <div className="mb-6">
                <Link href="/admin/posts" className="text-slate-500 hover:text-slate-800 flex items-center gap-2 mb-2 font-medium">
                    <ArrowLeft size={18} />
                    Listeye Dön
                </Link>
                <h1 className="text-2xl font-bold text-slate-800">{title}</h1>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
                <form onSubmit={handleSubmit} className="space-y-6">

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Başlık</label>
                            <input
                                type="text"
                                required
                                className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                                value={formData.title}
                                onChange={e => setFormData({ ...formData, title: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Tür</label>
                            <select
                                className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none bg-white"
                                value={formData.type}
                                onChange={e => setFormData({ ...formData, type: e.target.value })}
                            >
                                <option value="news">Haber</option>
                                <option value="activity">Faaliyet</option>
                                <option value="innovation">İnovasyon</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Kapak Görseli</label>
                        {formData.image ? (
                            <div className="relative w-full h-48 rounded-xl overflow-hidden group">
                                <img src={formData.image} alt="Preview" className="w-full h-full object-cover" />
                                <button
                                    type="button"
                                    onClick={() => setFormData(prev => ({ ...prev, image: '' }))}
                                    className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                    <X size={16} />
                                </button>
                            </div>
                        ) : (
                            <div className="border-2 border-dashed border-slate-300 rounded-xl p-6 hover:bg-slate-50 transition-colors cursor-pointer text-center relative">
                                <Upload className={`mx-auto text-slate-400 mb-2 ${uploading ? 'animate-bounce' : ''}`} size={24} />
                                <p className="text-slate-500 text-sm">{uploading ? 'Yükleniyor...' : 'Görsel Yükle'}</p>
                                <input
                                    type="file"
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                    accept="image/*"
                                    onChange={handleImageUpload}
                                    disabled={uploading}
                                />
                            </div>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">İçerik</label>
                        <textarea
                            className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none h-48"
                            placeholder="Haber içeriğini buraya yazın..."
                            value={formData.content}
                            onChange={e => setFormData({ ...formData, content: e.target.value })}
                        />
                    </div>

                    <div className="flex justify-end pt-4">
                        <button
                            type="submit"
                            disabled={loading || uploading}
                            className="bg-primary-600 hover:bg-primary-700 text-white px-8 py-3 rounded-lg font-medium flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {loading && <Loader2 size={18} className="animate-spin" />}
                            {loading ? 'Kaydediliyor...' : 'Kaydet'}
                        </button>
                    </div>

                </form>
            </div>
        </div>
    );
}
