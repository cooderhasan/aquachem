"use client";

import React from 'react';
import Link from 'next/link';
import { Plus, Trash2, Edit, FileText } from 'lucide-react';

export default function PostsPage() {
    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-2xl font-bold text-slate-800">Haberler & Yazılar</h1>
                <Link
                    href="/admin/posts/new"
                    className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                >
                    <Plus size={20} />
                    Yeni Ekle
                </Link>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-slate-50 border-b border-slate-200">
                        <tr>
                            <th className="p-4 font-semibold text-slate-600 w-20">ID</th>
                            <th className="p-4 font-semibold text-slate-600">Başlık</th>
                            <th className="p-4 font-semibold text-slate-600">Tarih</th>
                            <th className="p-4 font-semibold text-slate-600">Tür</th>
                            <th className="p-4 font-semibold text-slate-600 text-right">İşlemler</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {/* Empty State */}
                        <tr>
                            <td colSpan={5} className="p-8 text-center text-slate-500 flex flex-col items-center">
                                <FileText size={48} className="text-slate-200 mb-4" />
                                <p>Henüz haber veya duyuru eklenmemiş.</p>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
}
