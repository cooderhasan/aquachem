import React from 'react';
import Link from 'next/link';
import { ArrowLeft, CheckCircle2 } from 'lucide-react';

export default function ProductDetailPage({ params }: { params: { slug: string[] } }) {
    // In a real app, we would fetch data based on params.slug

    return (
        <div className="bg-white min-h-screen pb-20">
            <div className="bg-slate-100 py-8 border-b border-slate-200">
                <div className="container-custom flex items-center gap-4">
                    <Link href="/products" className="flex items-center text-slate-500 hover:text-primary-600 font-medium transition-colors">
                        <ArrowLeft size={20} className="mr-2" />
                        Tüm Ürünlere Dön
                    </Link>
                    <span className="text-slate-300">/</span>
                    <span className="text-slate-800 font-bold">Örnek Ürün Detayı</span>
                </div>
            </div>

            <div className="container-custom py-12">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* Image Gallery */}
                    <div className="bg-slate-50 rounded-2xl border border-slate-200 aspect-square flex items-center justify-center">
                        <span className="text-slate-400 font-medium">Ürün Görseli</span>
                    </div>

                    {/* Info */}
                    <div>
                        <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">Endüstriyel Temizleyici X</h1>
                        <p className="text-slate-600 text-lg leading-relaxed mb-8">
                            Bu kısımda ürünün detaylı açıklaması yer alacak. Ürünlerimiz insana ve doğaya zarar vermeden üstün temizlik sağlar.
                            Özel formülü sayesinde zorlu kirleri kolayca çıkarır.
                        </p>

                        <div className="space-y-8">
                            <div>
                                <h3 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
                                    <span className="w-8 h-8 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center text-sm">1</span>
                                    Ürün Özellikleri
                                </h3>
                                <ul className="space-y-3 pl-10">
                                    <li className="flex items-center gap-2 text-slate-700">
                                        <CheckCircle2 size={18} className="text-green-500" />
                                        Doğa dostu formül
                                    </li>
                                    <li className="flex items-center gap-2 text-slate-700">
                                        <CheckCircle2 size={18} className="text-green-500" />
                                        Yüksek performanslı temizlik
                                    </li>
                                </ul>
                            </div>

                            <div>
                                <h3 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
                                    <span className="w-8 h-8 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center text-sm">2</span>
                                    Kullanım Şekli
                                </h3>
                                <p className="text-slate-600 leading-relaxed pl-10">
                                    Kirli yüzeye uygulayın ve bir süre bekleyin. Ardından temiz bir bez veya sünger yardımıyla silin.
                                    Durulama gerektirmez.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
