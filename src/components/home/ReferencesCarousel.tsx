"use client";

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { references } from '@/data/mockData';

const ReferencesCarousel = () => {
    return (
        <section className="py-12 bg-slate-50 border-t border-slate-100">
            <div className="container-custom mb-12 text-center">
                <span className="inline-block bg-white text-slate-600 text-sm font-bold px-4 py-1.5 rounded-full mb-4 uppercase tracking-wider shadow-sm border border-slate-200">
                    Referanslarımız
                </span>
                <h2 className="text-3xl font-bold text-slate-900">
                    Güçlü İş Birliklerimiz
                </h2>
            </div>

            <div className="overflow-hidden relative">
                {/* Gradient Masks */}
                <div className="absolute top-0 left-0 h-full w-24 bg-gradient-to-r from-slate-50 to-transparent z-10" />
                <div className="absolute top-0 right-0 h-full w-24 bg-gradient-to-l from-slate-50 to-transparent z-10" />

                <div className="flex gap-16 w-max animate-scroll py-4">
                    {/* Double the list for infinite scroll effect */}
                    {[...references, ...references, ...references].map((ref, index) => (
                        <div
                            key={`${ref.id}-${index}`}
                            className="w-[180px] h-[80px] flex items-center justify-center grayscale hover:grayscale-0 opacity-50 hover:opacity-100 transition-all duration-500 transform hover:scale-110"
                        >
                            <img
                                src={ref.logo}
                                alt={ref.name}
                                className="max-w-full max-h-full object-contain mix-blend-multiply"
                            />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default ReferencesCarousel;
