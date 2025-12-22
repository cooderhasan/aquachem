'use client';

import React, { useRef, useState } from 'react';
import { Plus, Trash2, Upload, Loader2, X } from 'lucide-react';
import { addReference, deleteReference } from './actions';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

interface Reference {
    id: number;
    title: string;
    image: string;
    order: number | null;
    categoryId: number | null;
}

interface Category {
    id: number;
    title: string;
}

interface ReferencesGridProps {
    initialReferences: Reference[];
    categories: Category[];
}

export default function ReferencesGrid({ initialReferences, categories }: ReferencesGridProps) {
    const router = useRouter();
    const [references, setReferences] = useState<Reference[]>(initialReferences);
    const [selectedCategory, setSelectedCategory] = useState<string>('');
    const [filterCategory, setFilterCategory] = useState<string>('all');

    React.useEffect(() => {
        setReferences(initialReferences);
    }, [initialReferences]);

    const filteredReferences = filterCategory === 'all'
        ? references
        : references.filter(ref => ref.categoryId?.toString() === filterCategory);

    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // If no category selected, warn user
        if (!selectedCategory) {
            alert('Lütfen önce bir kategori seçiniz.');
            if (fileInputRef.current) fileInputRef.current.value = '';
            return;
        }

        setIsUploading(true);
        const formData = new FormData();
        formData.append('file', file);
        formData.append('title', file.name.split('.')[0]);
        formData.append('categoryId', selectedCategory);

        try {
            const result = await addReference(formData);
            if (result.success) {
                router.refresh();
            } else {
                alert('Yükleme başarısız');
            }
        } catch (error) {
            console.error(error);
            alert('Hata oluştu');
        } finally {
            setIsUploading(false);
            if (fileInputRef.current) fileInputRef.current.value = '';
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm('Silmek istediğinize emin misiniz?')) return;

        // Optimistic update
        const previousReferences = [...references];
        setReferences(prev => prev.filter(r => r.id !== id));

        try {
            const result = await deleteReference(id);
            if (!result.success) {
                throw new Error(result.error);
            }
            router.refresh();
        } catch (error) {
            console.error(error);
            alert('Silme işlemi başarısız');
            setReferences(previousReferences); // Revert
        }
    };

    const triggerUpload = () => {
        fileInputRef.current?.click();
    };

    return (
        <div>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <h1 className="text-2xl font-bold text-slate-800">Referanslar</h1>

                <div className="flex flex-wrap gap-4 items-center">
                    {/* Filter Dropdown */}
                    <select
                        value={filterCategory}
                        onChange={(e) => setFilterCategory(e.target.value)}
                        className="px-4 py-2 rounded-lg border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                    >
                        <option value="all">Tüm Kategoriler</option>
                        {categories.map(cat => (
                            <option key={cat.id} value={cat.id.toString()}>{cat.title}</option>
                        ))}
                    </select>

                    <div className="h-8 w-[1px] bg-slate-200 hidden md:block"></div>

                    {/* Upload Category Select */}
                    <select
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="px-4 py-2 rounded-lg border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                    >
                        <option value="">Yüklenecek Kategori Seçin...</option>
                        {categories.map(cat => (
                            <option key={cat.id} value={cat.id.toString()}>{cat.title}</option>
                        ))}
                    </select>

                    <button
                        onClick={triggerUpload}
                        disabled={isUploading || !selectedCategory}
                        className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        title={!selectedCategory ? "Önce kategori seçiniz" : ""}
                    >
                        {isUploading ? <Loader2 className="animate-spin" size={20} /> : <Plus size={20} />}
                        Yeni Ekle
                    </button>
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileSelect}
                        accept="image/*"
                        className="hidden"
                    />
                </div>
            </div>

            {/* Grid of Logos */}
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
                {/* Upload Card */}
                {selectedCategory && (
                    <div
                        onClick={triggerUpload}
                        className="border-2 border-dashed border-slate-300 rounded-xl aspect-video flex flex-col items-center justify-center hover:bg-slate-50 transition-colors cursor-pointer group text-slate-400 hover:text-primary-500 hover:border-primary-300"
                    >
                        {isUploading ? (
                            <Loader2 className="animate-spin mb-2" size={32} />
                        ) : (
                            <Upload size={32} className="mb-2" />
                        )}
                        <span className="text-sm font-medium">{isUploading ? 'Yükleniyor...' : 'Bu Kategoriye Ekle'}</span>
                    </div>
                )}

                {/* Reference Items */}
                {filteredReferences.map((ref) => (
                    <div key={ref.id} className="bg-white border border-slate-200 rounded-xl aspect-video flex items-center justify-center p-4 relative group">
                        <div className="relative w-full h-full">
                            {/* We use standard img tag or Next Image. For external/uploaded images, img is safer if domains config is unknown */}
                            <img
                                src={ref.image}
                                alt={ref.title}
                                className="w-full h-full object-contain filter grayscale hover:grayscale-0 transition-all duration-300"
                            />
                        </div>
                        <div className="absolute bottom-2 left-2 bg-slate-100 text-slate-500 text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                            {categories.find(c => c.id === ref.categoryId)?.title || '-'}
                        </div>
                        <button
                            onClick={() => handleDelete(ref.id)}
                            className="absolute top-2 right-2 bg-red-100 text-red-500 p-1.5 rounded-md opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-200 z-10"
                        >
                            <Trash2 size={16} />
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}
