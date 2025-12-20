'use client';

import React, { useState } from 'react';
import { Upload, X, Loader2 } from 'lucide-react';
import Image from 'next/image';

interface ImageUploadProps {
    value?: string | null;
    onChange: (url: string) => void;
    onRemove: () => void;
    label?: string;
    description?: string;
}

export default function ImageUpload({ value, onChange, onRemove, label, description }: ImageUploadProps) {
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
                onChange(data.url);
            }
        } catch (error) {
            console.error('Upload failed', error);
            alert('Görsel yüklenirken bir hata oluştu');
        } finally {
            setIsLoading(false);
        }
    };

    if (value) {
        return (
            <div className="relative w-full h-64 bg-slate-100 rounded-xl overflow-hidden group border border-slate-200">
                <div className="absolute top-2 right-2 z-10">
                    <button
                        type="button"
                        onClick={onRemove}
                        className="p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors shadow-sm"
                    >
                        <X size={16} />
                    </button>
                </div>
                <Image
                    fill
                    src={value}
                    alt="Upload"
                    className="object-cover transition-transform group-hover:scale-105"
                />
            </div>
        );
    }

    return (
        <div className="w-full h-64 bg-slate-50 border-2 border-dashed border-slate-300 rounded-xl flex flex-col items-center justify-center gap-4 hover:border-primary-500 hover:bg-primary-50/10 transition-all cursor-pointer relative">
            <input
                type="file"
                accept="image/*"
                onChange={onUpload}
                disabled={isLoading}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
            />
            <div className="p-4 bg-white rounded-full shadow-sm text-primary-600 group-hover:scale-110 transition-transform">
                {isLoading ? <Loader2 className="animate-spin" size={24} /> : <Upload size={24} />}
            </div>
            <div className="text-center">
                <p className="font-medium text-slate-700">{label || 'Görsel Yükle'}</p>
                <p className="text-sm text-slate-500 mt-1">{description || 'PNG, JPG, GIF (Max 4MB)'}</p>
            </div>
        </div>
    );
}
