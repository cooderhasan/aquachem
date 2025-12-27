"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const HeroSlider = ({ slides }: { slides: any[] }) => {
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

    return (
        <section className="relative h-[600px] md:h-[700px] overflow-hidden bg-slate-900 pt-20">
            <AnimatePresence mode="wait">
                <motion.div
                    key={current}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.7 }}
                    className="absolute inset-0"
                >
                    {/* Background Image */}
                    <div className="absolute inset-0">
                        <Image
                            src={slides[current].image}
                            alt={slides[current].title}
                            fill
                            className="object-cover opacity-60"
                            priority
                        />
                        <div className="absolute inset-0 bg-gradient-to-r from-slate-900/80 to-transparent" />
                    </div>

                    {/* Content */}
                    <div className="container-custom relative h-full flex items-center px-12 md:px-4">
                        <div className="max-w-2xl text-white pt-20">
                            <motion.h1
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.3, duration: 0.5 }}
                                className="text-3xl md:text-6xl font-bold mb-6 leading-tight drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]"
                                style={{ textShadow: '2px 2px 8px rgba(0,0,0,0.9), 0 0 20px rgba(0,0,0,0.6)' }}
                            >
                                {slides[current].title}
                            </motion.h1>
                            <motion.p
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.5, duration: 0.5 }}
                                className="text-base md:text-xl text-white mb-8 leading-relaxed drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]"
                                style={{ textShadow: '1px 1px 4px rgba(0,0,0,0.9), 0 0 10px rgba(0,0,0,0.5)' }}
                            >
                                {slides[current].description}
                            </motion.p>
                            <motion.a
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.7, duration: 0.5 }}
                                href={slides[current].link}
                                className="inline-block bg-primary-600 hover:bg-primary-700 text-white px-8 py-3 rounded-full font-medium transition-colors shadow-lg hover:shadow-primary-500/50"
                            >
                                {slides[current].buttonText}
                            </motion.a>
                        </div>
                    </div>
                </motion.div>
            </AnimatePresence>

            {/* Navigation Controls - Only visible on desktop (md and above) */}
            <button
                onClick={prevSlide}
                className="hidden md:block absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-black/30 hover:bg-black/50 text-white rounded-full backdrop-blur-sm transition-colors z-10"
                aria-label="Önceki slayt"
            >
                <ChevronLeft className="w-8 h-8" />
            </button>
            <button
                onClick={nextSlide}
                className="hidden md:block absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-black/30 hover:bg-black/50 text-white rounded-full backdrop-blur-sm transition-colors z-10"
                aria-label="Sonraki slayt"
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
