"use client";

import React, { useState } from 'react';
import { Plus, Trash2, Edit2, Award } from 'lucide-react';

interface Certificate {
    id: number;
    title: string;
    description: string;
}

export default function CertificatesPage() {
    const [certificates, setCertificates] = useState<Certificate[]>([
        { id: 1, title: 'ISO 9001 - 2000', description: 'Kalite Yönetim Sistemi' },
        { id: 2, title: 'ISO 14001', description: 'Çevre Yönetim Sistemi' },
        { id: 3, title: 'OHSAS 18001', description: 'İşçi Sağlığı ve Güvenliği' },
        { id: 4, title: 'IQ SCC-HYB', description: 'Hizmet Yeterlilik Belgesi' },
        { id: 5, title: 'TSE', description: 'Türk Standartlarına Uygunluk' },
        { id: 6, title: 'Yerli Malı Belgesi', description: 'Yerli Üretim Sertifikası' },
    ]);

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 mb-2">Belgeler</h1>
                    <p className="text-slate-500">Kalite ve yetki belgelerinizi yönetin</p>
                </div>
                <button
                    className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-xl flex items-center gap-2 transition-colors shadow-lg shadow-primary-500/20 font-semibold"
                >
                    <Plus size={20} />
                    Yeni Belge Ekle
                </button>
            </div>

            {/* Certificates Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {certificates.map((cert) => (
                    <div key={cert.id} className="bg-white border border-slate-200 rounded-2xl p-6 hover:shadow-lg transition-all group">
                        <div className="flex items-start justify-between mb-4">
                            <div className="w-14 h-14 bg-primary-100 text-primary-600 rounded-xl flex items-center justify-center">
                                <Award size={28} />
                            </div>
                            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors">
                                    <Edit2 size={16} />
                                </button>
                                <button className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors">
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        </div>
                        <h3 className="text-lg font-bold text-slate-800 mb-2">{cert.title}</h3>
                        <p className="text-sm text-slate-500">{cert.description}</p>
                    </div>
                ))}

                {/* Add New Card */}
                <button className="border-2 border-dashed border-slate-300 rounded-2xl p-6 hover:bg-slate-50 hover:border-primary-500 transition-all group flex flex-col items-center justify-center min-h-[180px]">
                    <div className="w-14 h-14 bg-slate-100 text-slate-400 group-hover:bg-primary-100 group-hover:text-primary-600 rounded-xl flex items-center justify-center mb-3 transition-colors">
                        <Plus size={28} />
                    </div>
                    <span className="text-slate-500 font-semibold group-hover:text-primary-600 transition-colors">Yeni Belge Ekle</span>
                </button>
            </div>
        </div>
    );
}
