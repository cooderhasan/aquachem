"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, Users, Package, Award, LucideIcon, Target } from 'lucide-react';

interface Stat {
    id: number;
    label: string;
    value: string;
    icon: string;
}

interface StatsSectionProps {
    stats: Stat[];
}

const StatsSection = ({ stats }: StatsSectionProps) => {
    // Helper to get icon by name (fallback to Target)
    const getIcon = (name: string): LucideIcon => {
        const icons: { [key: string]: LucideIcon } = {
            Calendar, Users, Package, Award, Target
        };
        return icons[name] || Target;
    };

    const displayStats = stats.length > 0 ? stats : [];

    return (
        <section className="py-16 bg-slate-900 relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
                <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] bg-primary-900/30 rounded-full blur-3xl rounded-full" />
                <div className="absolute top-[40%] -right-[10%] w-[40%] h-[60%] bg-blue-900/20 rounded-full blur-3xl" />
            </div>

            <div className="container-custom relative z-10">
                {/* Section Header */}
                <div className="text-center mb-16">
                    <motion.span
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="inline-block bg-white/10 backdrop-blur-sm text-white text-sm font-bold px-4 py-1.5 rounded-full mb-4 uppercase tracking-wider border border-white/10"
                    >
                        Rakamlarla Biz
                    </motion.span>
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-3xl md:text-4xl font-bold text-white mb-4"
                    >
                        Güvenilir İş Ortağınız
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="text-slate-400 max-w-2xl mx-auto text-lg"
                    >
                        Yılların deneyimi ve binlerce mutlu müşteri ile sektörde öncü konumdayız
                    </motion.p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                    {displayStats.map((stat, index) => {
                        const Icon = getIcon(stat.icon);
                        // Cycle gradients for variety
                        const gradients = [
                            'from-blue-600 to-blue-400',
                            'from-emerald-600 to-emerald-400',
                            'from-amber-500 to-amber-300',
                            'from-purple-600 to-purple-400'
                        ];
                        const gradient = gradients[index % gradients.length];

                        return (
                            <motion.div
                                key={stat.id}
                                initial={{ opacity: 0, scale: 0.9 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.4, delay: index * 0.1 }}
                                whileHover={{ y: -10 }}
                                className="relative group"
                            >
                                <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-white/5 rounded-2xl blur-sm transform group-hover:scale-105 transition-transform duration-500" />

                                <div className="relative bg-white/5 backdrop-blur-md border border-white/10 p-8 rounded-2xl h-full flex flex-col items-center justify-center text-center hover:border-white/20 transition-colors">
                                    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${gradient} flex items-center justify-center mb-6 shadow-lg shadow-black/20 group-hover:scale-110 transition-transform duration-500`}>
                                        <Icon size={32} className="text-white" />
                                    </div>

                                    <div className="text-4xl md:text-5xl font-bold text-white mb-2 tracking-tight">
                                        {stat.value}
                                    </div>

                                    <div className="text-sm font-semibold text-slate-400 uppercase tracking-wider group-hover:text-white transition-colors">
                                        {stat.label}
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};

export default StatsSection;
