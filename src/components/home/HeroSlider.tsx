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
                    <div className="container-custom relative h-full flex items-center">
                        <div className="max-w-2xl text-white pt-20">
                            <motion.h1
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.3, duration: 0.5 }}
                                className="text-4xl md:text-6xl font-bold mb-6 leading-tight"
                            >
                                {slides[current].title}
                            </motion.h1>
                            <motion.p
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.5, duration: 0.5 }}
                                className="text-lg md:text-xl text-slate-200 mb-8 leading-relaxed"
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

            {/* Controls */}
            <button
                onClick={prevSlide}
                className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-white/10 hover:bg-white/20 text-white rounded-full backdrop-blur-sm transition-colors z-10"
            >
                <ChevronLeft size={32} />
            </button>
            <button
                onClick={nextSlide}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-white/10 hover:bg-white/20 text-white rounded-full backdrop-blur-sm transition-colors z-10"
            >
                <ChevronRight size={32} />
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
