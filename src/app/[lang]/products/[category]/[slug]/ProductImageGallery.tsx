'use client';

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { ChevronLeft, ChevronRight, X, ZoomIn } from 'lucide-react';
import Image from 'next/image';

interface ProductImageGalleryProps {
    images: string[];
    productTitle: string;
}

export default function ProductImageGallery({ images, productTitle }: ProductImageGalleryProps) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isLightboxOpen, setIsLightboxOpen] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    // Lock body scroll when lightbox is open
    useEffect(() => {
        if (isLightboxOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isLightboxOpen]);

    // Handle ESC key to close lightbox
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') setIsLightboxOpen(false);
            if (e.key === 'ArrowLeft') goToPrevious();
            if (e.key === 'ArrowRight') goToNext();
        };

        if (isLightboxOpen) {
            window.addEventListener('keydown', handleKeyDown);
        }
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isLightboxOpen]);

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
            <div
                className="relative w-full aspect-square bg-white rounded-xl shadow-sm overflow-hidden group cursor-zoom-in"
                onClick={() => setIsLightboxOpen(true)}
            >
                <div className="absolute top-4 right-4 z-10 bg-white/80 p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                    <ZoomIn size={20} className="text-slate-700" />
                </div>
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
                            onClick={(e) => {
                                e.stopPropagation();
                                goToPrevious();
                            }}
                            className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
                            aria-label="Önceki görsel"
                        >
                            <ChevronLeft size={24} className="text-slate-700" />
                        </button>
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                goToNext();
                            }}
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

            {/* Lightbox Modal - Portal to body so it escapes all parent stacking contexts */}
            {isLightboxOpen && mounted && createPortal(
                <div
                    className="fixed inset-0 z-[99999] bg-black/95 backdrop-blur-sm flex items-center justify-center p-4 cursor-zoom-out select-none"
                    onClick={() => setIsLightboxOpen(false)}
                >
                    {/* Top Bar: Title & Big Clear Close Button */}
                    <div
                        className="absolute top-0 left-0 right-0 p-4 sm:p-6 flex items-center justify-between z-[100000] bg-gradient-to-b from-black/80 via-black/40 to-transparent"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="text-white/90 font-medium text-sm sm:text-base truncate max-w-[70%]">
                            {productTitle} {validImages.length > 1 && `(${currentIndex + 1} / ${validImages.length})`}
                        </div>
                        <button
                            onClick={() => setIsLightboxOpen(false)}
                            className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-full flex items-center gap-2 backdrop-blur-md border border-white/25 transition-all active:scale-95 shadow-2xl text-sm font-semibold cursor-pointer"
                            aria-label="Kapat"
                        >
                            <X size={20} />
                            <span>Kapat (ESC)</span>
                        </button>
                    </div>

                    {/* Main Lightbox Image */}
                    <div
                        className="relative w-full h-full max-w-6xl max-h-[82vh] flex items-center justify-center cursor-default"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <Image
                            src={validImages[currentIndex]}
                            alt={`${productTitle} - Tam Ekran`}
                            fill
                            className="object-contain"
                            priority
                            quality={100}
                        />
                    </div>

                    {/* Lightbox Navigation - Only show if more than 1 image */}
                    {validImages.length > 1 && (
                        <>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    goToPrevious();
                                }}
                                className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/15 hover:bg-white/30 text-white rounded-full flex items-center justify-center transition-all backdrop-blur-md border border-white/20 z-[100000] active:scale-90 cursor-pointer"
                                aria-label="Önceki görsel"
                            >
                                <ChevronLeft size={32} />
                            </button>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    goToNext();
                                }}
                                className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/15 hover:bg-white/30 text-white rounded-full flex items-center justify-center transition-all backdrop-blur-md border border-white/20 z-[100000] active:scale-90 cursor-pointer"
                                aria-label="Sonraki görsel"
                            >
                                <ChevronRight size={32} />
                            </button>

                            {/* Lightbox Thumbnails */}
                            <div
                                className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2.5 max-w-full overflow-x-auto p-2 bg-black/50 backdrop-blur-md rounded-full border border-white/15 z-[100000]"
                                onClick={(e) => e.stopPropagation()}
                            >
                                {validImages.map((img, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => setCurrentIndex(idx)}
                                        className={`relative w-10 h-10 rounded-lg overflow-hidden border-2 transition-all shrink-0 cursor-pointer ${
                                            idx === currentIndex
                                                ? 'border-primary-500 scale-110 shadow-md'
                                                : 'border-white/30 hover:border-white/60 opacity-60 hover:opacity-100'
                                        }`}
                                    >
                                        <Image src={img} alt="" fill className="object-cover" />
                                    </button>
                                ))}
                            </div>
                        </>
                    )}
                </div>,
                document.body
            )}
        </div>
    );
}
