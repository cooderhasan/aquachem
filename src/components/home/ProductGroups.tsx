"use client";

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { categories } from '@/data/mockData';

const ProductGroups = () => {
    return (
        <section className="py-20 bg-slate-50">
            <div className="container-custom">
                <div className="text-center mb-16">
                    <span className="inline-block bg-primary-100 text-primary-700 text-sm font-bold px-4 py-1.5 rounded-full mb-4 uppercase tracking-wider">Kapsamlı Çözümler</span>
                    <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Ürün Gruplarımız</h2>
                    <p className="text-slate-600 max-w-2xl mx-auto text-lg">
                        Endüstriyel ve bireysel ihtiyaçlarınız için özel olarak formüle edilmiş geniş ürün yelpazemiz.
                    </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {categories.map((cat, index) => (
                        <motion.div
                            key={cat.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.05 }}
                            whileHover={{ y: -5 }}
                        >
                            <Link href={`/products/${cat.slug}`} className="group block h-full">
                                <div className="bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 h-full border border-slate-100 overflow-hidden flex flex-col">

                                    {/* Image Area */}
                                    <div className="relative h-48 overflow-hidden">
                                        <img
                                            src={cat.image}
                                            alt={cat.title}
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent"></div>

                                        {/* Icon floating on image */}
                                        <div className={`absolute bottom-4 left-4 w-10 h-10 ${cat.color} rounded-lg flex items-center justify-center text-white shadow-lg`}>
                                            <cat.icon size={20} />
                                        </div>
                                    </div>

                                    {/* Content Area */}
                                    <div className="p-6 flex-1 flex flex-col justify-between">
                                        <h3 className="text-lg font-bold text-slate-800 mb-2 transition-colors">
                                            {cat.title}
                                        </h3>

                                        <div className="flex items-center text-sm font-medium text-slate-400 transition-colors mt-4">
                                            <span>Ürünleri İncele</span>
                                            <ArrowRight size={16} className="ml-2 transform group-hover:translate-x-1 transition-transform" />
                                        </div>
                                    </div>

                                </div>
                            </Link>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default ProductGroups;

