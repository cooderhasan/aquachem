"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Locale } from '@/lib/i18n';
import { Dictionary } from '@/lib/dictionary';

interface HeroSliderProps {
    slides: any[];
    settings?: any;
    lang: Locale;
    dict: Dictionary;
}

const HeroSlider = ({ slides, settings, lang, dict }: HeroSliderProps) => {
    const [current, setCurrent] = useState(0);

    // If no slides, show nothing or a default placeholder
    if (!slides || slides.length === 0) return null;

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrent((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
        }, 5000);
        return () => clearInterval(timer);
    }, [slides.length]);

    const nextSlide = () => {
        setCurrent(current === slides.length - 1 ? 0 : current + 1);
    };

    const prevSlide = () => {
        setCurrent(current === 0 ? slides.length - 1 : current - 1);
    };

    const getTranslatedButtonText = (text: string) => {
        if (!text) return '';
        if (lang === 'en') {
            const lower = text.toLowerCase();
            if (lower.includes('teklif')) return dict.header.getQuote;
            if (lower.includes('ürün') || lower.includes('incele')) return dict.common.browseProducts;
            if (lower.includes('detay') || lower.includes('bilgi') || lower.includes('oku')) return dict.common.readMore;
            return 'Explore';
        }
        return text;
    };

    const overlayOpacity = settings?.heroOverlayOpacity !== undefined ? settings.heroOverlayOpacity / 100 : 0.6;
    const gradientOpacity = settings?.heroGradientOpacity !== undefined ? settings.heroGradientOpacity / 100 : 0.8;

    return (
        <section className="relative h-[600px] md:h-[700px] overflow-hidden bg-slate-900 pt-20">
            <AnimatePresence mode="wait">
                <motion.div
                    key={current}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.7 }}
                    className="absolute inset-0 w-full h-full"
                >
                    {/* Background Image */}
                    <div className="absolute inset-0">
                        <Image
                            src={slides[current].image}
                            alt={slides[current].title}
                            fill
                            className="object-cover"
                            priority
                            unoptimized
                        />
                        {/* Overlays */}
                        <div
                            className="absolute inset-0 bg-slate-950 transition-opacity duration-300"
                            style={{ opacity: overlayOpacity }}
                        />
                        <div
                            className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/70 to-transparent transition-opacity duration-300"
                            style={{ opacity: gradientOpacity }}
                        />
                    </div>

                    {/* Content */}
                    <div className="absolute inset-0 flex items-start pt-[160px] md:pt-[180px] xl:pt-[220px] z-10">
                        <div className="container-custom w-full text-white">
                            <div className="max-w-3xl">
                                <motion.h1
                                    initial={{ y: 20, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ delay: 0.2, duration: 0.5 }}
                                    className="text-3xl sm:text-4xl lg:text-[42px] xl:text-[48px] 2xl:text-[56px] font-bold mb-6 tracking-tight leading-tight text-white drop-shadow-md"
                                >
                                    {lang === 'en' && slides[current].titleEn ? slides[current].titleEn : slides[current].title}
                                </motion.h1>
                                {(lang === 'en' && slides[current].descriptionEn ? slides[current].descriptionEn : slides[current].description) && (
                                    <motion.p
                                        initial={{ y: 20, opacity: 0 }}
                                        animate={{ y: 0, opacity: 1 }}
                                        transition={{ delay: 0.4, duration: 0.5 }}
                                        className="text-base lg:text-lg xl:text-xl text-slate-100 mb-8 leading-relaxed font-normal drop-shadow-md"
                                    >
                                        {lang === 'en' && slides[current].descriptionEn ? slides[current].descriptionEn : slides[current].description}
                                    </motion.p>
                                )}
                                <motion.a
                                    href={slides[current].link || '#'}
                                    initial={{ y: 20, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ delay: 0.6, duration: 0.5 }}
                                    className="inline-block bg-primary-600 hover:bg-primary-700 text-white px-8 py-3.5 rounded-full font-medium transition-colors shadow-lg hover:shadow-primary-500/50"
                                >
                                    {getTranslatedButtonText(slides[current].buttonText)}
                                </motion.a>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </AnimatePresence>

            {/* Navigation Controls - Only visible on desktop (md and above) */}
            <button
                onClick={prevSlide}
                className="hidden md:block absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-black/30 hover:bg-black/50 text-white rounded-full backdrop-blur-sm transition-colors z-10"
                aria-label={dict.hero.prevSlide}
            >
                <ChevronLeft className="w-8 h-8" />
            </button>
            <button
                onClick={nextSlide}
                className="hidden md:block absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-black/30 hover:bg-black/50 text-white rounded-full backdrop-blur-sm transition-colors z-10"
                aria-label={dict.hero.nextSlide}
            >
                <ChevronRight className="w-8 h-8" />
            </button>

            {/* Dots */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3 z-10">
                {slides.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => setCurrent(index)}
                        className={`w-3 h-3 rounded-full transition-all ${index === current ? 'bg-primary-500 w-8' : 'bg-white/50 hover:bg-white'
                            }`}
                    />
                ))}
            </div>
        </section>
    );
};

export default HeroSlider;
