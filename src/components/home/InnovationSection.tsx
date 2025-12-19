"use client";

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FlaskConical, Lightbulb, TrendingUp, ArrowUpRight } from 'lucide-react';

const InnovationSection = () => {
    return (
        <section className="py-16 bg-white relative overflow-hidden">
            {/* Background Decorations */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-20 -left-20 w-96 h-96 bg-primary-100/50 rounded-full blur-3xl" />
                <div className="absolute bottom-20 -right-20 w-96 h-96 bg-blue-100/50 rounded-full blur-3xl" />
            </div>

            <div className="container-custom relative z-10">
                {/* Section Header */}
                <div className="text-center mb-20 max-w-3xl mx-auto">
                    <span className="inline-block bg-white text-primary-700 text-sm font-bold px-6 py-2 rounded-full mb-6 uppercase tracking-wider shadow-sm border border-slate-100">
                        Sürekli Gelişim
                    </span>
                    <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6 tracking-tight">
                        AR-GE ve İnovasyon <span className="text-primary-600">Vizyonumuz</span>
                    </h2>
                    <p className="text-slate-600 text-lg leading-relaxed">
                        Sektördeki standartları belirleyen, yenilikçi ve sürdürülebilir çözümlerimizle geleceği bugünden tasarlıyoruz.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* AR-GE Card */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                        className="group relative bg-white rounded-[2rem] p-8 md:p-10 shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden hover:shadow-2xl hover:shadow-blue-900/10 transition-all duration-500"
                    >
                        {/* Hover Gradient Background */}
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                        {/* Number Watermark */}
                        <div className="absolute top-4 right-8 text-9xl font-bold text-slate-50 opacity-[0.03] group-hover:opacity-[0.06] transition-opacity select-none font-sans">
                            01
                        </div>

                        <div className="relative z-10">
                            {/* Icon */}
                            <div className="w-16 h-16 bg-blue-600 text-white rounded-2xl flex items-center justify-center mb-8 shadow-lg shadow-blue-500/30 group-hover:scale-110 group-hover:-rotate-3 transition-transform duration-500">
                                <FlaskConical size={32} />
                            </div>

                            <h3 className="text-2xl font-bold text-slate-900 mb-4 group-hover:text-blue-600 transition-colors">
                                AR-GE Çalışmaları
                            </h3>

                            <div className="h-1 w-12 bg-blue-100 rounded-full mb-6 group-hover:w-20 group-hover:bg-blue-600 transition-all duration-500" />

                            <p className="text-slate-600 leading-relaxed mb-8">
                                Bünyemizdeki profesyonel ekiplerle sürekli araştırma ve geliştirme yaparak, karşılaşılan sorunlara en etkili bilimsel çözümleri üretiyoruz.
                            </p>

                            <Link href="/corporate/innovation#arge" className="flex items-center text-blue-600 font-bold group/btn cursor-pointer">
                                <span className="mr-2">İncele</span>
                                <ArrowUpRight size={20} className="transform group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform" />
                            </Link>
                        </div>
                    </motion.div>

                    {/* ÜR-GE Card */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        className="group relative bg-white rounded-[2rem] p-8 md:p-10 shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden hover:shadow-2xl hover:shadow-amber-900/10 transition-all duration-500"
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-amber-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                        <div className="absolute top-4 right-8 text-9xl font-bold text-slate-50 opacity-[0.03] group-hover:opacity-[0.06] transition-opacity select-none font-sans">
                            02
                        </div>

                        <div className="relative z-10">
                            <div className="w-16 h-16 bg-amber-500 text-white rounded-2xl flex items-center justify-center mb-8 shadow-lg shadow-amber-500/30 group-hover:scale-110 group-hover:-rotate-3 transition-transform duration-500">
                                <Lightbulb size={32} />
                            </div>

                            <h3 className="text-2xl font-bold text-slate-900 mb-4 group-hover:text-amber-600 transition-colors">
                                ÜR-GE Süreçleri
                            </h3>

                            <div className="h-1 w-12 bg-amber-100 rounded-full mb-6 group-hover:w-20 group-hover:bg-amber-500 transition-all duration-500" />

                            <p className="text-slate-600 leading-relaxed mb-8">
                                Standart kalıpların dışına çıkarak, otomotivden havacılığa her sektör için tamamen müşteriye özel formüller ve ürünler geliştiriyoruz.
                            </p>

                            <Link href="/corporate/innovation#urge" className="flex items-center text-amber-600 font-bold group/btn cursor-pointer">
                                <span className="mr-2">İncele</span>
                                <ArrowUpRight size={20} className="transform group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform" />
                            </Link>
                        </div>
                    </motion.div>

                    {/* İNOVASYON Card */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="group relative bg-white rounded-[2rem] p-8 md:p-10 shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden hover:shadow-2xl hover:shadow-purple-900/10 transition-all duration-500"
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-purple-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                        <div className="absolute top-4 right-8 text-9xl font-bold text-slate-50 opacity-[0.03] group-hover:opacity-[0.06] transition-opacity select-none font-sans">
                            03
                        </div>

                        <div className="relative z-10">
                            <div className="w-16 h-16 bg-purple-600 text-white rounded-2xl flex items-center justify-center mb-8 shadow-lg shadow-purple-500/30 group-hover:scale-110 group-hover:-rotate-3 transition-transform duration-500">
                                <TrendingUp size={32} />
                            </div>

                            <h3 className="text-2xl font-bold text-slate-900 mb-4 group-hover:text-purple-600 transition-colors">
                                İnovasyon Kültürü
                            </h3>

                            <div className="h-1 w-12 bg-purple-100 rounded-full mb-6 group-hover:w-20 group-hover:bg-purple-600 transition-all duration-500" />

                            <p className="text-slate-600 leading-relaxed mb-8">
                                Değişen rekabet ortamına uyum sağlamak için üretim yöntemlerimizi ve hizmetlerimizi sürekli yeniliyor, gelişimi bir kültür haline getiriyoruz.
                            </p>

                            <Link href="/corporate/innovation#inovasyon" className="flex items-center text-purple-600 font-bold group/btn cursor-pointer">
                                <span className="mr-2">İncele</span>
                                <ArrowUpRight size={20} className="transform group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform" />
                            </Link>
                        </div>
                    </motion.div>

                </div>
            </div>
        </section>
    );
};

export default InnovationSection;
