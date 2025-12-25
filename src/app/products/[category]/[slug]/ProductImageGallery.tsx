'use client';

import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Image from 'next/image';

interface ProductImageGalleryProps {
    images: string[];
    productTitle: string;
}

export default function ProductImageGallery({ images, productTitle }: ProductImageGalleryProps) {
    const [currentIndex, setCurrentIndex] = useState(0);

    // Filter out empty strings
    const validImages = images.filter(img => img && img.trim() !== '');

    if (validImages.length === 0) {
        return (
            <div className="bg-slate-50 rounded-2xl border border-slate-100 p-8 flex items-center justify-center">
                <div className="relative w-full aspect-square max-w-md bg-white rounded-xl shadow-sm p-4">
                    <div className="w-full h-full bg-slate-100 rounded-lg flex items-center justify-center text-slate-400">
                        Görsel Yok
                    </div>
                </div>
            </div>
        );
    }

    const goToPrevious = () => {
        setCurrentIndex((prev) => (prev === 0 ? validImages.length - 1 : prev - 1));
    };

    const goToNext = () => {
        setCurrentIndex((prev) => (prev === validImages.length - 1 ? 0 : prev + 1));
    };

    return (
        <div className="bg-slate-50 rounded-2xl border border-slate-100 p-6 space-y-4">
            {/* Main Image */}
            <div className="relative w-full aspect-square bg-white rounded-xl shadow-sm overflow-hidden group">
                <Image
                    src={validImages[currentIndex]}
                    alt={`${productTitle} - Görsel ${currentIndex + 1}`}
                    fill
                    className="object-cover"
                    priority
                />

                {/* Navigation Arrows - Only show if more than 1 image */}
                {validImages.length > 1 && (
                    <>
                        <button
                            onClick={goToPrevious}
                            className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
                            aria-label="Önceki görsel"
                        >
                            <ChevronLeft size={24} className="text-slate-700" />
                        </button>
                        <button
                            onClick={goToNext}
                            className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
                            aria-label="Sonraki görsel"
                        >
                            <ChevronRight size={24} className="text-slate-700" />
                        </button>

                        {/* Dots indicator */}
                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                            {validImages.map((_, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => setCurrentIndex(idx)}
                                    className={`w-2.5 h-2.5 rounded-full transition-all ${idx === currentIndex
                                            ? 'bg-primary-600 w-6'
                                            : 'bg-white/80 hover:bg-white'
                                        }`}
                                    aria-label={`Görsel ${idx + 1}`}
                                />
                            ))}
                        </div>
                    </>
                )}
            </div>

            {/* Thumbnails - Only show if more than 1 image */}
            {validImages.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-2">
                    {validImages.map((img, idx) => (
                        <button
                            key={idx}
                            onClick={() => setCurrentIndex(idx)}
                            className={`relative w-16 h-16 flex-shrink-0 rounded-lg overflow-hidden border-2 transition-all ${idx === currentIndex
                                    ? 'border-primary-600 ring-2 ring-primary-200'
                                    : 'border-transparent hover:border-slate-300'
                                }`}
                        >
                            <Image
                                src={img}
                                alt={`${productTitle} - Küçük ${idx + 1}`}
                                fill
                                className="object-cover"
                            />
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
