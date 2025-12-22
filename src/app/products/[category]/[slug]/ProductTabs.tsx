"use client";

import React, { useState } from 'react';
import { Info, MapPin, CheckCircle2 } from 'lucide-react';

interface ProductTabsProps {
    description: string;
    usageArea?: string;
    features?: string[];
}

export default function ProductTabs({ description, usageArea, features }: ProductTabsProps) {
    const [activeTab, setActiveTab] = useState<'desc' | 'usage'>('desc');

    return (
        <>
            {/* Tabs */}
            <div className="flex border-b border-slate-200 mb-8">
                <button
                    onClick={() => setActiveTab('desc')}
                    className={`flex items-center gap-2 px-6 py-3 font-medium border-b-2 transition-colors ${activeTab === 'desc' ? 'border-primary-600 text-primary-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
                >
                    <Info size={18} />
                    Ürün Açıklaması
                </button>
                <button
                    onClick={() => setActiveTab('usage')}
                    className={`flex items-center gap-2 px-6 py-3 font-medium border-b-2 transition-colors ${activeTab === 'usage' ? 'border-primary-600 text-primary-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
                >
                    <MapPin size={18} />
                    Kullanım Alanları
                </button>
            </div>

            {/* Tab Content */}
            <div className="prose prose-slate max-w-none mb-10 h-[300px] overflow-y-auto pr-4 scrollbar-thin scrollbar-thumb-slate-200">
                {activeTab === 'desc' && (
                    <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                        <p className="whitespace-pre-line leading-relaxed text-slate-600">
                            {description}
                        </p>
                        {features && features.length > 0 && (
                            <ul className="mt-6 space-y-3 list-none p-0">
                                {features.map((feature, idx) => (
                                    <li key={idx} className="flex items-center gap-3 text-slate-700">
                                        <CheckCircle2 className="text-green-500 shrink-0" size={20} />
                                        {feature}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                )}

                {activeTab === 'usage' && (
                    <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                        <p className="whitespace-pre-line leading-relaxed text-slate-600 bg-slate-50 p-6 rounded-xl border border-slate-100">
                            {usageArea || "Bu ürün için kullanım alanı bilgisi bulunmamaktadır."}
                        </p>
                    </div>
                )}
            </div>
        </>
    );
}
