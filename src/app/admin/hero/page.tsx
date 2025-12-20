import Link from 'next/link';
import { Plus, Pencil, Trash2, Eye, EyeOff } from 'lucide-react';
import { getHeroSlides, deleteHeroSlide } from './actions';

export const dynamic = 'force-dynamic';

export default async function HeroPage() {
    const slides = await getHeroSlides();

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-2xl font-bold text-slate-800">Hero Slider Yönetimi</h1>
                <Link
                    href="/admin/hero/new"
                    className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                >
                    <Plus size={20} />
                    Yeni Slide Ekle
                </Link>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-slate-50 border-b border-slate-200">
                        <tr>
                            <th className="p-4 font-semibold text-slate-600">Sıra</th>
                            <th className="p-4 font-semibold text-slate-600">Görsel</th>
                            <th className="p-4 font-semibold text-slate-600">Başlık</th>
                            <th className="p-4 font-semibold text-slate-600">Buton</th>
                            <th className="p-4 font-semibold text-slate-600">Durum</th>
                            <th className="p-4 font-semibold text-slate-600 text-right">İşlemler</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {slides.length === 0 ? (
                            <tr>
                                <td colSpan={6} className="p-8 text-center text-slate-500">
                                    Henüz slide eklenmemiş.
                                </td>
                            </tr>
                        ) : (
                            slides.map((slide) => (
                                <tr key={slide.id} className="hover:bg-slate-50 transition-colors">
                                    <td className="p-4 text-slate-600 font-mono">{slide.order}</td>
                                    <td className="p-4">
                                        <div className="w-24 h-16 rounded-lg bg-slate-100 overflow-hidden relative">
                                            <img
                                                src={slide.image}
                                                alt={slide.title}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                    </td>
                                    <td className="p-4 font-medium text-slate-800">
                                        <div>{slide.title}</div>
                                        {slide.description && (
                                            <div className="text-xs text-slate-500 truncate max-w-[200px]">{slide.description}</div>
                                        )}
                                    </td>
                                    <td className="p-4 text-slate-600">
                                        {slide.buttonText ? (
                                            <span className="px-2 py-1 bg-slate-100 rounded text-xs">
                                                {slide.buttonText} → {slide.link}
                                            </span>
                                        ) : (
                                            <span className="text-slate-400">-</span>
                                        )}
                                    </td>
                                    <td className="p-4">
                                        {slide.isActive ? (
                                            <span className="flex items-center gap-1 text-emerald-600 text-sm font-medium">
                                                <Eye size={14} />
                                                Aktif
                                            </span>
                                        ) : (
                                            <span className="flex items-center gap-1 text-slate-400 text-sm font-medium">
                                                <EyeOff size={14} />
                                                Pasif
                                            </span>
                                        )}
                                    </td>
                                    <td className="p-4 text-right">
                                        <div className="flex justify-end gap-2">
                                            <Link href={`/admin/hero/${slide.id}`} className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                                                <Pencil size={18} />
                                            </Link>
                                            <form action={async () => {
                                                'use server';
                                                await deleteHeroSlide(slide.id);
                                            }}>
                                                <button className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                                                    <Trash2 size={18} />
                                                </button>
                                            </form>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
