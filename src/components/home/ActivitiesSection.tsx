"use client";

import React from 'react';
import Link from 'next/link';
import { CheckCircle2, FileDown, Newspaper } from 'lucide-react';

interface Activity {
    id: number;
    title: string;
    isActive: boolean | null;
}

interface ActivitiesSectionProps {
    activities: Activity[];
    catalogUrl?: string | null;
}

const ActivitiesSection = ({ activities, catalogUrl }: ActivitiesSectionProps) => {
    // Filter active items if needed, or assume server returns all and we filter here
    const activeActivities = activities.filter(a => a.isActive !== false);

    return (
        <section className="py-20 bg-slate-50">
            <div className="container-custom">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">

                    {/* Column 1: Faaliyet Alanlarımız (Wider - 2 cols on LG) */}
                    <div className="lg:col-span-2 bg-white rounded-xl shadow-sm p-8 border border-slate-200">
                        <h3 className="text-2xl font-bold text-slate-800 mb-6 border-b pb-4">Faaliyet Alanlarımız</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {activeActivities.length > 0 ? (
                                activeActivities.map((item) => (
                                    <div key={item.id} className="flex items-start gap-2">
                                        <CheckCircle2 size={20} className="text-primary-500 shrink-0 mt-0.5" />
                                        <span className="text-slate-600 text-sm">{item.title}</span>
                                    </div>
                                ))
                            ) : (
                                <p className="text-slate-500 text-sm">Faaliyet alanı bulunamadı.</p>
                            )}
                        </div>
                    </div>

                    {/* Column 2: Bizden Haberler */}
                    <div className="lg:col-span-1 bg-white rounded-xl shadow-sm p-8 border border-slate-200">
                        <h3 className="text-2xl font-bold text-slate-800 mb-6 border-b pb-4 flex items-center gap-2">
                            <Newspaper size={24} className="text-primary-500" />
                            Bizden Haberler
                        </h3>
                        <div className="space-y-4">
                            <div className="group cursor-pointer">
                                <span className="text-xs text-primary-500 font-bold block mb-1">18 Aralık 2025</span>
                                <p className="text-slate-700 font-medium group-hover:text-primary-600 transition-colors">
                                    Yeni üretim tesisimiz faaliyete geçti.
                                </p>
                            </div>
                            <hr className="border-slate-100" />
                            <div className="group cursor-pointer">
                                <span className="text-xs text-primary-500 font-bold block mb-1">15 Kasım 2025</span>
                                <p className="text-slate-700 font-medium group-hover:text-primary-600 transition-colors">
                                    ISO 14001 Çevre Yönetim Sistemi sertifikamızı yeniledik.
                                </p>
                            </div>
                            <Link href="/news" className="inline-block mt-4 text-sm text-primary-600 font-bold hover:underline">
                                Tüm Haberler &rarr;
                            </Link>
                        </div>
                    </div>

                    {/* Column 3: Online Katalog */}
                    <div className="lg:col-span-1 bg-primary-600 rounded-xl shadow-lg p-8 text-white flex flex-col items-center justify-center text-center">
                        <div className="bg-white/10 p-4 rounded-full mb-6">
                            <FileDown size={48} />
                        </div>
                        <h3 className="text-2xl font-bold mb-4">E-Katalog</h3>
                        <p className="text-primary-100 mb-8 text-sm">
                            Güncel ürün kataloğumuzu PDF formatında cihazınıza indirebilirsiniz.
                        </p>
                        {catalogUrl ? (
                            <a
                                href={catalogUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="bg-white text-primary-600 px-6 py-3 rounded-full font-bold hover:bg-primary-50 transition-colors w-full inline-block"
                            >
                                Kataloğu İndir
                            </a>
                        ) : (
                            <button className="bg-white/50 text-white/50 px-6 py-3 rounded-full font-bold cursor-not-allowed w-full">
                                Katalog Bulunamadı
                            </button>
                        )}
                    </div>

                </div>
            </div>
        </section>
    );
};

export default ActivitiesSection;
