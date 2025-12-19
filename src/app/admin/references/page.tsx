"use client";

import React, { useState } from 'react';
import { Plus, Trash2, Upload } from 'lucide-react';

export default function ReferencesPage() {
    const [references, setReferences] = useState([]);

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-2xl font-bold text-slate-800">Referanslar</h1>
                <button
                    className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                >
                    <Plus size={20} />
                    Yeni Ekle
                </button>
            </div>

            {/* Grid of Logos */}
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
                {/* Upload Card */}
                <div className="border-2 border-dashed border-slate-300 rounded-xl aspect-video flex flex-col items-center justify-center hover:bg-slate-50 transition-colors cursor-pointer group text-slate-400 hover:text-primary-500 hover:border-primary-300">
                    <Upload size={32} className="mb-2" />
                    <span className="text-sm font-medium">Hızlı Yükle</span>
                </div>

                {/* Empty State / Placeholders */}
                {[1, 2, 3].map((i) => (
                    <div key={i} className="bg-white border border-slate-200 rounded-xl aspect-video flex items-center justify-center p-4 relative group">
                        <span className="text-slate-300 font-bold text-xl">LOGO {i}</span>
                        <button className="absolute top-2 right-2 bg-red-100 text-red-500 p-1.5 rounded-md opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-200">
                            <Trash2 size={16} />
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}
