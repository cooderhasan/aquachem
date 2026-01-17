"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Leaf, Smile, Radio, ArrowRight, CheckCircle2 } from 'lucide-react';

const MissionSection = ({ cards = [] }: { cards?: any[] }) => {

    const iconMap: any = {
        'Leaf': Leaf,
        'Smile': Smile,
        'Radio': Radio,
        'TrendingUp': Radio // Fallback or alias
    };

    // If no cards provided (or empty), fallback to hardcoded (or better, show nothing? better show hardcoded as safety but we seeded DB)
    // Actually, if cards provided, use them.
    const displayCards = cards && cards.length > 0 ? cards : [];

    return (
        <section className="py-12 bg-gradient-to-b from-white to-slate-50 overflow-hidden">
            <div className="container-custom">
                {/* Section Header */}
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <motion.span
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="inline-block text-primary-600 font-bold tracking-wider uppercase text-sm mb-3"
                    >
                        Değerlerimiz & Yaklaşımımız
                    </motion.span>
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="mb-6"
                    >
                        <h2 className="text-4xl md:text-5xl font-bold text-slate-900 leading-tight mb-2">
                            İnsana ve Doğaya
                        </h2>
                        <div className="relative inline-block">
                            <span className="relative z-10 text-4xl md:text-5xl font-bold text-slate-900">Saygılıyız</span>
                            <div className="absolute bottom-2 left-0 w-full h-3 bg-primary-100/50 -z-10 rounded-full" />
                        </div>
                    </motion.div>
                    <motion.p
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="text-slate-600 text-lg leading-relaxed"
                    >
                        Kalitemiz, sürdürülebilirlik anlayışımız ve inovasyona olan bağlılığımızla sektörde fark yaratmaya devam ediyoruz.
                    </motion.p>
                </div>

                {/* Main Content */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {displayCards.length > 0 ? (
                        displayCards.map((card, index) => {
                            const IconComponent = iconMap[card.icon] || Leaf;
                            // Colors based on index for variety
                            const colors = [
                                { bg: 'bg-emerald-900', text: 'text-emerald-600', hoverText: 'group-hover:text-emerald-700', iconColor: 'text-emerald-500' },
                                { bg: 'bg-blue-900', text: 'text-blue-600', hoverText: 'group-hover:text-blue-700', iconColor: 'text-blue-500' },
                                { bg: 'bg-purple-900', text: 'text-purple-600', hoverText: 'group-hover:text-purple-700', iconColor: 'text-purple-500' }
                            ];
                            const color = colors[index % colors.length];

                            // Features handling (could be string array or json)
                            const features = Array.isArray(card.features) ? card.features : [];

                            return (
                                <motion.div
                                    key={card.id || index}
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.5, delay: index * 0.1 }}
                                    className="group flex flex-col bg-white rounded-[2rem] p-3 shadow-xl shadow-slate-200/50 hover:shadow-2xl hover:shadow-emerald-900/10 transition-all duration-500 border border-slate-100"
                                >
                                    <div className="relative h-64 rounded-[1.5rem] overflow-hidden mb-6">
                                        <div className={`absolute inset-0 ${color.bg}/10 group-hover:${color.bg}/0 transition-colors z-10`} />
                                        <img
                                            src={card.image || 'https://images.unsplash.com/photo-1473448912268-2022ce9509d8?q=80&w=800&auto=format&fit=crop'}
                                            alt={card.title}
                                            className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                                        />
                                        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md p-3 rounded-2xl z-20 shadow-lg">
                                            <IconComponent className={color.text} size={24} />
                                        </div>
                                    </div>

                                    <div className="px-4 pb-6 flex-1 flex flex-col">
                                        <h3 className={`text-2xl font-bold text-slate-900 mb-3 transition-colors ${color.hoverText}`}>{card.title}</h3>
                                        <p className="text-slate-600 leading-relaxed mb-6">
                                            {card.description}
                                        </p>

                                        {features.length > 0 && (
                                            <ul className="mt-auto space-y-2 mb-6">
                                                {features.map((feature: string, idx: number) => (
                                                    <li key={idx} className="flex items-center text-sm text-slate-500">
                                                        <CheckCircle2 size={16} className={`${color.iconColor} mr-2`} />
                                                        {feature}
                                                    </li>
                                                ))}
                                            </ul>
                                        )}
                                    </div>
                                </motion.div>
                            );
                        })
                    ) : (
                        // Fallback logic if needed, but displayCards logic above handles it
                        <div className="col-span-3 text-center text-slate-500">İçerik bulunamadı.</div>
                    )}
                </div>
            </div>
        </section>
    );
};

export default MissionSection;
