"use client";

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FlaskConical, Lightbulb, TrendingUp, ArrowUpRight, LucideIcon } from 'lucide-react';

interface InnovationItem {
    id: number;
    title: string;
    description: string;
    watermarkText: string | null;
}

interface InnovationSectionProps {
    items: InnovationItem[];
}

const InnovationSection = ({ items }: InnovationSectionProps) => {
    // Icons map based on index or title keywords if we wanted dynamic icons, 
    // but for now we cycle through base icons or map specific ones.
    // Since admin doesn't select icon yet, we preserve the design's 3 distinct styles by index.

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
                    {items.length > 0 ? (
                        items.map((item, index) => {
                            // Dynamic styling based on index (cycling through Blue, Amber, Purple)
                            const styles = [
                                {
                                    bg: 'bg-blue-600',
                                    shadow: 'shadow-blue-500/30',
                                    hoverText: 'group-hover:text-blue-600',
                                    lineBg: 'bg-blue-100',
                                    lineHover: 'group-hover:bg-blue-600',
                                    btnText: 'text-blue-600',
                                    gradient: 'from-blue-50',
                                    hoverShadow: 'hover:shadow-blue-900/10',
                                    Icon: FlaskConical
                                },
                                {
                                    bg: 'bg-amber-500',
                                    shadow: 'shadow-amber-500/30',
                                    hoverText: 'group-hover:text-amber-600',
                                    lineBg: 'bg-amber-100',
                                    lineHover: 'group-hover:bg-amber-500',
                                    btnText: 'text-amber-600',
                                    gradient: 'from-amber-50',
                                    hoverShadow: 'hover:shadow-amber-900/10',
                                    Icon: Lightbulb
                                },
                                {
                                    bg: 'bg-purple-600',
                                    shadow: 'shadow-purple-500/30',
                                    hoverText: 'group-hover:text-purple-600',
                                    lineBg: 'bg-purple-100',
                                    lineHover: 'group-hover:bg-purple-600',
                                    btnText: 'text-purple-600',
                                    gradient: 'from-purple-50',
                                    hoverShadow: 'hover:shadow-purple-900/10',
                                    Icon: TrendingUp
                                }
                            ];

                            const style = styles[index % styles.length];
                            const Icon = style.Icon;

                            return (
                                <motion.div
                                    key={item.id}
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.5, delay: index * 0.1 }}
                                    className={`group relative bg-white rounded-[2rem] p-8 md:p-10 shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden hover:shadow-2xl ${style.hoverShadow} transition-all duration-500`}
                                >
                                    {/* Hover Gradient Background */}
                                    <div className={`absolute inset-0 bg-gradient-to-br ${style.gradient} to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />

                                    {/* Number Watermark */}
                                    <div className="absolute top-4 right-8 text-9xl font-bold text-slate-50 opacity-[0.03] group-hover:opacity-[0.06] transition-opacity select-none font-sans">
                                        {item.watermarkText || `0${index + 1}`}
                                    </div>

                                    <div className="relative z-10">
                                        {/* Icon */}
                                        <div className={`w-16 h-16 ${style.bg} text-white rounded-2xl flex items-center justify-center mb-8 shadow-lg ${style.shadow} group-hover:scale-110 group-hover:-rotate-3 transition-transform duration-500`}>
                                            <Icon size={32} />
                                        </div>

                                        <h3 className={`text-2xl font-bold text-slate-900 mb-4 ${style.hoverText} transition-colors`}>
                                            {item.title}
                                        </h3>

                                        <div className={`h-1 w-12 ${style.lineBg} rounded-full mb-6 group-hover:w-20 ${style.lineHover} transition-all duration-500`} />

                                        <p className="text-slate-600 leading-relaxed mb-8">
                                            {item.description}
                                        </p>

                                        <Link href="/corporate/innovation" className={`flex items-center ${style.btnText} font-bold group/btn cursor-pointer`}>
                                            <span className="mr-2">İncele</span>
                                            <ArrowUpRight size={20} className="transform group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform" />
                                        </Link>
                                    </div>
                                </motion.div>
                            );
                        })
                    ) : (
                        <div className="col-span-3 text-center text-slate-500 py-10">
                            Henüz inovasyon içeriği eklenmemiş.
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
};

export default InnovationSection;
