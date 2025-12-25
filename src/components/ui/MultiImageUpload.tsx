'use client';

import React, { useState } from 'react';
import { Upload, X, Loader2, Plus } from 'lucide-react';
import Image from 'next/image';

interface MultiImageUploadProps {
    values: string[];
    onChange: (urls: string[]) => void;
    maxImages?: number;
    label?: string;
}

export default function MultiImageUpload({ values = [], onChange, maxImages = 5, label }: MultiImageUploadProps) {
    const [isLoading, setIsLoading] = useState(false);

    const onUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        try {
            const file = e.target.files?.[0];
            if (!file) return;

            setIsLoading(true);
            const formData = new FormData();
            formData.append('file', file);

            const response = await fetch('/api/upload', {
                method: 'POST',
                body: formData,
            });

            const data = await response.json();

            if (data.url) {
                onChange([...values, data.url]);
            }
        } catch (error) {
            console.error('Upload failed', error);
            alert('Görsel yüklenirken bir hata oluştu');
        } finally {
            setIsLoading(false);
            // Reset the input
            e.target.value = '';
        }
    };

    const onRemove = (indexToRemove: number) => {
        onChange(values.filter((_, index) => index !== indexToRemove));
    };

    const canAddMore = values.length < maxImages;

    return (
        <div className="space-y-3">
            {label && <p className="text-sm font-medium text-slate-700">{label}</p>}

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                {/* Existing images */}
                {values.map((url, index) => (
                    <div key={index} className="relative aspect-square bg-slate-100 rounded-lg overflow-hidden group border border-slate-200">
                        <button
                            type="button"
                            onClick={() => onRemove(index)}
                            className="absolute top-1 right-1 z-10 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors shadow-sm opacity-0 group-hover:opacity-100"
                        >
                            <X size={14} />
                        </button>
                        <Image
                            fill
                            src={url}
                            alt={`Görsel ${index + 1}`}
                            className="object-cover"
                        />
                        {index === 0 && (
                            <span className="absolute bottom-1 left-1 bg-primary-600 text-white text-xs px-2 py-0.5 rounded">
                                Ana Görsel
                            </span>
                        )}
                    </div>
                ))}

                {/* Upload button */}
                {canAddMore && (
                    <div className="aspect-square bg-slate-50 border-2 border-dashed border-slate-300 rounded-lg flex flex-col items-center justify-center gap-2 hover:border-primary-500 hover:bg-primary-50/30 transition-all cursor-pointer relative">
                        <input
                            type="file"
                            accept="image/*"
                            onChange={onUpload}
                            disabled={isLoading}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
                        />
                        {isLoading ? (
                            <Loader2 className="animate-spin text-slate-400" size={24} />
                        ) : (
                            <>
                                <Plus className="text-slate-400" size={24} />
                                <span className="text-xs text-slate-500">Ekle</span>
                            </>
                        )}
                    </div>
                )}
            </div>

            <p className="text-xs text-slate-500">
                {values.length}/{maxImages} görsel eklendi. İlk görsel ana görsel olarak kullanılır.
            </p>
        </div>
    );
}
