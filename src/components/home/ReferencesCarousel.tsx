"use client";

import React from 'react';

import { Locale } from '@/lib/i18n';
import { Dictionary } from '@/lib/dictionary';

interface Reference {
    id: number;
    title: string;
    image: string;
    categoryId: number | null;
}

interface ReferencesCarouselProps {
    references: Reference[];
    settings?: any; // Settings prop eklendi
    lang?: Locale;
    dict?: Dictionary;
}

const ReferencesCarousel = ({ references, settings, lang = 'tr', dict }: ReferencesCarouselProps) => {
    // Referans yoksa bileşeni gösterme
    if (!references || references.length === 0) {
        return null;
    }

    // Default duration 30s or from settings
    const duration = settings?.referencesScrollSpeed ? `${settings.referencesScrollSpeed}s` : '30s';

    return (
        <section className="py-8 bg-slate-50 border-t border-slate-100">
            <div className="container-custom mb-8 text-center">
                <span className="inline-block bg-white text-slate-600 text-sm font-bold px-4 py-1.5 rounded-full mb-4 uppercase tracking-wider shadow-sm border border-slate-200">
                    {lang === 'en' ? 'Our References' : 'Referanslarımız'}
                </span>
                <h2 className="text-3xl font-bold text-slate-900">
                    {lang === 'en' ? 'Our Reference Companies and Partners' : 'Referans Firmalarımız ve İş Ortaklarımız'}
                </h2>
            </div>

            <div className="overflow-hidden relative">
                {/* Gradient Masks */}
                <div className="absolute top-0 left-0 h-full w-24 bg-gradient-to-r from-slate-50 to-transparent z-10" />
                <div className="absolute top-0 right-0 h-full w-24 bg-gradient-to-l from-slate-50 to-transparent z-10" />

                <div
                    className="flex gap-16 w-max animate-scroll py-4 px-4"
                    style={{ animationDuration: duration }}
                >
                    {/* Double the list for infinite scroll effect */}
                                        {/* Render the list twice for the infinite scroll effect */}
                    <>
                        {references.map((ref, index) => (
                            <div
                                key={`${ref.id}-${index}-a`}
                                className="flex items-center justify-center transition-all duration-300 transform hover:scale-125 hover:drop-shadow-2xl"
                                style={{
                                    height: settings?.referenceLogoHeight ? `${settings.referenceLogoHeight}px` : '100px',
                                    width: settings?.referenceLogoHeight ? `${Number(settings.referenceLogoHeight) * 2.2}px` : '220px'
                                }}
                            >
                                <img
                                    src={ref.image}
                                    alt={ref.title}
                                    className="max-w-full max-h-full object-contain mix-blend-multiply transition-all duration-300"
                                />
                            </div>
                        ))}
                        {references.map((ref, index) => (
                            <div
                                key={`${ref.id}-${index}-b`}
                                className="flex items-center justify-center transition-all duration-300 transform hover:scale-125 hover:drop-shadow-2xl"
                                style={{
                                    height: settings?.referenceLogoHeight ? `${settings.referenceLogoHeight}px` : '100px',
                                    width: settings?.referenceLogoHeight ? `${Number(settings.referenceLogoHeight) * 2.2}px` : '220px'
                                }}
                            >
                                <img
                                    src={ref.image}
                                    alt={ref.title}
                                    className="max-w-full max-h-full object-contain mix-blend-multiply transition-all duration-300"
                                />
                            </div>
                        ))}
                    </>
                </div>
            </div>
        </section>
    );
};

export default ReferencesCarousel;
