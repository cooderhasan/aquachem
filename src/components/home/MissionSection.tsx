"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Leaf, Smile, Radio, ArrowRight, CheckCircle2 } from 'lucide-react';

const MissionSection = () => {
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

                    {/* Card 1 */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                        className="group flex flex-col bg-white rounded-[2rem] p-3 shadow-xl shadow-slate-200/50 hover:shadow-2xl hover:shadow-emerald-900/10 transition-all duration-500 border border-slate-100"
                    >
                        <div className="relative h-64 rounded-[1.5rem] overflow-hidden mb-6">
                            <div className="absolute inset-0 bg-emerald-900/10 group-hover:bg-emerald-900/0 transition-colors z-10" />
                            <img
                                src="https://images.unsplash.com/photo-1473448912268-2022ce9509d8?q=80&w=800&auto=format&fit=crop"
                                alt="Environment"
                                className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                            />
                            <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md p-3 rounded-2xl z-20 shadow-lg">
                                <Leaf className="text-emerald-600" size={24} />
                            </div>
                        </div>

                        <div className="px-4 pb-6 flex-1 flex flex-col">
                            <h3 className="text-2xl font-bold text-slate-900 mb-3 group-hover:text-emerald-700 transition-colors">Çevre Bilinci</h3>
                            <p className="text-slate-600 leading-relaxed mb-6">
                                Ürünlerimizde çevre dostu formüller kullanarak, gelecek nesillere temiz bir dünya bırakıyoruz.
                            </p>

                            <ul className="mt-auto space-y-2 mb-6">
                                <li className="flex items-center text-sm text-slate-500">
                                    <CheckCircle2 size={16} className="text-emerald-500 mr-2" />
                                    Doğa dostu ham maddeler
                                </li>
                                <li className="flex items-center text-sm text-slate-500">
                                    <CheckCircle2 size={16} className="text-emerald-500 mr-2" />
                                    Sürdürülebilir üretim
                                </li>
                            </ul>


                        </div>
                    </motion.div>

                    {/* Card 2 */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        className="group flex flex-col bg-white rounded-[2rem] p-3 shadow-xl shadow-slate-200/50 hover:shadow-2xl hover:shadow-blue-900/10 transition-all duration-500 border border-slate-100"
                    >
                        <div className="relative h-64 rounded-[1.5rem] overflow-hidden mb-6">
                            <div className="absolute inset-0 bg-blue-900/10 group-hover:bg-blue-900/0 transition-colors z-10" />
                            <img
                                src="https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?q=80&w=800&auto=format&fit=crop"
                                alt="Happiness"
                                className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                            />
                            <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md p-3 rounded-2xl z-20 shadow-lg">
                                <Smile className="text-blue-600" size={24} />
                            </div>
                        </div>

                        <div className="px-4 pb-6 flex-1 flex flex-col">
                            <h3 className="text-2xl font-bold text-slate-900 mb-3 group-hover:text-blue-700 transition-colors">İnsan Odaklı</h3>
                            <p className="text-slate-600 leading-relaxed mb-6">
                                İnsan sağlığını her zaman ön planda tutarak, güvenli ve etkili çözümler sunuyoruz.
                            </p>

                            <ul className="mt-auto space-y-2 mb-6">
                                <li className="flex items-center text-sm text-slate-500">
                                    <CheckCircle2 size={16} className="text-blue-500 mr-2" />
                                    %100 Müşteri Memnuniyeti
                                </li>
                                <li className="flex items-center text-sm text-slate-500">
                                    <CheckCircle2 size={16} className="text-blue-500 mr-2" />
                                    Sağlık odaklı yaklaşım
                                </li>
                            </ul>


                        </div>
                    </motion.div>

                    {/* Card 3 */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="group flex flex-col bg-white rounded-[2rem] p-3 shadow-xl shadow-slate-200/50 hover:shadow-2xl hover:shadow-purple-900/10 transition-all duration-500 border border-slate-100"
                    >
                        <div className="relative h-64 rounded-[1.5rem] overflow-hidden mb-6">
                            <div className="absolute inset-0 bg-purple-900/10 group-hover:bg-purple-900/0 transition-colors z-10" />
                            <img
                                src="https://images.unsplash.com/photo-1532601224476-15c79f2f7a51?q=80&w=800&auto=format&fit=crop"
                                alt="Innovation"
                                className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                            />
                            <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md p-3 rounded-2xl z-20 shadow-lg">
                                <Radio className="text-purple-600" size={24} />
                            </div>
                        </div>

                        <div className="px-4 pb-6 flex-1 flex flex-col">
                            <h3 className="text-2xl font-bold text-slate-900 mb-3 group-hover:text-purple-700 transition-colors">İnovatif Üretim</h3>
                            <p className="text-slate-600 leading-relaxed mb-6">
                                Ar-Ge laboratuvarlarımızda geliştirdiğimiz yeni nesil teknolojilerle sektöre yön veriyoruz.
                            </p>

                            <ul className="mt-auto space-y-2 mb-6">
                                <li className="flex items-center text-sm text-slate-500">
                                    <CheckCircle2 size={16} className="text-purple-500 mr-2" />
                                    Modern laboratuvarlar
                                </li>
                                <li className="flex items-center text-sm text-slate-500">
                                    <CheckCircle2 size={16} className="text-purple-500 mr-2" />
                                    Sürekli gelişim
                                </li>
                            </ul>


                        </div>
                    </motion.div>

                </div>
            </div>
        </section>
    );
};

export default MissionSection;
