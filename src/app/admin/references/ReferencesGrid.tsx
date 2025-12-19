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
}

interface ReferencesGridProps {
    initialReferences: Reference[];
}

export default function ReferencesGrid({ initialReferences }: ReferencesGridProps) {
    const router = useRouter();
    // We can use local state initialized with props, but we need to sync it when props change (router.refresh creates new props)
    // However, React state doesn't reset on prop change automatically unless we use a key or useEffect.
    // Simpler approach: Just use props directly for rendering if we relay on router.refresh(), 
    // OR use useEffect to update state when initialReferences changes.
    // But for optimistic updates, we need state.

    // Let's use state, and update it when initialReferences changes
    const [references, setReferences] = useState<Reference[]>(initialReferences);

    // Sync state with props when router refreshes
    React.useEffect(() => {
        setReferences(initialReferences);
    }, [initialReferences]);

    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsUploading(true);
        const formData = new FormData();
        formData.append('file', file);
        formData.append('title', file.name.split('.')[0]);

        try {
            const result = await addReference(formData);
            if (result.success) {
                router.refresh(); // Fetches new data from server
                // State will be updated via useEffect above
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
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-2xl font-bold text-slate-800">Referanslar</h1>
                <button
                    onClick={triggerUpload}
                    disabled={isUploading}
                    className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors disabled:opacity-50"
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

            {/* Grid of Logos */}
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
                {/* Upload Card */}
                <div
                    onClick={triggerUpload}
                    className="border-2 border-dashed border-slate-300 rounded-xl aspect-video flex flex-col items-center justify-center hover:bg-slate-50 transition-colors cursor-pointer group text-slate-400 hover:text-primary-500 hover:border-primary-300"
                >
                    {isUploading ? (
                        <Loader2 className="animate-spin mb-2" size={32} />
                    ) : (
                        <Upload size={32} className="mb-2" />
                    )}
                    <span className="text-sm font-medium">{isUploading ? 'Yükleniyor...' : 'Hızlı Yükle'}</span>
                </div>

                {/* Reference Items */}
                {references.map((ref) => (
                    <div key={ref.id} className="bg-white border border-slate-200 rounded-xl aspect-video flex items-center justify-center p-4 relative group">
                        <div className="relative w-full h-full">
                            {/* We use standard img tag or Next Image. For external/uploaded images, img is safer if domains config is unknown */}
                            <img
                                src={ref.image}
                                alt={ref.title}
                                className="w-full h-full object-contain filter grayscale hover:grayscale-0 transition-all duration-300"
                            />
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
