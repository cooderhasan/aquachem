import React from 'react';
import Link from 'next/link';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { getStats, deleteStat } from './actions';

export const dynamic = 'force-dynamic';

export default async function StatsPage() {
    const stats = await getStats();

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">İstatistikler</h1>
                    <p className="text-slate-500">Anasayfada görünen istatistikleri buradan yönetebilirsiniz.</p>
                </div>
                <Link
                    href="/admin/stats/new"
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
                            <th className="px-6 py-4 font-semibold text-slate-700 w-20">Sıra</th>
                            <th className="px-6 py-4 font-semibold text-slate-700">Değer</th>
                            <th className="px-6 py-4 font-semibold text-slate-700">Etiket</th>
                            <th className="px-6 py-4 font-semibold text-slate-700 w-32">İkon</th>
                            <th className="px-6 py-4 font-semibold text-slate-700 w-32 text-right">İşlemler</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {stats.length > 0 ? (
                            stats.map((item) => (
                                <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                                    <td className="px-6 py-4 text-slate-500 font-mono text-sm">{item.order}</td>
                                    <td className="px-6 py-4 text-slate-800 font-bold">{item.value}</td>
                                    <td className="px-6 py-4 text-slate-600">{item.label}</td>
                                    <td className="px-6 py-4 text-slate-500 font-mono text-xs">{item.icon}</td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <Link
                                                href={`/admin/stats/${item.id}`}
                                                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                title="Düzenle"
                                            >
                                                <Edit size={18} />
                                            </Link>
                                            <form action={async () => {
                                                'use server';
                                                await deleteStat(item.id);
                                            }}>
                                                <button
                                                    type="submit"
                                                    className="p-2 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                                                    title="Sil"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </form>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                                    Henüz hiç istatistik eklenmemiş.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
